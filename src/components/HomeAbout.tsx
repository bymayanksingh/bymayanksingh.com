import { useState, useEffect } from 'react';
import { Command } from 'lucide-react';
import { About, getAbout, Stats } from '../services/firebaseService';
import { getStats } from '../services/dataService';
import { motion } from 'framer-motion';


export function HomeAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutData = await getAbout();
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Command className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-950 py-16 sm:py-24 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Terminal-like About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-xl overflow-hidden shadow-2xl shadow-blue-500/5 hover:shadow-green-500/5 transition-shadow duration-500 w-full"
        >
          <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-gray-400 text-sm font-mono">about.ts</div>
              <div className="text-gray-500 text-xs border border-gray-700 rounded px-2 py-0.5">TypeScript</div>
            </div>
          </div>
          <div className="p-6 font-mono bg-gray-900/80 backdrop-blur-sm">
            <div className="text-green-400 mb-4 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>// About Me</span>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-gray-300"
            >
              <div className="group">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-yellow-400">developer</span>{' '}
                <span className="text-blue-400">=</span> {'{'}
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="pl-4 space-y-3"
              >
                <div className="group hover:bg-gray-800/30 p-2 rounded-lg transition-colors">
                  <span className="text-purple-400">background:</span>{' '}
                  <span className="text-green-300 group-hover:text-green-400 transition-colors">
                    "Full-stack developer with a passion for creating elegant solutions"
                  </span>,
                </div>
                <div className="group hover:bg-gray-800/30 p-2 rounded-lg transition-colors">
                  <span className="text-purple-400">experience:</span> [
                  <div className="pl-4 text-green-300 group-hover:text-green-400 transition-colors">
                    "5+ years of software development",<br />
                    "Cloud architecture and DevOps",<br />
                    "UI/UX design and implementation"
                  </div>
                  ],
                </div>
                <div className="group hover:bg-gray-800/30 p-2 rounded-lg transition-colors">
                  <span className="text-purple-400">skills:</span> {'{'}
                  <div className="pl-4">
                    <div className="group/skill hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-blue-400">frontend:</span> [
                      <span className="text-green-300 group-hover/skill:text-green-400 transition-colors">"React", "TypeScript", "Next.js"</span>],
                    </div>
                    <div className="group/skill hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-blue-400">backend:</span> [
                      <span className="text-green-300 group-hover/skill:text-green-400 transition-colors">"Node.js", "Python", "Go"</span>],
                    </div>
                    <div className="group/skill hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-blue-400">cloud:</span> [
                      <span className="text-green-300 group-hover/skill:text-green-400 transition-colors">"AWS", "Docker", "Kubernetes"</span>]
                    </div>
                  </div>
                  {'}'}
                </div>
              </motion.div>
              <div>{'}'};</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}