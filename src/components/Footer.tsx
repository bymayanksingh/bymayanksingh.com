import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { getAbout, type About } from '../services/firebaseService';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [about, setAbout] = useState<About | null>(null);
  
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    }
    fetchAboutData();
  }, []);
  
  return (
    <footer className="bg-gray-900 text-gray-400 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Terminal Header */}
        <div className="border border-gray-800 rounded-t-lg bg-gray-900">
          <div className="flex items-center px-4 py-2 bg-gray-800/50 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-sm text-gray-400">
              ~ portfolio-footer
            </div>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Command Line Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400">$</span>
                <span className="text-white">echo $CONTACT_INFO</span>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-6 pl-6 pt-2">
                {about?.linkedin && (
                  <a
                    href={about.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-400 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="hover:text-green-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Location Info */}
              {(about?.city || about?.country) && (
                <p className="pl-6 pt-2 text-sm">
                  <span className="text-green-400">&gt;</span> {about.city}{about.city && about.country && ', '}{about.country}
                </p>
              )}
            </div>

            {/* Services Section */}
            {about?.services && about.services.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">$</span>
                  <span className="text-white">ls ./services</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-6 pt-2">
                  {about.services.map((service, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-green-400">-</span> {service}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400">$</span>
                <span className="text-white">ls ./navigation</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pl-6 pt-2">
                <Link to="/" className="hover:text-green-400 transition-colors">
                  ~/home
                </Link>
                <Link to="/projects" className="hover:text-green-400 transition-colors">
                  ~/projects
                </Link>
                <Link to="/about" className="hover:text-green-400 transition-colors">
                  ~/about
                </Link>
                <Link to="/contact" className="hover:text-green-400 transition-colors">
                  ~/contact
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-gray-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400">$</span>
                <span className="text-white">echo $COPYRIGHT</span>
              </div>
              <p className="pl-6 pt-2">
                <span className="text-green-400">&gt;</span> &copy; {currentYear} {about?.name || 'Your Name'}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
