/**
 * db.js - Unified Production Data & Storage Layer for EduServe
 * Connects directly to Cloud Firestore & Firebase Storage, with automatic
 * resilient persistence fallback.
 */

const DB_KEYS = {
  SERVICES: "eduserve_services_v1",
  REQUESTS: "eduserve_requests_v1"
};

class DataService {
  constructor() {
    this.services = [];
    this.requests = [];
    this.initialized = false;
    this.listeners = [];
  }

  /**
   * Initialize local dataset from seed data or Firestore
   */
  async init() {
    if (this.initialized) return;

    if (window.isFirebaseConnected && window.isFirebaseConnected()) {
      try {
        await this.syncFromFirebase();
        this.setupFirebaseListeners();
        this.initialized = true;
        console.log("🔥 Connected to Firebase Firestore");
        return;
      } catch (err) {
        console.warn("⚠️ Firestore sync failed, loading fallback local storage:", err);
      }
    }

    // Local Storage Initialization
    this.loadFromLocalStorage();
    this.initialized = true;
    this.notifySubscribers();
  }

  loadFromLocalStorage() {
    try {
      const storedServices = localStorage.getItem(DB_KEYS.SERVICES);
      if (storedServices) {
        this.services = JSON.parse(storedServices);
      } else if (typeof SEED_SERVICES !== "undefined") {
        this.services = [...SEED_SERVICES];
        this.saveServicesLocally();
      }

      const storedRequests = localStorage.getItem(DB_KEYS.REQUESTS);
      if (storedRequests) {
        this.requests = JSON.parse(storedRequests);
      } else if (typeof SEED_REQUESTS !== "undefined") {
        this.requests = [...SEED_REQUESTS];
        this.saveRequestsLocally();
      }
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
      this.services = typeof SEED_SERVICES !== "undefined" ? [...SEED_SERVICES] : [];
      this.requests = typeof SEED_REQUESTS !== "undefined" ? [...SEED_REQUESTS] : [];
    }
  }

  saveServicesLocally() {
    try {
      localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(this.services));
    } catch (e) {
      console.error("Error saving services to localStorage:", e);
    }
  }

  saveRequestsLocally() {
    try {
      localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify(this.requests));
    } catch (e) {
      console.error("Error saving requests to localStorage:", e);
    }
  }

  /* =========================================================================
   * FIREBASE SYNC & REALTIME LISTENERS
   * ========================================================================= */
  async syncFromFirebase() {
    const db = window.firebaseDb;
    if (!db) return;

    // Load Services from Firestore
    const servicesSnap = await db.collection("services").get();
    if (!servicesSnap.empty) {
      this.services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else if (typeof SEED_SERVICES !== "undefined") {
      // Seed initial services if empty
      const batch = db.batch();
      SEED_SERVICES.forEach(service => {
        const docRef = db.collection("services").doc(service.id);
        batch.set(docRef, service);
      });
      await batch.commit();
      this.services = [...SEED_SERVICES];
    }

    // Load Requests from Firestore
    const requestsSnap = await db.collection("requests").orderBy("createdAt", "desc").get();
    if (!requestsSnap.empty) {
      this.requests = requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else if (typeof SEED_REQUESTS !== "undefined") {
      const batch = db.batch();
      SEED_REQUESTS.forEach(req => {
        const docRef = db.collection("requests").doc(req.id);
        batch.set(docRef, req);
      });
      await batch.commit();
      this.requests = [...SEED_REQUESTS];
    }
  }

  setupFirebaseListeners() {
    const db = window.firebaseDb;
    if (!db) return;

    // Realtime Services Listener
    db.collection("services").onSnapshot(snapshot => {
      this.services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.saveServicesLocally();
      this.notifySubscribers("services-sync");
    }, err => console.error("Firebase services listen error:", err));

    // Realtime Requests Listener
    db.collection("requests").orderBy("createdAt", "desc").onSnapshot(snapshot => {
      this.requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.saveRequestsLocally();
      this.notifySubscribers("requests-sync");
    }, err => console.error("Firebase requests listen error:", err));
  }

  /* =========================================================================
   * SERVICES CRUD OPERATIONS
   * ========================================================================= */
  async getServices() {
    await this.init();
    return [...this.services];
  }

  async getServiceById(id) {
    await this.init();
    return this.services.find(s => s.id === id) || null;
  }

  async addService(serviceData) {
    await this.init();
    const id = serviceData.id || `srv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newService = {
      id,
      name: serviceData.name.trim(),
      category: serviceData.category || "Academic",
      price: parseFloat(serviceData.price) || 20,
      turnaround: serviceData.turnaround || "24-48 Hours",
      rating: parseFloat(serviceData.rating) || 5.0,
      reviewsCount: parseInt(serviceData.reviewsCount) || 1,
      badge: serviceData.badge || "Featured",
      description: serviceData.description.trim(),
      features: Array.isArray(serviceData.features) 
        ? serviceData.features 
        : (serviceData.features || "").split("\n").map(f => f.trim()).filter(Boolean),
      icon: serviceData.icon || "academic-cap",
      image: serviceData.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      createdAt: new Date().toISOString()
    };

    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseDb) {
      await window.firebaseDb.collection("services").doc(id).set(newService);
    }

    this.services.unshift(newService);
    this.saveServicesLocally();
    this.notifySubscribers("service-added", newService);
    return newService;
  }

  async updateService(id, updatedFields) {
    await this.init();
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Service not found");

    if (typeof updatedFields.features === "string") {
      updatedFields.features = updatedFields.features.split("\n").map(f => f.trim()).filter(Boolean);
    }
    if (updatedFields.price) {
      updatedFields.price = parseFloat(updatedFields.price);
    }

    const updatedService = {
      ...this.services[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseDb) {
      await window.firebaseDb.collection("services").doc(id).set(updatedService, { merge: true });
    }

    this.services[index] = updatedService;
    this.saveServicesLocally();
    this.notifySubscribers("service-updated", updatedService);
    return updatedService;
  }

  async deleteService(id) {
    await this.init();
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Service not found");

    const deleted = this.services.splice(index, 1)[0];

    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseDb) {
      await window.firebaseDb.collection("services").doc(id).delete();
    }

    this.saveServicesLocally();
    this.notifySubscribers("service-deleted", deleted);
    return deleted;
  }

  /* =========================================================================
   * STUDENT REQUESTS CRUD OPERATIONS
   * ========================================================================= */
  async getAllRequests() {
    await this.init();
    return [...this.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getRequestById(id) {
    await this.init();
    if (!id) return null;
    return this.requests.find(r => r.id.toLowerCase() === id.trim().toLowerCase()) || null;
  }

  async getRequestsByEmail(email) {
    await this.init();
    if (!email) return [];
    const term = email.trim().toLowerCase();
    return this.requests.filter(r => 
      (r.studentEmail && r.studentEmail.toLowerCase() === term) ||
      (r.studentPhone && r.studentPhone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) ||
      (r.id && r.id.toLowerCase() === term)
    );
  }

  generateRequestId() {
    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `REQ-${year}-${randomCode}`;
  }

  async createRequest(data) {
    await this.init();
    
    let fileInfo = {
      fileName: data.fileName || null,
      fileSize: data.fileSize || null,
      fileUrl: data.fileUrl || null
    };

    // If a raw File is provided and Firebase Storage is connected
    if (data.rawFile && window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseStorage) {
      try {
        fileInfo = await this.uploadFileToFirebase(data.rawFile);
      } catch (err) {
        console.warn("Firebase Storage upload failed, keeping file metadata:", err);
      }
    }

    const requestId = this.generateRequestId();
    const newRequest = {
      id: requestId,
      studentName: data.studentName ? data.studentName.trim() : "Student",
      studentEmail: data.studentEmail ? data.studentEmail.trim().toLowerCase() : "",
      studentPhone: data.studentPhone ? data.studentPhone.trim() : "",
      university: data.university ? data.university.trim() : "Not Specified",
      serviceId: data.serviceId || "",
      serviceName: data.serviceName || "Academic Service",
      servicePrice: parseFloat(data.servicePrice) || 0,
      instructions: data.instructions ? data.instructions.trim() : "",
      deadline: data.deadline || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
      priority: data.priority || "Normal",
      status: "Pending", // Default: Pending, Accepted, In Progress, Completed, Cancelled
      adminNotes: "New request registered. Assigned to review queue.",
      fileName: fileInfo.fileName,
      fileSize: fileInfo.fileSize,
      fileUrl: fileInfo.fileUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseDb) {
      await window.firebaseDb.collection("requests").doc(requestId).set(newRequest);
    }

    this.requests.unshift(newRequest);
    this.saveRequestsLocally();
    this.notifySubscribers("request-created", newRequest);
    return newRequest;
  }

  async updateRequestStatus(id, newStatus, adminNotes = null) {
    await this.init();
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Request not found");

    const validStatuses = ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const updatePayload = {
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    if (adminNotes !== null && adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes.trim();
    }

    const updatedRequest = {
      ...this.requests[index],
      ...updatePayload
    };

    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseDb) {
      await window.firebaseDb.collection("requests").doc(id).set(updatedRequest, { merge: true });
    }

    this.requests[index] = updatedRequest;
    this.saveRequestsLocally();
    this.notifySubscribers("request-updated", updatedRequest);
    return updatedRequest;
  }

  async deleteRequest(id) {
    await this.init();
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Request not found");

    const deleted = this.requests.splice(index, 1)[0];

    if (window.isFirebaseConnected && window.isFirebaseConnected() && window.firebaseDb) {
      await window.firebaseDb.collection("requests").doc(id).delete();
    }

    this.saveRequestsLocally();
    this.notifySubscribers("request-deleted", deleted);
    return deleted;
  }

  /* =========================================================================
   * FILE UPLOAD (Firebase Storage with Local Base64 preview)
   * ========================================================================= */
  async uploadFileToFirebase(file) {
    const storage = window.firebaseStorage;
    if (!storage) throw new Error("Firebase Storage not available");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileRef = storage.ref().child(`requests/${Date.now()}_${safeName}`);
    const snapshot = await fileRef.put(file);
    const downloadUrl = await snapshot.ref.getDownloadURL();

    return {
      fileName: file.name,
      fileSize: this.formatFileSize(file.size),
      fileUrl: downloadUrl
    };
  }

  async processLocalFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      const fileSize = this.formatFileSize(file.size);

      if (file.size < 2 * 1024 * 1024) {
        reader.onload = () => {
          resolve({
            fileName: file.name,
            fileSize: fileSize,
            fileUrl: reader.result
          });
        };
        reader.onerror = () => {
          resolve({
            fileName: file.name,
            fileSize: fileSize,
            fileUrl: null
          });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({
          fileName: file.name,
          fileSize: fileSize,
          fileUrl: null
        });
      }
    });
  }

  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  /* =========================================================================
   * EXPORT & INVOICE UTILITIES
   * ========================================================================= */
  exportRequestsCSV() {
    if (!this.requests || this.requests.length === 0) return;

    const headers = ["Request ID", "Student Name", "Email", "Phone", "University", "Service", "Price ($)", "Status", "Deadline", "Created Date"];
    const rows = this.requests.map(r => [
      `"${r.id}"`,
      `"${r.studentName || ''}"`,
      `"${r.studentEmail || ''}"`,
      `"${r.studentPhone || ''}"`,
      `"${r.university || ''}"`,
      `"${r.serviceName || ''}"`,
      r.servicePrice || 0,
      `"${r.status}"`,
      `"${r.deadline || ''}"`,
      `"${r.createdAt || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eduserve_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* =========================================================================
   * SUBSCRIBER NOTIFICATIONS
   * ========================================================================= */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifySubscribers(eventType, data) {
    this.listeners.forEach(cb => {
      try {
        cb(eventType, data);
      } catch (err) {
        console.error("Subscriber notification error:", err);
      }
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("eduserve-data-change", {
        detail: { eventType, data }
      }));
    }
  }
}

// Global Singleton Instance
window.dbService = new DataService();
