import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Terminal, Code, Instagram } from 'lucide-react';
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
      name: 'Instagram',
      url: about?.instagram,
      icon: Instagram,
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
      name: 'Photography',
      href: '/photography',
    },
    {
      name: 'Music',
      href: '/music',
    },
    {
      name: 'Books',
      href: '/books',
    },
    {
      name: 'Blog',
      href: '/blog',
    },
    {
      name: 'About',
      href: '/about',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
    {
      name: 'Resume',
      href: '/resume'
    },
  ];

  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Column */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-mono">~/{about?.name || 'bymayanksingh'}</span>
            </div>
            <p className="text-gray-400 text-sm font-mono">
              {about?.shortDescription || 'Building digital experiences with code and creativity.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                link.url && (
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
                )
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-green-400" />
              <h3 className="text-green-400 font-mono text-sm">Services</h3>
            </div>
            <ul className="space-y-4 font-mono">
              {about?.services?.map((service) => (
                <li key={service} className="text-gray-400 text-sm flex items-center space-x-2">
                  <span className="text-green-400/90">❯</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
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
                  {link.href.startsWith('http') || link.href.startsWith('mailto:') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                    >
                      <span className="text-green-400/90">❯</span>
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                    >
                      <span className="text-green-400/90">❯</span>
                      <span>{link.name}</span>
                    </Link>
                  )}
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
            <ul className="space-y-4">
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <span className="text-green-400/90">❯</span>
                <a 
                  href={`mailto:${about?.email}`}
                  className="hover:text-green-400 transition-colors"
                >
                  <span>{about?.email}</span>
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <span className="text-green-400/90">❯</span>
                <a 
                  href={`tel:${about?.phone}`}
                  className="hover:text-green-400 transition-colors"
                >
                  <span>{about?.phone}</span>
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <span className="text-green-400/90">❯</span>
                <span>{about?.city}, {about?.country}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800/50">
          <p className="text-gray-400 text-sm text-center font-mono">
            {currentYear} {about?.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
