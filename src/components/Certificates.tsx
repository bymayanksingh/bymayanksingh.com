import { Certificate } from '../services/firebaseService';
import { CheckCircle2, Trophy } from 'lucide-react';
import { ImageFallback } from './ImageFallback';
import { motion } from 'framer-motion';
import { ImageModal } from './ImageModal';
import { useState } from 'react';

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-400">
          <Trophy className="w-5 h-5" />
          <h3 className="text-lg font-medium text-white">Certificates</h3>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {certificates?.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-200 font-medium mb-1 group-hover:text-green-400 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {cert.organization} • {cert.year}
                  </p>
                  <p className="text-sm text-gray-400">
                    {cert.description}
                  </p>
                </div>

                {/* Certificate Image Preview */}
                {cert.image && (
                  <button
                    onClick={() => setSelectedImage(cert.image)}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-700/50 hover:border-green-500/30 transition-colors"
                  >
                    <ImageFallback
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
              </div>

              {/* Verification Badge */}
              {cert.verified && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Certificate</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
