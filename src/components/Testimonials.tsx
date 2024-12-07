import { useState, useEffect } from 'react';
import { getTestimonials } from '../services/firebaseService';
import type { Testimonial } from '../services/firebaseService';
import { motion } from 'framer-motion';

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
      <div className="py-20 text-center">
        <div className="animate-pulse">Loading testimonials...</div>
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
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 mb-4"
          >
            <span className="text-green-400">pull</span> <span className="text-yellow-400">requests</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg font-mono"
          >
            # Merged feedback from collaborators
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-lg overflow-hidden"
            >
              {/* PR Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-400 text-sm font-mono">PR #{index + 1} (merged)</span>
                </div>
              </div>

              {/* PR Content */}
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-mono text-sm">
                      {testimonial.name.split(' ').map(word => word[0]).join('')}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-gray-100 font-mono font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm font-mono">{testimonial.role}</div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  <div className="text-gray-300 font-mono text-sm">
                    <div className="text-green-400 mb-2">// Code Review Feedback</div>
                    {testimonial.content.split('\n').map((line, i) => (
                      <div key={i} className="pl-4 border-l-2 border-green-500/30">
                        <span className="text-green-400">+</span> {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terminal-style footer */}
        <div className="mt-12 text-center font-mono">
          <span className="text-gray-400">git merge</span>{' '}
          <span className="text-green-400">client-testimonials</span>
        </div>
      </div>
    </section>
  );
}