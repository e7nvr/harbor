"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Edit2, Hand } from "lucide-react";
import { ScreenState, Vertex } from '../domain/types';
import { ZoneEditor } from './ZoneEditor';

const ZoneAlarmScreen: React.FC = () => {
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.Idle);
    const [currentPolygon, setCurrentPolygon] = useState<Vertex[]>([]);

    const handleStateChange = (newState: ScreenState) => {
        setScreenState(newState);
    };

    const handleEditorClose = () => {
        setScreenState(ScreenState.Idle);
    };

    const handlePolygonSave = (polygon: Vertex[]) => {
        setCurrentPolygon(polygon);
        setScreenState(ScreenState.Idle);
    };

    return (
        <div className={cn("relative flex h-screen")}>
            <div className={cn("relative flex-1")}>
                {screenState !== ScreenState.Idle && (
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
            </div>
            <div className={cn("flex flex-col gap-2 p-4 border-l border-gray-200 dark:border-gray-700")}>
                <Button 
                    onClick={() => handleStateChange(ScreenState.Drawing)}
                    disabled={screenState !== ScreenState.Idle}
                >
                    <Pencil className="mr-2 h-4 w-4" /> Dibujar
                </Button>
                {/*
                <Button 
                    onClick={() => handleStateChange(ScreenState.Editing)}
                    disabled={screenState !== ScreenState.Idle || currentPolygon.length === 0}
                >
                    <Edit2 className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button 
                    onClick={() => handleStateChange(ScreenState.Moving)}
                    disabled={screenState !== ScreenState.Idle || currentPolygon.length === 0}
                >
                    <Hand className="mr-2 h-4 w-4" /> Mover
                </Button>
                */}
            </div>
        </div>
    );
};

export { ZoneAlarmScreen };
