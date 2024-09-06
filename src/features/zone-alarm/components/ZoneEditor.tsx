import React, { useState, useEffect, useCallback } from "react";
import { EditorState, Vertex } from '../domain/types';
import { usePolygonEditor } from '../hooks/usePolygonEditor';
import FloatingToolbar from './editor/FloatingToolbar';
import { savePolygon as savePolygonService } from '../services/polygonService';
import { toast } from "@/components/ui/use-toast";

interface ZoneEditorProps {
    onClose: () => void;
    initialPolygon?: Vertex[];
    onSave: (polygon: Vertex[]) => void;
}

export const ZoneEditor: React.FC<ZoneEditorProps> = ({ onClose, initialPolygon, onSave }) => {
    const {
        polygon,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        resetPolygon,
        isPolygonComplete,
        addVertex,
        removeVertex,
        editorState,
        setEditorState,
    } = usePolygonEditor(initialPolygon);

    const [isSaving, setIsSaving] = useState(false);

    const getMousePosition = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const savePolygon = async () => {
        if (polygon.length < 3) {
            toast({
                title: "Error",
                description: "El polígono debe tener al menos 3 vértices.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            await savePolygonService(polygon);
            toast({
                title: "Éxito",
                description: "Polígono guardado correctamente.",
            });
            onSave(polygon);
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo guardar el polígono.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getPolygonStyle = () => ({
        fill: "rgba(0, 0, 255, 0.2)",
        stroke: "blue",
        strokeWidth: 2,
    });

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="absolute inset-0 z-10">
            <svg
                className="w-full h-full"
                onClick={(e) => {
                    if (editorState === EditorState.Drawing) {
                        addVertex(getMousePosition(e));
                    }
                }}
                onMouseMove={(e) => handleMouseMove(getMousePosition(e))}
                onMouseDown={(e) => {
                    if (editorState === EditorState.Moving) {
                        handleMouseDown(getMousePosition(e));
                    }
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {polygon.length > 2 && (
                    <polygon
                        points={polygon.map(v => `${v.x},${v.y}`).join(' ')}
                        {...getPolygonStyle()}
                        onMouseDown={(e: React.MouseEvent<SVGPolygonElement>) => {
                            if (editorState === EditorState.Moving) {
                                //@ts-ignore
                                handleMouseDown(getMousePosition(e));
                            }
                        }}
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
                        onMouseDown={(e: React.MouseEvent<SVGCircleElement>) => {
                            if (editorState === EditorState.Editing) {
                                //@ts-ignore
                                handleMouseDown(getMousePosition(e), index);
                            }
                        }}
                        onDoubleClick={() => {
                            if (editorState === EditorState.Editing) {
                                removeVertex(index);
                            }
                        }}
                        style={{ cursor: editorState === EditorState.Editing ? 'move' : 'default' }}
                    />
                ))}
            </svg>
            <FloatingToolbar 
                onClose={onClose}
                setEditorState={setEditorState}
                resetPolygon={resetPolygon}
                savePolygon={savePolygon}
                editorState={editorState}
                isPolygonComplete={isPolygonComplete || polygon.length > 2}
                isSaving={isSaving}
            />
        </div>
    );
};
