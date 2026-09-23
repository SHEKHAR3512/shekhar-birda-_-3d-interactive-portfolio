/**
 * planets.ts - Planetary System Configuration & Scientific Specifications
 * 
 * Defines compressed gameplay coordinates, astronomical properties, and rendering
 * characteristics for all 10 major planetary bodies plus the Moon.
 */

export interface PlanetConfig {
  id: string;
  name: string;
  modelPath: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotationSpeed: number;
  atmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereScale?: number;
  clouds?: boolean;
  cloudSpeed?: number;
  nightTexture?: boolean;
  rings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  moons?: Array<{
    id: string;
    name: string;
    radius: number;
    dist: number;
    speed: number;
    color: string;
  }>;
  color: string;
  surfaceTextureType: 'mercury' | 'venus' | 'earth' | 'moon' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';
  description: string;
  discovered: boolean;
  projectId?: string;
}

export const SOLAR_PLANET_CONFIGS: PlanetConfig[] = [
  // 1. Mercury - Cratered rocky furnace
  {
    id: 'mercury',
    name: 'Mercury',
    modelPath: '/assets/space/planets/mercury/model.glb',
    radius: 1.1,
    orbitRadius: 18,
    orbitSpeed: 0.16,
    position: { x: 18, y: 0, z: 0 },
    rotationSpeed: 0.008,
    atmosphere: false,
    color: '#94a3b8',
    surfaceTextureType: 'mercury',
    description: 'The smallest planet in the Solar System and closest to the Sun. Surface heavily cratered, resembling Earth’s Moon with extreme temperature swings.',
    discovered: true,
    projectId: 'mercury-ui-lab',
  },

  // 2. Venus - Runaway greenhouse with dense sulphur atmosphere
  {
    id: 'venus',
    name: 'Venus',
    modelPath: '/assets/space/planets/venus/model.glb',
    radius: 1.4,
    orbitRadius: 28,
    orbitSpeed: 0.12,
    position: { x: 28, y: 0, z: 0 },
    rotationSpeed: -0.005, // Retrograde rotation
    atmosphere: true,
    atmosphereColor: '#fbbf24',
    atmosphereScale: 1.12,
    clouds: true,
    cloudSpeed: 0.012,
    color: '#fbbf24',
    surfaceTextureType: 'venus',
    description: 'Shrouded by opaque, highly reflective clouds of sulfuric acid. Venus possesses the hottest planetary surface in the Solar System.',
    discovered: true,
    projectId: 'venus-anna-travel',
  },

  // 3. Earth - Blue marble with dynamic clouds & Rayleigh atmosphere
  {
    id: 'earth',
    name: 'Earth',
    modelPath: '/assets/space/planets/earth/model.glb',
    radius: 1.5,
    orbitRadius: 38,
    orbitSpeed: 0.1,
    position: { x: 38, y: 0, z: 0 },
    rotationSpeed: 0.01,
    atmosphere: true,
    atmosphereColor: '#38bdf8',
    atmosphereScale: 1.14,
    clouds: true,
    cloudSpeed: 0.016,
    nightTexture: true,
    moons: [
      {
        id: 'moon',
        name: 'The Moon (Luna)',
        radius: 0.42,
        dist: 4.8,
        speed: 0.45,
        color: '#cbd5e1',
      },
    ],
    color: '#38bdf8',
    surfaceTextureType: 'earth',
    description: 'The cradle of humanity and the only astronomical object known to harbor life. Rich in liquid surface oceans, dynamic cloud formations, and nitrogen-oxygen atmosphere.',
    discovered: true,
    projectId: 'earth-schooly',
  },

  // 4. Mars - Rust-red iron oxide desert world
  {
    id: 'mars',
    name: 'Mars',
    modelPath: '/assets/space/planets/mars/model.glb',
    radius: 1.25,
    orbitRadius: 48,
    orbitSpeed: 0.08,
    position: { x: 48, y: 0, z: 0 },
    rotationSpeed: 0.009,
    atmosphere: true,
    atmosphereColor: '#f97316',
    atmosphereScale: 1.08,
    color: '#f97316',
    moons: [
      { id: 'phobos', name: 'Phobos', radius: 0.18, dist: 2.8, speed: 0.75, color: '#78716c' },
      { id: 'deimos', name: 'Deimos', radius: 0.14, dist: 3.8, speed: 0.55, color: '#a8a29e' },
    ],
    surfaceTextureType: 'mars',
    description: 'The Red Planet. Characterized by colossal shield volcanoes like Olympus Mons and vast canyon networks, with thin atmospheric dust veils.',
    discovered: true,
    projectId: 'mars-snibbl-food',
  },

  // 5. Jupiter - Colossal gas giant with Great Red Spot & Galilean moons
  {
    id: 'jupiter',
    name: 'Jupiter',
    modelPath: '/assets/space/planets/jupiter/model.glb',
    radius: 2.8,
    orbitRadius: 60,
    orbitSpeed: 0.05,
    position: { x: 60, y: 0, z: 0 },
    rotationSpeed: 0.02,
    atmosphere: true,
    atmosphereColor: '#f59e0b',
    atmosphereScale: 1.06,
    moons: [
      { id: 'io', name: 'Io', radius: 0.32, dist: 5.5, speed: 0.85, color: '#facc15' },
      { id: 'europa', name: 'Europa', radius: 0.28, dist: 7.2, speed: 0.65, color: '#e0f2fe' },
      { id: 'ganymede', name: 'Ganymede', radius: 0.45, dist: 9.2, speed: 0.45, color: '#94a3b8' },
    ],
    color: '#f59e0b',
    surfaceTextureType: 'jupiter',
    description: 'The giant of the Solar System, more than twice as massive as all other planets combined. Striped by dynamic zonal jets and turbulent storms.',
    discovered: true,
    projectId: 'jupiter-ecommerce',
  },

  // 6. Saturn - Majestic gas giant with luminous ice rings
  {
    id: 'saturn',
    name: 'Saturn',
    modelPath: '/assets/space/planets/saturn/model.glb',
    radius: 2.3,
    orbitRadius: 74,
    orbitSpeed: 0.04,
    position: { x: 74, y: 0, z: 0 },
    rotationSpeed: 0.015,
    atmosphere: true,
    atmosphereColor: '#fed7aa',
    atmosphereScale: 1.05,
    rings: true,
    ringInnerRadius: 3.2,
    ringOuterRadius: 6.2,
    ringColor: '#fed7aa',
    moons: [
      { id: 'titan', name: 'Titan', radius: 0.44, dist: 8.5, speed: 0.42, color: '#fdba74' },
      { id: 'enceladus', name: 'Enceladus', radius: 0.22, dist: 5.0, speed: 0.72, color: '#f8fafc' },
    ],
    color: '#fed7aa',
    surfaceTextureType: 'saturn',
    description: 'Distinguished by an extensive, complex ring system consisting of billions of pristine water-ice particles and silicates.',
    discovered: true,
    projectId: 'saturn-portfolio-3d',
  },

  // 7. Uranus - Cyan aquamarine ice giant with tilted axis
  {
    id: 'uranus',
    name: 'Uranus',
    modelPath: '/assets/space/planets/uranus/model.glb',
    radius: 1.8,
    orbitRadius: 88,
    orbitSpeed: 0.03,
    position: { x: 88, y: 0, z: 0 },
    rotationSpeed: -0.01,
    atmosphere: true,
    atmosphereColor: '#38bdf8',
    atmosphereScale: 1.06,
    rings: true,
    ringInnerRadius: 2.4,
    ringOuterRadius: 3.2,
    ringColor: '#38bdf8',
    color: '#38bdf8',
    surfaceTextureType: 'uranus',
    description: 'An ice giant with an extreme axial tilt of 98 degrees, resulting in seasonal variations unlike any other planet in the system.',
    discovered: true,
    projectId: 'uranus-edu-match',
  },

  // 8. Neptune - Deep azure storm giant
  {
    id: 'neptune',
    name: 'Neptune',
    modelPath: '/assets/space/planets/neptune/model.glb',
    radius: 1.75,
    orbitRadius: 100,
    orbitSpeed: 0.02,
    position: { x: 100, y: 0, z: 0 },
    rotationSpeed: 0.012,
    atmosphere: true,
    atmosphereColor: '#3b82f6',
    atmosphereScale: 1.07,
    moons: [
      { id: 'triton', name: 'Triton', radius: 0.36, dist: 5.2, speed: -0.5, color: '#bfdbfe' },
    ],
    color: '#3b82f6',
    surfaceTextureType: 'neptune',
    description: 'The most distant major planet in the Solar System. Noted for dark supersonic storms, vivid methane blue atmosphere, and high-altitude cirrus clouds.',
    discovered: true,
    projectId: 'neptune-mybooky',
  },

  // 9. Pluto - Kuiper belt icy world with nitrogen plains
  {
    id: 'pluto',
    name: 'Pluto',
    modelPath: '/assets/space/planets/pluto/model.glb',
    radius: 0.65,
    orbitRadius: 114,
    orbitSpeed: 0.015,
    position: { x: 114, y: 0, z: 0 },
    rotationSpeed: 0.006,
    atmosphere: true,
    atmosphereColor: '#e2e8f0',
    atmosphereScale: 1.08,
    moons: [
      { id: 'charon', name: 'Charon', radius: 0.32, dist: 2.2, speed: 0.38, color: '#94a3b8' },
    ],
    color: '#e2e8f0',
    surfaceTextureType: 'pluto',
    description: 'A dwarf planet in the Kuiper Belt with vast nitrogen-ice plains (Sputnik Planitia), water-ice mountain ranges, and complex hydrocarbon tholins.',
    discovered: false,
    projectId: undefined,
  },
];
