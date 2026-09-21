import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Project, CollectibleItem, CameraView, SkillPlanet } from '../types';
import { sound } from '../utils/sound';

interface ThreeCanvasProps {
  projects: Project[];
  skillPlanets: SkillPlanet[];
  collectibles: CollectibleItem[];
  activeProject: Project | null;
  activeSkillPlanet: SkillPlanet | null;
  onSelectProject: (p: Project | null) => void;
  onSelectSkillPlanet: (s: SkillPlanet | null) => void;
  onCollectItem: (id: string) => void;
  cameraView: CameraView;
  isNightMode: boolean;
  onUpdateSpeed: (speed: number) => void;
  onUpdateCarPosition: (pos: [number, number]) => void;
  carInputRef: React.MutableRefObject<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    turbo: boolean;
    brake: boolean;
  }>;
  resetTrigger: number;
  warpTarget?: { x: number; y: number; z: number } | null;
}

// Procedural Solar System Planetary Surface Generator
function createSolarPlanetTexture(solarPlanet: string, baseHex: string, accentHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const name = (solarPlanet || '').toLowerCase();

  if (name.includes('mercury')) {
    // Rocky cratered slate surface
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dark impact craters
    ctx.fillStyle = '#475569';
    for (let i = 0; i < 45; i++) {
      const cx = (i * 47) % canvas.width;
      const cy = (i * 31) % canvas.height;
      const r = 6 + (i % 7) * 5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // High-albedo impact rays
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 18; i++) {
      const cx = (i * 61) % canvas.width;
      const cy = (i * 37) % canvas.height;
      ctx.strokeRect(cx, cy, 10, 10);
    }
  } else if (name.includes('venus')) {
    // Dense golden sulfur swirling clouds
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 3) {
      const alpha = 0.25 + 0.35 * Math.sin(y * 0.08);
      ctx.fillStyle = '#fef08a';
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, y, canvas.width, 3);
    }
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.ellipse((i * 65) % canvas.width, 40 + i * 18, 55, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (name.includes('earth')) {
    // Deep royal blue oceans
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Lush green continents
    ctx.fillStyle = '#15803d';
    ctx.globalAlpha = 0.9;
    for (let i = 0; i < 20; i++) {
      const cx = (i * 53) % canvas.width;
      const cy = 40 + ((i * 43) % 170);
      const r = 22 + (i % 6) * 14;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Arid deserts
    ctx.fillStyle = '#ca8a04';
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 8; i++) {
      const cx = (i * 89) % canvas.width;
      const cy = 60 + ((i * 27) % 130);
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (name.includes('mars')) {
    // Rust-red desert terrain
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Volcanic basalt regions (Syrtis Major)
    ctx.fillStyle = '#7c2d12';
    ctx.globalAlpha = 0.65;
    for (let i = 0; i < 24; i++) {
      const cx = (i * 43) % canvas.width;
      const cy = 40 + ((i * 31) % 170);
      ctx.beginPath();
      ctx.arc(cx, cy, 18 + (i % 5) * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    // Polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.95;
    ctx.fillRect(0, 0, canvas.width, 22);
    ctx.fillRect(0, canvas.height - 22, canvas.width, 22);
  } else if (name.includes('jupiter')) {
    // Alternating caramel, ochre, cream atmospheric bands
    const bands = ['#78350f', '#d97706', '#fef3c7', '#b45309', '#fde68a', '#92400e'];
    for (let y = 0; y < canvas.height; y += 8) {
      ctx.fillStyle = bands[Math.floor(y / 8) % bands.length];
      ctx.globalAlpha = 0.9;
      ctx.fillRect(0, y, canvas.width, 8);
    }
    // Great Red Spot Oval Vortex
    ctx.fillStyle = '#dc2626';
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.ellipse(340, 160, 46, 26, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (name.includes('saturn')) {
    // Warm golden-honey atmospheric bands
    const bands = ['#ca8a04', '#eab308', '#fef08a', '#a16207', '#facc15'];
    for (let y = 0; y < canvas.height; y += 6) {
      ctx.fillStyle = bands[Math.floor(y / 6) % bands.length];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(0, y, canvas.width, 6);
    }
  } else if (name.includes('uranus')) {
    // Pale cyan-aquamarine icy sphere
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#67e8f9');
    grad.addColorStop(0.5, '#22d3ee');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (name.includes('neptune')) {
    // Deep royal azure blue with atmospheric storms
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1d4ed8');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(1, '#1e40af');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dark storm vortex
    ctx.fillStyle = '#0f172a';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.ellipse(200, 110, 36, 20, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // High-altitude cirrus streaks
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 85, canvas.width, 5);
  } else if (name.includes('pluto')) {
    // Charcoal-tan icy world with pale nitrogen heart glacier (Tombaugh Regio)
    ctx.fillStyle = '#78716c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f5f5f4';
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(220, 130, 38, 0, Math.PI * 2);
    ctx.arc(265, 130, 38, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Fallback
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = accentHex;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 50, canvas.width, 30);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Earth Clouds Texture Generator
function createEarthCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.5;

  for (let i = 0; i < 28; i++) {
    const cx = (i * 37) % canvas.width;
    const cy = 20 + ((i * 47) % 210);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 60, 14, 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural cosmic nebula controller with reduced-frequency texture updates
interface ProceduralNebulaController {
  texture: THREE.CanvasTexture;
  update: (nowMs: number) => void;
  dispose: () => void;
}

function createProceduralNebulaController(): ProceduralNebulaController {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Base cosmic clouds configuration
  const baseClouds = [
    { bx: 110, by: 90, r: 120, color: 'rgba(30, 27, 75, 0.65)', speed: 0.3, phase: 0 },
    { bx: 190, by: 120, r: 100, color: 'rgba(2, 132, 199, 0.45)', speed: 0.4, phase: 1.2 },
    { bx: 360, by: 100, r: 130, color: 'rgba(74, 4, 78, 0.50)', speed: 0.25, phase: 2.1 },
    { bx: 430, by: 160, r: 110, color: 'rgba(14, 116, 144, 0.40)', speed: 0.35, phase: 3.4 },
    { bx: 260, by: 180, r: 110, color: 'rgba(49, 46, 129, 0.50)', speed: 0.28, phase: 4.5 },
    { bx: 80, by: 190, r: 90, color: 'rgba(88, 28, 135, 0.45)', speed: 0.42, phase: 0.8 },
    { bx: 310, by: 75, r: 80, color: 'rgba(56, 189, 248, 0.30)', speed: 0.5, phase: 1.9 },
    { bx: 460, by: 70, r: 95, color: 'rgba(30, 58, 138, 0.50)', speed: 0.32, phase: 2.7 },
  ];

  const renderClouds = (timeSec: number) => {
    // Deep interstellar space void
    ctx.fillStyle = '#03050c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'screen';

    // Render drifting organic clouds
    baseClouds.forEach((c) => {
      const offsetX = Math.sin(timeSec * c.speed + c.phase) * 14;
      const offsetY = Math.cos(timeSec * c.speed * 0.8 + c.phase) * 8;
      const curX = c.bx + offsetX;
      const curY = c.by + offsetY;

      const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, c.r);
      grad.addColorStop(0, c.color);
      grad.addColorStop(0.5, c.color.replace(/[\d\.]+\)$/, '0.20)'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(curX, curY, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cosmic stardust splats
    for (let i = 0; i < 45; i++) {
      const sx = ((i * 43) + timeSec * 2) % canvas.width;
      const sy = (i * 61) % canvas.height;
      const sr = 8 + (i % 5) * 6;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      grad.addColorStop(0, 'rgba(199, 210, 254, 0.22)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    texture.needsUpdate = true;
  };

  // Initial render at startup
  renderClouds(0);

  // Throttled update timer: REDUCED FREQUENCY (e.g. 4 Hz / every 250ms instead of 60-120 FPS)
  let lastUpdateTime = 0;
  const UPDATE_INTERVAL_MS = 250;

  return {
    texture,
    update: (nowMs: number) => {
      if (nowMs - lastUpdateTime >= UPDATE_INTERVAL_MS) {
        lastUpdateTime = nowMs;
        renderClouds(nowMs * 0.001);
      }
    },
    dispose: () => {
      texture.dispose();
    },
  };
}

// Procedural Ring Texture Generator (e.g. Saturn with Cassini Division)
function createRingTexture(baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0.0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.12, baseColor);
  gradient.addColorStop(0.42, 'rgba(255,255,255,0.85)');
  gradient.addColorStop(0.5, 'rgba(0,0,0,0)'); // Cassini division
  gradient.addColorStop(0.62, baseColor);
  gradient.addColorStop(0.92, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, 1);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// In-World Floating Holographic Celestial Billboard
function createPlanetBillboard(title: string, subtitle: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Translucent Dark Pill Badge
  ctx.fillStyle = 'rgba(7, 10, 20, 0.88)';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 120, 24);
  ctx.fill();

  // Glowing boundary
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Primary Title
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 32px Orbitron, Rajdhani, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), 256, 60);

  // Subtitle
  ctx.fillStyle = colorHex;
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText(subtitle.toUpperCase(), 256, 98);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(7.5, 2.1, 1);
  return sprite;
}

// Smooth exponential lerp for frame-rate independence (60/120/144Hz)
const expLerp = (current: number, target: number, decay: number, dt: number) => {
  return target + (current - target) * Math.exp(-decay * dt);
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  projects,
  skillPlanets,
  collectibles,
  activeProject,
  activeSkillPlanet,
  onSelectProject,
  onSelectSkillPlanet,
  onCollectItem,
  cameraView,
  onUpdateSpeed,
  onUpdateCarPosition,
  carInputRef,
  resetTrigger,
  warpTarget,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Spaceship Starfighter
  const shipGroupRef = useRef<THREE.Group | null>(null);
  const thrusterPlumesRef = useRef<THREE.Mesh[]>([]);

  // Smooth kinematic flight state
  const flightState = useRef({
    x: 0,
    y: 2,
    z: 16,
    speed: 0,
    targetSpeed: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
  });

  // Autopilot glide state
  const autoGlideRef = useRef<{
    active: boolean;
    targetX: number;
    targetZ: number;
    targetY: number;
  } | null>(null);

  // Scanned planets hysteresis tracking
  const scannedPlanetsRef = useRef<Set<string>>(new Set());

  // Celestial groups
  const planetsGroupRef = useRef<THREE.Group | null>(null);
  const planetMeshesRef = useRef<
    Map<
      string,
      {
        group: THREE.Group;
        body: THREE.Mesh;
        type: 'project' | 'skill';
        data: any;
        orbitRadius: number;
        orbitSpeed: number;
        angle: number;
        billboard: THREE.Sprite;
        earthClouds?: THREE.Mesh;
        planetRadius: number;
        wireframeOverlay: THREE.Mesh;
        scanSweepRing: THREE.LineLoop;
        scanReticle: THREE.Group;
        ringWireframe?: THREE.Mesh;
      }
    >
  >(new Map());

  const moonMeshesRef = useRef<
    Array<{
      mesh: THREE.Mesh;
      parentGroup: THREE.Group;
      distance: number;
      speed: number;
      angle: number;
    }>
  >([]);

  const collectiblesGroupRef = useRef<THREE.Group | null>(null);
  const collectibleMeshesRef = useRef<Map<string, THREE.Group>>(new Map());

  // Starfield & Warp Particles
  const warpStreaksRef = useRef<THREE.LineSegments | null>(null);
  const nebulaMeshRef = useRef<THREE.Mesh | null>(null);
  const nebulaMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const starTrailsRef = useRef<{
    lineSegments: THREE.LineSegments;
    posAttr: THREE.BufferAttribute;
    positions: Float32Array;
    particles: Array<{
      x: number;
      y: number;
      z: number;
      speedMult: number;
      lengthMult: number;
    }>;
  } | null>(null);

  // Hover detection
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredIdRef = useRef<string | null>(null);

  // Initialize Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x03050c);
    scene.fog = new THREE.FogExp2(0x03050c, 0.0028);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1200);
    camera.position.set(0, 10, 26);
    cameraRef.current = camera;

    // RENDERER: Hardware-accelerated direct rendering for 60-120 FPS
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING: Central Solar Light & Ambient Space Fill
    const ambientLight = new THREE.AmbientLight(0x223355, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff7ed, 3.2, 450, 0.45);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(60, 40, 60);
    scene.add(rimLight);

    // ==========================================
    // 1. CENTRAL STAR: THE SUN (SOLAR CORE)
    // ==========================================
    const sunGroup = new THREE.Group();
    const sunGeo = new THREE.SphereGeometry(5.2, 36, 36);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfff0aa,
      map: createSolarPlanetTexture('sun', '#ffbb00', '#ff5500'),
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    // Coronal Glow Halo
    const coronaGeo = new THREE.SphereGeometry(6.2, 36, 36);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(coronaMesh);
    scene.add(sunGroup);

    // Central Sun Beacon Label
    const sunBillboard = createPlanetBillboard('THE SUN', 'Shekhar Birda • Central Core', '#f59e0b');
    sunBillboard.position.set(0, 8.5, 0);
    sunGroup.add(sunBillboard);

    // ==========================================
    // 2. PROCEDURAL DEEP SPACE NEBULA SHADER & DOME
    // ==========================================
    const nebulaGeo = new THREE.SphereGeometry(750, 32, 24);
    const nebulaController = createProceduralNebulaController();
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        uNebulaTex: { value: nebulaController.texture },
        uTime: { value: 0 },
        uIntensity: { value: 0.74 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uNebulaTex;
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          // Smooth continuous celestial drift in shader
          uv.x += uTime * 0.0006;
          vec4 texColor = texture2D(uNebulaTex, uv);
          gl_FragColor = vec4(texColor.rgb, texColor.a * uIntensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.renderOrder = -100; // Render behind all foreground objects & starfield
    scene.add(nebulaMesh);
    nebulaMeshRef.current = nebulaMesh;
    nebulaMatRef.current = nebulaMat;

    // ==========================================
    // 3. DEEP SPACE STARFIELD
    // ==========================================
    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#e9d5ff'),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 100 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ==========================================
    // SUBTLE STAR TRAIL MOTION BLUR SYSTEM
    // ==========================================
    const trailStarCount = 450;
    const trailPositions = new Float32Array(trailStarCount * 6);
    const trailColors = new Float32Array(trailStarCount * 6);
    const trailParticles: Array<{
      x: number;
      y: number;
      z: number;
      speedMult: number;
      lengthMult: number;
    }> = [];

    // Astral color palette: Astral White (#f1f5f9), Soft Slate (#cbd5e1), Pale Cyan Starlight (#7dd3fc)
    const astralColors = [
      new THREE.Color('#f1f5f9'),
      new THREE.Color('#e2e8f0'),
      new THREE.Color('#cbd5e1'),
      new THREE.Color('#94a3b8'),
      new THREE.Color('#7dd3fc'),
    ];

    for (let i = 0; i < trailStarCount; i++) {
      const radius = 5 + Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 55;
      const z = (Math.random() - 0.5) * 160;

      trailParticles.push({
        x,
        y,
        z,
        speedMult: 0.85 + Math.random() * 0.45,
        lengthMult: 0.7 + Math.random() * 0.6,
      });

      trailPositions[i * 6 + 0] = x;
      trailPositions[i * 6 + 1] = y;
      trailPositions[i * 6 + 2] = z;
      trailPositions[i * 6 + 3] = x;
      trailPositions[i * 6 + 4] = y;
      trailPositions[i * 6 + 5] = z;

      // Color gradient: Head (luminous star point) -> Tail (soft astral void fade)
      const baseCol = astralColors[i % astralColors.length];
      trailColors[i * 6 + 0] = baseCol.r;
      trailColors[i * 6 + 1] = baseCol.g;
      trailColors[i * 6 + 2] = baseCol.b;
      trailColors[i * 6 + 3] = baseCol.r * 0.22;
      trailColors[i * 6 + 4] = baseCol.g * 0.25;
      trailColors[i * 6 + 5] = baseCol.b * 0.32;
    }

    const trailGeo = new THREE.BufferGeometry();
    const trailPosAttr = new THREE.BufferAttribute(trailPositions, 3);
    trailPosAttr.setUsage(THREE.DynamicDrawUsage);
    trailGeo.setAttribute('position', trailPosAttr);
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

    const trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starTrailsMesh = new THREE.LineSegments(trailGeo, trailMat);
    scene.add(starTrailsMesh);

    starTrailsRef.current = {
      lineSegments: starTrailsMesh,
      posAttr: trailPosAttr,
      positions: trailPositions,
      particles: trailParticles,
    };

    // Sub-light Warp Streaks Line Segments
    const warpStreakCount = 200;
    const warpGeo = new THREE.BufferGeometry();
    const warpPos = new Float32Array(warpStreakCount * 6);
    for (let i = 0; i < warpStreakCount; i++) {
      const x = (Math.random() - 0.5) * 90;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 140;
      warpPos[i * 6] = x;
      warpPos[i * 6 + 1] = y;
      warpPos[i * 6 + 2] = z;
      warpPos[i * 6 + 3] = x;
      warpPos[i * 6 + 4] = y;
      warpPos[i * 6 + 5] = z - 10;
    }
    warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));
    const warpMat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0,
    });
    const warpStreaks = new THREE.LineSegments(warpGeo, warpMat);
    scene.add(warpStreaks);
    warpStreaksRef.current = warpStreaks;

    // ==========================================
    // 3. ACTUAL SOLAR SYSTEM PLANETS (PROJECTS & SKILLS)
    // ==========================================
    const planetsGroup = new THREE.Group();
    scene.add(planetsGroup);
    planetsGroupRef.current = planetsGroup;

    // Add glowing orbital trajectory rings
    const addOrbitRing = (radius: number, color: string) => {
      // 1. High-precision continuous orbital path line loop
      const segs = 280;
      const pts: number[] = [];
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.36,
      });
      const orbitLine = new THREE.LineLoop(lineGeo, lineMat);
      scene.add(orbitLine);

      // 2. Subtle soft luminous underlay glow band
      const glowGeo = new THREE.RingGeometry(radius - 0.22, radius + 0.22, 120);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.rotation.x = Math.PI / 2;
      scene.add(glowMesh);

      // 3. Subtle celestial scale graduation tick marks (every 30 degrees)
      const tickCount = 12;
      const tickGeo = new THREE.BufferGeometry();
      const tickPts: number[] = [];
      for (let t = 0; t < tickCount; t++) {
        const a = (t / tickCount) * Math.PI * 2;
        const r1 = radius - 0.5;
        const r2 = radius + 0.5;
        tickPts.push(
          Math.cos(a) * r1, 0, Math.sin(a) * r1,
          Math.cos(a) * r2, 0, Math.sin(a) * r2
        );
      }
      tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPts, 3));
      const tickMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.28,
      });
      const orbitTicks = new THREE.LineSegments(tickGeo, tickMat);
      scene.add(orbitTicks);
    };

    // BUILD ALL 9 CELESTIAL WORLDS
    const allBodies: Array<{
      id: string;
      solarPlanet: string;
      title: string;
      subtitle: string;
      color: string;
      accentColor: string;
      orbitRadius: number;
      orbitSpeed: number;
      type: 'project' | 'skill';
      data: any;
      hasRings?: boolean;
      ringColor?: string;
    }> = [];

    projects.forEach((p) => {
      allBodies.push({
        id: p.id,
        solarPlanet: p.solarPlanet || 'Earth',
        title: `${p.solarPlanet} • ${p.title}`,
        subtitle: p.subtitle,
        color: p.color,
        accentColor: p.accentColor,
        orbitRadius: p.orbitRadius || 40,
        orbitSpeed: p.orbitSpeed || 0.08,
        type: 'project',
        data: p,
      });
    });

    skillPlanets.forEach((sp) => {
      allBodies.push({
        id: sp.id,
        solarPlanet: sp.solarPlanet || 'Saturn',
        title: `${sp.solarPlanet} • ${sp.name}`,
        subtitle: sp.domain,
        color: sp.color,
        accentColor: sp.accentColor,
        orbitRadius: sp.orbitRadius || 90,
        orbitSpeed: sp.orbitSpeed || 0.04,
        type: 'skill',
        data: sp,
        hasRings: sp.hasRings,
        ringColor: sp.ringColor,
      });
    });

    allBodies.forEach((bodyInfo, idx) => {
      const pGroup = new THREE.Group();
      const orbitRadius = bodyInfo.orbitRadius;
      const initialAngle = (idx * (Math.PI * 2)) / allBodies.length;
      const initialX = Math.cos(initialAngle) * orbitRadius;
      const initialZ = Math.sin(initialAngle) * orbitRadius;

      pGroup.position.set(initialX, 0, initialZ);
      bodyInfo.data.worldPosition = [initialX, 0, initialZ];

      // Draw Keplerian orbital trajectory ring
      addOrbitRing(orbitRadius, bodyInfo.color);

      // Determine proportional solar planet radius
      let planetRadius = 2.4;
      const name = bodyInfo.solarPlanet.toLowerCase();
      if (name.includes('mercury')) planetRadius = 1.6;
      else if (name.includes('venus')) planetRadius = 2.2;
      else if (name.includes('earth')) planetRadius = 2.5;
      else if (name.includes('mars')) planetRadius = 2.0;
      else if (name.includes('jupiter')) planetRadius = 4.6;
      else if (name.includes('saturn')) planetRadius = 3.8;
      else if (name.includes('uranus')) planetRadius = 3.1;
      else if (name.includes('neptune')) planetRadius = 3.1;
      else if (name.includes('pluto')) planetRadius = 1.5;

      // Planet Sphere Geometry & Shader
      const geo = new THREE.SphereGeometry(planetRadius, 36, 36);
      const texture = createSolarPlanetTexture(bodyInfo.solarPlanet, bodyInfo.color, bodyInfo.accentColor);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.25,
      });
      const planetMesh = new THREE.Mesh(geo, mat);
      pGroup.add(planetMesh);

      // ==========================================
      // ENGINEERING PROXIMITY SCAN OVERLAYS
      // ==========================================
      // 1. Geodesic Engineering Wireframe CAD Overlay
      // Precision tessellated sphere slightly raised to prevent Z-fighting
      const wireGeo = new THREE.SphereGeometry(planetRadius * 1.012, 28, 28);
      const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(bodyInfo.accentColor),
        wireframe: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const wireframeOverlay = new THREE.Mesh(wireGeo, wireMat);
      wireframeOverlay.visible = false;
      pGroup.add(wireframeOverlay);

      // 2. Holographic Latitude Laser Sweep Ring (Altitude/Topography slice)
      const sweepPts: number[] = [];
      const sweepSegs = 64;
      for (let s = 0; s <= sweepSegs; s++) {
        const theta = (s / sweepSegs) * Math.PI * 2;
        sweepPts.push(Math.cos(theta), 0, Math.sin(theta));
      }
      const sweepGeo = new THREE.BufferGeometry();
      sweepGeo.setAttribute('position', new THREE.Float32BufferAttribute(sweepPts, 3));
      const sweepMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(bodyInfo.accentColor),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const scanSweepRing = new THREE.LineLoop(sweepGeo, sweepMat);
      scanSweepRing.visible = false;
      pGroup.add(scanSweepRing);

      // 3. Engineering Lock-On Target Frame / Aerospace Reticle Brackets
      const scanReticle = new THREE.Group();
      const reticleRadius = planetRadius * 1.55;
      const bracketArm = reticleRadius * 0.26;
      const bracketMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(bodyInfo.accentColor),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const cornerOffsets = [
        [-reticleRadius, reticleRadius],
        [reticleRadius, reticleRadius],
        [reticleRadius, -reticleRadius],
        [-reticleRadius, -reticleRadius],
      ];
      const cornerSigns = [
        [1, -1],
        [-1, -1],
        [-1, 1],
        [1, 1],
      ];

      const reticlePts: number[] = [];
      cornerOffsets.forEach(([cx, cy], cIdx) => {
        const [sx, sy] = cornerSigns[cIdx];
        reticlePts.push(cx, cy, 0, cx + sx * bracketArm, cy, 0);
        reticlePts.push(cx, cy, 0, cx, cy + sy * bracketArm, 0);
      });

      // Calibrated crosshairs along cardinal axes
      const crossDist = reticleRadius * 1.08;
      reticlePts.push(
        0, crossDist, 0, 0, crossDist + bracketArm * 0.45, 0,
        0, -crossDist, 0, 0, -crossDist - bracketArm * 0.45, 0,
        crossDist, 0, 0, crossDist + bracketArm * 0.45, 0, 0,
        -crossDist, 0, 0, -crossDist - bracketArm * 0.45, 0, 0
      );

      const reticleGeo = new THREE.BufferGeometry();
      reticleGeo.setAttribute('position', new THREE.Float32BufferAttribute(reticlePts, 3));
      const reticleSegments = new THREE.LineSegments(reticleGeo, bracketMat);
      scanReticle.add(reticleSegments);
      scanReticle.visible = false;
      pGroup.add(scanReticle);

      // Atmospheric Glow Rim
      const haloGeo = new THREE.SphereGeometry(planetRadius * 1.14, 36, 36);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(bodyInfo.accentColor),
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      pGroup.add(new THREE.Mesh(haloGeo, haloMat));

      // Special Layer: Earth Cloud Shell
      let earthClouds: THREE.Mesh | undefined;
      if (name.includes('earth')) {
        const cloudGeo = new THREE.SphereGeometry(planetRadius * 1.03, 36, 36);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: createEarthCloudTexture(),
          transparent: true,
          opacity: 0.55,
          blending: THREE.NormalBlending,
        });
        earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
        pGroup.add(earthClouds);
      }

      // Special Layer: Saturn & Uranus Rings
      let ringWireframe: THREE.Mesh | undefined;
      if (name.includes('saturn') || bodyInfo.hasRings) {
        const ringGeo = new THREE.RingGeometry(planetRadius * 1.45, planetRadius * 2.5, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          map: createRingTexture(bodyInfo.ringColor || bodyInfo.accentColor),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.3;
        ring.rotation.y = 0.2;
        pGroup.add(ring);

        // Subtle Engineering Wireframe Ring Overlay
        const ringWireGeo = new THREE.RingGeometry(planetRadius * 1.45, planetRadius * 2.5, 48, 6);
        const ringWireMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(bodyInfo.ringColor || bodyInfo.accentColor),
          wireframe: true,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        ringWireframe = new THREE.Mesh(ringWireGeo, ringWireMat);
        ringWireframe.rotation.x = Math.PI / 2.3;
        ringWireframe.rotation.y = 0.2;
        ringWireframe.visible = false;
        pGroup.add(ringWireframe);
      } else if (name.includes('uranus')) {
        // Uranus distinctive vertical rings
        const ringGeo = new THREE.RingGeometry(planetRadius * 1.35, planetRadius * 1.9, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.z = Math.PI / 2.1;
        pGroup.add(ring);
      }

      // Orbiting Sub-Moons (e.g. Luna, Phobos, Io, Europa, Titan, Triton)
      const moonCount = name.includes('earth') ? 1 : name.includes('jupiter') || name.includes('mars') ? 2 : 1;
      for (let mIdx = 0; mIdx < moonCount; mIdx++) {
        const mRadius = 0.45 + (mIdx % 2) * 0.15;
        const mGeo = new THREE.SphereGeometry(mRadius, 16, 16);
        const mMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(bodyInfo.accentColor),
          roughness: 0.5,
          metalness: 0.4,
        });
        const mMesh = new THREE.Mesh(mGeo, mMat);
        scene.add(mMesh);
        moonMeshesRef.current.push({
          mesh: mMesh,
          parentGroup: pGroup,
          distance: planetRadius + 2.0 + mIdx * 1.8,
          speed: 0.65 - mIdx * 0.2,
          angle: mIdx * Math.PI,
        });
      }

      // ==========================================
      // SUBTLE LOCAL ORBITAL PATH LINES AROUND PLANET
      // ==========================================
      // 1. Primary Flight Approach Orbit Line (standard parking & docking trajectory)
      const approachRadius = planetRadius * 2.3;
      const approachGeo = new THREE.BufferGeometry();
      const approachPts: number[] = [];
      const approachSegs = 96;
      for (let s = 0; s < approachSegs; s++) {
        const theta = (s / approachSegs) * Math.PI * 2;
        approachPts.push(Math.cos(theta) * approachRadius, 0, Math.sin(theta) * approachRadius);
      }
      approachGeo.setAttribute('position', new THREE.Float32BufferAttribute(approachPts, 3));
      const approachLine = new THREE.LineLoop(
        approachGeo,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(bodyInfo.accentColor),
          transparent: true,
          opacity: 0.38,
        })
      );
      pGroup.add(approachLine);

      // 2. Cardinal Flight Vector Markers / Navigation Ticks along approach orbit
      const tickGeo = new THREE.BufferGeometry();
      const tickPts: number[] = [];
      for (let c = 0; c < 8; c++) {
        const theta = (c * Math.PI) / 4;
        const tickLength = c % 2 === 0 ? 0.45 : 0.22;
        const r1 = approachRadius - tickLength;
        const r2 = approachRadius + tickLength;
        tickPts.push(
          Math.cos(theta) * r1, 0, Math.sin(theta) * r1,
          Math.cos(theta) * r2, 0, Math.sin(theta) * r2
        );
      }
      tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPts, 3));
      const tickLines = new THREE.LineSegments(
        tickGeo,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(bodyInfo.accentColor),
          transparent: true,
          opacity: 0.35,
        })
      );
      pGroup.add(tickLines);

      // 3. Outer Gravitational Transition Orbit Line (tilted orbital boundary)
      const outerOrbitRadius = planetRadius * 3.4;
      const outerGeo = new THREE.BufferGeometry();
      const outerPts: number[] = [];
      for (let s = 0; s < approachSegs; s++) {
        const theta = (s / approachSegs) * Math.PI * 2;
        outerPts.push(Math.cos(theta) * outerOrbitRadius, 0, Math.sin(theta) * outerOrbitRadius);
      }
      outerGeo.setAttribute('position', new THREE.Float32BufferAttribute(outerPts, 3));
      const outerRing = new THREE.LineLoop(
        outerGeo,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(bodyInfo.accentColor),
          transparent: true,
          opacity: 0.20,
        })
      );
      outerRing.rotation.x = 0.14;
      outerRing.rotation.z = 0.10;
      pGroup.add(outerRing);

      // 4. Moon Orbital Trajectory Lines (showing exact paths swept by natural satellites)
      for (let mIdx = 0; mIdx < moonCount; mIdx++) {
        const moonDist = planetRadius + 2.0 + mIdx * 1.8;
        const mOrbitGeo = new THREE.BufferGeometry();
        const mOrbitPts: number[] = [];
        const mSegs = 72;
        for (let s = 0; s < mSegs; s++) {
          const theta = (s / mSegs) * Math.PI * 2;
          mOrbitPts.push(
            Math.cos(theta) * moonDist,
            Math.sin(theta * 2) * 0.8,
            Math.sin(theta) * moonDist
          );
        }
        mOrbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(mOrbitPts, 3));
        const mOrbitLine = new THREE.LineLoop(
          mOrbitGeo,
          new THREE.LineBasicMaterial({
            color: new THREE.Color(bodyInfo.accentColor),
            transparent: true,
            opacity: 0.24,
          })
        );
        pGroup.add(mOrbitLine);
      }

      // In-World Floating Holographic Billboard Label
      const billboard = createPlanetBillboard(bodyInfo.title, bodyInfo.subtitle, bodyInfo.accentColor);
      billboard.position.set(0, planetRadius + 2.4, 0);
      pGroup.add(billboard);

      // Celestial Beacon Light
      const beaconLight = new THREE.PointLight(new THREE.Color(bodyInfo.color), 1.2, 16);
      beaconLight.position.set(0, planetRadius + 0.6, 0);
      pGroup.add(beaconLight);

      planetsGroup.add(pGroup);

      planetMeshesRef.current.set(bodyInfo.id, {
        group: pGroup,
        body: planetMesh,
        type: bodyInfo.type,
        data: bodyInfo.data,
        orbitRadius,
        orbitSpeed: bodyInfo.orbitSpeed,
        angle: initialAngle,
        billboard,
        earthClouds,
        planetRadius,
        wireframeOverlay,
        scanSweepRing,
        scanReticle,
        ringWireframe,
      });
    });

    // ==========================================
    // 4. FLOATING SPACE ANOMALIES & COLLECTIBLES
    // ==========================================
    const collectiblesGroup = new THREE.Group();
    scene.add(collectiblesGroup);
    collectiblesGroupRef.current = collectiblesGroup;

    collectibles.forEach((c) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(c.position[0], c.position[1], c.position[2]);

      const cGeo = new THREE.OctahedronGeometry(1.2, 0);
      const cMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(c.color),
        emissive: new THREE.Color(c.color),
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cGroup.add(cMesh);

      const light = new THREE.PointLight(new THREE.Color(c.color), 1.5, 8);
      cGroup.add(light);

      collectiblesGroup.add(cGroup);
      collectibleMeshesRef.current.set(c.id, cGroup);
    });

    // ==========================================
    // 5. BESPOKE SCULPTED STEALTH STARFIGHTER
    // ==========================================
    const ship = new THREE.Group();
    shipGroupRef.current = ship;
    ship.position.set(flightState.current.x, flightState.current.y, flightState.current.z);

    // --- BESPOKE AEROSPACE MATERIALS (RED & WHITE COMBO) ---
    // Primary Airframe: Crisp Aerospace Glacier White with refined satin sheen
    const whiteHullMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.22,
      roughness: 0.26,
    });

    // High-Contrast Racing Crimson Red (Satin lacquer with subtle luminous depth)
    const crimsonRedMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.32,
      roughness: 0.22,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.18,
    });

    // Bright Scarlet Red Accent for wingtips and fin caps
    const scarletAccentMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.28,
      roughness: 0.22,
      emissive: 0x991b1b,
      emissiveIntensity: 0.22,
    });

    // Contrast Carbon Graphite for mechanical joints, probe & spine base
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Polarized Smoked Obsidian Canopy Glass
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.92,
    });

    // Machined Tungsten-Alloy Vectoring Engine Bells
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.92,
      roughness: 0.22,
    });

    // --- 1. CHISELED SCULPTED FOREBODY & NOSE (RED & WHITE ARROWHEAD) ---
    // Forward Faceted Wedge Nose (Pointed forward along -Z)
    const noseGeo = new THREE.BufferGeometry();
    const nV = [
      // Top Left Facet (White)
      0, 0.04, -3.5,    -0.45, 0.02, -1.8,   0, 0.22, -1.8,
      // Top Right Facet (White)
      0, 0.04, -3.5,    0, 0.22, -1.8,       0.45, 0.02, -1.8,
      // Bottom Left Facet (White)
      0, 0.04, -3.5,    0, -0.16, -1.8,      -0.45, 0.02, -1.8,
      // Bottom Right Facet (White)
      0, 0.04, -3.5,    0.45, 0.02, -1.8,    0, -0.16, -1.8,
      // Forebody Upper Flanks (Transition to mid-fuselage)
      -0.45, 0.02, -1.8,  -0.85, 0.12, -0.5,   0, 0.28, -0.5,
      -0.45, 0.02, -1.8,   0, 0.28, -0.5,      0, 0.22, -1.8,
      0.45, 0.02, -1.8,   0, 0.22, -1.8,       0, 0.28, -0.5,
      0.45, 0.02, -1.8,   0, 0.28, -0.5,       0.85, 0.12, -0.5,
      // Forebody Ventral (Belly)
      -0.45, 0.02, -1.8,  0, -0.16, -1.8,      -0.65, -0.12, -0.5,
      0, -0.16, -1.8,     0, -0.22, -0.5,      -0.65, -0.12, -0.5,
      0.45, 0.02, -1.8,   0.65, -0.12, -0.5,   0, -0.16, -1.8,
      0, -0.16, -1.8,     0.65, -0.12, -0.5,   0, -0.22, -0.5,
    ];
    noseGeo.setAttribute('position', new THREE.Float32BufferAttribute(nV, 3));
    noseGeo.computeVertexNormals();
    const forebody = new THREE.Mesh(noseGeo, whiteHullMat);
    ship.add(forebody);

    // Crimson Red Nose Chevron Accents (Racing strakes)
    const noseStrakeGeo = new THREE.BufferGeometry();
    const nsV = [
      0, 0.05, -3.2,    -0.22, 0.04, -1.9,   0, 0.23, -1.9,
      0, 0.05, -3.2,    0, 0.23, -1.9,       0.22, 0.04, -1.9,
    ];
    noseStrakeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nsV, 3));
    noseStrakeGeo.computeVertexNormals();
    const noseStrakes = new THREE.Mesh(noseStrakeGeo, crimsonRedMat);
    ship.add(noseStrakes);

    // Carbon Nose Apex Needle Probe
    const probeGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.9, 8);
    const probe = new THREE.Mesh(probeGeo, graphiteMat);
    probe.rotation.x = -Math.PI / 2;
    probe.position.set(0, 0.04, -3.8);
    ship.add(probe);

    // --- 2. MID FUSELAGE & DORSAL SPINE ---
    // Sculpted Central Monocoque Deck (Glacier White)
    const midHullGeo = new THREE.BufferGeometry();
    const mV = [
      // Top Center Deck
      -0.85, 0.12, -0.5,  -0.95, 0.08, 0.7,   0, 0.32, 0.7,
      -0.85, 0.12, -0.5,   0, 0.32, 0.7,      0, 0.28, -0.5,
      0.85, 0.12, -0.5,    0, 0.28, -0.5,     0, 0.32, 0.7,
      0.85, 0.12, -0.5,    0, 0.32, 0.7,      0.95, 0.08, 0.7,
      // Aft Deck
      -0.95, 0.08, 0.7,   -0.85, 0.08, 1.5,   0, 0.22, 1.5,
      -0.95, 0.08, 0.7,    0, 0.22, 1.5,      0, 0.32, 0.7,
      0.95, 0.08, 0.7,     0, 0.32, 0.7,      0, 0.22, 1.5,
      0.95, 0.08, 0.7,     0, 0.22, 1.5,      0.85, 0.08, 1.5,
      // Ventral Mid Belly
      -0.65, -0.12, -0.5,  0, -0.22, -0.5,    -0.7, -0.10, 0.7,
      0, -0.22, -0.5,      0, -0.20, 0.7,     -0.7, -0.10, 0.7,
      0.65, -0.12, -0.5,  0.7, -0.10, 0.7,     0, -0.22, -0.5,
      0, -0.22, -0.5,     0.7, -0.10, 0.7,     0, -0.20, 0.7,
      // Ventral Aft Belly
      -0.7, -0.10, 0.7,    0, -0.20, 0.7,     -0.65, -0.06, 1.5,
      0, -0.20, 0.7,       0, -0.14, 1.5,     -0.65, -0.06, 1.5,
      0.7, -0.10, 0.7,    0.65, -0.06, 1.5,    0, -0.20, 0.7,
      0, -0.20, 0.7,      0.65, -0.06, 1.5,    0, -0.14, 1.5,
    ];
    midHullGeo.setAttribute('position', new THREE.Float32BufferAttribute(mV, 3));
    midHullGeo.computeVertexNormals();
    const midHull = new THREE.Mesh(midHullGeo, whiteHullMat);
    ship.add(midHull);

    // Dorsal Aerospace Spine & Crimson Racing Stripe
    const spineGeo = new THREE.BoxGeometry(0.24, 0.12, 2.2);
    const spine = new THREE.Mesh(spineGeo, graphiteMat);
    spine.position.set(0, 0.32, 0.3);
    ship.add(spine);

    const spineRedGeo = new THREE.BoxGeometry(0.12, 0.04, 2.0);
    const spineRed = new THREE.Mesh(spineRedGeo, crimsonRedMat);
    spineRed.position.set(0, 0.39, 0.3);
    ship.add(spineRed);

    // --- 3. FACETED POLARIZED OBSIDIAN CANOPY ---
    const canopyGeo = new THREE.BufferGeometry();
    const cV = [
      // Nose to crest
      0, 0.22, -1.6,   -0.28, 0.22, -0.6,   0, 0.44, -0.6,
      0, 0.22, -1.6,    0, 0.44, -0.6,      0.28, 0.22, -0.6,
      // Crest to rear
      -0.28, 0.22, -0.6, -0.22, 0.24, 0.1,  0, 0.44, -0.6,
      0, 0.44, -0.6,     -0.22, 0.24, 0.1,  0, 0.34, 0.1,
      0.28, 0.22, -0.6,   0, 0.44, -0.6,    0.22, 0.24, 0.1,
      0, 0.44, -0.6,      0, 0.34, 0.1,     0.22, 0.24, 0.1,
    ];
    canopyGeo.setAttribute('position', new THREE.Float32BufferAttribute(cV, 3));
    canopyGeo.computeVertexNormals();
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    ship.add(canopy);

    // Internal Cockpit Holographic Pilot HUD
    const hudGeo = new THREE.PlaneGeometry(0.2, 0.12);
    const hudMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const hud = new THREE.Mesh(hudGeo, hudMat);
    hud.position.set(0, 0.32, -1.0);
    hud.rotation.x = -0.25;
    ship.add(hud);

    // --- 4. SWEPT CLIPPED-DELTA WINGS (WHITE BODY + CRIMSON ARMOR) ---
    [-1, 1].forEach((side) => {
      const wingGeo = new THREE.BufferGeometry();
      const xR1 = side * 0.85;  // root leading
      const xR2 = side * 0.88;  // root trailing
      const xT1 = side * 2.85;  // tip leading
      const xT2 = side * 2.50;  // tip trailing

      const wV = [
        // Upper Wing Surface
        xR1, 0.10, -0.4,   xT1, 0.04, 0.6,   xR2, 0.07, 1.4,
        xT1, 0.04, 0.6,    xT2, 0.01, 1.3,   xR2, 0.07, 1.4,
        // Lower Wing Surface
        xR1, -0.06, -0.4,  xR2, -0.04, 1.4,  xT1, -0.02, 0.6,
        xT1, -0.02, 0.6,   xR2, -0.04, 1.4,  xT2, -0.01, 1.3,
        // Leading Edge Bevel
        xR1, 0.10, -0.4,   xR1, -0.06, -0.4, xT1, 0.04, 0.6,
        xR1, -0.06, -0.4,  xT1, -0.02, 0.6,  xT1, 0.04, 0.6,
        // Trailing Edge Bevel
        xR2, 0.07, 1.4,    xT2, 0.01, 1.3,   xR2, -0.04, 1.4,
        xT2, 0.01, 1.3,    xT2, -0.01, 1.3,  xR2, -0.04, 1.4,
      ];
      wingGeo.setAttribute('position', new THREE.Float32BufferAttribute(wV, 3));
      wingGeo.computeVertexNormals();
      const wing = new THREE.Mesh(wingGeo, whiteHullMat);
      ship.add(wing);

      // Crimson Red Wing Leading Edge Armor Plates
      const edgeGeo = new THREE.BufferGeometry();
      const xE1 = side * 0.85;
      const xE2 = side * 2.85;
      const eV = [
        xE1, 0.11, -0.38,   xE2, 0.05, 0.62,   side * (Math.abs(xE1) + 0.35), 0.08, -0.1,
        xE1, 0.11, -0.38,   side * (Math.abs(xE1) + 0.35), 0.08, -0.1,  xE1, 0.09, -0.1,
      ];
      edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(eV, 3));
      edgeGeo.computeVertexNormals();
      const edge = new THREE.Mesh(edgeGeo, crimsonRedMat);
      ship.add(edge);

      // Crimson Red Wing Chevron Inset
      const insetGeo = new THREE.BoxGeometry(0.18, 0.03, 0.85);
      const inset = new THREE.Mesh(insetGeo, crimsonRedMat);
      inset.position.set(side * 1.5, 0.07, 0.65);
      inset.rotation.y = side * -0.22;
      ship.add(inset);

      // Crimson Red Wingtip Endplate Winglet
      const wingletGeo = new THREE.BufferGeometry();
      const wlv = [
        xT1, 0.04, 0.6,   side * 2.88, 0.38, 0.9,   xT2, 0.01, 1.3,
        xT1, 0.04, 0.6,   xT2, 0.01, 1.3,           side * 2.88, -0.15, 0.95,
      ];
      wingletGeo.setAttribute('position', new THREE.Float32BufferAttribute(wlv, 3));
      wingletGeo.computeVertexNormals();
      const winglet = new THREE.Mesh(wingletGeo, scarletAccentMat);
      ship.add(winglet);
    });

    // --- 5. TWIN CANT-OUT VERTICAL STABILIZERS (CRIMSON RED FINS) ---
    [-0.56, 0.56].forEach((finX, fIdx) => {
      const finGroup = new THREE.Group();
      finGroup.position.set(finX, 0.16, 0.9);
      finGroup.rotation.z = fIdx === 0 ? 0.32 : -0.32; // Cant outwards 18 degrees

      const finGeo = new THREE.BufferGeometry();
      const fv = [
        0, 0, -0.3,   0, 1.25, 0.45,   0, 0, 0.65,
      ];
      finGeo.setAttribute('position', new THREE.Float32BufferAttribute(fv, 3));
      finGeo.computeVertexNormals();
      const fin = new THREE.Mesh(finGeo, crimsonRedMat);
      finGroup.add(fin);

      // White Leading Edge Spar
      const sparGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.35, 6);
      const spar = new THREE.Mesh(sparGeo, whiteHullMat);
      spar.position.set(0, 0.62, 0.08);
      spar.rotation.x = -0.52;
      finGroup.add(spar);

      // Scarlet Red Tip Cap
      const capGeo = new THREE.ConeGeometry(0.04, 0.25, 6);
      const cap = new THREE.Mesh(capGeo, scarletAccentMat);
      cap.position.set(0, 1.25, 0.45);
      cap.rotation.x = -0.4;
      finGroup.add(cap);

      ship.add(finGroup);
    });

    // --- 6. TWIN INTEGRATED HEAVY ION VECTORING ENGINES ---
    const plumes: THREE.Mesh[] = [];
    [-0.48, 0.48].forEach((nozzleX) => {
      // Recessed Engine Housing (White)
      const nacelleGeo = new THREE.CylinderGeometry(0.26, 0.28, 1.1, 16);
      const nacelle = new THREE.Mesh(nacelleGeo, whiteHullMat);
      nacelle.rotation.x = Math.PI / 2;
      nacelle.position.set(nozzleX, 0.04, 1.1);
      ship.add(nacelle);

      // Titanium Vectoring Exhaust Bell
      const nozzleGeo = new THREE.CylinderGeometry(0.24, 0.29, 0.45, 16);
      const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
      nozzle.rotation.x = Math.PI / 2;
      nozzle.position.set(nozzleX, 0.04, 1.6);
      ship.add(nozzle);

      // Glowing Reheat Cathode Ring (Crimson Reheat Ring)
      const ringGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(nozzleX, 0.04, 1.78);
      ship.add(ring);

      // Dynamic Ion Plasma Plume (Deep Crimson-Amber Flare)
      const plumeGeo = new THREE.ConeGeometry(0.22, 1.8, 14);
      const plumeMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const plume = new THREE.Mesh(plumeGeo, plumeMat);
      plume.rotation.x = -Math.PI / 2;
      plume.position.set(nozzleX, 0.04, 2.7);
      ship.add(plume);
      plumes.push(plume);

      // Inner Hot Core Plasma Streak (Bright White-Hot Core)
      const coreGeo = new THREE.ConeGeometry(0.10, 1.5, 10);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.rotation.x = -Math.PI / 2;
      core.position.set(nozzleX, 0.04, 2.5);
      ship.add(core);
      plumes.push(core);
    });
    thrusterPlumesRef.current = plumes;

    // --- 7. TACTICAL LIGHTING & VISIBILITY ---
    // Soft Engine Illumination
    const engineGlow = new THREE.PointLight(0xef4444, 1.5, 8);
    engineGlow.position.set(0, 0.1, 2.2);
    ship.add(engineGlow);

    // Deep Aviation Beacons (Port Red / Starboard Green)
    const beaconLeft = new THREE.PointLight(0xef4444, 1.2, 5);
    beaconLeft.position.set(-2.8, 0.1, 1.1);
    ship.add(beaconLeft);

    const beaconRight = new THREE.PointLight(0x10b981, 1.2, 5);
    beaconRight.position.set(2.8, 0.1, 1.1);
    ship.add(beaconRight);

    scene.add(ship);

    // ==========================================
    // 6. RAYCASTING & 3D INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.x = pointer.x;
      mouseRef.current.y = pointer.y;

      raycaster.setFromCamera(pointer, camera);
      const candidates: THREE.Object3D[] = [];
      planetMeshesRef.current.forEach((val) => {
        candidates.push(val.body);
        candidates.push(val.billboard);
      });

      const intersects = raycaster.intersectObjects(candidates, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        for (const [id, val] of planetMeshesRef.current.entries()) {
          if (val.body === hit || val.billboard === hit) {
            hoveredIdRef.current = id;
            container.style.cursor = 'pointer';
            break;
          }
        }
      } else {
        hoveredIdRef.current = null;
        container.style.cursor = 'default';
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      raycaster.setFromCamera(pointer, camera);
      const candidates: THREE.Object3D[] = [];
      planetMeshesRef.current.forEach((val) => {
        candidates.push(val.body);
        candidates.push(val.billboard);
      });

      const intersects = raycaster.intersectObjects(candidates, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        for (const [, val] of planetMeshesRef.current.entries()) {
          if (val.body === hit || val.billboard === hit) {
            sound.playClick();
            // Engage smooth autopilot to glide to this planet
            autoGlideRef.current = {
              active: true,
              targetX: val.group.position.x,
              targetZ: val.group.position.z,
              targetY: 2,
            };
            if (val.type === 'project') {
              onSelectProject(val.data);
            } else {
              onSelectSkillPlanet(val.data);
            }
            break;
          }
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 7. DETERMINISTIC FIXED TIME STEP SIMULATION & RENDERING LOOP
    // ==========================================
    const FIXED_STEP = 1 / 60; // 60 Hz deterministic simulation time step (16.667ms)
    const MAX_SUB_STEPS = 4;   // Clamp sub-steps to prevent spiral of death during backgrounding or lag spikes
    let accumulator = 0;
    let lastTime = performance.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      let frameTime = (now - lastTime) / 1000;
      lastTime = now;

      // Clamp frameTime to avoid accumulation explosion if tab is blurred or paused
      if (frameTime > 0.1) frameTime = 0.1;
      accumulator += frameTime;

      const state = flightState.current;
      const input = carInputRef.current;

      // ==========================================
      // DETERMINISTIC FIXED TIME STEP SIMULATION
      // ==========================================
      let subSteps = 0;
      while (accumulator >= FIXED_STEP && subSteps < MAX_SUB_STEPS) {
        const dt = FIXED_STEP;

        // 1. REVOLVE CELESTIAL WORLDS AROUND CENTRAL SUN & PROXIMITY SCAN PHYSICS
        planetMeshesRef.current.forEach((val, planetId) => {
          val.angle += val.orbitSpeed * dt * 0.12;
          const px = Math.cos(val.angle) * val.orbitRadius;
          const pz = Math.sin(val.angle) * val.orbitRadius;
          val.group.position.set(px, 0, pz);

          val.data.worldPosition[0] = Math.round(px * 10) / 10;
          val.data.worldPosition[2] = Math.round(pz * 10) / 10;

          val.body.rotation.y += dt * 0.28;

          if (val.earthClouds) {
            val.earthClouds.rotation.y += dt * 0.38;
          }

          // Engineering Proximity Scan Effect
          const distToShip = Math.hypot(state.x - px, state.z - pz);
          const scanTriggerDistance = Math.max(22, val.planetRadius * 6.8);
          const isInScanRange = distToShip < scanTriggerDistance;

          let targetWireOpacity = 0;
          let targetSweepOpacity = 0;
          let targetReticleOpacity = 0;

          if (isInScanRange) {
            const scanFactor = Math.min(
              1.0,
              Math.max(0, (scanTriggerDistance - distToShip) / (scanTriggerDistance - val.planetRadius * 1.4))
            );
            targetWireOpacity = 0.16 + scanFactor * 0.36;
            targetSweepOpacity = 0.28 + scanFactor * 0.44;
            targetReticleOpacity = 0.20 + scanFactor * 0.45;

            if (!scannedPlanetsRef.current.has(planetId)) {
              scannedPlanetsRef.current.add(planetId);
              sound.playScanPing();
            }

            val.wireframeOverlay.rotation.y += dt * 0.32;
            val.wireframeOverlay.rotation.x = Math.sin(now * 0.0012) * 0.10;

            const sweepCycle = (now * 0.0024) % (Math.PI * 2);
            const scanY = Math.sin(sweepCycle) * (val.planetRadius * 0.95);
            const sliceRadius = Math.sqrt(Math.max(0.05, val.planetRadius * val.planetRadius - scanY * scanY)) * 1.018;
            val.scanSweepRing.position.y = scanY;
            val.scanSweepRing.scale.set(sliceRadius, 1, sliceRadius);

            val.scanReticle.rotation.z += dt * 0.22;
          } else if (distToShip > scanTriggerDistance + 8) {
            scannedPlanetsRef.current.delete(planetId);
          }

          const wireMat = val.wireframeOverlay.material as THREE.MeshBasicMaterial;
          wireMat.opacity = expLerp(wireMat.opacity, targetWireOpacity, 6.0, dt);
          val.wireframeOverlay.visible = wireMat.opacity > 0.005;

          const sweepMat = val.scanSweepRing.material as THREE.LineBasicMaterial;
          sweepMat.opacity = expLerp(sweepMat.opacity, targetSweepOpacity, 6.0, dt);
          val.scanSweepRing.visible = sweepMat.opacity > 0.005;

          const reticleSegments = val.scanReticle.children[0] as THREE.LineSegments | undefined;
          if (reticleSegments) {
            const reticleMat = reticleSegments.material as THREE.LineBasicMaterial;
            reticleMat.opacity = expLerp(reticleMat.opacity, targetReticleOpacity, 6.0, dt);
            val.scanReticle.visible = reticleMat.opacity > 0.005;
          }

          if (val.ringWireframe) {
            const ringWireMat = val.ringWireframe.material as THREE.MeshBasicMaterial;
            ringWireMat.opacity = expLerp(ringWireMat.opacity, targetWireOpacity * 0.75, 6.0, dt);
            val.ringWireframe.visible = ringWireMat.opacity > 0.005;
          }
        });

        // 2. ORBITING SUB-MOONS AROUND PARENT PLANETS
        moonMeshesRef.current.forEach((m) => {
          m.angle += m.speed * dt;
          const parentPos = m.parentGroup.position;
          m.mesh.position.x = parentPos.x + Math.cos(m.angle) * m.distance;
          m.mesh.position.z = parentPos.z + Math.sin(m.angle) * m.distance;
          m.mesh.position.y = parentPos.y + Math.sin(m.angle * 2) * 0.8;
        });

        // 3. COLLECTIBLE ANOMALIES
        collectibleMeshesRef.current.forEach((mesh, id) => {
          const item = collectibles.find((c) => c.id === id);
          if (item && !item.collected) {
            mesh.rotation.y += dt * 1.5;
            mesh.rotation.x = Math.sin(now * 0.002) * 0.2;
            const distToShip = Math.hypot(state.x - mesh.position.x, state.z - mesh.position.z);
            if (distToShip < 3.2) {
              onCollectItem(id);
              sound.playCollect();
            }
          } else {
            mesh.visible = false;
          }
        });

        // 4. AUTOPILOT GLIDE VS MANUAL FLIGHT
        if (autoGlideRef.current && autoGlideRef.current.active) {
          const g = autoGlideRef.current;
          const dx = g.targetX - state.x;
          const dz = g.targetZ - state.z;
          const distToTarget = Math.hypot(dx, dz);

          if (input.forward || input.backward || input.left || input.right || input.brake) {
            autoGlideRef.current.active = false;
          } else if (distToTarget < 9.0) {
            state.speed = expLerp(state.speed, 3.5, 4.0, dt);
            state.yaw += dt * 0.4;
            if (distToTarget < 6.5) {
              autoGlideRef.current.active = false;
            }
          } else {
            const targetAngle = Math.atan2(dx, dz);
            let angleDiff = targetAngle - state.yaw;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

            state.yaw += angleDiff * Math.min(1.0, 4.2 * dt);
            state.roll = expLerp(state.roll, -angleDiff * 0.55, 6.5, dt);

            const cruiseSpeed = distToTarget > 45 ? 32 : 19;
            state.speed = expLerp(state.speed, cruiseSpeed, 3.5, dt);
            state.pitch = expLerp(state.pitch, 0.08, 4.5, dt);
          }
        } else {
          // Manual Flight Dynamics
          const maxForwardSpeed = input.turbo ? 28 : 16;
          const maxReverseSpeed = -8;
          const turnRate = 2.4;

          if (input.left) {
            state.yaw += turnRate * dt;
            state.roll = expLerp(state.roll, -0.45, 8.0, dt);
          } else if (input.right) {
            state.yaw -= turnRate * dt;
            state.roll = expLerp(state.roll, 0.45, 8.0, dt);
          } else {
            state.roll = expLerp(state.roll, 0, 9.0, dt);
          }

          if (input.forward) {
            state.targetSpeed = maxForwardSpeed;
            state.pitch = expLerp(state.pitch, 0.18, 6.0, dt);
          } else if (input.backward) {
            state.targetSpeed = maxReverseSpeed;
            state.pitch = expLerp(state.pitch, -0.15, 6.0, dt);
          } else if (input.brake) {
            state.targetSpeed = 0;
            state.pitch = expLerp(state.pitch, -0.1, 8.0, dt);
          } else {
            state.targetSpeed = 0;
            state.pitch = expLerp(state.pitch, 0, 6.0, dt);
          }

          state.speed = expLerp(state.speed, state.targetSpeed, 3.2, dt);
        }

        // Translate along forward vector
        state.x += Math.sin(state.yaw) * state.speed * dt;
        state.z += Math.cos(state.yaw) * state.speed * dt;

        // Advance star trail particles along fixed time step
        if (starTrailsRef.current) {
          const { particles } = starTrailsRef.current;
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.z -= state.speed * dt * p.speedMult * 2.2;
            if (p.z < -80) {
              p.z += 160;
              const angle = Math.random() * Math.PI * 2;
              const r = 5 + Math.random() * 80;
              p.x = Math.cos(angle) * r;
              p.y = (Math.random() - 0.5) * 55;
            } else if (p.z > 80) {
              p.z -= 160;
              const angle = Math.random() * Math.PI * 2;
              const r = 5 + Math.random() * 80;
              p.x = Math.cos(angle) * r;
              p.y = (Math.random() - 0.5) * 55;
            }
          }
        }

        accumulator -= FIXED_STEP;
        subSteps++;
      }

      // Clear any accumulator remainder if hitting MAX_SUB_STEPS cap
      if (accumulator >= FIXED_STEP) {
        accumulator = 0;
      }

      // ==========================================
      // FRAME RENDERING, SMOOTH CAMERA & VISUAL EFFECTS
      // ==========================================
      // Planetary billboards and scan reticles face camera
      planetMeshesRef.current.forEach((val) => {
        val.billboard.quaternion.copy(camera.quaternion);
        val.scanReticle.quaternion.copy(camera.quaternion);
      });

      // Update position coordinates for HUD
      onUpdateSpeed(Math.abs(Math.round(state.speed * 4)));
      onUpdateCarPosition([Math.round(state.x), Math.round(state.z)]);

      // Update Ship transform
      if (shipGroupRef.current) {
        shipGroupRef.current.position.set(state.x, state.y, state.z);
        shipGroupRef.current.rotation.set(state.pitch, state.yaw + Math.PI, state.roll);
      }

      // Thruster plume length & glow
      thrusterPlumesRef.current.forEach((plume) => {
        const scale = 0.8 + (Math.abs(state.speed) / 28) * (input.turbo ? 2.2 : 1.2);
        plume.scale.set(1, 1, scale);
      });

      // Star trail geometry update
      const speedMagnitude = Math.abs(state.speed);
      const isHighSpeed = speedMagnitude > 7 || input.turbo;
      const targetTrailOpacity = isHighSpeed
        ? Math.min(0.68, 0.20 + (speedMagnitude / 28) * 0.48)
        : 0;

      if (starTrailsRef.current) {
        const { lineSegments, posAttr, positions, particles } = starTrailsRef.current;
        const mat = lineSegments.material as THREE.LineBasicMaterial;
        mat.opacity = expLerp(mat.opacity, targetTrailOpacity, 7.0, frameTime);

        if (mat.opacity > 0.005) {
          lineSegments.visible = true;
          const forwardX = Math.sin(state.yaw) * Math.cos(state.pitch);
          const forwardY = -Math.sin(state.pitch);
          const forwardZ = Math.cos(state.yaw) * Math.cos(state.pitch);
          const streakFactor = Math.max(0, speedMagnitude - 5) * 0.55 + (input.turbo ? 7.5 : 0);

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const headX = state.x + p.x;
            const headY = state.y + p.y;
            const headZ = state.z + p.z;
            const streakLen = streakFactor * p.lengthMult;
            const tailX = headX - forwardX * streakLen;
            const tailY = headY - forwardY * streakLen;
            const tailZ = headZ - forwardZ * streakLen;

            const idx = i * 6;
            positions[idx + 0] = headX;
            positions[idx + 1] = headY;
            positions[idx + 2] = headZ;
            positions[idx + 3] = tailX;
            positions[idx + 4] = tailY;
            positions[idx + 5] = tailZ;
          }
          posAttr.needsUpdate = true;
        } else {
          lineSegments.visible = false;
        }
      }

      // Warp streaks
      if (warpStreaksRef.current) {
        const streakMat = warpStreaksRef.current.material as THREE.LineBasicMaterial;
        const targetOpacity = input.turbo || Math.abs(state.speed) > 20 ? 0.65 : 0;
        streakMat.opacity = expLerp(streakMat.opacity, targetOpacity, 6.0, frameTime);
        warpStreaksRef.current.position.set(state.x, state.y, state.z);
      }

      // Dynamic FOV Warp
      if (cameraRef.current) {
        const baseFov = 50;
        const targetFov = input.turbo
          ? 58
          : speedMagnitude > 12
          ? 50 + (speedMagnitude / 28) * 5.0
          : baseFov;
        if (Math.abs(cameraRef.current.fov - targetFov) > 0.05) {
          cameraRef.current.fov = expLerp(cameraRef.current.fov, targetFov, 4.0, frameTime);
          cameraRef.current.updateProjectionMatrix();
        }
      }

      // Camera Follow Smoothing (Spring-Damper Lerp)
      if (cameraRef.current) {
        const targetCamPos = new THREE.Vector3();
        const targetLookAt = new THREE.Vector3(state.x, state.y, state.z);

        if (cameraView === 'follow') {
          const camDist = input.turbo ? 12.5 : 9.8;
          const camHeight = 3.6;
          targetCamPos.set(
            state.x - Math.sin(state.yaw) * camDist,
            state.y + camHeight,
            state.z - Math.cos(state.yaw) * camDist
          );
        } else if (cameraView === 'isometric') {
          targetCamPos.set(state.x + 22, state.y + 24, state.z + 22);
        } else if (cameraView === 'topDown') {
          targetCamPos.set(state.x, state.y + 44, state.z);
        } else if (cameraView === 'cinema') {
          targetCamPos.set(state.x + Math.sin(now * 0.0008) * 18, state.y + 6, state.z + Math.cos(now * 0.0008) * 18);
        }

        cameraRef.current.position.x = expLerp(cameraRef.current.position.x, targetCamPos.x, 5.0, frameTime);
        cameraRef.current.position.y = expLerp(cameraRef.current.position.y, targetCamPos.y, 5.0, frameTime);
        cameraRef.current.position.z = expLerp(cameraRef.current.position.z, targetCamPos.z, 5.0, frameTime);

        cameraRef.current.lookAt(targetLookAt);
      }

      // ==========================================
      // PROCEDURAL NEBULA SHADER & REDUCED-FREQUENCY TEXTURE UPDATE
      // ==========================================
      nebulaController.update(now);

      if (nebulaMatRef.current) {
        nebulaMatRef.current.uniforms.uTime.value = now * 0.001;
      }

      if (nebulaMeshRef.current && cameraRef.current) {
        nebulaMeshRef.current.position.copy(cameraRef.current.position);
        nebulaMeshRef.current.rotation.y += frameTime * 0.006;
      }

      // Direct hardware rendering pass
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nebulaGeo.dispose();
      nebulaMat.dispose();
      nebulaController.dispose();
      renderer.dispose();
    };
  }, [projects, skillPlanets, collectibles, cameraView]);

  // Handle direct warp from UI or selector with smooth autopilot glide
  useEffect(() => {
    if (!warpTarget) return;
    sound.playHorn();
    autoGlideRef.current = {
      active: true,
      targetX: warpTarget.x,
      targetZ: warpTarget.z,
      targetY: warpTarget.y || 2,
    };
  }, [warpTarget]);

  // Handle ship reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      flightState.current.x = 0;
      flightState.current.y = 2;
      flightState.current.z = 16;
      flightState.current.speed = 0;
      flightState.current.yaw = 0;
      autoGlideRef.current = null;
      sound.playEngineRev();
    }
  }, [resetTrigger]);

  return <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />;
};
