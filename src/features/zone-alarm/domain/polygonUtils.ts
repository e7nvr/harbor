import { Point, Polygon } from './types';

export const addVertex = (polygon: Polygon, point: Point): Polygon => {
  if (polygon.length >= 4) return polygon;
  return [...polygon, point];
};

export const moveVertex = (polygon: Polygon, index: number, point: Point): Polygon => {
  return polygon.map((vertex, i) => i === index ? point : vertex);
};

export const movePolygon = (polygon: Polygon, dx: number, dy: number): Polygon => {
  return polygon.map(vertex => ({ x: vertex.x + dx, y: vertex.y + dy }));
};

export const isPolygonComplete = (polygon: Polygon): boolean => {
  return polygon.length === 4;
};
