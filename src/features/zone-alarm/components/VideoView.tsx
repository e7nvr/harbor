import React from 'react';

interface VideoViewProps {
  file: File;
  onClose: () => void;
}

export const VideoView: React.FC<VideoViewProps> = ({ file, onClose }) => {
  return (
    <div className="relative w-full h-full">
      <video 
        src={URL.createObjectURL(file)} 
        controls 
        className="w-full h-full object-contain"
      />
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full z-10"
      >
        Cerrar
      </button>
    </div>
  );
};
