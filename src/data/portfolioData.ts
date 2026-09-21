import { Project, Experience, Education, SkillCategory, CollectibleItem, SkillPlanet, SuggestionBlueprint } from '../types';

export const PERSONAL_INFO = {
  name: 'Shekhar Birda',
  title: 'React Native Developer | React.js Developer',
  experience: '2+ Years Experience',
  email: 'shekharjaat751@gmail.com',
  github: 'https://github.com/SHEKHAR3512',
  linkedin: 'https://www.linkedin.com/in/shekhar-birda-279763353/',
  phone: '+91 9996231869',
  location: 'Haryana / Remote, India',
  summary:
    'Experienced React Developer with hands-on experience building scalable web applications and mobile apps using React, React Native, Next.js, TypeScript, Redux Toolkit, and Firebase. Skilled in developing complex business modules, high-performance UI engineering, and seamless RESTful / Realtime DB integrations across food delivery, AI career matching, booking, and loyalty platforms.',
  stats: [
    { label: 'Active App Users', value: '12,000+' },
    { label: 'Merchant Partners', value: '280+' },
    { label: 'Production Apps', value: '5+' },
    { label: 'Academic GPA', value: '8.0 / 10' },
  ],
};

export const PROJECTS: Project[] = [
  {
    id: 'snibbl',
    title: 'Snibbl',
    category: 'Mobile App',
    subtitle: 'Food Waste Reduction Platform',
    period: '2024',
    company: 'Apptunix',
    tagline: "UAE's leading food-waste reduction mobile platform connecting consumers with restaurants & bakeries.",
    description:
      'Snibbl is the UAE’s premier sustainability platform that rescues surplus high-quality food from 280+ top merchant restaurants, bakeries, and cafes via discounted "Mystery Bags". As lead mobile engineer, built core consumer-facing flows and real-time inventory systems.',
    highlights: [
      'Engineered core consumer-facing features enabling discovery and reservation of surplus-food Mystery Bags across 280+ merchant partners in the UAE.',
      'Developed and maintained high-performance React Native application serving 12,000+ active users with 99.8% crash-free sessions.',
      'Integrated Firebase Realtime DB & Firestore for sub-second inventory sync and instant stock lock during checkout.',
      'Integrated merchant RESTful APIs, optimized order checkout flow, and implemented automated location-based push notifications.',
    ],
    metrics: [
      { label: 'Active Users', value: '12,000+' },
      { label: 'Merchant Partners', value: '280+' },
      { label: 'Food Rescued', value: '50k+ Bags' },
    ],
    techStack: ['React Native', 'TypeScript', 'Redux Toolkit', 'Firebase Realtime DB', 'REST APIs', 'Fastlane'],
    links: {
      live: 'https://snibbl.com/',
      demo: '#',
    },
    color: '#94a3b8', // Mercury - Rocky Grey
    accentColor: '#38bdf8',
    badge: 'Mercury • Flagship App',
    worldPosition: [18, 0, 0], // 3D Coordinates in world
    likes: 142,
    solarPlanet: 'Mercury',
    orbitRadius: 18,
    orbitSpeed: 0.16,
  },
  {
    id: 'edu-match',
    title: 'EDU-Match',
    category: 'Web Platform',
    subtitle: 'AI-Powered Career & Academic Platform',
    period: '2024',
    company: 'Apptunix',
    tagline: 'AI-driven student-university and professional career guidance matching ecosystem.',
    description:
      'A smart career matching platform connecting professionals with personalized skill-development paths, AI-assisted mentorship guidance, and university matching portals.',
    highlights: [
      'Built an AI-powered career-matching platform connecting professionals with personalized skill-development paths and opportunities.',
      'Integrated Firebase Authentication and Firestore for secure, real-time student-university matching and role-based data access for 100+ active users.',
      'Implemented reusable modular UI components and Redux Toolkit state architecture for rapid feature delivery and test coverage.',
      'Designed interactive candidate progress trackers with real-time analytics dashboards.',
    ],
    metrics: [
      { label: 'Matching Accuracy', value: '94%' },
      { label: 'Institutional Users', value: '100+' },
      { label: 'Response Latency', value: '<200ms' },
    ],
    techStack: ['React.js', 'TypeScript', 'Redux Toolkit', 'Firebase Auth', 'Firestore', 'Tailwind CSS'],
    links: {
      live: 'https://edumatchconnect.ai/',
    },
    color: '#eab308', // Venus - Golden Atmosphere
    accentColor: '#fde047',
    badge: 'Venus • AI Platform',
    worldPosition: [0, 0, 28],
    likes: 98,
    solarPlanet: 'Venus',
    orbitRadius: 28,
    orbitSpeed: 0.12,
  },
  {
    id: 'mybooky',
    title: 'MyBooky',
    category: 'Mobile App',
    subtitle: 'UAE Clinic & Salon Instant Booking',
    period: '2024',
    company: 'Apptunix',
    tagline: 'Instant appointment booking platform for salons, barbers, and clinics across the UAE.',
    description:
      'Engineered an on-demand booking platform that eliminates tedious phone calls and Instagram DMs by offering real-time calendar availability, automatic reminders, and instant confirmations.',
    highlights: [
      'Architected the core customer booking flow with the mission of making appointment scheduling as frictionless as ordering food.',
      'Engineered a business-facing management dashboard featuring automatic WhatsApp/SMS reminders and live chair availability.',
      'Implemented offline-first caching and conflict-resolution algorithms for concurrent appointment bookings.',
      'Cross-platform delivery on iOS, Android, and Web using React Native and React.js shared business logic.',
    ],
    metrics: [
      { label: 'Booking Time', value: '<30 secs' },
      { label: 'Partner Clinics', value: '150+' },
      { label: 'No-Show Reduction', value: '45%' },
    ],
    techStack: ['React Native', 'React.js', 'TypeScript', 'Firebase', 'Redux Toolkit', 'Node.js'],
    links: {
      live: 'https://mybooky.app',
    },
    color: '#2563eb', // Earth - Sapphire Blue & Continental Green
    accentColor: '#10b981',
    badge: 'Earth • Booking Hub',
    worldPosition: [-40, 0, 0],
    likes: 87,
    solarPlanet: 'Earth',
    orbitRadius: 40,
    orbitSpeed: 0.09,
  },
  {
    id: 'magrudys',
    title: "Magrudy's Loyalty & Rewards",
    category: 'Enterprise UI',
    subtitle: 'Omnichannel Loyalty Program',
    period: '2024',
    company: 'Apptunix',
    tagline: "UAE's historic bookshop loyalty platform uniting in-store POS and digital online purchases.",
    description:
      "A unified loyalty and rewards program for Magrudy's, designed for readers, families, and lifelong learners across the UAE, unifying in-store retail experiences with online e-commerce rewards.",
    highlights: [
      "Built the Magrudy's Loyalty & Rewards platform, unifying in-store brick-and-mortar scanning with online web transactions into a single rewards program.",
      'Implemented point-earning, tier upgrades, redemption vouchers, and personalized book recommendation offers.',
      'Designed an accessible, clean UI tailored for readers of all ages using Material UI and custom design tokens.',
      'Integrated POS barcode scanning and wallet pass generation for Apple Wallet and Google Pay.',
    ],
    metrics: [
      { label: 'Stores Connected', value: '14 Stores' },
      { label: 'Loyalty Members', value: '25,000+' },
      { label: 'Repeat Orders', value: '+38%' },
    ],
    techStack: ['React.js', 'TypeScript', 'Material UI', 'Redux Toolkit', 'REST APIs'],
    links: {
      live: 'https://www.magrudy.com/',
    },
    color: '#ea580c', // Mars - Red Planet Rust
    accentColor: '#f97316',
    badge: 'Mars • Retail & Loyalty',
    worldPosition: [0, 0, -54],
    likes: 76,
    solarPlanet: 'Mars',
    orbitRadius: 54,
    orbitSpeed: 0.07,
  },
  {
    id: 'gulfbarshow',
    title: 'Gulf Bar Show',
    category: 'Web Platform',
    subtitle: 'MENA Trade Show Companion App',
    period: '2024',
    company: 'Apptunix',
    tagline: "The official digital companion app for Dubai's premier beverage and hospitality trade exhibition.",
    description:
      "An all-in-one digital companion web app for MENA's first dedicated bar and beverage trade show, held at Dubai World Trade Centre. Enabled seamless navigation, schedule planning, and exhibitor networking.",
    highlights: [
      "Built the official companion app for MENA's first dedicated bar and beverage trade exhibition.",
      'Delivered an interactive floorplan and digital directory for hundreds of global exhibitors and attendees to navigate the expo.',
      'Integrated live keynote schedule with calendar bookmarks, masterclass registration, and real-time announcements.',
      'Ensured sub-second load times on mobile networks through aggressive code splitting and asset optimization.',
    ],
    metrics: [
      { label: 'Expo Attendees', value: '5,000+' },
      { label: 'Exhibitors Listed', value: '120+' },
      { label: 'Uptime', value: '100%' },
    ],
    techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'PWA', 'REST APIs'],
    links: {
      live: 'https://gulfbarshow.com/',
    },
    color: '#d97706', // Jupiter - Banded Caramel Gas Giant
    accentColor: '#fbbf24',
    badge: 'Jupiter • Grand Expo',
    worldPosition: [49, 0, 49],
    likes: 114,
    solarPlanet: 'Jupiter',
    orbitRadius: 70,
    orbitSpeed: 0.045,
  },
];

export const EXPERIENCES: Experience[] = [
  {
    role: 'React Developer',
    company: 'Apptunix',
    period: '2024 – Present',
    location: 'Mohali / Remote',
    type: 'Full-time',
    highlights: [
      'Developed and maintained production-grade React.js and React Native mobile applications with TypeScript.',
      'Built reusable, highly performant UI component libraries following modern React and atomic design patterns.',
      'Integrated complex REST APIs and Firebase Realtime Database using Redux Toolkit and RTK Query.',
      'Implemented robust client-side authentication, token refresh lifecycle, and role-based permissions.',
      'Collaborated tightly with product owners, UI/UX designers, and backend engineering teams in Agile 2-week sprints.',
      'Fixed production bottlenecks and reduced React Native bridge re-renders by 35%.',
    ],
  },
];

export const EDUCATION: Education = {
  degree: 'Diploma in Computer Engineering',
  institution: 'Govt Polytechnic, Sirsa',
  location: 'Haryana, India',
  period: 'August 2022 – July 2024',
  gpa: '8.0 / 10',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend & Mobile Core',
    skills: [
      { name: 'React.js', level: 95, highlight: true },
      { name: 'React Native', level: 92, highlight: true },
      { name: 'Next.js', level: 88, highlight: true },
      { name: 'TypeScript', level: 90, highlight: true },
      { name: 'JavaScript (ES6+)', level: 94 },
      { name: 'HTML5 & CSS3', level: 95 },
      { name: 'Three.js / 3D Web', level: 80, highlight: true },
    ],
  },
  {
    title: 'State & Data Layer',
    skills: [
      { name: 'Redux Toolkit', level: 92, highlight: true },
      { name: 'RTK Query', level: 88 },
      { name: 'Context API', level: 90 },
      { name: 'REST APIs & GraphQL', level: 90 },
    ],
  },
  {
    title: 'Backend & Cloud Services',
    skills: [
      { name: 'Firebase Firestore', level: 88, highlight: true },
      { name: 'Firebase Realtime DB', level: 85, highlight: true },
      { name: 'Firebase Authentication', level: 90 },
      { name: 'Node.js & Express', level: 78 },
    ],
  },
  {
    title: 'UI Engineering & Animation',
    skills: [
      { name: 'Tailwind CSS', level: 94, highlight: true },
      { name: 'Material UI (MUI)', level: 90 },
      { name: 'Core UI', level: 82 },
      { name: 'GSAP Animations', level: 85, highlight: true },
      { name: 'Motion (Framer)', level: 88 },
    ],
  },
  {
    title: 'Tools & DevOps',
    skills: [
      { name: 'Git & GitHub', level: 92 },
      { name: 'Postman', level: 90 },
      { name: 'ESLint / Prettier / Husky', level: 88 },
      { name: 'CI/CD Pipelines (Vercel/Netlify)', level: 85 },
      { name: 'Jira, Asana, Agile Scrum', level: 88 },
    ],
  },
];

export const COLLECTIBLE_ITEMS: CollectibleItem[] = [
  { id: 'c1', name: 'React.js Power Orb', type: 'skill', position: [-12, 1.2, -10], collected: false, color: '#61dafb', points: 100 },
  { id: 'c2', name: 'React Native Engine', type: 'skill', position: [12, 1.2, -10], collected: false, color: '#00d8ff', points: 100 },
  { id: 'c3', name: 'TypeScript Gem', type: 'gem', position: [-12, 1.2, 10], collected: false, color: '#3178c6', points: 150 },
  { id: 'c4', name: 'Next.js Turbo Core', type: 'skill', position: [12, 1.2, 10], collected: false, color: '#ffffff', points: 150 },
  { id: 'c5', name: 'Firebase Realtime Star', type: 'gem', position: [0, 1.5, -18], collected: false, color: '#ffca28', points: 200 },
  { id: 'c6', name: 'Three.js 3D Prism', type: 'trophy', position: [0, 2.0, 24], collected: false, color: '#049ef4', points: 250 },
  { id: 'c7', name: 'Redux Toolkit Battery', type: 'skill', position: [-26, 1.2, 0], collected: false, color: '#764abc', points: 100 },
  { id: 'c8', name: 'Tailwind Velocity Boost', type: 'gem', position: [26, 1.2, 0], collected: false, color: '#38bdf8', points: 150 },
];

export const SKILL_PLANETS: SkillPlanet[] = [
  {
    id: 'planet-mobile',
    name: 'Saturn • React Native & Mobile Systems',
    domain: 'Mobile Engineering',
    subtitle: '60 FPS Native Architecture, TurboModules & Offline Sync',
    color: '#e2b866', // Saturn - Golden Ringed Gas Giant
    accentColor: '#fcd34d',
    size: 4.2,
    worldPosition: [-62, 0, 62],
    solarPlanet: 'Saturn',
    orbitRadius: 88,
    orbitSpeed: 0.035,
    skills: [
      { name: 'React Native', level: 94, note: 'Cross-platform iOS & Android production leadership', highlight: true },
      { name: 'TypeScript (Strict)', level: 92, note: 'Strict typing across navigation & API boundaries', highlight: true },
      { name: 'Expo & EAS Build', level: 90, note: 'Continuous deployment pipelines, OTA updates', highlight: true },
      { name: 'Reanimated 3 & Gesture Handler', level: 90, note: 'Fluid 60-120fps physics interactions' },
      { name: 'Native Bridge Optimization', level: 88, note: 'Reduced unnecessary bridge serialization by 35%' },
      { name: 'Offline-First Storage', level: 86, note: 'Local queuing, sync reconciliation algorithms' },
    ],
    architectureHighlights: [
      'Engineered React Native mobile apps serving 12,000+ active users with 99.8% crash-free reliability.',
      'Reduced mobile memory footprint and JS-thread frame drops by virtualizing deep list viewports.',
      'Constructed modular Atomic design pattern systems shared between iOS, Android, and Web targets.',
      'Engineered instant offline feedback with optimistic updates and background sync reconciliation.',
    ],
    productionPatterns: [
      'Single Source of Truth state store with RTK normalized entities',
      'Encapsulated custom hooks for location tracking, biometrics, and push notifications',
      'Zero-re-render audio synthesis and gesture triggers',
    ],
    recommendedUseCases: [
      'High-velocity Cross-Platform Mobile MVPs (iOS & Android)',
      'Legacy mobile app refactor to 60fps Reanimated architecture',
      'On-demand booking & real-time delivery tracking applications',
    ],
    hasRings: true,
    ringColor: '#fcd34d',
    moons: [
      { name: 'Titan', distance: 6.2, speed: 0.7, size: 0.65, color: '#fef08a' },
      { name: 'Reanimated', distance: 8.0, speed: 0.5, size: 0.45, color: '#38bdf8' },
    ],
  },
  {
    id: 'planet-web',
    name: 'Uranus • React 18 & Next.js Architecture',
    domain: 'Web Architecture',
    subtitle: 'Modern Component Engineering, SSR/SSG & WebGL 3D Systems',
    color: '#06b6d4', // Uranus - Cyan Ice Giant
    accentColor: '#67e8f9',
    size: 3.6,
    worldPosition: [-106, 0, 0],
    solarPlanet: 'Uranus',
    orbitRadius: 106,
    orbitSpeed: 0.028,
    skills: [
      { name: 'React.js 18+', level: 95, note: 'Concurrent features, custom hooks, suspense & boundaries', highlight: true },
      { name: 'Next.js (App Router)', level: 88, note: 'Server-side rendering, streaming & edge caching', highlight: true },
      { name: 'Three.js & WebGL', level: 82, note: 'Kinematic 3D flight engines, custom shaders & geometry', highlight: true },
      { name: 'Tailwind CSS', level: 95, note: 'Utility-first design tokens, responsive fluid layouts', highlight: true },
      { name: 'HTML5 & Modern CSS', level: 95, note: 'Accessible semantic trees, CSS subgrid & transforms' },
      { name: 'PWA & Service Workers', level: 86, note: 'Offline cache strategies & installable web apps' },
    ],
    architectureHighlights: [
      'Architected high-throughput web portals handling thousands of concurrent users with sub-second TTI.',
      'Crafted interactive 3D WebGL experiences achieving consistent 60+ FPS on mobile & desktop browsers.',
      'Implemented design token architecture enabling seamless dark/light mode and cyber theme variations.',
      'Applied code-splitting and dynamic chunk pre-loading reducing initial bundle size by 40%.',
    ],
    productionPatterns: [
      'Container-Presenter component separation with typed view models',
      'Decoupled request proxies preventing client-side secret exposure',
      'Responsive touch & mouse unified interaction controllers',
    ],
    recommendedUseCases: [
      'Interactive 3D / WebGL brand showcases and high-conversion landing engines',
      'Scalable SaaS platforms requiring real-time dashboards and multi-tenant auth',
      'Event companion platforms with offline directories and live schedules',
    ],
    hasRings: true,
    ringColor: '#67e8f9',
    moons: [
      { name: 'Titania', distance: 5.6, speed: 0.6, size: 0.5, color: '#e0f2fe' },
      { name: 'Three.js', distance: 7.2, speed: 0.45, size: 0.5, color: '#049ef4' },
    ],
  },
  {
    id: 'planet-cloud',
    name: 'Neptune • Firebase & Cloud Platform',
    domain: 'Backend & Cloud',
    subtitle: 'Sub-Second Realtime DB, Firestore & Enterprise Auth Security',
    color: '#1d4ed8', // Neptune - Deep Azure Blue
    accentColor: '#60a5fa',
    size: 3.5,
    worldPosition: [0, 0, 124],
    solarPlanet: 'Neptune',
    orbitRadius: 124,
    orbitSpeed: 0.022,
    skills: [
      { name: 'Firebase Firestore', level: 90, note: 'Realtime document listeners & composite query indexes', highlight: true },
      { name: 'Firebase Realtime DB', level: 88, note: 'Sub-second inventory locks and stock availability', highlight: true },
      { name: 'Firebase Authentication', level: 92, note: 'Multi-factor, OAuth & secure session persistence', highlight: true },
      { name: 'RESTful API Integration', level: 92, note: 'Resilient HTTP layers with automatic retry/backoff' },
      { name: 'Node.js & Express', level: 80, note: 'Micro-services, middleware & webhook processing' },
      { name: 'Cloud Functions & Triggers', level: 82, note: 'Serverless event-driven automation' },
    ],
    architectureHighlights: [
      'Engineered sub-second stock locking preventing concurrent double-booking during flash-sale checkouts.',
      'Designed granular role-based access control (RBAC) security rules for multi-tenant organizations.',
      'Built live synchronization pipelines linking point-of-sale systems with cloud databases.',
      'Integrated real-time push notification dispatch engines via FCM.',
    ],
    productionPatterns: [
      'Idempotent API retry with exponential backoff on flaky cellular networks',
      'Optimistic mutations with automated rollback on transaction failure',
      'Structured error boundaries capturing runtime issues without white-screening',
    ],
    recommendedUseCases: [
      'Real-time collaborative applications and live inventory tracking',
      'On-demand appointment booking systems with automated WhatsApp/SMS alerts',
      'Cross-platform authenticated member portals with role-based permissions',
    ],
    hasRings: false,
    moons: [
      { name: 'Triton', distance: 5.4, speed: -0.65, size: 0.55, color: '#93c5fd' }, // Retrograde orbit!
      { name: 'Firestore', distance: 7.2, speed: 0.45, size: 0.45, color: '#ffca28' },
    ],
  },
  {
    id: 'planet-state',
    name: 'Pluto • State & 60 FPS Profiler',
    domain: 'State & Performance',
    subtitle: 'Predictable Redux Toolkit, Normalized Cache & Frame-Rate Auditing',
    color: '#9333ea', // Pluto - Deep Purple / Kuiper Ice
    accentColor: '#c084fc',
    size: 2.8,
    worldPosition: [99, 0, -99],
    solarPlanet: 'Pluto',
    orbitRadius: 140,
    orbitSpeed: 0.018,
    skills: [
      { name: 'Redux Toolkit (RTK)', level: 94, note: 'Immutable slices, createAsyncThunk & entity adapters', highlight: true },
      { name: 'RTK Query', level: 88, note: 'Automated caching, polling & optimistic cache updates', highlight: true },
      { name: 'Context API & Zustand', level: 90, note: 'Lightweight atomic state for transient UI controls' },
      { name: 'Performance Profiling', level: 90, note: 'React DevTools flamegraphs, re-render elimination', highlight: true },
      { name: 'GSAP & Motion', level: 88, note: 'Choreographed timelines, scroll triggers & micro-interactions' },
    ],
    architectureHighlights: [
      'Normalized relational client state to eliminate redundant updates across deeply nested UI trees.',
      'Benchmarked and optimized frame pacing, maintaining a rock-solid 60 FPS under heavy data loads.',
      'Configured automated caching and tag invalidation strategies saving over 45% in backend queries.',
      'Eliminated prop-drilling through clean domain slice encapsulation.',
    ],
    productionPatterns: [
      'Memoized reselect selectors to prevent unnecessary re-computations',
      'Decoupled sound/physics loops from React lifecycle using mutable zero-latency refs',
      'Automated state hydration and persistence with schema versioning',
    ],
    recommendedUseCases: [
      'Complex enterprise state workflows with multiple simultaneous data streams',
      'High-performance data visualization dashboards and canvas graphics',
      'Scalable e-commerce and retail cart engines with multi-currency calculations',
    ],
    hasRings: false,
    moons: [
      { name: 'Charon', distance: 4.2, speed: 0.8, size: 0.5, color: '#e9d5ff' },
    ],
  },
];

export const SUGGESTION_BLUEPRINTS: SuggestionBlueprint[] = [
  {
    id: 'sug-mobile-mvp',
    category: 'Mobile Development',
    title: 'Cross-Platform Mobile MVP (iOS & Android)',
    badge: 'High Demand',
    description:
      'Turn your product vision into a live, production-grade mobile app on both iOS App Store and Google Play Store in weeks, built with a unified, maintainable React Native codebase.',
    recommendedStack: ['React Native', 'Expo & EAS', 'TypeScript', 'Redux Toolkit', 'Firebase / Supabase', 'Tailwind/NativeWind'],
    estimatedTimeline: '3 – 5 Weeks',
    keyDeliverables: [
      'Single shared TypeScript codebase for iOS and Android',
      'Complete authentication, profile onboarding & push notifications',
      'Realtime cloud database sync & offline cache handling',
      'Automated App Store TestFlight & Google Play Beta deployment',
    ],
    referenceProjectTitle: 'Snibbl (12,000+ Users) & MyBooky',
    referenceProjectId: 'snibbl',
  },
  {
    id: 'sug-perf-audit',
    category: 'Performance Engineering',
    title: 'Mobile & Web App 60 FPS Performance Audit',
    badge: 'Rapid Turnaround',
    description:
      'Eliminate laggy scrolling, memory leaks, and frequent crashes in your existing React Native or React application, upgrading the UX to buttery-smooth 60–120 FPS.',
    recommendedStack: ['Reanimated 3', 'React Native Bridge Audit', 'Flipper / Chrome Profiler', 'Memory Leak Analysis'],
    estimatedTimeline: '1 – 2 Weeks',
    keyDeliverables: [
      'Comprehensive performance audit & re-render flamegraph analysis',
      'Bridge traffic reduction and list viewport virtualization',
      'Elimination of unhandled promise rejections and crash triggers (99.8%+ target)',
      'Upgraded UI micro-interactions running natively on the UI thread',
    ],
    referenceProjectTitle: 'Apptunix Production Optimization (-35% Bridge Traffic)',
    referenceProjectId: 'snibbl',
  },
  {
    id: 'sug-realtime-web',
    category: 'Web Platform',
    title: 'Real-Time Enterprise Web Platform & Admin Portal',
    badge: 'Enterprise',
    description:
      'Build a modern, lightning-fast web platform with responsive dashboards, role-based access management, and live data synchronization across all devices.',
    recommendedStack: ['React 18 / Next.js', 'TypeScript', 'Firebase / REST APIs', 'Redux Toolkit', 'Tailwind CSS'],
    estimatedTimeline: '2 – 4 Weeks',
    keyDeliverables: [
      'Modular, responsive design system supporting desktop, tablet & mobile',
      'Role-based permissions (Super Admin, Manager, Member)',
      'Sub-second live data sync with automatic offline reconciliation',
      'Exportable analytics, audit logs, and search indexing',
    ],
    referenceProjectTitle: 'EDU-Match & Magrudy’s Loyalty Platform',
    referenceProjectId: 'edu-match',
  },
  {
    id: 'sug-fulltime-hire',
    category: 'Full-Time / Contract',
    title: 'Hire Shekhar as React & React Native Engineer',
    badge: 'Immediate Availability',
    description:
      'Bring a dedicated, communicative, and skilled software engineer to your engineering team who ships clean code, takes ownership of end-to-end features, and collaborates seamlessly.',
    recommendedStack: ['React Native', 'React.js', 'TypeScript', 'Redux Toolkit', 'Firebase', 'Modern CI/CD'],
    estimatedTimeline: 'Full-Time / Direct Contract',
    keyDeliverables: [
      'Immediate technical contributions in 2-week Agile sprints',
      'Autonomous problem-solver with strong UI/UX design sensibility',
      'Clean Git commits, strict TypeScript typing & modular architecture',
      'Transparent daily standups, async documentation & team support',
    ],
    referenceProjectTitle: '2+ Years Proven Experience at Apptunix',
    referenceProjectId: 'snibbl',
  },
];

export const INITIAL_GUESTBOOK: { id: string; author: string; role: string; message: string; timestamp: number; avatarColor: string; rating: number }[] = [
  {
    id: 'g1',
    author: 'Alexandre Rochat',
    role: 'Lead Mobile Architect',
    message: 'Insane 3D portfolio! The Bruno Simon toy car physics and smooth React Native project cards are top-tier craft. Great work Shekhar!',
    timestamp: Date.now() - 86400000 * 2,
    avatarColor: '#10b981',
    rating: 5,
  },
  {
    id: 'g2',
    author: 'Elena Rostova',
    role: 'Senior Product Designer',
    message: 'Love the Snibbl and MyBooky case studies! The interactive islands make exploring engineering achievements actually fun.',
    timestamp: Date.now() - 86400000 * 5,
    avatarColor: '#3b82f6',
    rating: 5,
  },
  {
    id: 'g3',
    author: 'Karan Sharma',
    role: 'Engineering Director',
    message: 'Clean architecture, Redux Toolkit mastery, and real-time Firebase integrations. Strong technical foundation!',
    timestamp: Date.now() - 86400000 * 9,
    avatarColor: '#f59e0b',
    rating: 5,
  },
];
