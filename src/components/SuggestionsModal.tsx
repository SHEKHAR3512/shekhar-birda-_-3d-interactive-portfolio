import React, { useState } from 'react';
import {
  X,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  Cpu,
  Clock,
  Code2,
  Mail,
  MessageSquare,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUGGESTION_BLUEPRINTS, PERSONAL_INFO } from '../data/portfolioData';
import { SuggestionBlueprint } from '../types';
import { sound } from '../utils/sound';

interface SuggestionsModalProps {
  onClose: () => void;
  onSelectProjectRef: (projectId: string) => void;
  onOpenContact: (prefillSubject?: string, prefillBody?: string) => void;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  onClose,
  onSelectProjectRef,
  onOpenContact,
}) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<SuggestionBlueprint>(
    SUGGESTION_BLUEPRINTS[0]
  );
  const [customGoal, setCustomGoal] = useState<'mobile' | 'web' | 'perf' | 'hire' | 'custom'>('mobile');
  const [userSuggestionText, setUserSuggestionText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Dynamic recommendation based on selection
  const handleConsultProposal = (bp: SuggestionBlueprint) => {
    const subject = `Engineering Project: ${bp.title}`;
    const body = `Hi Shekhar,\n\nI was exploring your 3D space portfolio and reviewed the blueprint for "${bp.title}".\n\nI'd like to discuss bringing your expertise on board for our requirements.\n\nKey Scope Details:\n- Recommended Stack: ${bp.recommendedStack.join(', ')}\n- Estimated Timeline: ${bp.estimatedTimeline}\n\nLet's connect soon.\n\nBest regards,\n`;
    onClose();
    onOpenContact(subject, body);
  };

  const handleCustomFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSuggestionText.trim()) return;
    sound.playCollect();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setUserSuggestionText('');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#080b13] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Luminous Top Ribbon */}
        <div className="h-1.5 w-full bg-slate-700" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-slate-400" />
                Engineering Advisor & Scope Estimator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                Active Blueprints
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight flex items-center gap-2">
              <span>Tailored Solutions & Architecture Blueprints</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Select an archetype to inspect Shekhar’s recommended architecture, timeline, and verified project case studies.
            </p>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Blueprint Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUGGESTION_BLUEPRINTS.map((bp) => {
              const isSelected = selectedBlueprint.id === bp.id;
              return (
                <button
                  key={bp.id}
                  onClick={() => {
                    setSelectedBlueprint(bp);
                    sound.playClick();
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[82px] ${
                    isSelected
                      ? 'bg-slate-900 border-slate-500 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 line-clamp-1">
                    {bp.category}
                  </div>
                  <div
                    className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {bp.title}
                  </div>
                  <div className="text-[9px] font-mono mt-1 text-slate-500">{bp.estimatedTimeline}</div>
                </button>
              );
            })}
          </div>

          {/* Active Blueprint Detail Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {selectedBlueprint.badge}
                </span>
                <h3 className="text-xl font-black text-white font-display mt-1.5">
                  {selectedBlueprint.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline: {selectedBlueprint.estimatedTimeline}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedBlueprint.description}
            </p>

            {/* Recommended Tech Stack */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Recommended Architecture & Technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedBlueprint.recommendedStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 text-slate-200 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Deliverables */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Guaranteed Deliverables
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedBlueprint.keyDeliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60"
                  >
                    <span className="text-slate-300 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Project link & action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">Proof of Concept:</span>
                <button
                  onClick={() => {
                    onClose();
                    onSelectProjectRef(selectedBlueprint.referenceProjectId);
                    sound.playClick();
                  }}
                  className="text-xs font-bold text-slate-200 hover:text-white underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  {selectedBlueprint.referenceProjectTitle}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => handleConsultProposal(selectedBlueprint)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-950 hover:bg-white shadow-sm transition-all cursor-pointer active:scale-95 font-mono"
              >
                <Mail className="w-3.5 h-3.5 text-slate-950" />
                <span>Request Scope Proposal</span>
              </button>
            </div>
          </div>

          {/* Visitor Suggestion / Idea Box */}
          <div className="bg-slate-950/50 border border-slate-800/70 rounded-2xl p-5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              Have a Project Idea or Constructive Suggestion?
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Leave a quick thought, architectural question, or idea directly for Shekhar.
            </p>

            {submittedFeedback ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! Your feedback has been transmitted to Shekhar.</span>
              </div>
            ) : (
              <form onSubmit={handleCustomFeedbackSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={userSuggestionText}
                  onChange={(e) => setUserSuggestionText(e.target.value)}
                  placeholder="e.g., 'Would love to see an offline GraphQL sync module on Planet Mobile' or 'Need advice on React Native Expo EAS'"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-600 font-mono"
                />
                <button
                  type="submit"
                  disabled={!userSuggestionText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Direct Developer Line: <span className="text-slate-200">{PERSONAL_INFO.email}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Close Advisor
          </button>
        </div>
      </div>
    </div>
  );
};
