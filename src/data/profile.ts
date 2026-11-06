/**
 * profile.ts: ALL portfolio content lives here. Components only read from this file.
 *
 * Source: Isuru_Adikaram_SE_Intern_CV.pdf (Nov 2026).
 * Anything marked TODO is still unknown and must be confirmed by Isuru before it goes live.
 * Never invent facts. If a value is missing, render the field as hidden, not as a guess.
 */

/* ---------- types ---------- */
export type VisitorMode = "recruiter" | "developer" | "explorer";

export type Link = { label: string; href: string };

export type EducationStop = {
  id: "uni" | "al" | "ol";
  level: string;          // short tag on the card: "University"
  school: string;
  qualification: string;
  years: string;          // shown on the card
  year: string;           // the big year beside the road
  current?: boolean;      // still studying here (gets the "NOW" badge)
  headline: { value: string; label: string }; // the one big result
  highlight?: string;     // one stand-out result on its own line (e.g. district rank)
  results: string[];      // smaller results, shown as chips on the next line
  status?: string;        // where Isuru is right now, e.g. "3rd year · Semester 5"
  logo: { src: string; alt: string; width: number; height: number };
  /** semester GPAs in order; value null = semester still running */
  gpaPath?: { term: string; value: number | null; deansList?: boolean }[];
};

export type Thread = {
  id: string;
  label: string;          // "worker-1"
  org: string;
  role: string;
  start: string | null;   // "YYYY-MM"; TODO where null
  end: string | null;     // "YYYY-MM", or null = ongoing
  summary: string;
  tags: string[];
};

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  type: "Group project" | "Self project" | "Hackathon";
  context: string;        // e.g. "2nd-year Group Software Project"
  year: number;           // used by the "Newest" sort; TODO confirm
  complexity: number;     // 1-10, used by the "Complexity" sort; Isuru's own rating
  primaryStack: string;   // used by the "Stack A–Z" sort
  oneLiner: string;
  problem: string;
  built: string[];        // what Isuru personally built (from the CV bullets)
  architecture: string;   // one line, arrows between parts
  tech: string[];
  links: { github?: string; live?: string };
  status?: string;        // e.g. "Under active development"
  image?: string;         // TODO: /images/projects/<id>.webp when screenshots exist
};

export type SkillCategory = "languages" | "backend" | "frontend" | "databases" | "devops" | "embedded" | "tools";
export type Skill = { id: string; name: string; category: SkillCategory; weight: 1 | 2 | 3; projects: string[] };

export type Competition = {
  id: string;
  title: string;          // "Champion – CodeSplash'26"
  short: string;          // label that fits inside a heap node
  result: "Champion" | "Finalist" | "Semi-Finalist" | "Top 20" | "Top 30";
  teamLead: boolean;
  event: string;
  organiser: string;
  category: string;
  year: number;
  priority: number;       // max-heap key. Suggested values; Isuru can change them.
};

export type Certification = { id: string; title: string; issuer: string; verifyUrl?: string; priority: number };

/* ---------- identity ---------- */
export const profile = {
  name: "Isuru Adikaram",                 // TODO confirm: "Isuru Adikaram" (CV) or "Isuru Udara Adikaram"?
  firstName: "Isuru",
  title: "Software Engineer Intern",
  tagline: "Full-stack and backend developer building scalable systems with Java, Spring Boot, React and REST APIs.",
  location: "Moratuwa, Sri Lanka",
  email: "isadikaram2915@gmail.com",
  // phone is intentionally NOT included: keep it on the CV only (spam bots scrape public sites).
  links: {
    github: "https://github.com/IsuruAdikaram8U",
    linkedin: "https://www.linkedin.com/in/isuru-adikaram-65a261323",
    cv: "/cv/Isuru_Adikaram_CV.pdf",      // TODO: web copy of the CV WITHOUT the References section
  },
  openTo: "Full-stack / backend software engineering internship",
};

/* ---------- home (hero) ---------- */
export const hero = {
  status: "Open to internships",
  focus: "Full-Stack & Backend",
  lead: "IT undergraduate at the University of Moratuwa. I build scalable systems and real-time web apps with Java, Spring Boot and React.",
  photo: { src: "/images/isuru-cutout.webp", alt: "Isuru Adikaram smiling, in a dark grey t-shirt", width: 1254, height: 1254 },
  building: { name: "Lectra", text: "a smart academic timetable system", url: "https://github.com/IsuruAdikaram8U/lectra" },
};

/* ---------- stats (shown in Home, under the hero) ---------- */
export type Stat = { value: number; decimals?: number; suffix?: string; label: string; note: string };

export const stats: Stat[] = [
  { value: 3.77, decimals: 2, label: "CGPA", note: "out of 4.00" },
  { value: 2, suffix: "×", label: "Dean's List", note: "semesters 3 and 4" },
  { value: 7, label: "Competitions", note: "1 championship, 2 finals" },
  { value: 4, label: "Projects", note: "web, real-time and hardware" },
];

/* ---------- education (a road: newest at the top) ---------- */
export const educationRoad = {
  next: "Software engineering internship", // the sign at the top of the road
  start: { year: "2013", place: "Ranabima Royal College, Peradeniya" }, // where the road begins
};

export const education: EducationStop[] = [
  {
    id: "uni", level: "University", current: true,
    school: "University of Moratuwa", qualification: "B.Sc. (Hons) in Information Technology",
    years: "2024 – Present", year: "2024",
    status: "3rd year · Semester 5",
    headline: { value: "3.77", label: "CGPA / 4.00" },
    results: [], // the Dean's List semesters are marked on the GPA road below
    logo: { src: "/images/logos/uom.webp", alt: "University of Moratuwa logo", width: 306, height: 325 },
    gpaPath: [
      { term: "S1", value: 3.58 },
      { term: "S2", value: 3.69 },
      { term: "S3", value: 3.87, deansList: true },
      { term: "S4", value: 3.91, deansList: true },
      { term: "S5", value: null },
    ],
  },
  {
    id: "al", level: "Advanced Level",
    school: "Ranabima Royal College, Peradeniya", qualification: "G.C.E. A/L · Physical Science Stream",
    years: "2022", year: "2022",
    headline: { value: "1.6178", label: "Z-score" },
    highlight: "Kandy district rank: 153",
    results: ["Physics: A", "Chemistry: A", "Combined Mathematics: B"],
    logo: { src: "/images/logos/ranabima.webp", alt: "Ranabima Royal College crest", width: 220, height: 319 },
  },
  {
    id: "ol", level: "Ordinary Level",
    school: "Ranabima Royal College, Peradeniya", qualification: "G.C.E. O/L",
    years: "2018", year: "2018",
    headline: { value: "9 A", label: "grades" },
    results: [],
    logo: { src: "/images/logos/ranabima.webp", alt: "Ranabima Royal College crest", width: 220, height: 319 },
  },
];

/* ---------- beyond the code (threads) ---------- */
// Everything here ran in parallel with the degree. ALL dates are TODO.
export const threads: Thread[] = [
  { id: "main", label: "main", org: "University of Moratuwa", role: "B.Sc. (Hons) Information Technology", start: "2024-01", end: null,
    summary: "Full-time degree in Information Technology. Dean's List in semesters 3 and 4.", tags: ["Java", "Python", "SQL", "C"] }, // TODO exact start month
  { id: "ies", label: "worker-1", org: "IoT & Embedded Systems Research Labs (IES Labs)", role: "Web Developer", start: null, end: null,
    summary: "Web developer for the research lab at the Faculty of Information Technology, University of Moratuwa.", tags: [] }, // TODO dates + what you built + tech
  { id: "dmc", label: "worker-2", org: "Disaster Management Centre (DMC), Sri Lanka", role: "Emergency Data & Operations Volunteer", start: null, end: null,
    summary: "Volunteered on emergency data and operations during the Cyclone Ditwah disaster response.", tags: [] }, // TODO dates
  { id: "rotaract", label: "worker-3", org: "Rotaract Club, University of Moratuwa", role: "Organizing Committee Member", start: null, end: null,
    summary: "Organizing committee for the Sri Lanka Rotaract Model United Nations (SLRMUN 2025) and the Binara Padura musical event.", tags: [] }, // TODO dates
  { id: "expo", label: "worker-4", org: "FIT Expo 2025, Faculty of IT", role: "Project Exhibitor", start: null, end: null,
    summary: "Showcased the ChessWiz automated chess board to visitors at the faculty exhibition.", tags: ["ESP32", "React"] }, // TODO month
];

/* ---------- projects (quicksort) ---------- */
export const projects: Project[] = [
  {
    id: "servesync", name: "ServeSync", subtitle: "Multi-Branch Restaurant Management Platform",
    type: "Group project", context: "2nd-year Group Software Project", year: 2025, complexity: 9, primaryStack: "Spring Boot", // TODO confirm year
    oneLiner: "Restaurant platform with real-time kitchen and receptionist workflows across branches.",
    problem: "Restaurants with several branches lose track of orders, tables and stock between the front desk and the kitchen.",
    built: [
      "Built the Kitchen module end-to-end: status-cascading order queues, per-item chef assignment across cooks, automated inventory control and a chef-driven menu workflow.",
      "Built the Receptionist module end-to-end: order queues with kitchen/hold/cancel actions, table and reservation management, and cash payment collection with an automated table-locking scheduler.",
      "Engineered a real-time WebSocket notification system and Cloudinary-powered menu image uploads.",
    ],
    architecture: "React (Vite) → Spring Boot REST + WebSocket → MySQL (Aiven) · images → Cloudinary",
    tech: ["Java", "Spring Boot", "React", "Vite", "Tailwind CSS", "MySQL (Aiven)", "WebSocket", "Cloudinary"],
    links: { github: "", live: "" }, // TODO URLs
  },
  {
    id: "lectra", name: "Lectra", subtitle: "Smart Academic Timetable Management System",
    type: "Self project", context: "Self project", year: 2026, complexity: 9, primaryStack: "Django REST", status: "Under active development", // TODO confirm complexity
    oneLiner: "Generates clash-free timetables and exam schedules across lecturers, modules, halls and batches.",
    problem: "Building a university timetable by hand takes weeks, and clashes between lecturers, halls and student batches still slip through.",
    built: [
      "Building an academic scheduling platform that automates clash-free timetable and exam generation across lecturers, modules, halls and student batches.",
      "Engineering a constraint-based scheduling engine with real-time clash detection and automatic timetable generation.",
      "Implementing secure JWT and OAuth 2.0 authentication with role-based access control, a Gemini-powered AI assistant, PDF export, and a fully containerised development environment with Docker Compose.",
    ],
    architecture: "Next.js → Django REST API → constraint scheduler → PostgreSQL · Gemini API · Docker Compose",
    tech: ["Python", "Django REST Framework", "PostgreSQL", "Next.js", "JWT", "OAuth 2.0", "Google Gemini API", "Docker"],
    links: { github: "" }, // TODO URL
  },
  {
    id: "chesswiz", name: "ChessWiz", subtitle: "Smart Automated Chess Board & Interactive Chess Web Platform",
    type: "Group project", context: "1st-year Microcontroller-Based Applications Development Project", year: 2025, complexity: 10, primaryStack: "ESP32", // TODO confirm year
    oneLiner: "A physical chess board that senses moves, moves its own pieces, and syncs with a web app running Stockfish.",
    problem: "Playing online chess means giving up a real board. ChessWiz keeps the physical board and connects it to online play and an AI opponent.",
    built: [
      "Chose ESP32 for WiFi and sensor-scanning coordination, Arduino for precise real-time stepper motor and electromagnet control, and Node.js with Socket.io and Stockfish AI for an AI-powered web interface synced with the physical board.",
      "Built move detection through a Hall sensor matrix and synchronised board state in real time with a React web app that supports online play.",
      "Programmed the ESP32 Hall sensor grid and move-detection logic, and designed the PCB layout and 3D models of the internal mechanism.",
    ],
    architecture: "Hall sensor grid → ESP32 ⇄ Node.js + Socket.io ⇄ React · Stockfish AI · Arduino → steppers + electromagnet",
    tech: ["ESP32", "Arduino", "Embedded C++", "React", "Node.js", "Socket.io", "Stockfish AI"],
    links: { github: "" }, // TODO URL
  },
  {
    id: "agrosense", name: "AgroSense", subtitle: "Agricultural Decision-Support Platform",
    type: "Hackathon", context: "Devthon 3.0 Hackathon · Semi-Finalist", year: 2026, complexity: 7, primaryStack: "Spring Boot",
    oneLiner: "Weather-aware crop recommendations, disease-risk alerts and market prices for farmers.",
    problem: "Farmers make planting and treatment decisions without hyperlocal weather data, disease-risk warnings or fair market prices.",
    built: [
      "Built a Spring Boot backend and React frontend that deliver weather-responsive crop recommendations, disease risk mitigation and real-time market transparency.",
      "Integrated the OpenWeatherMap API for hyperlocal data and Cloudinary for media storage.",
      "Developed personalised dashboards, crop risk analysis and an admin management panel on an Aiven-hosted MySQL database.",
    ],
    architecture: "React (Vite) → Spring Boot (JWT) → MySQL (Aiven) · OpenWeatherMap API · Cloudinary",
    tech: ["Java", "Spring Boot", "MySQL (Aiven)", "React", "Vite", "Tailwind CSS", "JWT", "Cloudinary", "OpenWeatherMap API"],
    links: { github: "", live: "" }, // TODO URLs
  },
];

/* ---------- skills (force graph) ---------- */
// weight: 3 = use all the time, 2 = comfortable, 1 = have used. TODO: Isuru to adjust weights.
export const skillCategories: Record<SkillCategory, string> = {
  languages: "Languages", backend: "Backend", frontend: "Frontend", databases: "Databases",
  devops: "DevOps & Cloud", embedded: "Embedded / IoT", tools: "Tools",
};
export const skills: Skill[] = [
  { id: "java", name: "Java", category: "languages", weight: 3, projects: ["servesync", "agrosense"] },
  { id: "python", name: "Python", category: "languages", weight: 2, projects: ["lectra"] },
  { id: "javascript", name: "JavaScript", category: "languages", weight: 3, projects: ["chesswiz"] },
  { id: "c", name: "C", category: "languages", weight: 2, projects: [] },
  { id: "sql", name: "SQL", category: "languages", weight: 2, projects: ["servesync", "agrosense", "lectra"] },
  { id: "spring", name: "Spring Boot", category: "backend", weight: 3, projects: ["servesync", "agrosense"] },
  { id: "drf", name: "Django REST Framework", category: "backend", weight: 2, projects: ["lectra"] },
  { id: "rest", name: "REST APIs", category: "backend", weight: 3, projects: ["servesync", "lectra", "agrosense"] },
  { id: "websockets", name: "WebSockets", category: "backend", weight: 2, projects: ["servesync", "chesswiz"] },
  { id: "node", name: "Node.js", category: "backend", weight: 2, projects: ["chesswiz"] },
  { id: "jwt", name: "JWT / OAuth 2.0", category: "backend", weight: 2, projects: ["lectra", "agrosense"] },
  { id: "react", name: "React", category: "frontend", weight: 3, projects: ["servesync", "chesswiz", "agrosense"] },
  { id: "next", name: "Next.js", category: "frontend", weight: 2, projects: ["lectra"] },
  { id: "vite", name: "Vite", category: "frontend", weight: 2, projects: ["servesync", "agrosense"] },
  { id: "tailwind", name: "Tailwind CSS", category: "frontend", weight: 3, projects: ["servesync", "agrosense"] },
  { id: "htmlcss", name: "HTML5 & CSS3", category: "frontend", weight: 3, projects: [] },
  { id: "mysql", name: "MySQL", category: "databases", weight: 3, projects: ["servesync", "agrosense"] },
  { id: "postgres", name: "PostgreSQL", category: "databases", weight: 2, projects: ["lectra"] },
  { id: "mongodb", name: "MongoDB", category: "databases", weight: 1, projects: [] },
  { id: "mssql", name: "MSSQL", category: "databases", weight: 1, projects: [] },
  { id: "docker", name: "Docker", category: "devops", weight: 2, projects: ["lectra"] },
  { id: "gha", name: "GitHub Actions (CI/CD)", category: "devops", weight: 1, projects: [] },
  { id: "aws", name: "AWS", category: "devops", weight: 1, projects: [] },
  { id: "esp32", name: "ESP32", category: "embedded", weight: 2, projects: ["chesswiz"] },
  { id: "arduino", name: "Arduino", category: "embedded", weight: 2, projects: ["chesswiz"] },
  { id: "cpp", name: "Embedded C++", category: "embedded", weight: 2, projects: ["chesswiz"] },
  { id: "git", name: "Git & GitHub", category: "tools", weight: 3, projects: [] },
  { id: "postman", name: "Postman", category: "tools", weight: 2, projects: [] },
  { id: "swagger", name: "Swagger", category: "tools", weight: 1, projects: [] },
  { id: "cloudinary", name: "Cloudinary", category: "tools", weight: 2, projects: ["servesync", "agrosense"] },
  { id: "figma", name: "Figma", category: "tools", weight: 1, projects: [] },
];
export const methodologies = ["Agile", "Scrum"];

/* ---------- awards (max-heap) ---------- */
// The tab "Competitions" has exactly 7 items, which fills a 3-level heap perfectly.
// Insertion order below = chronological, so heapify() has real work to do on screen.
export const competitions: Competition[] = [
  { id: "coderush", title: "Top 20 – CodeRush 2024", short: "CodeRush · Top 20", result: "Top 20", teamLead: false, event: "CodeRush", organiser: "INTECS, University of Moratuwa", category: "Hackathon & Coding Competition", year: 2024, priority: 70 },
  { id: "devthon", title: "Semi-Finalist – Devthon 3.0", short: "Devthon 3.0 · SF", result: "Semi-Finalist", teamLead: false, event: "Devthon 3.0", organiser: "University of Moratuwa", category: "Web Development Competition", year: 2026, priority: 78 },
  { id: "genzipher", title: "Top 30 – GenZipher 1.0", short: "GenZipher · Top 30", result: "Top 30", teamLead: false, event: "GenZipher 1.0", organiser: "University of Colombo School of Computing (UCSC)", category: "CTF & Development Hackathon", year: 2026, priority: 65 },
  { id: "codesplash", title: "Champion – CodeSplash'26", short: "CodeSplash'26 · Champion", result: "Champion", teamLead: false, event: "CodeSplash'26", organiser: "Computer Science Students' Association, University of Kelaniya", category: "Hackathon & Web Development", year: 2026, priority: 100 },
  { id: "hackx", title: "Semi-Finalist & Team Lead – hackX 11.0", short: "hackX 11.0 · SF · Lead", result: "Semi-Finalist", teamLead: true, event: "hackX 11.0", organiser: "Industrial Management Science Students' Association, University of Kelaniya", category: "Inter-University Startup Challenge", year: 2026, priority: 80 },
  { id: "jpura", title: "Finalist & Team Lead – J'PuraXtreme 3.0", short: "J'PuraXtreme · Finalist", result: "Finalist", teamLead: true, event: "J'PuraXtreme 3.0", organiser: "IEEE Computer Society SBC, University of Sri Jayewardenepura", category: "Inter-University Coding Competition", year: 2026, priority: 90 },
  { id: "coderally", title: "Finalist & Team Lead – CodeRally 7.0", short: "CodeRally 7.0 · Finalist", result: "Finalist", teamLead: true, event: "CodeRally 7.0", organiser: "IEEE Computer Society SBC, Informatics Institute of Technology (IIT)", category: "Hackathon & Coding Competition", year: 2026, priority: 88 },
];
// Wording matters: "AWS Cloud Practitioner Essentials" is a course, NOT the "AWS Certified Cloud Practitioner" exam.
export const certifications: Certification[] = [
  { id: "aws", title: "AWS Cloud Practitioner Essentials", issuer: "AWS", verifyUrl: "", priority: 90 },        // TODO verify URL
  { id: "cisco-nt", title: "Network Technician Career Path", issuer: "Cisco Networking Academy", verifyUrl: "", priority: 85 }, // TODO verify URL
  { id: "cisco-cyber", title: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", verifyUrl: "", priority: 75 }, // TODO verify URL
  { id: "uom-web", title: "Web Design & Development", issuer: "University of Moratuwa (Department of IT)", priority: 70 },
  { id: "uom-python", title: "Python Programming", issuer: "University of Moratuwa (Department of CSE)", priority: 68 },
  { id: "sololearn-js", title: "Introduction to JavaScript", issuer: "SoloLearn", verifyUrl: "", priority: 60 },   // TODO verify URL
];

/* ---------- navigation (A* map nodes, in page order) ---------- */
export const sections = [
  { id: "about", label: "/about", concept: "profile" },
  { id: "education", label: "/education", concept: "compiler" },
  { id: "experience", label: "/experience", concept: "threads" },
  { id: "projects", label: "/projects", concept: "quicksort" },
  { id: "skills", label: "/skills", concept: "force graph" },
  { id: "awards", label: "/awards", concept: "max-heap" },
  { id: "contact", label: "/contact", concept: "tcp handshake" },
] as const;
