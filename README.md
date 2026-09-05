# 🎓 EduServe — Modern Student Services Hub

A complete, modern, and responsive **Student Services Web Application** designed for university students to request academic, coding, design, and tutoring services with file attachments, deadlines, and live request tracking.

Built with clean **HTML5, CSS3, JavaScript (ES6+)**, and integrated with **Firebase (Authentication, Cloud Firestore, Firebase Storage)** alongside an automatic **Hybrid LocalStorage fallback** so it works immediately out-of-the-box.

![EduServe Preview](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 1. 🏠 Home Page
- **Hero Section**: Modern typography, glowing status badges, headline *"Student Services Made Easy"*, call-to-action buttons (*"Explore Services"*, *"Track Your Request"*).
- **Interactive Process Flow**: 4-step interactive explanation of how services work.
- **Top Services Showcase**: Quick preview cards with instant request buttons.
- **Social Proof & Testimonials**: Verified student reviews and guarantees (Confidentiality, Free Revisions, On-Time Delivery).

### 2. 📋 Services Catalog (`#services`)
- **Filterable & Searchable**: Categorized by *Academic*, *Coding & Tech*, *Design & Media*, *Tutoring*, and *Career*.
- **Rich Service Cards**:
  - High-res image banner, category pill & badge (e.g. *Most Popular*, *Top Rated*).
  - Title, description, key feature bullet list.
  - Price tag and turnaround time estimate.
  - **"Request Service"** button with automatic form pre-fill.

### 3. ✍️ Student Request Form (`#request`)
- **Student Information**: Name, Email, Phone/WhatsApp, and University.
- **Project Details**: Service selector with dynamic base pricing, required deadline date-time picker, priority level (*Normal*, *High*, *Urgent 24h*), and specific instructions.
- **File Upload**: Drag-and-drop file uploader supporting PDF, DOCX, ZIP, PPT, and images with size display and removal.
- **Instant Tracking ID**: Generates unique tracking code (e.g., `REQ-2026-8812`) and opens confirmation modal.

### 4. 📊 Student Dashboard (`#student-dashboard`)
- **Real-Time Request Tracker**: Lookup by Request ID or Student Email.
- **Status Filter Tabs**: *All*, *Pending*, *Accepted*, *In Progress*, *Completed*, *Cancelled*.
- **Interactive Order Tracking Card**:
  - **4-Step Visual Progress Stepper** with animated active states.
  - Attached file preview & direct download link.
  - Project instructions snippet and deadline countdown.
  - Student cancellation option for pending orders.

### 5. 🛡️ Admin Dashboard (`#admin-dashboard`)
- **Secure Admin Authentication**: Demo 1-Click Login or Firebase Auth.
- **KPI Overview Cards**: Total Requests, Pending Review, Active in Progress, Completed Orders, Total Revenue, and Active Services.
- **Manage Requests**:
  - Filter by status and search by student/service.
  - **Quick Status Changer Dropdown**: Instantly change status to *Pending*, *Accepted*, *In Progress*, *Completed*, or *Cancelled*.
  - **Request Details Modal**: View complete student contact info, attachments, and internal admin notes.
- **Manage Services (Full CRUD)**:
  - **Add New Service**: Title, category, price, turnaround, badge, image URL, and features.
  - **Edit Service**: Update any existing service details in real time.
  - **Delete Service**: Remove services from the catalog with confirmation.
- **Student Records Directory**: View unique student customers, total orders, and lifetime spending.

---

## 🚀 How to Run Locally

You can run EduServe on any machine in seconds without needing any complex installation:

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by *Ritwick Dey*).
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The website will open automatically at `http://127.0.0.1:5500`.

### Option 2: Python HTTP Server
Open your terminal inside the project directory and run:
```bash
# Python 3
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 3: Node.js `npx serve`
```bash
npx serve .
```
Open the URL shown in the terminal (usually `http://localhost:3000`).

---

## 🔑 Admin Demo Credentials

For instant evaluation and testing:
- **Admin Email**: `admin@campus.edu`
- **Admin Password**: `admin123`
- *(Or simply click the **"⚡ 1-Click Login"** button on the Admin Login page)*

---

## 🔥 Firebase Setup Guide (Database, Auth & Storage)

EduServe works immediately in **Hybrid LocalStorage Mode** without setup. To connect your own live Google Firebase backend:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add Project"** and name it (e.g., `eduserve-app`).
3. Click on the Web icon (`</>`) to register a Web App.
4. Copy the `firebaseConfig` object provided by Firebase.

### Step 2: Enable Firebase Authentication
1. In the left sidebar, navigate to **Build > Authentication**.
2. Click **Get Started** and enable **Email/Password**.
3. Under the **Users** tab, click **"Add user"** and create your admin account (e.g. `admin@campus.edu` with your password).

### Step 3: Enable Cloud Firestore Database
1. Navigate to **Build > Firestore Database** and click **Create database**.
2. Choose **Test mode** (or configure production rules below).
3. Select your preferred Cloud location and click **Enable**.

**Recommended Firestore Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /requests/{requestId} {
      allow read, create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

### Step 4: Enable Firebase Storage (File Uploads)
1. Navigate to **Build > Storage** and click **Get Started**.
2. Start in test mode or allow public uploads:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /requests/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 5: Update `js/firebase-config.js`
Open [js/firebase-config.js](file:///c:/Users/Radha/OneDrive/Desktop/Nexasoul-Webverse-Project-main/js/firebase-config.js) and replace the placeholder values with your Firebase keys:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyYourActualApiKeyHere",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

---

## 🌐 How to Deploy Online (Free Hosting)

### 1. Deploy with Vercel (Easiest)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Leave settings as default and click **Deploy**. Your site will be live in 10 seconds!

### 2. Deploy with Netlify
1. Go to [netlify.com](https://netlify.com) and log in.
2. Drag and drop the entire project folder directly into the Netlify dashboard.
3. Your website is instantly live with a custom `.netlify.app` domain.

### 3. Deploy with Firebase Hosting
1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project.
   - Specify public directory as `.` (current directory).
   - Configure as single-page app: `Yes`.
3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

### 4. Deploy with GitHub Pages
1. Push your code to a GitHub repository.
2. Go to repository **Settings > Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be published at `https://<username>.github.io/<repo-name>/`.

---

## 📂 Project Structure

```text
Nexasoul-Webverse-Project-main/
├── index.html                   # Core single-page application markup & views
├── css/
│   ├── style.css                # Design system, CSS variables, hero, service cards, footer
│   └── dashboard.css            # Student & Admin dashboards, tables, modals, badges
├── js/
│   ├── seed-data.js             # Initial rich services catalog and demo requests
│   ├── firebase-config.js       # Firebase initialization & hybrid detector
│   ├── db.js                    # Unified Data Layer (Firestore + LocalStorage)
│   ├── auth.js                  # Authentication & admin session manager
│   └── app.js                   # UI controller, routing, form handlers & modals
└── README.md                    # Setup, run, and deployment documentation
```

---

## 💡 Technologies Used

- **HTML5 & Semantic Elements**: Clean accessibility, SEO-friendly layout.
- **Vanilla CSS3**: Modern variables, responsive Flexbox/Grid, glassmorphism, micro-animations.
- **Vanilla JavaScript (ES6+)**: Modular architecture, async/await, DOM events.
- **Firebase v10**: Authentication, Cloud Firestore, Firebase Storage.
- **Google Fonts**: *Outfit* (Headings), *Inter* (UI/Body), *JetBrains Mono* (IDs).
