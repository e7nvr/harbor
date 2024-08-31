"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DetectionToolboxProps {
  onSettingsChange: (settings: DetectionSettings) => void;
}

export interface DetectionSettings {
  threshold: number;
  historySize: number;
  inferenceFrequency: number;
}

export const DetectionToolbox: React.FC<DetectionToolboxProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<DetectionSettings>({
    threshold: 0.9,
    historySize: 20,
    inferenceFrequency: 300,
  });

  const handleChange = (key: keyof DetectionSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="p-4 bg-background border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Detection Settings</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="threshold">Alert Threshold: {settings.threshold}</Label>
          <Slider
            id="threshold"
            min={0}
            max={1}
            step={0.01}
            value={[settings.threshold]}
            onValueChange={([value]) => handleChange('threshold', value)}
          />
        </div>

        <div>
          <Label htmlFor="historySize">History Size</Label>
          <Input
            id="historySize"
            type="number"
            value={settings.historySize}
            onChange={(e) => handleChange('historySize', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="inferenceFrequency">Inference Frequency (ms)</Label>
          <Input
            id="inferenceFrequency"
            type="number"
            value={settings.inferenceFrequency}
            onChange={(e) => handleChange('inferenceFrequency', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};