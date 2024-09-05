import { useState, useCallback, useEffect } from 'react';
import { Point, Polygon, EditorState } from '../domain/types';
import { addVertex, moveVertex, movePolygon, isPolygonComplete } from '../domain/polygonUtils';

export const usePolygonEditor = () => {
  const [polygon, setPolygon] = useState<Polygon>([]);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.Idle);
  const [draggedVertex, setDraggedVertex] = useState<number | null>(null);
  const [lastMousePosition, setLastMousePosition] = useState<Point | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && editorState !== EditorState.Idle) {
        setEditorState(EditorState.Idle);
      } else if (e.key === " " && !isSpacePressed) {
        setIsSpacePressed(true);
        setEditorState(EditorState.Moving);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setIsSpacePressed(false);
        setEditorState(EditorState.Idle);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [editorState, isSpacePressed]);

  const handleCanvasClick = useCallback((point: Point) => {
    if (editorState !== EditorState.Drawing) return;
    
    setPolygon(prev => {
      const newPolygon = addVertex(prev, point);
      if (isPolygonComplete(newPolygon)) {
        setEditorState(EditorState.Idle);
      }
      return newPolygon;
    });
  }, [editorState]);

  const handleMouseDown = useCallback((point: Point, index?: number) => {
    if (editorState === EditorState.Editing && index !== undefined) {
      setDraggedVertex(index);
    } else if (editorState === EditorState.Moving || isSpacePressed) {
      setLastMousePosition(point);
    }
  }, [editorState, isSpacePressed]);

  const handleMouseMove = useCallback((point: Point) => {
    if ((editorState === EditorState.Editing || editorState === EditorState.Moving || isSpacePressed) && draggedVertex !== null) {
      setPolygon(prev => moveVertex(prev, draggedVertex, point));
    } else if ((editorState === EditorState.Moving || isSpacePressed) && lastMousePosition) {
      const dx = point.x - lastMousePosition.x;
      const dy = point.y - lastMousePosition.y;
      setPolygon(prev => movePolygon(prev, dx, dy));
      setLastMousePosition(point);
    }
  }, [editorState, draggedVertex, lastMousePosition, isSpacePressed]);

  const handleMouseUp = useCallback(() => {
    setDraggedVertex(null);
    setLastMousePosition(null);
  }, []);

  const resetPolygon = useCallback(() => {
    setPolygon([]);
    setEditorState(EditorState.Idle);
  }, []);

  return {
    polygon,
    editorState,
    setEditorState,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetPolygon,
    isPolygonComplete: isPolygonComplete(polygon)
  };
};
