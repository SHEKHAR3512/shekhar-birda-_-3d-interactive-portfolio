export interface Project {
  id: string;
  title: string;
  category: 'Mobile App' | 'Web Platform' | 'Enterprise UI';
  subtitle: string;
  period: string;
  company: string;
  tagline: string;
  description: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  techStack: string[];
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
  color: string;
  accentColor: string;
  badge: string;
  worldPosition: [number, number, number]; // [x, y, z] in 3D world
  likes: number;
  solarPlanet?: string;
  orbitRadius?: number;
  orbitSpeed?: number;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; iconName?: string; highlight?: boolean }[];
}

export interface GuestbookMessage {
  id: string;
  author: string;
  role?: string;
  message: string;
  timestamp: number;
  avatarColor: string;
  rating?: number;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  createdAt?: number;
  status?: 'unread' | 'read' | 'replied';
}

export interface CollectibleItem {
  id: string;
  name: string;
  type: 'skill' | 'gem' | 'trophy';
  position: [number, number, number];
  collected: boolean;
  color: string;
  points: number;
}

export interface SkillPlanet {
  id: string;
  name: string;
  domain: string;
  subtitle: string;
  color: string;
  accentColor: string;
  size: number;
  worldPosition: [number, number, number];
  skills: { name: string; level: number; note: string; highlight?: boolean }[];
  architectureHighlights: string[];
  productionPatterns: string[];
  recommendedUseCases: string[];
  hasRings?: boolean;
  ringColor?: string;
  solarPlanet?: string;
  orbitRadius?: number;
  orbitSpeed?: number;
  moons?: { name: string; distance: number; speed: number; size: number; color: string }[];
}

export interface SuggestionBlueprint {
  id: string;
  category: string;
  title: string;
  badge: string;
  description: string;
  recommendedStack: string[];
  estimatedTimeline: string;
  keyDeliverables: string[];
  referenceProjectTitle: string;
  referenceProjectId: string;
}

export type CelestialTarget =
  | { type: 'project'; data: Project }
  | { type: 'skill'; data: SkillPlanet };

export type ViewMode = '3d' | 'executive';

export type CameraView = 'follow' | 'isometric' | 'topDown' | 'cinema';
