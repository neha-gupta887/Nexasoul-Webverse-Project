/**
 * auth.js - Production Authentication & Admin Session Manager
 * Full support for Firebase Authentication and custom administrator credentials.
 */

const AUTH_KEYS = {
  ADMIN_SESSION: "eduserve_admin_session_live",
  CUSTOM_ADMIN: "eduserve_custom_admin_creds",
  REMEMBER_STUDENT: "eduserve_student_email_v1"
};

// Default initial admin setup if no custom credentials are saved yet
const INITIAL_ADMIN = {
  email: "admin@campus.edu",
  passwordHash: "admin123", // Default starter password, can be changed in Admin settings
  displayName: "System Administrator",
  role: "superadmin"
};

class AuthService {
  constructor() {
    this.currentAdmin = null;
    this.authListeners = [];
    this.init();
  }

  init() {
    // Check saved session
    try {
      const saved = sessionStorage.getItem(AUTH_KEYS.ADMIN_SESSION) || localStorage.getItem(AUTH_KEYS.ADMIN_SESSION);
      if (saved) {
        this.currentAdmin = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not restore admin session", e);
    }

    // Check Firebase Auth state if Firebase is live
    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseAuth) {
      window.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          this.currentAdmin = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Admin",
            role: "admin",
            provider: "firebase"
          };
          sessionStorage.setItem(AUTH_KEYS.ADMIN_SESSION, JSON.stringify(this.currentAdmin));
        } else if (this.currentAdmin && this.currentAdmin.provider === "firebase") {
          this.currentAdmin = null;
          sessionStorage.removeItem(AUTH_KEYS.ADMIN_SESSION);
          localStorage.removeItem(AUTH_KEYS.ADMIN_SESSION);
        }
        this.notifyAuthChange();
      });
    }
  }

  getAdminCredentials() {
    try {
      const custom = localStorage.getItem(AUTH_KEYS.CUSTOM_ADMIN);
      if (custom) return JSON.parse(custom);
    } catch (e) {}
    return INITIAL_ADMIN;
  }

  updateAdminPassword(newEmail, newPassword) {
    const creds = {
      email: newEmail.trim().toLowerCase(),
      passwordHash: newPassword.trim(),
      displayName: "Administrator",
      role: "superadmin"
    };
    localStorage.setItem(AUTH_KEYS.CUSTOM_ADMIN, JSON.stringify(creds));
    return true;
  }

  /**
   * Log in Administrator
   */
  async loginAdmin(email, password, remember = false) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Try Live Firebase Auth first if connected
    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseAuth) {
      try {
        const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(cleanEmail, cleanPass);
        const user = userCredential.user;
        this.currentAdmin = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Admin",
          role: "admin",
          provider: "firebase"
        };
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(AUTH_KEYS.ADMIN_SESSION, JSON.stringify(this.currentAdmin));
        this.notifyAuthChange();
        return { success: true, user: this.currentAdmin, message: "Signed in via Firebase Authentication." };
      } catch (fbError) {
        // Fallback to local admin credentials check if Firebase user is not found
        console.info("Firebase Auth login attempt:", fbError.message);
      }
    }

    // 2. Authenticate against configured Admin credentials
    const currentCreds = this.getAdminCredentials();
    if (cleanEmail === currentCreds.email.toLowerCase() && cleanPass === currentCreds.passwordHash) {
      this.currentAdmin = {
        uid: "admin-master",
        email: currentCreds.email,
        displayName: currentCreds.displayName || "Administrator",
        role: "admin",
        provider: "local"
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_KEYS.ADMIN_SESSION, JSON.stringify(this.currentAdmin));
      this.notifyAuthChange();
      return { success: true, user: this.currentAdmin, message: "Welcome back, Administrator!" };
    }

    throw new Error("Invalid admin email or password. Please verify your credentials.");
  }

  /**
   * Log out Administrator
   */
  async logoutAdmin() {
    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseAuth) {
      try {
        await window.firebaseAuth.signOut();
      } catch (e) {
        console.warn("Firebase signout error:", e);
      }
    }

    this.currentAdmin = null;
    sessionStorage.removeItem(AUTH_KEYS.ADMIN_SESSION);
    localStorage.removeItem(AUTH_KEYS.ADMIN_SESSION);
    this.notifyAuthChange();
    return true;
  }

  isAdmin() {
    return this.currentAdmin !== null;
  }

  getCurrentUser() {
    return this.currentAdmin;
  }

  saveRecentStudentEmail(email) {
    if (email) {
      localStorage.setItem(AUTH_KEYS.REMEMBER_STUDENT, email.trim().toLowerCase());
    }
  }

  getRecentStudentEmail() {
    return localStorage.getItem(AUTH_KEYS.REMEMBER_STUDENT) || "";
  }

  onAuthChange(callback) {
    this.authListeners.push(callback);
    return () => {
      this.authListeners = this.authListeners.filter(cb => cb !== callback);
    };
  }

  notifyAuthChange() {
    this.authListeners.forEach(cb => {
      try {
        cb(this.currentAdmin);
      } catch (e) {
        console.error("Auth listener error", e);
      }
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("eduserve-auth-change", {
        detail: { user: this.currentAdmin, isAdmin: this.isAdmin() }
      }));
    }
  }
}

window.authService = new AuthService();
