import React from 'react';
import { Compass, Orbit, FileText, Send, Eye, LifeBuoy } from 'lucide-react';
import { useMissionStore, ActiveTab } from '../../store/missionStore';
import { sound } from '../../utils/sound';

interface NavbarProps {
  onOpenResume?: () => void;
  onOpenContact?: () => void;
  onOpenProjectsMap?: () => void;
  onOpenSupport?: () => void;
}

export function Navbar({ onOpenResume, onOpenContact, onOpenProjectsMap, onOpenSupport }: NavbarProps) {
  const theme = useMissionStore((state) => state.theme);
  const toggleTheme = useMissionStore((state) => state.toggleTheme);
  const currentExperience = useMissionStore((state) => state.currentExperience);
  const returnToResume = useMissionStore((state) => state.returnToResume);
  const enterSolarSystem = useMissionStore((state) => state.enterSolarSystem);
  const launchMission = useMissionStore((state) => state.launchMission);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const cockpitFrameVisible = useMissionStore((state) => state.cockpitFrameVisible);
  const toggleCockpitFrame = useMissionStore((state) => state.toggleCockpitFrame);

  const handleNavClick = (tab: ActiveTab) => {
    sound.playClick();
    if (tab === 'resume') {
      returnToResume();
      if (onOpenResume) onOpenResume();
    } else if (tab === 'mission') {
      if (currentExperience === 'resume') {
        launchMission();
      } else {
        selectPlanet(null);
        enterSolarSystem();
      }
    } else if (tab === 'projects' && onOpenProjectsMap) {
      onOpenProjectsMap();
    } else if (tab === 'contact' && onOpenContact) {
      onOpenContact();
    }
  };

  const isResumeActive = currentExperience === 'resume';
  const isMissionActive = currentExperience === 'solar-system' || currentExperience === 'mission-boot';

  return (
    <header className="relative z-40 w-full px-6 py-4 flex items-center justify-between border-b border-sky-500/15 bg-[#030712]/80 backdrop-blur-md text-slate-100 transition-colors duration-300">
      {/* Brand & Subtitle */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => handleNavClick('resume')}
      >
        <div className="w-8 h-8 rounded-full border border-sky-400/40 flex items-center justify-center bg-sky-500/10 group-hover:border-sky-400 transition-colors">
          <Orbit className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '14s' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-wider text-base text-slate-100 group-hover:text-sky-300 transition-colors">
              SHEKHAR
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border border-sky-400/25 bg-sky-950/40 text-sky-400">
              SOL-01
            </span>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            React Native · React Web Developer
          </p>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => handleNavClick('resume')}
          className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
            isResumeActive
              ? 'text-sky-400 bg-sky-500/15 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume</span>
        </button>

        <button
          onClick={() => handleNavClick('mission')}
          className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
            isMissionActive
              ? 'text-sky-400 bg-sky-500/15 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Mission 3D</span>
        </button>

        <button
          onClick={() => handleNavClick('projects')}
          className="px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 cursor-pointer"
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>

        <button
          onClick={() => handleNavClick('contact')}
          className="px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            if (onOpenSupport) onOpenSupport();
          }}
          className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wider transition-all flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 border border-sky-500/20 cursor-pointer"
          title="Open AI Support Center (/support)"
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Support</span>
        </button>
      </nav>

      {/* Right Controls: Cockpit Toggle & Day/Night Theme Switch */}
      <div className="flex items-center gap-3">
        {/* Cockpit Frame Toggle (active when in solar system) */}
        {isMissionActive && (
          <button
            onClick={toggleCockpitFrame}
            title={cockpitFrameVisible ? 'Switch to Full Cosmos View' : 'Switch to Cockpit View'}
            className={`p-2 rounded border transition-all flex items-center gap-1 text-xs font-mono cursor-pointer ${
              cockpitFrameVisible
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">
              {cockpitFrameVisible ? 'Cockpit' : 'Cosmos'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
