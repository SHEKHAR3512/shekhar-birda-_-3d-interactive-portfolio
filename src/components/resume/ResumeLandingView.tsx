import React from 'react';
import {
  Rocket,
  Download,
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Code2,
  Smartphone,
  Server,
  Wrench,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Compass,
  ChevronRight
} from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { MISSION_PROJECTS } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';

interface ResumeLandingViewProps {
  onOpenContact: () => void;
  onOpenDossier: (projectId: string) => void;
}

export function ResumeLandingView({ onOpenContact, onOpenDossier }: ResumeLandingViewProps) {
  const launchMission = useMissionStore((state) => state.launchMission);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const enterSolarSystem = useMissionStore((state) => state.enterSolarSystem);

  const handleLaunch = () => {
    sound.playClick();
    launchMission();
  };

  const handleFlyToProject = (projectId: string) => {
    sound.playClick();
    selectPlanet(projectId);
    enterSolarSystem();
  };

  const handleDownloadResume = () => {
    sound.playClick();
    const resumeUrl = '/Shekhar_Birda_Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Shekhar_Birda_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden select-text text-slate-100 font-sans pb-36 scroll-smooth">
      {/* Background Subtle Starfield & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#030712] transition-colors duration-400" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pt-10">
        {/* ===================== HERO SECTION ===================== */}
        <section className="pt-8 pb-16 border-b border-sky-500/15">
          {/* Mission Briefing Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-950/40 text-sky-400 font-mono text-xs tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Mission Briefing · Sol System Station</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Bio & Core Pitch */}
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100 leading-none mb-3">
                SHEKHAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300">BIRDA</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base font-mono text-sky-400 mb-4">
                <span className="font-semibold">React Native Developer</span>
                <span className="text-slate-600">✦</span>
                <span className="font-semibold">React Web Developer</span>
                <span className="text-slate-600">✦</span>
                <span className="text-slate-400 text-xs">2+ Years Experience</span>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mb-8">
                Building modern, scalable web and mobile experiences. Specializing in high-concurrency food delivery systems, real-time inventory synchronization, and fluid 60 FPS interfaces across iOS, Android, and Web.
              </p>

              {/* CTAs: Primary [ EXPLORE MY SOLAR SYSTEM ] + [ DOWNLOAD RESUME ] */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Main Interactive Experience Launch CTA */}
                <button
                  onClick={handleLaunch}
                  className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border border-sky-400/60 bg-gradient-to-r from-sky-500/25 to-indigo-500/25 hover:from-sky-500/40 hover:to-indigo-500/40 text-sky-200 hover:text-white font-mono text-sm tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] cursor-pointer"
                >
                  <Rocket className="w-5 h-5 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="font-bold">EXPLORE MY SOLAR SYSTEM</span>
                  <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Direct Download Resume */}
                <button
                  onClick={handleDownloadResume}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>DOWNLOAD RESUME</span>
                </button>

                {/* Direct Contact Button */}
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-mono text-xs tracking-wider transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>CONTACT ME</span>
                </button>
              </div>
            </div>

            {/* Right Column: Key Metrics & Pilot Badge */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl hud-panel border border-sky-500/25 relative overflow-hidden">
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-sky-500/15">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-sky-400/60 overflow-hidden bg-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                      <img
                        src="/goku.png"
                        alt="Shekhar Birda"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-100">Shekhar Birda</h3>
                    <p className="text-xs font-mono text-sky-400">Senior Mobile & Web Architect</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-mono">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>Haryana / Remote, India</span>
                    </div>
                  </div>
                </div>

                {/* Metric Counters */}
                <div className="grid grid-cols-2 gap-3">
                  {PERSONAL_INFO.stats.map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-slate-900/60 border border-sky-500/15">
                      <div className="text-xl font-bold font-display text-sky-300">{stat.value}</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== WORK EXPERIENCE ===================== */}
        <section className="py-14 border-b border-sky-500/15" id="experience">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase font-semibold mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Career Flight Log</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
                Work Experience
              </h2>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-slate-400">
              Apptunix · 2023 - Present
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl hud-panel border border-sky-500/25">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-sky-500/15">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-100">
                  React Native Developer & React.js Developer
                </h3>
                <p className="text-sm font-mono text-sky-400">
                  Apptunix · Full-time · Mobile & Web Engineering Division
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 w-fit">
                2+ Years Experience
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
              Spearheaded frontend and mobile client architecture across consumer-facing food surplus reduction, on-demand healthcare booking, AI educational guidance, and retail loyalty platforms. Collaborated cross-functionally with backend and UI/UX teams to deliver responsive, test-covered applications serving tens of thousands of active users.
            </p>

            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Key Engineering Achievements:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                'Engineered core consumer-facing flows for Snibbl Food serving 12,000+ active users with 99.8% crash-free sessions.',
                'Integrated Firebase Realtime DB & Firestore for sub-second inventory synchronization and instant stock-locking.',
                'Built AI-powered career matching algorithms and responsive dashboard portals for EDU-Match AI with Google Gemini.',
                'Architected frictionless clinic and salon booking flows on MyBooky, reducing booking abandonment by 45%.',
                'Developed unified retail barcode scanning and digital Apple Wallet passes for Magrudy’s loyalty ecosystem.',
                'Standardized modular React Native component architecture, cutting cross-platform development turnaround by 35%.'
              ].map((achievement, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{achievement}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-sky-500/15">
              {['React Native', 'React.js', 'Next.js', 'TypeScript', 'Redux Toolkit', 'Firebase', 'REST APIs', 'Fastlane', 'Tailwind CSS'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded text-xs font-mono bg-sky-950/40 border border-sky-500/30 text-sky-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== SKILLS MATRIX ===================== */}
        <section className="py-14 border-b border-sky-500/15" id="skills">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase font-semibold mb-1">
              <Code2 className="w-4 h-4" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
              Skills & Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mobile Architecture */}
            <div className="p-5 rounded-2xl hud-panel border border-sky-500/25">
              <div className="flex items-center gap-2 mb-3 text-sky-400">
                <Smartphone className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                  Mobile Architecture
                </h3>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li>✦ React Native CLI & Expo</li>
                <li>✦ Redux Toolkit & RTK Query</li>
                <li>✦ Offline-First Local Sync</li>
                <li>✦ Push Notifications (FCM)</li>
                <li>✦ Native Bridge & Gestures</li>
                <li>✦ iOS & Android Parity</li>
              </ul>
            </div>

            {/* Web & Modern Frontend */}
            <div className="p-5 rounded-2xl hud-panel border border-sky-500/25">
              <div className="flex items-center gap-2 mb-3 text-sky-400">
                <Code2 className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                  Web & Frontend
                </h3>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li>✦ React 19 & Next.js</li>
                <li>✦ TypeScript Strict Typing</li>
                <li>✦ Tailwind CSS v4 & Motion</li>
                <li>✦ Three.js & WebGL 60 FPS</li>
                <li>✦ Micro-Interactions Lab</li>
                <li>✦ Performance & CWV Profiling</li>
              </ul>
            </div>

            {/* Cloud & Realtime Backend */}
            <div className="p-5 rounded-2xl hud-panel border border-sky-500/25">
              <div className="flex items-center gap-2 mb-3 text-sky-400">
                <Server className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                  Cloud & Realtime
                </h3>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li>✦ Firebase Realtime DB</li>
                <li>✦ Cloud Firestore & Security</li>
                <li>✦ RESTful APIs & WebSockets</li>
                <li>✦ Google Gemini AI SDK</li>
                <li>✦ Stripe Payments & Wallets</li>
                <li>✦ Optimistic State Updates</li>
              </ul>
            </div>

            {/* Tooling & DevOps */}
            <div className="p-5 rounded-2xl hud-panel border border-sky-500/25">
              <div className="flex items-center gap-2 mb-3 text-sky-400">
                <Wrench className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                  Tooling & Workflow
                </h3>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li>✦ Fastlane CI/CD Automated</li>
                <li>✦ Git, GitHub & Code Reviews</li>
                <li>✦ Vite & Rolldown Bundling</li>
                <li>✦ Chrome DevTools & Profiler</li>
                <li>✦ Postman & API Contracts</li>
                <li>✦ Jest & React Testing Lib</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===================== FEATURED PROJECTS ===================== */}
        <section className="py-14 border-b border-sky-500/15" id="projects">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase font-semibold mb-1">
                <Compass className="w-4 h-4" />
                <span>Featured Planetary Systems</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
                Projects Directory
              </h2>
            </div>
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 hover:text-sky-300 tracking-wider transition-colors cursor-pointer"
            >
              <span>Explore full 3D universe</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MISSION_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl hud-panel border border-sky-500/25 hover:border-sky-400/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: project.accentColor }}
                      />
                      {project.planet} System
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900/60 text-slate-300">
                      {project.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-100 group-hover:text-sky-300 transition-colors mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mb-3">{project.role}</p>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/70 border border-slate-800 text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions: View Dossier + Fly to Planet */}
                <div className="flex items-center gap-2 pt-4 border-t border-sky-500/15">
                  <button
                    onClick={() => onOpenDossier(project.id)}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono text-xs text-center tracking-wider transition-all cursor-pointer"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => handleFlyToProject(project.id)}
                    className="flex-1 py-2 px-3 rounded-lg border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 font-mono text-xs text-center tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  >
                    <Rocket className="w-3.5 h-3.5 text-sky-400" />
                    <span>Fly to Planet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== EDUCATION ===================== */}
        <section className="py-14 border-b border-sky-500/15" id="education">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase font-semibold mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Credentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
              Education
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl hud-panel border border-sky-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-100">
                Bachelor of Technology in Computer Science & Engineering
              </h3>
              <p className="text-sm font-mono text-sky-400 mt-0.5">
                Ch. Devi Lal State Institute of Engineering & Technology, Panniwala Mota
              </p>
              <p className="text-xs text-slate-400 font-sans mt-2">
                Coursework: Data Structures, Algorithms, Distributed Systems, Software Engineering, Database Management Systems.
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-sky-500/40 bg-sky-950/40 text-sky-300 font-bold block w-fit sm:ml-auto">
                CGPA: 8.0 / 10
              </span>
              <span className="text-xs font-mono text-slate-500 block mt-1">2020 - 2024</span>
            </div>
          </div>
        </section>

        {/* ===================== CONTACT & FOOTER ===================== */}
        <section className="py-14" id="contact">
          <div className="p-8 sm:p-12 rounded-3xl hud-panel border border-sky-500/35 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-950/40 text-sky-400 font-mono text-xs tracking-widest uppercase mb-4">
                <span>Mission Communication</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-100 mb-3">
                Let&apos;s Build Something Extraordinary Together
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-8">
                Available for full-time Senior React Native & React.js roles, high-impact contract architecture, and mobile engineering consultation.
              </p>

              {/* Direct Communication Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="p-3.5 rounded-xl border border-sky-500/20 bg-slate-900/60 hover:bg-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>

                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="p-3.5 rounded-xl border border-sky-500/20 bg-slate-900/60 hover:bg-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>{PERSONAL_INFO.phone}</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-sky-500/20 bg-slate-900/60 hover:bg-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-sky-400" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-500" />
                </a>

                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-sky-500/20 bg-slate-900/60 hover:bg-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 text-sky-400" />
                  <span>GitHub Repositories</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-500" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenContact}
                  className="px-6 py-3 rounded-xl border border-sky-400/50 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 hover:text-white font-mono text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                >
                  Send Direct Transmission
                </button>

                <button
                  onClick={handleLaunch}
                  className="px-6 py-3 rounded-xl border border-sky-500/40 bg-gradient-to-r from-sky-500/25 to-indigo-500/25 hover:from-sky-500/35 hover:to-indigo-500/35 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Launch 3D Solar System</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
