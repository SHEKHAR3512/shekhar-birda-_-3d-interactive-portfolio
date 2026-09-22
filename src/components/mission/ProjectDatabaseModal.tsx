import React from 'react';
import { X, ExternalLink, Github, Rocket, Eye, CheckCircle2 } from 'lucide-react';
import { MISSION_PROJECTS, MissionProject } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';

interface ProjectDatabaseModalProps {
  onClose: () => void;
  onOpenDossier: (projectId: string) => void;
}

export function ProjectDatabaseModal({ onClose, onOpenDossier }: ProjectDatabaseModalProps) {
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const setTargetPlanet = useMissionStore((state) => state.setTargetPlanet);
  const toggleAutopilot = useMissionStore((state) => state.toggleAutopilot);
  const enterSolarSystem = useMissionStore((state) => state.enterSolarSystem);
  const discoveredPlanets = useMissionStore((state) => state.discoveredPlanets);

  const handleAutopilotToPlanet = (project: MissionProject) => {
    sound.playClick();
    setTargetPlanet(project.id);
    toggleAutopilot(true);
    enterSolarSystem();
    onClose();
  };

  const handleInstantDossier = (project: MissionProject) => {
    sound.playClick();
    selectPlanet(project.id);
    onOpenDossier(project.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-4xl w-full max-h-[85vh] rounded-3xl hud-panel border border-sky-500/35 shadow-[0_0_50px_rgba(56,189,248,0.3)] flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sky-500/20 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Accessibility Project Directory</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-100 tracking-tight">
              Project Database · 8 Systems
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 font-sans">
          {MISSION_PROJECTS.map((project) => {
            const isDiscovered = discoveredPlanets.includes(project.id);

            return (
              <div
                key={project.id}
                className="p-4 sm:p-5 rounded-2xl border border-sky-500/20 bg-slate-900/50 hover:bg-slate-900/80 hover:border-sky-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                      {project.planet} System
                    </span>
                    {isDiscovered && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.2 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        DISCOVERED
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-display font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mb-2">
                    {project.role} · <strong className="text-slate-300">{project.company}</strong>
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 font-sans mb-3">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions: View Holographic Dossier & Autopilot */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleInstantDossier(project)}
                    className="flex-1 sm:flex-none w-full py-2 px-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900 text-slate-200 font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>View Dossier</span>
                  </button>

                  <button
                    onClick={() => handleAutopilotToPlanet(project)}
                    className="flex-1 sm:flex-none w-full py-2 px-3.5 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  >
                    <Rocket className="w-3.5 h-3.5 text-sky-400" />
                    <span>Autopilot to Planet</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
