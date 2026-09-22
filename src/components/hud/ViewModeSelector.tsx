import React, { useEffect } from 'react';
import {
  Compass,
  RotateCw,
  Film,
  Layers,
  Globe as MapIcon,
  Crosshair,
  Sliders
} from 'lucide-react';
import { useMissionStore, CameraMode } from '../../store/missionStore';
import { sound } from '../../utils/sound';
import { MISSION_PROJECTS } from '../../data/projects';

export function ViewModeSelector() {
  const cameraMode = useMissionStore((state) => state.cameraMode);
  const setCameraMode = useMissionStore((state) => state.setCameraMode);
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const targetPlanet = useMissionStore((state) => state.targetPlanet);
  const setTargetPlanet = useMissionStore((state) => state.setTargetPlanet);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);

  // Keyboard shortcut listener for camera modes (Keys 1-5 when not typing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const key = e.key.toLowerCase();

      if (key === '1') {
        sound.playClick();
        setCameraMode('flight');
      } else if (key === '2' || key === 'o') {
        sound.playClick();
        setCameraMode('orbit');
      } else if (key === '3' || key === 'k') {
        sound.playClick();
        setCameraMode('cinematic');
      } else if (key === '4' || key === 'i') {
        sound.playClick();
        setCameraMode('isometric');
      } else if (key === '5' || key === 'm') {
        sound.playClick();
        setCameraMode('chart');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCameraMode]);

  const modes: Array<{
    id: CameraMode;
    label: string;
    shortcut: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }> = [
    { id: 'flight', label: 'Flight', shortcut: '1', icon: Compass, description: '3rd-person chase camera' },
    { id: 'orbit', label: 'Orbit', shortcut: '2', icon: RotateCw, description: '360° orbital revolution' },
    { id: 'cinematic', label: 'Cinematic', shortcut: '3', icon: Film, description: 'Director tracking angles' },
    { id: 'isometric', label: 'Isometric', shortcut: '4', icon: Layers, description: '45° tactical overview' },
    { id: 'chart', label: 'Chart', shortcut: '5', icon: MapIcon, description: 'Top-down solar map' },
  ];

  const handleSelectMode = (id: CameraMode) => {
    sound.playClick();
    setCameraMode(id);
  };

  return (
    <>
      {/* 1. View Mode HUD Toolbar (Centered at Top-Right / Clean floating pill) */}
      <div className="absolute top-4 right-8 z-30 flex items-center gap-1.5 p-1 rounded-xl hud-panel border border-sky-500/30 bg-[#07111f]/90 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)] animate-fadeIn">
        <div className="flex items-center gap-1 px-2 py-0.5 border-r border-sky-500/20 text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest hidden sm:flex">
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span>VIEW</span>
        </div>

        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = cameraMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMode(m.id)}
              title={`${m.label} Mode (${m.description}) [${m.shortcut}]`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border border-cyan-400 bg-cyan-500/25 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold'
                  : 'border border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
              <span className="capitalize">{m.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded ${isActive ? 'bg-cyan-400/30 text-cyan-100' : 'text-slate-500'}`}>
                {m.shortcut}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Cinematic Widescreen Letterbox Bars & Telemetry (When Cinematic mode is active) */}
      {cameraMode === 'cinematic' && (
        <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between animate-fadeIn">
          {/* Top Letterbox Bar */}
          <div className="w-full h-12 bg-black/90 flex items-center justify-between px-8 border-b border-cyan-500/20 shadow-2xl">
            <div className="flex items-center gap-2.5 font-mono text-[11px] text-cyan-400 tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-red-400">● REC</span>
              <span className="text-slate-500">|</span>
              <span>CINEMATIC DIRECTOR CAM · 2.39:1 ANAMORPHIC</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400">24.00 FPS</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              PRESS <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">1</kbd> TO RETURN TO FLIGHT
            </div>
          </div>

          {/* Bottom Letterbox Bar */}
          <div className="w-full h-12 bg-black/90 flex items-center justify-between px-8 border-t border-cyan-500/20 shadow-2xl">
            <div className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
              SOL SYSTEM EXPEDITION · SHEKHAR STARFIGHTER
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-cyan-400">
              <span>FOV: 38°</span>
              <span>SHUTTER: 1/48s</span>
              <span>LUT: DEEP SPACE 709</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tactical Chart Overlay (When Chart mode is active) */}
      {cameraMode === 'chart' && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-8 animate-fadeIn">
          {/* Chart Header */}
          <div className="flex items-center justify-between pt-16">
            <div className="p-3 rounded-xl hud-panel border border-cyan-500/30 bg-[#07111f]/90 max-w-sm pointer-events-auto">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 mb-1">
                <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '18s' }} />
                <span>SOL SYSTEM ORBITAL CHART</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                Top-down tactical overview. Click any planetary waypoint to calibrate destination or orbit.
              </p>
            </div>
          </div>

          {/* Planetary Waypoint Quick-Jump Strip (Cleanly docked above flight controls bar) */}
          <div className="pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#030712]/90 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.25)] max-w-[92vw] overflow-x-auto no-scrollbar z-20">
            {MISSION_PROJECTS.map((p) => {
              const isTarget = targetPlanet === p.id;
              const isOrbit = currentPlanet === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playClick();
                    setTargetPlanet(p.id);
                    selectPlanet(p.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg ${
                    isOrbit
                      ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200'
                      : isTarget
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200'
                      : 'border-sky-500/30 bg-[#07111f]/85 text-slate-300 hover:bg-sky-500/20'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
                  <span className="font-bold">{p.planet}</span>
                  <span className="text-[10px] text-slate-400">({p.orbitRadius} AU)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
