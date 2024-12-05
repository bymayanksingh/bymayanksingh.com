import { Publication } from '../services/firebaseService';
import { ExternalLink, BookOpen, Calendar, Users, Link2, FileText, Terminal } from 'lucide-react';
import { ImageFallback } from './ImageFallback';

interface PublicationsProps {
  publications: Publication[];
}

export function Publications({ publications }: PublicationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {publications.map((publication) => (
        <div key={publication.id} className="group">
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
                  <span className="text-sm font-mono">publication.md</span>
                </div>
              </div>
              <a
                href={publication.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Cover Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700">
                <ImageFallback 
                  src={publication.coverImage} 
                  alt={publication.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
              </div>

              {/* Title and Abstract */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors duration-300">
                    {publication.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {publication.abstract}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-700">
                  {/* Authors */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{publication.authors.join(', ')}</span>
                  </div>

                  {/* Journal & Year */}
                  <div className="flex items-center space-x-2 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{publication.journal}</span>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{publication.year}</span>
                    </div>
                  </div>

                  {/* DOI */}
                  {publication.doi && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Link2 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">DOI: {publication.doi}</span>
                    </div>
                  )}

                  {/* Read More Link */}
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-green-400 transition-colors mt-2 group/link"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Read Publication</span>
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
