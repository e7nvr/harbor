import React, { useEffect } from 'react';

interface VideoViewProps {
  file: File;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoView: React.FC<VideoViewProps> = ({ file, onClose, videoRef }) => {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  }, [file, videoRef]);

  return (
    <div className="relative w-full h-full">
      <video 
        ref={videoRef}
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
