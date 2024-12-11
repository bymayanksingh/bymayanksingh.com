import { useState, useEffect } from 'react';
import { getTestimonials } from '../services/firebaseService';
import type { Testimonial } from '../services/firebaseService';
import { motion } from 'framer-motion';
import { Terminal, GitBranch } from 'lucide-react';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Terminal className="w-5 h-5 animate-spin" />
          <span>Loading Testimonials...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="text-red-600">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!testimonials.length) {
    return <div className="py-20 text-center">No testimonials available.</div>;
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
              git log --author="collaborators"
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 font-mono"
          >
            <GitBranch className="w-4 h-4" />
            <span>git fetch origin testimonials</span>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300"
            >
              {/* Terminal Header */}
              <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-xs font-mono">review-{testimonial.id.slice(0, 6)}.md</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 font-mono">
                {/* Command Line */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <span>$</span>
                  <span>cat review.md</span>
                </div>

                {/* Review Content */}
                <div className="pl-4 border-l-2 border-green-500/30 mb-6 space-y-2">
                  {testimonial.content.split('\n').map((line, i) => (
                    <div key={i} className="text-gray-300 text-sm">
                      <span className="text-green-400 mr-2">&gt;</span>
                      {line}
                    </div>
                  ))}
                </div>

                {/* Author Info as Git Config */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>$</span>
                    <span>git config --get user.info</span>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full border border-green-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 border border-green-500/30 flex items-center justify-center text-gray-300 text-sm">
                        {testimonial.name.split(' ').map(word => word[0]).join('')}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-200">{testimonial.name}</div>
                      <div className="text-gray-400 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </div>

                {/* Git Status */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">$</span>
                    <span className="text-gray-400">git status</span>
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-400">review verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terminal Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center font-mono"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">$</span>
            <span className="text-green-400 text-sm">git merge --no-ff testimonials</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}