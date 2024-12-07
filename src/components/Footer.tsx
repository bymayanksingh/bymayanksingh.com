import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Terminal, Code } from 'lucide-react';
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

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: about?.linkedin,
      icon: Linkedin,
    },
    {
      name: 'Email',
      url: `mailto:${about?.email}`,
      icon: Mail,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/yourusername',
      icon: Github,
    },
  ];

  const quickLinks = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Projects',
      href: '/projects',
    },
    {
      name: 'About',
      href: '/about',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
  ];

  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-mono">~/bymayanksingh</span>
            </div>
            <p className="text-gray-400 text-sm font-mono">
              {about?.shortBio || 'Building digital experiences with code and creativity.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-green-400" />
              <h3 className="text-green-400 font-mono text-sm">Quick Links</h3>
            </div>
            <ul className="space-y-4 font-mono">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span className="text-green-400/90">❯</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-green-400" />
              <h3 className="text-green-400 font-mono text-sm">Contact</h3>
            </div>
            <ul className="space-y-4 font-mono">
              <li>
                <a
                  href={`mailto:${about?.email}`}
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                >
                  <span className="text-green-400/90">❯</span>
                  <span>{about?.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${about?.phone}`}
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                >
                  <span className="text-green-400/90">❯</span>
                  <span>{about?.phone}</span>
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <span className="text-green-400/90">❯</span>
                <span>{about?.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <p className="text-center text-gray-400 text-sm font-mono">
            <span className="text-green-400/90">❯</span> &copy; {currentYear} Mayank Singh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
