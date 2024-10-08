import { Vertex } from '../features/zone-alarm/domain/types';

// Función para verificar si un punto está dentro de un polígono
function isPointInPolygon(point: Vertex, polygon: Vertex[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Función para calcular el área de intersección entre un rectángulo y un polígono
export function getIntersectionArea(bbox: [number, number, number, number], polygon: Vertex[]): number {
  const [x, y, width, height] = bbox;
  const corners = [
    {x, y},
    {x: x + width, y},
    {x: x + width, y: y + height},
    {x, y: y + height}
  ];
  
  let intersectionArea = 0;
  const step = 5; // Ajusta este valor para un balance entre precisión y rendimiento
  
  for (let px = x; px < x + width; px += step) {
    for (let py = y; py < y + height; py += step) {
      if (isPointInPolygon({x: px, y: py}, polygon)) {
        // console.log('point in polygon', {x: px, y: py});
        intersectionArea += step * step;
      }
    }
  }
  
  return intersectionArea;
}

// Función para determinar si una detección está significativamente dentro de la zona
export function isDetectionInZone(
  detection: { bbox: [number, number, number, number] },
  polygon: Vertex[],
  videoWidth: number,
  videoHeight: number,
  containerWidth: number,
  containerHeight: number,
  threshold: number = 0.3
): boolean {
  const [x, y, width, height] = detection.bbox;
  
  // Calcular la escala y el offset
  const scale = Math.min(containerWidth / videoWidth, containerHeight / videoHeight);
  const scaledVideoWidth = videoWidth * scale;
  const scaledVideoHeight = videoHeight * scale;
  const offsetX = (containerWidth - scaledVideoWidth) / 2;
  const offsetY = (containerHeight - scaledVideoHeight) / 2;

  // Ajustar las coordenadas del bounding box solo para la comparación con el polígono
  const adjustedBbox: [number, number, number, number] = [
    x * scale + offsetX,
    y * scale + offsetY,
    width * scale,
    height * scale
  ];

  const bboxArea = width * height * scale * scale;
  const intersectionArea = getIntersectionArea(adjustedBbox, polygon);
  
  return intersectionArea / bboxArea > threshold;
}
