import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded?: () => void;
  loadingStage?: string;
  loadProgress?: number;
}

const STAGES = [
  'Loading planetary systems...',
  'Loading navigation systems...',
  'Loading star field...',
  'Loading spacecraft...',
  'Loading celestial objects...',
  'SYSTEM READY',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded, loadingStage, loadProgress }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(loadProgress ?? 18);

  useEffect(() => {
    if (loadProgress !== undefined) {
      setProgress(loadProgress);
      return;
    }

    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / STAGES.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          if (onLoaded) {
            setTimeout(onLoaded, 350);
          }
          return prev;
        }
      });
    }, 420);

    return () => clearInterval(interval);
  }, [onLoaded, loadProgress]);

  const displayStage = loadingStage || STAGES[stageIndex];

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#02050f]/95 backdrop-blur-md select-none font-mono text-cyan-400">
      <div className="w-88 p-7 rounded-xl border border-cyan-500/30 bg-[#071120]/85 shadow-[0_0_40px_rgba(6,182,212,0.22)] flex flex-col items-center text-center">
        {/* Header */}
        <div className="text-[10px] tracking-[0.25em] text-cyan-400/70 uppercase mb-1 font-semibold">
          BABYLON.JS 3D COSMOS ENGINE
        </div>
        <div className="text-sm font-bold tracking-widest text-slate-100 uppercase mb-5">
          INITIALIZING SPACECRAFT
        </div>

        {/* Radar Scanning Ring */}
        <div className="relative w-18 h-18 mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-2.5 rounded-full border border-cyan-400/40 border-b-cyan-300 animate-spin animate-reverse" />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-cyan-300">
            {progress}%
          </div>
        </div>

        {/* Dynamic Subsystem Stage Line */}
        <div className="text-[12px] tracking-wider text-cyan-200 font-semibold mb-3 h-5 flex items-center justify-center">
          {displayStage}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[9px] text-slate-400 tracking-wider">
          SKETCHFAB ASSET PIPELINE • PBR SHADERS • THIN INSTANCES
        </div>
      </div>
    </div>
  );
};
