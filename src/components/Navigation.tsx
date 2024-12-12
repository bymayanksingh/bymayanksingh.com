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
  { path: '/photography', label: './Photography', ariaLabel: 'View Photography Gallery' },
  { path: '/music', label: './Music', ariaLabel: 'View Music & Playlists' },
  { path: '/books', label: './Books', ariaLabel: 'View Reading List' },
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.ariaLabel}
                  className={`px-2 lg:px-3 py-2 text-sm rounded-lg transition-colors duration-300 ${
                    location.pathname === item.path
                      ? 'text-green-400 bg-gray-800/50'
                      : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/30'
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
              className="md:hidden relative z-50 p-2 -mr-2 text-gray-400 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuVariants}
                  className="absolute top-0 inset-x-0 py-20 px-4 md:hidden bg-gray-900/95 backdrop-blur-md min-h-screen z-40 border-b border-gray-800/50"
                >
                  <div className="grid gap-2">
                    {navItems.map((item) => (
                      <motion.div key={item.path} variants={itemVariants}>
                        <Link
                          to={item.path}
                          aria-label={item.ariaLabel}
                          className={`block px-4 py-3 rounded-lg text-sm transition-colors duration-300 ${
                            location.pathname === item.path
                              ? 'text-green-400 bg-gray-800/50'
                              : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/30'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}