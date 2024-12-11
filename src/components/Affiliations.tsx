import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ExternalLink } from 'lucide-react';
import type { Affiliation } from '../services/firebaseService';

interface AffiliationsProps {
  affiliations: Affiliation[];
  isLoading: boolean;
}

export function Affiliations({ affiliations, isLoading }: AffiliationsProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800/50 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800/50 rounded"></div>
          ))}
        </div>
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

        <div className="space-y-4">
          {affiliations.map((affiliation, index) => (
            <motion.div
              key={affiliation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-900/50 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={affiliation.logo}
                    alt={`${affiliation.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-green-400 font-medium">
                        {affiliation.name}
                      </h3>
                      <p className="text-sm text-gray-400">{affiliation.role}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {affiliation.startDate} - {affiliation.current ? 'Present' : affiliation.endDate}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    {affiliation.description}
                  </p>
                </div>
              </div>

              {/* Link Overlay */}
              <a
                href={affiliation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 rounded-lg ring-1 ring-transparent hover:ring-green-400/30 transition-all duration-300"
              >
                <span className="absolute top-4 right-4 text-gray-500 group-hover:text-green-400 transition-colors duration-300">
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            </motion.div>
          ))}
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
