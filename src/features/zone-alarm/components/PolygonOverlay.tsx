import React from 'react';
import { Vertex } from '../domain/types';

interface PolygonOverlayProps {
  polygon: Vertex[];
}

export const PolygonOverlay: React.FC<PolygonOverlayProps> = ({ polygon }) => {
  if (polygon.length === 0) return null;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <polygon
        points={polygon.map(v => `${v.x},${v.y}`).join(' ')}
        fill="rgba(0, 0, 255, 0.2)"
        stroke="blue"
        strokeWidth={2}
      />
    </svg>
  );
};
