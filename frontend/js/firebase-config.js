// Firebase Configuration
// IMPORTANT: Replace these values with your Firebase project configuration
// You can find these in Firebase Console > Project Settings > General > Your apps
// 
// Steps to get your Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (or create a new one)
// 3. Click the gear icon > Project Settings
// 4. Scroll down to "Your apps" section
// 5. If you don't have a web app, click "Add app" and select Web (</> icon)
// 6. Copy the config values from the firebaseConfig object

const firebaseConfig = {
  apiKey: "AIzaSyDH2r9HJ54fRzT44h5S2_kGfsw6B2vjRng",
  authDomain: "showease-45d3e.firebaseapp.com",
  projectId: "showease-45d3e",
  storageBucket: "showease-45d3e.firebasestorage.app",
  messagingSenderId: "730940825688",
  appId: "1:730940825688:web:957ad68b44c39715416a2d",
  measurementId: "G-X6XZLLQWYJ"
};

// Initialize Firebase if not already initialized
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

