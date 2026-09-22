import React from 'react';
import { Rocket, CheckCircle2, ExternalLink, Github, Radio } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';

// Helper to compute rich planet-specific color theme tokens
function getPlanetTheme(planet: string, accentColor?: string) {
  const themes: Record<
    string,
    {
      primary: string;
      border: string;
      glow: string;
      surface: string;
      text: string;
      gradient: string;
    }
  > = {
    Mercury: {
      primary: '#94a3b8',
      border: 'rgba(148, 163, 184, 0.45)',
      glow: 'rgba(148, 163, 184, 0.35)',
      surface: 'rgba(15, 23, 42, 0.88)',
      text: '#cbd5e1',
      gradient: 'from-slate-600/40 via-slate-500/50 to-zinc-600/40',
    },
    Venus: {
      primary: '#fbbf24',
      border: 'rgba(251, 191, 36, 0.55)',
      glow: 'rgba(251, 191, 36, 0.38)',
      surface: 'rgba(28, 20, 6, 0.88)',
      text: '#fde68a',
      gradient: 'from-amber-600/45 via-yellow-500/50 to-amber-600/45',
    },
    Earth: {
      primary: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.55)',
      glow: 'rgba(56, 189, 248, 0.38)',
      surface: 'rgba(7, 17, 31, 0.88)',
      text: '#7dd3fc',
      gradient: 'from-sky-600/45 via-cyan-500/50 to-sky-600/45',
    },
    Mars: {
      primary: '#f97316',
      border: 'rgba(249, 115, 22, 0.6)',
      glow: 'rgba(249, 115, 22, 0.42)',
      surface: 'rgba(32, 13, 6, 0.9)',
      text: '#fdba74',
      gradient: 'from-orange-600/50 via-red-500/50 to-orange-600/50',
    },
    Jupiter: {
      primary: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.6)',
      glow: 'rgba(245, 158, 11, 0.42)',
      surface: 'rgba(30, 20, 7, 0.9)',
      text: '#fcd34d',
      gradient: 'from-amber-600/50 via-orange-500/50 to-amber-600/50',
    },
    Saturn: {
      primary: '#eab308',
      border: 'rgba(234, 179, 8, 0.6)',
      glow: 'rgba(234, 179, 8, 0.42)',
      surface: 'rgba(28, 24, 7, 0.9)',
      text: '#fef08a',
      gradient: 'from-yellow-600/50 via-amber-500/50 to-yellow-600/50',
    },
    Uranus: {
      primary: '#06b6d4',
      border: 'rgba(6, 182, 212, 0.6)',
      glow: 'rgba(6, 182, 212, 0.42)',
      surface: 'rgba(4, 25, 33, 0.9)',
      text: '#67e8f9',
      gradient: 'from-cyan-600/50 via-teal-500/50 to-cyan-600/50',
    },
    Neptune: {
      primary: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.6)',
      glow: 'rgba(59, 130, 246, 0.42)',
      surface: 'rgba(8, 18, 48, 0.9)',
      text: '#93c5fd',
      gradient: 'from-blue-600/50 via-indigo-500/50 to-blue-600/50',
    },
  };

  return (
    themes[planet] || {
      primary: accentColor || '#38bdf8',
      border: 'rgba(56, 189, 248, 0.55)',
      glow: 'rgba(56, 189, 248, 0.38)',
      surface: 'rgba(7, 17, 31, 0.88)',
      text: '#7dd3fc',
      gradient: 'from-sky-600/45 via-cyan-500/50 to-sky-600/45',
    }
  );
}

export function ProjectDossier() {
  const currentPlanet = useMissionStore((state) => state.currentPlanet);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const getActiveProject = useMissionStore((state) => state.getActiveProject);
  const guideMessage = useMissionStore((state) => state.guideMessage);

  const project = getActiveProject();

  if (!currentPlanet || !project) return null;

  const theme = getPlanetTheme(project.planet, project.accentColor);

  const handleLaunchShip = () => {
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { __launchShipFromOrbit?: () => void }).__launchShipFromOrbit
    ) {
      (window as unknown as { __launchShipFromOrbit?: () => void }).__launchShipFromOrbit?.();
    } else {
      selectPlanet(null);
    }
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
      {/* Top Left: Launch Ship / Resume Flight Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLaunchShip}
          style={{
            borderColor: theme.border,
            boxShadow: `0 0 20px ${theme.glow}`,
          }}
          className="pointer-events-auto group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-[#07111f]/90 hover:brightness-125 text-white font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer"
        >
          <Rocket
            className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform"
            style={{ color: theme.primary }}
          />
          <span className="font-bold">Launch Ship & Resume Flight</span>
          <span
            style={{ borderColor: theme.border, color: theme.text }}
            className="px-1.5 py-0.5 rounded bg-black/60 border text-[10px]"
          >
            [W]
          </span>
        </button>
      </div>

      {/* Middle/Right: Holographic Project Dossier Panel */}
      <div className="flex justify-end w-full">
        <div
          style={{
            borderColor: theme.border,
            boxShadow: `0 0 40px ${theme.glow}`,
            backgroundColor: theme.surface,
          }}
          className="pointer-events-auto max-w-lg w-full p-6 rounded-2xl hud-panel border overflow-y-auto max-h-[75vh]"
        >
          {/* Header */}
          <div
            style={{ borderColor: theme.border }}
            className="flex items-center justify-between pb-3 mb-4 border-b"
          >
            <span
              style={{ color: theme.primary }}
              className="text-[11px] font-mono tracking-widest font-semibold uppercase flex items-center gap-2"
            >
              <span
                style={{ backgroundColor: theme.primary }}
                className="w-2 h-2 rounded-full animate-pulse"
              />
              · PROJECT DOSSIER ·
            </span>
            <span
              style={{
                borderColor: theme.border,
                color: theme.text,
                backgroundColor: `${theme.primary}22`,
              }}
              className="px-2.5 py-0.5 rounded text-[10px] font-mono border font-bold"
            >
              {project.planet} System
            </span>
          </div>

          {/* Project Title & Subtitle */}
          <h2 className="text-2xl font-display font-bold text-slate-100 tracking-tight mb-1">
            {project.title}
          </h2>
          <p style={{ color: theme.text }} className="text-xs font-mono mb-4">
            {project.subtitle}
          </p>

          {/* Role */}
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Role
            </span>
            <span
              style={{ borderColor: theme.border }}
              className="text-xs font-medium text-slate-200 bg-slate-900/70 px-2.5 py-1 rounded border inline-block"
            >
              {project.role}
            </span>
          </div>

          {/* Technologies Badges */}
          <div className="mb-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Technologies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: `${theme.primary}15`,
                  }}
                  className="px-2 py-0.5 rounded text-[11px] font-mono border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Description
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {project.longDescription}
            </p>
          </div>

          {/* Key Features Checklist */}
          <div className="mb-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Key Features
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {project.features.map((feat) => (
                <div key={feat} className="flex items-start gap-1.5 text-slate-300">
                  <CheckCircle2
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: theme.primary }}
                  />
                  <span className="text-[11px] font-sans leading-tight">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    borderColor: theme.border,
                    backgroundColor: `${theme.primary}12`,
                  }}
                  className="p-2.5 rounded-lg border text-center"
                >
                  <div
                    style={{ color: theme.text }}
                    className="text-base font-bold font-display"
                  >
                    {metric.value}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions: Live Demo & GitHub */}
          <div
            style={{ borderColor: theme.border }}
            className="flex items-center gap-3 pt-3 border-t"
          >
            {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderColor: theme.primary,
                  backgroundColor: `${theme.primary}25`,
                  boxShadow: `0 0 15px ${theme.glow}`,
                }}
                className="flex-1 py-2.5 px-4 rounded-lg border hover:brightness-125 text-white font-mono text-xs text-center tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-mono text-xs text-center tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>GitHub</span>
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Primary Action: Launch Ship from Orbit */}
          <button
            onClick={handleLaunchShip}
            style={{
              borderColor: theme.primary,
              boxShadow: `0 0 30px ${theme.glow}`,
            }}
            className={`w-full mt-4 py-3 px-4 rounded-xl border bg-gradient-to-r ${theme.gradient} hover:brightness-125 text-white font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer group`}
          >
            <Rocket className="w-4 h-4 text-white group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform" />
            <span>Launch Ship & Resume Flight (Press W)</span>
          </button>
        </div>
      </div>

      {/* Bottom Center: Floating Orbit Status & Launch Banner */}
      <div className="flex justify-center w-full mt-2">
        <button
          onClick={handleLaunchShip}
          style={{
            borderColor: theme.border,
            boxShadow: `0 0 25px ${theme.glow}`,
          }}
          className="pointer-events-auto px-5 py-2.5 rounded-full border bg-slate-950/90 backdrop-blur-md text-slate-100 hover:text-white font-mono text-xs flex items-center gap-2.5 hover:scale-102 transition-all cursor-pointer group"
        >
          <span
            style={{ backgroundColor: theme.primary }}
            className="w-2.5 h-2.5 rounded-full animate-ping"
          />
          <span>
            {project.planet.toUpperCase()} ORBIT ACTIVE · Press{' '}
            <strong
              style={{ borderColor: theme.border, color: theme.text }}
              className="px-1.5 py-0.5 rounded bg-black/60 border font-bold"
            >
              W
            </strong>{' '}
            or{' '}
            <strong
              style={{ borderColor: theme.border, color: theme.text }}
              className="px-1.5 py-0.5 rounded bg-black/60 border font-bold"
            >
              SPACE
            </strong>{' '}
            to Start Ship
          </span>
          <Rocket
            style={{ color: theme.primary }}
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Bottom Left: Mission Guide Character Dialog */}
      <div className="flex items-end">
        <div
          style={{
            borderColor: theme.border,
            boxShadow: `0 0 25px ${theme.glow}`,
          }}
          className="pointer-events-auto max-w-md p-4 rounded-xl hud-panel border flex items-start gap-3.5"
        >
          <div className="relative shrink-0">
            <div
              style={{ borderColor: theme.primary }}
              className="w-12 h-12 rounded-full border-2 overflow-hidden bg-slate-900 shadow-md"
            >
              <img
                src="/goku.png"
                alt="Mission AI Guide"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span
              style={{ backgroundColor: theme.primary }}
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 animate-ping"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{ color: theme.primary }}
                className="text-[11px] font-display font-bold uppercase tracking-wider"
              >
                Your Guide
              </span>
              <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-sky-400" />
                COMMS ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {guideMessage || project.guideVoice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
