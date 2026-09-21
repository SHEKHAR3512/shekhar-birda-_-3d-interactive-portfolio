import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  RotateCcw,
  Radio,
  FileText,
  MessageSquare,
  Mail,
  Flame,
  Keyboard,
  HelpCircle,
  Lightbulb,
  Globe2,
  Cpu,
  Navigation,
  X,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { CameraView, Project, CollectibleItem, SkillPlanet } from '../types';
import { sound } from '../utils/sound';

interface HUDProps {
  speed: number;
  carPosition: [number, number];
  projects: Project[];
  skillPlanets: SkillPlanet[];
  collectibles: CollectibleItem[];
  collectedCount: number;
  cameraView: CameraView;
  onChangeCamera: (view: CameraView) => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetCar: () => void;
  onHonkHorn: () => void;
  onSwitchMode: () => void;
  onOpenGuestbook: () => void;
  onOpenCodeInspector: () => void;
  onOpenContact: () => void;
  onOpenSuggestions: () => void;
  onOpenGeminiChat: () => void;
  onSelectProject: (p: Project) => void;
  onSelectSkillPlanet: (s: SkillPlanet) => void;
  onVirtualInput: (action: string, active: boolean) => void;
}

interface CelestialTarget {
  id: string;
  solarPlanet: string;
  name: string;
  subtitle: string;
  category: string;
  color: string;
  accentColor: string;
  distance: number;
  type: 'project' | 'skill';
  data: any;
}

export const HUD: React.FC<HUDProps> = ({
  speed,
  carPosition,
  projects,
  skillPlanets,
  collectibles,
  collectedCount,
  cameraView,
  onChangeCamera,
  isNightMode,
  onToggleNightMode,
  soundEnabled,
  onToggleSound,
  onResetCar,
  onHonkHorn,
  onSwitchMode,
  onOpenGuestbook,
  onOpenCodeInspector,
  onOpenContact,
  onOpenSuggestions,
  onOpenGeminiChat,
  onSelectProject,
  onSelectSkillPlanet,
  onVirtualInput,
}) => {
  const [showSolarNavigator, setShowSolarNavigator] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [fps, setFps] = useState(60);

  // FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Calculate nearest celestial body in real time
  const nearestCelestial = useMemo<CelestialTarget | null>(() => {
    let closest: CelestialTarget | null = null;

    projects.forEach((p) => {
      const dist = Math.hypot(carPosition[0] - p.worldPosition[0], carPosition[1] - p.worldPosition[2]);
      if (!closest || dist < closest.distance) {
        closest = {
          id: p.id,
          solarPlanet: p.solarPlanet || 'Planet',
          name: p.title,
          subtitle: p.subtitle,
          category: p.category,
          color: p.color,
          accentColor: p.accentColor,
          distance: Math.round(dist * 10) / 10,
          type: 'project',
          data: p,
        };
      }
    });

    skillPlanets.forEach((sp) => {
      const dist = Math.hypot(carPosition[0] - sp.worldPosition[0], carPosition[1] - sp.worldPosition[2]);
      if (!closest || dist < closest.distance) {
        closest = {
          id: sp.id,
          solarPlanet: sp.solarPlanet || 'Planet',
          name: sp.name,
          subtitle: sp.subtitle,
          category: sp.domain,
          color: sp.color,
          accentColor: sp.accentColor,
          distance: Math.round(dist * 10) / 10,
          type: 'skill',
          data: sp,
        };
      }
    });

    return closest;
  }, [carPosition, projects, skillPlanets]);

  // Handle [E] key for orbital docking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key.toLowerCase() === 'e' && nearestCelestial && nearestCelestial.distance <= 26) {
        sound.playClick();
        if (nearestCelestial.type === 'project') {
          onSelectProject(nearestCelestial.data);
        } else {
          onSelectSkillPlanet(nearestCelestial.data);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearestCelestial, onSelectProject, onSelectSkillPlanet]);

  // All 9 Solar System celestial bodies sorted by orbital distance from the Sun
  const allSolarBodies = useMemo(() => {
    const list: Array<{
      id: string;
      solarPlanet: string;
      title: string;
      subtitle: string;
      category: string;
      color: string;
      accentColor: string;
      orbitRadius: number;
      distance: number;
      type: 'project' | 'skill';
      data: any;
    }> = [];

    projects.forEach((p) => {
      const dist = Math.hypot(carPosition[0] - p.worldPosition[0], carPosition[1] - p.worldPosition[2]);
      list.push({
        id: p.id,
        solarPlanet: p.solarPlanet || 'Planet',
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        color: p.color,
        accentColor: p.accentColor,
        orbitRadius: p.orbitRadius || 50,
        distance: Math.round(dist * 10) / 10,
        type: 'project',
        data: p,
      });
    });

    skillPlanets.forEach((sp) => {
      const dist = Math.hypot(carPosition[0] - sp.worldPosition[0], carPosition[1] - sp.worldPosition[2]);
      list.push({
        id: sp.id,
        solarPlanet: sp.solarPlanet || 'Planet',
        title: sp.name,
        subtitle: sp.subtitle,
        category: sp.domain,
        color: sp.color,
        accentColor: sp.accentColor,
        orbitRadius: sp.orbitRadius || 100,
        distance: Math.round(dist * 10) / 10,
        type: 'skill',
        data: sp,
      });
    });

    return list.sort((a, b) => a.orbitRadius - b.orbitRadius);
  }, [carPosition, projects, skillPlanets]);

  // Radar mini-map dimensions
  const mapCenter = 55;
  const mapScale = 0.55;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
      {/* ==========================================
          STARFIGHTER COCKPIT HUD CANOPY BRACKETS & RETICLE
         ========================================== */}
      {/* Canopy Visor Corner Framing Brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-white/15 rounded-tl pointer-events-none" />
      <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-white/15 rounded-tr pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-white/15 rounded-bl pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-white/15 rounded-br pointer-events-none" />

      {/* Central Starfighter Cockpit Flight Collimator Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Compass Bearing Ring */}
          <div className="w-24 h-24 rounded-full border border-dashed border-white/30" />
          {/* Inner Bore-sight Ring */}
          <div className="absolute w-8 h-8 rounded-full border border-white/40" />
          {/* Central Target Pip */}
          <div className="absolute w-1 h-1 rounded-full bg-white/70" />
          {/* Horizontal Flight Vector Wings */}
          <div className="absolute -left-16 w-8 h-px bg-white/40" />
          <div className="absolute -right-16 w-8 h-px bg-white/40" />
          {/* Vertical Pitch Reference Ticks */}
          <div className="absolute -top-16 h-6 w-px bg-white/25" />
          <div className="absolute -bottom-16 h-6 w-px bg-white/25" />
        </div>
      </div>

      {/* ==========================================
          TOP BAR: PILOT IDENTITY & MAIN ACTIONS
         ========================================== */}
      <header className="flex items-start justify-between gap-3">
        {/* Pilot Identity Badge */}
        <div className="flex items-center gap-3 pointer-events-auto bg-[#0b1329]/65 backdrop-blur-xl border border-white/10 p-2.5 sm:p-3 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] shadow-2xl shadow-black/40 ring-1 ring-white/5">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1e293b]/80 border border-white/15 flex items-center justify-center font-display font-bold text-sm text-[#f1f5f9] shadow-sm">
              SB
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0b1329]"
              title="Open to Roles & Projects"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#f1f5f9] font-display">
                Shekhar Birda
              </h1>
              <span className="text-[10px] font-mono tracking-wider uppercase bg-[#1e293b]/70 text-[#cbd5e1] px-1.5 py-0.5 rounded border border-white/10">
                PORTFOLIO
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] font-mono flex items-center gap-1.5 mt-0.5">
              <span>React Native & Web Architect</span>
              <span className="text-slate-600">•</span>
              <span className="text-[#cbd5e1] font-semibold">{fps} FPS</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Contact Hub */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
          {/* OPTIONAL SOLAR SYSTEM NAVIGATOR TOGGLE */}
          <button
            id="hud-solar-navigator-btn"
            onClick={() => {
              setShowSolarNavigator(!showSolarNavigator);
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer backdrop-blur-xl shadow-sm active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
              showSolarNavigator
                ? 'bg-[#1e293b]/80 text-[#f1f5f9] border-white/20'
                : 'bg-[#0b1329]/65 text-slate-300 border-white/10 hover:text-white hover:bg-[#1e293b]/70'
            }`}
            title="Open Solar System Planet Directory"
          >
            <Compass className="w-3.5 h-3.5 text-slate-300" />
            <span>PLANETS</span>
            <span className="text-[10px] bg-[#1e293b]/80 text-slate-400 px-1 py-0.5 rounded font-mono">
              9
            </span>
          </button>

          {/* GEMINI AI CO-PILOT */}
          <button
            id="hud-gemini-chat-btn"
            onClick={() => {
              onOpenGeminiChat();
              sound.playClick();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1329]/65 hover:bg-[#1e293b]/70 text-[#f1f5f9] border border-white/10 transition-all cursor-pointer font-mono text-xs active:scale-95 group backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            title="Ask Shekhar's AI Co-Pilot [G]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:scale-110 transition-transform" />
            <span>AI CO-PILOT</span>
            <span className="hidden xl:inline text-[9px] bg-[#1e293b]/80 text-slate-400 px-1 py-0.2 rounded border border-white/10 font-mono">
              [G]
            </span>
          </button>

          {/* SUGGESTIONS & SCOPE ADVISOR */}
          <button
            id="hud-suggestions-btn"
            onClick={() => {
              onOpenSuggestions();
              sound.playClick();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1329]/65 hover:bg-[#1e293b]/70 text-[#f1f5f9] border border-white/10 transition-all cursor-pointer font-mono text-xs active:scale-95 group backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            title="Project Suggestions & Scope Estimator"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>SUGGESTIONS</span>
          </button>

          {/* PROFESSIONAL DIRECT CONTACT CTA */}
          <button
            id="hud-contact-btn"
            onClick={() => {
              onOpenContact();
              sound.playClick();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f1f5f9]/90 hover:bg-white text-[#0f172a] transition-all cursor-pointer font-semibold text-xs active:scale-95 group font-mono shadow-md backdrop-blur-md"
          >
            <Mail className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>CONTACT</span>
            <span className="hidden lg:inline text-[10px] bg-slate-900/10 px-1 rounded">[C]</span>
          </button>

          {/* Resume View Switcher */}
          <button
            id="hud-switch-resume-btn"
            onClick={() => {
              onSwitchMode();
              sound.playClick();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1329]/65 hover:bg-[#1e293b]/70 text-[#f1f5f9] border border-white/10 text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            title="Switch to Traditional Resume View"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Resume</span>
          </button>

          {/* Guestbook */}
          <button
            id="hud-guestbook-btn"
            onClick={() => {
              onOpenGuestbook();
              sound.playClick();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0b1329]/65 hover:bg-[#1e293b]/70 text-[#cbd5e1] border border-white/10 text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            title="Guestbook"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline ml-1.5">Guestbook</span>
          </button>

          {/* Antigravity Live Physics Tuner */}
          <button
            id="hud-physics-tuner-btn"
            onClick={() => {
              onOpenCodeInspector();
              sound.playClick();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0b1329]/65 hover:bg-[#1e293b]/70 text-[#cbd5e1] border border-white/10 text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            title="Antigravity Live Physics Tuner"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline ml-1.5">Tuner</span>
          </button>

          {/* Quick Settings Group */}
          <div className="flex items-center bg-[#0b1329]/65 backdrop-blur-xl border border-white/10 p-1 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <button
              onClick={() => {
                onToggleSound();
                sound.playClick();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Audio [M]' : 'Unmute Audio [M]'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-slate-200" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Controls & Navigation"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          ORBITAL PROXIMITY DOCKING ALERT
         ========================================== */}
      {nearestCelestial && nearestCelestial.distance <= 26 && (
        <div className="self-center pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200 my-auto mb-2 sm:mb-4">
          <div className="flex items-center gap-3.5 bg-[#0b1329]/75 backdrop-blur-2xl border border-white/20 p-3 sm:px-4 sm:py-3 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] shadow-2xl shadow-black/50 ring-1 ring-white/5 max-w-[94vw]">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/20 font-display font-bold text-xs text-white"
              style={{ backgroundColor: nearestCelestial.color }}
            >
              {nearestCelestial.solarPlanet.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 font-semibold">
                  <Radio className="w-3 h-3 text-slate-400" />
                  ORBIT IN RANGE • {nearestCelestial.solarPlanet.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {nearestCelestial.distance} AU
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight truncate font-display">
                {nearestCelestial.name}
              </h3>
              <p className="text-[11px] text-slate-300 font-mono truncate hidden sm:block">
                {nearestCelestial.subtitle}
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                if (nearestCelestial.type === 'project') {
                  onSelectProject(nearestCelestial.data);
                } else {
                  onSelectSkillPlanet(nearestCelestial.data);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#f1f5f9] text-[#0f172a] hover:bg-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0 shadow-sm"
            >
              <span>INSPECT</span>
              <span className="text-[10px] bg-slate-900/10 px-1 py-0.5 rounded font-mono">[E]</span>
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          SLIDE-OVER SOLAR SYSTEM NAVIGATOR DRAWER
         ========================================== */}
      {showSolarNavigator && (
        <div className="fixed top-20 right-4 sm:right-6 bottom-24 w-80 sm:w-96 bg-[#0b1329]/75 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] shadow-2xl shadow-black/60 z-30 pointer-events-auto flex flex-col animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-slate-300" />
              <div>
                <h2 className="text-sm font-bold text-[#f1f5f9] font-display">Solar System Directory</h2>
                <p className="text-[10px] font-mono text-[#94a3b8]">9 Celestial Worlds in Keplerian Orbit</p>
              </div>
            </div>
            <button
              onClick={() => setShowSolarNavigator(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e293b]/70 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 scrollbar-thin">
            {allSolarBodies.map((body, idx) => (
              <div
                key={body.id}
                onClick={() => {
                  sound.playClick();
                  if (body.type === 'project') {
                    onSelectProject(body.data);
                  } else {
                    onSelectSkillPlanet(body.data);
                  }
                  setShowSolarNavigator(false);
                }}
                className="group p-3 rounded-2xl bg-[#060a14]/50 hover:bg-[#1e293b]/60 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: body.color }}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors truncate font-display">
                        {body.solarPlanet}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">• {body.distance} AU</span>
                    </div>
                    <p className="text-[11px] text-[#cbd5e1] truncate font-mono">
                      {body.type === 'project' ? body.title : body.title.replace('Planet ', '')}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-[#94a3b8] text-center">
            Click any celestial body to view in-depth architecture.
          </div>
        </div>
      )}

      {/* HELP POPUP OVERLAY */}
      {showHelp && (
        <div className="absolute top-20 right-5 z-20 pointer-events-auto w-80 bg-[#0b1329]/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] shadow-2xl text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-[#f1f5f9] flex items-center gap-1.5 font-display">
              <Keyboard className="w-4 h-4 text-slate-300" />
              Flight Mechanics & Shortcuts
            </span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-slate-300 font-mono">
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Thrust Forward / Reverse</span>
              <span className="text-white font-bold">[W] / [S] or Arrows</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Yaw Steering & Bank</span>
              <span className="text-white font-bold">[A] / [D]</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Sub-light Turbo Boost</span>
              <span className="text-slate-200 font-bold">[Spacebar]</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Dock & Inspect In Range</span>
              <span className="text-slate-200 font-bold">[E]</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Direct Warp to Worlds</span>
              <span className="text-slate-200 font-bold">[1] - [5]</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Open Contact Hub</span>
              <span className="text-slate-200 font-bold">[C]</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Reset Ship to Sun</span>
              <span className="text-slate-200 font-bold">[R]</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Toggle Resume View</span>
              <span className="text-slate-200 font-bold">[V]</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Fly to any planet or click it directly in 3D to inspect detailed case studies.
          </p>
        </div>
      )}

      {/* ==========================================
          BOTTOM BAR: TELEMETRY, CELESTIAL RADAR & CONTROLS
         ========================================== */}
      <footer className="flex items-end justify-between gap-3">
        {/* SPEEDOMETER & CELESTIAL TELEMETRY */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="bg-[#0b1329]/65 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] shadow-2xl shadow-black/40 flex items-center gap-4">
            {/* Speed Gauge */}
            <div className="flex flex-col">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-slate-400" />
                <span>VELOCITY</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#f1f5f9] font-display">{speed}</span>
                <span className="text-[10px] text-slate-400 font-mono">KM/S</span>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10" />

            {/* Coordinates */}
            <div className="flex flex-col font-mono text-[11px]">
              <span className="text-[9px] uppercase tracking-wider text-slate-400">COORDINATES</span>
              <span className="text-[#cbd5e1] font-bold">
                X: {carPosition[0]} | Z: {carPosition[1]}
              </span>
            </div>

            <div className="w-px h-8 bg-white/10" />

            {/* Camera Perspective Selector */}
            <div className="flex items-center gap-1 bg-[#060a14]/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {(['follow', 'isometric', 'topDown', 'cinema'] as CameraView[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    onChangeCamera(mode);
                    sound.playClick();
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase transition-all cursor-pointer ${
                    cameraView === mode
                      ? 'bg-[#f1f5f9] text-[#0f172a] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Switch to ${mode} camera view`}
                >
                  {mode === 'follow' ? 'ORBIT' : mode === 'topDown' ? 'CHART' : mode}
                </button>
              ))}
            </div>

            {/* Reset Ship */}
            <button
              onClick={() => {
                onResetCar();
                sound.playClick();
              }}
              className="p-2 rounded-xl bg-[#1e293b]/70 hover:bg-[#334155]/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10 backdrop-blur-md"
              title="Reset Ship to Sun Center [R]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CELESTIAL RADAR MINI-MAP (Bottom Right) */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Mobile Virtual Controls */}
          <div className="flex lg:hidden flex-col items-center gap-1.5 bg-[#0b1329]/65 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <button
              onPointerDown={() => onVirtualInput('forward', true)}
              onPointerUp={() => onVirtualInput('forward', false)}
              className="w-10 h-10 rounded-xl bg-[#1e293b]/80 active:bg-[#f1f5f9] active:text-[#0f172a] flex items-center justify-center text-slate-200 border border-white/10 active:scale-95"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              <button
                onPointerDown={() => onVirtualInput('left', true)}
                onPointerUp={() => onVirtualInput('left', false)}
                className="w-10 h-10 rounded-xl bg-[#1e293b]/80 active:bg-[#f1f5f9] active:text-[#0f172a] flex items-center justify-center text-slate-200 border border-white/10 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onPointerDown={() => onVirtualInput('backward', true)}
                onPointerUp={() => onVirtualInput('backward', false)}
                className="w-10 h-10 rounded-xl bg-[#1e293b]/80 active:bg-[#f1f5f9] active:text-[#0f172a] flex items-center justify-center text-slate-200 border border-white/10 active:scale-95"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onPointerDown={() => onVirtualInput('right', true)}
                onPointerUp={() => onVirtualInput('right', false)}
                className="w-10 h-10 rounded-xl bg-[#1e293b]/80 active:bg-[#f1f5f9] active:text-[#0f172a] flex items-center justify-center text-slate-200 border border-white/10 active:scale-95"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onPointerDown={() => onVirtualInput('turbo', true)}
              onPointerUp={() => onVirtualInput('turbo', false)}
              className="w-full py-1.5 rounded-lg bg-[#1e293b]/80 active:bg-[#f1f5f9] text-slate-200 active:text-[#0f172a] font-mono text-[10px] font-bold border border-white/10"
            >
              TURBO
            </button>
          </div>

          {/* Radar Screen */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#0b1329]/65 backdrop-blur-xl border border-white/10 p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] shadow-2xl shadow-black/40 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
            <div className="absolute w-20 h-20 rounded-full border border-white/15 pointer-events-none" />
            <div className="absolute w-12 h-12 rounded-full border border-white/10 pointer-events-none" />

            {/* Central Sun */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_6px_#fcd34d]"
              style={{ left: 'calc(50% - 5px)', top: 'calc(50% - 5px)' }}
              title="Central Sun Core"
            />

            {/* Project Planet Blips */}
            {projects.map((p) => {
              const blipX = mapCenter + p.worldPosition[0] * mapScale;
              const blipZ = mapCenter + p.worldPosition[2] * mapScale;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    sound.playClick();
                  }}
                  className="absolute w-2 h-2 rounded-full transition-transform hover:scale-150 cursor-pointer shadow-sm"
                  style={{
                    left: `${Math.max(4, Math.min(94, blipX))}%`,
                    top: `${Math.max(4, Math.min(94, blipZ))}%`,
                    backgroundColor: p.color,
                  }}
                  title={`Planet: ${p.solarPlanet} (${p.title})`}
                />
              );
            })}

            {/* Skill Planet Blips */}
            {skillPlanets.map((sp) => {
              const blipX = mapCenter + sp.worldPosition[0] * mapScale;
              const blipZ = mapCenter + sp.worldPosition[2] * mapScale;
              return (
                <button
                  key={sp.id}
                  onClick={() => {
                    onSelectSkillPlanet(sp);
                    sound.playClick();
                  }}
                  className="absolute w-2.5 h-2.5 rounded-sm transition-transform hover:scale-150 cursor-pointer shadow-sm border border-white/40"
                  style={{
                    left: `${Math.max(4, Math.min(94, blipX))}%`,
                    top: `${Math.max(4, Math.min(94, blipZ))}%`,
                    backgroundColor: sp.color,
                  }}
                  title={`Skill: ${sp.solarPlanet} (${sp.name})`}
                />
              );
            })}

            {/* Player Ship Blip */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] border border-slate-900 z-10"
              style={{
                left: `${Math.max(6, Math.min(94, mapCenter + carPosition[0] * mapScale))}%`,
                top: `${Math.max(6, Math.min(94, mapCenter + carPosition[1] * mapScale))}%`,
              }}
            />

            <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-slate-500">
              RADAR
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
