import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { projectsData } from '../src/data/projects.js';
import { skills, testimonials, timeline, about, contact, hero } from '../src/data/mockData.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccount.json'), 'utf8')
);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function populateCollection(collectionName, data) {
  //console.log(`Starting to populate ${collectionName} with:`, JSON.stringify(data, null, 2));
  
  try {
    // Clear the collection first
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    //console.log(`Cleared ${collectionName} collection`);

    // Create a new batch for adding documents
    const addBatch = db.batch();
    
    if (Array.isArray(data)) {
      if (collectionName === 'skills') {
        // Special handling for skills array
        const docRef = db.collection(collectionName).doc('list');
        addBatch.set(docRef, { list: data });
        //console.log('Added skills list');
      } else {
        // Handle other arrays (testimonials, timeline, projects)
        data.forEach((item) => {
          const docRef = db.collection(collectionName).doc();
          addBatch.set(docRef, item);
          //console.log(`Added ${collectionName} item:`, item);
        });
      }
    } else {
      // Handle single document (about, contact, hero)
      const docRef = db.collection(collectionName).doc(collectionName + '1');
      addBatch.set(docRef, data);
      //console.log(`Added ${collectionName} document`);
    }

    await addBatch.commit();
    
    // Verify the data was added
    const verifySnapshot = await db.collection(collectionName).get();
    //console.log(`${collectionName} collection now has ${verifySnapshot.docs.length} documents`);
    
    //console.log(`Successfully populated ${collectionName} collection!`);
  } catch (error) {
    console.error(`Error in ${collectionName}:`, error);
    throw error;
  }
}

async function populateAllData() {
  try {
    // Populate all collections
    await populateCollection('hero', hero);
    await populateCollection('projects', projectsData);
    await populateCollection('skills', skills);
    await populateCollection('testimonials', testimonials);
    await populateCollection('timeline', timeline);
    await populateCollection('about', about);
    await populateCollection('contact', contact);

    //console.log('Successfully populated all collections!');
  } catch (error) {
    console.error('Error populating data:', error);
    throw error;
  }
}

// Run the population script
populateAllData().then(() => {
  //console.log('Finished populating all data');
  process.exit(0);
}).catch((error) => {
  console.error('Failed to populate data:', error);
  process.exit(1);
});
