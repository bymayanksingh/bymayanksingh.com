import { Certificate } from '../services/firebaseService';
import { CheckCircle2, Terminal, Calendar, Building2, ExternalLink, Award } from 'lucide-react';
import { ImageFallback } from './ImageFallback';

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certificates.map((certificate) => (
        <div key={certificate.id} className="group">
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
                  <span className="text-sm font-mono">certificate.md</span>
                </div>
              </div>
              <Award className="w-4 h-4 text-yellow-500" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title and Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors duration-300">
                    {certificate.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {certificate.description}
                  </p>
                </div>

                {/* Cover Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700">
                  <ImageFallback 
                    src={certificate.image} 
                    alt={certificate.title}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 bg-gray-900 p-2"
                    fallbackClassName="w-full h-full flex items-center justify-center bg-gray-900"
                  />
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-700">
                  {/* Organization */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{certificate.organization}</span>
                  </div>

                  {/* Year */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{certificate.year}</span>
                  </div>

                  {/* Verification Status */}
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-4 h-4 ${certificate.verified ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className={`px-2 py-1 text-xs font-mono ${
                      certificate.verified 
                        ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                        : 'text-gray-400 bg-gray-700/50 border-gray-600'
                    } rounded-md border`}>
                      {certificate.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
