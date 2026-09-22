import React from 'react';
import { X, CheckCircle, Lock, Clock, Compass, ChevronRight } from 'lucide-react';
import { MISSION_PROJECTS } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';

interface MissionMapViewProps {
  onClose: () => void;
}

export function MissionMapView({ onClose }: MissionMapViewProps) {
  const discoveredPlanets = useMissionStore((state) => state.discoveredPlanets);
  const completedProjects = useMissionStore((state) => state.completedProjects);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const setActiveTab = useMissionStore((state) => state.setActiveTab);

  const total = MISSION_PROJECTS.length;
  const discovered = discoveredPlanets.length;
  const progressPercent = Math.round((discovered / total) * 100);

  const handlePlanetClick = (id: string) => {
    selectPlanet(id);
    setActiveTab('mission');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]/92 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-fadeIn select-none text-slate-100">
      {/* Header Bar */}
      <div className="flex items-start justify-between border-b border-sky-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase font-semibold">
              Mission Flight Plan
            </span>
          </div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-100">
            THE MISSION
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Explore the planets, complete each project, and unlock the final reward.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Tracker */}
          <div className="hidden sm:block text-right font-mono">
            <div className="text-[11px] text-slate-400 mb-1">MISSION PROGRESS</div>
            <div className="flex items-center gap-3">
              <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden border border-sky-500/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-bold text-sky-300">
                {discovered} / {total} ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-sky-500/30 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Planetary Alignment (matching bottom-left reference image) */}
      <div className="my-8 py-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[900px] px-6 relative">
          {/* Central connecting orbit track line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-amber-500/40 via-sky-500/30 to-blue-600/40 pointer-events-none" />

          {/* Sun Sphere */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse" />
            <span className="mt-3 text-xs font-mono font-bold text-amber-300 tracking-wider">
              SOL
            </span>
          </div>

          {/* 8 Planetary Nodes */}
          {MISSION_PROJECTS.map((p) => {
            const isDiscovered = discoveredPlanets.includes(p.id);
            const isCompleted = completedProjects.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => handlePlanetClick(p.id)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                {/* Status Indicator Icon above planet */}
                <div className="mb-2">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : isDiscovered ? (
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  )}
                </div>

                {/* Planet Sphere Icon */}
                <div
                  className="w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-lg group-hover:scale-115"
                  style={{
                    borderColor: isDiscovered ? p.accentColor : '#334155',
                    backgroundColor: isDiscovered ? `${p.accentColor}22` : '#0f172a',
                    boxShadow: isDiscovered ? `0 0 20px ${p.accentColor}44` : 'none',
                  }}
                >
                  <span className="text-[11px] font-mono font-bold text-slate-200">
                    {p.planet[0]}
                  </span>
                </div>

                {/* Planet & Project Labels */}
                <div className="mt-3 text-center">
                  <div className="text-xs font-display font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                    {p.planet}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 max-w-[90px] truncate">
                    {p.name}
                  </div>
                  <div className="mt-0.5">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        isCompleted
                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                          : isDiscovered
                          ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
                          : 'text-slate-500 border-slate-700 bg-slate-900/60'
                      }`}
                    >
                      {isCompleted ? 'Completed' : isDiscovered ? 'In Progress' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Mission Log + Interaction Guide + Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-sky-500/15">
        {/* Mission Log */}
        <div className="p-4 rounded-xl border border-sky-500/20 bg-slate-950/50">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-semibold mb-3">
            Mission Log
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-300">
            {MISSION_PROJECTS.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="text-[11px] text-slate-400">
                  <strong className="text-slate-200">{p.summaryDate || '2025'}</strong> — {p.name}: Explored architecture & tech stack.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Guide */}
        <div className="p-4 rounded-xl border border-sky-500/20 bg-slate-950/50">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-semibold mb-3">
            Interaction Guide
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Click on any planet to view its holographic project dossier</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Complete all planets to unlock the mission completion reward</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Use arrow keys or mouse to explore the 3D space cosmos</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Toggle theme between Deep Space and Daylight Spacecraft</span>
            </li>
          </ul>
        </div>

        {/* Coordinates & Radar Status */}
        <div className="p-4 rounded-xl border border-sky-500/20 bg-slate-950/50 flex flex-col justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-semibold mb-2">
            Sector Telemetry
          </div>
          <div className="space-y-1 text-xs font-mono text-slate-400">
            <div>TARGET SYSTEM: <span className="text-slate-200 font-bold">SOL SYSTEM</span></div>
            <div>COORDINATES: <span className="text-sky-300">0.0000° N 0.0000° E</span></div>
            <div>STATUS: <span className="text-emerald-400">ONLINE · 60 FPS</span></div>
          </div>
          <div className="mt-3 pt-2 border-t border-sky-500/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '18s' }} />
              AUTONOMOUS GUIDANCE
            </span>
            <span className="text-sky-400">SHEKHAR BIRDA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
