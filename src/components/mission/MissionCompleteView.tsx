import React from 'react';
import { Award, Download, Mail, Github, Linkedin, X, CheckCircle, ExternalLink } from 'lucide-react';
import { MISSION_PROJECTS } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';

interface MissionCompleteViewProps {
  onClose: () => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export function MissionCompleteView({ onClose, onOpenResume, onOpenContact }: MissionCompleteViewProps) {
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const setActiveTab = useMissionStore((state) => state.setActiveTab);

  const handleInspectArtifact = (projectId: string) => {
    selectPlanet(projectId);
    setActiveTab('mission');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto animate-fadeIn select-none text-slate-100">
      {/* Top Bar with Close */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="p-2 rounded-lg border border-sky-500/30 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Center Banner */}
      <div className="flex flex-col items-center text-center my-4">
        {/* Golden Hexagon Insignia */}
        <div className="w-16 h-16 rounded-2xl border-2 border-amber-400 bg-amber-500/10 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-4 animate-bounce">
          <Award className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-100 mb-2">
          MISSION COMPLETE
        </h2>
        <p className="text-sm font-mono text-sky-300 max-w-lg">
          You&apos;ve explored my solar system and discovered all the projects.
          Thanks for being here!
        </p>
      </div>

      {/* Collected Project Artifacts Row */}
      <div className="my-6">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 text-center mb-4">
          Collected Project Artifacts
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-5xl mx-auto">
          {MISSION_PROJECTS.map((p) => (
            <div
              key={p.id}
              onClick={() => handleInspectArtifact(p.id)}
              className="p-3 rounded-xl border border-sky-500/25 bg-[#07111f]/80 hover:bg-sky-500/15 hover:border-sky-400 transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div
                className="w-10 h-10 rounded-full border mb-2 flex items-center justify-center shadow group-hover:scale-110 transition-transform"
                style={{
                  borderColor: p.accentColor,
                  backgroundColor: `${p.accentColor}22`,
                }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[11px] font-display font-bold text-slate-200 group-hover:text-sky-300 truncate w-full">
                {p.planet}
              </span>
              <span className="text-[9px] font-mono text-slate-400 truncate w-full">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Split: About Me & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full pt-6 border-t border-sky-500/15">
        {/* About Me Card */}
        <div className="p-6 rounded-2xl hud-panel border border-sky-500/25">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-semibold mb-2">
            About Me
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
            I&apos;m a React Native + React Web developer, passionate about building modern, scalable,
            and user-friendly applications. I love turning ideas into real products and constantly
            exploring new technologies.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Available for high-impact React & React Native engineering roles</span>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="p-6 rounded-2xl hud-panel border border-sky-500/25 flex flex-col justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-semibold mb-3">
            Quick Links
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenResume();
              }}
              className="p-2.5 rounded-lg border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="p-2.5 rounded-lg border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Me</span>
            </button>

            <a
              href="https://github.com/SHEKHAR3512"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/shekhar-birda-279763353/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
