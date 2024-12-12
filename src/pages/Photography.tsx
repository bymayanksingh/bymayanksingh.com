import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageModal } from '../components/ImageModal';
import { usePhotos } from '../hooks/usePhotos';
import { Terminal } from 'lucide-react';

export function Photography() {
  const { photos, isLoading, error } = usePhotos();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && photos) {
      setSelectedImageIndex((selectedImageIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && photos) {
      setSelectedImageIndex((selectedImageIndex + 1) % photos.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-green-400">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Error loading photos: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-green-400 mb-2">
          <Terminal size={20} />
          <h1 className="text-xl font-mono">./photography</h1>
        </div>
        <p className="text-gray-400 font-mono text-sm">
          A collection of moments captured through my lens.
        </p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos?.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800/50"
            onClick={() => handleImageClick(index)}
          >
            <div className="absolute inset-0">
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-mono truncate">
                    {photo.caption || `Photo ${index + 1}`}
                  </p>
                  {photo.metadata?.location && (
                    <p className="text-gray-300 text-xs font-mono truncate mt-1">
                      {photo.metadata.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && photos && (
        <ImageModal
          isOpen={selectedImageIndex !== null}
          onClose={handleCloseModal}
          images={photos.map(photo => ({
            url: photo.url,
            caption: photo.caption
          }))}
          currentIndex={selectedImageIndex}
          totalItems={photos.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          showNavigation={true}
          title={photos[selectedImageIndex].caption}
          renderImage={(image) => {
            const photo = photos.find(p => p.url === image.url);
            if (!photo?.metadata) return null;

            return (
              <>
                <img
                  src={photo.url}
                  alt={photo.caption || ''}
                  className="max-h-[calc(80vh-8rem)] object-contain rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4 font-mono text-sm">
                  <div className="grid grid-cols-2 gap-2 text-gray-300 text-xs">
                    {photo.metadata.camera && (
                      <div>Camera: {photo.metadata.camera}</div>
                    )}
                    {photo.metadata.lens && (
                      <div>Lens: {photo.metadata.lens}</div>
                    )}
                    {photo.metadata.settings && (
                      <div>Settings: {photo.metadata.settings}</div>
                    )}
                    {photo.metadata.location && (
                      <div>Location: {photo.metadata.location}</div>
                    )}
                    {photo.metadata.date && (
                      <div>Date: {photo.metadata.date}</div>
                    )}
                  </div>
                </div>
              </>
            );
          }}
        />
      )}
    </div>
  );
}
