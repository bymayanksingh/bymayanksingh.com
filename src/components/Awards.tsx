import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Award, Calendar, MapPin } from 'lucide-react';
import type { Award as AwardType } from '../services/firebaseService';

interface AwardsProps {
  awards: AwardType[];
  isLoading: boolean;
}

export function Awards({ awards, isLoading }: AwardsProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4">
            <div className="h-5 bg-gray-700/50 rounded w-2/3 mb-2"></div>
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
            <Award className="w-3.5 h-3.5" />
            <span>awards.json</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-sm text-gray-400 mb-4">
          <span className="text-green-400">$</span> cat ./awards.json
        </div>

        <div className="space-y-3">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-400/10 text-green-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-green-400 font-medium truncate">
                      {award.title}
                    </h3>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {award.year}
                    </div>
                  </div>

                  {(award.organization || award.category) && (
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                      {award.organization && (
                        <span className="text-gray-400">{award.organization}</span>
                      )}
                      {award.category && (
                        <>
                          <span className="hidden sm:inline text-gray-600">•</span>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            <span>{award.category}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {award.description && (
                    <p className="mt-2 text-sm text-gray-400">{award.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800/30">
          <div className="text-xs text-gray-500">
            <span className="text-green-400">$</span> echo "Total awards: {awards.length}"
          </div>
        </div>
      </div>
    </div>
  );
}
