import { useState, useCallback, useEffect } from 'react';
import { Point, Polygon, EditorState } from '../domain/types';
import { addVertex, moveVertex, movePolygon, isPolygonComplete } from '../domain/polygonUtils';

export const usePolygonEditor = (initialPolygon?: Polygon) => {
  const [polygon, setPolygon] = useState<Polygon>(initialPolygon || []);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.Idle);
  const [draggedVertex, setDraggedVertex] = useState<number | null>(null);
  const [lastMousePosition, setLastMousePosition] = useState<Point | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPolygonCompleteState, setIsPolygonCompleteState] = useState(false);

  useEffect(() => {
    setIsPolygonCompleteState(isPolygonComplete(polygon));
  }, [polygon]);

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
        setIsPolygonCompleteState(true);
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
    if (editorState === EditorState.Editing && draggedVertex !== null) {
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
    setIsPolygonCompleteState(false);
  }, []);

  const setIsPolygonComplete = useCallback((value: boolean) => {
    setIsPolygonCompleteState(value);
  }, []);

  // Agregar esta función para establecer el polígono directamente
  const setPolygonDirectly = useCallback((newPolygon: Polygon) => {
    setPolygon(newPolygon);
    setIsPolygonCompleteState(isPolygonComplete(newPolygon));
  }, []);

  // Agregar esta función para añadir un vértice
  const addVertexToPolygon = useCallback((point: Point) => {
    setPolygon(prev => {
      const newPolygon = addVertex(prev, point);
      setIsPolygonCompleteState(isPolygonComplete(newPolygon));
      return newPolygon;
    });
  }, []);

  // Agregar esta función para eliminar un vértice
  const removeVertexFromPolygon = useCallback((index: number) => {
    setPolygon(prev => {
      const newPolygon = prev.filter((_, i) => i !== index);
      setIsPolygonCompleteState(isPolygonComplete(newPolygon));
      return newPolygon;
    });
  }, []);

  return {
    polygon,
    setPolygon: setPolygonDirectly, // Renombrar para claridad
    editorState,
    setEditorState,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetPolygon,
    isPolygonComplete: isPolygonCompleteState,
    setIsPolygonComplete,
    addVertex: addVertexToPolygon, // Agregar esta función
    removeVertex: removeVertexFromPolygon, // Agregar esta función
  };
};
