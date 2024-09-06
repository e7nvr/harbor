import React from 'react';

interface PictureViewProps {
  file: File;
  onClose: () => void;
}

export const PictureView: React.FC<PictureViewProps> = ({ file, onClose }) => {
  return (
    <div className="relative w-full h-full">
      <img 
        src={URL.createObjectURL(file)} 
        alt="Selected picture" 
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
