import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Initialize Firebase Admin SDK
 *
 * SECURITY NOTE: The service account key contains sensitive credentials.
 * - NEVER commit serviceAccountKey.json to git
 * - NEVER expose it in client-side code
 *
 * DEPLOYMENT OPTIONS:
 * 1. Local Development: Uses serviceAccountKey.json file
 * 2. Production (Railway/Render/etc): Uses FIREBASE_SERVICE_ACCOUNT_BASE64 env variable
 */

let firebaseAdmin: admin.app.App;

export const initializeFirebaseAdmin = () => {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  try {
    let serviceAccount: admin.ServiceAccount;

    // OPTION 1: Production - Use base64 encoded service account from env variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      console.log('🔑 Loading Firebase service account from base64 environment variable...');

      const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      const decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decodedKey);

      console.log('✅ Firebase service account loaded from environment variable');
    }
    // OPTION 2: Local Development - Use JSON file
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      console.log('📁 Loading Firebase service account from file...');

      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

      // Check if file exists
      if (!fs.existsSync(absolutePath)) {
        throw new Error(
          `Service account key file not found at: ${absolutePath}\n` +
          'Please download it from Firebase Console > Project Settings > Service Accounts'
        );
      }

      // Read and parse the service account key
      serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

      console.log('✅ Firebase service account loaded from file');
    }
    // No configuration found
    else {
      throw new Error(
        'Firebase configuration not found!\n' +
        'Please set either:\n' +
        '  - FIREBASE_SERVICE_ACCOUNT_BASE64 (for production)\n' +
        '  - FIREBASE_SERVICE_ACCOUNT_PATH (for local development)'
      );
    }

    // Initialize Firebase Admin
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.projectId,
    });

    console.log('✅ Firebase Admin SDK initialized successfully');

    return firebaseAdmin;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
};

// Export Firebase Admin services
export const getFirebaseAuth = () => {
  if (!firebaseAdmin) {
    initializeFirebaseAdmin();
  }
  return admin.auth();
};

export const getFirebaseFirestore = () => {
  if (!firebaseAdmin) {
    initializeFirebaseAdmin();
  }
  return admin.firestore();
};

export const getFirebaseStorage = () => {
  if (!firebaseAdmin) {
    initializeFirebaseAdmin();
  }
  return admin.storage();
};

export { admin };
