/**
 * auth.js - Authentication & Admin Session Management
 * Provides Firebase Authentication integration alongside instant Demo Admin
 * quick-access for effortless testing and evaluation.
 */

const AUTH_KEYS = {
  ADMIN_SESSION: "eduserve_admin_session_v1",
  REMEMBER_STUDENT: "eduserve_student_email_v1"
};

// Demo Admin Credentials for instant evaluation
const DEMO_ADMIN = {
  email: "admin@campus.edu",
  password: "admin123",
  displayName: "Campus Administrator",
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

    // Listen to Firebase Auth state if configured
    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseAuth) {
      window.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          this.currentAdmin = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Firebase Admin",
            role: "admin",
            provider: "firebase"
          };
          sessionStorage.setItem(AUTH_KEYS.ADMIN_SESSION, JSON.stringify(this.currentAdmin));
        }
        this.notifyAuthChange();
      });
    }
  }

  /**
   * Log in Administrator
   */
  async loginAdmin(email, password, remember = false) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Demo Admin Credentials
    if (cleanEmail === DEMO_ADMIN.email.toLowerCase() && cleanPass === DEMO_ADMIN.password) {
      this.currentAdmin = {
        uid: "demo-admin-01",
        email: DEMO_ADMIN.email,
        displayName: DEMO_ADMIN.displayName,
        role: DEMO_ADMIN.role,
        provider: "demo"
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_KEYS.ADMIN_SESSION, JSON.stringify(this.currentAdmin));
      this.notifyAuthChange();
      return { success: true, user: this.currentAdmin, message: "Welcome, Administrator!" };
    }

    // 2. Check Firebase Authentication if connected
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
        return { success: true, user: this.currentAdmin, message: "Logged in via Firebase Auth!" };
      } catch (fbError) {
        throw new Error(fbError.message || "Invalid Firebase credentials.");
      }
    }

    throw new Error("Invalid admin email or password. Use demo credentials (admin@campus.edu / admin123) or configure Firebase Auth.");
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

  // Student recent email remembrance for convenience
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
window.DEMO_ADMIN_CREDENTIALS = DEMO_ADMIN;
