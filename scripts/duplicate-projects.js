const admin = require('firebase-admin');
require('dotenv').config({ path: '../.env' });

// Initialize Firebase Admin with credentials from env
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

// Original project data
const projectData = {
  area: "9000 sq ft",
  category: "Facade",
  client: "Studio Ardete",
  coverImage: "https://drive.google.com/uc?export=view&id=1tCoJ9d1LnocYCkRXxweEm-4moeG9XeJB",
  date: "2021",
  description: "A groundbreaking mixed-use development that seamlessly integrates cultural spaces with sustainable living environments.",
  details: ["ef", "fef", "efe"],
  featured: true,
  gallery: [
    {
      caption: "erw",
      url: "https://drive.google.com/uc?export=view&id=1-R6b3YqiR6R4M9RLoEUJcHrjsyRde_I7"
    },
    {
      caption: "efs",
      url: "https://drive.google.com/uc?export=view&id=1UcUVlJ3xWqI8GyMiHJ2luiRdYGLtOV2y"
    },
    {
      caption: "err",
      url: "https://drive.google.com/uc?export=view&id=1xM3-FlPUOQHTIyZZjF1gkbyn9yxKssoQ"
    },
    {
      caption: "wettw",
      url: "https://drive.google.com/uc?export=view&id=1tCoJ9d1LnocYCkRXxweEm-4moeG9XeJB"
    },
    {
      caption: "rww",
      url: "https://drive.google.com/uc?export=view&id=1D-0_zftGsQKb7KOBQcSpFVLVWWxqBR89"
    },
    {
      caption: "egwe",
      url: "https://drive.google.com/uc?export=view&id=1QIOj5x2i5VfTEd5UnRB9IMZmVqIkkIIt"
    },
    {
      caption: "ef",
      url: "https://drive.google.com/uc?export=view&id=1znCcTEYFg0reRmuLCcbMLBOWhzK4PHZf"
    },
    {
      caption: "af",
      url: "https://drive.google.com/uc?export=view&id=1YFATwzA8rTQbNxcR0nYrMH0WWQuPsI2v"
    }
  ],
  id: "office",
  location: "India",
  status: "Built",
  title: "Meltcrete",
  year: "2021"
};

async function duplicateProjects() {
  try {
    const batch = db.batch();
    
    // Create 10 duplicates with slightly modified titles
    for (let i = 1; i <= 30; i++) {
      const newDocRef = db.collection('projects').doc();
      const modifiedData = {
        ...projectData,
        title: `${projectData.title} ${i}`,
        id: `${projectData.id}_${i}`
      };
      
      batch.set(newDocRef, modifiedData);
    }

    // Commit the batch
    await batch.commit();
    //console.log('Successfully added 30 duplicate projects');
    process.exit(0);
  } catch (error) {
    console.error('Error adding documents:', error);
    process.exit(1);
  }
}

duplicateProjects();
