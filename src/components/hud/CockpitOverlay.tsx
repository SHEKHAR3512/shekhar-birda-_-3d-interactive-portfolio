import React from 'react';
import { Crosshair, Compass, Radio, Zap, ShieldAlert } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';

export function CockpitOverlay() {
  const cockpitFrameVisible = useMissionStore((state) => state.cockpitFrameVisible);
  const isScanning = useMissionStore((state) => state.isScanning);
  const nearbyInteractable = useMissionStore((state) => state.nearbyInteractable);
  const activeEventNotice = useMissionStore((state) => state.activeEventNotice);
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const triggerScanner = useMissionStore((state) => state.triggerScanner);

  const handleScan = () => {
    sound.playScannerPing();
    if (typeof window !== 'undefined' && (window as unknown as { __triggerScannerPing?: () => void }).__triggerScannerPing) {
      (window as unknown as { __triggerScannerPing?: () => void }).__triggerScannerPing?.();
    } else {
      triggerScanner();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* 1. Top Cockpit Framing Brackets */}
      {cockpitFrameVisible && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-sky-500/30 rounded-tl-3xl opacity-75" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-sky-500/30 rounded-tr-3xl opacity-75" />
        </>
      )}

      {/* 2. Top-Left Cosmic Event Notification Toast (Unobstructed telemetry feed) */}
      {activeEventNotice && (
        <div className="absolute top-20 left-8 pointer-events-auto max-w-sm w-full px-2 animate-slideDown z-40">
          <div className="p-3.5 rounded-xl border border-amber-500/40 bg-[#0a0f1d]/95 backdrop-blur-md shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-start gap-3">
            <Radio className="w-4 h-4 text-amber-400 mt-0.5 animate-pulse shrink-0" />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold flex items-center gap-1.5 mb-0.5">
                <span>· DEEP SPACE TELEMETRY ·</span>
              </div>
              <div className="text-xs font-display font-bold text-slate-100 mb-0.5">
                {activeEventNotice.title}
              </div>
              <div className="text-[11px] font-mono text-slate-300 leading-tight">
                {activeEventNotice.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Center Proximity Target Prompt Banner (Cleanly spaced at top-36 below navigation guide) */}
      {!currentPlanet && nearbyInteractable && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 pointer-events-auto animate-fadeIn z-30">
          <div className="px-4 py-2 rounded-xl border border-cyan-400/50 bg-[#07111f]/95 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                CONTACT DETECTED · {nearbyInteractable.type.toUpperCase()} · {nearbyInteractable.distance} AU
              </span>
              <span className="text-xs font-display font-bold text-slate-100">
                {nearbyInteractable.name}
              </span>
            </div>
            {nearbyInteractable.actionPrompt && (
              <span className="ml-2 px-2.5 py-1 rounded-md bg-cyan-500/25 border border-cyan-400/60 font-mono text-[10px] text-cyan-200 font-bold animate-pulse whitespace-nowrap">
                {nearbyInteractable.actionPrompt}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 4. Bottom Cockpit Dashboard Console */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent pointer-events-none flex items-end justify-between px-6 sm:px-8 pb-4">
        {/* Left Side: Scanner Button & Sensor Status */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={handleScan}
            className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
              isScanning
                ? 'border-cyan-400 bg-cyan-500/30 text-white shadow-[0_0_18px_rgba(0,245,255,0.4)]'
                : 'border-sky-500/30 bg-[#07111f]/80 text-sky-300 hover:bg-sky-500/20'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'SCANNING SECTOR...' : 'SENSOR PING [V]'}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>RADAR ACTIVE</span>
          </div>
        </div>

        {/* Center Reticle Accent Line */}
        <div className="hidden lg:flex flex-col items-center opacity-40">
          <div className="w-24 h-0.5 border-t border-sky-500/40" />
        </div>

        {/* Right Coordinates Telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-[#07111f]/80 backdrop-blur-md text-[11px] font-mono text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.15)] pointer-events-auto">
          <Crosshair className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '24s' }} />
          <span>SOL SYSTEM · ACTIVE TELEMETRY</span>
        </div>
      </div>
    </div>
  );
}
