/**
 * Firebase Initialization
 *
 * Initialize Firebase once and export the app, auth, and firestore instances.
 * The config values below are placeholders — replace them with your own
 * Firebase project credentials from the Firebase Console.
 */
import { initializeApp, getApps, getApp } from '@react-native-firebase/app';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase only once (guards against hot-reload double init)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;
