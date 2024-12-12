import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { Terminal, Camera, Image as ImageIcon } from 'lucide-react';
import { TerminalLoader } from '../components/TerminalLoader';

// Sample images data (to be replaced with Firebase data later)
const sampleImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'Landscape Photography',
    description: 'Yosemite Valley, California',
    metadata: {
      camera: 'Sony A7III',
      lens: '16-35mm f/2.8',
      settings: 'f/11, 1/125s, ISO 100'
    }
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    title: 'Street Photography',
    description: 'Urban Life',
    metadata: {
      camera: 'Fujifilm X-T4',
      lens: '23mm f/1.4',
      settings: 'f/2.8, 1/250s, ISO 400'
    }
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1682687218147-9806132dc697',
    title: 'Portrait',
    description: 'Natural Light Portrait',
    metadata: {
      camera: 'Canon R5',
      lens: '85mm f/1.2',
      settings: 'f/1.8, 1/200s, ISO 200'
    }
  }
];

export function Photography() {
  const [selectedImage, setSelectedImage] = useState<typeof sampleImages[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <TerminalLoader
        title="photo_gallery.sh"
        steps={[
          { text: "Connecting to photo server", status: "completed" },
          { text: "Loading image metadata", status: "completed" },
          { text: "Processing image thumbnails", status: "completed" },
          { text: "Preparing gallery view", status: "loading" },
        ]}
      />
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen font-mono pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="photography"
          description="A collection of my best photographs"
        />

        {/* Terminal-styled Gallery Container */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
          {/* Terminal Header */}
          <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>gallery.sh</span>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-800/50">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-green-400 text-sm">$ view {image.title.toLowerCase()}.jpg</div>
                      <div className="text-gray-300 text-xs">{image.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-5xl w-full bg-gray-900/90 rounded-lg border border-gray-800/50 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{selectedImage.title}</span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-green-400 transition-colors"
                >
                  <span className="text-sm">ESC</span>
                </button>
              </div>
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                  <div className="text-green-400 text-sm mb-1">$ exif {selectedImage.title.toLowerCase()}.jpg</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-300">
                    <div>Camera: {selectedImage.metadata.camera}</div>
                    <div>Lens: {selectedImage.metadata.lens}</div>
                    <div>Settings: {selectedImage.metadata.settings}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
