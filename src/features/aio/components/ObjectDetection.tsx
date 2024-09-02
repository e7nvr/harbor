"use client";

import {cn} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";

import {DetectedObject, load as cocoSsdLoad, ObjectDetection} from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

import Webcam from "react-webcam";
import {DetectionHistory, renderPredictions, setDetectionRegion} from "@/features/aio/utils/canvas-utils";
import { DetectionToolbox, DetectionSettings } from "./DetectionToolbox";
import { DetectionWidget } from "./DetectionWidget";

const ObjectDetectionScreen = () => {

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
    const [detectionHistory, setDetectionHistory] = useState<DetectionHistory[]>([]);
    const [currentStatus, setCurrentStatus] = useState("No detection");
    const [detectedObjects, setDetectedObjects] = useState(0);
    const [settings, setSettings] = useState<DetectionSettings>({
        threshold: 0.9,
        historySize: 20,
        inferenceFrequency: 300,
    });

    async function detect(net: ObjectDetection) {
        if (
            canvasRef.current &&
            webcamRef.current !== null &&
            webcamRef.current?.video?.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            setDetectionRegion(videoWidth, videoHeight);

            const detectedObjects = await net.detect(
                webcamRef.current.video,
                undefined,
                0.5
            );

            const context: CanvasRenderingContext2D | null = canvasRef.current.getContext("2d");
            if (!context) return;
            const result = renderPredictions(detectedObjects, context, settings);
            
            if (result) {
                const { newHistory, newStatus } = result;
                setDetectionHistory(newHistory);
                setCurrentStatus(newStatus);
            }
            
            setDetectedObjects(detectedObjects.length);
        }
    }

    const runCoco = async () => {
        await tf.setBackend('webgl');
        await tf.ready();
        const net = await cocoSsdLoad();
        console.log("Coco model loaded.");
        setIsLoaded(true);

        const detectInterval = setInterval(() => {
            detect(net);
        }, settings.inferenceFrequency);

        return () => clearInterval(detectInterval);
    }

    useEffect(() => {
        const setupCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 3840 },
                    height: { ideal: 2160 },
                },
            });
            if (webcamRef.current) {
                webcamRef.current.video!.srcObject = stream;
                webcamRef.current.video!.onloadedmetadata = () => {
                    setDimensions({
                        width: webcamRef.current!.video!.videoWidth,
                        height: webcamRef.current!.video!.videoHeight
                    });
                };
            }
        };

        setupCamera();
        const cleanupCoco = runCoco();

        return () => {
            cleanupCoco.then(cleanup => cleanup && cleanup());
        };
    }, [settings.inferenceFrequency]);

    const handleSettingsChange = (newSettings: DetectionSettings) => {
        setSettings(newSettings);
    };

    if (!isLoaded) {
        return (
            <div className={cn("mt-0 w-full h-full bg-white/50")}>
                <div className={" bg-white/50 relative w-full h-full flex justify-center items-center gradient p-1.5 rounded-md"}>
                    <div className={"flex items-center justify-items-center "}>
                        <h4 className={"gradient"}> Loading...</h4>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className={cn("mt-0 relative")}>
            <div className={"relative w-full flex justify-center items-center gradient p-1.5 rounded-md"}>
                {/* webcam */}
                <Webcam
                    ref={webcamRef}
                    className={cn("rounded-md")}
                    width={dimensions.width}
                    height={dimensions.height}
                    screenshotFormat="image/jpeg"
                    audio={false} muted
                />
                {/* canvas */}
                <canvas
                    ref={canvasRef}
                    className={cn("absolute rounded-md ")}
                    width={dimensions.width}
                    height={dimensions.height}
                />
            </div>
            <div className="absolute mt-[-5rem] py-2 px-4 w-full bg-accent/10 flex space-x-4">
                <DetectionToolbox onSettingsChange={handleSettingsChange} />
                <DetectionWidget
                    detectionHistory={detectionHistory}
                    currentStatus={currentStatus}
                    detectedObjects={detectedObjects}
                />
            </div>
        </div>
    );
}

export default ObjectDetectionScreen;