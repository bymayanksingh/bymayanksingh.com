import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAbout } from '../services/firebaseService';
import type { About } from '../services/firebaseService';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const navItems = [
  { path: '/', label: './Home', ariaLabel: 'Go to Home page' },
  { path: '/projects', label: './Projects', ariaLabel: 'View Engineering Projects' },
  { path: '/blog', label: './Blog', ariaLabel: 'Read Blog Posts' },
  { path: '/about', label: './About', ariaLabel: 'Learn more about the Engineer' },
  { path: '/resume', label: './Resume', ariaLabel: 'View Resume' }
];

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
      staggerDirection: 1
    }
  }
};

const itemVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 }
};

export function Navigation({ isMenuOpen, setIsMenuOpen }: NavigationProps) {
  const location = useLocation();
  const [about, setAbout] = useState<About | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    }
    fetchAbout();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 font-mono
        ${isScrolled
          ? 'bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50'
          : 'bg-transparent'}`}
    >
      <nav
        className={`transition-all duration-500 w-full ${isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-gray-950/50 py-2 sm:py-3'
          : 'bg-transparent py-3 sm:py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="relative z-50 text-white hover:text-green-400 transition-colors duration-300 group"
              onClick={() => isMenuOpen && setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-sm sm:text-base group-hover:text-green-300 transition-colors duration-300">~/</span>
                <span className="font-bold text-sm sm:text-base group-hover:text-green-400 transition-colors duration-300">{'@'}bymayanksingh{'>_'}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.ariaLabel}
                  className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${location.pathname === item.path
                    ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20'
                    : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-2 px-4 py-2 bg-green-400/10 text-green-400 rounded-md text-sm hover:bg-green-400/20 transition-all duration-300 flex items-center space-x-2"
              >
                <span>./Let's Talk</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-50 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4">
                <span
                  className={`absolute w-5 h-0.5 transform transition-all duration-300 ${isMenuOpen
                    ? 'bg-green-400 rotate-45 top-2'
                    : 'bg-gray-400 top-0'
                    }`}
                />
                <span
                  className={`absolute w-5 h-0.5 top-2 transition-all duration-300 ${isMenuOpen
                    ? 'opacity-0 bg-green-400'
                    : 'opacity-100 bg-gray-400'
                    }`}
                />
                <span
                  className={`absolute w-5 h-0.5 transform transition-all duration-300 ${isMenuOpen
                    ? 'bg-green-400 -rotate-45 top-2'
                    : 'bg-gray-400 top-4'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 min-h-screen bg-gray-900/95 backdrop-blur-md md:hidden pt-20"
          >
            {/* Terminal Window */}
            <div className="mx-4 mt-4 rounded-lg border border-gray-700/50 overflow-hidden bg-gray-900/80">
              {/* Terminal Header */}
              <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">navigation.sh</span>
                </div>
              </div>

              {/* Terminal Content */}
              <motion.div
                className="p-4 font-mono space-y-4"
                variants={menuVariants}
              >
                {/* Command Prompt */}
                <div className="text-sm text-gray-400 mb-6">
                  <span className="text-green-400">$</span> ls -la ./pages/
                </div>

                {/* Navigation Items */}
                <div className="space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block w-full transition-all duration-300 group ${
                          location.pathname === item.path
                            ? 'text-green-400'
                            : 'text-gray-400 hover:text-green-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-md bg-gray-800/30 hover:bg-gray-800/50">
                          <span className="text-green-400/70">$</span>
                          <span className="text-sm">{item.label}</span>
                          {location.pathname === item.path && (
                            <span className="ml-auto text-xs text-green-400/70">(active)</span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Contact Button */}
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 px-3 py-2 rounded-md bg-green-400/10 hover:bg-green-400/20">
                        <span className="text-green-400">$</span>
                        <span className="text-sm text-green-400">./Let's Talk</span>
                        <span className="ml-auto text-xs text-green-400/70">--open</span>
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Terminal Footer */}
                <div className="mt-8 pt-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-500">
                    <span className="text-green-400/70">$</span> echo "Use 'Esc' to close"
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}