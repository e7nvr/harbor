"use client";

import {cn} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";

import {load as cocoSsdLoad} from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

import Webcam from "react-webcam";
import {renderPredictions} from "@/features/aiod/utils/canvas-utils";

const ObjectDetection = () => {

    const webcamRef = useRef();
    const canvasRef = useRef();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVideSizeSet, setIsVideoSizeSet] = useState(false);



    async function detect(net: ObjectDetection) {
        if (
            canvasRef.current &&
            webcamRef.current !== null &&
            webcamRef.current?.video?.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const width = video.videoWidth;
            const height = video.videoHeight;

            webcamRef.current.video.width = width;
            webcamRef.current.video.heigth = height;

            canvasRef.current.width = width;
            canvasRef.current.height = height;

            const detectedObjects = await net.detect(
                webcamRef.current.video,
                undefined,
                0.5
            );

            const context = canvasRef.current.getContext("2d");
            renderPredictions(detectedObjects, context);
        }
    }

    const runCoco = async () => {
        // Error: No backend found in registry.
        await tf.setBackend('webgl');
        await tf.ready();
        const net = await cocoSsdLoad();
        console.log("Coco model loaded.");
        setIsLoaded(true);

        const detectInterval =  setInterval(() => {
            detect(net);
        }, 300); // every 50ms
    }

    const showVideo = () => {
        console.log("showing video");
        if (webcamRef.current !== null && webcamRef.current?.video && webcamRef.current.video?.readyState === 4) {
            const video = webcamRef.current.video;
            const width = video.videoWidth;
            const height = video.videoHeight;

            webcamRef.current.video.width = width;
            webcamRef.current.video.heigth = height;
        } else {
            console.log("no webcamRef.current");
        }
    }

    useEffect(() => {
        console.log("useEffect");
        runCoco();
        showVideo();

        return () => {
            console.log("cleanup");
        }
    }, [])

    if (!isLoaded) {
        return (
            <div className={cn("mt-8 w-full h-full bg-yellow-200")}>
                <div className={" bg-yellow-200 relative w-full h-full flex justify-center items-center gradient p-1.5 rounded-md"}>
                    <div className={"flex items-center justify-items-center "}>
                        <h4 className={"gradient"}> Loading...</h4>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className={cn("mt-8")}>
            <div className={"relative w-full flex justify-center items-center gradient p-1.5 rounded-md"}>
                {/* webcam */}
                <Webcam
                    ref={webcamRef}
                    className={cn("rounded-md lg:h-[720p] content-center ")}
                    width={1280} height={720}
                    screenshotFormat="image/jpeg"
                    audio={false} muted
                />
                {/* canvas */}
                <canvas
                    ref={canvasRef}
                    className={cn("absolute rounded-md top-0 lg:h-[720p] border-2 border-blue-500")}
                    width="1280" height="720"
                />
            </div>
        </div>
    );
}

export default ObjectDetection;