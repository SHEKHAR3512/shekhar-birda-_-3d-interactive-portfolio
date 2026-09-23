import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { ResumeLandingView } from './components/resume/ResumeLandingView';
import { MissionBootSequence } from './components/mission/MissionBootSequence';
import { SpaceExperience } from './components/space/SpaceExperience';
import { CockpitOverlay } from './components/hud/CockpitOverlay';
import { MissionTelemetry } from './components/hud/MissionTelemetry';
import { PilotCard } from './components/hud/PilotCard';
import { PlanetTooltip } from './components/hud/PlanetTooltip';
import { FlightControlsOverlay } from './components/hud/FlightControlsOverlay';
import { NavigationGuideOverlay } from './components/hud/NavigationGuideOverlay';
import { ProjectDossier } from './components/hologram/ProjectDossier';
import { OnbordaTour } from './components/onborda/OnbordaTour';
import { ProjectDatabaseModal } from './components/mission/ProjectDatabaseModal';
import { MissionMapView } from './components/mission/MissionMapView';
import { MissionCompleteView } from './components/mission/MissionCompleteView';
import { ContactModal } from './components/ContactModal';
import { GeminiChatModal } from './components/GeminiChatModal';
import { GuestbookModal } from './components/GuestbookModal';
import { ViewModeSelector } from './components/hud/ViewModeSelector';
import { SupportWidget } from './components/support/SupportWidget';
import { CustomerSupportPortal } from './components/support/CustomerSupportPortal';
import { SupportDashboard } from './components/support/SupportDashboard';
import { Database, Bot, MessageSquare } from 'lucide-react';

import { useMissionStore } from './store/missionStore';
import { MISSION_PROJECTS } from './data/projects';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';

export default function App() {
  // Client-side routing for dedicated /support and /support/admin routes
  const [currentRoute, setCurrentRoute] = useState<'portfolio' | 'support' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/support/admin')) return 'admin';
      if (window.location.pathname.startsWith('/support')) return 'support';
    }
    return 'portfolio';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/support/admin')) {
        setCurrentRoute('admin');
      } else if (path.startsWith('/support')) {
        setCurrentRoute('support');
      } else {
        setCurrentRoute('portfolio');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'portfolio' | 'support' | 'admin') => {
    const path = route === 'admin' ? '/support/admin' : route === 'support' ? '/support' : '/';
    window.history.pushState({}, '', path);
    setCurrentRoute(route);
  };

  const theme = useMissionStore((state) => state.theme);
  const toggleTheme = useMissionStore((state) => state.toggleTheme);
  const currentExperience = useMissionStore((state) => state.currentExperience);
  const missionStatus = useMissionStore((state) => state.missionStatus);
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const returnToResume = useMissionStore((state) => state.returnToResume);
  const enterSolarSystem = useMissionStore((state) => state.enterSolarSystem);
  const discoveredPlanets = useMissionStore((state) => state.discoveredPlanets);
  const cameraMode = useMissionStore((state) => state.cameraMode);
  const setCameraMode = useMissionStore((state) => state.setCameraMode);

  // Modals & Overlays
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);
  const [contactBody, setContactBody] = useState<string | undefined>(undefined);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [theme]);

  // Audio gesture initialization
  const startAudioOnGesture = useCallback(() => {
    sound.startEngine();
    window.removeEventListener('keydown', startAudioOnGesture);
    window.removeEventListener('pointerdown', startAudioOnGesture);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', startAudioOnGesture);
    window.addEventListener('pointerdown', startAudioOnGesture);
    return () => {
      window.removeEventListener('keydown', startAudioOnGesture);
      window.removeEventListener('pointerdown', startAudioOnGesture);
    };
  }, [startAudioOnGesture]);

  // Trigger confetti when all planets are discovered
  useEffect(() => {
    if (discoveredPlanets.length === 8 && missionStatus === 'completed') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#00f5ff', '#818cf8', '#ffffff']
      });
      setShowMissionComplete(true);
    }
  }, [discoveredPlanets.length, missionStatus]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();

      // Camera view modes in solar system mode (Keys 1-5, o, k, i, m)
      if (currentExperience === 'solar-system') {
        if (k === '1') {
          setCameraMode('flight');
          sound.playClick();
          return;
        } else if (k === '2' || k === 'o') {
          setCameraMode('orbit');
          sound.playClick();
          return;
        } else if (k === '3' || k === 'k') {
          setCameraMode('cinematic');
          sound.playClick();
          return;
        } else if (k === '4' || k === 'i') {
          setCameraMode('isometric');
          sound.playClick();
          return;
        } else if (k === '5' || k === 'm') {
          setCameraMode('chart');
          sound.playClick();
          return;
        } else if (['6', '7', '8'].includes(k)) {
          const index = parseInt(k, 10) - 1;
          const project = MISSION_PROJECTS[index];
          if (project) {
            selectPlanet(project.id);
            sound.playClick();
            return;
          }
        }
      }

      if (e.key === 'Escape') {
        selectPlanet(null);
        setShowProjectsModal(false);
        setShowMissionComplete(false);
        setShowContact(false);
        setShowGeminiChat(false);
        setShowGuestbook(false);
      } else if (k === 'c') {
        setContactSubject(undefined);
        setContactBody(undefined);
        setShowContact(true);
        sound.playClick();
      } else if (k === 'p') {
        setShowProjectsModal((prev) => !prev);
        sound.playClick();
        /* Chatbot hotkey commented out for now:
      } else if (k === 'g') {
        setShowGeminiChat((prev) => !prev);
        sound.playClick();
        */
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentExperience, selectPlanet, toggleTheme]);

  if (currentRoute === 'support') {
    return (
      <CustomerSupportPortal
        onReturnToPortfolio={() => navigateTo('portfolio')}
        onOpenAdmin={() => navigateTo('admin')}
      />
    );
  }

  if (currentRoute === 'admin') {
    return (
      <SupportDashboard
        onReturnToPortfolio={() => navigateTo('portfolio')}
        onOpenPortal={() => navigateTo('support')}
      />
    );
  }

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none transition-colors duration-400 flex flex-col ${
        theme === 'light' ? 'bg-[#f4f1e8] text-[#0f172a]' : 'bg-[#030712] text-[#f8fafc]'
      }`}
    >
      {/* Spacecraft Navigation Header */}
      <Navbar
        onOpenResume={() => returnToResume()}
        onOpenContact={() => {
          setContactSubject(undefined);
          setContactBody(undefined);
          setShowContact(true);
        }}
        onOpenProjectsMap={() => setShowProjectsModal(true)}
        onOpenSupport={() => navigateTo('support')}
      />

      {/* Main View Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* ================= EXPERIENCE 1: RESUME LANDING PAGE (FIRST SCREEN) ================= */}
        {currentExperience === 'resume' && (
          <ResumeLandingView
            onOpenContact={() => {
              setContactSubject(undefined);
              setContactBody(undefined);
              setShowContact(true);
            }}
            onOpenDossier={(projectId) => {
              selectPlanet(projectId);
              enterSolarSystem();
            }}
          />
        )}

        {/* ================= MISSION BOOT SEQUENCE (2-3s TRANSITION) ================= */}
        {currentExperience === 'mission-boot' && (
          <MissionBootSequence />
        )}

        {/* ================= EXPERIENCE 2: CONTROLLABLE SPACECRAFT SOLAR SYSTEM ================= */}
        {currentExperience === 'solar-system' && (
          <>
            {/* 3D WebGL Flight Canvas (Powered by Babylon.js) */}
            <SpaceExperience />

            {/* Spaceship Cockpit Overlay & Coordinates Telemetry */}
            <CockpitOverlay />

            {/* Tactical Camera View Mode Selector (Flight, Orbit, Cinematic, Isometric, Chart) */}
            <ViewModeSelector />

            {/* Top-Right Mission Telemetry (Status, Discovered count, XP) */}
            <MissionTelemetry />

            {/* Pilot Profile Card */}
            <PilotCard />

            {/* Navigation Guide, Target Selector & Auto Pilot Toggle */}
            <NavigationGuideOverlay onOpenProjects={() => setShowProjectsModal(true)} />

            {/* Desktop & Mobile Virtual Flight Controls */}
            <FlightControlsOverlay />

            {/* Floating Planet Hover Tooltips */}
            <PlanetTooltip />

            {/* Holographic Project Dossier & Pilot Guide (when in orbit) */}
            <ProjectDossier />

            {/* Onborda 6-Step Product Tour */}
            <OnbordaTour />

            {/* Bottom Floating Utility Buttons (Cleanly positioned above the flight controls bar; hidden in Chart mode to prevent waypoint overlap) */}
            {!currentPlanet && cameraMode !== 'chart' && (
              <div className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 animate-fadeIn pointer-events-auto">
                <button
                  onClick={() => setShowProjectsModal(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-sky-400/40 bg-[#07111f]/90 hover:bg-sky-500/25 text-sky-200 hover:text-white font-mono text-[11px] tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:border-sky-300 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-sky-400" />
                  <span>Projects [P]</span>
                </button>

                {/* AI Copilot Chatbot Button (Commented out for now)
                <button
                  onClick={() => setShowGeminiChat(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-sky-400/40 bg-[#07111f]/90 hover:bg-sky-500/25 text-sky-200 hover:text-white font-mono text-[11px] tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:border-sky-300 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-sky-400" />
                  <span>AI Copilot [G]</span>
                </button>
                */}

                <button
                  onClick={() => setShowGuestbook(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-700/70 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-[11px] tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Guestbook</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Accessible 2D Project Database Directory Modal */}
      {showProjectsModal && (
        <ProjectDatabaseModal
          onClose={() => setShowProjectsModal(false)}
          onOpenDossier={(id) => {
            selectPlanet(id);
            enterSolarSystem();
          }}
        />
      )}

      {/* Mission Complete Celebration Screen */}
      {showMissionComplete && (
        <MissionCompleteView
          onClose={() => setShowMissionComplete(false)}
          onOpenResume={() => returnToResume()}
          onOpenContact={() => {
            setContactSubject('Mission Complete Inquiry');
            setContactBody("Hi Shekhar,\n\nI just explored your complete space solar system portfolio and would love to connect regarding upcoming engineering opportunities.\n\nBest regards,\n");
            setShowContact(true);
          }}
        />
      )}

      {/* Direct Contact Modal */}
      {showContact && (
        <ContactModal
          initialSubject={contactSubject}
          initialBody={contactBody}
          onClose={() => setShowContact(false)}
        />
      )}

      {/* Gemini AI Multi-Turn Co-Pilot Modal (Commented out for now)
      {showGeminiChat && (
        <GeminiChatModal
          onClose={() => setShowGeminiChat(false)}
          onOpenContact={() => {
            setShowGeminiChat(false);
            setContactSubject('Consultation via Gemini AI Co-Pilot');
            setContactBody('Hi Shekhar,\n\nI was chatting with your Gemini AI Co-Pilot on your space portfolio and would love to connect directly.\n\nBest regards,\n');
            setShowContact(true);
          }}
        />
      )}
      */}

      {/* Real-time Firebase Guestbook Modal */}
      {showGuestbook && (
        <GuestbookModal onClose={() => setShowGuestbook(false)} />
      )}

      {/* Floating Ambient AI Customer Support Center Widget (Commented out for now)
      <SupportWidget onNavigateToPortal={() => navigateTo('support')} />
      */}
    </div>
  );
}
