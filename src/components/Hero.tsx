import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHero } from '../services/firebaseService';
import type { Hero as HeroType } from '../services/firebaseService';
import { getStats } from '../services/dataService';


import {
  ArrowRight, Code, Terminal, Database, Cpu, Network, Workflow,
  CircuitBoard, Command, Image, Award, Building2, Users, Briefcase, Handshake, Clock, BookOpen, FileCheck
} from 'lucide-react';

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

  const getIconComponent = (iconName: string) => {
    const icons = {
      Building2: Building2,
      Users: Users,
      Award: Award,
      Code: Code,
      Briefcase,
      Handshake: Handshake,
      Clock: Clock,
      BookOpen: BookOpen,
      FileCheck: FileCheck
    };
    return icons[iconName as keyof typeof icons] || Building2;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Command className="w-5 h-5 animate-spin" />
          <span>Initializing System...</span>
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
    <section className="relative min-h-screen bg-gray-950 pt-16 pb-8 sm:pt-24 sm:pb-12 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 animate-grid-flow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Terminal Windows Container */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Command Terminal */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="px-4 py-2 bg-gray-900/90 border-b border-gray-700 flex items-center justify-between backdrop-blur-md">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                </div>
                <span className="text-xs text-gray-400 font-mono">portfolio.sh</span>
              </div>
              <div className="p-6 font-mono space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-gray-400">$</span>
                  <span className="text-green-300">{typedText}</span>
                  <span className="w-2 h-5 bg-green-400 animate-pulse rounded-sm shadow-lg shadow-green-400/50">_</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-gray-300 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50"
                >
                  <span className="text-blue-400">class</span> <span className="text-yellow-400 font-bold">Developer</span> {'{'}
                  <div className="pl-4 space-y-2">
                    <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-purple-400">name:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"{heroData?.name || 'Pragya'}"</span>
                    </div>
                    <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-purple-400">role:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"Software Engineer & Former Architect"</span>
                    </div>
                    <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-purple-400">skills:</span> [
                      <span className="text-green-300 group-hover:text-green-400 transition-colors">"Frontend", "Backend", "Cloud", "Architecture"</span>]
                    </div>
                    <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors">
                      <span className="text-purple-400">status:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"Available for Projects"</span>
                    </div>
                  </div>
                  {'}'}
                </motion.div>
              </div>
            </motion.div>

            {/* Profile Image Terminal */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-purple-500/5 hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="px-4 py-2 bg-gray-900/90 border-b border-gray-700 flex items-center justify-between backdrop-blur-md">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                </div>
                <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                  <Image className="w-3.5 h-3.5" />
                  <span>profile.png</span>
                </div>
              </div>

              <div className="p-6 font-mono space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-gray-400">$</span>
                  <span className="text-green-300">display profile.png</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="relative aspect-square max-w-[280px] mx-auto"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-[0.6rem] leading-none font-mono text-green-400 opacity-30">
                    <pre className="select-none">
                      {`
   ████████
 ██        ██
██   ⌐◨-◨   ██
██          ██
 ██        ██
   ████████
                      `}
                    </pre>
                  </div>

                  <img
                    src={heroData?.backgroundImage || 'default-profile-image.jpg'}
                    alt="Profile"
                    className="rounded-lg object-cover w-full h-full border-2 border-green-500/20 hover:border-green-500/40 transition-colors duration-300"
                  />

                  <div className="absolute bottom-2 left-2 right-2 bg-gray-900/90 backdrop-blur-sm rounded-md p-2 border border-gray-700/50">
                    <div className="text-xs text-gray-400 flex items-center justify-between">
                      <span>resolution: 512x512</span>
                      <span>format: PNG</span>
                    </div>
                  </div>
                </motion.div>

                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span>file info</span>
                  </div>
                  <div className="pl-4 border-l-2 border-gray-700 text-xs space-y-1">
                    <p>name: {heroData?.name || 'Developer'}</p>
                    <p>role: {heroData?.title || 'Software Engineer'}</p>
                    <p>last_modified: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

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
          {stats?.items && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-800/50"
            >
              {stats.items.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center p-6 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-colors"
                  >
                    <div className="text-green-400 flex justify-center mb-3">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>


      </div>
    </section>
  );
}