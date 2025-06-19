import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

// --- FIX STARTS HERE ---
// Validate that the environment variables are loaded correctly.
// If VITE_API_KEY is missing, the app will stop and show a clear error.
if (!firebaseConfig.apiKey) {
  throw new Error(
    "Firebase API Key is missing. Make sure you have a .env.local file in the root directory with your VITE_API_KEY and other Firebase config values."
  );
}
// --- FIX ENDS HERE ---


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Set a static ID for local development.
const appId = 'fire-tv-clone-local';


export { db, auth, appId };
