import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MISSION_PROJECTS, MissionProject } from '../../data/projects';
import { useMissionStore } from '../../store/missionStore';
import { Starfighter, flightInput } from './Starfighter';
import { FlightController } from './FlightController';
import { CosmicEnvironment } from './CosmicEnvironment';
import { SpaceTrafficManager } from './SpaceTrafficManager';
import { ScannerAndInteractionManager } from './ScannerAndInteractionManager';
import { SpaceEventManager } from './SpaceEventManager';
export { flightInput };

// Procedural Planet Texture Generator
function createPlanetTexture(type: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  switch (type) {
    case 'mercury': {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 90; i++) {
        const cx = (i * 73) % canvas.width;
        const cy = (i * 47) % canvas.height;
        const r = 4 + (i % 9) * 4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let i = 0; i < 30; i++) {
        const cx = (i * 97) % canvas.width;
        const cy = (i * 59) % canvas.height;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'venus': {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#b45309');
      grad.addColorStop(0.3, '#d97706');
      grad.addColorStop(0.6, '#f59e0b');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fef08a';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.globalAlpha = 0.15 + 0.25 * Math.sin(y * 0.05);
        ctx.fillRect(0, y, canvas.width, 3);
      }
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#fcd34d';
      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.ellipse((i * 113) % canvas.width, 40 + i * 24, 80, 24, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      break;
    }
    case 'earth': {
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#15803d';
      for (let i = 0; i < 35; i++) {
        const cx = (i * 89) % canvas.width;
        const cy = 60 + ((i * 59) % 380);
        const r = 24 + (i % 8) * 16;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ca8a04';
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 14; i++) {
        const cx = (i * 137) % canvas.width;
        const cy = 100 + ((i * 41) % 300);
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.55;
      for (let y = 30; y < canvas.height - 30; y += 12) {
        ctx.beginPath();
        ctx.ellipse((y * 7) % canvas.width, y, 70 + Math.sin(y) * 40, 8, 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      break;
    }
    case 'mars': {
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#7c2d12';
      ctx.globalAlpha = 0.65;
      for (let i = 0; i < 40; i++) {
        const cx = (i * 67) % canvas.width;
        const cy = 50 + ((i * 53) % 400);
        ctx.beginPath();
        ctx.arc(cx, cy, 18 + (i % 6) * 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 20, 50, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2, canvas.height - 20, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      break;
    }
    case 'jupiter': {
      const bands = ['#c2410c', '#ea580c', '#fed7aa', '#9a3412', '#f97316', '#fdba74', '#c2410c', '#ea580c'];
      const bandHeight = canvas.height / bands.length;
      for (let i = 0; i < bands.length; i++) {
        ctx.fillStyle = bands[i];
        ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);
      }
      ctx.fillStyle = '#fff7ed';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.globalAlpha = 0.18 + 0.15 * Math.sin(y * 0.12);
        ctx.fillRect(0, y, canvas.width, 3);
      }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.65, canvas.height * 0.62, 55, 32, 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      break;
    }
    case 'saturn': {
      const bands = ['#d97706', '#f59e0b', '#fde68a', '#b45309', '#fbbf24', '#fef3c7'];
      const bandHeight = canvas.height / bands.length;
      for (let i = 0; i < bands.length; i++) {
        ctx.fillStyle = bands[i];
        ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);
      }
      ctx.fillStyle = '#ffffff';
      for (let y = 0; y < canvas.height; y += 6) {
        ctx.globalAlpha = 0.12 + 0.12 * Math.sin(y * 0.08);
        ctx.fillRect(0, y, canvas.width, 4);
      }
      ctx.globalAlpha = 1.0;
      break;
    }
    case 'uranus': {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#67e8f9');
      grad.addColorStop(1, '#0891b2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#cffafe';
      for (let y = 0; y < canvas.height; y += 8) {
        ctx.globalAlpha = 0.08 + 0.08 * Math.sin(y * 0.04);
        ctx.fillRect(0, y, canvas.width, 5);
      }
      ctx.globalAlpha = 1.0;
      break;
    }
    case 'neptune': {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1e3a8a');
      grad.addColorStop(0.4, '#2563eb');
      grad.addColorStop(0.7, '#1d4ed8');
      grad.addColorStop(1, '#172554');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#bfdbfe';
      ctx.globalAlpha = 0.45;
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.ellipse((i * 127) % canvas.width, 60 + i * 26, 90, 8, -0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      break;
    }
    default: {
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Saturn Ring Texture
function createRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'rgba(217, 119, 6, 0)');
  grad.addColorStop(0.15, 'rgba(245, 158, 11, 0.7)');
  grad.addColorStop(0.45, 'rgba(253, 230, 138, 0.85)');
  grad.addColorStop(0.55, 'rgba(30, 41, 59, 0.15)'); // Cassini Division gap
  grad.addColorStop(0.65, 'rgba(245, 158, 11, 0.65)');
  grad.addColorStop(0.9, 'rgba(251, 191, 36, 0.4)');
  grad.addColorStop(1, 'rgba(217, 119, 6, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}

// Procedural Sun Texture
function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.5, '#fbbf24');
  grad.addColorStop(1, '#f97316');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 60; i++) {
    const cx = (i * 47) % canvas.width;
    const cy = (i * 31) % canvas.height;
    ctx.beginPath();
    ctx.arc(cx, cy, 8 + (i % 5) * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

interface PlanetMeshNode {
  project: MissionProject;
  mesh: THREE.Mesh;
  group: THREE.Group;
  orbitLine: THREE.LineLoop;
  ringMesh?: THREE.Mesh;
  currentAngle: number;
}

export function SolarSystemScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const hoverPlanet = useMissionStore((state) => state.hoverPlanet);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Cosmic Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x091426, 0.75);
    scene.add(hemiLight);

    const sunLight = new THREE.PointLight(0xfff7ed, 3.6, 600, 0.4);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(30, 40, 50);
    scene.add(rimLight);

    // Dedicated Camera Chase Fill Light for Spacecraft Visibility
    const chaseCamLight = new THREE.DirectionalLight(0xe0f2fe, 1.25);
    scene.add(chaseCamLight);
    scene.add(chaseCamLight.target);

    // 3. Central Sun
    const sunGeom = new THREE.SphereGeometry(5.2, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      map: createSunTexture(),
      color: 0xffffff,
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sunMesh);

    // Sun atmospheric glow sprite
    const sunGlowCanvas = document.createElement('canvas');
    sunGlowCanvas.width = 128;
    sunGlowCanvas.height = 128;
    const glowCtx = sunGlowCanvas.getContext('2d')!;
    const glowGrad = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    glowGrad.addColorStop(0.35, 'rgba(249, 115, 22, 0.55)');
    glowGrad.addColorStop(0.7, 'rgba(234, 88, 12, 0.15)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    glowCtx.fillStyle = glowGrad;
    glowCtx.fillRect(0, 0, 128, 128);

    const glowTex = new THREE.CanvasTexture(sunGlowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffedd5,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(24, 24, 1);
    scene.add(glowSprite);

    // 4. (Layered Starfield & Volumetric Nebulae are created in CosmicEnvironment)

    // 5. Planetary System Construction
    const planetNodes: PlanetMeshNode[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    MISSION_PROJECTS.forEach((project, idx) => {
      const planetGroup = new THREE.Group();
      scene.add(planetGroup);

      // Planet Sphere
      const geom = new THREE.SphereGeometry(project.size, 36, 36);
      const texture = createPlanetTexture(project.surfaceTextureType);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.75,
        metalness: 0.15,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.userData = { projectId: project.id, planetName: project.planet };
      planetGroup.add(mesh);
      interactiveMeshes.push(mesh);

      // Saturn Rings
      let ringMesh: THREE.Mesh | undefined;
      if (project.hasRings) {
        const ringGeom = new THREE.RingGeometry(project.size * 1.45, project.size * 2.7, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          map: createRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          roughness: 0.5,
        });
        ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);
      }

      // Orbital ellipse path
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * project.orbitRadius, 0, Math.sin(theta) * project.orbitRadius));
      }
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.2,
      });
      const orbitLine = new THREE.LineLoop(orbitGeom, orbitMat);
      scene.add(orbitLine);

      // Initial angle spread
      const initialAngle = (idx * (Math.PI * 2)) / MISSION_PROJECTS.length + 0.4;
      planetGroup.position.set(
        Math.cos(initialAngle) * project.orbitRadius,
        0,
        Math.sin(initialAngle) * project.orbitRadius
      );

      planetNodes.push({
        project,
        mesh,
        group: planetGroup,
        orbitLine,
        ringMesh,
        currentAngle: initialAngle,
      });
    });

    // 5B. Cosmic Environment & Planetary Moons
    const planetMeshMap = new Map<string, THREE.Object3D>();
    planetNodes.forEach((node) => {
      planetMeshMap.set(node.project.planet, node.group);
    });

    const cosmicEnv = new CosmicEnvironment(scene, planetMeshMap);

    // 5C. Autonomous Space Traffic
    const trafficManager = new SpaceTrafficManager(scene);

    // 5D. Sensor Array & Scanner Manager
    const scannerManager = new ScannerAndInteractionManager(scene);

    // 5E. Dynamic Deep Space Ambient Events
    const eventManager = new SpaceEventManager();

    // 6. Controllable Sci-Fi Starfighter Spacecraft
    const starfighter = new Starfighter();
    const shipGroup = starfighter.group;
    shipGroup.position.set(0, 0, 32);
    scene.add(shipGroup);

    // Flight & Camera Controller
    const flightController = new FlightController();
    flightController.setTransform(shipGroup.position, 0, 0);

    let orbitAngle = 0;

    // Disengagement & Cooldown State Variables
    let disengagedPlanetId: string | null = null;
    let disengageCooldownUntil = 0;
    let prevPlanetId: string | null = null;

    // Orbit Disengagement Function (Resumes flight and launches ship outward into free space)
    const disengageOrbitAndLaunch = (launchBoost: boolean = true) => {
      const activeCurrentPlanet = useMissionStore.getState().currentPlanet;
      if (!activeCurrentPlanet) return;

      const activeNode = planetNodes.find((n) => n.project.id === activeCurrentPlanet);
      disengagedPlanetId = activeCurrentPlanet;
      disengageCooldownUntil = performance.now() + 5000; // 5s proximity immunity window

      if (activeNode) {
        // Calculate outward radial escape vector away from the planet
        const planetPos = activeNode.group.position;
        const escapeDir = new THREE.Vector3().subVectors(shipGroup.position, planetPos);
        escapeDir.y = 0;
        if (escapeDir.lengthSq() < 0.001) {
          escapeDir.set(0, 0, 1);
        } else {
          escapeDir.normalize();
        }

        const safeDist = activeNode.project.size * 3.6 + 6.0;
        const newPos = planetPos.clone().addScaledVector(escapeDir, safeDist);
        const heading = Math.atan2(escapeDir.x, escapeDir.z);
        const launchSpeed = launchBoost ? 24.0 : 18.0;

        shipGroup.position.copy(newPos);
        shipGroup.rotation.set(0, heading, 0);
        flightController.setTransform(newPos, heading, launchSpeed);

        flightInput.forward = true;
        setTimeout(() => {
          flightInput.forward = false;
        }, 400);
      }

      // Disengage in store
      selectPlanet(null);
    };

    // Expose globally for UI button triggers
    (window as unknown as { __launchShipFromOrbit?: () => void }).__launchShipFromOrbit = () => {
      disengageOrbitAndLaunch(true);
    };

    // 7. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pId = hit.userData.projectId;
        container.style.cursor = 'pointer';

        const hitPos = new THREE.Vector3();
        hit.getWorldPosition(hitPos);
        hitPos.project(camera);

        const screenX = ((hitPos.x + 1) * window.innerWidth) / 2;
        const screenY = ((-hitPos.y + 1) * window.innerHeight) / 2;

        hoverPlanet(pId, { x: screenX, y: screenY });

        planetNodes.forEach((node) => {
          if (node.project.id === pId) {
            (node.orbitLine.material as THREE.LineBasicMaterial).opacity = 0.8;
            (node.orbitLine.material as THREE.LineBasicMaterial).color.setHex(0x38bdf8);
          } else {
            (node.orbitLine.material as THREE.LineBasicMaterial).opacity = 0.15;
          }
        });
      } else {
        container.style.cursor = 'default';
        hoverPlanet(null, null);

        planetNodes.forEach((node) => {
          const isSelected = node.project.id === useMissionStore.getState().currentPlanet;
          (node.orbitLine.material as THREE.LineBasicMaterial).opacity = isSelected ? 0.6 : 0.2;
        });
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pId = hit.userData.projectId;
        selectPlanet(pId);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handleClick);

    // 8. Keyboard Controls Event Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();

      // If in orbit around a planet, pressing W, ArrowUp, Space, Enter, or Escape disengages orbit and launches the ship!
      const inOrbit = !!useMissionStore.getState().currentPlanet;
      if (inOrbit && (k === 'w' || e.key === 'ArrowUp' || e.code === 'Space' || e.key === 'Escape' || e.key === 'Enter')) {
        disengageOrbitAndLaunch(true);
        return;
      }

      // Sensor Scanner Ping (Key V or X)
      if (k === 'v' || k === 'x') {
        scannerManager.triggerScannerPing(shipGroup.position);
      }

      if (k === 'w' || e.key === 'ArrowUp') flightInput.forward = true;
      if (k === 's' || e.key === 'ArrowDown') flightInput.backward = true;
      if (k === 'a' || e.key === 'ArrowLeft') flightInput.left = true;
      if (k === 'd' || e.key === 'ArrowRight') flightInput.right = true;
      if (k === 'q') flightInput.rollLeft = true;
      if (k === 'e') flightInput.rollRight = true;
      if (e.shiftKey) flightInput.boost = true;
      if (e.code === 'Space') flightInput.brake = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') flightInput.forward = false;
      if (k === 's' || e.key === 'ArrowDown') flightInput.backward = false;
      if (k === 'a' || e.key === 'ArrowLeft') flightInput.left = false;
      if (k === 'd' || e.key === 'ArrowRight') flightInput.right = false;
      if (k === 'q') flightInput.rollLeft = false;
      if (k === 'e') flightInput.rollRight = false;
      if (!e.shiftKey) flightInput.boost = false;
      if (e.code === 'Space') flightInput.brake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 9. Animation & Flight Simulation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Sun Rotation
      sunMesh.rotation.y += 0.002;

      // Update Starfighter internal animations (idle hover, multi-stage plumes, strobes, canards)
      starfighter.update(delta, flightInput, flightController.currentSpeed);

      // Update Cosmic Subsystems (Asteroid belt, moons, station rotations, beacons)
      cosmicEnv.update(delta);

      // Update Autonomous Space Traffic (Freighters, patrols, shuttles)
      trafficManager.update(delta);

      // Update Deep Space Sensor Scanner & Proximity Interaction
      const planetsData = planetNodes.map((n) => ({
        id: n.project.id,
        name: n.project.planet,
        position: n.group.position,
        size: n.project.size,
      }));
      scannerManager.update(
        delta,
        shipGroup.position,
        planetsData,
        cosmicEnv.spaceStations,
        trafficManager.vessels
      );

      // Update Deep Space Ambient Events
      eventManager.update(delta);

      // Update Camera Chase Fill Light to illuminate ship metallic surfaces
      chaseCamLight.position.copy(camera.position);
      chaseCamLight.target.position.copy(shipGroup.position);
      chaseCamLight.target.updateMatrixWorld();

      // Update Planet Orbits & Axial Rotations
      planetNodes.forEach((node) => {
        const isCurrent = node.project.id === useMissionStore.getState().currentPlanet;
        const orbitMultiplier = isCurrent ? 0.04 : 0.35;
        node.currentAngle += node.project.orbitSpeed * delta * orbitMultiplier;

        node.group.position.x = Math.cos(node.currentAngle) * node.project.orbitRadius;
        node.group.position.z = Math.sin(node.currentAngle) * node.project.orbitRadius;

        node.mesh.rotation.y += node.project.rotationSpeed;
      });

      const storeState = useMissionStore.getState();
      const currentPlanetId = storeState.currentPlanet;
      const targetPlanetId = storeState.targetPlanet;
      const isAutopilot = storeState.isAutopilot;

      // External Orbit Disengagement Detection (e.g. from UI buttons calling selectPlanet(null))
      if (prevPlanetId && !currentPlanetId) {
        disengagedPlanetId = prevPlanetId;
        disengageCooldownUntil = performance.now() + 5000; // 5s immunity cooldown
        const prevNode = planetNodes.find((n) => n.project.id === prevPlanetId);
        if (prevNode) {
          const planetPos = prevNode.group.position;
          const escapeDir = new THREE.Vector3().subVectors(shipGroup.position, planetPos);
          escapeDir.y = 0;
          if (escapeDir.lengthSq() < 0.001) escapeDir.set(0, 0, 1);
          else escapeDir.normalize();

          const safeDist = prevNode.project.size * 3.6 + 6.0;
          const newPos = planetPos.clone().addScaledVector(escapeDir, safeDist);
          const heading = Math.atan2(escapeDir.x, escapeDir.z);
          shipGroup.position.copy(newPos);
          shipGroup.rotation.set(0, heading, 0);
          flightController.setTransform(newPos, heading, 18.0);
        }
      }
      prevPlanetId = currentPlanetId;

      // ================= FLIGHT LOGIC =================
      if (currentPlanetId) {
        // --- 1. ORBIT MODE: Spacecraft locked in orbit around selected planet ---
        const activeNode = planetNodes.find((n) => n.project.id === currentPlanetId);
        if (activeNode) {
          const planetPos = activeNode.group.position;
          const orbitDist = activeNode.project.size * 3.0;
          orbitAngle += delta * 0.45;

          const shipOrbitX = planetPos.x + Math.cos(orbitAngle) * orbitDist;
          const shipOrbitZ = planetPos.z + Math.sin(orbitAngle) * orbitDist;
          const shipOrbitY = planetPos.y + 0.6;

          shipGroup.position.lerp(new THREE.Vector3(shipOrbitX, shipOrbitY, shipOrbitZ), 0.08);
          shipGroup.lookAt(planetPos);

          flightController.setTransform(shipGroup.position, shipGroup.rotation.y, 0);
        }
      } else if (isAutopilot && targetPlanetId) {
        // --- 2. AUTO PILOT MODE: Steering automatically towards target planet ---
        const targetNode = planetNodes.find((n) => n.project.id === targetPlanetId);
        if (targetNode) {
          const targetPos = targetNode.group.position;
          const toTarget = new THREE.Vector3().subVectors(targetPos, shipGroup.position);
          const distToTarget = toTarget.length();

          // Auto-arrive when within interaction proximity (~5 units)
          if (distToTarget < targetNode.project.size * 3.5 || distToTarget < 6.5) {
            selectPlanet(targetNode.project.id);
          } else {
            toTarget.normalize();
            // Steer towards target
            const targetHeading = Math.atan2(toTarget.x, toTarget.z);
            flightController.heading = THREE.MathUtils.lerp(flightController.heading, targetHeading, 0.08);

            const cruiseSpeed = 22.0;
            flightController.currentSpeed = THREE.MathUtils.lerp(flightController.currentSpeed, cruiseSpeed, 0.06);

            shipGroup.position.addScaledVector(toTarget, flightController.currentSpeed * delta);
            shipGroup.rotation.set(0, flightController.heading, 0);
            flightController.position.copy(shipGroup.position);
          }
        }
      } else {
        // --- 3. FREE FLIGHT MODE: Controllable spacecraft with WASD / joystick ---
        const flightState = flightController.updatePhysics(delta, flightInput);
        shipGroup.position.copy(flightState.position);
        shipGroup.rotation.copy(flightState.rotation);

        // Proximity Detection Check with Planets
        planetNodes.forEach((node) => {
          // If this planet was just disengaged, grant immunity cooldown during launch
          const curTime = performance.now();
          if (node.project.id === disengagedPlanetId && curTime < disengageCooldownUntil) {
            return;
          }

          const dist = shipGroup.position.distanceTo(node.group.position);
          const threshold = node.project.size * 2.8 + 2.5;

          if (dist < threshold && flightState.speed > 0) {
            // Automatically enter orbit!
            selectPlanet(node.project.id);
          }
        });
      }

      // ================= CAMERA ROUTING (FLIGHT / ORBIT / CINEMATIC / ISOMETRIC / CHART) =================
      const activeCameraMode = storeState.cameraMode;
      if (activeCameraMode === 'chart') {
        flightController.updateChartCamera(camera, delta);
      } else if (activeCameraMode === 'isometric') {
        flightController.updateIsometricCamera(camera, shipGroup, delta);
      } else if (activeCameraMode === 'cinematic') {
        flightController.updateCinematicCamera(camera, shipGroup, delta);
      } else if (activeCameraMode === 'orbit') {
        if (currentPlanetId) {
          const activeNode = planetNodes.find((n) => n.project.id === currentPlanetId);
          if (activeNode) {
            flightController.updateOrbitCamera(camera, activeNode.group.position, activeNode.project.size, delta);
          }
        } else {
          flightController.updateOrbitCamera(camera, shipGroup.position, 5.0, delta);
        }
      } else {
        // Default 'flight' mode
        if (currentPlanetId) {
          const activeNode = planetNodes.find((n) => n.project.id === currentPlanetId);
          if (activeNode) {
            flightController.updateOrbitCamera(camera, activeNode.group.position, activeNode.project.size, delta);
          }
        } else {
          flightController.updateCamera(camera, shipGroup, delta, flightInput);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      delete (window as unknown as { __launchShipFromOrbit?: () => void }).__launchShipFromOrbit;
      delete (window as unknown as { __triggerScannerPing?: () => void }).__triggerScannerPing;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectPlanet, hoverPlanet]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
}
