import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
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
  area: string;
  status: string;
  details: string[];
  gallery: Array<{
    url: string;
    caption: string;
  }>;
}

const COLLECTION_NAME = 'projects';
const projectsCollection = collection(db, COLLECTION_NAME);

export const projectService = {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  },

  // Get a single project by ID
  async getProjectById(id: string): Promise<Project | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    }
    return null;
  },

  // Get projects by category
  async getProjectsByCategory(category: string): Promise<Project[]> {
    const q = query(projectsCollection, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  },

  // Add a new project
  async addProject(project: Omit<Project, 'id'>): Promise<string> {
    const docRef = await addDoc(projectsCollection, project);
    return docRef.id;
  },

  // Update a project
  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, project);
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
