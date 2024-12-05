import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAbout } from '../services/firebaseService';
import type { About } from '../services/firebaseService';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const navItems = [
  { path: '/', label: 'Home', ariaLabel: 'Go to Home page' },
  { path: '/projects', label: 'Projects', ariaLabel: 'View Engineering Projects' },
  { path: '/about', label: 'About', ariaLabel: 'Learn more about the Engineer' },
  { path: '/resume', label: 'Resume', ariaLabel: 'Learn more about me through my Resume' }

];

export function Navigation({ isMenuOpen, setIsMenuOpen }: NavigationProps) {
  const location = useLocation();
  const [about, setAbout] = useState<About | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-mono">
      <nav className={`transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link to="/" className="text-white hover:text-green-400 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">~/</span>
                <span className="font-bold">{'{'}dev.name{'}'}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-green-600/20 text-green-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-green-400">./</span>{item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
              >
                <span>Let's Talk</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              <div className="space-y-1">
                <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-md transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`px-6 py-3 rounded-lg text-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-green-600/20 text-green-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="text-green-400">./</span>{item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg text-lg transition-all duration-300 flex items-center space-x-2"
          >
            <span>Let's Talk</span>
          </Link>
        </div>
      </div>
    </header>
  );
}