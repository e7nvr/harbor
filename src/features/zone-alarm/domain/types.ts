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


