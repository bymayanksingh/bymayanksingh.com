import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, BookOpen, ExternalLink, Users, Calendar } from 'lucide-react';
import type { Publication } from '../services/firebaseService';

interface PublicationsProps {
  publications: Publication[];
  isLoading: boolean;
}

export function Publications({ publications, isLoading }: PublicationsProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4">
            <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
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
            <BookOpen className="w-3.5 h-3.5" />
            <span>publications.bib</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-sm text-gray-400 mb-4">
          <span className="text-green-400">$</span> cat ./publications.bib
        </div>

        <div className="space-y-4">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex flex-col space-y-2">
                <h3 className="text-green-400 font-medium group-hover:text-green-300 transition-colors">
                  {pub.title}
                </h3>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                  {pub.authors && (
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>{pub.authors}</span>
                    </div>
                  )}
                  {pub.year && (
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>{pub.year}</span>
                    </div>
                  )}
                </div>

                {pub.abstract && (
                  <p className="text-sm text-gray-400 mt-2">{pub.abstract}</p>
                )}

                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-green-400 hover:text-green-300 mt-2 transition-colors"
                  >
                    <span>View Publication</span>
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800/30">
          <div className="text-xs text-gray-500">
            <span className="text-green-400">$</span> echo "Total publications: {publications.length}"
          </div>
        </div>
      </div>
    </div>
  );
}
