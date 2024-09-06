"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Camera, Upload } from "lucide-react";
import { Vertex } from '../domain/types';
import { ZoneEditor } from './ZoneEditor';
import { CameraView } from './CameraView';
import { PictureView } from './PictureView';
import { VideoView } from './VideoView';
import { PolygonOverlay } from "@/features/zone-alarm/components/PolygonOverlay";

type MediaMode = 'camera' | 'picture' | 'video' | null;

const ZoneAlarmScreen: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [mediaMode, setMediaMode] = useState<MediaMode>(null);
    const [currentPolygon, setCurrentPolygon] = useState<Vertex[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <div className={cn("relative flex h-screen")}>
            <div className={cn("relative flex-1")}>
                {mediaMode === 'camera' && <CameraView onClose={handleMediaClose} />}
                {mediaMode === 'picture' && selectedFile && (
                    <PictureView file={selectedFile} onClose={handleMediaClose} />
                )}
                {mediaMode === 'video' && selectedFile && (
                    <VideoView file={selectedFile} onClose={handleMediaClose} />
                )}
                {!isEditing && <PolygonOverlay polygon={currentPolygon} />}
                {isEditing && (
                    <ZoneEditor
                        onClose={handleEditorClose}
                        initialPolygon={currentPolygon}
                        onSave={handlePolygonSave}
                    />
                )}
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
            </div>
        </div>
    );
};

export { ZoneAlarmScreen };
