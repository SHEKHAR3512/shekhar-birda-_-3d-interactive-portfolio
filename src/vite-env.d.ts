/// <reference types="vite/client" />

declare module 'lucide-react' {
  import React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  export type LucideIcon = React.FC<LucideProps>;

  export const Activity: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const Award: LucideIcon;
  export const Bot: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Building: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCheck: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Clock: LucideIcon;
  export const CloudUpload: LucideIcon;
  export const Code2: LucideIcon;
  export const Compass: LucideIcon;
  export const Copy: LucideIcon;
  export const Cpu: LucideIcon;
  export const Database: LucideIcon;
  export const Download: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const FileCode: LucideIcon;
  export const FileDown: LucideIcon;
  export const FileText: LucideIcon;
  export const Film: LucideIcon;
  export const Video: LucideIcon;
  export const RotateCw: LucideIcon;
  export const Flame: LucideIcon;
  export const GitBranch: LucideIcon;
  export const Github: LucideIcon;
  export const Globe: LucideIcon;
  export const Globe2: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Heart: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Keyboard: LucideIcon;
  export const Layers: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Linkedin: LucideIcon;
  export const Mail: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Navigation: LucideIcon;
  export const Phone: LucideIcon;
  export const Radio: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Rocket: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Send: LucideIcon;
  export const Server: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sliders: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Terminal: LucideIcon;
  export const User: LucideIcon;
  export const Volume2: LucideIcon;
  export const VolumeX: LucideIcon;
  export const X: LucideIcon;
  export const Crosshair: LucideIcon;
  export const Eye: LucideIcon;
  export const Lock: LucideIcon;
  export const Moon: LucideIcon;
  export const Orbit: LucideIcon;
  export const Sun: LucideIcon;
  export const FastForward: LucideIcon;
  export const ListOrdered: LucideIcon;
  export const MapPin: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Wrench: LucideIcon;
  export const Zap: LucideIcon;
  export const Search: LucideIcon;
  export const Paperclip: LucideIcon;
  export const UserCheck: LucideIcon;
  export const BarChart3: LucideIcon;
  export const LifeBuoy: LucideIcon;
  export const Headphones: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Filter: LucideIcon;
  export const Minimize2: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Tag: LucideIcon;
  export const Archive: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Unlock: LucideIcon;

  const defaultExport: Record<string, LucideIcon>;
  export default defaultExport;
}
