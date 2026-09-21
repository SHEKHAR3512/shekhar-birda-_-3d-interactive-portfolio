import React, { useState, useRef, useEffect } from 'react';
import {
  Rocket,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  FileDown,
  Layers,
  CheckCircle2,
  ChevronRight,
  Send,
  MessageSquare,
  Sliders,
  Heart,
  Globe2,
  Bot,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, EDUCATION, SKILL_CATEGORIES } from '../data/portfolioData';
import { Project } from '../types';
import { sound } from '../utils/sound';

interface ExecutiveViewProps {
  onSwitchTo3D: () => void;
  onSelectProject: (p: Project) => void;
  onOpenGuestbook: () => void;
  onOpenCodeInspector: () => void;
  onOpenContact?: () => void;
  onOpenGeminiChat?: () => void;
}

export const ExecutiveView: React.FC<ExecutiveViewProps> = ({
  onSwitchTo3D,
  onSelectProject,
  onOpenGuestbook,
  onOpenCodeInspector,
  onOpenContact,
  onOpenGeminiChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const containerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const categories = ['All', 'Mobile App', 'Web Platform', 'Enterprise UI'];

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    // Launch email client pre-filled
    const subject = encodeURIComponent(`Inquiry from Portfolio: ${contactForm.name}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;

    setContactSent(true);
    sound.playCoin();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.8 } });
  };

  const handleDownloadResume = () => {
    sound.playClick();
    const resumeText = `
SHEKHAR BIRDA
React Native Developer | React.js Developer (2+ Years Experience)
Email: ${PERSONAL_INFO.email}
Phone: ${PERSONAL_INFO.phone}
LinkedIn: ${PERSONAL_INFO.linkedin}
GitHub: ${PERSONAL_INFO.github}

SUMMARY:
${PERSONAL_INFO.summary}

EXPERIENCE:
React Developer — Apptunix (2024 – Present)
• Developed scalable React and React Native applications using TypeScript.
• Built reusable UI components and integrated RESTful APIs with Redux Toolkit / RTK Query.
• Integrated Firebase Authentication and Realtime Database for real-time inventory and instant bookings.

PROJECTS:
1. Snibbl — UAE's leading food-waste reduction platform, 12,000+ active users, 280+ merchant partners.
2. EDU-Match — AI-powered career-matching platform connecting professionals with personalized paths.
3. MyBooky — Booking platform for salons, barbers, and clinics across the UAE.
4. Magrudy’s Loyalty & Rewards — Unified omnichannel loyalty program for UAE readers.
5. Gulf Bar Show — Digital companion app for MENA's first bar & beverage trade show.

EDUCATION:
Diploma in Computer Engineering (GPA: 8.0/10) — Govt Polytechnic, Sirsa, Haryana (2022 – 2024)
    `.trim();

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Shekhar_Birda_Resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-[#0f172a] text-[#f1f5f9] overflow-y-auto selection:bg-[#475569] selection:text-[#f1f5f9] pb-20 overscroll-contain"
    >
      {/* Top Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#334155]/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#475569] flex items-center justify-center font-bold text-[#f1f5f9] text-sm shadow-sm font-display">
            SB
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight font-display">Shekhar Birda</h1>
            <p className="text-[11px] text-slate-400 font-mono">React & Mobile Architect</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch back to 3D Space Cosmos */}
          <button
            id="exec-switch-to-3d-btn"
            onClick={onSwitchTo3D}
            className="flex items-center gap-2 bg-[#f1f5f9] hover:bg-white text-[#0f172a] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Rocket className="w-4 h-4 text-[#0f172a]" />
            <span>3D Cosmos</span>
          </button>

          {onOpenGeminiChat && (
            <button
              id="exec-gemini-chat-btn"
              onClick={onOpenGeminiChat}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline font-mono">AI Co-Pilot</span>
            </button>
          )}

          {onOpenContact && (
            <button
              id="exec-contact-btn"
              onClick={onOpenContact}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Contact</span>
            </button>
          )}

          <button
            id="exec-guestbook-btn"
            onClick={onOpenGuestbook}
            className="p-2 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            title="Real-time Guestbook"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Guestbook</span>
          </button>

          <button
            id="exec-code-inspector-btn"
            onClick={onOpenCodeInspector}
            className="p-2 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            title="Antigravity Live Physics Tuner"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Physics Tuner</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-20">
        {/* HERO SECTION */}
        <section className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700/80 mb-4 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available for Senior Frontend & React Native Roles</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display max-w-3xl leading-[1.15]">
            Architecting Scalable <span className="text-slate-200 underline decoration-slate-600 underline-offset-8">Web & Mobile</span> Ecosystems
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed">
            {PERSONAL_INFO.summary}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              id="hero-switch-to-3d-btn"
              onClick={onSwitchTo3D}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-white text-slate-950 transition-all cursor-pointer active:scale-95 shadow-sm font-mono"
            >
              <Rocket className="w-4 h-4 text-slate-950" />
              <span>Launch 3D Cosmos</span>
            </button>

            <button
              id="hero-download-resume-btn"
              onClick={handleDownloadResume}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer active:scale-95"
            >
              <FileDown className="w-4 h-4 text-slate-300" />
              <span>Download Resume</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                contactRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer active:scale-95"
            >
              <Mail className="w-4 h-4 text-slate-300" />
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Metrics Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {PERSONAL_INFO.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl hover:border-slate-700 transition-colors"
              >
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-1 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
                <Layers className="w-4 h-4" />
                <span>Featured Engineering Works</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display mt-1">
                Latest Coding Projects
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    sound.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-mono ${
                    selectedCategory === cat
                      ? 'bg-slate-100 text-slate-950 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group relative bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
              >
                {/* Accent Top Bar */}
                <div className="h-2 w-full" style={{ backgroundColor: proj.color }} />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${proj.color}20`,
                        color: proj.accentColor,
                        border: `1px solid ${proj.color}40`,
                      }}
                    >
                      {proj.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{proj.company}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-display">
                    {proj.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">{proj.subtitle}</p>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {proj.tagline}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-4 space-y-1.5 flex-1">
                    {proj.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-800/80">
                    {proj.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/90 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.techStack.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/60 text-slate-400">
                        +{proj.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    id={`exec-inspect-${proj.id}`}
                    onClick={() => {
                      onSelectProject(proj);
                      sound.playClick();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>View Case Study</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      {proj.likes}
                    </span>
                    {proj.links?.live && proj.links.live !== '#' && (
                      <a
                        href={proj.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Open external link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE & EDUCATION SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Work Experience */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
              <Briefcase className="w-4 h-4" />
              <span>Professional Track Record</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Work Experience
            </h2>

            <div className="space-y-6">
              {EXPERIENCES.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <p className="text-sm font-semibold text-blue-400">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {exp.period}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">{exp.location} • {exp.type}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {exp.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Credentials */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Foundations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Education
            </h2>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{EDUCATION.degree}</h3>
                <p className="text-xs font-semibold text-slate-300 mt-0.5">{EDUCATION.institution}</p>
                <p className="text-xs text-slate-400">{EDUCATION.location}</p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Academic Score</span>
                <span className="text-sm font-bold font-mono text-amber-400">GPA: {EDUCATION.gpa}</span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Timeline: {EDUCATION.period}
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL SKILLS MATRIX */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>Core Competencies & Tooling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Technical Skillset
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4"
              >
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                  {cat.title}
                </h3>
                <div className="space-y-3">
                  {cat.skills.map((s, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${s.highlight ? 'text-blue-400 font-semibold' : 'text-slate-300'}`}>
                          {s.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{s.level}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            s.highlight ? 'bg-[#f1f5f9]' : 'bg-[#475569]'
                          }`}
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section ref={contactRef} id="contact" className="bg-[#0f172a] border border-[#334155] rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1e293b] text-[#f1f5f9] border border-[#475569] mb-3 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#f1f5f9]" />
                <span>Let's Build Something Together</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
                Get In Touch
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Whether you have an upcoming mobile or web project, need a full-time senior engineer, or want to discuss React / React Native architecture, feel free to drop a line.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-white transition-colors underline">
                    {PERSONAL_INFO.email}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <a href="tel:+919996231869" className="hover:text-white transition-colors">
                    {PERSONAL_INFO.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    {PERSONAL_INFO.linkedin}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <Github className="w-4 h-4" />
                  </div>
                  <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    {PERSONAL_INFO.github}
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-6 rounded-3xl">
              {contactSent ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Thank you for reaching out! Shekhar will get back to you shortly at {contactForm.email}.
                  </p>
                  <button
                    onClick={() => {
                      setContactSent(false);
                      setContactForm({ name: '', email: '', message: '' });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-[#090d16] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#475569] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-[#090d16] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#475569] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Message / Inquiry</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Hi Shekhar, let's talk about our mobile app project..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-[#090d16] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#475569] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-btn"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#f1f5f9] hover:bg-white text-[#0f172a] transition-all cursor-pointer active:scale-95 shadow-sm font-mono"
                  >
                    <Send className="w-4 h-4 text-[#0f172a]" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
