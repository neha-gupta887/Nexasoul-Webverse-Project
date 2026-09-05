/**
 * app.js - Main Application Controller for EduServe
 * Coordinates view routing, services catalog, request submission,
 * student tracking dashboard, and the full admin management portal.
 */

class AppController {
  constructor() {
    this.currentView = "home";
    this.selectedServiceForRequest = null;
    this.uploadedFile = null;
    this.editingServiceId = null;
    this.adminActiveTab = "overview";
    this.studentActiveFilter = "all";
    this.servicesCategoryFilter = "all";
    this.searchQuery = "";
  }

  async init() {
    // Initialize Database & Auth
    await window.dbService.init();
    
    // Set up Event Listeners
    this.setupNavigation();
    this.setupRouting();
    this.setupServicesCatalog();
    this.setupRequestForm();
    this.setupStudentDashboard();
    this.setupAdminPortal();
    this.setupModals();

    // Listen to data mutations
    window.dbService.subscribe((eventType, data) => {
      this.handleDataChange(eventType, data);
    });

    // Check recent student session email
    const savedEmail = window.authService.getRecentStudentEmail();
    if (savedEmail) {
      const emailInput = document.getElementById("studentTrackInput");
      if (emailInput && !emailInput.value) {
        emailInput.value = savedEmail;
      }
    }

    // Set initial view from URL hash or default to home
    const initialHash = window.location.hash.replace("#", "") || "home";
    this.navigateTo(initialHash);
    
    // Initial Render
    this.renderServices();
  }

  /* =========================================================================
   * NAVIGATION & ROUTING
   * ========================================================================= */
  setupNavigation() {
    // Mobile menu toggle
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-open");
      });
    }

    // Nav Links
    document.querySelectorAll("[data-navigate]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = el.getAttribute("data-navigate");
        const serviceId = el.getAttribute("data-service-id");
        this.navigateTo(targetView, { serviceId });
        if (navMenu) navMenu.classList.remove("mobile-open");
      });
    });

    // Admin Auth State Changes
    window.authService.onAuthChange((adminUser) => {
      this.updateAuthNavState(adminUser);
    });
    this.updateAuthNavState(window.authService.getCurrentUser());
  }

  setupRouting() {
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "home";
      this.navigateTo(hash, {}, false);
    });
  }

  navigateTo(viewId, params = {}, updateHash = true) {
    const views = document.querySelectorAll(".view-section");
    let targetView = document.getElementById(`view-${viewId}`);

    // If target view does not exist, default to home
    if (!targetView) {
      viewId = "home";
      targetView = document.getElementById("view-home");
    }

    // Route Protection for Admin Dashboard
    if (viewId === "admin-dashboard" && !window.authService.isAdmin()) {
      this.showToast("info", "Admin Access Required", "Please log in to access the administrator dashboard.");
      viewId = "admin-login";
      targetView = document.getElementById("view-admin-login");
    }

    // Switch visible view
    views.forEach(v => v.style.display = "none");
    if (targetView) targetView.style.display = "block";

    this.currentView = viewId;
    if (updateHash) {
      window.location.hash = viewId;
    }

    // Update active state in nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-navigate") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // View-specific trigger actions
    if (viewId === "services") {
      this.renderServices();
    } else if (viewId === "student-dashboard") {
      this.renderStudentDashboard();
    } else if (viewId === "admin-dashboard") {
      this.renderAdminDashboard();
    } else if (viewId === "request") {
      if (params && params.serviceId) {
        this.prefillRequestForm(params.serviceId);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateAuthNavState(adminUser) {
    const adminNavBtn = document.getElementById("navAdminAction");
    if (!adminNavBtn) return;

    if (adminUser) {
      adminNavBtn.textContent = "Admin Portal";
      adminNavBtn.setAttribute("data-navigate", "admin-dashboard");
      adminNavBtn.className = "btn btn-sm btn-primary";
    } else {
      adminNavBtn.textContent = "Admin Login";
      adminNavBtn.setAttribute("data-navigate", "admin-login");
      adminNavBtn.className = "btn btn-sm btn-outline";
    }
  }

  /* =========================================================================
   * SERVICES CATALOG CONTROLLER
   * ========================================================================= */
  setupServicesCatalog() {
    // Category Filter Buttons
    const filterContainer = document.getElementById("categoryFilters");
    if (filterContainer) {
      filterContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-btn");
        if (!btn) return;
        filterContainer.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.servicesCategoryFilter = btn.getAttribute("data-category");
        this.renderServices();
      });
    }

    // Search Input
    const searchInput = document.getElementById("serviceSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderServices();
      });
    }
  }

  async renderServices() {
    const servicesGrid = document.getElementById("servicesGrid");
    const homePreviewGrid = document.getElementById("homeServicesPreview");
    if (!servicesGrid && !homePreviewGrid) return;

    const allServices = await window.dbService.getServices();

    // Filter by Category & Search
    let filtered = allServices.filter(service => {
      const matchCategory = this.servicesCategoryFilter === "all" || 
        service.category.toLowerCase() === this.servicesCategoryFilter.toLowerCase();
      
      const matchSearch = !this.searchQuery || 
        service.name.toLowerCase().includes(this.searchQuery) ||
        service.description.toLowerCase().includes(this.searchQuery) ||
        service.category.toLowerCase().includes(this.searchQuery);

      return matchCategory && matchSearch;
    });

    const createServiceCardHTML = (srv) => `
      <article class="service-card" data-service-id="${srv.id}">
        <div class="service-image-wrap">
          <img src="${srv.image}" alt="${srv.name}" class="service-image" loading="lazy" />
          <span class="service-badge-pill">${srv.badge || 'Featured'}</span>
          <span class="service-category-pill">${srv.category}</span>
        </div>
        <div class="service-body">
          <div class="service-meta">
            <div class="service-rating">
              <span class="star">★</span>
              <span>${srv.rating || '5.0'} (${srv.reviewsCount || 10})</span>
            </div>
            <div class="service-turnaround">
              <span>⏱ ${srv.turnaround || '2-3 Days'}</span>
            </div>
          </div>
          <h3 class="service-title">${srv.name}</h3>
          <p class="service-desc">${srv.description}</p>
          <ul class="service-features-list">
            ${(srv.features || []).slice(0, 3).map(f => `
              <li><span class="check-icon">✓</span> ${f}</li>
            `).join("")}
          </ul>
          <div class="service-footer">
            <div class="service-price-block">
              <span class="price-label">Starting at</span>
              <span class="price-value">$${srv.price}</span>
            </div>
            <button class="btn btn-primary btn-sm btn-request-srv" data-service-id="${srv.id}">
              Request Service ➔
            </button>
          </div>
        </div>
      </article>
    `;

    // Render in main Services page
    if (servicesGrid) {
      if (filtered.length === 0) {
        servicesGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🔍</div>
            <h3>No services found</h3>
            <p>Try clearing your search query or selecting another category.</p>
            <button class="btn btn-secondary btn-sm" onclick="app.resetServiceFilters()">Reset Filters</button>
          </div>
        `;
      } else {
        servicesGrid.innerHTML = filtered.map(createServiceCardHTML).join("");
      }
    }

    // Render in Home Featured Preview
    if (homePreviewGrid) {
      homePreviewGrid.innerHTML = allServices.slice(0, 4).map(createServiceCardHTML).join("");
    }

    // Attach click handlers to "Request Service" buttons
    document.querySelectorAll(".btn-request-srv").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const srvId = btn.getAttribute("data-service-id");
        this.openRequestModalOrPage(srvId);
      });
    });

    // Populate Request form service dropdown
    this.populateServicesDropdown(allServices);
  }

  resetServiceFilters() {
    this.servicesCategoryFilter = "all";
    this.searchQuery = "";
    const searchInput = document.getElementById("serviceSearchInput");
    if (searchInput) searchInput.value = "";
    const filterContainer = document.getElementById("categoryFilters");
    if (filterContainer) {
      filterContainer.querySelectorAll(".category-btn").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-category") === "all");
      });
    }
    this.renderServices();
  }

  populateServicesDropdown(services) {
    const select = document.getElementById("reqServiceSelect");
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = `<option value="" disabled selected>-- Select a Service --</option>` +
      services.map(s => `
        <option value="${s.id}" data-price="${s.price}" data-name="${s.name}">
          ${s.name} ($${s.price}) - ${s.turnaround}
        </option>
      `).join("");

    if (currentVal) select.value = currentVal;
  }

  /* =========================================================================
   * STUDENT REQUEST FORM CONTROLLER
   * ========================================================================= */
  setupRequestForm() {
    const form = document.getElementById("studentRequestForm");
    const fileInput = document.getElementById("reqFileInput");
    const dropBox = document.getElementById("reqFileDropBox");
    const previewCard = document.getElementById("filePreviewCard");
    const removeFileBtn = document.getElementById("removeFileBtn");
    const serviceSelect = document.getElementById("reqServiceSelect");

    // Service dropdown change -> update price badge
    if (serviceSelect) {
      serviceSelect.addEventListener("change", () => {
        const opt = serviceSelect.options[serviceSelect.selectedIndex];
        const price = opt ? opt.getAttribute("data-price") : "0";
        const priceBadge = document.getElementById("reqSelectedPrice");
        if (priceBadge) priceBadge.textContent = `$${price}`;
      });
    }

    // File Drag and Drop
    if (dropBox && fileInput) {
      ["dragenter", "dragover"].forEach(event => {
        dropBox.addEventListener(event, (e) => {
          e.preventDefault();
          dropBox.classList.add("dragover");
        });
      });

      ["dragleave", "drop"].forEach(event => {
        dropBox.addEventListener(event, (e) => {
          e.preventDefault();
          dropBox.classList.remove("dragover");
        });
      });

      dropBox.addEventListener("drop", (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFileSelected(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFileSelected(e.target.files[0]);
        }
      });
    }

    if (removeFileBtn) {
      removeFileBtn.addEventListener("click", () => {
        this.uploadedFile = null;
        if (fileInput) fileInput.value = "";
        if (previewCard) previewCard.style.display = "none";
        if (dropBox) dropBox.style.display = "block";
      });
    }

    // Form Submission
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleRequestSubmit(form);
      });
    }
  }

  handleFileSelected(file) {
    const previewCard = document.getElementById("filePreviewCard");
    const dropBox = document.getElementById("reqFileDropBox");
    const fileNameEl = document.getElementById("previewFileName");
    const fileSizeEl = document.getElementById("previewFileSize");

    this.uploadedFile = file;

    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = window.dbService.formatFileSize(file.size);

    if (dropBox) dropBox.style.display = "none";
    if (previewCard) previewCard.style.display = "flex";
  }

  openRequestModalOrPage(serviceId) {
    this.navigateTo("request", { serviceId });
  }

  async prefillRequestForm(serviceId) {
    const service = await window.dbService.getServiceById(serviceId);
    if (!service) return;

    const select = document.getElementById("reqServiceSelect");
    if (select) {
      select.value = service.id;
      const priceBadge = document.getElementById("reqSelectedPrice");
      if (priceBadge) priceBadge.textContent = `$${service.price}`;
    }

    // Scroll to request container
    const reqFormCard = document.getElementById("requestFormContainer");
    if (reqFormCard) {
      reqFormCard.scrollIntoView({ behavior: "smooth" });
    }
  }

  async handleRequestSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting Request...</span>`;

      const studentName = document.getElementById("reqStudentName").value.trim();
      const studentEmail = document.getElementById("reqStudentEmail").value.trim();
      const studentPhone = document.getElementById("reqStudentPhone").value.trim();
      const university = document.getElementById("reqUniversity").value.trim();
      const serviceSelect = document.getElementById("reqServiceSelect");
      const instructions = document.getElementById("reqInstructions").value.trim();
      const deadline = document.getElementById("reqDeadline").value;
      const priority = document.getElementById("reqPriority").value;

      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const serviceId = serviceSelect.value;
      const serviceName = selectedOption ? selectedOption.getAttribute("data-name") : "Academic Service";
      const servicePrice = selectedOption ? parseFloat(selectedOption.getAttribute("data-price")) : 0;

      // Process uploaded file
      let fileData = { fileName: null, fileSize: null, fileUrl: null };
      if (this.uploadedFile) {
        fileData = await window.dbService.processLocalFile(this.uploadedFile);
      }

      const newRequest = await window.dbService.createRequest({
        studentName,
        studentEmail,
        studentPhone,
        university,
        serviceId,
        serviceName,
        servicePrice,
        instructions,
        deadline,
        priority,
        rawFile: this.uploadedFile,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileUrl: fileData.fileUrl
      });

      // Save student email for effortless dashboard access
      window.authService.saveRecentStudentEmail(studentEmail);

      // Reset form
      form.reset();
      this.uploadedFile = null;
      const previewCard = document.getElementById("filePreviewCard");
      const dropBox = document.getElementById("reqFileDropBox");
      if (previewCard) previewCard.style.display = "none";
      if (dropBox) dropBox.style.display = "block";

      // Show Confirmation Modal with Tracking ID
      this.showRequestSuccessModal(newRequest);
      this.showToast("success", "Request Submitted!", `Your order ${newRequest.id} is now registered.`);
    } catch (err) {
      console.error("Submission error:", err);
      this.showToast("error", "Submission Failed", err.message || "Please check required fields.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  showRequestSuccessModal(req) {
    const modal = document.getElementById("requestSuccessModal");
    if (!modal) return;

    document.getElementById("successReqId").textContent = req.id;
    document.getElementById("successStudentName").textContent = req.studentName;
    document.getElementById("successServiceName").textContent = req.serviceName;
    document.getElementById("successDeadline").textContent = new Date(req.deadline).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    const trackBtn = document.getElementById("modalTrackBtn");
    if (trackBtn) {
      trackBtn.onclick = () => {
        this.closeModal("requestSuccessModal");
        const trackInput = document.getElementById("studentTrackInput");
        if (trackInput) trackInput.value = req.id;
        this.navigateTo("student-dashboard");
      };
    }

    this.openModal("requestSuccessModal");
  }

  /* =========================================================================
   * STUDENT DASHBOARD CONTROLLER (Track Requests)
   * ========================================================================= */
  setupStudentDashboard() {
    const searchInput = document.getElementById("studentTrackInput");
    const searchBtn = document.getElementById("btnSearchTrack");
    const filterNav = document.getElementById("studentStatusFilters");

    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", () => this.renderStudentDashboard());
      searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") this.renderStudentDashboard();
      });
    }

    if (filterNav) {
      filterNav.addEventListener("click", (e) => {
        const btn = e.target.closest(".status-tab-btn");
        if (!btn) return;
        filterNav.querySelectorAll(".status-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.studentActiveFilter = btn.getAttribute("data-status");
        this.renderStudentDashboard();
      });
    }
  }

  async renderStudentDashboard() {
    const container = document.getElementById("studentRequestsContainer");
    const searchInput = document.getElementById("studentTrackInput");
    if (!container) return;

    const searchTerm = searchInput ? searchInput.value.trim() : "";
    let requests = await window.dbService.getAllRequests();

    // If search term provided, filter by email, phone, or specific ID
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      requests = requests.filter(r => 
        (r.id && r.id.toLowerCase().includes(term)) ||
        (r.studentEmail && r.studentEmail.toLowerCase().includes(term)) ||
        (r.studentPhone && r.studentPhone.includes(term)) ||
        (r.studentName && r.studentName.toLowerCase().includes(term))
      );
    }

    // Update status counts badges
    this.updateStudentDashboardCounts();

    // Filter by Active Tab
    if (this.studentActiveFilter !== "all") {
      requests = requests.filter(r => r.status.toLowerCase() === this.studentActiveFilter.toLowerCase());
    }

    if (requests.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
          <div class="empty-state-icon">📦</div>
          <h3>No requests found</h3>
          <p>${searchTerm ? `No requests matching "${searchTerm}". Try searching your exact email or Request ID.` : 'You haven\'t submitted any requests yet.'}</p>
          <button class="btn btn-primary btn-sm" data-navigate="services">Explore Available Services</button>
        </div>
      `;
      container.querySelector("[data-navigate]")?.addEventListener("click", () => this.navigateTo("services"));
      return;
    }

    container.innerHTML = requests.map(req => this.createStudentRequestCard(req)).join("");

    // Attach cancel request buttons
    container.querySelectorAll(".btn-cancel-request").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-request-id");
        if (confirm(`Are you sure you want to cancel request ${id}?`)) {
          await window.dbService.updateRequestStatus(id, "Cancelled", "Cancelled by student request.");
          this.showToast("info", "Request Cancelled", `Request ${id} has been marked as Cancelled.`);
          this.renderStudentDashboard();
        }
      });
    });
  }

  async updateStudentDashboardCounts() {
    const all = await window.dbService.getAllRequests();
    const countMap = {
      all: all.length,
      pending: all.filter(r => r.status === "Pending").length,
      accepted: all.filter(r => r.status === "Accepted").length,
      "in progress": all.filter(r => r.status === "In Progress").length,
      completed: all.filter(r => r.status === "Completed").length,
      cancelled: all.filter(r => r.status === "Cancelled").length
    };

    Object.keys(countMap).forEach(key => {
      const badge = document.querySelector(`.status-tab-btn[data-status="${key}"] .count-badge`);
      if (badge) badge.textContent = countMap[key];
    });
  }

  createStudentRequestCard(req) {
    const statusClass = `badge-${req.status.toLowerCase().replace(/\s+/g, '')}`;
    const deadlineDate = new Date(req.deadline);
    const isUrgent = deadlineDate < new Date(Date.now() + 86400000);
    const deadlineFormatted = isNaN(deadlineDate) ? req.deadline : deadlineDate.toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Calculate stepper state
    const statuses = ["Pending", "Accepted", "In Progress", "Completed"];
    const currentIdx = statuses.indexOf(req.status);

    const canCancel = req.status === "Pending" || req.status === "Accepted";

    return `
      <div class="request-card" id="req-card-${req.id}">
        <div class="request-card-top">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="request-id-badge">${req.id}</span>
            <span class="request-date">Submitted: ${new Date(req.createdAt).toLocaleDateString()}</span>
          </div>
          <span class="badge ${statusClass}">
            <span class="badge-dot"></span>
            ${req.status}
          </span>
        </div>

        <div class="request-main-info">
          <div>
            <h3 class="request-service-title">${req.serviceName}</h3>
            <p class="request-student-meta">
              <strong>Student:</strong> ${req.studentName} &bull; <strong>University:</strong> ${req.university} &bull; <strong>Email:</strong> ${req.studentEmail}
            </p>
          </div>
          <div class="request-price-tag">$${req.servicePrice}</div>
        </div>

        ${req.status !== "Cancelled" ? `
          <div class="progress-stepper">
            <div class="stepper-node ${currentIdx >= 0 ? (currentIdx === 0 ? 'active' : 'completed') : ''}">
              <div class="stepper-icon">1</div>
              <span class="stepper-label">Pending</span>
            </div>
            <div class="stepper-node ${currentIdx >= 1 ? (currentIdx === 1 ? 'active' : 'completed') : ''}">
              <div class="stepper-icon">2</div>
              <span class="stepper-label">Accepted</span>
            </div>
            <div class="stepper-node ${currentIdx >= 2 ? (currentIdx === 2 ? 'active' : 'completed') : ''}">
              <div class="stepper-icon">3</div>
              <span class="stepper-label">In Progress</span>
            </div>
            <div class="stepper-node ${currentIdx >= 3 ? 'completed' : ''}">
              <div class="stepper-icon">4</div>
              <span class="stepper-label">Completed</span>
            </div>
          </div>
        ` : `
          <div style="background: var(--status-cancelled-bg); padding: 0.85rem 1.25rem; border-radius: var(--radius-md); color: var(--status-cancelled-text); font-weight: 600; font-size: 0.9rem; margin: 1rem 0;">
            ✕ This service request was cancelled.
          </div>
        `}

        <div class="request-details-grid">
          <div class="details-block">
            <h5>Project Instructions</h5>
            <p>${req.instructions || 'No special instructions provided.'}</p>
          </div>
          <div class="details-block">
            <h5>Attached File</h5>
            ${req.fileName ? `
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>📎</span>
                <div>
                  <strong style="font-size: 0.85rem; display: block;">${req.fileName}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-light);">${req.fileSize || 'Attachment'}</span>
                </div>
                ${req.fileUrl ? `<a href="${req.fileUrl}" target="_blank" class="btn btn-sm btn-outline" style="padding: 0.2rem 0.6rem; margin-left: auto;">View</a>` : ''}
              </div>
            ` : `<span style="color: var(--text-light); font-size: 0.85rem;">No files uploaded</span>`}
          </div>
        </div>

        <div class="request-card-footer">
          <div class="deadline-indicator ${isUrgent ? 'urgent' : 'normal'}">
            <span>⏰ Deadline:</span>
            <span>${deadlineFormatted}</span>
            <span class="badge badge-pill" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">Priority: ${req.priority}</span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            ${canCancel ? `
              <button class="btn btn-sm btn-danger btn-cancel-request" data-request-id="${req.id}">
                Cancel Request
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /* =========================================================================
   * ADMIN PORTAL CONTROLLER
   * ========================================================================= */
  setupAdminPortal() {
    // Admin Login Form
    const loginForm = document.getElementById("adminLoginForm");
    const demoLoginBtn = document.getElementById("btnDemoAdminLogin");
    const logoutBtn = document.getElementById("btnAdminLogout");

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("adminEmail").value;
        const pass = document.getElementById("adminPassword").value;
        const remember = document.getElementById("adminRemember").checked;

        try {
          const res = await window.authService.loginAdmin(email, pass, remember);
          this.showToast("success", "Welcome Admin", res.message);
          this.navigateTo("admin-dashboard");
        } catch (err) {
          this.showToast("error", "Login Failed", err.message);
        }
      });
    }

    if (demoLoginBtn) {
      demoLoginBtn.addEventListener("click", async () => {
        try {
          const res = await window.authService.loginAdmin(
            window.DEMO_ADMIN_CREDENTIALS.email,
            window.DEMO_ADMIN_CREDENTIALS.password
          );
          this.showToast("success", "Demo Mode", "Logged in with Admin Demo account!");
          this.navigateTo("admin-dashboard");
        } catch (err) {
          this.showToast("error", "Demo Login Error", err.message);
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await window.authService.logoutAdmin();
        this.showToast("info", "Logged Out", "You have securely logged out.");
        this.navigateTo("home");
      });
    }

    // Admin Sidebar Tabs
    const adminSidebar = document.getElementById("adminSidebarNav");
    if (adminSidebar) {
      adminSidebar.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-admin-tab]");
        if (!btn) return;
        const tab = btn.getAttribute("data-admin-tab");
        this.switchAdminTab(tab);
      });
    }

    // Admin Add Service Button
    const btnAddService = document.getElementById("btnAdminAddService");
    if (btnAddService) {
      btnAddService.addEventListener("click", () => this.openServiceEditorModal());
    }

    // Admin Service Modal Form Submit
    const serviceForm = document.getElementById("adminServiceForm");
    if (serviceForm) {
      serviceForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleServiceFormSave(serviceForm);
      });
    }

    // Admin Request Table Filters
    const reqStatusFilter = document.getElementById("adminReqStatusFilter");
    const reqSearch = document.getElementById("adminReqSearchInput");
    if (reqStatusFilter) {
      reqStatusFilter.addEventListener("change", () => this.renderAdminRequestsTable());
    }
    if (reqSearch) {
      reqSearch.addEventListener("input", () => this.renderAdminRequestsTable());
    }
  }

  switchAdminTab(tabId) {
    this.adminActiveTab = tabId;
    document.querySelectorAll(".admin-nav-item").forEach(item => {
      const btn = item.querySelector("button");
      if (btn && btn.getAttribute("data-admin-tab") === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    document.querySelectorAll(".admin-tab-pane").forEach(pane => {
      pane.style.display = pane.id === `admin-tab-${tabId}` ? "block" : "none";
    });

    if (tabId === "overview" || tabId === "requests") {
      this.renderAdminOverview();
      this.renderAdminRequestsTable();
    } else if (tabId === "services") {
      this.renderAdminServicesTable();
    } else if (tabId === "students") {
      this.renderAdminStudentsDirectory();
    }
  }

  async renderAdminDashboard() {
    if (!window.authService.isAdmin()) {
      this.navigateTo("admin-login");
      return;
    }

    const currentAdmin = window.authService.getCurrentUser();
    const adminEmailDisplay = document.getElementById("adminProfileEmail");
    if (adminEmailDisplay) adminEmailDisplay.textContent = currentAdmin.email;

    this.switchAdminTab(this.adminActiveTab || "overview");
  }

  async renderAdminOverview() {
    const allRequests = await window.dbService.getAllRequests();
    const allServices = await window.dbService.getServices();

    const pending = allRequests.filter(r => r.status === "Pending").length;
    const inProgress = allRequests.filter(r => r.status === "In Progress" || r.status === "Accepted").length;
    const completed = allRequests.filter(r => r.status === "Completed").length;
    const revenue = allRequests.reduce((sum, r) => sum + (parseFloat(r.servicePrice) || 0), 0);

    // KPI Numbers
    const elTotal = document.getElementById("kpiTotalRequests");
    const elPending = document.getElementById("kpiPendingRequests");
    const elActive = document.getElementById("kpiActiveRequests");
    const elCompleted = document.getElementById("kpiCompletedRequests");
    const elRevenue = document.getElementById("kpiTotalRevenue");
    const elServices = document.getElementById("kpiActiveServices");

    if (elTotal) elTotal.textContent = allRequests.length;
    if (elPending) elPending.textContent = pending;
    if (elActive) elActive.textContent = inProgress;
    if (elCompleted) elCompleted.textContent = completed;
    if (elRevenue) elRevenue.textContent = `$${revenue.toLocaleString()}`;
    if (elServices) elServices.textContent = allServices.length;

    // Recent Requests Preview in Overview
    const recentTableBody = document.getElementById("adminRecentRequestsBody");
    if (recentTableBody) {
      const recent = allRequests.slice(0, 5);
      if (recent.length === 0) {
        recentTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No requests recorded yet.</td></tr>`;
      } else {
        recentTableBody.innerHTML = recent.map(req => this.createAdminTableRow(req)).join("");
        this.attachAdminTableEvents(recentTableBody);
      }
    }
  }

  async renderAdminRequestsTable() {
    const tableBody = document.getElementById("adminAllRequestsBody");
    if (!tableBody) return;

    const statusFilter = document.getElementById("adminReqStatusFilter")?.value || "all";
    const search = document.getElementById("adminReqSearchInput")?.value.toLowerCase().trim() || "";

    let requests = await window.dbService.getAllRequests();

    if (statusFilter !== "all") {
      requests = requests.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (search) {
      requests = requests.filter(r => 
        r.id.toLowerCase().includes(search) ||
        r.studentName.toLowerCase().includes(search) ||
        r.studentEmail.toLowerCase().includes(search) ||
        r.serviceName.toLowerCase().includes(search)
      );
    }

    if (requests.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No student requests match the filter criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = requests.map(req => this.createAdminTableRow(req)).join("");
    this.attachAdminTableEvents(tableBody);
  }

  createAdminTableRow(req) {
    return `
      <tr data-req-id="${req.id}">
        <td>
          <span class="request-id-badge" style="font-size: 0.78rem;">${req.id}</span>
        </td>
        <td>
          <div style="font-weight: 600;">${req.studentName}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${req.studentEmail}</div>
        </td>
        <td>
          <div style="font-weight: 500;">${req.serviceName}</div>
          <div style="font-size: 0.78rem; color: var(--primary); font-weight: 700;">$${req.servicePrice}</div>
        </td>
        <td>
          <div style="font-size: 0.825rem;">${new Date(req.deadline).toLocaleDateString()}</div>
        </td>
        <td>
          ${req.fileName ? `
            <a href="${req.fileUrl || '#'}" target="_blank" class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" title="${req.fileName}">
              📎 ${req.fileName.length > 15 ? req.fileName.substring(0, 12) + '...' : req.fileName}
            </a>
          ` : `<span style="color: var(--text-light); font-size: 0.78rem;">None</span>`}
        </td>
        <td>
          <select class="status-select" data-status="${req.status}" data-request-id="${req.id}">
            <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Accepted" ${req.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
            <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${req.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-sm btn-outline btn-view-request" data-request-id="${req.id}" title="View Details">
              👁 Details
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  attachAdminTableEvents(container) {
    // Quick Status Dropdown Change
    container.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", async (e) => {
        const id = select.getAttribute("data-request-id");
        const newStatus = select.value;
        try {
          await window.dbService.updateRequestStatus(id, newStatus);
          select.setAttribute("data-status", newStatus);
          this.showToast("success", "Status Updated", `Request ${id} marked as ${newStatus}.`);
          this.renderAdminOverview();
        } catch (err) {
          this.showToast("error", "Update Failed", err.message);
        }
      });
    });

    // View Details Modal
    container.querySelectorAll(".btn-view-request").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-request-id");
        this.openAdminRequestDetailsModal(id);
      });
    });
  }

  async openAdminRequestDetailsModal(requestId) {
    const req = await window.dbService.getRequestById(requestId);
    if (!req) return;

    document.getElementById("modalReqDetailId").textContent = req.id;
    document.getElementById("modalDetailStudentName").textContent = req.studentName;
    document.getElementById("modalDetailStudentEmail").textContent = req.studentEmail;
    document.getElementById("modalDetailStudentPhone").textContent = req.studentPhone || 'N/A';
    document.getElementById("modalDetailUniversity").textContent = req.university || 'N/A';
    document.getElementById("modalDetailServiceName").textContent = req.serviceName;
    document.getElementById("modalDetailPrice").textContent = `$${req.servicePrice}`;
    document.getElementById("modalDetailDeadline").textContent = new Date(req.deadline).toLocaleString();
    document.getElementById("modalDetailPriority").textContent = req.priority;
    document.getElementById("modalDetailInstructions").textContent = req.instructions || 'No special instructions.';

    // File Preview
    const fileArea = document.getElementById("modalDetailFileArea");
    if (fileArea) {
      if (req.fileName) {
        fileArea.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-alt); padding: 0.75rem 1rem; border-radius: var(--radius-md);">
            <div>
              <strong>${req.fileName}</strong> (${req.fileSize || 'Attachment'})
            </div>
            ${req.fileUrl ? `<a href="${req.fileUrl}" target="_blank" class="btn btn-sm btn-primary">Download File</a>` : ''}
          </div>
        `;
      } else {
        fileArea.innerHTML = `<span style="color: var(--text-light);">No attachments uploaded.</span>`;
      }
    }

    // Admin Notes & Status Editor inside Modal
    const statusSelect = document.getElementById("modalDetailStatusSelect");
    const notesInput = document.getElementById("modalDetailAdminNotes");
    if (statusSelect) statusSelect.value = req.status;
    if (notesInput) notesInput.value = req.adminNotes || "";

    const saveBtn = document.getElementById("btnModalSaveRequestDetails");
    if (saveBtn) {
      saveBtn.onclick = async () => {
        const newStatus = statusSelect.value;
        const newNotes = notesInput.value;
        await window.dbService.updateRequestStatus(req.id, newStatus, newNotes);
        this.closeModal("adminRequestDetailModal");
        this.showToast("success", "Saved", `Request ${req.id} updated.`);
        this.renderAdminRequestsTable();
        this.renderAdminOverview();
      };
    }

    this.openModal("adminRequestDetailModal");
  }

  /* =========================================================================
   * SERVICES CRUD CONTROLLER (Admin)
   * ========================================================================= */
  async renderAdminServicesTable() {
    const tableBody = document.getElementById("adminServicesTableBody");
    if (!tableBody) return;

    const services = await window.dbService.getServices();

    if (services.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No services found. Click "Add New Service" to create one.</td></tr>`;
      return;
    }

    tableBody.innerHTML = services.map(srv => `
      <tr data-service-id="${srv.id}">
        <td>
          <img src="${srv.image}" alt="${srv.name}" style="width: 48px; height: 36px; object-fit: cover; border-radius: var(--radius-sm);" />
        </td>
        <td>
          <div style="font-weight: 700;">${srv.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${srv.category} &bull; ${srv.badge || 'Standard'}</div>
        </td>
        <td>
          <span style="font-weight: 700; color: var(--primary); font-size: 1.05rem;">$${srv.price}</span>
        </td>
        <td>${srv.turnaround}</td>
        <td>
          <span style="font-size: 0.85rem;">★ ${srv.rating || '5.0'} (${srv.reviewsCount || 10})</span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm btn-outline btn-edit-service" data-service-id="${srv.id}" title="Edit Service">
              ✏️ Edit
            </button>
            <button class="btn btn-sm btn-danger btn-delete-service" data-service-id="${srv.id}" title="Delete Service">
              🗑️ Delete
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    // Attach Edit and Delete buttons
    tableBody.querySelectorAll(".btn-edit-service").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-service-id");
        this.openServiceEditorModal(id);
      });
    });

    tableBody.querySelectorAll(".btn-delete-service").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-service-id");
        if (confirm("Are you sure you want to delete this service? It will no longer appear in the student catalog.")) {
          await window.dbService.deleteService(id);
          this.showToast("info", "Service Deleted", "The service was removed.");
          this.renderAdminServicesTable();
          this.renderServices();
        }
      });
    });
  }

  async openServiceEditorModal(serviceId = null) {
    this.editingServiceId = serviceId;
    const modal = document.getElementById("adminServiceModal");
    const titleEl = document.getElementById("adminServiceModalTitle");
    const form = document.getElementById("adminServiceForm");
    if (!modal || !form) return;

    form.reset();

    if (serviceId) {
      if (titleEl) titleEl.textContent = "Edit Service Details";
      const srv = await window.dbService.getServiceById(serviceId);
      if (srv) {
        document.getElementById("srvFormName").value = srv.name;
        document.getElementById("srvFormCategory").value = srv.category;
        document.getElementById("srvFormPrice").value = srv.price;
        document.getElementById("srvFormTurnaround").value = srv.turnaround;
        document.getElementById("srvFormBadge").value = srv.badge || "";
        document.getElementById("srvFormImageUrl").value = srv.image || "";
        document.getElementById("srvFormDesc").value = srv.description;
        document.getElementById("srvFormFeatures").value = (srv.features || []).join("\n");
      }
    } else {
      if (titleEl) titleEl.textContent = "Add New Service";
    }

    this.openModal("adminServiceModal");
  }

  async handleServiceFormSave(form) {
    const name = document.getElementById("srvFormName").value.trim();
    const category = document.getElementById("srvFormCategory").value;
    const price = parseFloat(document.getElementById("srvFormPrice").value) || 20;
    const turnaround = document.getElementById("srvFormTurnaround").value.trim();
    const badge = document.getElementById("srvFormBadge").value.trim() || "Featured";
    const image = document.getElementById("srvFormImageUrl").value.trim() || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80";
    const description = document.getElementById("srvFormDesc").value.trim();
    const features = document.getElementById("srvFormFeatures").value.split("\n").map(f => f.trim()).filter(Boolean);

    const payload = {
      name,
      category,
      price,
      turnaround,
      badge,
      image,
      description,
      features
    };

    if (this.editingServiceId) {
      await window.dbService.updateService(this.editingServiceId, payload);
      this.showToast("success", "Service Updated", `Service "${name}" updated successfully.`);
    } else {
      await window.dbService.addService(payload);
      this.showToast("success", "Service Created", `Service "${name}" added to catalog.`);
    }

    this.closeModal("adminServiceModal");
    this.renderAdminServicesTable();
    this.renderServices();
  }

  /* =========================================================================
   * STUDENT DIRECTORY (Admin)
   * ========================================================================= */
  async renderAdminStudentsDirectory() {
    const tableBody = document.getElementById("adminStudentsTableBody");
    if (!tableBody) return;

    const allRequests = await window.dbService.getAllRequests();
    
    // Group requests by student email
    const studentMap = new Map();
    allRequests.forEach(req => {
      const email = (req.studentEmail || "unknown").toLowerCase();
      if (!studentMap.has(email)) {
        studentMap.set(email, {
          name: req.studentName,
          email: req.studentEmail,
          phone: req.studentPhone,
          university: req.university,
          totalRequests: 0,
          totalSpent: 0,
          lastRequestDate: req.createdAt
        });
      }
      const st = studentMap.get(email);
      st.totalRequests += 1;
      st.totalSpent += (parseFloat(req.servicePrice) || 0);
      if (new Date(req.createdAt) > new Date(st.lastRequestDate)) {
        st.lastRequestDate = req.createdAt;
      }
    });

    const students = Array.from(studentMap.values());

    if (students.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No student records found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = students.map(st => `
      <tr>
        <td>
          <div style="font-weight: 700;">${st.name}</div>
        </td>
        <td>${st.email}</td>
        <td>${st.phone || 'N/A'}</td>
        <td>${st.university || 'N/A'}</td>
        <td><span class="badge badge-pill">${st.totalRequests} Orders</span></td>
        <td>
          <strong style="color: var(--primary);">$${st.totalSpent.toLocaleString()}</strong>
        </td>
      </tr>
    `).join("");
  }

  /* =========================================================================
   * MODALS & TOAST NOTIFICATION HELPERS
   * ========================================================================= */
  setupModals() {
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });

    document.querySelectorAll(".modal-close-btn, [data-modal-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) this.closeModal(modal.id);
      });
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  showToast(type, title, message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  handleDataChange(eventType, data) {
    if (this.currentView === "services" || this.currentView === "home") {
      this.renderServices();
    } else if (this.currentView === "student-dashboard") {
      this.renderStudentDashboard();
    } else if (this.currentView === "admin-dashboard") {
      this.renderAdminOverview();
      this.renderAdminRequestsTable();
      this.renderAdminServicesTable();
    }
  }
}

// Instantiate and expose globally
window.app = new AppController();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
