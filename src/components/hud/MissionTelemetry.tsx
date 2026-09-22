import React from 'react';
import { MISSION_PROJECTS } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';

export function MissionTelemetry() {
  const missionStatus = useMissionStore((state) => state.missionStatus);
  const discoveredPlanets = useMissionStore((state) => state.discoveredPlanets);
  const completedProjects = useMissionStore((state) => state.completedProjects);

  const totalPlanets = MISSION_PROJECTS.length;
  const discoveredCount = discoveredPlanets.length;
  const completedCount = completedProjects.length;
  const progressPercent = Math.round((discoveredCount / totalPlanets) * 100);

  const statusLabel =
    missionStatus === 'completed'
      ? 'Completed'
      : missionStatus === 'active'
      ? 'Active'
      : 'Not Started';

  const statusColor =
    missionStatus === 'completed'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : missionStatus === 'active'
      ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
      : 'text-slate-400 bg-slate-800/40 border-slate-700/40';

  return (
    <div className="absolute top-20 right-8 z-30 p-5 rounded-xl hud-panel border border-sky-500/25 min-w-[220px]">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-500/15">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
          Mission Status
        </span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Metrics Readouts */}
      <div className="space-y-3 font-mono">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[11px] text-slate-400">Planets Discovered</span>
            <span className="text-xs font-bold text-sky-300">
              {discoveredCount} / {totalPlanets}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[11px] text-slate-400">Projects Completed</span>
            <span className="text-xs font-bold text-slate-200">
              {completedCount} / {totalPlanets}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-sky-500/10 flex justify-between items-center text-[10px] text-slate-500">
          <span>MISSION XP</span>
          <span className="text-sky-400 font-semibold">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
}
