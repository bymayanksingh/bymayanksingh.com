import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccount.json'), 'utf8')
);

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

// Function to update security rules
async function deployRules() {
  try {
    const rules = readFileSync(join(__dirname, '..', 'firestore.rules'), 'utf8');
    
    await db.settings({
      ignoreUndefinedProperties: true
    });

    //console.log('Deploying Firestore rules...');
    await db._settings.firestore.client.updateSecurityRules({
      name: `projects/${serviceAccount.project_id}/databases/(default)/documents`,
      rules: rules
    });
    
    //console.log('Successfully deployed Firestore rules!');
  } catch (error) {
    console.error('Error deploying rules:', error);
  }
}

// Run the deployment
deployRules().then(() => {
  //console.log('Finished deploying rules');
  process.exit(0);
}).catch((error) => {
  console.error('Failed to deploy rules:', error);
  process.exit(1);
});
