import * as THREE from 'three';

export interface CelestialMoon {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  currentAngle: number;
  parentPlanetMesh: THREE.Object3D;
}

export interface SpaceStation {
  group: THREE.Group;
  id: string;
  name: string;
  type: 'Space Station' | 'Relay Beacon';
  description: string;
  solarArrays?: THREE.Object3D[];
  commDish?: THREE.Object3D;
}

export interface NavigationBeacon {
  group: THREE.Group;
  strobeLight: THREE.PointLight;
  strobeMat: THREE.MeshBasicMaterial;
  coords: THREE.Vector3;
}

/**
 * CosmicEnvironment - High-Fidelity Deep Space Universe
 * 
 * Includes:
 * - Multi-layered starfield (near, mid, far with color variation & depth)
 * - Volumetric glowing cosmic nebula gas clouds
 * - Instanced Asteroid Belt (1,200 tumbling asteroids with Keplerian orbit)
 * - Planetary Moons (Luna, Europa, Io, Titan)
 * - Points of Interest:
 *   1. Orbital Research Citadel (rotating solar arrays, docking ring, runway lights)
 *   2. Deep Space Communications Relay (rotating high-gain dish, signal beacon)
 *   3. Asteroid Mining Rig (industrial amber beacons, refinery core)
 * - Navigation Waypoint Beacons marking sector routes
 */
export class CosmicEnvironment {
  public group: THREE.Group;

  // Moons
  private moons: CelestialMoon[] = [];

  // Points of Interest Stations
  public spaceStations: SpaceStation[] = [];
  public beacons: NavigationBeacon[] = [];

  // Nebulae Sprites
  private nebulaGroup: THREE.Group;

  constructor(scene: THREE.Scene, planetMeshMap: Map<string, THREE.Object3D>) {
    this.group = new THREE.Group();
    scene.add(this.group);

    // ==========================================
    // 1. MULTI-LAYERED DEEP STARFIELD
    // ==========================================
    this.createMultiLayerStarfield();

    // ==========================================
    // 2. VOLUMETRIC NEBULA CLOUDS
    // ==========================================
    this.nebulaGroup = new THREE.Group();
    this.group.add(this.nebulaGroup);
    this.createNebulaClouds();

    // ==========================================
    // 3. PLANETARY MOONS
    // ==========================================
    this.createMoons(planetMeshMap);

    // ==========================================
    // 5. POINTS OF INTEREST: SPACE STATIONS & RELAYS
    // ==========================================
    this.createSpaceStations();

    // ==========================================
    // 6. NAVIGATION WAYPOINT BEACONS
    // ==========================================
    this.createNavigationBeacons();
  }

  /**
   * Multi-layered starfield with near/mid/far layers for organic depth
   */
  private createMultiLayerStarfield() {
    const layerConfigs = [
      { count: 3200, minR: 450, maxR: 1200, size: 1.2, opacity: 0.75, color: 0x93c5fd },
      { count: 1800, minR: 300, maxR: 850, size: 2.2, opacity: 0.88, color: 0x38bdf8 },
      { count: 350, minR: 150, maxR: 450, size: 3.4, opacity: 0.95, color: 0xffffff },
    ];

    layerConfigs.forEach((cfg) => {
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(cfg.count * 3);
      const col = new Float32Array(cfg.count * 3);
      const baseColor = new THREE.Color(cfg.color);

      for (let i = 0; i < cfg.count; i++) {
        const radius = cfg.minR + Math.random() * (cfg.maxR - cfg.minR);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = radius * Math.cos(phi);

        // Subtle color shifting (cyan, deep sapphire, gold, white)
        const shift = Math.random();
        if (shift > 0.85) {
          col[i * 3] = 0.95;
          col[i * 3 + 1] = 0.82;
          col[i * 3 + 2] = 0.55;
        } else if (shift > 0.6) {
          col[i * 3] = 0.45;
          col[i * 3 + 1] = 0.85;
          col[i * 3 + 2] = 1.0;
        } else {
          col[i * 3] = baseColor.r;
          col[i * 3 + 1] = baseColor.g;
          col[i * 3 + 2] = baseColor.b;
        }
      }

      geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(col, 3));

      const mat = new THREE.PointsMaterial({
        size: cfg.size,
        vertexColors: true,
        transparent: true,
        opacity: cfg.opacity,
      });

      const p = new THREE.Points(geom, mat);
      this.group.add(p);
    });
  }

  /**
   * Procedural Volumetric Nebula Cloud Sprites
   */
  private createNebulaClouds() {
    const nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = 256;
    nebulaCanvas.height = 256;
    const ctx = nebulaCanvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.22)');
    grad.addColorStop(0.7, 'rgba(168, 85, 247, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(nebulaCanvas);

    const nebulaMat1 = new THREE.SpriteMaterial({
      map: tex,
      color: 0x38bdf8,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.45,
    });

    const nebulaMat2 = new THREE.SpriteMaterial({
      map: tex,
      color: 0xa855f7,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.35,
    });

    // Scatter 12 vast celestial nebula patches on the perimeter
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + Math.random() * 0.3;
      const dist = 380 + Math.random() * 220;
      const sprite = new THREE.Sprite(i % 2 === 0 ? nebulaMat1 : nebulaMat2);
      sprite.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 120,
        Math.sin(angle) * dist
      );
      const scale = 140 + Math.random() * 100;
      sprite.scale.set(scale, scale, 1);
      this.nebulaGroup.add(sprite);
    }
  }

  /**
   * Moons orbiting Earth, Jupiter, and Saturn
   */
  private createMoons(planetMeshMap: Map<string, THREE.Object3D>) {
    const moonConfigs = [
      { planet: 'Earth', name: 'Luna', size: 0.45, dist: 3.6, speed: 0.8, color: 0x94a3b8 },
      { planet: 'Jupiter', name: 'Europa', size: 0.55, dist: 5.8, speed: 0.7, color: 0xe0f2fe },
      { planet: 'Jupiter', name: 'Io', size: 0.48, dist: 4.4, speed: 1.1, color: 0xfef08a },
      { planet: 'Saturn', name: 'Titan', size: 0.65, dist: 6.2, speed: 0.6, color: 0xfbbf24 },
    ];

    moonConfigs.forEach((cfg) => {
      const parentMesh = planetMeshMap.get(cfg.planet);
      if (!parentMesh) return;

      const geom = new THREE.SphereGeometry(cfg.size, 20, 20);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.8,
        metalness: 0.1,
      });

      const moonMesh = new THREE.Mesh(geom, mat);
      moonMesh.userData = { isMoon: true, name: cfg.name, parent: cfg.planet };
      this.group.add(moonMesh);

      this.moons.push({
        mesh: moonMesh,
        orbitRadius: cfg.dist,
        orbitSpeed: cfg.speed,
        currentAngle: Math.random() * Math.PI * 2,
        parentPlanetMesh: parentMesh,
      });
    });
  }

  /**
   * Points of Interest: Space Stations & Comm Relay Arrays
   */
  private createSpaceStations() {
    // 1. Orbital Research Citadel (Outer Sector Deep Space Science Hub)
    const citadelGroup = new THREE.Group();
    citadelGroup.position.set(54, 8.0, -38);

    // Central Habitat Hub (Sleek High-Tech Sci-Fi Core)
    const hubGeom = new THREE.CylinderGeometry(0.8, 1.0, 1.2, 8);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0f172a,
    });
    const hub = new THREE.Mesh(hubGeom, hubMat);
    citadelGroup.add(hub);

    // Observation Ring & Docking Port
    const ringGeom = new THREE.TorusGeometry(1.6, 0.12, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    citadelGroup.add(ring);

    // Rotating Solar Panel Arrays (Proportional sleek sci-fi wings)
    const solarWingGeom = new THREE.BoxGeometry(2.4, 0.03, 0.7);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
    });

    const solarWingLeft = new THREE.Mesh(solarWingGeom, solarMat);
    solarWingLeft.position.set(-2.4, 0, 0);
    citadelGroup.add(solarWingLeft);

    const solarWingRight = new THREE.Mesh(solarWingGeom, solarMat);
    solarWingRight.position.set(2.4, 0, 0);
    citadelGroup.add(solarWingRight);

    // Docking Bay Beacon Light
    const stationLight = new THREE.PointLight(0x00f5ff, 2.5, 12);
    stationLight.position.set(0, 1.5, 0);
    citadelGroup.add(stationLight);

    this.group.add(citadelGroup);
    this.spaceStations.push({
      group: citadelGroup,
      id: 'citadel-station',
      name: 'Alpha Research Citadel',
      type: 'Space Station',
      description: 'Major orbital research facility specializing in deep-space telemetry and React UI micro-interaction frameworks.',
      solarArrays: [solarWingLeft, solarWingRight],
    });

    // 2. Deep Space Communications Relay (Near Asteroid Belt / Jupiter Sector)
    const relayGroup = new THREE.Group();
    relayGroup.position.set(-42, -2.5, 34);

    // Tower Spire
    const towerGeom = new THREE.CylinderGeometry(0.2, 0.6, 5.5, 6);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.88,
      roughness: 0.2,
    });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    relayGroup.add(tower);

    // Revolving Parabolic Comm Dish
    const dishGeom = new THREE.SphereGeometry(1.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.95,
      roughness: 0.1,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.position.set(0, 2.8, 0);
    dish.rotation.x = -Math.PI / 3;
    relayGroup.add(dish);

    // Beacon Pulse Light
    const relayPulse = new THREE.PointLight(0xf59e0b, 3.0, 16);
    relayPulse.position.set(0, 3.4, 0);
    relayGroup.add(relayPulse);

    this.group.add(relayGroup);
    this.spaceStations.push({
      group: relayGroup,
      id: 'relay-array',
      name: 'Sol Deep Space Relay 09',
      type: 'Relay Beacon',
      description: 'Quantum transceiver transmitting high-bandwidth project repository synchronizations across Sol systems.',
      commDish: dish,
    });
  }

  /**
   * Navigation Waypoint Beacons marking sector boundaries
   */
  private createNavigationBeacons() {
    const beaconCoords = [
      new THREE.Vector3(14, 0, 18),
      new THREE.Vector3(-22, 1.2, -18),
      new THREE.Vector3(34, -0.8, 22),
      new THREE.Vector3(-45, 0.6, -32),
    ];

    const beaconPoleGeom = new THREE.CylinderGeometry(0.06, 0.09, 2.2, 6);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });

    beaconCoords.forEach((coord, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.copy(coord);

      const pole = new THREE.Mesh(beaconPoleGeom, poleMat);
      bGroup.add(pole);

      const strobeMat = new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x00f5ff : 0xf59e0b });
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), strobeMat);
      lamp.position.set(0, 1.2, 0);
      bGroup.add(lamp);

      const strobeLight = new THREE.PointLight(idx % 2 === 0 ? 0x00f5ff : 0xf59e0b, 1.6, 8);
      strobeLight.position.set(0, 1.2, 0);
      bGroup.add(strobeLight);

      this.group.add(bGroup);
      this.beacons.push({
        group: bGroup,
        strobeLight,
        strobeMat,
        coords: coord,
      });
    });
  }

  /**
   * Per-frame animation update for moons, stations & beacon strobes
   */
  public update(delta: number) {
    // 1. Moons Orbiting Parent Planets
    this.moons.forEach((m) => {
      m.currentAngle += m.orbitSpeed * delta * 0.6;
      const parentPos = new THREE.Vector3();
      m.parentPlanetMesh.getWorldPosition(parentPos);

      m.mesh.position.set(
        parentPos.x + Math.cos(m.currentAngle) * m.orbitRadius,
        parentPos.y + Math.sin(m.currentAngle * 0.5) * 0.4,
        parentPos.z + Math.sin(m.currentAngle) * m.orbitRadius
      );
      m.mesh.rotation.y += 0.01;
    });

    // 2. Space Stations Internal Rotations
    this.spaceStations.forEach((station) => {
      station.group.rotation.y += 0.002;
      if (station.solarArrays) {
        station.solarArrays.forEach((arr) => {
          arr.rotation.x += 0.004;
        });
      }
      if (station.commDish) {
        station.commDish.rotation.z += 0.006;
      }
    });

    // 3. Navigation Beacons Blinking Strobes
    const time = performance.now() * 0.001;
    this.beacons.forEach((b, idx) => {
      const isFlash = Math.sin(time * 3.5 + idx) > 0.4;
      b.strobeLight.intensity = isFlash ? 2.4 : 0.2;
    });
  }
}
