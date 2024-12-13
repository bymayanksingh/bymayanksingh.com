import { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHero, getAbout } from '../services/firebaseService';
import type { Hero as HeroType, About } from '../services/firebaseService';
import { getStats } from '../services/dataService';
import * as LucideIcons from 'lucide-react';

// CSS for typing animation
const typingStyles = `
  .typing-effect {
    border-right: 2px solid #4ade80;
    white-space: nowrap;
    overflow: hidden;
    animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #4ade80 }
  }
`;

// Memoized icon component
const IconComponent = memo(({ iconName }: { iconName: string }) => {
  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
  return Icon ? <Icon className="w-5 h-5" /> : null;
});

export function Hero() {
  const [heroData, setHeroData] = useState<HeroType | null>(null);
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Remove typing animation state and useEffect
  const fullText = "Welcome to my digital workspace";

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        const [heroResult, statsResult, aboutResult] = await Promise.all([
          getHero(),
          getStats(),
          getAbout()
        ]);
        
        if (!controller.signal.aborted) {
          setHeroData(heroResult);
          setStats(statsResult);
          setAboutData(aboutResult);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching data:', error);
          setError(error instanceof Error ? error.message : 'Failed to load data');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => controller.abort();
  }, []);

  // Memoize variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 font-mono flex items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 font-mono flex items-center justify-center p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <style>{typingStyles}</style>
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
            <div className="grid md:grid-cols-2 gap-6 grid-cols-1">
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
                    <IconComponent iconName="Terminal" />
                    <span className="text-gray-400">$</span>
                    <span className="text-green-300 typing-effect">{fullText}</span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-gray-300 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50"
                  >
                    <span className="text-blue-400">class</span> <span className="text-yellow-400 font-bold">Developer</span> {'{'}
                    <div className="pl-4 space-y-2 overflow-x-auto">
                      <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors min-w-max">
                        <span className="text-purple-400">name:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"{aboutData?.name || 'Mayank'}"</span>
                      </div>
                      <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors min-w-max">
                        <span className="text-purple-400">role:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"{aboutData?.title || 'Software Engineer'}"</span>
                      </div>
                      <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors min-w-max">
                        <span className="text-purple-400">description:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"{aboutData?.shortDescription || 'Software Engineer & Former Architect'}"</span>
                      </div>
                      <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors min-w-max">
                        <span className="text-purple-400">location:</span> <span className="text-green-300 group-hover:text-green-400 transition-colors">"{[aboutData?.city, aboutData?.country].filter(Boolean).join(', ')}"</span>
                      </div>
                      <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors min-w-max">
                        <span className="text-purple-400">services:</span> [
                        <span className="text-green-300 group-hover:text-green-400 transition-colors">"{aboutData?.services?.join('", "') || 'Frontend, Backend, Cloud, Architecture'}"</span>]
                      </div>
                      <div className="group hover:bg-gray-800/30 p-1 rounded transition-colors min-w-max">
                        <span className="text-purple-400">contact:</span> {'{'}
                        <div className="pl-4">
                          <div className="break-all">email: "<span className="text-green-300 group-hover:text-green-400 transition-colors">{aboutData?.email}</span>"</div>
                          <div className="break-all">linkedin: "<span className="text-green-300 group-hover:text-green-400 transition-colors">{aboutData?.linkedin}</span>"</div>
                        </div>
                        {'}'}
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
                  <span className="text-xs text-gray-400 font-mono">profile.png</span>
                </div>
                <div className="p-6">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-700 shadow-lg shadow-purple-500/10">
                    <img
                      src={aboutData?.image || '/placeholder-profile.jpg'}
                      alt={aboutData?.name || 'Profile'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Social Links */}
                  <div className="mt-4 flex justify-center space-x-4">
                    {aboutData?.email && (
                      <a
                        href={`mailto:${aboutData.email}`}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title="Email"
                      >
                        <IconComponent iconName="Mail" />
                      </a>
                    )}
                    {aboutData?.linkedin && (
                      <a
                        href={aboutData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title="LinkedIn"
                      >
                        <IconComponent iconName="Linkedin" />
                      </a>
                    )}
                    {aboutData?.instagram && (
                      <a
                        href={aboutData.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title="Instagram"
                      >
                        <IconComponent iconName="Instagram" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-12"
            >
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-purple-500/5">
                <div className="px-4 py-2 bg-gray-900/90 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">actions.sh</span>
                </div>
                <div className="p-6">
                  <div className="font-mono space-y-4">
                    <div className="flex items-center space-x-2 text-green-400">
                      <IconComponent iconName="Terminal" />
                      <span className="text-gray-400">$</span>
                      <span className="text-green-300">./execute_actions.sh</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full">
                      <Link
                        to="/projects"
                        className="group relative flex items-center space-x-3 bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-green-500/50 rounded-lg px-6 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                      >
                        <div className="flex-shrink-0">
                          <IconComponent iconName="Code" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-green-400 group-hover:text-green-300 font-medium transition-colors">View Projects</h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Explore my portfolio</p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconComponent iconName="ArrowRight" />
                        </div>
                      </Link>

                      <Link
                        to="/music"
                        className="group relative flex items-center space-x-3 bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-green-500/50 rounded-lg px-6 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                      >
                        <div className="flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-green-400 group-hover:text-green-300 font-medium transition-colors">Music & Playlists</h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Check out my music taste</p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconComponent iconName="ArrowRight" />
                        </div>
                      </Link>

                      <Link
                        to="/contact"
                        className="group relative flex items-center space-x-3 bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-green-500/50 rounded-lg px-6 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                      >
                        <div className="flex-shrink-0">
                          <IconComponent iconName="Handshake" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-green-400 group-hover:text-green-300 font-medium transition-colors">Let's Connect</h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Start a conversation</p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconComponent iconName="ArrowRight" />
                        </div>
                      </Link>
                    </div>

                    <div className="text-sm text-gray-400 mt-4 pl-6 border-l-2 border-gray-700">
                      <p className="animate-pulse">Ready to collaborate on your next project? Let's make it happen!</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: <IconComponent iconName="Cpu" />, label: 'Frontend', desc: 'React & TypeScript' },
                { icon: <IconComponent iconName="Database" />, label: 'Backend', desc: 'Node.js & Python' },
                { icon: <IconComponent iconName="Network" />, label: 'Cloud', desc: 'AWS & Firebase' },
                { icon: <IconComponent iconName="Workflow" />, label: 'DevOps', desc: 'CI/CD & Docker' }
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

            {/* Stats Section */}
            {stats?.items && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-800/50"
              >
                {stats.items.map((stat, index) => {
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="text-center p-6 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-colors"
                    >
                      <div className="text-green-400 flex justify-center mb-3">
                        <IconComponent iconName={stat.icon} />
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
    </>
  );
}