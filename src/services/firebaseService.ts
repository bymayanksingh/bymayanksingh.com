import { collection, getDocs, doc, getDoc, query, where, addDoc, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  details: string;
  technologies: string[];
  category: string;
  status: 'Live' | 'In Progress' | 'Archived';
  featured: boolean;
  year: number;
  github_url?: string;
  website_url?: string;
  instagram_url?: string;
  icon_url?: string;
  users_count?: number;
  coverImage: string | {
    url: string;
    credit?: {
      name: string;
      link: string;
    };
  };
  gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface ImageCredit {
  name: string;
  link: string;
}

interface ProjectImage {
  url: string;
  credit?: ImageCredit;
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
  skills: Array<{
    category: string;
    items: string[];
  }>;
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
  id: string;
  acronym: string;
  icon: string;
  name: string;
  order: number;
  place: string;
  role: string;
  timeline: string;
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

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  review: string;
  rating: number;
  coverImage: string;
  genre: string;
  readDate: string;
}

// Helper function to get Google Drive URL
const getGoogleDriveUrl = (url: string): string => {
  if (!url) return '';

  try {
    // If it's already a direct preview URL, return as is
    if (url.includes('drive.google.com/file/d/')) {
      return url;
    }

    // Extract file ID from various Google Drive URL formats
    let fileId = '';

    // Handle various URL formats
    if (url.includes('id=')) {
      // Handle export and usercontent URLs
      const idMatch = url.match(/id=([^&]+)/);
      fileId = idMatch ? idMatch[1] : '';
    } else if (url.includes('/file/d/')) {
      // Handle /file/d/ format
      const idMatch = url.match(/\/file\/d\/([^/]+)/);
      fileId = idMatch ? idMatch[1] : '';
    } else {
      // Handle other formats
      const idMatch = url.match(/[-\w]{25,}/);
      fileId = idMatch ? idMatch[0] : '';
    }

    if (!fileId) {
      console.error('Could not extract file ID from URL:', url);
      return url;
    }

    // Use the preview URL format which has better browser support
    return `https://drive.google.com/file/d/${fileId}/preview`;
  } catch (error) {
    console.error('Error processing Google Drive URL:', error);
    return url;
  }
};

// Helper function to get storage URL
const getStorageUrl = async (path: string): Promise<string> => {
  if (!path) return '';
  
  try {
    // Handle Google Drive URLs
    if (path.includes('drive.google.com') || path.includes('drive.usercontent.google.com')) {
      return getGoogleDriveUrl(path);
    }
    
    // Handle direct URLs (including lh3.googleusercontent.com and firebase storage URLs)
    if (path.startsWith('http') || path.startsWith('https')) {
      return path;
    }
    
    // Handle Firebase Storage paths
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    console.error('Path:', path);
    return '';
  }
};

// Helper function to create a URL-friendly slug
const createSlug = (text: string | undefined | null, id: string): string => {
  if (!text) {
    console.warn(`Creating fallback slug for project ${id} due to missing title`);
    return `project-${id.toLowerCase().slice(0, 8)}`;
  }
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to process image URLs
const processImageField = async (image: any): Promise<string | ProjectImage> => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (image.url) return image;
  return await getStorageUrl(image);
};

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
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at,
        updated_at: data.updated_at,
      } as Project;
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getProjects(): Promise<Project[]> {
  return getAllProjects(); // For backward compatibility
}

export const getProject = async (idOrSlug: string): Promise<Project | null> => {
  try {
    if (!idOrSlug) {
      console.error('No ID or slug provided');
      return null;
    }

    //console.log('Fetching project with ID/slug:', idOrSlug);
    
    // Try to get the project directly by ID first
    const projectDoc = await getDoc(doc(db, 'projects', idOrSlug));
    
    let projectData;
    if (projectDoc.exists()) {
      projectData = { ...projectDoc.data(), id: projectDoc.id };
    } else {
      // If not found by ID, try to find by slug
      const q = query(collection(db, 'projects'), where('slug', '==', idOrSlug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        //console.log('No project found with ID/slug:', idOrSlug);
        return null;
      }
      
      projectData = { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
    }
    
    // Process coverImage and gallery
    const coverImage = await processImageField(projectData.coverImage);
    const gallery = projectData.gallery 
      ? await Promise.all(projectData.gallery.map((item: any) => processImageField(item)))
      : [];

    return {
      id: projectData.id,
      slug: projectData.slug || '',
      title: projectData.title || '',
      description: projectData.description || '',
      details: projectData.details || '',
      technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
      category: projectData.category || '',
      status: projectData.status || 'Live',
      featured: !!projectData.featured,
      year: projectData.year || new Date().getFullYear(),
      github_url: projectData.github_url || '',
      website_url: projectData.website_url || '',
      coverImage,
      gallery,
      created_at: projectData.created_at || new Date().toISOString(),
      updated_at: projectData.updated_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    //console.log('Fetching project with slug:', slug);
    
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      //console.log('Project not found by slug:', slug);
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    //console.log('Raw project data:', data);

    // Process coverImage
    const coverImage = await getStorageUrl(data.coverImage || '');
    //console.log('Processed cover image:', coverImage);

    // Process gallery images
    const gallery = data.gallery ? await Promise.all(
      data.gallery.map(async (item: { url: string; caption: string }) => ({
        url: await getStorageUrl(item.url || ''),
        caption: item.caption || ''
      }))
    ) : [];
    //console.log('Processed gallery:', gallery);

    // Convert year to number if it's a string
    const year = typeof data.year === 'string' ? parseInt(data.year) : data.year;

    // Generate slug from title if not present
    const projectSlug = data.slug || createSlug(data.title, docSnap.id);

    // Construct the project object
    const project = {
      id: docSnap.id,
      ...data,
      title: data.title || 'Untitled Project',
      slug: projectSlug,
      year,
      coverImage,
      gallery
    } as Project;

    //console.log('Final processed project:', project);
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    console.error('Project slug:', slug);
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
export async function getSkills(): Promise<string[]> {
  try {
    const skillsRef = doc(db, 'skills', 'list');
    const skillsSnap = await getDoc(skillsRef);
    
    if (skillsSnap.exists()) {
      return skillsSnap.data().list || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting skills:', error);
    return [];
  }
}

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
export async function getAbout(): Promise<About | null> {
  try {
    const docRef = doc(db, 'about', 'about1');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: data.id || docSnap.id,
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        image: data.image || '',
        email: data.email || '',
        city: data.city || '',
        country: data.country || '',
        phone: data.phone || '',
        linkedin: data.linkedin || '',
        instagram: data.instagram || '',
        resume: data.resume || '',
        services: data.services || []
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting about:', error);
    return null;
  }
}

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
    const certificatesRef = collection(db, 'certificates');
    const querySnapshot = await getDocs(certificatesRef);
    const certificates = await Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      // Process the image URL through getStorageUrl
      let imageUrl = '';
      if (data.image) {
        try {
          imageUrl = await getStorageUrl(data.image);
          //console.log('Certificate image URL processed:', imageUrl);
        } catch (error) {
          console.error('Error processing certificate image:', error);
        }
      }
      return {
        id: doc.id,
        ...data,
        image: imageUrl
      };
    })) as Certificate[];
    
    // Sort by year in descending order
    return certificates.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

// Affiliations
export const getAffiliations = async (): Promise<Affiliation[]> => {
  try {
    const affiliationsRef = collection(db, 'affiliations');
    const q = query(affiliationsRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Affiliation[];
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
    const awards = await Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const image = data.image ? await getStorageUrl(data.image) : '';
      return {
        id: doc.id,
        ...data,
        image
      };
    })) as Award[];
    
    // Sort by order field
    return awards.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching awards:', error);
    return [];
  }
};

// Books
export async function getBooks(): Promise<Book[]> {
  try {
    const booksRef = collection(db, 'books');
    const snapshot = await getDocs(booksRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Book));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

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
