# 🚀 Shekhar Birda | 3D Interactive Portfolio & Executive Cosmos

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)

<p align="center">
  A futuristic, high-performance 3D WebGL cosmos and executive portfolio showcasing the engineering work, architecture, and experience of <b>Shekhar Birda</b> — Senior React Native & React.js Architect.
</p>

[Explore 3D Cosmos](#-features) • [Executive Resume](#-executive-resume-mode) • [AI Copilot](#-gemini-ai-copilot) • [Local Setup](#-quick-start) • [Deploy on Vercel](#-deployment)

</div>

---

## 🌌 Overview

Step inside an interactive 3D universe where projects, technical skills, and milestones are represented as planetary bodies, celestial rings, and orbiting moons. Pilot a starfighter with realistic physics, consult with an integrated AI Engineering Copilot powered by Google Gemini, or switch to an ultra-clean 2D Executive Resume view optimized for recruiters and hiring managers.

---

## ✨ Features

### 🎮 3D WebGL Space Flight Simulation
- **Fluid Flight Mechanics**: Starfighter navigation with dynamic camera tracking, banking turns, acceleration, jump drives, and particle stardust trails powered by **Three.js** and **GSAP**.
- **Interactive Celestial Entities**: Orbiting project planets, skill satellites, and asteroid belts that trigger immersive modals with deep technical breakdowns and live demos.
- **Flight Telemetry HUD**: Real-time cockpit displays showing current velocity, coordinates, target locking, autopilot navigation, and flight controls.

### 🤖 Gemini 2.5 Flash AI Copilot
- **Intelligent Architectural Assistant**: Powered by `@google/genai` (Gemini 2.5 Flash).
- **Grounded Offline Fallback**: Works seamlessly online and offline with pre-compiled technical knowledge about Shekhar's projects, architecture decisions, and skill proficiencies.
- **Security & Reliability**: Serverless proxy with strict prompt-injection guardrails and in-memory rate limiting.

### 💼 Executive Resume Mode
- **Recruiter-Focused 2D Experience**: One-click toggle from the 3D space sim to an elegant, high-contrast resume view.
- **Key Metrics & Project Case Studies**: Direct access to production impact metrics, enterprise client work, tech stacks, and career milestones.
- **Instant vCard & Contact Integration**: Download Shekhar's vCard or reach out directly via WhatsApp, Phone, and Email.

### ⚙️ Antigravity Live Physics Tuner
- **Real-Time Physics Customization**: On-the-fly tuning of top velocity, acceleration thrust, turn sensitivity, and hyperjump force.

### 💬 Firebase Realtime Guestbook & Analytics
- **Live Peer Endorsements**: Leave persistent recommendations and messages connected to Google Firebase (`shekhar-jaat-portfolio`).
- **Telemetry & Visitor Analytics**: Integrated Firebase Analytics tracking for engagement insights.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **3D Engine & Motion** | [Three.js](https://threejs.org/), [GSAP](https://greensock.com/gsap/) |
| **AI / Machine Learning**| [Google Gemini 2.5 Flash](https://ai.google.dev/) via `@google/genai` |
| **Database & Cloud** | [Google Firebase](https://firebase.google.com/) (Firestore & Analytics) |
| **Server & Hosting** | Express 4, [Vercel](https://vercel.com/) (Serverless Edge Functions) |

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `bun`

### 1. Clone & Install
```bash
git clone https://github.com/SHEKHAR3512/shekhar-birda-_-3d-interactive-portfolio.git
cd shekhar-birda-_-3d-interactive-portfolio
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# Google Gemini API Key (for AI Copilot)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=shekhar-jaat-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shekhar-jaat-portfolio
VITE_FIREBASE_STORAGE_BUCKET=shekhar-jaat-portfolio.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=28064232504
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-V9FY552BQB
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Set the Environment Variables:
   - `GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
4. Click **Deploy**. Vercel will automatically build the static bundle using Vite and deploy serverless functions from `/api`.

### Self-Hosted Production Build (Node.js / Docker)
```bash
# Build Vite client + bundled Node server
npm run build:server

# Run standalone server
npm run start
```

---

## 📬 Contact & Connect

**Shekhar Birda**  
*Senior React Native & React.js Architect*

- 💼 **LinkedIn**: [linkedin.com/in/shekhar-birda-279763353](https://www.linkedin.com/in/shekhar-birda-279763353/)
- 🐙 **GitHub**: [@SHEKHAR3512](https://github.com/SHEKHAR3512)
- 📱 **Phone / WhatsApp**: [+91 9996231869](tel:+919996231869)
- 📧 **Email**: [shekharbirda@gmail.com](mailto:shekharbirda@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ by Shekhar Birda • Inspired by deep space exploration and cutting-edge web engineering.</sub>
</div>
