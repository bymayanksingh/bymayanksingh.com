import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { projectsData } from '../src/data/projects';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const statsData = {
  id: 'stats',
  items: [
    { icon: 'Building2', label: 'Projects', value: '50+' },
    { icon: 'Award', label: 'Awards', value: '12' },
    { icon: 'Users', label: 'Clients', value: '100+' }
  ]
};

async function populateStats() {
  const batch = writeBatch(db);
  const docRef = doc(db, 'stats', statsData.id);
  batch.set(docRef, statsData);

  try {
    await batch.commit();
    //console.log('Successfully populated stats data!');
  } catch (error) {
    console.error('Error populating stats data:', error);
  }
}

async function populateProjects() {
  const batch = writeBatch(db);
  
  for (const project of projectsData) {
    const { id, ...projectData } = project;
    const docRef = doc(db, 'projects', id);
    batch.set(docRef, projectData);
  }

  try {
    await batch.commit();
    //console.log('Successfully populated projects data!');
  } catch (error) {
    console.error('Error populating data:', error);
  }
}

// Run the population scripts
async function populateAllData() {
  await populateProjects();
  await populateStats();
  //console.log('Finished populating all data');
}

populateAllData().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
