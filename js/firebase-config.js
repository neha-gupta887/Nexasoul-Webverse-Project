/**
 * Firebase Configuration for EduServe Production
 * 
 * You can configure Firebase in two ways:
 * 1. Directly in this file by updating `firebaseConfig` below, OR
 * 2. In the Admin Dashboard under "⚙️ Database Settings" (saves to browser storage).
 */

const defaultFirebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// State flags
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
let isFirebaseConnected = false;

function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem("eduserve_firebase_config_live");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not parse saved custom Firebase config", e);
  }
  return defaultFirebaseConfig;
}

function isConfigValid(config) {
  return config && 
         typeof config.apiKey === "string" &&
         config.apiKey.length > 10 && 
         !config.apiKey.includes("YOUR_") &&
         typeof config.projectId === "string" &&
         config.projectId.length > 2 &&
         !config.projectId.includes("YOUR_");
}

function initializeFirebaseEngine(config = null) {
  const conf = config || getActiveFirebaseConfig();
  
  if (typeof firebase === "undefined") {
    console.info("Firebase SDK not loaded. Running in local storage mode.");
    isFirebaseConnected = false;
    return false;
  }

  if (isConfigValid(conf)) {
    try {
      if (firebase.apps.length > 0) {
        firebaseApp = firebase.app();
      } else {
        firebaseApp = firebase.initializeApp(conf);
      }
      firebaseAuth = firebase.auth();
      firebaseDb = firebase.firestore();
      firebaseStorage = firebase.storage();
      isFirebaseConnected = true;
      console.log("🔥 Connected to live Google Firebase Project:", conf.projectId);
      return true;
    } catch (error) {
      console.error("Firebase initialization error:", error);
      isFirebaseConnected = false;
      return false;
    }
  } else {
    isFirebaseConnected = false;
    return false;
  }
}

// Initial Run
initializeFirebaseEngine();

// Global exports
window.firebaseConfig = getActiveFirebaseConfig();
window.firebaseApp = firebaseApp;
window.firebaseAuth = firebaseAuth;
window.firebaseDb = firebaseDb;
window.firebaseStorage = firebaseStorage;
window.isFirebaseConnected = () => isFirebaseConnected;
window.reinitializeFirebase = (newConfig) => {
  if (newConfig) {
    localStorage.setItem("eduserve_firebase_config_live", JSON.stringify(newConfig));
  }
  return initializeFirebaseEngine(newConfig);
};
