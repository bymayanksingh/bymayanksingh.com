import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Check if environment variables are loaded
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log environment variables in development
if (import.meta.env.DEV) {
  // console.log('Firebase Config:', {
  //   apiKey: requiredEnvVars.apiKey ? '✓' : '✗',
  //   authDomain: requiredEnvVars.authDomain ? '✓' : '✗',
  //   projectId: requiredEnvVars.projectId ? '✓' : '✗',
  //   storageBucket: requiredEnvVars.storageBucket ? '✓' : '✗',
  //   messagingSenderId: requiredEnvVars.messagingSenderId ? '✓' : '✗',
  //   appId: requiredEnvVars.appId ? '✓' : '✗',
  //   measurementId: requiredEnvVars.measurementId ? '✓' : '✗'
  // });
}

// Check for missing required variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. ` +
    'Make sure these are set in your Netlify environment variables.'
  );
}

const firebaseConfig = requiredEnvVars;

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}
