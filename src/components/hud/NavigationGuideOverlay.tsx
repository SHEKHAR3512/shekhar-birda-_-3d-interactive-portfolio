import React, { useState } from 'react';
import {
  Compass,
  Navigation,
  HelpCircle,
  FileText,
  ListOrdered,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';
import { MISSION_PROJECTS } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';

interface NavigationGuideOverlayProps {
  onOpenProjects: () => void;
}

export function NavigationGuideOverlay({ onOpenProjects }: NavigationGuideOverlayProps) {
  const targetPlanet = useMissionStore((state) => state.targetPlanet);
  const setTargetPlanet = useMissionStore((state) => state.setTargetPlanet);
  const isAutopilot = useMissionStore((state) => state.isAutopilot);
  const toggleAutopilot = useMissionStore((state) => state.toggleAutopilot);
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const restartTour = useMissionStore((state) => state.restartTour);
  const missionLog = useMissionStore((state) => state.missionLog);

  const [showLogModal, setShowLogModal] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const activeTarget = MISSION_PROJECTS.find((p) => p.id === targetPlanet) || MISSION_PROJECTS[3];

  if (currentPlanet) return null;

  const handleToggleAutopilot = () => {
    sound.playClick();
    toggleAutopilot();
  };

  const handleSelectTarget = (id: string) => {
    sound.playClick();
    setTargetPlanet(id);
    setShowTargetDropdown(false);
  };

  return (
    <>
      {/* Top Center-Right Guided Telemetry Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 p-2 rounded-xl hud-panel border border-sky-500/25 shadow-[0_0_20px_rgba(56,189,248,0.15)] animate-fadeIn">
        {/* Target Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTargetDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>
              DESTINATION: <strong className="text-sky-300">{activeTarget.planet}</strong> ({activeTarget.name})
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTargetDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-xl hud-panel border border-sky-400/40 shadow-2xl p-1.5 z-50 animate-fadeIn">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2 py-1">
                Select Destination:
              </div>
              {MISSION_PROJECTS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectTarget(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                    p.id === targetPlanet
                      ? 'bg-sky-500/25 text-sky-200 border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="font-bold">{p.planet}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auto Pilot Toggle Button */}
        <button
          onClick={handleToggleAutopilot}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer ${
            isAutopilot
              ? 'border border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'border border-sky-500/30 bg-sky-950/40 hover:bg-sky-500/15 text-sky-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isAutopilot ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span>{isAutopilot ? 'AUTO PILOT: ACTIVE' : 'ENGAGE AUTO PILOT'}</span>
        </button>

        {/* Mission Log Shortcut */}
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ListOrdered className="w-3.5 h-3.5 text-sky-400" />
          <span>Log</span>
        </button>

        {/* Help / Onborda Replay */}
        <button
          onClick={restartTour}
          title="Replay Onborda Instructions Tour"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Help</span>
        </button>
      </div>

      {/* Mission Log Modal Popup */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full p-6 rounded-2xl hud-panel border border-sky-500/30 text-slate-100 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-sky-500/20">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-sky-400" />
                <h3 className="font-display font-bold text-base text-slate-100 uppercase tracking-wide">
                  Mission Flight Log
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto font-mono text-xs pr-1">
              {missionLog.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg border border-sky-500/15 bg-slate-900/60 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-sky-400 uppercase tracking-wider">
                      {entry.date} · {entry.planet} System
                    </div>
                    <div className="text-slate-200 font-sans text-xs mt-0.5">{entry.title}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-sky-500/15 flex justify-end">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/15 text-sky-200 font-mono text-xs cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
