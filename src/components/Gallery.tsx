import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  branchName: string;
}

const Gallery: React.FC<GalleryProps> = ({ isOpen, onClose, images, branchName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const getPrevIndex = () => (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  const getNextIndex = () => (currentIndex === images.length - 1 ? 0 : currentIndex + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
      >
        <X size={32} />
      </button>

      {/* Gallery Header */}
      <div className="absolute top-4 left-4 text-white z-10">
        <h3 className="text-xl font-semibold">{branchName}</h3>
        <p className="text-gray-300">{currentIndex + 1} of {images.length}</p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/30 rounded-full p-2"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/30 rounded-full p-2"
      >
        <ChevronRight size={32} />
      </button>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mx-4 h-[70vh] flex items-center justify-center">
        {/* Previous Image (Left) */}
        <div className="absolute left-0 w-1/4 h-full flex items-center justify-center opacity-40 transform scale-75 transition-all duration-300">
          <img
            src={images[getPrevIndex()]}
            alt={`${branchName} - Previous`}
            className="max-w-full max-h-full object-contain rounded-lg cursor-pointer"
            onClick={prevImage}
          />
        </div>

        {/* Main Image (Center) */}
        <div className="relative w-1/2 h-full flex items-center justify-center z-10">
          <img
            src={images[currentIndex]}
            alt={`${branchName} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Image (Right) */}
        <div className="absolute right-0 w-1/4 h-full flex items-center justify-center opacity-40 transform scale-75 transition-all duration-300">
          <img
            src={images[getNextIndex()]}
            alt={`${branchName} - Next`}
            className="max-w-full max-h-full object-contain rounded-lg cursor-pointer"
            onClick={nextImage}
          />
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Background Click to Close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default Gallery;