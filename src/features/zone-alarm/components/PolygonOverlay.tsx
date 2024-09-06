import React from 'react';
import { Vertex } from '../domain/types';

interface PolygonOverlayProps {
  polygon: Vertex[];
  opacity?: number; // Nueva prop para controlar la opacidad
  filterRed?: boolean; // Nueva prop para activar el filtro de rojo
}

export const PolygonOverlay: React.FC<PolygonOverlayProps> = ({ 
  polygon, 
  opacity = 0.5, 
  filterRed = false 
}) => {
  if (polygon.length < 3) return null;

  const points = polygon.map(v => `${v.x},${v.y}`).join(' ');

  // Matriz de color para filtrar el rojo
  // Esta matriz reduce significativamente el canal rojo (R) mientras mantiene el verde (G) y el azul (B)
  const colorMatrix = [
    0.2, 0, 0, 0, 0,  // R
    0, 1, 0, 0, 0,    // G
    0, 0, 1, 0, 0,    // B
    0, 0, 0, 1, 0     // A
  ].join(' ');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        {filterRed && (
          <filter id="redFilter">
            <feColorMatrix type="matrix" values={colorMatrix} />
          </filter>
        )}
      </defs>
      
      {/* Capa semi-transparente con filtro opcional */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`rgba(0, 0, 0, ${opacity})`}
        filter={filterRed ? "url(#redFilter)" : undefined}
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
