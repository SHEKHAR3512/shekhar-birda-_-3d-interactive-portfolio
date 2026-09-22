import React, { useState, useEffect } from 'react';
import { Rocket, FastForward, CheckCircle2 } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';

export function MissionBootSequence() {
  const enterSolarSystem = useMissionStore((state) => state.enterSolarSystem);
  const [lines, setLines] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const bootLogs = [
    'INITIALIZING MISSION FLIGHT COMPUTER...',
    'CALIBRATING 3D SOLAR NAVIGATION ENGINE...',
    'PROJECT TELEMETRY DATABASE: LOADED (8 SYSTEMS)',
    'STARFIGHTER ATTITUDE & THRUSTERS: ONLINE',
    'MISSION OBJECTIVE: EXPLORE SHEKHAR\'S PRODUCTION PROJECTS'
  ];

  useEffect(() => {
    sound.startEngine();
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLogs.length) {
        setLines((prev) => [...prev, bootLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsReady(true);
        // Auto-enter after 700ms when ready, giving total duration ~2.4 seconds
        setTimeout(() => {
          enterSolarSystem();
        }, 800);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    sound.playClick();
    enterSolarSystem();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-6 select-none font-mono animate-fadeIn">
      {/* Background Grid & Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-950/20 via-[#030712] to-[#030712]" />

      <div className="relative z-10 max-w-lg w-full p-8 rounded-2xl hud-panel border border-sky-400/40 shadow-[0_0_50px_rgba(56,189,248,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-sky-500/20">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-sky-300 uppercase">
              System Pre-Flight Boot
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-slate-700 hover:border-sky-400 bg-slate-900 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        {/* Boot Sequence Lines */}
        <div className="space-y-3 min-h-[160px] text-xs text-slate-200">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300">{line}</span>
            </div>
          ))}

          {!isReady && (
            <div className="flex items-center gap-2 text-sky-400 animate-pulse pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-[11px]">INITIALIZING SYSTEMS...</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-sky-500/20">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
            <span>PRE-FLIGHT STATUS</span>
            <span className="text-sky-400 font-bold">{isReady ? '100%' : `${Math.round((lines.length / bootLogs.length) * 100)}%`}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${(lines.length / bootLogs.length) * 100}%` }}
            />
          </div>

          {/* Direct CTA when ready */}
          <button
            onClick={handleSkip}
            className="w-full mt-6 py-3 rounded-xl border border-sky-400/60 bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 hover:text-white font-mono text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)] cursor-pointer"
          >
            <span>{isReady ? 'Launch Spacecraft →' : 'Begin Journey'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
