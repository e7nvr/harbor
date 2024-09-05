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
import {
    PoseLandmarker,
    PoseLandmarkerOptions,
    PoseLandmarkerResult,
    NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import * as THREE from "three";
import { Object3D, Object3DEventMap, Vector3 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

const PoseRecognition = (() => {
    const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";

    const CONFIG_MIN_POSE_DETECTION_CONFIDENCE: number = 0;
    const CONFIG_MAX_POSE_DETECTION_CONFIDENCE: number = 1;
    const CONFIG_MIN_POSE_PRESENCE_CONFIDENCE: number = 0;
    const CONFIG_MAX_POSE_PRESENCE_CONFIDENCE: number = 1;
    const CONFIG_MIN_TRACKING_CONFIDENCE: number = 0;
    const CONFIG_MAX_TRACKING_CONFIDENCE: number = 1;
    const CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP: number = 0.1;

    const BASE_SCALE: number = 0.25;
    const SCALE_FACTOR: number = 4;
    const CIRCLE_RADIUS: number = 1;
    const CIRCLE_SEGMENTS: number = 1;



    let numPoses: number = 1;
    let minPoseDetectionConfidence: number = 0.5;
    let minPosePresenceConfidence: number = 0.5;
    let minTrackingConfidence: number = 0.5;
    let delegate: InterfaceDelegate = DELEGATE_GPU;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;

    let isUpdating: boolean = false;

    let poseLandmarker: PoseLandmarker;

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: POSE_RECOGNITION_STR,
            mode: POSE_RECOGNITION_MODE,
            loadResult: false,
        };

        if (poseLandmarker) {
            result.loadResult = true;
            return result;
        }

        try {
            if (vision) {
                const config: PoseLandmarkerOptions = getConfig();

                poseLandmarker = await PoseLandmarker.createFromOptions(
                    vision,
                    config
                );

                result.loadResult = true;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
        }

        return result;
    };

    const getConfig = (): PoseLandmarkerOptions => {
        const config: PoseLandmarkerOptions = {
            baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: delegate,
            },
            numPoses: numPoses,
            minPoseDetectionConfidence: minPoseDetectionConfidence,
            minPosePresenceConfidence: minPosePresenceConfidence,
            minTrackingConfidence: minTrackingConfidence,
            runningMode: runningMode,
        };

        return config;
    };

    // Add getter and setter methods for configuration options

    const isModelUpdating = (): boolean => isUpdating;
    const updateModelConfig = async () => {
        if (poseLandmarker) {
            isUpdating = true;
            await poseLandmarker.setOptions(getConfig());
            isUpdating = false;
        }
    };

    const detectPose = (
        video: HTMLVideoElement
    ): PoseLandmarkerResult | null => {
        if (poseLandmarker) {
            try {

                const detection = poseLandmarker.detectForVideo(
                    video,
                    performance.now()
                );
                return detection;
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                    console.log(error);
                }
            }
        }

        return null;
    };

    const draw = (
        mirrored: boolean,
        results: PoseLandmarkerResult | null | undefined,
        width: number,
        height: number
    ) => {
        if (results && results.landmarks) {
            Drawing3d.clearScene();
            const objGroup: Object3D<Object3DEventMap> = new Object3D();
            const jointGroup: Object3D<Object3DEventMap> = new Object3D();

            const offsetX: number = width / 2;
            const offsetY: number = height / 2;
            const dist = Drawing3d.calculateDistance(height);

            results.landmarks.forEach((pose: NormalizedLandmark[], index: number) => {
                // Draw connections between landmarks
                const connections = [
                    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
                    [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], // Torso
                    [27, 29], [27, 31], [28, 30], [28, 32], // Legs
                    [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8] // Face
                ];

                connections.forEach(([start, end]) => {
                    const startPoint = pose[start];
                    const endPoint = pose[end];
                    
                    const x1 = (width * startPoint.x - offsetX) * (mirrored ? -1 : 1);
                    const y1 = -height * startPoint.y + offsetY;
                    const x2 = (width * endPoint.x - offsetX) * (mirrored ? -1 : 1);
                    const y2 = -height * endPoint.y + offsetY;
                    
                    const points = [
                        new THREE.Vector3(x1, y1, dist),
                        new THREE.Vector3(x2, y2, dist)
                    ];

                    const bufferGeo = new THREE.BufferGeometry().setFromPoints(points);
                    const geo = new LineGeometry().setPositions(
                        bufferGeo.getAttribute("position").array as Float32Array
                    );

                    const material = new LineMaterial({
                        color: 0x00ff00, // Green color for pose
                        linewidth: 3,
                        alphaToCoverage: true,
                        worldUnits: false,
                    });

                    const line = new Line2(geo, material);
                    jointGroup.add(line);
                });

                // Draw landmarks
                pose.forEach((landmark: NormalizedLandmark, idx: number) => {
                    const circleObjGroup = new THREE.Object3D();

                    const x = (width * landmark.x - offsetX) * (mirrored ? -1 : 1);
                    const y = -height * landmark.y + offsetY;
                    const scaleFactor = ((dist * landmark.z) / dist) * -SCALE_FACTOR + BASE_SCALE;

                    const circleGeo = new THREE.CircleGeometry(CIRCLE_RADIUS, CIRCLE_SEGMENTS);
                    const circleMat = new THREE.MeshBasicMaterial({
                        depthTest: true,
                        depthWrite: true,
                        color: 0xff0000, // Red color for landmarks
                        side: THREE.DoubleSide,
                    });
                    const circle = new THREE.Mesh(circleGeo, circleMat);

                    circleObjGroup.add(circle);
                    circleObjGroup.position.set(x, y, dist);
                    circleObjGroup.scale.set(scaleFactor, scaleFactor, 1);
                    objGroup.add(circleObjGroup);
                });
            });

            Drawing3d.addToScene(jointGroup);
            Drawing3d.addToScene(objGroup);
            Drawing3d.render();
        }
    };

    return {
        CONFIG_POSE_MIN_DETECTION_CONFIDENCE: CONFIG_MIN_POSE_DETECTION_CONFIDENCE,
        CONFIG_POSE_MAX_DETECTION_CONFIDENCE: CONFIG_MAX_POSE_DETECTION_CONFIDENCE,
        CONFIG_POSE_MIN_PRESENCE_CONFIDENCE: CONFIG_MIN_POSE_PRESENCE_CONFIDENCE,
        CONFIG_POSE_MAX_PRESENCE_CONFIDENCE: CONFIG_MAX_POSE_PRESENCE_CONFIDENCE,
        CONFIG_POSE_MIN_TRACKING_CONFIDENCE: CONFIG_MIN_TRACKING_CONFIDENCE,
        CONFIG_POSE_MAX_TRACKING_CONFIDENCE: CONFIG_MAX_TRACKING_CONFIDENCE,
        CONFIG_POSE_DEFAULT_CONFIDENCE_SLIDER_STEP: CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP,
        initModel,
        detectPose,
        isModelUpdating,
        updateModelConfig,
        // Add other getter and setter methods
        draw,
    };
})();

export default PoseRecognition;
