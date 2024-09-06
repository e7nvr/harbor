import React, { useRef, useEffect } from 'react';
import { Detection, Vertex } from '../domain/types';
import { drawOnCanvas } from '@/lib/draw-utils';
import { isDetectionInZone } from '@/lib/geometry-utils';

interface DetectionOverlayProps {
  detections: Detection[];
  videoWidth: number;
  videoHeight: number;
  mirrored: boolean;
  containerWidth: number;
  containerHeight: number;
  zonePolygon: Vertex[]; // Nuevo prop para el polígono de la zona
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ 
  detections, 
  videoWidth, 
  videoHeight,
  mirrored,
  containerWidth,
  containerHeight,
  zonePolygon
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling and positioning to match object-contain behavior
    const scale = Math.min(containerWidth / videoWidth, containerHeight / videoHeight);
    const scaledWidth = videoWidth * scale;
    const scaledHeight = videoHeight * scale;
    const offsetX = (containerWidth - scaledWidth) / 2;
    const offsetY = (containerHeight - scaledHeight) / 2;

    // Apply the scaling and positioning for drawing
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Filter detections that are people and in the zone
    const filteredDetections = detections.filter(d => 
      d.class === 'person' && isDetectionInZone(
        { bbox: [d.x, d.y, d.width, d.height] },
        zonePolygon,
        videoWidth,
        videoHeight,
        containerWidth,
        containerHeight
      )
    );

    // Convert our Detection type to DetectedObject type
    const detectedObjects = filteredDetections.map(d => ({
      bbox: [d.x, d.y, d.width, d.height],
      class: 'person',
      score: d.confidence
    }));

    // Draw detections
    drawOnCanvas(mirrored, detectedObjects, ctx);
  }, [detections, videoWidth, videoHeight, mirrored, containerWidth, containerHeight, zonePolygon]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};
