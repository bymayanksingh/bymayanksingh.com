import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Building2, Award, Briefcase, GraduationCap, Code } from 'lucide-react';
import type { Affiliation } from '../services/firebaseService';

interface AffiliationsProps {
  affiliations: Affiliation[];
}

const getIconComponent = (iconType?: string) => {
  if (!iconType) return Building2;
  
  switch (iconType.toLowerCase()) {
    case 'tech':
      return Code;
    case 'education':
      return GraduationCap;
    case 'work':
      return Briefcase;
    case 'award':
      return Award;
    default:
      return Building2;
  }
};

export function Affiliations({ affiliations }: AffiliationsProps) {
  if (!affiliations?.length) {
    return null;
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
            <Terminal className="w-3.5 h-3.5" />
            <span>affiliations.sh</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-sm text-gray-400 mb-4">
          <span className="text-green-400">$</span> ls -la ./affiliations/
        </div>

        <div className="space-y-3">
          {affiliations.map((affiliation, index) => {
            const IconComponent = getIconComponent(affiliation.icon);
            
            return (
              <motion.div
                key={affiliation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-400/10 text-green-400 flex items-center justify-center">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-green-400 font-medium truncate">
                          {affiliation.name}
                        </h3>
                        {affiliation.acronym && (
                          <span className="text-xs text-gray-500">({affiliation.acronym})</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {affiliation.timeline}
                      </div>
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                      <span className="text-gray-400">{affiliation.role}</span>
                      {affiliation.place && (
                        <>
                          <span className="hidden sm:inline text-gray-600">•</span>
                          <span className="text-gray-500">{affiliation.place}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800/30">
          <div className="text-xs text-gray-500">
            <span className="text-green-400">$</span> echo "Total affiliations: {affiliations.length}"
          </div>
        </div>
      </div>
    </div>
  );
}
