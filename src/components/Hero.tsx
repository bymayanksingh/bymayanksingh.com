import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHero } from '../services/firebaseService';
import type { Hero as HeroType } from '../services/firebaseService';
import { getStats } from '../services/dataService';
import { 
  Code, Terminal, Github, Database, ArrowRight, ScrollText, 
  Award, Building2, Users, Cpu, Boxes, Network, Workflow,
  Binary, Braces, CircuitBoard
} from 'lucide-react';
import { ImageFallback } from './ImageFallback';

export function Hero() {
  const [heroData, setHeroData] = useState<HeroType | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome to my digital workspace";
  const typingSpeed = 100;

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroResult, statsResult] = await Promise.all([
          getHero(),
          getStats()
        ]);
        setHeroData(heroResult);
        setStats(statsResult);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Terminal className="w-5 h-5 animate-spin" />
          <span>Initializing system...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="text-red-400 flex items-center space-x-2">
          <CircuitBoard className="w-5 h-5" />
          <span>System Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/50 to-gray-900" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Terminal Window with Typing Effect */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 max-w-4xl"
          >
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400">portfolio.sh</span>
            </div>
            <div className="p-6 font-mono space-y-4">
              <div className="flex items-center space-x-2 text-green-400">
                <Terminal className="w-4 h-4" />
                <span className="text-gray-400">$</span>
                <span>{typedText}</span>
                <span className="animate-pulse">_</span>
              </div>
              
              <div className="text-gray-300">
                <span className="text-blue-400">class</span> <span className="text-yellow-400">Developer</span> {'{'}
                <div className="pl-4 space-y-1">
                  <div><span className="text-purple-400">name:</span> <span className="text-green-300">"{heroData?.name || 'Pragya'}"</span></div>
                  <div><span className="text-purple-400">role:</span> <span className="text-green-300">"Software Engineer & Former Architect"</span></div>
                  <div>
                    <span className="text-purple-400">skills:</span> [
                    <span className="text-green-300">"Frontend", "Backend", "Cloud", "Architecture"</span>]
                  </div>
                  <div><span className="text-purple-400">status:</span> <span className="text-green-300">"Available for Projects"</span></div>
                </div>
                {'}'}
              </div>

              <div className="text-gray-400">
                <span className="text-gray-500">// Type 'help' for available commands</span>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: <Cpu className="w-5 h-5" />, label: 'Frontend', desc: 'React & TypeScript' },
              { icon: <Database className="w-5 h-5" />, label: 'Backend', desc: 'Node.js & Python' },
              { icon: <Network className="w-5 h-5" />, label: 'Cloud', desc: 'AWS & Firebase' },
              { icon: <Workflow className="w-5 h-5" />, label: 'DevOps', desc: 'CI/CD & Docker' }
            ].map((tech, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/80 transition-colors"
              >
                <div className="flex items-center space-x-3 text-green-400 mb-2">
                  {tech.icon}
                  <span className="font-mono">{tech.label}</span>
                </div>
                <p className="text-gray-400 text-sm">{tech.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/projects"
              className="group relative inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-gray-900 font-medium px-6 py-3 rounded-lg transition-all duration-300"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              <span>Let's Connect</span>
              <Terminal className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats Section */}
          {stats && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-800"
            >
              {[
                { icon: <Code className="w-5 h-5" />, label: 'Projects', value: stats.projects },
                { icon: <Users className="w-5 h-5" />, label: 'Clients', value: stats.clients },
                { icon: <Award className="w-5 h-5" />, label: 'Awards', value: stats.awards },
                { icon: <Building2 className="w-5 h-5" />, label: 'Experience', value: `${stats.experience}+ Years` }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-4"
                >
                  <div className="text-green-400 flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden md:flex flex-col items-center"
        >
          <div className="w-1 h-16 rounded-full bg-gradient-to-b from-green-500/20 to-green-500/0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-green-400/60 transform -translate-y-1/2 animate-scroll"></div>
          </div>
          <span className="text-gray-400 text-sm mt-4 font-mono">scroll.down()</span>
        </motion.div>
      </div>
    </section>
  );
}