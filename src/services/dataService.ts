import * as firebaseService from './firebaseService';
import * as fallbackData from '../config/fallbackData';

let isFirebaseAvailable = true;

// Function to check if Firebase is properly configured and available
const checkFirebaseAvailability = async () => {
  try {
    // Try to fetch a simple document to test Firebase connection
    await firebaseService.getHero();
    isFirebaseAvailable = true;
  } catch (error) {
    console.warn('Firebase is not available, using fallback data:', error);
    isFirebaseAvailable = false;
  }
};

// Initialize the service
checkFirebaseAvailability();

// Wrapper functions that handle both Firebase and fallback data
export const getHero = async () => {
  if (isFirebaseAvailable) {
    try {
      const hero = await firebaseService.getHero();
      if (hero) return hero;
    } catch (error) {
      console.warn('Error fetching hero data from Firebase:', error);
    }
  }
  return fallbackData.fallbackHero;
};

export const getProjects = async () => {
  if (isFirebaseAvailable) {
    try {
      const projects = await firebaseService.getProjects();
      if (projects.length > 0) return projects;
    } catch (error) {
      console.warn('Error fetching projects from Firebase:', error);
    }
  }
  return fallbackData.fallbackProjects;
};

export const getProject = async (id: string) => {
  if (isFirebaseAvailable) {
    try {
      const project = await firebaseService.getProject(id);
      if (project) return project;
    } catch (error) {
      console.warn('Error fetching project from Firebase:', error);
    }
  }
  return fallbackData.fallbackProjects[0];
};

export const getProjectsByCategory = async (category: string) => {
  if (isFirebaseAvailable) {
    try {
      const projects = await firebaseService.getProjectsByCategory(category);
      if (projects.length > 0) return projects;
    } catch (error) {
      console.warn('Error fetching projects by category from Firebase:', error);
    }
  }
  return fallbackData.fallbackProjects.filter(p => p.category === category);
};

export const getTestimonials = async () => {
  if (isFirebaseAvailable) {
    try {
      const testimonials = await firebaseService.getTestimonials();
      if (testimonials.length > 0) return testimonials;
    } catch (error) {
      console.warn('Error fetching testimonials from Firebase:', error);
    }
  }
  return fallbackData.fallbackTestimonials;
};

export const getTimeline = async () => {
  if (isFirebaseAvailable) {
    try {
      const timeline = await firebaseService.getTimeline();
      if (timeline.length > 0) return timeline;
    } catch (error) {
      console.warn('Error fetching timeline from Firebase:', error);
    }
  }
  return fallbackData.fallbackTimeline;
};

export const getAbout = async () => {
  if (isFirebaseAvailable) {
    try {
      const about = await firebaseService.getAbout();
      if (about) return about;
    } catch (error) {
      console.warn('Error fetching about data from Firebase:', error);
    }
  }
  return fallbackData.fallbackAbout;
};

export const getContact = async () => {
  if (isFirebaseAvailable) {
    try {
      const contact = await firebaseService.getContact();
      if (contact) return contact;
    } catch (error) {
      console.warn('Error fetching contact data from Firebase:', error);
    }
  }
  return fallbackData.fallbackContact;
};

export const submitMessage = async (messageData: Parameters<typeof firebaseService.submitMessage>[0]) => {
  if (isFirebaseAvailable) {
    try {
      return await firebaseService.submitMessage(messageData);
    } catch (error) {
      console.warn('Error submitting message to Firebase:', error);
    }
  }
  // Return a mock success response when Firebase is not available
  return {
    success: true,
    message: 'Message submitted successfully (Fallback Mode)'
  };
};

export const getStats = async () => {
  if (isFirebaseAvailable) {
    try {
      const stats = await firebaseService.getStats();
      if (stats) return stats;
    } catch (error) {
      console.warn('Error fetching stats from Firebase:', error);
    }
  }
  return fallbackData.fallbackStats;
};
