"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Camera, Upload, FlipHorizontalIcon, InfoIcon } from "lucide-react";
import { Vertex, Detection } from '../domain/types';
import { ZoneEditor } from './ZoneEditor';
import { CameraView } from './CameraView';
import { PictureView } from './PictureView';
import { VideoView } from './VideoView';
import { PolygonOverlay } from "./PolygonOverlay";
import { DetectionOverlay } from './DetectionOverlay';
import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

type MediaMode = 'camera' | 'picture' | 'video' | null;

const ZoneAlarmScreen: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [mediaMode, setMediaMode] = useState<MediaMode>(null);
    const [currentPolygon, setCurrentPolygon] = useState<Vertex[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
    const [mirrored, setMirrored] = useState(true);
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [showInfo, setShowInfo] = useState(false);

    const handleEditorClose = () => {
        setIsEditing(false);
    };

    const handlePolygonSave = (polygon: Vertex[]) => {
        setCurrentPolygon(polygon);
        setIsEditing(false);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMediaMode(file.type.startsWith('image/') ? 'picture' : 'video');
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleMediaClose = () => {
        setMediaMode(null);
        setSelectedFile(null);
    };

    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await cocossd.load({
                base: 'mobilenet_v2'
            });
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    useEffect(() => {
        if (!model || !videoRef.current || mediaMode !== 'video') return;

        const detectFrame = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                const video = videoRef.current;
                setVideoSize({ width: video.videoWidth, height: video.videoHeight });

                const predictions = await model.detect(video);
                const newDetections: Detection[] = predictions.map(pred => ({
                    id: Math.random().toString(),
                    x: pred.bbox[0],
                    y: pred.bbox[1],
                    width: pred.bbox[2],
                    height: pred.bbox[3],
                    confidence: pred.score,
                    class: pred.class  // Añadimos la clase aquí
                }));
                setDetections(newDetections);
            }
            requestAnimationFrame(detectFrame);
        };

        detectFrame();
    }, [model, mediaMode]);

    useEffect(() => {
        const updateContainerSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);

        return () => window.removeEventListener('resize', updateContainerSize);
    }, []);

    const memoizedVideoView = useMemo(() => {
        if (mediaMode === 'video' && selectedFile) {
            return (
                <VideoView
                    file={selectedFile}
                    onClose={handleMediaClose}
                    videoRef={videoRef}
                />
            );
        }
        return null;
    }, [mediaMode, selectedFile]);

    return (
        <div className={cn("relative flex h-screen")}>
            <div ref={containerRef} className={cn("relative flex-1")}>
                {mediaMode === 'camera' && <CameraView onClose={handleMediaClose} />}
                {mediaMode === 'picture' && selectedFile && (
                    <PictureView file={selectedFile} onClose={handleMediaClose} />
                )}
                {memoizedVideoView}
                {!isEditing && mediaMode && (
                    <>
                        <PolygonOverlay 
                            polygon={currentPolygon} 
                            opacity={0.3} 
                            filterRed={true}
                        />
                        {videoSize.width > 0 && videoSize.height > 0 && (
                            <DetectionOverlay 
                                detections={detections}
                                videoWidth={videoSize.width}
                                videoHeight={videoSize.height}
                                mirrored={mirrored}
                                containerWidth={containerSize.width}
                                containerHeight={containerSize.height}
                                zonePolygon={currentPolygon} // Pasamos el polígono de la zona
                            />
                        )}
                    </>
                )}
                {isEditing && (
                    <ZoneEditor
                        onClose={handleEditorClose}
                        initialPolygon={currentPolygon}
                        onSave={handlePolygonSave}
                    />
                )}
                {/* Flotante con título y descripción */}
                <div className={cn(
                    "absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg",
                    "transition-opacity duration-300 max-w-md",
                    showInfo ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    <h2 className="text-xl font-bold mb-2">🎨🔔 Lienzo de Alarmas</h2>
                    <p className="mb-2">Pinta zonas, detecta gente 🖌️🚶‍♀️</p>
                    <p>
                        Aquí puedes dibujar zonas (🖌️✏️🖍️) y detectar personas (👀🕵️‍♀️🔍) en esas áreas, 
                        todo mientras usas cámara o video (📹🎥). ¡Conviértete en el artista de la seguridad!
                    </p>
                </div>

                {/* Botón de información */}
                <Button
                    className="absolute top-4 right-4"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <InfoIcon />
                </Button>
            </div>

            <div className={cn("flex flex-col gap-2 p-4 border-l border-gray-200 dark:border-gray-700")}>
                <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "secondary" : "default"}
                >
                    <Pencil className="mr-2 h-4 w-4" /> {isEditing ? "Finalizar edición" : "Dibujar"}
                </Button>
                <Button 
                    onClick={() => setMediaMode('camera')}
                    disabled={mediaMode === 'camera'}
                >
                    <Camera className="mr-2 h-4 w-4" /> Cámara
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <Button 
                    onClick={handleUploadClick}
                    disabled={mediaMode === 'picture' || mediaMode === 'video'}
                >
                    <Upload className="mr-2 h-4 w-4" /> Subir archivo
                </Button>
                <Button 
                    onClick={() => setMirrored(prev => !prev)}
                    variant="outline"
                    size="icon"
                >
                    <FlipHorizontalIcon />
                </Button>
            </div>
        </div>
    );
};

export { ZoneAlarmScreen };
