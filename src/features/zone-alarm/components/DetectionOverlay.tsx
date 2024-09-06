import React, { useRef, useEffect } from 'react';
import { Detection } from '../domain/types';
import { drawOnCanvas } from '@/lib/draw-utils';

interface DetectionOverlayProps {
  detections: Detection[];
  videoWidth: number;
  videoHeight: number;
  mirrored: boolean;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ 
  detections, 
  videoWidth, 
  videoHeight,
  mirrored
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match video
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // Convert our Detection type to DetectedObject type
    const detectedObjects = detections.map(d => ({
      bbox: [d.x, d.y, d.width, d.height],
      class: 'person',
      score: d.confidence
    }));

    // Draw detections
    drawOnCanvas(mirrored, detectedObjects, ctx);
  }, [detections, videoWidth, videoHeight, mirrored]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};
