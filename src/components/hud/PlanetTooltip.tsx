import React from 'react';
import { MISSION_PROJECTS } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';

export function PlanetTooltip() {
  const hoveredPlanet = useMissionStore((state) => state.hoveredPlanet);
  const hoverCoords = useMissionStore((state) => state.hoverCoords);
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const discoveredPlanets = useMissionStore((state) => state.discoveredPlanets);

  // If a planet is already actively selected in focus mode, or no planet hovered, don't show tooltip
  if (!hoveredPlanet || currentPlanet || !hoverCoords) return null;

  const project = MISSION_PROJECTS.find((p) => p.id === hoveredPlanet);
  if (!project) return null;

  const isDiscovered = discoveredPlanets.includes(project.id);

  // Offset tooltip slightly above the screen coordinates
  const left = Math.min(Math.max(hoverCoords.x, 140), window.innerWidth - 140);
  const top = Math.max(hoverCoords.y - 70, 70);

  return (
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed -translate-x-1/2 -translate-y-full z-40 pointer-events-none p-3 rounded-lg border border-sky-400/40 bg-[#07111f]/90 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.25)] min-w-[190px] animate-fadeIn"
    >
      <div className="flex items-center justify-between gap-2 mb-1 border-b border-sky-500/15 pb-1">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">
          {project.planet}
        </span>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
            isDiscovered
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
              : 'text-amber-400 border-amber-500/30 bg-amber-950/40'
          }`}
        >
          {isDiscovered ? 'DISCOVERED' : 'UNDISCOVERED'}
        </span>
      </div>

      <div className="text-xs font-display font-semibold text-slate-100 truncate">
        {project.name}
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>{project.role}</span>
      </div>

      <div className="mt-1.5 text-center text-[9px] font-mono tracking-widest text-sky-400 uppercase bg-sky-950/40 py-0.5 rounded border border-sky-400/20">
        Click to Approach
      </div>

      {/* Downward triangle pointer */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-sky-400/40" />
    </div>
  );
}
