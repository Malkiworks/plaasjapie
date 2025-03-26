// Use just the standard Firebase/Firestore imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Remove React Native Firebase imports
// import RNFirebase from '@react-native-firebase/app';
// import RNAuth from '@react-native-firebase/auth';

// Firebase configuration object
// Replace these placeholder values with your actual Firebase project credentials from:
// Firebase Console -> Project Settings -> General -> Your Apps -> SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvMT6HAUYUgCEwhhVLdKUSlTMoAVxjgT8",
  authDomain: "plaasjapie-dating-app.firebaseapp.com",
  projectId: "plaasjapie-dating-app",
  storageBucket: "plaasjapie-dating-app.appspot.com",
  messagingSenderId: "993251130897",
  appId: "1:993251130897:web:d4beb7930175de7244bbb0",
  measurementId: "G-Q21SVTW0E6"
};

// Initialize Firebase with error handling
let app;
let auth;
let firestore;
let storage;

try {
  console.log('Initializing Firebase with config:', JSON.stringify(firebaseConfig));
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
  
  // Initialize Firestore
  firestore = getFirestore(app);
  console.log('Firestore initialized successfully');
  
  // Initialize Firebase Storage
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  
  // Create mock implementations for web if initialization fails
  if (Platform.OS === 'web') {
    console.log('Creating mock implementations for web');
    auth = auth || { currentUser: null };
    firestore = firestore || {};
    storage = storage || {};
    app = app || {};
  }
}

// Remove React Native Firebase initialization code
// let rnFirebase = null;
// let rnAuth = null;
// try {...}

export { auth, firestore, storage };
export default app; 