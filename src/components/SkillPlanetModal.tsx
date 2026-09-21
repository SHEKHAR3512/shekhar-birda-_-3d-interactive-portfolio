import React from 'react';
import {
  X,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Code2,
  Mail,
  Award,
  Cpu,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillPlanet } from '../types';
import { sound } from '../utils/sound';

interface SkillPlanetModalProps {
  planet: SkillPlanet | null;
  onClose: () => void;
  onOpenContactForSkill: (skillDomain: string) => void;
}

export const SkillPlanetModal: React.FC<SkillPlanetModalProps> = ({
  planet,
  onClose,
  onOpenContactForSkill,
}) => {
  if (!planet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#080b13] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Luminous Top Ribbon */}
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${planet.color}, ${planet.accentColor || planet.color})`,
          }}
        />

        {/* Header with Title and Close Button */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{
                  backgroundColor: `${planet.color}20`,
                  color: planet.accentColor || planet.color,
                  border: `1px solid ${planet.color}50`,
                }}
              >
                <Cpu className="w-3 h-3" />
                {planet.domain}
              </span>

              {planet.moons && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  {planet.moons.length} Orbiting Sub-Modules
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight flex items-center gap-2">
              <span>{planet.name}</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">{planet.subtitle}</p>
          </div>

          <button
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Core Proficiencies & Mastery Grid */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Core Competencies & Battle-Tested Levels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {planet.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      {skill.highlight && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      {skill.name}
                    </span>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: planet.accentColor || planet.color }}
                    >
                      {skill.level}%
                    </span>
                  </div>

                  {/* Level Bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: planet.accentColor || planet.color,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">{skill.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Proven Production Architecture Feats */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Proven Production Architecture Feats
            </h3>
            <div className="space-y-2">
              {planet.architectureHighlights.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/70"
                >
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: planet.accentColor || planet.color }}
                  />
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Battle-Tested Code Patterns */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Battle-Tested Production Patterns
            </h3>
            <div className="space-y-1.5">
              {planet.productionPatterns.map((pat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-slate-950/30 px-3 py-2 rounded-xl border border-slate-800/50 text-xs font-mono text-slate-300"
                >
                  <span className="text-slate-500">›</span>
                  <span>{pat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Use Cases & Project Scopes */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Ideal Implementation Scenarios
            </h3>
            <div className="flex flex-wrap gap-2">
              {planet.recommendedUseCases.map((useCase, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-900/90 text-slate-300 border border-slate-800 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            Directly available for contract, consulting, or full-time roles
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenContactForSkill(planet.domain);
                sound.playClick();
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-950 hover:bg-white shadow-sm transition-all cursor-pointer active:scale-95 font-mono"
            >
              <Mail className="w-4 h-4 text-slate-950" />
              <span>Discuss {planet.domain} Needs</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            <button
              onClick={() => {
                onClose();
                sound.playClick();
              }}
              className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              Resume Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
