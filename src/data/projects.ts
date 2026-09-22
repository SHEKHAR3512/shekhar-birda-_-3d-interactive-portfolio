export interface ProjectMetric {
  label: string;
  value: string;
}

export interface MissionProject {
  id: string;
  planet: 'Mercury' | 'Venus' | 'Earth' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune';
  name: string;
  title: string;
  subtitle: string;
  role: string;
  company: string;
  duration: string;
  status: 'Completed' | 'In Progress' | 'Production';
  shortDescription: string;
  longDescription: string;
  challenges: string;
  technologies: string[];
  features: string[];
  metrics: ProjectMetric[];
  githubUrl: string;
  liveDemoUrl: string;
  accentColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  rotationSpeed: number;
  surfaceTextureType: 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';
  hasRings?: boolean;
  guideVoice: string;
  summaryDate: string;
}

export const MISSION_PROJECTS: MissionProject[] = [
  {
    id: 'mercury-ui-lab',
    planet: 'Mercury',
    name: 'React UI Lab & Components',
    title: 'React Micro-Interactions Lab',
    subtitle: 'High-Performance UI Micro-Components & WebGL',
    role: 'Frontend Architect (React + Three.js)',
    company: 'Independent / Open Source',
    duration: '2024 - 2025',
    status: 'Completed',
    shortDescription: 'Precision interactive UI components, micro-animations, and 60 FPS experimental graphics.',
    longDescription: 'A playground and design system laboratory for advanced React and WebGL micro-interactions. Includes physics-based gesture components, custom shaders, and interactive SVG widgets crafted for ultra-smooth user feedback.',
    challenges: 'Balancing complex mathematical spring physics and canvas rendering while maintaining zero frame drops on mobile viewports.',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Canvas API', 'WebGL'],
    features: [
      'Zero-dependency gesture physics algorithms',
      'Fluid spring micro-animations',
      'Accessible focus & keyboard navigation',
      'Theme-adaptive color engine (Dark/Light)',
      'Modular compound component architecture',
      'Ultra-low bundle footprint (<8kb)'
    ],
    metrics: [
      { label: 'Components', value: '25+' },
      { label: 'Avg FPS', value: '60' },
      { label: 'Test Coverage', value: '98%' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://github.com/SHEKHAR3512',
    accentColor: '#94a3b8',
    orbitRadius: 18,
    orbitSpeed: 0.16,
    size: 1.1,
    rotationSpeed: 0.008,
    surfaceTextureType: 'mercury',
    guideVoice: "Welcome to Mercury! Here Shekhar experiments with precision React micro-interactions and performance-critical UI modules.",
    summaryDate: '12 Aug 2025'
  },
  {
    id: 'venus-anna-travel',
    planet: 'Venus',
    name: 'Anna Travel Booking',
    title: 'Anna Travel Ecosystem',
    subtitle: 'Premium Travel & Excursion Booking Engine',
    role: 'Frontend Developer (React + Redux)',
    company: 'Apptunix',
    duration: '2024',
    status: 'Completed',
    shortDescription: 'Complete travel booking management system with real-time tour booking & multi-currency payments.',
    longDescription: 'Engineered a scalable travel agency operations platform handling multi-currency bookings, interactive excursion schedules, custom booking forms, and dynamic tour itineraries for European and Middle Eastern travelers.',
    challenges: 'Handling real-time seat availability across concurrent booking sessions and dynamic currency conversion without rounding drift.',
    technologies: ['React.js', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'Stripe API', 'REST APIs'],
    features: [
      'Interactive tour calendar & slot reservations',
      'Dynamic multi-currency pricing engine',
      'Automated email confirmation workflows',
      'Secure Stripe payment processing',
      'Admin reservation dashboard',
      'Responsive mobile itinerary viewer'
    ],
    metrics: [
      { label: 'Tours Booked', value: '14k+' },
      { label: 'Booking Speed', value: '1.2s' },
      { label: 'Uptime', value: '99.9%' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://annatravel.ge/',
    accentColor: '#fbbf24',
    orbitRadius: 28,
    orbitSpeed: 0.12,
    size: 1.4,
    rotationSpeed: -0.005,
    surfaceTextureType: 'venus',
    guideVoice: "You've reached Venus! Anna Travel powers high-volume international bookings with seamless booking flows.",
    summaryDate: '21 Jul 2025'
  },
  {
    id: 'earth-schooly',
    planet: 'Earth',
    name: 'Schooly App',
    title: 'Schooly Mobile Platform',
    subtitle: 'Smart Education & School Management',
    role: 'Lead React Native Engineer',
    company: 'Apptunix',
    duration: '2024',
    status: 'Completed',
    shortDescription: 'Full-featured React Native mobile application connecting parents, teachers, and school administration.',
    longDescription: 'Comprehensive educational platform serving thousands of parents and teachers daily. Built real-time attendance tracking, student progress reports, parent-teacher chat, timetable scheduling, and emergency broadcast notifications.',
    challenges: 'Ensuring seamless offline-first synchronization for teachers taking attendance in low-connectivity classroom environments.',
    technologies: ['React Native', 'TypeScript', 'Redux Toolkit', 'Firebase Messaging', 'WebSockets', 'Tailwind'],
    features: [
      'Real-time parent-teacher encrypted messaging',
      'Instant digital attendance & NFC check-in',
      'Interactive gradebook & report card generator',
      'Automated homework & bus tracking alerts',
      'Cross-platform iOS & Android parity',
      'Offline-first synchronized local cache'
    ],
    metrics: [
      { label: 'Active Students', value: '8,500+' },
      { label: 'Daily Sessions', value: '32k' },
      { label: 'Crash-free', value: '99.8%' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://github.com/SHEKHAR3512',
    accentColor: '#38bdf8',
    orbitRadius: 38,
    orbitSpeed: 0.1,
    size: 1.5,
    rotationSpeed: 0.01,
    surfaceTextureType: 'earth',
    guideVoice: "Approach confirmed for Earth. Schooly App is Shekhar's production React Native application connecting parents and teachers in real time.",
    summaryDate: '23 Jul 2025'
  },
  {
    id: 'mars-snibbl-food',
    planet: 'Mars',
    name: 'Snibbl Food Platform',
    title: 'Snibbl Food Waste Platform',
    subtitle: 'UAE Flagship Food Surplus Marketplace',
    role: 'Frontend Developer (React + React Native)',
    company: 'Apptunix',
    duration: '2024',
    status: 'Production',
    shortDescription: 'UAE flagship food surplus marketplace connecting 12,000+ consumers with 280+ restaurant partners.',
    longDescription: 'Built the administrative management portal, merchant operations center, and consumer flows for Snibbl Food. Rescues surplus high-quality food from 280+ top merchant restaurants, bakeries, and cafes via discounted "Mystery Bags". Built real-time inventory sync, settlement disbursement, and automated location-based push notifications.',
    challenges: 'Sub-second inventory synchronization and instant stock lock during high-concurrency checkout rushes for limited mystery bags.',
    technologies: ['React Native', 'React', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Firebase Realtime DB', 'Fastlane'],
    features: [
      'Admin & Merchant Panels',
      'Real-time Inventory & Stock Lock',
      'Order & Settlement Management',
      'Automated Geo-fenced Push Notifications',
      'Customer Mystery Bag reservation flows',
      'Analytics & Merchant Payout Reports'
    ],
    metrics: [
      { label: 'Active Users', value: '12,000+' },
      { label: 'Merchant Partners', value: '280+' },
      { label: 'Food Rescued', value: '50k+ Bags' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://snibbl.com/',
    accentColor: '#f97316',
    orbitRadius: 48,
    orbitSpeed: 0.08,
    size: 1.25,
    rotationSpeed: 0.009,
    surfaceTextureType: 'mars',
    guideVoice: "This is the Snibbl Food platform — a complete food delivery ecosystem. Shekhar engineered the admin and merchant panels handling orders, settlements, and live logistics.",
    summaryDate: '18 Jul 2025'
  },
  {
    id: 'jupiter-ecommerce',
    planet: 'Jupiter',
    name: 'Magrudy Loyalty & E-Commerce',
    title: "Magrudy's Omnichannel Rewards",
    subtitle: 'Retail POS & Digital Commerce Ecosystem',
    role: 'Lead UI Engineer (React + TypeScript)',
    company: 'Apptunix',
    duration: '2024',
    status: 'Completed',
    shortDescription: "UAE's historic bookshop loyalty platform uniting in-store POS and digital online purchases.",
    longDescription: "A unified loyalty and rewards program for Magrudy's, designed for readers and families across the UAE. Unifies brick-and-mortar scanning with online web transactions into a single rewards program with Apple Wallet pass generation.",
    challenges: 'Synchronizing physical barcode scanner events with real-time customer loyalty tiers across distributed retail outlets.',
    technologies: ['React.js', 'TypeScript', 'Redux Toolkit', 'Material UI', 'Barcode Scanner API', 'Firebase'],
    features: [
      'Omnichannel point-earning and tier upgrades',
      'Instant barcode scanning for in-store checkout',
      'Digital Apple Wallet & Google Pay pass generation',
      'Personalized book recommendations engine',
      'Merchant cashier quick-scan portal',
      'Comprehensive customer rewards history'
    ],
    metrics: [
      { label: 'Stores Connected', value: '24+' },
      { label: 'Loyalty Members', value: '45k+' },
      { label: 'Scan Latency', value: '<120ms' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://magrudy.com',
    accentColor: '#f59e0b',
    orbitRadius: 60,
    orbitSpeed: 0.05,
    size: 2.8,
    rotationSpeed: 0.02,
    surfaceTextureType: 'jupiter',
    guideVoice: "Behold Jupiter! This planetary archive represents Shekhar's work on Magrudy's omnichannel retail loyalty system across the UAE.",
    summaryDate: '05 Jun 2025'
  },
  {
    id: 'saturn-portfolio-3d',
    planet: 'Saturn',
    name: '3D Cosmos Portfolio Engine',
    title: 'Interactive 3D Mission Portfolio',
    subtitle: 'Game-Engine Developer Experience',
    role: 'WebGL & Creative Frontend Architect',
    company: 'Personal Project',
    duration: '2025',
    status: 'Completed',
    shortDescription: 'Game-inspired 3D WebGL solar system exploration portfolio with procedural planet rendering and flight physics.',
    longDescription: 'Created this entire interactive 3D solar system experience from scratch using Three.js, GSAP, Zustand, and React. Features procedural planetary textures, particle starfields, real-time telemetry HUD, and cinematic starfighter flight physics.',
    challenges: 'Designing custom canvas textures to achieve realistic planetary surfaces without downloading dozens of megabytes of image assets.',
    technologies: ['Three.js', 'React 19', 'TypeScript', 'GSAP', 'Zustand', 'Tailwind CSS v4'],
    features: [
      'Procedural planet surface shader algorithms',
      '60 FPS orbital motion and camera flight choreography',
      'Interactive holographic project dossier',
      'Adaptive dark space & daylight spacecraft modes',
      'Persistent mission progression & achievement engine',
      'Responsive touch exploration for mobile'
    ],
    metrics: [
      { label: 'FPS Target', value: '60' },
      { label: 'Planets Modeled', value: '8' },
      { label: 'Light/Dark Modes', value: '2' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512/shekhar-birda-_-3d-interactive-portfolio',
    liveDemoUrl: 'https://shekharbirda.dev',
    accentColor: '#e2e8f0',
    orbitRadius: 74,
    orbitSpeed: 0.04,
    size: 2.3,
    rotationSpeed: 0.015,
    surfaceTextureType: 'saturn',
    hasRings: true,
    guideVoice: "Approaching Saturn with its majestic rings. This planet showcases the 3D WebGL engine and creative frontend architecture powering this portfolio.",
    summaryDate: '28 May 2025'
  },
  {
    id: 'uranus-edu-match',
    planet: 'Uranus',
    name: 'EDU-Match AI Platform',
    title: 'AI Career & University Matcher',
    subtitle: 'Intelligent Academic Guidance Ecosystem',
    role: 'Frontend & AI Integration Engineer',
    company: 'Apptunix',
    duration: '2024',
    status: 'Completed',
    shortDescription: 'AI-driven candidate profile matching engine connecting students with institutions and career paths.',
    longDescription: 'Architected the responsive web platform for EDU-Match, integrating Gemini AI models to analyze candidate credentials, predict institutional acceptance probability, and recommend personalized skill enhancement roadmaps.',
    challenges: 'Streaming AI generation tokens smoothly into complex formatted UI cards without causing React re-render stutters.',
    technologies: ['React.js', 'TypeScript', 'Firebase Auth', 'Firestore', 'Gemini API', 'Tailwind CSS'],
    features: [
      'AI-driven resume parsing & competency score',
      'Real-time university application tracking',
      'Role-based portals for students and counselors',
      'Instant AI mentorship guidance chat',
      'Secure document vault with Firestore',
      'Data visualization of acceptance rates'
    ],
    metrics: [
      { label: 'Matching Accuracy', value: '94%' },
      { label: 'Latency', value: '<200ms' },
      { label: 'Institutions', value: '100+' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://edumatchconnect.ai/',
    accentColor: '#38bdf8',
    orbitRadius: 88,
    orbitSpeed: 0.03,
    size: 1.8,
    rotationSpeed: -0.01,
    surfaceTextureType: 'uranus',
    guideVoice: "Welcome to Uranus! Here lies EDU-Match AI — Shekhar's intelligent career matching platform powered by Google Gemini and real-time Firestore sync.",
    summaryDate: '15 May 2025'
  },
  {
    id: 'neptune-mybooky',
    planet: 'Neptune',
    name: 'MyBooky Platform',
    title: 'Instant Clinic & Salon Booking',
    subtitle: 'Hyperlocal Appointment Management',
    role: 'Mobile & Web Frontend Engineer',
    company: 'Apptunix',
    duration: '2024',
    status: 'Completed',
    shortDescription: 'Hyperlocal instant appointment booking app for salons, wellness clinics, and barbers across the UAE.',
    longDescription: 'Engineered an appointment scheduling mobile app with real-time calendar availability, service provider portfolios, automated WhatsApp/SMS booking confirmations, and customer loyalty reward tiers.',
    challenges: 'Solving concurrent appointment booking collisions for solo clinicians with sub-second optimistic locks.',
    technologies: ['React Native', 'React.js', 'Redux Toolkit', 'Firebase Realtime DB', 'Google Maps API'],
    features: [
      'Instant calendar time-slot booking',
      'Hyperlocal GPS clinic & salon discovery',
      'Service catalog with customer reviews',
      'Automated appointment reminders',
      'Merchant scheduling tablet dashboard',
      'In-app loyalty discount vouchers'
    ],
    metrics: [
      { label: 'Booking Time', value: '<30s' },
      { label: 'Clinics Onboarded', value: '180+' },
      { label: 'Rating', value: '4.8 ★' }
    ],
    githubUrl: 'https://github.com/SHEKHAR3512',
    liveDemoUrl: 'https://mybooky.app',
    accentColor: '#3b82f6',
    orbitRadius: 100,
    orbitSpeed: 0.02,
    size: 1.75,
    rotationSpeed: 0.012,
    surfaceTextureType: 'neptune',
    guideVoice: "Reaching the frontier at Neptune! MyBooky powers instant salon and clinic booking across the UAE with real-time scheduling.",
    summaryDate: '01 May 2025'
  }
];
