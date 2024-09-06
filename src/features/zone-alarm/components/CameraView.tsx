import React, { useRef, useEffect } from 'react';

interface CameraViewProps {
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full"
      >
        Cerrar
      </button>
    </div>
  );
};
