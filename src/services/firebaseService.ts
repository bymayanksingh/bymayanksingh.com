import { collection, getDocs, doc, getDoc, query, where, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface Project {
  id: string;
  slug: string;
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
    const projectsRef = collection(db, 'projects');
    const querySnapshot = await getDocs(projectsRef);
    
    console.log('All project IDs in database:', querySnapshot.docs.map(doc => doc.id));
    
    const projects = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const id = doc.id;
        
        // Generate slug from title or use fallback
        const slug = data.slug || createSlug(data.title, id);
        
        // Process coverImage and gallery URLs
        const coverImage = await getStorageUrl(data.coverImage || '');
        const gallery = data.gallery ? await Promise.all(
          data.gallery.map(async (item: { url: string; caption: string }) => ({
            url: await getStorageUrl(item.url || ''),
            caption: item.caption || ''
          }))
        ) : [];

        // Construct project with all required fields and fallbacks
        const project = {
          id,
          title: data.title || `Project ${id.slice(0, 8)}`,
          slug,
          description: data.description || '',
          coverImage,
          gallery,
          category: data.category || 'Uncategorized',
          client: data.client || '',
          location: data.location || '',
          area: data.area || '',
          status: data.status || '',
          year: data.year || '',
          featured: !!data.featured,
          details: data.details || [],
          ...data
        } as Project;

        console.log(`Processed project ${id}:`, { id: project.id, title: project.title, slug: project.slug });
        return project;
      })
    );

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const getProject = async (idOrSlug: string): Promise<Project | null> => {
  try {
    console.log('Fetching project with ID/slug:', idOrSlug);
    
    // First try to get the project directly by ID
    let docRef = doc(db, 'projects', idOrSlug);
    let docSnap = await getDoc(docRef);
    
    // If not found by ID, try to find by slug
    if (!docSnap.exists()) {
      console.log('Project not found by ID, trying slug...');
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('slug', '==', idOrSlug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Try to find by generated slug
        const allProjects = await getProjects();
        const projectBySlug = allProjects.find(p => p.slug === idOrSlug);
        
        if (!projectBySlug) {
          console.log('Project not found by slug either:', idOrSlug);
          return null;
        }
        
        return projectBySlug;
      }
      
      docSnap = querySnapshot.docs[0];
    }

    const data = docSnap.data();
    const id = docSnap.id;

    // Generate slug if not present
    const slug = data.slug || createSlug(data.title, id);

    // Process images
    const coverImage = await getStorageUrl(data.coverImage || '');
    const gallery = data.gallery ? await Promise.all(
      data.gallery.map(async (item: { url: string; caption: string }) => ({
        url: await getStorageUrl(item.url || ''),
        caption: item.caption || ''
      }))
    ) : [];

    // Construct project with all required fields and fallbacks
    const project = {
      id,
      title: data.title || `Project ${id.slice(0, 8)}`,
      slug,
      description: data.description || '',
      coverImage,
      gallery,
      category: data.category || 'Uncategorized',
      client: data.client || '',
      location: data.location || '',
      area: data.area || '',
      status: data.status || '',
      year: data.year || '',
      featured: !!data.featured,
      details: data.details || [],
      ...data
    } as Project;

    console.log('Successfully processed project:', { id: project.id, title: project.title, slug: project.slug });
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    console.error('Project ID/slug:', idOrSlug);
    return null;
  }
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    console.log('Fetching project with slug:', slug);
    
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Project not found by slug:', slug);
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    console.log('Raw project data:', data);

    // Process coverImage
    const coverImage = await getStorageUrl(data.coverImage || '');
    console.log('Processed cover image:', coverImage);

    // Process gallery images
    const gallery = data.gallery ? await Promise.all(
      data.gallery.map(async (item: { url: string; caption: string }) => ({
        url: await getStorageUrl(item.url || ''),
        caption: item.caption || ''
      }))
    ) : [];
    console.log('Processed gallery:', gallery);

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

    console.log('Final processed project:', project);
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
      const data = aboutDoc.data();
      const image = data.image ? await getStorageUrl(data.image) : '';
      return { 
        id: aboutDoc.id, 
        ...data,
        image
      } as About;
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
    const certificatesRef = collection(db, 'certificates');
    const querySnapshot = await getDocs(certificatesRef);
    const certificates = await Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      // Process the image URL through getStorageUrl
      let imageUrl = '';
      if (data.image) {
        try {
          imageUrl = await getStorageUrl(data.image);
          console.log('Certificate image URL processed:', imageUrl);
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
