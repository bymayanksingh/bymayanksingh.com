import React, { useState, useEffect } from 'react';
import { getTimeline } from '../services/dataService';
import type { TimelineItem } from '../services/firebaseService';
import { motion } from 'framer-motion';
import { Terminal, GitBranch, GitCommit, MapPin, Calendar } from 'lucide-react';

export function Timeline() {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimelineData() {
      try {
        const data = await getTimeline();
        const sortedData = [...data].sort((a, b) => b.year - a.year); // Sort by year in descending order
        setTimelineData(sortedData);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setError('Unable to load timeline data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchTimelineData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 h-48 rounded-lg border border-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-mono">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors font-mono border border-gray-700"
          >
            retry --force
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Terminal className="w-6 h-6 text-green-400" />
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-gray-100">
              Professional Journey
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 font-mono"
          >
            <GitBranch className="w-4 h-4" />
            <span>git log --reverse --pretty=format:"%h %s"</span>
          </motion.div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-gray-700 to-transparent"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`
                  flex flex-col md:flex-row items-start
                  ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                `}>
                  {/* Content */}
                  <div className={`
                    w-full md:w-5/12 
                    pl-16 md:pl-0
                    ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}
                  `}>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 sm:p-6 transition-all duration-300 hover:border-green-500/50 hover:bg-gray-800/80">
                      <div className="font-mono">
                        <div className="flex items-center gap-2 text-green-400 text-xs mb-3">
                          <GitCommit className="w-4 h-4" />
                          <span className="font-mono">{Math.random().toString(16).slice(2, 10)}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-2 break-words">
                          {item.event}
                        </h3>

                        <div className="text-yellow-400/90 text-sm mb-3 break-words">
                          {item.company}
                        </div>

                        <div className="flex flex-wrap gap-3 text-gray-400 text-xs mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{item.year}</span>
                          </div>
                        </div>

                        <div className="text-gray-300 text-sm space-y-1">
                          {item.description.split('\n').map((line, i) => (
                            <div key={i} className="flex items-start gap-2 group-hover:text-gray-200 transition-colors">
                              <span className="text-green-400/80 text-xs mt-1">+</span>
                              <span className="break-words flex-1">{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty Space for Layout */}
                  <div className="hidden md:block md:w-5/12"></div>
                </div>

                {/* Circle */}
                <div className="absolute left-8 md:left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-900 border-4 border-green-500 z-10 transition-transform duration-300 group-hover:scale-125"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Terminal-style footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center font-mono"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <GitBranch className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">branch:</span>
            <span className="text-green-400 text-sm">main</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}