import { collection, getDocs, doc, getDoc, query, where, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  year: number;
  coverImage: string;
  description: string;
  client: string;
  featured: boolean;
  area: string;
  status: string;
  details: string[];
  gallery: Array<{
    url: string;
    caption: string;
  }>;
}

export interface Hero {
  id?: string;
  name: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  stats: {
    projects: number;
    awards: number;
    experience: number;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface TimelineItem {
  id: string;
  year: number;
  event: string;
  description: string;
  icon: string;
  color: string;
  details: string;
}

export interface About {
  id: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  email: string;
  city: string;
  country: string;
  phone: string;
  linkedin: string;
  instagram: string;
  resume: string;
  services: string[];
}

export interface Contact {
  id?: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  availability: string;
}

export interface Message {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: Date;
}

export interface Stats {
  id: string;
  items: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
}

export interface Certificate {
  id?: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string;
  verified: boolean;
}

export interface Affiliation {
  acronym: string;
  icon: string;
  name: string;
  place: string;
  timeline: string;
  role: string;
  order: number;
}

export interface Publication {
  id?: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  link: string;
  abstract: string;
  coverImage: string;
  category: 'journal' | 'conference' | 'book' | 'article';
  doi?: string;
  order: number;
}

export interface Award {
  id?: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
  category: 'competition' | 'academic' | 'professional';
  order: number;
}

// Hero
export const getHero = async (): Promise<Hero | null> => {
  try {
    const snapshot = await getDocs(collection(db, 'hero'));
    const heroDoc = snapshot.docs[0];
    return heroDoc ? { id: heroDoc.id, ...heroDoc.data() } as Hero : null;
  } catch (error) {
    console.error('Error fetching hero:', error);
    return null;
  }
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const getProject = async (id: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  try {
    const q = query(collection(db, 'projects'), where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project);
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    return [];
  }
};

// Skills
export const getSkills = async (): Promise<string[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'skills'));
    const skillsDoc = snapshot.docs[0];
    return skillsDoc ? (skillsDoc.data().list as string[]) : [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

// Testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'testimonials'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Testimonial);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

// Timeline
export const getTimeline = async (): Promise<TimelineItem[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'timeline'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TimelineItem);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return [];
  }
};

// About
export const getAbout = async (): Promise<About | null> => {
  try {
    const aboutCollection = collection(db, 'about');
    const aboutSnapshot = await getDocs(aboutCollection);
    
    if (!aboutSnapshot.empty) {
      const aboutDoc = aboutSnapshot.docs[0];
      return { id: aboutDoc.id, ...aboutDoc.data() } as About;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
};

// Contact
export const getContact = async (): Promise<Contact | null> => {
  try {
    const snapshot = await getDocs(collection(db, 'contact'));
    const contactDoc = snapshot.docs[0];
    return contactDoc ? { id: contactDoc.id, ...contactDoc.data() } as Contact : null;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return null;
  }
};

// Stats
export const getStats = async (): Promise<Stats | null> => {
  try {
    const docRef = doc(db, 'stats', 'stats');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Stats;
    }
    return null;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

// Certificates
export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'certificates'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Certificate);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

// Affiliations
export const getAffiliations = async (): Promise<Affiliation[]> => {
  try {
    const affiliationsRef = collection(db, 'affiliations');
    const snapshot = await getDocs(affiliationsRef);
    return snapshot.docs.map(doc => doc.data() as Affiliation);
  } catch (error) {
    console.error('Error fetching affiliations:', error);
    return [];
  }
};

// Publications
export const getPublications = async (): Promise<Publication[]> => {
  try {
    const publicationsRef = collection(db, 'publications');
    const querySnapshot = await getDocs(publicationsRef);
    const publications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Publication[];
    
    // Sort by order field
    return publications.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
};

// Awards
export const getAwards = async (): Promise<Award[]> => {
  try {
    const awardsRef = collection(db, 'awards');
    const querySnapshot = await getDocs(awardsRef);
    const awards = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Award[];
    
    // Sort by order field
    return awards.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching awards:', error);
    return [];
  }
};

// Messages
export const submitMessage = async (messageData: Omit<Message, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const messagesCollection = collection(db, 'contact');
    const messageWithTimestamp = {
      ...messageData,
      createdAt: new Date()
    };
    
    await addDoc(messagesCollection, messageWithTimestamp);
    return { success: true };
  } catch (error) {
    console.error('Error submitting message:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred while submitting your message' 
    };
  }
};
