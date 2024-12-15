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
        //console.log('Sorted timeline data:', sortedData);
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
                        {/* Command Line Header */}
                        <div className="flex items-center gap-2 text-green-400 text-xs mb-4">
                          <Terminal className="w-4 h-4" />
                          <span className="text-gray-400">$</span>
                          <span>git show {item.id.slice(0, 8)}</span>
                        </div>

                        {/* Commit Info */}
                        <div className="pl-6 border-l-2 border-gray-700 mb-4">
                          <div className="text-gray-400 text-xs mb-2">
                            <span className="text-gray-500">commit</span> {item.id.slice(0, 40)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            <span className="text-gray-500">Date:</span> {item.year}
                          </div>
                        </div>

                        {/* Event Title as Commit Message */}
                        <div className="pl-6 text-base sm:text-lg font-bold text-gray-100 mb-3">
                          <span className="text-green-400">$</span> {item.event}
                        </div>

                        {/* Details as Branch Info */}
                        <div className="pl-6 text-yellow-400/90 text-sm mb-3 font-mono">
                          <span className="text-gray-500">branch:</span> {item.details}
                        </div>

                        {/* Description as Diff */}
                        <div className="mt-4 text-sm space-y-1 bg-gray-900/50 p-3 rounded-md">
                          <div className="text-gray-400 mb-2">$ git diff --stat</div>
                          {item.description.split('\n').map((line, i) => (
                            <div key={i} className="flex items-start gap-2 group-hover:text-gray-200 transition-colors">
                              <span className="text-green-400">+</span>
                              <span className="text-gray-300">{line}</span>
                            </div>
                          ))}
                        </div>

                        {/* Icon as Status */}
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                          <span className="text-gray-500">$</span>
                          <span>git status</span>
                          <span className="text-green-400">✓</span>
                          <span>{item.icon}</span>
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