/**
 * Seed Data for EduServe / Student Services Hub
 * Contains default services and demo requests for instant plug-and-play operation.
 */

const SEED_SERVICES = [
  {
    id: "srv-academic-writing",
    name: "Academic Essay & Research Paper Editing",
    category: "Academic",
    price: 25,
    turnaround: "24-48 Hours",
    rating: 4.9,
    reviewsCount: 128,
    badge: "Most Popular",
    description: "Comprehensive proofreading, grammar refinement, argument structuring, and formatting in APA, MLA, IEEE, or Harvard styles with plagiarism check.",
    features: [
      "Grammar, vocabulary & style enhancement",
      "Citation & bibliography formatting (APA/MLA/IEEE)",
      "Plagiarism & AI content audit report",
      "Free 7-day unlimited revisions"
    ],
    icon: "document-text",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-coding-assistance",
    name: "Full-Stack Web & Software Project Help",
    category: "Coding & Tech",
    price: 65,
    turnaround: "2-4 Days",
    rating: 5.0,
    reviewsCount: 94,
    badge: "Top Rated",
    description: "Hands-on coding assistance, bug fixing, API integrations, and end-to-end web/app development using React, Node.js, Python, Java, or C++.",
    features: [
      "Clean, well-commented code following SOLID principles",
      "Git repository setup & README documentation",
      "1-on-1 code walkthrough explanation",
      "Automated testing & debugging report"
    ],
    icon: "code-bracket",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-data-science",
    name: "Data Analysis, Python & Machine Learning",
    category: "Coding & Tech",
    price: 50,
    turnaround: "2-3 Days",
    rating: 4.8,
    reviewsCount: 76,
    badge: "Trending",
    description: "Statistical analysis, data cleaning, exploratory data analysis (EDA), interactive charts (Matplotlib/Seaborn/Plotly), and Jupyter notebook reports.",
    features: [
      "Pandas, NumPy, Scikit-Learn pipelines",
      "Interactive Jupyter & Google Colab notebooks",
      "Visual charts, correlation matrices & insights",
      "Model evaluation & predictive metrics"
    ],
    icon: "chart-bar",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-uiux-design",
    name: "UI/UX Design & Figma Interactive Mockups",
    category: "Design & Media",
    price: 40,
    turnaround: "1-3 Days",
    rating: 4.9,
    reviewsCount: 82,
    badge: "Creative",
    description: "Pixel-perfect mobile and web app UI design in Figma. Includes modern design systems, wireframes, accessible color schemes, and clickable prototypes.",
    features: [
      "Complete Figma source file with Auto Layout & Components",
      "Mobile & Desktop responsive layouts",
      "Interactive click-through prototype",
      "Exportable SVG/PNG assets & style guide"
    ],
    icon: "paint-brush",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-math-tutoring",
    name: "STEM, Calculus & Physics Problem Solving",
    category: "Tutoring",
    price: 30,
    turnaround: "24 Hours",
    rating: 4.9,
    reviewsCount: 110,
    badge: "Fast Delivery",
    description: "Step-by-step mathematical derivations, physics problem solutions, circuit analysis, and clear conceptual explanations with diagrams.",
    features: [
      "Clear handwritten or LaTeX step-by-step solutions",
      "Formula sheets & concept cheat sheets",
      "Detailed intermediate step justification",
      "Follow-up Q&A for tricky problem concepts"
    ],
    icon: "academic-cap",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-resume-career",
    name: "ATS Resume & Tech Portfolio Optimization",
    category: "Career",
    price: 20,
    turnaround: "24 Hours",
    rating: 5.0,
    reviewsCount: 145,
    badge: "Career Booster",
    description: "Transform your resume to pass Applicant Tracking Systems (ATS), highlight key coursework/projects, and optimize your LinkedIn profile.",
    features: [
      "ATS score 90+ optimized resume (Word & PDF)",
      "Action-verb & impact-driven bullet points",
      "LinkedIn headline & summary optimization",
      "Tailored cover letter template"
    ],
    icon: "briefcase",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-slides-presentation",
    name: "PowerPoint & Pitch Deck Presentation Design",
    category: "Design & Media",
    price: 25,
    turnaround: "24-48 Hours",
    rating: 4.8,
    reviewsCount: 63,
    badge: "Polished",
    description: "Engaging and professional presentation slides for seminars, capstone defenses, project presentations, and startup pitch competitions.",
    features: [
      "Custom slide master & sleek infographics",
      "Animation & transition polish",
      "Editable PPTX, Google Slides, and PDF versions",
      "Speaker notes & pacing suggestions"
    ],
    icon: "presentation-chart-line",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "srv-database-sql",
    name: "Database Design, ERD & Complex SQL Queries",
    category: "Coding & Tech",
    price: 35,
    turnaround: "1-2 Days",
    rating: 4.9,
    reviewsCount: 52,
    badge: "Tech Core",
    description: "Relational database schema modeling, ER diagram creation (Crow's foot), 3NF normalization, and optimized SQL queries (PostgreSQL/MySQL/MongoDB).",
    features: [
      "Visual ER Diagram & schema mapping",
      "DDL & DML SQL scripts with sample data",
      "Optimized indexing & join queries",
      "Query execution plan explanation"
    ],
    icon: "server-stack",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80"
  }
];

const SEED_REQUESTS = [
  {
    id: "REQ-2026-8812",
    studentName: "Aarav Sharma",
    studentEmail: "aarav.sharma@campus.edu",
    studentPhone: "+1 (555) 234-8901",
    university: "State University of Technology",
    serviceId: "srv-coding-assistance",
    serviceName: "Full-Stack Web & Software Project Help",
    servicePrice: 65,
    instructions: "Need help connecting MongoDB Atlas with an Express.js backend and fixing CORS authentication cookie issues for my final semester e-commerce capstone project.",
    deadline: "2026-09-12T18:00",
    priority: "High",
    status: "In Progress",
    adminNotes: "Assigned to Senior Full-Stack Mentor. Backend API fixed; currently setting up JWT cookie auth.",
    fileName: "capstone-backend-architecture.pdf",
    fileSize: "2.4 MB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-09-02T10:30:00.000Z",
    updatedAt: "2026-09-04T14:15:00.000Z"
  },
  {
    id: "REQ-2026-9140",
    studentName: "Sophia Martinez",
    studentEmail: "sophia.m@university.edu",
    studentPhone: "+1 (555) 432-1098",
    university: "National College of Arts & Science",
    serviceId: "srv-academic-writing",
    serviceName: "Academic Essay & Research Paper Editing",
    servicePrice: 25,
    instructions: "Please proofread my 3,500-word literature review on Neural Machine Translation. Ensure all references strictly follow IEEE formatting.",
    deadline: "2026-09-08T12:00",
    priority: "Urgent",
    status: "Pending",
    adminNotes: "Awaiting mentor assignment. High priority deadline.",
    fileName: "Literature_Review_Draft_v2.docx",
    fileSize: "1.1 MB",
    fileUrl: null,
    createdAt: "2026-09-05T08:20:00.000Z",
    updatedAt: "2026-09-05T08:20:00.000Z"
  },
  {
    id: "REQ-2026-7654",
    studentName: "Liam Chen",
    studentEmail: "liam.chen@engineering.edu",
    studentPhone: "+1 (555) 876-5432",
    university: "Polytechnic Institute",
    serviceId: "srv-math-tutoring",
    serviceName: "STEM, Calculus & Physics Problem Solving",
    servicePrice: 30,
    instructions: "Need step-by-step LaTeX derivations for Laplace Transforms applied to 2nd-order differential equations in RLC resonant circuits.",
    deadline: "2026-09-07T23:59",
    priority: "Normal",
    status: "Accepted",
    adminNotes: "Mentor accepted order. Preparing LaTeX solution sheet.",
    fileName: "differential-equations-problemset.pdf",
    fileSize: "3.8 MB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-09-04T16:45:00.000Z",
    updatedAt: "2026-09-05T09:00:00.000Z"
  },
  {
    id: "REQ-2026-6420",
    studentName: "Emily Watson",
    studentEmail: "emily.w@campus.edu",
    studentPhone: "+1 (555) 345-6789",
    university: "State University of Technology",
    serviceId: "srv-resume-career",
    serviceName: "ATS Resume & Tech Portfolio Optimization",
    servicePrice: 20,
    instructions: "Looking to target Software Engineer Intern roles at top tech companies. Want to rewrite project descriptions using STAR method and optimize for ATS keywords.",
    deadline: "2026-09-03T15:00",
    priority: "Normal",
    status: "Completed",
    adminNotes: "Delivered ATS Resume score 96/100 and customized cover letter template via email.",
    fileName: "Emily_Watson_Resume_Draft.pdf",
    fileSize: "680 KB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-09-01T11:00:00.000Z",
    updatedAt: "2026-09-03T14:30:00.000Z"
  },
  {
    id: "REQ-2026-5129",
    studentName: "David Miller",
    studentEmail: "david.m@college.org",
    studentPhone: "+1 (555) 987-6543",
    university: "Metro City College",
    serviceId: "srv-uiux-design",
    serviceName: "UI/UX Design & Figma Interactive Mockups",
    servicePrice: 40,
    instructions: "Requested Figma mockup for a campus club event ticketing app.",
    deadline: "2026-08-30T10:00",
    priority: "Normal",
    status: "Cancelled",
    adminNotes: "Cancelled by student (event postponed to next semester).",
    fileName: "wireframe-sketches.png",
    fileSize: "1.8 MB",
    fileUrl: null,
    createdAt: "2026-08-28T09:15:00.000Z",
    updatedAt: "2026-08-29T11:00:00.000Z"
  }
];

if (typeof window !== "undefined") {
  window.SEED_SERVICES = SEED_SERVICES;
  window.SEED_REQUESTS = SEED_REQUESTS;
}
