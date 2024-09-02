"use client";


import React from 'react';

interface DetectionWidgetProps {
  detectionHistory: Array<{
    position: "inside" | "partially" | "outside";
    timestamp: number;
  }>;
  currentStatus: string;
  detectedObjects: number;
}

export const DetectionWidget: React.FC<DetectionWidgetProps> = ({
  detectionHistory,
  currentStatus,
  detectedObjects,
}) => {
  return (
    <div className="p-4 bg-background border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Detection Info</h3>
      
      <div className="space-y-2">
        <p>Current Status: <span className="font-medium">{currentStatus}</span></p>
        <p>Detected Objects: <span className="font-medium">{detectedObjects}</span></p>
        
        <div>
          <h4 className="text-md font-semibold">Detection History</h4>
          <ul className="max-h-40 overflow-y-auto">
            {detectionHistory.map((entry, index) => (
              <li key={index} className="text-sm">
                {new Date(entry.timestamp).toLocaleTimeString()}: {entry.position}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};