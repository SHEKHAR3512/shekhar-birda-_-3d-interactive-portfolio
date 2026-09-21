import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Heart,
  Award,
  CheckCircle2,
  Sparkles,
  Layers,
  Calendar,
  Building,
  Smartphone,
  Mail,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project } from '../types';
import { sound } from '../utils/sound';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onLikeProject: (projectId: string) => void;
  onOpenContactForProject?: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onLikeProject,
  onOpenContactForProject,
}) => {
  const [liked, setLiked] = useState(false);

  if (!project) return null;

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLikeProject(project.id);
      sound.playCoin();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0d0f17] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Color accent header banner */}
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${project.color}, ${project.accentColor || project.color})`,
          }}
        />

        {/* Header with Title and Close Button */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/40">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${project.color}20`,
                  color: project.accentColor || project.color,
                  border: `1px solid ${project.color}40`,
                }}
              >
                {project.category}
              </span>

              {project.badge && (
                <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  <Award className="w-3 h-3 text-amber-300" />
                  {project.badge}
                </span>
              )}

              <span className="text-[11px] font-mono text-slate-500">
                {project.company} • {project.period}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{project.subtitle}</p>
          </div>

          <button
            id="close-project-modal-btn"
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center"
              >
                <span
                  className="text-lg sm:text-xl font-black font-display tracking-tight"
                  style={{ color: project.accentColor || project.color }}
                >
                  {m.value}
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400 mt-0.5">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Project Overview</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
              {project.description}
            </p>
          </div>

          {/* Technical Contributions */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
              Key Technical Contributions
            </h3>
            <div className="space-y-2">
              {project.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60"
                >
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: project.accentColor || project.color }}
                  />
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
              Engineered With
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl text-xs font-mono font-medium bg-slate-900 text-slate-200 border border-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            id="like-project-btn"
            onClick={handleLike}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              liked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500 animate-bounce' : ''}`} />
            <span>{liked ? 'Endorsed!' : 'Endorse'}</span>
            <span className="text-xs font-mono opacity-80">({project.likes + (liked ? 1 : 0)})</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenContactForProject && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContactForProject(project.title);
                  sound.playClick();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-950 hover:bg-white transition-colors cursor-pointer active:scale-95 shadow-sm font-mono"
              >
                <Mail className="w-3.5 h-3.5 text-slate-950" />
                <span>Discuss Scope</span>
              </button>
            )}

            {project.links?.live && project.links.live !== '#' && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              id="resume-flight-modal-btn"
              onClick={() => {
                onClose();
                sound.playClick();
              }}
              className="px-3.5 py-2 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              Resume Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
