export type Point = { x: number; y: number };
export type Polygon = Point[];

// Añadir este alias de tipo para mayor claridad
export type Vertex = Point;

export enum EditorState {
  Idle = "idle",
  Drawing = "drawing",
  Editing = "editing",
  Moving = "moving"
}

export enum ScreenState {
  Idle,
  Drawing,
  Camera,
  Picture,
  Video
}

// Opcionalmente, podríamos añadir un tipo para las propiedades del ZoneEditor
export interface ZoneEditorProps {
  onClose: () => void;
  initialState: ScreenState;
  initialPolygon?: Vertex[];
  onSave: (polygon: Vertex[]) => void;
}

// Añade esto a tu archivo de tipos existente
export interface Detection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;  // Añadimos esta propiedad
}


