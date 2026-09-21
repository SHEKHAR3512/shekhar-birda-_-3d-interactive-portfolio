import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { HUD } from './components/HUD';
import { ProjectModal } from './components/ProjectModal';
import { SkillPlanetModal } from './components/SkillPlanetModal';
import { SuggestionsModal } from './components/SuggestionsModal';
import { ExecutiveView } from './components/ExecutiveView';
import { GuestbookModal } from './components/GuestbookModal';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import { ContactModal } from './components/ContactModal';
import { GeminiChatModal } from './components/GeminiChatModal';
import { PROJECTS, COLLECTIBLE_ITEMS, SKILL_PLANETS } from './data/portfolioData';
import { Project, CollectibleItem, ViewMode, CameraView, SkillPlanet } from './types';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [skillPlanets] = useState<SkillPlanet[]>(SKILL_PLANETS);
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(COLLECTIBLE_ITEMS);

  // Active Modals & Celestial Targets
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeSkillPlanet, setActiveSkillPlanet] = useState<SkillPlanet | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);
  const [contactBody, setContactBody] = useState<string | undefined>(undefined);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [showCodeInspector, setShowCodeInspector] = useState(false);
  const [showGeminiChat, setShowGeminiChat] = useState(false);

  // Spaceflight & Camera State
  const [cameraView, setCameraView] = useState<CameraView>('follow');
  const [isNightMode, setIsNightMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [carPosition, setCarPosition] = useState<[number, number]>([0, 16]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [warpTarget, setWarpTarget] = useState<{ x: number; y: number; z: number } | null>(null);

  // Live tunable physics
  const [physicsSettings, setPhysicsSettings] = useState({
    maxSpeed: 16.0,
    acceleration: 20.0,
    turnSpeed: 2.4,
    jumpForce: 1.0,
  });

  // Zero-latency frame loop input ref
  const carInputRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    turbo: false,
    brake: false,
  });

  // Start sound on first user gesture
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  // Warp to a project planet
  const handleSelectProject = (p: Project | null) => {
    setActiveProject(p);
    if (p) {
      setWarpTarget({ x: p.worldPosition[0], y: p.worldPosition[1], z: p.worldPosition[2] });
    }
  };

  // Warp to a skill planet
  const handleSelectSkillPlanet = (sp: SkillPlanet | null) => {
    setActiveSkillPlanet(sp);
    if (sp) {
      setWarpTarget({ x: sp.worldPosition[0], y: sp.worldPosition[1], z: sp.worldPosition[2] });
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const k = e.key.toLowerCase();

      // Warp directly to projects with 1-5 keys
      if (['1', '2', '3', '4', '5'].includes(k)) {
        const index = parseInt(k, 10) - 1;
        if (projects[index]) {
          handleSelectProject(projects[index]);
          sound.playClick();
          return;
        }
      }

      if (k === 'w' || e.key === 'ArrowUp') {
        carInputRef.current.forward = true;
      } else if (k === 's' || e.key === 'ArrowDown') {
        carInputRef.current.backward = true;
      } else if (k === 'a' || e.key === 'ArrowLeft') {
        carInputRef.current.left = true;
      } else if (k === 'd' || e.key === 'ArrowRight') {
        carInputRef.current.right = true;
      } else if (e.code === 'Space') {
        carInputRef.current.turbo = true;
        e.preventDefault();
      } else if (k === 'c') {
        setContactSubject(undefined);
        setContactBody(undefined);
        setShowContact(true);
        sound.playClick();
      } else if (k === 'g') {
        setShowGeminiChat((prev) => !prev);
        sound.playClick();
      } else if (k === 'u') {
        setShowSuggestions((prev) => !prev);
        sound.playClick();
      } else if (k === 'v') {
        setViewMode((prev) => (prev === '3d' ? 'executive' : '3d'));
        sound.playClick();
      } else if (k === 'r') {
        setResetTrigger((prev) => prev + 1);
        setWarpTarget({ x: 0, y: 2, z: 16 });
      } else if (k === 'm') {
        setSoundEnabled((prev) => {
          const next = !prev;
          sound.setEnabled(next);
          return next;
        });
      } else if (e.key === 'Escape') {
        setActiveProject(null);
        setActiveSkillPlanet(null);
        setShowSuggestions(false);
        setShowContact(false);
        setShowGuestbook(false);
        setShowCodeInspector(false);
        setShowGeminiChat(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') {
        carInputRef.current.forward = false;
      } else if (k === 's' || e.key === 'ArrowDown') {
        carInputRef.current.backward = false;
      } else if (k === 'a' || e.key === 'ArrowLeft') {
        carInputRef.current.left = false;
      } else if (k === 'd' || e.key === 'ArrowRight') {
        carInputRef.current.right = false;
      } else if (e.code === 'Space') {
        carInputRef.current.turbo = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [projects]);

  // Handle Touch input from HUD
  const handleVirtualInput = (action: string, active: boolean) => {
    sound.startEngine();
    if (action === 'forward') carInputRef.current.forward = active;
    if (action === 'backward') carInputRef.current.backward = active;
    if (action === 'left') carInputRef.current.left = active;
    if (action === 'right') carInputRef.current.right = active;
    if (action === 'turbo') carInputRef.current.turbo = active;
  };

  // Collect item handler
  const handleCollectItem = (id: string) => {
    setCollectibles((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, collected: true } : item));
      const newlyCollected = next.filter((i) => i.collected).length;
      if (newlyCollected === next.length) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
      return next;
    });
  };

  // Like project handler
  const handleLikeProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const collectedCount = collectibles.filter((c) => c.collected).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#03050c] text-slate-100 select-none">
      {viewMode === '3d' ? (
        <>
          {/* 3D WebGL Space Cosmos Canvas */}
          <ThreeCanvas
            projects={projects}
            skillPlanets={skillPlanets}
            collectibles={collectibles}
            activeProject={activeProject}
            activeSkillPlanet={activeSkillPlanet}
            onSelectProject={handleSelectProject}
            onSelectSkillPlanet={handleSelectSkillPlanet}
            onCollectItem={handleCollectItem}
            cameraView={cameraView}
            isNightMode={isNightMode}
            onUpdateSpeed={setSpeed}
            onUpdateCarPosition={setCarPosition}
            carInputRef={carInputRef}
            resetTrigger={resetTrigger}
            warpTarget={warpTarget}
          />

          {/* Space Flight HUD Interface */}
          <HUD
            speed={speed}
            carPosition={carPosition}
            projects={projects}
            skillPlanets={skillPlanets}
            collectibles={collectibles}
            collectedCount={collectedCount}
            cameraView={cameraView}
            onChangeCamera={setCameraView}
            isNightMode={isNightMode}
            onToggleNightMode={() => setIsNightMode(!isNightMode)}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              sound.setEnabled(next);
            }}
            onResetCar={() => {
              setResetTrigger((prev) => prev + 1);
              setWarpTarget({ x: 0, y: 2, z: 16 });
            }}
            onHonkHorn={() => sound.playHorn()}
            onSwitchMode={() => setViewMode('executive')}
            onOpenGuestbook={() => setShowGuestbook(true)}
            onOpenCodeInspector={() => setShowCodeInspector(true)}
            onOpenSuggestions={() => setShowSuggestions(true)}
            onOpenGeminiChat={() => setShowGeminiChat(true)}
            onOpenContact={() => {
              setContactSubject(undefined);
              setContactBody(undefined);
              setShowContact(true);
            }}
            onSelectProject={handleSelectProject}
            onSelectSkillPlanet={handleSelectSkillPlanet}
            onVirtualInput={handleVirtualInput}
          />
        </>
      ) : (
        /* Executive Resume & Architecture View */
        <ExecutiveView
          onSwitchTo3D={() => setViewMode('3d')}
          onSelectProject={handleSelectProject}
          onOpenGuestbook={() => setShowGuestbook(true)}
          onOpenCodeInspector={() => setShowCodeInspector(true)}
          onOpenGeminiChat={() => setShowGeminiChat(true)}
          onOpenContact={() => {
            setContactSubject(undefined);
            setContactBody(undefined);
            setShowContact(true);
          }}
        />
      )}

      {/* Project Planet Case Study Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onLikeProject={handleLikeProject}
          onOpenContactForProject={(title) => {
            setContactSubject(`Inquiry regarding ${title} architecture & build`);
            setContactBody(`Hi Shekhar,\n\nI was exploring your space portfolio and reviewed ${title}. I'd love to discuss how you can build similar high-performance systems for our team.\n\nBest regards,\n`);
            setShowContact(true);
          }}
        />
      )}

      {/* Skill Planet Deep Dive Modal */}
      {activeSkillPlanet && (
        <SkillPlanetModal
          planet={activeSkillPlanet}
          onClose={() => setActiveSkillPlanet(null)}
          onOpenContactForSkill={(domain) => {
            setContactSubject(`Consultation / Role regarding ${domain}`);
            setContactBody(`Hi Shekhar,\n\nI was inspecting ${activeSkillPlanet.name} in your 3D portfolio and saw your deep work in ${domain}.\n\nLet's connect to discuss our upcoming projects.\n\nBest regards,\n`);
            setShowContact(true);
          }}
        />
      )}

      {/* Interactive Suggestions & Scope Advisor Modal */}
      {showSuggestions && (
        <SuggestionsModal
          onClose={() => setShowSuggestions(false)}
          onSelectProjectRef={(projectId) => {
            const match = projects.find((p) => p.id === projectId);
            if (match) {
              handleSelectProject(match);
            }
          }}
          onOpenContact={(subj, body) => {
            setContactSubject(subj);
            setContactBody(body);
            setShowContact(true);
          }}
        />
      )}

      {/* Free Direct Contact Hub (Email, WhatsApp, vCard, Booking) */}
      {showContact && (
        <ContactModal
          initialSubject={contactSubject}
          initialBody={contactBody}
          onClose={() => setShowContact(false)}
        />
      )}

      {/* Real-time Guestbook Modal */}
      {showGuestbook && (
        <GuestbookModal onClose={() => setShowGuestbook(false)} />
      )}

      {/* Code & Physics Inspector Modal */}
      {showCodeInspector && (
        <CodeInspectorModal
          onClose={() => setShowCodeInspector(false)}
          physicsSettings={physicsSettings}
          onUpdatePhysics={setPhysicsSettings}
        />
      )}

      {/* Gemini AI Multi-Turn Co-Pilot Modal */}
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
    </div>
  );
}
