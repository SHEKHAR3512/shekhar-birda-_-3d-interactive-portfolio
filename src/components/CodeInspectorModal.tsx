import React from 'react';
import { X, Sliders } from 'lucide-react';
import { sound } from '../utils/sound';

interface CodeInspectorModalProps {
  onClose: () => void;
  physicsSettings: {
    maxSpeed: number;
    acceleration: number;
    turnSpeed: number;
    jumpForce: number;
  };
  onUpdatePhysics: (settings: {
    maxSpeed: number;
    acceleration: number;
    turnSpeed: number;
    jumpForce: number;
  }) => void;
}

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({
  onClose,
  physicsSettings,
  onUpdatePhysics,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] border border-[#334155] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e293b] border border-[#475569] flex items-center justify-center text-[#f1f5f9]">
              <Sliders className="w-5 h-5 text-[#f1f5f9]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#f1f5f9] font-display">Antigravity Live Physics Tuner</h2>
              <p className="text-xs text-[#94a3b8]">Adjust vehicle parameters in real time for the 3D space flight</p>
            </div>
          </div>

          <button
            id="close-code-inspector-btn"
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Physics Tuning Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-[#1e293b]/70 border border-[#475569] p-4 rounded-2xl">
            <h3 className="text-sm font-bold text-[#f1f5f9]">Real-Time Flight & Drift Parameters</h3>
            <p className="text-xs text-slate-300 mt-1">
              Adjust vehicle dynamics in real time. All changes apply immediately to your 3D ship as you navigate the cosmos!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Max Speed */}
            <div className="bg-[#090d16]/70 p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Top Velocity</span>
                <span className="font-mono text-[#f1f5f9] font-bold">{physicsSettings.maxSpeed} units/s</span>
              </div>
              <input
                type="range"
                min={6}
                max={24}
                step={1}
                value={physicsSettings.maxSpeed}
                onChange={(e) =>
                  onUpdatePhysics({ ...physicsSettings, maxSpeed: Number(e.target.value) })
                }
                className="w-full accent-[#475569] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Controls top cruising speed before turbo boost.</p>
            </div>

            {/* Acceleration */}
            <div className="bg-[#090d16]/70 p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Acceleration Force</span>
                <span className="font-mono text-[#f1f5f9] font-bold">{physicsSettings.acceleration} m/s²</span>
              </div>
              <input
                type="range"
                min={8}
                max={35}
                step={1}
                value={physicsSettings.acceleration}
                onChange={(e) =>
                  onUpdatePhysics({ ...physicsSettings, acceleration: Number(e.target.value) })
                }
                className="w-full accent-[#475569] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Throttle responsiveness and launch burst from standstill.</p>
            </div>

            {/* Turn Sensitivity */}
            <div className="bg-[#090d16]/70 p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Turn Rate & Drift</span>
                <span className="font-mono text-[#f1f5f9] font-bold">{physicsSettings.turnSpeed} rad/s</span>
              </div>
              <input
                type="range"
                min={1.2}
                max={4.0}
                step={0.2}
                value={physicsSettings.turnSpeed}
                onChange={(e) =>
                  onUpdatePhysics({ ...physicsSettings, turnSpeed: Number(e.target.value) })
                }
                className="w-full accent-[#475569] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Steering sensitivity and tight cornering radius.</p>
            </div>

            {/* Jump Force */}
            <div className="bg-[#090d16]/70 p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Ramp Air Lift</span>
                <span className="font-mono text-[#f1f5f9] font-bold">{physicsSettings.jumpForce}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.1}
                value={physicsSettings.jumpForce}
                onChange={(e) =>
                  onUpdatePhysics({ ...physicsSettings, jumpForce: Number(e.target.value) })
                }
                className="w-full accent-[#475569] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Vertical airtime when launching off celestial ramps.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#334155] bg-[#090d16]/90 flex justify-end">
          <button
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] transition-colors cursor-pointer"
          >
            Close Tuner
          </button>
        </div>
      </div>
    </div>
  );
};
