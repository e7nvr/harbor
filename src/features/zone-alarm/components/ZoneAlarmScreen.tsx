"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Edit2, Hand, Check } from "lucide-react";
import { EditorState, ScreenState } from '../domain/types';
import { usePolygonEditor } from '../hooks/usePolygonEditor';
import FloatingToolbar from './editor/FloatingToolbar';
import { savePolygon as savePolygonService } from '../services/polygonService';
import { toast } from "@/components/ui/use-toast";

const ZoneAlarmScreen: React.FC = () => {
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.Idle);
    const [isSaving, setIsSaving] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false); // New state

    const {
        polygon,
        editorState,
        setEditorState,
        handleCanvasClick,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        resetPolygon,
        isPolygonComplete,
        setIsPolygonComplete // Add this if not already present in usePolygonEditor
    } = usePolygonEditor();

    const getMousePosition = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const savePolygon = async () => {
        if (!isPolygonComplete) {
            toast({
                title: "Error",
                description: "El polígono no está completo",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            await savePolygonService(polygon);
            toast({
                title: "Éxito",
                description: "Polígono guardado correctamente",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo guardar el polígono",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getPolygonStyle = () => {
        switch (editorState) {
            case EditorState.Editing:
                return { fill: "rgba(255, 0, 0, 0.2)", stroke: "red", strokeWidth: 2 };
            case EditorState.Moving:
                return { fill: "rgba(0, 255, 0, 0.2)", stroke: "green", strokeWidth: 2 };
            default:
                return { fill: "rgba(0, 0, 255, 0.2)", stroke: "blue", strokeWidth: 1 };
        }
    };

    const handleStateChange = (newState: ScreenState) => {
        setScreenState(newState);
        setShowToolbar(true); // Always show toolbar when changing state
        switch (newState) {
            case ScreenState.Drawing:
                setEditorState(EditorState.Drawing);
                break;
            case ScreenState.Editing:
                setEditorState(EditorState.Editing);
                break;
            case ScreenState.Moving:
                setEditorState(EditorState.Moving);
                break;
            case ScreenState.Detecting:
                // Logic for object detection
                break;
            case ScreenState.Idle:
                setEditorState(EditorState.Idle);
                setShowToolbar(false); // Hide toolbar in Idle state
                break;
        }
    };

    const handleCloseToolbar = () => {
        handleStateChange(ScreenState.Idle);
        // Don't reset polygon completion state when closing the toolbar
        // setIsPolygonComplete(false); // Remove this line
    };

    return (
        <div className={cn("relative flex h-screen")}>
            <div className={cn("relative flex-1")}>
                <svg
                    className="w-full h-full"
                    onClick={(e) => handleCanvasClick(getMousePosition(e))}
                    onMouseMove={(e) => handleMouseMove(getMousePosition(e))}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {polygon.length > 2 && (
                        <polygon
                            points={polygon.map(v => `${v.x},${v.y}`).join(' ')}
                            {...getPolygonStyle()}
                            onMouseDown={(e: any) => handleMouseDown(getMousePosition(e))}
                            style={{ cursor: editorState === EditorState.Moving ? 'move' : 'default' }}
                        />
                    )}
                    {polygon.map((vertex, index) => (
                        <circle
                            key={index}
                            cx={vertex.x}
                            cy={vertex.y}
                            r={5}
                            fill={editorState === EditorState.Editing ? "red" : "blue"}
                            onMouseDown={(e: any) => {
                                handleMouseDown(getMousePosition(e), index);
                            }}
                            style={{ cursor: editorState === EditorState.Editing ? 'move' : 'default' }}
                        />
                    ))}
                </svg>
                {showToolbar && (
                    <FloatingToolbar 
                        onClose={handleCloseToolbar}
                        setEditorState={setEditorState}
                        resetPolygon={resetPolygon}
                        savePolygon={savePolygon}
                        editorState={editorState}
                        isPolygonComplete={isPolygonComplete || polygon.length > 2}
                        isSaving={isSaving}
                    />
                )}
            </div>
            <div className={cn("flex flex-col gap-2 p-4 border-l border-gray-200 dark:border-gray-700")}>
                <Button 
                    onClick={() => {
                        setEditorState(EditorState.Drawing);
                        handleStateChange(ScreenState.Drawing);
                    }} 
                    disabled={screenState !== ScreenState.Idle}
                >
                    <Pencil className="mr-2 h-4 w-4" /> Dibujar
                </Button>
            </div>
        </div>
    );
};

export { ZoneAlarmScreen };
