import React, { useEffect, useState, FormEvent, lazy, Suspense, memo } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, Linkedin, Instagram,
  Terminal, Code, Command, GitBranch
} from 'lucide-react';
import { getAbout, submitMessage } from '../services/firebaseService';
import type { About } from '../services/firebaseService';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { TerminalLoader } from '../components/TerminalLoader';

// Fallback data for initial render
const fallbackAbout: About = {
  id: 'loading',
  name: '',
  title: '',
  description: '',
  shortDescription: '',
  image: '',
  email: 'Loading...',
  city: '',
  country: '',
  phone: 'Loading...',
  linkedin: '#',
  instagram: '#',
  resume: '',
  services: [],
  skills: [],
  category: '',
  items: [],
  location: 'Loading...'
};

// Memoized contact info component
const ContactInfo = memo(({ about }: { about: About }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
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
        {about.email && (
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

        {about.phone && (
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

        {about.location && (
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
          {about.linkedin && (
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
          {about.instagram && (
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
));

ContactInfo.displayName = 'ContactInfo';

// Memoized contact form component
const ContactForm = memo(({ 
  formData, 
  handleChange, 
  handleSubmit, 
  status 
}: { 
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  status: { type: string; message?: string };
}) => (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.2 }}
    onSubmit={handleSubmit}
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

    <div className="p-6 space-y-6">
      {/* Form Status */}
      {status.message && (
        <div
          className={`p-4 rounded ${
            status.type === 'success' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">$ First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">$ Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">$ Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">$ Project Type</label>
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
          className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
        >
          <option value="">Select a project type</option>
          <option value="Website Development">Website Development</option>
          <option value="Mobile App">Mobile App</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Consulting">Consulting</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {formData.projectType === 'Other' && (
        <div>
          <label className="block text-gray-400 text-sm mb-2">$ Custom Project Type</label>
          <input
            type="text"
            name="customProjectType"
            value={formData.customProjectType}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
          />
        </div>
      )}

      <div>
        <label className="block text-gray-400 text-sm mb-2">$ Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status.type === 'loading'}
        className={`w-full flex items-center justify-center space-x-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 py-2 px-4 rounded transition-colors duration-300 ${
          status.type === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Send className="w-4 h-4" />
        <span>Send Message</span>
      </button>
    </div>
  </motion.form>
));

ContactForm.displayName = 'ContactForm';

export function Contact() {
  const [about, setAbout] = useState<About>(fallbackAbout);
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAboutData() {
      try {
        const data = await getAbout();
        if (isMounted && data) {
          setAbout(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      fetchAboutData();
    }, 300); // Reduced loading time

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
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

  if (loading) {
    return (
      <TerminalLoader
        title="contact_init.sh"
        steps={[
          { text: "Initializing contact form", status: "completed" },
          { text: "Loading contact info", status: "loading" },
        ]}
      />
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
          <ContactInfo about={about} />
          <ContactForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}