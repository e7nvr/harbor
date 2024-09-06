import React from "react";
import { Button } from "@/components/ui/button";
import { X, Edit2, Hand, RotateCcw, Save, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorState } from '../../domain/types';

interface FloatingToolbarProps {
  onClose: () => void;
  setEditorState: (state: EditorState) => void;
  resetPolygon: () => void;
  savePolygon: () => void;
  editorState: EditorState;
  isPolygonComplete: boolean;
  isSaving: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ 
  onClose, 
  setEditorState, 
  resetPolygon, 
  savePolygon, 
  editorState, 
  isPolygonComplete,
  isSaving
}) => {
  return (
    <div className={cn("absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md")}>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setEditorState(EditorState.Drawing)} 
          disabled={editorState === EditorState.Drawing}
        >
          <PenTool className="h-4 w-4 mr-1" /> Dibujar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setEditorState(EditorState.Editing)} 
          disabled={!isPolygonComplete || editorState === EditorState.Editing}
        >
          <Edit2 className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setEditorState(EditorState.Moving)} 
          disabled={!isPolygonComplete || editorState === EditorState.Moving}
        >
          <Hand className="h-4 w-4 mr-1" /> Mover
        </Button>
        <Button variant="ghost" size="sm" onClick={resetPolygon}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reiniciar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={savePolygon} 
          disabled={!isPolygonComplete || isSaving}
        >
          <Save className="h-4 w-4 mr-1" /> 
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
