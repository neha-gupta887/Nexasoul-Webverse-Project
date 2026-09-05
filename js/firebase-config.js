/**
 * Firebase Configuration for EduServe
 * 
 * TO CONNECT REAL FIREBASE:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new Firebase project (e.g. "student-services-app")
 * 3. In Project Settings, add a Web App ("</>") and copy your firebaseConfig below.
 * 4. In Firebase Console:
 *    - Enable Authentication (Email/Password & Google)
 *    - Enable Cloud Firestore (Start in test mode or production with rules)
 *    - Enable Storage (For student file uploads)
 * 5. Paste your config values into the `firebaseConfig` object below!
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// State flags
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
let isFirebaseConnected = false;

// Check if valid Firebase configuration is present
function isConfigured(config) {
  return config && 
         config.apiKey && 
         config.apiKey !== "YOUR_API_KEY_HERE" && 
         config.projectId && 
         config.projectId !== "YOUR_PROJECT_ID";
}

// Initialize Firebase safely
try {
  if (typeof firebase !== "undefined" && isConfigured(firebaseConfig)) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseAuth = firebase.auth();
    firebaseDb = firebase.firestore();
    firebaseStorage = firebase.storage();
    isFirebaseConnected = true;
    console.log("🔥 Firebase initialized successfully!");
  } else {
    console.info("⚡ EduServe running with Hybrid Local Storage engine (Firebase config can be added in js/firebase-config.js)");
  }
} catch (error) {
  console.warn("⚠️ Firebase init fallback: Running in robust offline/local storage mode.", error);
  isFirebaseConnected = false;
}

// Export for global access
window.firebaseConfig = firebaseConfig;
window.firebaseApp = firebaseApp;
window.firebaseAuth = firebaseAuth;
window.firebaseDb = firebaseDb;
window.firebaseStorage = firebaseStorage;
window.isFirebaseConnected = () => isFirebaseConnected;
