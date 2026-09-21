# Project Guidelines & Agent Context: Shekhar Birda - 3D Interactive Portfolio

## 1. Project Overview
A futuristic, space-themed 3D WebGL cosmos portfolio and executive resume built for **Shekhar Birda** (Senior React Native & React.js Architect).

The application features:
- **3D WebGL Flight Sim**: Starfighter flight in an interactive 3D universe with planets, moons, asteroid belts, and particle stardust (powered by Three.js & GSAP).
- **AI Engineering Copilot**: AI assistant powered by Google Gemini 2.5 Flash (`@google/genai`) with offline portfolio knowledge fallback, rate limiting, and prompt injection guards.
- **Executive Resume Mode**: Responsive 2D executive portfolio for recruiters and hiring managers with smooth scroll and project metrics.
- **Antigravity Live Physics Tuner**: Interactive HUD panel to tune starfighter velocity, acceleration, turn sensitivity, and jump force in real time.
- **Firebase Realtime Guestbook & Analytics**: Firebase-backed endorsements and analytics tracking (`shekhar-jaat-portfolio`).
- **Dual Deployment Architecture**: Express + Vite for local development and Vercel Serverless Functions (`api/chat.ts`, `api/health.ts`) for zero-cold-start cloud deployment.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React, Canvas Confetti
- **3D Graphics & Animation**: Three.js, GSAP
- **Backend / Serverless**:
  - Local: Express 4 with `tsx`
  - Cloud: Vercel Serverless Functions (`/api/*`)
- **AI / LLM**: Google Gemini 2.5 Flash via `@google/genai`
- **Database & Services**: Google Firebase (Firestore, Analytics)

---

## 3. Directory Structure

```
shekhar-birda-_-3d-interactive-portfolio/
├── api/                     # Vercel serverless function handlers
│   ├── chat.ts              # Gemini AI chat endpoint with rate-limiting & fallback
│   └── health.ts            # Health check endpoint
├── public/                  # Static assets & icons
│   ├── favicon.png          # Goku favicon
│   └── goku.png             # Avatar asset
├── src/
│   ├── components/          # UI Modals, HUD, Navigation, & Views
│   │   ├── AICopilotModal.tsx
│   │   ├── CodeInspectorModal.tsx  # Antigravity Live Physics Tuner
│   │   ├── ContactModal.tsx        # Direct contact & vCard export
│   │   ├── ExecutiveView.tsx       # 2D Executive Resume Mode
│   │   ├── GuestbookModal.tsx      # Realtime Firebase endorsements
│   │   ├── HUD.tsx                 # Starfighter HUD controls & telemetry
│   │   ├── ProjectModal.tsx        # Detailed project showcase modal
│   │   └── SkillModal.tsx          # Tech stack & skill inspector
│   ├── data/
│   │   └── portfolioData.ts # Central source of truth for experience, skills & projects
│   ├── space/               # Three.js 3D cosmos components
│   │   ├── AsteroidBelt.ts
│   │   ├── Planet.ts
│   │   ├── SolarSystem.ts
│   │   ├── Spaceship.ts
│   │   └── Stardust.ts
│   ├── App.tsx              # Root application router (3D Cosmos vs. Executive Mode)
│   ├── index.css            # Tailwind CSS root styles
│   ├── main.tsx             # React DOM entry point
│   └── vite-env.d.ts        # Ambient type declarations (including lucide-react)
├── .env                     # Environment variables (Gemini & Firebase config)
├── .env.example             # Example environment template
├── index.html               # HTML entry point with metadata & favicon
├── package.json             # NPM dependencies & scripts
├── server.ts                # Express + Vite local dev & production server
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel routing & serverless configuration
└── vite.config.ts           # Vite configuration with Tailwind CSS v4
```

---

## 4. Key Commands

```bash
# Install dependencies
npm install

# Start development server (Express + Vite on http://localhost:3000)
npm run dev

# Run TypeScript typecheck (linting)
npm run lint

# Build client production bundle (Vite)
npm run build

# Build client + standalone Node.js server (dist/server.cjs)
npm run build:server

# Start standalone production server
npm run start
```

---

## 5. Critical Architecture & Development Conventions

1. **Root Viewport & Scroll Behavior**:
   - The root container (`#root` / `App.tsx`) uses `h-screen overflow-hidden` to lock the viewport for the Three.js canvas.
   - Any scrollable overlay or alternate view (e.g. `ExecutiveView.tsx`) **must** be styled with `h-full w-full overflow-y-auto` rather than `min-h-screen`, and scroll programmatically via element refs (`scrollIntoView()`) rather than anchor hash jumps (`#hash`).
2. **Dual-Environment API Handlers**:
   - When modifying API logic (such as Gemini prompts or rate limiting), keep both [api/chat.ts](file:///d:/projects/Portfolio-React/shekhar-birda-_-3d-interactive-portfolio/api/chat.ts) (for Vercel) and [server.ts](file:///d:/projects/Portfolio-React/shekhar-birda-_-3d-interactive-portfolio/server.ts) (for local Express) in sync.
3. **Windows Native Bindings**:
   - Native modules like `@rolldown/binding-win32-x64-msvc`, `lightningcss-win32-x64-msvc`, `@tailwindcss/oxide-win32-x64-msvc`, and `@typescript/typescript-win32-x64` are in `optionalDependencies` to ensure reliable builds on Windows without Linux cross-compilation errors.
4. **Firebase Configuration**:
   - Connected to project `shekhar-jaat-portfolio`. Ensure client keys are managed through `VITE_FIREBASE_*` environment variables.
5. **Contact & Social Information**:
   - **LinkedIn**: `https://www.linkedin.com/in/shekhar-birda-279763353/`
   - **GitHub**: `https://github.com/SHEKHAR3512`
   - **Phone / WhatsApp**: `+91 9996231869`
   - **Email**: `shekharbirda@gmail.com`
