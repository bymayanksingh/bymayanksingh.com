import React, { useState, useEffect } from 'react';
import { getTimeline } from '../services/dataService';
import type { TimelineItem } from '../services/firebaseService';
import { motion } from 'framer-motion';

export function Timeline() {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimelineData() {
      try {
        const data = await getTimeline();
        // Sort timeline data by year in ascending order
        const sortedData = [...data].sort((a, b) => a.year - b.year);
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
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 h-48 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 mb-4"
          >
            <span className="text-green-400">git log</span> <span className="text-yellow-400">--professional-journey</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg font-mono"
          >
            # Career milestones and achievements
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center justify-between ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="glass-card p-6 rounded-lg">
                    <div className="font-mono">
                      <div className="text-green-400 text-sm mb-2">
                        commit {Math.random().toString(16).slice(2, 10)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">{item.event}</h3>
                      <div className="text-yellow-400 text-sm mb-3">{item.company}</div>
                      <div className="text-gray-400 text-sm mb-4">
                        Author: {item.location}<br />
                        Date: {item.year}
                      </div>
                      <div className="text-gray-300 text-sm whitespace-pre-line">
                        {item.description.split('\n').map((line, i) => (
                          <div key={i} className="mb-1">
                            <span className="text-green-400">+</span> {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-green-500 border-4 border-gray-900"></div>

                {/* Empty Space for Layout */}
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Terminal-style footer */}
        <div className="mt-12 text-center font-mono">
          <span className="text-gray-400">git checkout -b</span>{' '}
          <span className="text-green-400">new-opportunities</span>
        </div>
      </div>
    </section>
  );
}