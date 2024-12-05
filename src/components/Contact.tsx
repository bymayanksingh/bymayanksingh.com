import React, { useState, FormEvent, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Instagram } from 'lucide-react';
import { submitMessage, getAbout } from '../services/firebaseService';
import type { About } from '../services/firebaseService';
import { containsProfanity, getProfanityMatches } from '../utils/profanityFilter';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  projectType: string;
  customProjectType: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  projectType?: string;
  customProjectType?: string;
  message?: string;
}

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    projectType: '',
    customProjectType: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const [about, setAbout] = useState<About | null>(null);

  const validateField = (name: string, value: string): string | undefined => {
    // Basic validation first
    if (!value.trim()) {
      if (name === 'lastName') return undefined; // lastName is optional
      return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
    }

    // Profanity check for text fields
    if (['firstName', 'lastName', 'message', 'customProjectType'].includes(name)) {
      if (containsProfanity(value)) {
        const matches = getProfanityMatches(value);
        return `Please remove inappropriate language${matches.length > 0 ? ': ' + matches.join(', ') : ''}`;
      }
    }

    // Field-specific validation
    switch (name) {
      case 'firstName':
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s-']+$/.test(value)) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;
      
      case 'lastName':
        if (value.trim() && !/^[a-zA-Z\s-']+$/.test(value)) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;
      
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'projectType':
        if (!value) return 'Please select a project type';
        return undefined;
      
      case 'customProjectType':
        if (formData.projectType === 'Other' && !value.trim()) return 'Please specify the project type';
        return undefined;
      
      case 'message':
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > 1000) return 'Message must not exceed 1000 characters';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      // Skip customProjectType validation if project type is not 'Other'
      if (key === 'customProjectType' && formData.projectType !== 'Other') return;
      
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    // Validate all fields
    if (!validateForm()) {
      setStatus({
        type: 'error',
        message: 'Please fix the errors in the form'
      });
      return;
    }

    // Additional validation before submission
    if (formData.projectType === 'Other' && !formData.customProjectType.trim()) {
      setErrors(prev => ({ ...prev, customProjectType: 'Please specify the project type' }));
      setStatus({
        type: 'error',
        message: 'Please fix the errors in the form'
      });
      return;
    }

    setStatus({ type: 'loading' });

    try {
      const result = await submitMessage({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        projectType: formData.projectType === 'Other' ? formData.customProjectType.trim() : formData.projectType,
        message: formData.message.trim()
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
        setTouched({});
        setErrors({});
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  useEffect(() => {
    async function fetchAboutData() {
      const data = await getAbout();
      setAbout(data);
    }
    fetchAboutData();
  }, []);

  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#1a1a1a_12%,transparent_12.5%,transparent_87%,#1a1a1a_87.5%,#1a1a1a),linear-gradient(150deg,#1a1a1a_12%,transparent_12.5%,transparent_87%,#1a1a1a_87.5%,#1a1a1a),linear-gradient(30deg,#1a1a1a_12%,transparent_12.5%,transparent_87%,#1a1a1a_87.5%,#1a1a1a),linear-gradient(150deg,#1a1a1a_12%,transparent_12.5%,transparent_87%,#1a1a1a_87.5%,#1a1a1a),linear-gradient(60deg,#99999944_25%,transparent_25.5%,transparent_75%,#99999944_75%,#99999944)]" style={{ backgroundSize: '80px 140px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Let's discuss how we can work together to bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-green-400">Get in Touch</h3>
              <div className="space-y-6">
                {about?.email && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200">Email</h4>
                      <a href={`mailto:${about.email}`} className="text-gray-400 hover:text-green-400 transition-colors">
                        {about.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {about?.phone && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200">Phone</h4>
                      <a href={`tel:${about.phone}`} className="text-gray-400 hover:text-green-400 transition-colors">
                        {about.phone}
                      </a>
                    </div>
                  </div>
                )}

                {about?.location && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200">Location</h4>
                      <p className="text-gray-400">{about.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200">Working Hours</h4>
                    <p className="text-gray-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-700/50">
                <h4 className="font-medium text-gray-200 mb-4">Connect with Me</h4>
                <div className="flex space-x-4">
                  {about?.linkedin && (
                    <a
                      href={about.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700/50 p-3 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-green-400" />
                    </a>
                  )}
                  {about?.instagram && (
                    <a
                      href={about.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700/50 p-3 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-green-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-6 text-green-400">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-gray-700/50 border ${
                      errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors`}
                    placeholder="John"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-gray-700/50 border ${
                      errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors`}
                    placeholder="Doe"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-700/50 border ${
                    errors.email && touched.email ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-700/50 border ${
                    errors.projectType && touched.projectType ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors`}
                >
                  <option value="">Select a project type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Interior">Interior Design</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Other">Other</option>
                </select>
                {errors.projectType && touched.projectType && (
                  <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>
                )}
              </div>

              {formData.projectType === 'Other' && (
                <div>
                  <label htmlFor="customProjectType" className="block text-sm font-medium text-gray-300 mb-2">
                    Specify Project Type *
                  </label>
                  <input
                    type="text"
                    id="customProjectType"
                    name="customProjectType"
                    value={formData.customProjectType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-gray-700/50 border ${
                      errors.customProjectType && touched.customProjectType ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors`}
                    placeholder="Please specify your project type"
                  />
                  {errors.customProjectType && touched.customProjectType && (
                    <p className="mt-1 text-sm text-red-500">{errors.customProjectType}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={`w-full bg-gray-700/50 border ${
                    errors.message && touched.message ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors`}
                  placeholder="Tell me about your project..."
                />
                {errors.message && touched.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status.type === 'loading'}
                className={`w-full flex items-center justify-center space-x-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-colors ${
                  status.type === 'loading' ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <span>Send Message</span>
                {status.type === 'loading' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>

              {status.type !== 'idle' && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : status.type === 'error'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : ''
                  }`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
