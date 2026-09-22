import React from 'react';
import { Radio } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';

export function PilotCard() {
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const cameraMode = useMissionStore((state) => state.cameraMode);

  // Keep visible or collapse smoothly if a planet is actively inspected
  if (currentPlanet) return null;

  return (
    <div className={`absolute bottom-8 left-8 z-30 p-4 rounded-xl hud-panel border border-sky-500/25 items-center gap-4 max-w-sm animate-fadeIn ${
      cameraMode === 'chart' ? 'hidden xl:flex' : 'flex'
    }`}>
      {/* Avatar Container with glowing border */}
      <div className="relative">
        <div className="w-13 h-13 rounded-full border-2 border-sky-400/60 overflow-hidden bg-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          <img
            src="/goku.png"
            alt="Shekhar Birda"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-display font-bold text-sm text-slate-100">Shekhar</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            Online
          </span>
        </div>
        <p className="text-[11px] font-mono text-sky-400 mb-1 truncate">
          React Native · React Web Developer
        </p>
        <p className="text-[11px] text-slate-300 font-sans leading-tight">
          Building modern and scalable web & mobile apps.
        </p>
      </div>
    </div>
  );
}
