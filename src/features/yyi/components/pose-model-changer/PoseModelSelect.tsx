"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSE_RECOGNITION_MEDIAPIPE, POSE_RECOGNITION_YOLO, PoseModelType } from "@/utils/definitions";

interface Props {
  currentMode: string;
  poseModel: PoseModelType;
  onPoseModelChange: (value: PoseModelType) => void;
}

const PoseModelSelect: React.FC<Props> = ({
  currentMode,
  poseModel,
  onPoseModelChange,
}) => {
  if (currentMode !== "4") return null;

  return (
    <Select
      value={poseModel.toString()}
      onValueChange={(value) => onPoseModelChange(parseInt(value) as PoseModelType)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select pose model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={POSE_RECOGNITION_MEDIAPIPE.toString()}>Jupiter</SelectItem>
        <SelectItem value={POSE_RECOGNITION_YOLO.toString()}>Calipso</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PoseModelSelect;