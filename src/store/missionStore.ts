import { create } from 'zustand';
import { MISSION_PROJECTS, MissionProject } from '../data/projects';

export type ExperienceMode = 'resume' | 'mission-boot' | 'solar-system';
export type MissionStatus = 'not-started' | 'active' | 'completed';
export type ThemeMode = 'dark' | 'light';
export type ActiveTab = 'resume' | 'mission' | 'projects' | 'contact';
export type CameraMode = 'flight' | 'orbit' | 'cinematic' | 'isometric' | 'chart';

export interface HoverCoords {
  x: number;
  y: number;
}

export interface MissionLogEntry {
  id: string;
  date: string;
  planet: string;
  title: string;
}

export interface ScannedObject {
  id: string;
  name: string;
  type: 'Planet' | 'Space Station' | 'Relay Beacon' | 'Asteroid Anomaly' | 'Traffic Vessel';
  distance: number;
  description: string;
  actionPrompt?: string;
  coords: { x: number; y: number; z: number };
}

export interface CosmicEventNotice {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'alert' | 'discovery';
  timestamp: number;
}

interface MissionState {
  currentExperience: ExperienceMode;
  missionStatus: MissionStatus;
  currentPlanet: string | null;
  targetPlanet: string | null;
  hoveredPlanet: string | null;
  hoverCoords: HoverCoords | null;
  discoveredPlanets: string[];
  completedProjects: string[];
  isAutopilot: boolean;
  theme: ThemeMode;
  activeTab: ActiveTab;
  cameraMode: CameraMode;
  cockpitFrameVisible: boolean;
  showOnbordaTour: boolean;
  tourStep: number;
  missionLog: MissionLogEntry[];
  guideMessage: string | null;

  // Scanner & Deep Space Telemetry
  isScanning: boolean;
  scanResults: ScannedObject[];
  nearbyInteractable: ScannedObject | null;
  activeEventNotice: CosmicEventNotice | null;

  // Computed/Helper getters
  getDiscoveredCount: () => number;
  getCompletedCount: () => number;
  getActiveProject: () => MissionProject | null;
  getTargetProject: () => MissionProject | null;

  // Actions
  launchMission: () => void;
  enterSolarSystem: () => void;
  returnToResume: () => void;
  selectPlanet: (planetId: string | null) => void;
  setTargetPlanet: (planetId: string | null) => void;
  toggleAutopilot: (enabled?: boolean) => void;
  hoverPlanet: (planetId: string | null, coords?: HoverCoords | null) => void;
  discoverPlanet: (planetId: string) => void;
  completeProject: (planetId: string) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  toggleCockpitFrame: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setGuideMessage: (message: string | null) => void;
  dismissTour: () => void;
  restartTour: () => void;
  setTourStep: (step: number) => void;
  // Scanner & Deep Space Actions
  triggerScanner: () => void;
  setNearbyInteractable: (obj: ScannedObject | null) => void;
  setScanResults: (results: ScannedObject[]) => void;
  triggerCosmicEvent: (notice: CosmicEventNotice | null) => void;
  resetMission: () => void;
}

const STORAGE_KEY_DISCOVERED = 'shekhar_space_discovered';
const STORAGE_KEY_COMPLETED = 'shekhar_space_completed';
const STORAGE_KEY_THEME = 'shekhar_space_theme';
const STORAGE_KEY_TOUR_SEEN = 'shekhar_space_tour_seen';

const getInitialDiscovered = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISCOVERED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

const getInitialTourSeen = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY_TOUR_SEEN) === 'true';
  } catch {
    return false;
  }
};

export const useMissionStore = create<MissionState>((set, get) => ({
  currentExperience: 'resume', // Default to Resume First!
  missionStatus: 'not-started',
  currentPlanet: null,
  targetPlanet: 'mars-snibbl-food', // Default target guidance
  hoveredPlanet: null,
  hoverCoords: null,
  discoveredPlanets: getInitialDiscovered(),
  completedProjects: ['mercury-ui-lab', 'venus-anna-travel', 'earth-schooly'],
  isAutopilot: false,
  theme: getInitialTheme(),
  activeTab: 'resume',
  cameraMode: 'flight',
  cockpitFrameVisible: true,
  showOnbordaTour: !getInitialTourSeen(),
  tourStep: 0,
  missionLog: [
    { id: 'log-1', date: '21 SEP', planet: 'Earth', title: 'Schooly App platform verified' },
    { id: 'log-2', date: '21 SEP', planet: 'Venus', title: 'Anna Travel booking engine calibrated' },
    { id: 'log-3', date: '22 SEP', planet: 'Mars', title: 'Snibbl Food surplus network discovered' }
  ],
  guideMessage: "Welcome aboard, Explorer. Your starfighter is calibrated. Fly towards any planet or engage Auto Pilot to inspect project telemetry.",

  // Scanner & Deep Space State
  isScanning: false,
  scanResults: [],
  nearbyInteractable: null,
  activeEventNotice: null,

  triggerScanner: () => {
    set({ isScanning: true });
    setTimeout(() => {
      set({ isScanning: false });
    }, 1800);
  },
  setNearbyInteractable: (obj) => set({ nearbyInteractable: obj }),
  setScanResults: (results) => set({ scanResults: results }),
  triggerCosmicEvent: (notice) => set({ activeEventNotice: notice }),

  getDiscoveredCount: () => get().discoveredPlanets.length,
  getCompletedCount: () => get().completedProjects.length,
  getActiveProject: () => {
    const id = get().currentPlanet;
    if (!id) return null;
    return MISSION_PROJECTS.find((p) => p.id === id) || null;
  },
  getTargetProject: () => {
    const id = get().targetPlanet;
    if (!id) return null;
    return MISSION_PROJECTS.find((p) => p.id === id) || null;
  },

  launchMission: () => {
    set({
      currentExperience: 'mission-boot',
      missionStatus: 'active',
      activeTab: 'mission',
    });
  },

  enterSolarSystem: () => {
    set({
      currentExperience: 'solar-system',
      activeTab: 'mission',
      cameraMode: 'flight',
      guideMessage: "Solar navigation online. Use W/A/S/D to steer, Shift to Boost, or click [Auto Pilot] to jump directly.",
    });
  },

  returnToResume: () => {
    set({
      currentExperience: 'resume',
      activeTab: 'resume',
    });
  },

  selectPlanet: (planetId: string | null) => {
    if (!planetId) {
      set({
        currentPlanet: null,
        cameraMode: 'flight',
        guideMessage: "Disengaged orbit. Resuming free flight in Sol System.",
      });
      return;
    }

    const project = MISSION_PROJECTS.find((p) => p.id === planetId);
    const alreadyDiscovered = get().discoveredPlanets.includes(planetId);
    let updatedDiscovered = get().discoveredPlanets;

    if (!alreadyDiscovered) {
      updatedDiscovered = [...updatedDiscovered, planetId];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_DISCOVERED, JSON.stringify(updatedDiscovered));
        } catch {
          // ignore
        }
      }
      // Add entry to mission log
      if (project) {
        const newEntry: MissionLogEntry = {
          id: `log-${Date.now()}`,
          date: 'TODAY',
          planet: project.planet,
          title: `${project.name} discovered & logged`,
        };
        set((state) => ({
          missionLog: [newEntry, ...state.missionLog],
        }));
      }
    }

    const isAllDiscovered = updatedDiscovered.length >= MISSION_PROJECTS.length;

    set({
      currentPlanet: planetId,
      targetPlanet: planetId,
      discoveredPlanets: updatedDiscovered,
      missionStatus: isAllDiscovered ? 'completed' : 'active',
      cameraMode: 'orbit',
      isAutopilot: false, // Disengage autopilot once arrived
      guideMessage: project?.guideVoice || `Entered orbit around ${project?.planet}. Inspecting dossier.`,
    });
  },

  setTargetPlanet: (planetId: string | null) => {
    set({ targetPlanet: planetId });
  },

  toggleAutopilot: (enabled?: boolean) => {
    set((state) => {
      const next = enabled !== undefined ? enabled : !state.isAutopilot;
      const targetProj = state.getTargetProject();
      return {
        isAutopilot: next,
        guideMessage: next
          ? `Auto Pilot engaged. Navigating to ${targetProj ? targetProj.planet : 'selected planet'}...`
          : "Auto Pilot disengaged. Manual flight controls restored.",
      };
    });
  },

  hoverPlanet: (planetId: string | null, coords?: HoverCoords | null) => {
    set({
      hoveredPlanet: planetId,
      hoverCoords: coords !== undefined ? coords : null,
    });
  },

  discoverPlanet: (planetId: string) => {
    const { discoveredPlanets } = get();
    if (!discoveredPlanets.includes(planetId)) {
      const next = [...discoveredPlanets, planetId];
      set({ discoveredPlanets: next });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_DISCOVERED, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
    }
  },

  completeProject: (planetId: string) => {
    const { completedProjects } = get();
    if (!completedProjects.includes(planetId)) {
      const next = [...completedProjects, planetId];
      set({ completedProjects: next });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
    }
  },

  setTheme: (theme: ThemeMode) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_THEME, theme);
      } catch {
        // ignore
      }
    }
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setActiveTab: (activeTab: ActiveTab) => {
    set({ activeTab });
    if (activeTab === 'resume') {
      get().returnToResume();
    } else if (activeTab === 'mission') {
      if (get().currentExperience === 'resume') {
        get().launchMission();
      }
    }
  },

  toggleCockpitFrame: () => {
    set((state) => ({ cockpitFrameVisible: !state.cockpitFrameVisible }));
  },

  setCameraMode: (cameraMode: CameraMode) => {
    set({ cameraMode });
  },

  setGuideMessage: (guideMessage: string | null) => {
    set({ guideMessage });
  },

  dismissTour: () => {
    set({ showOnbordaTour: false });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_TOUR_SEEN, 'true');
      } catch {
        // ignore
      }
    }
  },

  restartTour: () => {
    set({ showOnbordaTour: true, tourStep: 0 });
  },

  setTourStep: (tourStep: number) => {
    set({ tourStep });
  },

  resetMission: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_DISCOVERED);
        localStorage.removeItem(STORAGE_KEY_COMPLETED);
        localStorage.removeItem(STORAGE_KEY_TOUR_SEEN);
      } catch {
        // ignore
      }
    }
    set({
      currentExperience: 'resume',
      missionStatus: 'not-started',
      currentPlanet: null,
      targetPlanet: 'mars-snibbl-food',
      hoveredPlanet: null,
      discoveredPlanets: [],
      isAutopilot: false,
      showOnbordaTour: true,
      tourStep: 0,
      guideMessage: "Mission reset. System recalibrated.",
    });
  },
}));
