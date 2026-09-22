import React from 'react';
import {
  Compass,
  Rocket,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Keyboard,
  CheckCircle2
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';

interface TourStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Welcome to My Solar System',
    subtitle: 'The Universe of Shekhar\'s Work',
    description: 'The user\'s journey through the solar system is the portfolio navigation. Every planet in this system represents one of my production projects or engineering architectures.',
    icon: <Globe className="w-6 h-6 text-sky-400" />,
    badge: 'Solar System Overview'
  },
  {
    step: 2,
    title: 'Meet Your Spacecraft',
    subtitle: 'Full 3D Flight Control',
    description: 'You control Shekhar\'s explorer starfighter. Use W/A/S/D or Arrow keys to steer, Shift to Boost, and Space to Brake. On mobile, use the virtual touch joystick.',
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
    badge: 'Flight Mechanics'
  },
  {
    step: 3,
    title: 'Explore the Planets',
    subtitle: 'Proximity Orbital Detection',
    description: 'Fly your spacecraft close to any planet. As you enter its orbital range, your ship will automatically stabilize and unlock the Holographic Project Dossier.',
    icon: <Compass className="w-6 h-6 text-emerald-400" />,
    badge: 'Orbital Approach'
  },
  {
    step: 4,
    title: 'Discover Projects & Specs',
    subtitle: 'Holographic Project Dossiers',
    description: 'Inspect roles, technologies, features, and production metrics. Click Live Demo or GitHub. Discovered planets are marked and added to your persistent Mission Log.',
    icon: <CheckCircle2 className="w-6 h-6 text-sky-400" />,
    badge: 'Project Holograms'
  },
  {
    step: 5,
    title: 'Complete the Mission',
    subtitle: 'Collect All 8 Planetary Artifacts',
    description: 'Explore all 8 planets to unlock the Mission Complete celebration, full Project Archive, and recruiter recommendations. Prefer not to fly? Use Auto Pilot anytime!',
    icon: <Award className="w-6 h-6 text-purple-400" />,
    badge: 'Mission Progression'
  },
  {
    step: 6,
    title: 'You\'re Ready, Explorer!',
    subtitle: 'Thrusters Primed & Ready',
    description: 'Select your target planet from the navigation HUD, take flight, or engage Auto Pilot to begin your journey through Shekhar\'s engineering cosmos.',
    icon: <Sparkles className="w-6 h-6 text-sky-300" />,
    badge: 'Ready for Launch'
  }
];

export function OnbordaTour() {
  const showOnbordaTour = useMissionStore((state) => state.showOnbordaTour);
  const tourStep = useMissionStore((state) => state.tourStep);
  const setTourStep = useMissionStore((state) => state.setTourStep);
  const dismissTour = useMissionStore((state) => state.dismissTour);

  if (!showOnbordaTour) return null;

  const current = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isFirst = tourStep === 0;
  const isLast = tourStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    sound.playClick();
    if (isLast) {
      dismissTour();
    } else {
      setTourStep(tourStep + 1);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (!isFirst) {
      setTourStep(tourStep - 1);
    }
  };

  const handleSkip = () => {
    sound.playClick();
    dismissTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      {/* Onborda Tour Card */}
      <div className="relative max-w-md w-full p-6 sm:p-7 rounded-2xl hud-panel border border-sky-400/40 shadow-[0_0_50px_rgba(56,189,248,0.3)] text-slate-100">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-sky-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-sky-400 font-semibold">
              Onborda Guide · Step {current.step} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleSkip}
            title="Skip tour"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3 rounded-xl border border-sky-500/30 bg-slate-900/80 shadow-[0_0_15px_rgba(56,189,248,0.15)] shrink-0">
            {current.icon}
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono bg-sky-950/50 border border-sky-500/30 text-sky-300 mb-1">
              {current.badge}
            </span>
            <h3 className="text-xl font-display font-bold text-slate-100 tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs font-mono text-sky-400 mt-0.5">{current.subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
          {current.description}
        </p>

        {/* Keybindings indicator on Step 2 */}
        {current.step === 2 && (
          <div className="p-3 rounded-lg border border-sky-500/20 bg-slate-900/60 font-mono text-[11px] text-slate-300 mb-6 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Keyboard className="w-3.5 h-3.5" />
              <span>CONTROLS:</span>
            </span>
            <span>WASD · Shift (Boost) · Space (Brake)</span>
          </div>
        )}

        {/* Navigation Dots & Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-sky-500/15">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                onClick={() => setTourStep(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === tourStep ? 'w-5 bg-sky-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg border border-sky-400/50 bg-sky-500/20 hover:bg-sky-500/35 text-xs font-mono text-sky-200 hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer"
            >
              <span>{isLast ? 'Start Exploration' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
