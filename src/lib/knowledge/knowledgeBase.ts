import { KnowledgeDoc } from '../support/types';

export const PORTFOLIO_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'bio-shekhar-birda',
    title: 'About Shekhar Birda — Senior React Native & React.js Developer',
    category: 'profile',
    slug: 'about-shekhar-birda',
    summary: 'Executive overview, engineering background, primary specialization, and career achievements.',
    tags: ['bio', 'shekhar', 'experience', 'profile', 'react native', 'developer', 'frontend'],
    lastUpdated: '2025-01-15',
    content: `### Executive Profile: Shekhar Birda
- **Role:** Senior React Native & React.js Frontend Architect
- **Experience:** 2+ Years of continuous high-impact production engineering
- **Current / Recent Engagement:** Software Engineer at Apptunix (Nov 2023 – Present)
- **Primary Specialization:** Cross-platform mobile development (iOS & Android via React Native), high-performance web applications (React.js, Next.js, Vite), scalable state architectures, real-time database sync (Firebase), and 3D WebGL user interfaces (Three.js).
- **Flagship Scale:** Architected consumer-facing applications serving 12,000+ active users with 99.8% crash-free sessions (Snibbl).
- **Location:** Haryana, India (available for full-time, contract, and global remote opportunities across US, EU, UAE, and APAC timezones).
- **Education:** Bachelor of Computer Applications (BCA) from Manipal University Jaipur (CGPA: 8.0/10).`
  },
  {
    id: 'skills-mobile-react-native',
    title: 'Mobile Architecture & React Native Expertise',
    category: 'skills',
    slug: 'react-native-skills',
    summary: 'Deep dive into mobile architecture, performance profiling, native bridges, and animations.',
    tags: ['react native', 'mobile', 'ios', 'android', 'hermes', 'turbomodules', 'fabric', 'reanimated'],
    lastUpdated: '2025-01-15',
    content: `### Mobile & React Native Architecture
- **Frameworks & Engines:** React Native (0.72+ / New Architecture), Hermes JavaScript Engine optimization, TurboModules, Fabric renderer, JavaScript Interface (JSI).
- **Animations & Gestures:** React Native Reanimated 3, Gesture Handler, layout transitions, 60 FPS physics-based spring animations.
- **Performance Engineering:** Flipper profiler, React DevTools memory tracking, Hermes bytecode pre-compilation, bundle size minimization, and deep APK/IPA optimization.
- **Native Integrations:** Push notifications (Firebase Cloud Messaging / OneSignal), Deep linking (Universal Links / App Links), Camera & QR scanning, Biometric auth (FaceID / TouchID), offline-first caching via MMKV and Redux-Persist.
- **CI/CD & Deployment:** Fastlane automated build pipelines, Apple TestFlight, Google Play Internal Testing, and code signing automation.`
  },
  {
    id: 'skills-frontend-web',
    title: 'Modern Web & Frontend Engineering Stack',
    category: 'skills',
    slug: 'frontend-web-stack',
    summary: 'Web frontend capabilities including React 19, Next.js, TypeScript, Tailwind CSS, and Three.js.',
    tags: ['react', 'nextjs', 'typescript', 'tailwind', 'threejs', 'webgl', 'web'],
    lastUpdated: '2025-01-15',
    content: `### Web Frontend Engineering
- **Core Languages:** TypeScript (strict mode, advanced generics, discrimination unions), JavaScript (ESNext).
- **Libraries & Frameworks:** React 19 / 18, Next.js (App Router, Server Actions, SSR/SSG), Vite, Express.
- **Styling & Design Systems:** Tailwind CSS (v3 & v4), CSS Modules, Glassmorphism, Micro-interactions, Responsive layouts, Dark/Light theme systems.
- **State Management:** Redux Toolkit (RTK Query), Zustand, Context API, optimistic UI mutations, and normalized caching.
- **3D Graphics & Data Viz:** Three.js, GSAP timeline animations, Canvas Confetti, WebGL shaders, particle cosmos systems.`
  },
  {
    id: 'project-snibbl',
    title: 'Project Deep Dive: Snibbl (Food-Waste Reduction Platform)',
    category: 'projects',
    slug: 'project-snibbl',
    summary: 'UAE surplus food rescue mobile platform with 12,000+ active users and 99.8% crash-free rate.',
    tags: ['snibbl', 'food waste', 'apptunix', 'react native', 'firebase', 'live demo', 'case study'],
    lastUpdated: '2025-01-15',
    content: `### Project Case Study: Snibbl
- **Live URL:** https://snibbl.com/
- **Role:** Lead Mobile Engineer at Apptunix
- **Domain:** Sustainability, On-Demand Delivery & Food-Waste Mitigation (UAE)
- **Metrics & Scale:**
  - 12,000+ Active Users across Dubai and Abu Dhabi
  - 280+ Merchant Partners (Bakeries, Cafes, Grocery Stores)
  - 50,000+ Surplus Food Meals Rescued from landfills
  - 99.8% Crash-Free Session Reliability
- **Technical Architecture:**
  - Built with React Native, TypeScript, and Redux Toolkit.
  - Engineered sub-second atomic inventory locking in Firebase Realtime DB to eliminate double-claims during high-velocity evening checkout windows.
  - Integrated Apple Pay, Google Pay, and Stripe SDKs for frictionless single-tap transactions.
  - Geofenced background push notifications alerting nearby foodies when partner venues list surplus inventory.`
  },
  {
    id: 'project-edumatch',
    title: 'Project Deep Dive: EDU-Match (AI Academic & University Portal)',
    category: 'projects',
    slug: 'project-edumatch',
    summary: 'AI-driven university admissions and career matching platform with 100+ partner universities.',
    tags: ['edu-match', 'edumatch', 'ai', 'education', 'react', 'firestore', 'case study'],
    lastUpdated: '2025-01-15',
    content: `### Project Case Study: EDU-Match
- **Live URL:** https://edumatchconnect.ai/
- **Role:** Full-Stack Frontend Engineer at Apptunix
- **Domain:** EdTech & AI Admissions Advisory
- **Key Metrics:**
  - 100+ Partner Educational Institutions
  - 94% Matching Precision between student profiles and degree programs
  - Sub-200ms Search and Filter Query Latency
- **Technical Architecture:**
  - React.js, TypeScript, Tailwind CSS, Firebase Auth & Cloud Firestore.
  - Multi-step dynamic profile onboarding with instant credential validation.
  - Real-time document upload pipeline with status tracking and admissions counselor feedback threads.`
  },
  {
    id: 'project-magrudy',
    title: 'Project Deep Dive: Magrudy’s Omnichannel Loyalty & Bookstore',
    category: 'projects',
    slug: 'project-magrudy',
    summary: 'Omnichannel retail loyalty program unifying 14 physical stores with e-commerce for 25,000+ members.',
    tags: ['magrudy', 'bookstore', 'retail', 'loyalty', 'ecommerce', 'case study'],
    lastUpdated: '2025-01-15',
    content: `### Project Case Study: Magrudy's Loyalty
- **Live URL:** https://www.magrudy.com/
- **Role:** Frontend Systems Engineer
- **Domain:** E-Commerce, Retail Loyalty & Omnichannel CRM (UAE)
- **Key Metrics:**
  - 25,000+ Active Loyalty Program Members across 14 Physical Stores
  - +38% Surge in Customer Repeat Purchase Rates post-launch
- **Technical Architecture:**
  - React.js, TypeScript, Redux Toolkit, Material UI, RESTful APIs.
  - Synchronized in-store digital barcode scanning with live web accounts, allowing users to earn and redeem loyalty points simultaneously online and in physical stores.`
  },
  {
    id: 'project-gulfbarshow',
    title: 'Project Deep Dive: Gulf Bar Show (DWTC Companion App)',
    category: 'projects',
    slug: 'project-gulfbarshow',
    summary: 'Official digital event companion for Dubai World Trade Centre beverage expo with 5,000+ attendees.',
    tags: ['gulf bar show', 'expo', 'dwtc', 'events', 'pwa', 'case study'],
    lastUpdated: '2025-01-15',
    content: `### Project Case Study: Gulf Bar Show
- **Live URL:** https://gulfbarshow.com/
- **Role:** Lead Frontend & PWA Developer
- **Domain:** Global Trade Exhibition & Conference Tech
- **Key Metrics:**
  - 5,000+ Registered Attendees & VIP Delegates
  - 120+ Exhibitor Booths mapped with 100% platform uptime
- **Technical Architecture:**
  - Progressive Web App (PWA) with React.js, Tailwind CSS, and offline caching.
  - Interactive multi-hall exhibition floorplan with sub-second booth search.
  - Personalized agenda scheduler with automated countdown notifications for keynote masterclasses.`
  },
  {
    id: 'experience-apptunix',
    title: 'Work Experience: Software Engineer at Apptunix',
    category: 'experience',
    slug: 'experience-apptunix',
    summary: 'Professional track record, responsibilities, and client product delivery at Apptunix.',
    tags: ['apptunix', 'experience', 'employment', 'software engineer', 'career'],
    lastUpdated: '2025-01-15',
    content: `### Professional Experience: Apptunix
- **Title:** Software Engineer (React Native & React.js)
- **Tenure:** November 2023 – Present
- **Responsibilities:**
  - Architect and deliver cross-platform mobile apps on iOS and Android for international clients (primarily in UAE, US, and UK markets).
  - Collaborate directly with Product Managers, UI/UX designers, and backend engineering teams.
  - Implement mission-critical checkout flows, real-time tracking, payment gateways, and push notification micro-services.
  - Conduct code reviews, establish TypeScript design standards, and mentor junior developers in React Native best practices.`
  },
  {
    id: 'hiring-and-availability',
    title: 'Hiring, Availability, Rates & Collaboration Terms',
    category: 'hiring',
    slug: 'hiring-and-availability',
    summary: 'Details regarding work authorization, availability, hiring models, and remote setups.',
    tags: ['hire', 'availability', 'contract', 'full-time', 'remote', 'rates', 'interview'],
    lastUpdated: '2025-01-15',
    content: `### Hiring & Engagement Details
- **Current Status:** Open to high-impact Full-Time, Contract, or Consulting opportunities.
- **Engagement Types:**
  - Full-Time Employment (Permanent Remote or Relocation considerations)
  - Contract / Freelance Product Build (Fixed Scope or Time & Material)
  - Architecture Review & Mobile Performance Auditing
- **Timezone Availability:** Flexible across all international timezones (US Eastern/Pacific, European CET, UAE GST, and IST).
- **Communication Tools:** Slack, Microsoft Teams, Discord, Zoom, Google Meet, GitHub, Jira, Linear.
- **Notice Period:** Available immediately or within standard short onboarding turnaround.`
  },
  {
    id: 'contact-channels',
    title: 'Direct Contact Channels & Social Profiles',
    category: 'profile',
    slug: 'contact-channels',
    summary: 'Official verified contact channels to connect directly with Shekhar Birda.',
    tags: ['contact', 'email', 'phone', 'whatsapp', 'linkedin', 'github'],
    lastUpdated: '2025-01-15',
    content: `### Direct Contact Information
- **Email:** shekharjaat751@gmail.com
- **Phone / WhatsApp:** +91 9996231869 (Direct WhatsApp chat supported)
- **LinkedIn:** https://www.linkedin.com/in/shekhar-birda-279763353/
- **GitHub:** https://github.com/SHEKHAR3512
- **Response Time:** Typically under 2 hours during active business hours.`
  },
  {
    id: 'faq-technical-interview',
    title: 'Technical FAQs & Engineering Philosophy',
    category: 'faq',
    slug: 'technical-faqs',
    summary: 'Common technical interview questions, architecture trade-offs, and design principles.',
    tags: ['faq', 'architecture', 'interview', 'philosophy', 'testing', 'performance'],
    lastUpdated: '2025-01-15',
    content: `### Engineering Philosophy & FAQs
- **Q: How do you prevent React Native performance bottlenecks?**
  *A: By utilizing Hermes bytecode pre-compilation, minimizing bridge serialization via TurboModules/Fabric, offloading animations to the UI thread with React Native Reanimated, and strictly memoizing expensive computation.*
- **Q: How do you handle offline mode in mobile apps?**
  *A: By combining MMKV fast disk storage with Redux Toolkit offline query mutations, queued sync dispatchers, and optimistic UI updates that reconcile once connectivity is restored.*
- **Q: What is your approach to testing and code quality?**
  *A: Strict TypeScript typing with zero 'any' escapes, comprehensive lint rules, component snapshot/unit tests, and staging on real iOS/Android devices via TestFlight and Firebase App Distribution.*`
  }
];

const STOPWORDS = new Set([
  'what', 'is', 'the', 'are', 'you', 'tell', 'about', 'me', 'how', 'your',
  'and', 'for', 'with', 'this', 'that', 'can', 'does', 'did', 'have', 'has',
  'who', 'whom', 'where', 'when', 'why', 'give', 'show', 'please'
]);

/**
 * Searches the structured knowledge base using keyword and semantic term scoring.
 */
export function queryKnowledgeDocs(query: string, limit = 4): KnowledgeDoc[] {
  if (!query || !query.trim()) {
    return PORTFOLIO_KNOWLEDGE_DOCS.slice(0, limit);
  }

  const rawTerms = query.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const meaningfulTerms = rawTerms.filter(t => !STOPWORDS.has(t));
  const terms = meaningfulTerms.length > 0 ? meaningfulTerms : rawTerms;

  const scored = PORTFOLIO_KNOWLEDGE_DOCS.map(doc => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const summaryLower = doc.summary.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsJoined = doc.tags.join(' ').toLowerCase();
    const idLower = doc.id.toLowerCase();

    for (const term of terms) {
      if (idLower.includes(term)) score += 25;
      if (titleLower.includes(term)) score += 20;
      if (tagsJoined.includes(term)) score += 15;
      if (summaryLower.includes(term)) score += 8;
      if (contentLower.includes(term)) score += 3;
    }

    return { doc, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.doc);
}

/**
 * Builds a RAG context string to be injected into LLM system prompts.
 */
export function buildRAGContext(query: string): string {
  const relevantDocs = queryKnowledgeDocs(query, 3);
  if (relevantDocs.length === 0) {
    return '';
  }

  return `\n### GROUNDED PORTFOLIO KNOWLEDGE (USE ONLY THESE VERIFIED FACTS):\n` +
    relevantDocs.map(d => `--- [DOC: ${d.title}] ---\n${d.content}`).join('\n\n');
}
