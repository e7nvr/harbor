import React from 'react';
import { Vertex } from '../domain/types';

interface PolygonOverlayProps {
  polygon: Vertex[];
  opacity?: number; // Nueva prop para controlar la opacidad
}

export const PolygonOverlay: React.FC<PolygonOverlayProps> = ({ polygon, opacity = 0.5 }) => {
  if (polygon.length < 3) return null;

  const points = polygon.map(v => `${v.x},${v.y}`).join(' ');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {/* Capa semi-transparente */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`rgba(0, 0, 0, ${opacity})`}
      />
      {/* Polígono */}
      <polygon
        points={points}
        fill="rgba(0, 0, 255, 0.2)"
        stroke="blue"
        strokeWidth="2"
      />
    </svg>
  );
};
