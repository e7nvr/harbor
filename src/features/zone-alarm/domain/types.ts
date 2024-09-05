export type Point = { x: number; y: number };
export type Polygon = Point[];

export enum EditorState {
  Idle = "idle",
  Drawing = "drawing",
  Editing = "editing",
  Moving = "moving"
}

export enum ScreenState {
  Idle = "idle",
  Drawing = "drawing",
  Editing = "editing",
  Moving = "moving",
  Detecting = "detecting"
}


