import React, { useState, useEffect, useRef } from 'react';
import { Compass, Flame, ShieldAlert, Zap } from 'lucide-react';
import { flightInput } from '../solar-system/Starfighter';
import { useMissionStore } from '../../store/missionStore';

export function FlightControlsOverlay() {
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const [isTouch, setIsTouch] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkTouch = () => {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        setIsTouch(true);
      }
    };
    checkTouch();
  }, []);

  // When viewing project dossier, keep controls hidden to prevent obstruction
  if (currentPlanet) return null;

  // Handle Touch Virtual Joystick
  const handleTouchStart = (e: React.TouchEvent) => {
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickBaseRef.current) return;
    const touch = e.touches[0];
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = 45;
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setStickOffset({ x: dx, y: dy });

    // Map to flight inputs
    flightInput.forward = dy < -12;
    flightInput.backward = dy > 12;
    flightInput.left = dx < -12;
    flightInput.right = dx > 12;
  };

  const handleTouchEnd = () => {
    setStickOffset({ x: 0, y: 0 });
    flightInput.forward = false;
    flightInput.backward = false;
    flightInput.left = false;
    flightInput.right = false;
  };

  return (
    <>
      {/* Desktop Keybinding Indicator */}
      {!isTouch && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl hud-panel border border-sky-500/25 font-mono text-[11px] text-slate-300 shadow-[0_0_15px_rgba(56,189,248,0.15)] animate-fadeIn">
          <span className="flex items-center gap-1.5 text-sky-400 font-bold">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '14s' }} />
            <span>FLIGHT CONTROLS:</span>
          </span>
          <span className="text-slate-400">W/S</span>
          <span className="text-slate-200">Thrust/Reverse</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">A/D</span>
          <span className="text-slate-200">Steer</span>
          <span className="text-slate-600">·</span>
          <span className="px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-300">
            Shift
          </span>
          <span className="text-slate-200">Boost</span>
          <span className="text-slate-600">·</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            Space
          </span>
          <span className="text-slate-200">Brake</span>
        </div>
      )}

      {/* Mobile Virtual Controls */}
      {isTouch && (
        <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-between px-6 pointer-events-none">
          {/* Left: Virtual Joystick */}
          <div
            ref={joystickBaseRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-28 h-28 rounded-full border-2 border-sky-400/40 bg-slate-950/70 backdrop-blur-md flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(56,189,248,0.2)] touch-none"
          >
            <div
              style={{
                transform: `translate(${stickOffset.x}px, ${stickOffset.y}px)`,
              }}
              className="w-12 h-12 rounded-full border border-sky-400 bg-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.4)] pointer-events-none"
            />
          </div>

          {/* Right: Boost & Brake Action Buttons */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <button
              onTouchStart={() => {
                flightInput.boost = true;
              }}
              onTouchEnd={() => {
                flightInput.boost = false;
              }}
              className="w-14 h-14 rounded-full border-2 border-sky-400/60 bg-sky-500/25 active:bg-sky-500/50 flex flex-col items-center justify-center text-sky-300 active:text-white font-mono text-[10px] shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
            >
              <Flame className="w-5 h-5 text-sky-400" />
              <span>BOOST</span>
            </button>

            <button
              onTouchStart={() => {
                flightInput.brake = true;
              }}
              onTouchEnd={() => {
                flightInput.brake = false;
              }}
              className="w-14 h-14 rounded-full border-2 border-amber-500/60 bg-amber-500/25 active:bg-amber-500/50 flex flex-col items-center justify-center text-amber-300 active:text-white font-mono text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>BRAKE</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
