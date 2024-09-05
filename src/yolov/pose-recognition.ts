import Drawing3d from "@/lib/Drawing3d";
import {
    DELEGATE_GPU,
    POSE_RECOGNITION_MODE,
    POSE_RECOGNITION_STR,
    InterfaceDelegate,
    ModelLoadResult,
    RUNNING_MODE_VIDEO,
    RunningMode,
} from "@/utils/definitions";
import * as THREE from "three";
import { Object3D, Object3DEventMap } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import * as tf from "@tensorflow/tfjs";

const PoseRecognitionYOLO = (() => {
    const MODEL_URL = "/models/yolov8n-pose_web_model2/model.json";

    const CONFIG_MIN_SCORE_THRESHOLD: number = 0;
    const CONFIG_MAX_SCORE_THRESHOLD: number = 1;
    const CONFIG_DEFAULT_SCORE_THRESHOLD: number = 0.45;
    const CONFIG_DEFAULT_IOU_THRESHOLD: number = 0.3;

    let scoreThreshold: number = CONFIG_DEFAULT_SCORE_THRESHOLD;
    let iouThreshold: number = CONFIG_DEFAULT_IOU_THRESHOLD;
    let delegate: InterfaceDelegate = DELEGATE_GPU;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;

    let isUpdating: boolean = false;

    let yoloModel: any;

    const colors = {
        nose: "cyan", leftEye: "lime", rightEye: "magenta", leftEar: "yellow", rightEar: "dodgerblue",
        leftShoulder: "hotpink", rightShoulder: "orange", leftElbow: "turquoise", rightElbow: "springgreen",
        leftWrist: "deeppink", rightWrist: "chartreuse", leftHip: "skyblue", rightHip: "coral",
        leftKnee: "mediumspringgreen", rightKnee: "deepskyblue", leftAnkle: "orangered", rightAnkle: "gold"
    };

    const connections = [
        ["nose", "leftEye"], ["nose", "rightEye"], ["leftEye", "leftEar"], ["rightEye", "rightEar"],
        ["leftShoulder", "rightShoulder"], ["leftShoulder", "leftElbow"], ["rightShoulder", "rightElbow"],
        ["leftElbow", "leftWrist"], ["rightElbow", "rightWrist"], ["leftShoulder", "leftHip"],
        ["rightShoulder", "rightHip"], ["leftHip", "rightHip"], ["leftHip", "leftKnee"],
        ["rightHip", "rightKnee"], ["leftKnee", "leftAnkle"], ["rightKnee", "rightAnkle"]
    ];

    const initModel = async (tf: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: POSE_RECOGNITION_STR,
            mode: POSE_RECOGNITION_MODE,
            loadResult: false,
        };

        try {
            if (tf) {
                // console.log("Loading YOLO model from:", MODEL_URL);
                yoloModel = await tf.loadGraphModel(MODEL_URL);
                //console.log("YOLO model loaded successfully");
                const dummyInput = tf.ones(yoloModel.inputs[0].shape);
                const warmupResults = yoloModel.execute(dummyInput);
                tf.dispose([warmupResults, dummyInput]);
                result.loadResult = true;
                // console.log("YOLO model warmed up successfully");
            }
        } catch (error) {
            console.error("Error initializing YOLO model:", error);
        }

        return result;
    };

    const isModelUpdating = (): boolean => isUpdating;

    const updateModelConfig = async () => {
        // Configuration updates can be implemented here if needed
    };

    const preProcessImage = (source: HTMLVideoElement, modelWidth: number, modelHeight: number): [tf.Tensor, number, number] => {
        return tf.tidy(() => {
            const img = tf.browser.fromPixels(source);
            const [h, w] = img.shape.slice(0, 2);
            const maxSize = Math.max(w, h);
            const scale = maxSize / Math.min(w, h);
            const newWidth = Math.round(w * scale);
            const newHeight = Math.round(h * scale);

            // Resize the image to the new dimensions
            const resizedImg = tf.image.resizeBilinear(img, [newHeight, newWidth]);

            // Calculate padding
            const paddingHeight = maxSize - newHeight;
            const paddingWidth = maxSize - newWidth;

            // Pad the image
            const paddedImg = tf.pad(resizedImg, [
                [Math.floor(paddingHeight / 2), Math.ceil(paddingHeight / 2)],
                [Math.floor(paddingWidth / 2), Math.ceil(paddingWidth / 2)],
                [0, 0]
            ]);

            const widthRatio = (maxSize / w) * 1.85;
            const heightRatio = maxSize / h;

            // Resize to model dimensions, normalize, and add batch dimension
            const processedImg = tf.image.resizeBilinear(paddedImg, [modelWidth, modelHeight]);
            const normalizedImg = tf.div(processedImg, tf.scalar(255));
            const batchedImg = normalizedImg.expandDims(0);

            return [
                batchedImg,
                widthRatio,
                heightRatio
            ];
        });
    };

    const detectPose = async (video: HTMLVideoElement): Promise<any> => {
        if (yoloModel) {
            const [modelWidth, modelHeight] = yoloModel.inputs[0].shape.slice(1, 3);
            const [input, widthRatio, heightRatio] = preProcessImage(video, modelWidth, modelHeight);
            
            let boxes, scores, landmarks;
            
            const predictions = yoloModel.execute(input);
            // console.log("Raw predictions shape:", predictions.shape);
            
            const transpose = predictions.transpose([0, 2, 1]);
            // console.log("Transposed predictions shape:", transpose.shape);
            
            [boxes, scores, landmarks] = tf.tidy(() => {
                const boxes = tf.tidy(() => {
                    const w = transpose.slice([0, 0, 2], [-1, -1, 1]);
                    const h = transpose.slice([0, 0, 3], [-1, -1, 1]);
                    const x1 = tf.sub(transpose.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2));
                    const y1 = tf.sub(transpose.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2));
                    return tf.concat([y1, x1, tf.add(y1, h), tf.add(x1, w)], 2).squeeze();
                });
                // console.log("Boxes shape:", boxes.shape);

                const scores = tf.tidy(() => {
                    return transpose.slice([0, 0, 4], [-1, -1, 1]).squeeze();
                });
                // console.log("Scores shape:", scores.shape);

                const landmarks = tf.tidy(() => {
                    return transpose.slice([0, 0, 5], [-1, -1, -1]).squeeze();
                });
                // console.log("Landmarks shape:", landmarks.shape);

                return [boxes, scores, landmarks];
            });

            const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.3);
            // console.log("NMS results:", nms);

            const boxes_data = await boxes.gather(nms, 0).array();
            const scores_data = await scores.gather(nms, 0).array();
            const landmarks_data = await landmarks.gather(nms, 0).array();

            const result = {
                //@ts-ignore
                boxes_data: boxes_data.map(box => box.map((coord, i) => i % 2 === 0 ? coord / modelHeight : coord / modelWidth)),
                scores_data,
                //@ts-ignore
                landmarks_data: landmarks_data.map(landmarks =>
                    landmarks.map((coord: any, i: any) => i % 3 === 0 ? coord / modelWidth : (i % 3 === 1 ? coord / modelHeight : coord))
                ),
                widthRatio,
                heightRatio
            };

            // console.log("Normalized Boxes data:", result.boxes_data);
            // console.log("Scores data:", result.scores_data);
            // console.log("Normalized Landmarks data:", result.landmarks_data);

            tf.dispose([predictions, transpose, boxes, scores, landmarks, nms, input]);

            return result;
        }
        // console.log("YOLO model not initialized");
        return null;
    };

    const draw = (
        mirrored: boolean,
        results: any,
        width: number,
        height: number
    ) => {
        // console.log("Draw function called with dimensions:", width, height);
        
        if (!results || !results.scores_data || results.scores_data.length === 0) {
            // console.log('No detections');
            return;
        }

        Drawing3d.clearScene();
        const objGroup: Object3D<Object3DEventMap> = new Object3D();
        const jointGroup: Object3D<Object3DEventMap> = new Object3D();

        const { landmarks_data, boxes_data, scores_data } = results;

        // console.log("Number of detections:", scores_data.length);
        // console.log("First detection score:", scores_data[0]);
        // console.log("First detection box:", boxes_data[0]);
        // console.log("First detection landmarks:", landmarks_data[0]);

        const scaleFactor = 1.5; // Ajusta este valor para cambiar el tamaño general del esqueleto

        for (let i = 0; i < scores_data.length; ++i) {
            const score = (scores_data[i] * 100).toFixed(1);
            let [y1, x1, y2, x2] = boxes_data[i];
            
            // Ajustamos las coordenadas al tamaño del video
            x1 = x1 * width;
            x2 = x2 * width;
            y1 = y1 * height;
            y2 = y2 * height;

            // console.log(`Detection ${i + 1}: Score = ${score}, Box = [${x1}, ${y1}, ${x2}, ${y2}]`);
            //@ts-ignore
            const keypoints = landmarks_data[i].reduce((acc, _, index) => {
                if (index % 3 === 0) {
                    acc.push([
                        landmarks_data[i][index] * width,
                        landmarks_data[i][index + 1] * height,
                        landmarks_data[i][index + 2]
                    ]);
                }
                return acc;
            }, []);

            // console.log(`Detection ${i + 1} keypoints:`, keypoints);

            // Draw Connections
            connections.forEach(([partA, partB]) => {
                const startPoint = keypoints[Object.keys(colors).indexOf(partA)];
                const endPoint = keypoints[Object.keys(colors).indexOf(partB)];
                
                const x1 = ((startPoint[0] - width / 2) * scaleFactor) * (mirrored ? -1 : 1);
                const y1 = -((startPoint[1] - height / 2) * scaleFactor);
                const x2 = ((endPoint[0] - width / 2) * scaleFactor) * (mirrored ? -1 : 1);
                const y2 = -((endPoint[1] - height / 2) * scaleFactor);
                
                const points = [
                    new THREE.Vector3(x1, y1, 0),
                    new THREE.Vector3(x2, y2, 0)
                ];

                const geometry = new LineGeometry().setPositions(points.flatMap(p => [p.x, p.y, p.z]));
                const material = new LineMaterial({
                    color: 0xffffff,
                    linewidth: 3,
                });
                material.resolution.set(width, height);

                const line = new Line2(geometry, material);
                jointGroup.add(line);
            });

            // Draw Keypoints
            //@ts-ignore
            keypoints.forEach((keypoint, j) => {
                const x = ((keypoint[0] - width / 2) * scaleFactor) * (mirrored ? -1 : 1);
                const y = -((keypoint[1] - height / 2) * scaleFactor);
                const bodyPart = Object.keys(colors)[j];

                const circleGeometry = new THREE.CircleGeometry(5, 32);
                const circleMaterial = new THREE.MeshBasicMaterial({
                    //@ts-ignore
                    color: new THREE.Color(colors[bodyPart]),
                    side: THREE.DoubleSide,
                });
                const circle = new THREE.Mesh(circleGeometry, circleMaterial);
                circle.position.set(x, y, 0);
                objGroup.add(circle);
            });
        }

        Drawing3d.addToScene(jointGroup);
        Drawing3d.addToScene(objGroup);
        Drawing3d.render();
        // console.log("Drawing completed");
    };

    return {
        CONFIG_MIN_SCORE_THRESHOLD,
        CONFIG_MAX_SCORE_THRESHOLD,
        CONFIG_DEFAULT_SCORE_THRESHOLD,
        initModel,
        detectPose,
        isModelUpdating,
        updateModelConfig,
        draw,
    };
})();

export default PoseRecognitionYOLO;