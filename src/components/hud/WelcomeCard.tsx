import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';

export function WelcomeCard() {
  const missionStatus = useMissionStore((state) => state.missionStatus);
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const enterSolarSystem = useMissionStore((state) => state.enterSolarSystem);

  // If a planet is already selected or mission completed, let the view breathe
  if (currentPlanet) return null;

  return (
    <div className="absolute top-20 left-8 z-30 max-w-sm p-6 rounded-xl hud-panel border border-sky-500/25 animate-fadeIn">
      {/* Small Eyebrow Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-sky-400 font-semibold">
          Welcome to My Portfolio
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl font-display font-extrabold text-slate-100 tracking-tight leading-tight mb-3">
        Explore My <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300">
          Solar System
        </span>
      </h1>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
        A journey through my projects, skills and experience. Each planet represents a project.
        Complete the mission, explore, and discover what I&apos;ve built.
      </p>

      {/* CTA Button */}
      <button
        onClick={enterSolarSystem}
        className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-sky-400/50 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform" />
        <span>{missionStatus === 'not-started' ? 'Begin Mission' : 'Resume Mission'}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
