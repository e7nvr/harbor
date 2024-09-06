"use client";

import {cn} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";

import {load as cocoSsdLoad, ObjectDetection} from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

import Webcam from "react-webcam";
import {renderPredictions, setDetectionRegion} from "@/features/aio/utils/canvas-utils";
import { DetectionSettings } from "./DetectionToolbox";
import React from 'react';
import { Button } from "@/components/ui/button";
import { InfoIcon, FlipHorizontalIcon, VolumeX, Volume2 } from "lucide-react";

const ObjectDetectionScreen: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const settings : DetectionSettings = {
        threshold: 0.9,
        historySize: 20,
        inferenceFrequency: 300,
    };
    const [mirrored, setMirrored] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const [muted, setMuted] = useState(false);

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
            renderPredictions(detectedObjects, context, settings);
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


    const setupCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 3840 },
                height: { ideal: 2160 },
            },
        });
        if (webcamRef.current) {
            webcamRef.current.video!.srcObject = stream;
        }
    };

    useEffect(() => {
        setupCamera();
        const cleanupCoco = runCoco();

        return () => {
            cleanupCoco.then(cleanup => cleanup && cleanup());
        };
    }, [settings.inferenceFrequency]);

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

    const toggleMute = () => {
        setMuted(!muted);
    };


    return (
        <div className={cn("relative flex h-screen")}>
            {/* Left division - container for webcam and canvas */}
            <div className={cn("relative")}>
                <div className={cn("relative h-screen w-full")}>
                    <Webcam
                        ref={webcamRef}
                        mirrored={mirrored}
                        className={cn("h-full w-full object-contain p-2")}
                    />
                    <canvas
                        ref={canvasRef}
                        className={cn("absolute top-0 left-0 h-full w-full object-contain")}
                    />
                </div>
            </div>

            {/* Right division */}
            <div className={cn("flex flex-row flex-1")}>
            </div>

            {/* Flotante con información de Zona Segura AIO */}
            <div className={cn(
                "absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg",
                "transition-opacity duration-300 max-w-md z-50",
                showInfo ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <h2 className="text-xl font-bold mb-2">🛡️ AIO: Zona Segura</h2>
                <p className="mb-2">Mantén el control con detección inteligente 🚨👀</p>
                <p>
                    Esta herramienta te permite:
                </p>
                <ul className="list-disc list-inside mt-2">
                    <li>Definir una zona segura en la pantalla 🟩✅</li>
                    <li>Detectar personas en tiempo real 🕵️‍♀️🔍</li>
                    <li>Monitorear el estado de seguridad con colores 🟢🟡🔴</li>
                    <li>Recibir alertas sonoras cuando alguien sale de la zona 🔊⚠️</li>
                    <li>Ajustar la sensibilidad de la detección 🎛️🔧</li>
                </ul>
                <p className="mt-2">
                    ¡Convierte tu cámara en un guardián inteligente y mantén tu espacio seguro! 🦸‍♂️🏠
                </p>
            </div>

            {/* Botón de información */}
            <Button
                className="absolute top-4 right-4 z-50"
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
            >
                <InfoIcon />
            </Button>

            {/* Botón para invertir la imagen */}
            <Button
                className="absolute top-16 right-4 z-50"
                variant="outline"
                size="icon"
                onClick={() => setMirrored(!mirrored)}
            >
                <FlipHorizontalIcon />
            </Button>

            {/* Botón de mute */}
            <Button
                className="absolute top-28 right-4 z-50"
                variant="outline"
                size="icon"
                onClick={toggleMute}
            >
                {muted ? <VolumeX /> : <Volume2 />}
            </Button>

            {/* Resto del contenido */}
            {/* ... */}
        </div>
    );
}

export default ObjectDetectionScreen;