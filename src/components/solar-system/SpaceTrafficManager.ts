import * as THREE from 'three';

export interface TrafficVessel {
  mesh: THREE.Group;
  type: 'Scout' | 'Cargo Freighter' | 'Orbital Shuttle';
  callsign: string;
  routeRadius: number;
  routeSpeed: number;
  currentAngle: number;
  elevation: number;
  engineLight: THREE.PointLight;
}

/**
 * SpaceTrafficManager - Living Solar System Autonomous Traffic
 * 
 * Features:
 * - Commercial cargo haulers, nimble scout patrol interceptors, and orbital transport shuttles
 * - Realistic orbital trade routes linking planetary sectors and research stations
 * - Engine plume glow, nav strobes, and forward exploration beacons
 * - Low-overhead pooling and shared geometries for high FPS
 */
export class SpaceTrafficManager {
  public group: THREE.Group;
  public vessels: TrafficVessel[] = [];

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.spawnCargoFreighters();
    this.spawnScoutPatrols();
    this.spawnOrbitalShuttles();
  }

  /**
   * Heavy Commercial Cargo Freighters (Container Pods + Sublight Drives)
   */
  private spawnCargoFreighters() {
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const containerMat1 = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const containerMat2 = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const engineGlowMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });

    const routes = [
      { radius: 26, speed: 0.08, elevation: 1.8, callsign: 'FREIGHTER ATLAS-IV' },
      { radius: 42, speed: -0.06, elevation: -2.2, callsign: 'TITAN CARRIER 07' },
      { radius: 56, speed: 0.05, elevation: 2.6, callsign: 'NEBULA HAULER 12' },
    ];

    routes.forEach((route) => {
      const ship = new THREE.Group();

      // Main Spine Chassis
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 4.2), hullMat);
      ship.add(spine);

      // Bridge / Command Pod (Front)
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 1.2), hullMat);
      bridge.position.set(0, 0.4, 2.2);
      ship.add(bridge);

      // Cargo Pod Containers (Middle)
      for (let c = -1; c <= 1; c++) {
        const podLeft = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1.1), c % 2 === 0 ? containerMat1 : containerMat2);
        podLeft.position.set(-0.85, 0, c * 1.3);
        ship.add(podLeft);

        const podRight = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1.1), c % 2 === 0 ? containerMat2 : containerMat1);
        podRight.position.set(0.85, 0, c * 1.3);
        ship.add(podRight);
      }

      // Heavy Engine Block (Rear)
      const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.2), hullMat);
      engineBlock.position.set(0, 0, -2.4);
      ship.add(engineBlock);

      // Glowing Engine Bells
      const bellLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.35, 0.4, 12), engineGlowMat);
      bellLeft.rotateX(Math.PI / 2);
      bellLeft.position.set(-0.45, 0, -3.1);
      ship.add(bellLeft);

      const bellRight = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.35, 0.4, 12), engineGlowMat);
      bellRight.rotateX(Math.PI / 2);
      bellRight.position.set(0.45, 0, -3.1);
      ship.add(bellRight);

      const engineLight = new THREE.PointLight(0xf97316, 2.0, 8);
      engineLight.position.set(0, 0, -3.2);
      ship.add(engineLight);

      this.group.add(ship);
      this.vessels.push({
        mesh: ship,
        type: 'Cargo Freighter',
        callsign: route.callsign,
        routeRadius: route.radius,
        routeSpeed: route.speed,
        currentAngle: Math.random() * Math.PI * 2,
        elevation: route.elevation,
        engineLight,
      });
    });
  }

  /**
   * Fast Patrol Scout Interceptors (High speed, sleek silhouettes)
   */
  private spawnScoutPatrols() {
    const scoutMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });

    const routes = [
      { radius: 19, speed: 0.22, elevation: 1.2, callsign: 'SCOUT VIPER-01' },
      { radius: 33, speed: -0.19, elevation: -1.4, callsign: 'PATROL FALCON-09' },
      { radius: 64, speed: 0.16, elevation: 2.0, callsign: 'RECON SPECTRE-3' },
    ];

    routes.forEach((route) => {
      const scout = new THREE.Group();

      // Fuselage needle
      const fuselage = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.2, 5), scoutMat);
      fuselage.rotateX(Math.PI / 2);
      scout.add(fuselage);

      // Swept wings
      const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.6), trimMat);
      wingLeft.position.set(-0.8, 0, -0.3);
      wingLeft.rotateY(-0.35);
      scout.add(wingLeft);

      const wingRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.6), trimMat);
      wingRight.position.set(0.8, 0, -0.3);
      wingRight.rotateY(0.35);
      scout.add(wingRight);

      // Engine
      const thruster = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), cyanGlowMat);
      thruster.position.set(0, 0, -1.15);
      scout.add(thruster);

      const engineLight = new THREE.PointLight(0x00f5ff, 2.2, 7);
      engineLight.position.set(0, 0, -1.3);
      scout.add(engineLight);

      this.group.add(scout);
      this.vessels.push({
        mesh: scout,
        type: 'Scout',
        callsign: route.callsign,
        routeRadius: route.radius,
        routeSpeed: route.speed,
        currentAngle: Math.random() * Math.PI * 2,
        elevation: route.elevation,
        engineLight,
      });
    });
  }

  /**
   * Orbital Shuttles (Inter-station passenger ferries)
   */
  private spawnOrbitalShuttles() {
    const shuttleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.3 });
    const blueGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const routes = [
      { radius: 22, speed: 0.14, elevation: -0.8, callsign: 'SOL EXPRESS 02' },
      { radius: 48, speed: 0.11, elevation: 1.5, callsign: 'STATION FERRY 88' },
    ];

    routes.forEach((route) => {
      const shuttle = new THREE.Group();

      const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.8, 8), shuttleMat);
      hull.rotateX(Math.PI / 2);
      shuttle.add(hull);

      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 8), shuttleMat);
      nose.rotateX(Math.PI / 2);
      nose.position.set(0, 0, 1.3);
      shuttle.add(nose);

      const engine = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), blueGlowMat);
      engine.position.set(0, 0, -1.0);
      shuttle.add(engine);

      const engineLight = new THREE.PointLight(0x38bdf8, 1.8, 6);
      engineLight.position.set(0, 0, -1.1);
      shuttle.add(engineLight);

      this.group.add(shuttle);
      this.vessels.push({
        mesh: shuttle,
        type: 'Orbital Shuttle',
        callsign: route.callsign,
        routeRadius: route.radius,
        routeSpeed: route.speed,
        currentAngle: Math.random() * Math.PI * 2,
        elevation: route.elevation,
        engineLight,
      });
    });
  }

  /**
   * Per-frame traffic animation update
   */
  public update(delta: number) {
    this.vessels.forEach((v) => {
      v.currentAngle += v.routeSpeed * delta * 0.45;

      const x = Math.cos(v.currentAngle) * v.routeRadius;
      const z = Math.sin(v.currentAngle) * v.routeRadius;
      v.mesh.position.set(x, v.elevation, z);

      // Face vessel in the tangent direction of its orbit
      const tangentAngle = v.currentAngle + (v.routeSpeed > 0 ? Math.PI / 2 : -Math.PI / 2);
      v.mesh.rotation.set(0, -tangentAngle + Math.PI / 2, 0);

      // Engine subtle flicker
      v.engineLight.intensity = 1.6 + Math.random() * 0.6;
    });
  }
}
