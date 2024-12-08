import React, { useEffect, useState, FormEvent } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, Linkedin, Instagram,
  Terminal, Code, Command, GitBranch
} from 'lucide-react';
import { getAbout, submitMessage } from '../services/firebaseService';
import type { About } from '../services/firebaseService';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';

export function Contact() {
  const [about, setAbout] = useState<About | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    projectType: '',
    customProjectType: '',
    message: ''
  });
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const result = await submitMessage({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        projectType: formData.projectType === 'Other' ? formData.customProjectType : formData.projectType,
        message: formData.message
      });

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message! I will get back to you soon.'
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          projectType: '',
          customProjectType: '',
          message: ''
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    }
  };

  if (status.type === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Command className="w-5 h-5 animate-spin" />
          <span>Sending message...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen font-mono pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="contact"
          description="Let's connect and discuss opportunities"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400">contact-info.sh</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {about?.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 mt-1 text-green-400" />
                    <div>
                      <p className="text-gray-400">$ echo $EMAIL</p>
                      <a href={`mailto:${about.email}`} className="text-white hover:text-green-400 transition-colors">
                        {about.email}
                      </a>
                    </div>
                  </div>
                )}

                {about?.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 mt-1 text-green-400" />
                    <div>
                      <p className="text-gray-400">$ echo $PHONE</p>
                      <a href={`tel:${about.phone}`} className="text-white hover:text-green-400 transition-colors">
                        {about.phone}
                      </a>
                    </div>
                  </div>
                )}

                {about?.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 mt-1 text-green-400" />
                    <div>
                      <p className="text-gray-400">$ echo $LOCATION</p>
                      <p className="text-white">{about.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 mt-1 text-green-400" />
                  <div>
                    <p className="text-gray-400">$ echo $HOURS</p>
                    <p className="text-white">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-gray-700">
                <p className="text-gray-400 mb-4">$ git remote -v</p>
                <div className="space-y-3">
                  {about?.linkedin && (
                    <a
                      href={about.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-white hover:text-green-400 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>linkedin (fetch/push)</span>
                    </a>
                  )}
                  {about?.instagram && (
                    <a
                      href={about.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-white hover:text-green-400 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      <span>instagram (fetch/push)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400">message.sh</span>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      $ FIRST_NAME=
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      $ LAST_NAME=
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    $ EMAIL=
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    $ PROJECT_TYPE=
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Interior">Interior Design</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {formData.projectType === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      $ CUSTOM_TYPE=
                    </label>
                    <input
                      type="text"
                      name="customProjectType"
                      value={formData.customProjectType}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      placeholder="Specify project type"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    $ cat {'>'} message.txt
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.type === 'loading'}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GitBranch className="w-5 h-5" />
                  <span>git push origin message</span>
                </button>

                {status.type !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded ${status.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4" />
                      <span>{status.message}</span>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}