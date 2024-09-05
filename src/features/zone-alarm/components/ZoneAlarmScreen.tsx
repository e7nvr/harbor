"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Edit2, Hand, Check } from "lucide-react";
import { EditorState } from '../domain/types';
import { usePolygonEditor } from '../hooks/usePolygonEditor';

const ZoneAlarmScreen: React.FC = () => {
    const {
        polygon,
        editorState,
        setEditorState,
        handleCanvasClick,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        resetPolygon,
        isPolygonComplete
    } = usePolygonEditor();

    const getMousePosition = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

    // @ts-ignore
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
                    {isPolygonComplete && (
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
            </div>
            <div className={cn("flex flex-col gap-2 p-4 border-l border-gray-200 dark:border-gray-700")}>
                <Button onClick={() => setEditorState(EditorState.Drawing)} disabled={isPolygonComplete || editorState === EditorState.Drawing}>
                    <Pencil className="mr-2 h-4 w-4" /> Dibujar
                </Button>
                <Button onClick={() => setEditorState(EditorState.Editing)} disabled={!isPolygonComplete || editorState === EditorState.Editing}>
                    <Edit2 className="mr-2 h-4 w-4" /> Editar Vértices
                </Button>
                <Button onClick={() => setEditorState(EditorState.Moving)} disabled={!isPolygonComplete || editorState === EditorState.Moving}>
                    <Hand className="mr-2 h-4 w-4" /> Mover Polígono
                </Button>
                <Button onClick={resetPolygon}>
                    <Check className="mr-2 h-4 w-4" /> Reiniciar
                </Button>
            </div>
        </div>
    );
};

export { ZoneAlarmScreen };
