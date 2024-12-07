import { Award } from '../services/firebaseService';
import { Trophy, Terminal, Calendar, Building2, Tag } from 'lucide-react';
import { ImageFallback } from './ImageFallback';
import { ImageModal } from './ImageModal';
import { useState } from 'react';

interface AwardsProps {
  awards: Award[];
}

export function Awards({ awards }: AwardsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleImageClick = (image: string, title: string) => {
    setSelectedImage(image);
    setSelectedTitle(title);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {awards.map((award) => (
          <div key={award.id} className="group">
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-green-400/50 transition-all duration-300">
              {/* Window Controls */}
              <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2 text-gray-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-mono">award.md</span>
                  </div>
                </div>
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Cover Image */}
                <div 
                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-700 cursor-pointer"
                  onClick={() => handleImageClick(award.image, award.title)}
                >
                  <ImageFallback 
                    src={award.image} 
                    alt={award.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                </div>

                {/* Title and Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors duration-300">
                      {award.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {award.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-700">
                    {/* Organization */}
                    <div className="flex items-center space-x-2 text-sm">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{award.organization}</span>
                    </div>

                    {/* Year */}
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{award.year}</span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="px-2 py-1 text-xs font-mono text-green-400 bg-green-400/10 rounded-md border border-green-400/20">
                        {award.category.charAt(0).toUpperCase() + award.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage || ''}
        title={selectedTitle}
      />
    </>
  );
}
