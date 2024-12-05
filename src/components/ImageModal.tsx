import React, { Fragment, useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { ImageFallback } from './ImageFallback';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images?: { url: string; caption?: string }[];
  image?: string;
  title?: string;
  caption?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
  currentIndex?: number;
  totalItems?: number;
  renderImage?: (image: { url: string; caption?: string }) => React.ReactNode;
}

export function ImageModal({
  isOpen,
  onClose,
  images,
  image,
  title,
  caption,
  onPrevious,
  onNext,
  showNavigation = false,
  currentIndex = 0,
  totalItems = 0,
  renderImage,
}: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          onPrevious?.();
          break;
        case 'ArrowRight':
          onNext?.();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevious, onNext, onClose]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetTransforms = () => {
    setScale(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    resetTransforms();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-7xl'} bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700`}>
        {/* Window Controls */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 flex items-center space-x-2 text-gray-400">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-mono">{title || 'image-viewer'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showNavigation && (
              <div className="text-gray-400 text-sm font-mono">
                {currentIndex + 1} / {totalItems}
              </div>
            )}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-900/50" style={{ height: isFullscreen ? 'calc(100vh - 40px)' : '80vh' }}>
          {/* Image controls */}
          <div className="absolute left-4 top-4 z-10 flex items-center space-x-2 bg-gray-900/90 p-1 rounded-lg backdrop-blur-sm border border-gray-700">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={resetTransforms}
              className="p-1.5 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors"
              title="Reset"
            >
              reset
            </button>
          </div>

          {/* Navigation Controls */}
          {showNavigation && (
            <>
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white bg-gray-900/90 hover:bg-gray-800 rounded-lg backdrop-blur-sm border border-gray-700 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white bg-gray-900/90 hover:bg-gray-800 rounded-lg backdrop-blur-sm border border-gray-700 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div 
            className="w-full h-full flex items-center justify-center p-4"
            onClick={resetTransforms}
          >
            <div
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
              className="relative"
            >
              {renderImage ? (
                renderImage(images?.[currentIndex] || { url: image || '' })
              ) : (
                <ImageFallback
                  src={images?.[currentIndex]?.url || image || ''}
                  alt={caption || title || 'Image'}
                  className="max-h-full object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>

        {/* Caption */}
        {(caption || images?.[currentIndex]?.caption) && (
          <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
            <p className="text-gray-400 text-sm font-mono">
              {images?.[currentIndex]?.caption || caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}