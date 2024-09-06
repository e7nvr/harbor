"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Camera, Upload } from "lucide-react";
import { ScreenState, Vertex } from '../domain/types';
import { ZoneEditor } from './ZoneEditor';
import { CameraView } from './CameraView';
import { PictureView } from './PictureView';
import { VideoView } from './VideoView';

const ZoneAlarmScreen: React.FC = () => {
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.Idle);
    const [currentPolygon, setCurrentPolygon] = useState<Vertex[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleStateChange = (newState: ScreenState) => {
        setScreenState(newState);
    };

    const handleEditorClose = () => {
        setScreenState(ScreenState.Idle);
        setSelectedFile(null);
    };

    const handlePolygonSave = (polygon: Vertex[]) => {
        setCurrentPolygon(polygon);
        setScreenState(ScreenState.Idle);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                setScreenState(ScreenState.Picture);
            } else if (file.type.startsWith('video/')) {
                setScreenState(ScreenState.Video);
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("relative flex h-screen")}>
            <div className={cn("relative flex-1")}>
                {screenState === ScreenState.Drawing && (
                    <ZoneEditor
                        onClose={handleEditorClose}
                        initialState={screenState}
                        initialPolygon={currentPolygon}
                        onSave={handlePolygonSave}
                    />
                )}
                {screenState === ScreenState.Idle && currentPolygon.length > 0 && (
                    <svg className="w-full h-full">
                        <polygon
                            points={currentPolygon.map(v => `${v.x},${v.y}`).join(' ')}
                            fill="rgba(0, 0, 255, 0.2)"
                            stroke="blue"
                            strokeWidth={2}
                        />
                    </svg>
                )}
                {screenState === ScreenState.Camera && (
                    <CameraView onClose={handleEditorClose} />
                )}
                {screenState === ScreenState.Picture && selectedFile && (
                    <PictureView file={selectedFile} onClose={handleEditorClose} />
                )}
                {screenState === ScreenState.Video && selectedFile && (
                    <VideoView file={selectedFile} onClose={handleEditorClose} />
                )}
            </div>
            <div className={cn("flex flex-col gap-2 p-4 border-l border-gray-200 dark:border-gray-700")}>
                <Button 
                    onClick={() => handleStateChange(ScreenState.Drawing)}
                    disabled={screenState !== ScreenState.Idle}
                >
                    <Pencil className="mr-2 h-4 w-4" /> Dibujar
                </Button>
                <Button 
                    onClick={() => handleStateChange(ScreenState.Camera)}
                    disabled={screenState !== ScreenState.Idle}
                >
                    <Camera className="mr-2 h-4 w-4" /> Cámara
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={screenState !== ScreenState.Idle}
                />
                <Button 
                    onClick={handleUploadClick}
                    disabled={screenState !== ScreenState.Idle}
                >
                    <Upload className="mr-2 h-4 w-4" /> Subir archivo
                </Button>
            </div>
        </div>
    );
};

export { ZoneAlarmScreen };
