import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AssetManager } from '../assets/AssetManager';

export type TrafficBehavior = 'Cruising' | 'Docking' | 'Patrolling' | 'EnteringWarp';

export interface TrafficVessel {
  rootNode: TransformNode;
  type: 'Cargo Freighter' | 'Scout Interceptor' | 'Mining Harvester' | 'Orbital Transport' | 'Security Drone';
  callsign: string;
  routeRadius: number;
  routeSpeed: number;
  currentAngle: number;
  elevation: number;
  state: TrafficBehavior;
  destination: string;
  hullMesh: Mesh;
  engineLights: Mesh[];
}

/**
 * SpaceTraffic - Autonomous Living Solar System Traffic with Route Scheduling & States
 */
export class SpaceTraffic {
  public rootNode: TransformNode;
  public vessels: TrafficVessel[] = [];

  constructor(scene: Scene) {
    this.rootNode = new TransformNode('spaceTrafficRoot', scene);

    this.spawnCargoFreighters(scene);
    this.spawnScoutInterceptors(scene);
    this.spawnMiningHarvesters(scene);
    this.spawnOrbitalTransports(scene);
  }

  /**
   * 1. Heavy Cargo Freighters (Connecting Citadel Hub and Industrial Mining Rig)
   */
  private spawnCargoFreighters(scene: Scene) {
    const pbrHull = new PBRMaterial('pbrFreighterHull', scene);
    pbrHull.albedoColor = new Color3(0.22, 0.26, 0.34);
    pbrHull.metallic = 0.82;
    pbrHull.roughness = 0.32;

    const pbrCargo1 = new PBRMaterial('pbrCargoAmber', scene);
    pbrCargo1.albedoColor = new Color3(0.85, 0.45, 0.08);
    const pbrCargo2 = new PBRMaterial('pbrCargoCyan', scene);
    pbrCargo2.albedoColor = new Color3(0.08, 0.58, 0.82);

    const engMat = new StandardMaterial('heavyEngMat', scene);
    engMat.emissiveColor = new Color3(1.0, 0.42, 0.05);

    const routes = [
      { radius: 30, speed: 0.065, elevation: 2.2, callsign: 'ATLAS FREIGHTER-01', dest: 'Aegis Citadel' },
      { radius: 44, speed: -0.052, elevation: -1.8, callsign: 'TITAN HAULER-04', dest: 'Mining Apex-7' },
      { radius: 62, speed: 0.042, elevation: 3.1, callsign: 'NEBULA CONVOY-09', dest: 'Jupiter Orbit' },
    ];

    routes.forEach((r, idx) => {
      const vesselNode = new TransformNode(`freighter_${idx}`, scene);
      vesselNode.parent = this.rootNode;

      // Heavy Long Fuselage Spine
      const spine = MeshBuilder.CreateBox(`fSpine_${idx}`, { width: 1.1, height: 1.0, depth: 4.8 }, scene);
      spine.material = pbrHull;
      spine.parent = vesselNode;

      // Bridge Command Deck
      const bridge = MeshBuilder.CreateBox(`fBridge_${idx}`, { width: 1.4, height: 0.8, depth: 1.4 }, scene);
      bridge.position = new Vector3(0, 0.55, 2.4);
      bridge.material = pbrHull;
      bridge.parent = vesselNode;

      // Modular Cargo Pods
      for (let c = 0; c < 3; c++) {
        const pod = MeshBuilder.CreateBox(`fPod_${idx}_${c}`, { width: 1.6, height: 1.2, depth: 1.1 }, scene);
        pod.position = new Vector3(0, 0, -0.9 + c * 1.3);
        pod.material = c % 2 === 0 ? pbrCargo1 : pbrCargo2;
        pod.parent = vesselNode;
      }

      // Twin Heavy Ion Thruster Nozzles
      const engineLights: Mesh[] = [];
      for (let e = -1; e <= 1; e += 2) {
        const eng = MeshBuilder.CreateCylinder(`fEng_${idx}_${e}`, { height: 0.9, diameter: 0.55 }, scene);
        eng.rotation.x = Math.PI / 2;
        eng.position = new Vector3(e * 0.65, 0, -2.6);
        eng.material = engMat;
        eng.parent = vesselNode;
        engineLights.push(eng);
      }

      vesselNode.metadata = {
        name: r.callsign,
        type: 'ship',
        shipType: 'Cargo Freighter',
        destination: r.dest,
        state: 'Cruising',
      };

      this.vessels.push({
        rootNode: vesselNode,
        type: 'Cargo Freighter',
        callsign: r.callsign,
        routeRadius: r.radius,
        routeSpeed: r.speed,
        currentAngle: idx * 2.1,
        elevation: r.elevation,
        state: 'Cruising',
        destination: r.dest,
        hullMesh: spine,
        engineLights,
      });
    });
  }

  /**
   * 2. Scout Interceptors (Patrolling Inner System Corridors)
   */
  private spawnScoutInterceptors(scene: Scene) {
    const pbrScout = new PBRMaterial('pbrScoutMat', scene);
    pbrScout.albedoColor = new Color3(0.12, 0.15, 0.2);
    pbrScout.metallic = 0.92;
    pbrScout.roughness = 0.18;

    const engMat = new StandardMaterial('scoutEngMat', scene);
    engMat.emissiveColor = new Color3(0.15, 0.85, 1.0);

    const routes = [
      { radius: 22, speed: 0.15, elevation: 3.4, callsign: 'VANGUARD PATROL-01', dest: 'Inner Perimeter' },
      { radius: 37, speed: -0.13, elevation: -2.6, callsign: 'ECHO INTERCEPTOR-03', dest: 'Earth Orbit' },
      { radius: 78, speed: 0.11, elevation: 2.1, callsign: 'OUTER RECON-07', dest: 'Saturn Sector' },
    ];

    routes.forEach((r, idx) => {
      const vesselNode = new TransformNode(`scout_${idx}`, scene);
      vesselNode.parent = this.rootNode;

      const body = MeshBuilder.CreateCylinder(`scoutHull_${idx}`, { height: 2.4, diameterTop: 0.12, diameterBottom: 0.8, tessellation: 4 }, scene);
      body.rotation.x = Math.PI / 2;
      body.material = pbrScout;
      body.parent = vesselNode;

      const thruster = MeshBuilder.CreateCylinder(`scoutThruster_${idx}`, { height: 0.4, diameter: 0.35 }, scene);
      thruster.rotation.x = Math.PI / 2;
      thruster.position = new Vector3(0, 0, -1.3);
      thruster.material = engMat;
      thruster.parent = vesselNode;

      vesselNode.metadata = {
        name: r.callsign,
        type: 'ship',
        shipType: 'Scout Interceptor',
        destination: r.dest,
        state: 'Patrolling',
      };

      // Load Sketchfab NPC Spaceship (UID: 9a81a5167c474530881e55127e275c6c)
      const assetManager = AssetManager.getInstance(scene);
      assetManager.loadAsset('ship-npc-spaceship', vesselNode, 2.0).then((res) => {
        if (res) {
          body.isVisible = false;
          body.setEnabled(false);
          thruster.isVisible = false;
          thruster.setEnabled(false);
          res.meshes.forEach((m) => {
            m.metadata = {
              name: r.callsign,
              type: 'ship',
              shipType: 'Scout Interceptor',
              destination: r.dest,
              state: 'Patrolling',
              isHeroModel: true,
            };
          });
        }
      });

      this.vessels.push({
        rootNode: vesselNode,
        type: 'Scout Interceptor',
        callsign: r.callsign,
        routeRadius: r.radius,
        routeSpeed: r.speed,
        currentAngle: idx * 3.1 + 0.8,
        elevation: r.elevation,
        state: 'Patrolling',
        destination: r.dest,
        hullMesh: body,
        engineLights: [thruster],
      });
    });
  }

  /**
   * 3. Mining Harvesters (Working inside the Asteroid Belt)
   */
  private spawnMiningHarvesters(scene: Scene) {
    const pbrMiner = new PBRMaterial('pbrMinerMat', scene);
    pbrMiner.albedoColor = new Color3(0.55, 0.42, 0.18);
    pbrMiner.roughness = 0.5;

    const engMat = new StandardMaterial('minerEngMat', scene);
    engMat.emissiveColor = new Color3(0.95, 0.55, 0.15);

    const routes = [
      { radius: 50, speed: 0.035, elevation: 0.8, callsign: 'HARVESTER DRILL-11', dest: 'Ceres Sector' },
      { radius: 54, speed: -0.032, elevation: -1.2, callsign: 'EXTRACTOR VESTA-02', dest: 'Mining Apex-7' },
    ];

    routes.forEach((r, idx) => {
      const vesselNode = new TransformNode(`miner_${idx}`, scene);
      vesselNode.parent = this.rootNode;

      const hull = MeshBuilder.CreateBox(`minerHull_${idx}`, { width: 1.6, height: 1.2, depth: 2.6 }, scene);
      hull.material = pbrMiner;
      hull.parent = vesselNode;

      const scoop = MeshBuilder.CreateBox(`minerScoop_${idx}`, { width: 2.2, height: 0.6, depth: 1.2 }, scene);
      scoop.position = new Vector3(0, -0.4, 1.4);
      scoop.material = pbrMiner;
      scoop.parent = vesselNode;

      const thruster = MeshBuilder.CreateCylinder(`minerThruster_${idx}`, { height: 0.6, diameter: 0.6 }, scene);
      thruster.rotation.x = Math.PI / 2;
      thruster.position = new Vector3(0, 0, -1.4);
      thruster.material = engMat;
      thruster.parent = vesselNode;

      vesselNode.metadata = {
        name: r.callsign,
        type: 'ship',
        shipType: 'Mining Harvester',
        destination: r.dest,
        state: 'Cruising',
      };

      this.vessels.push({
        rootNode: vesselNode,
        type: 'Mining Harvester',
        callsign: r.callsign,
        routeRadius: r.radius,
        routeSpeed: r.speed,
        currentAngle: idx * 2.8,
        elevation: r.elevation,
        state: 'Cruising',
        destination: r.dest,
        hullMesh: hull,
        engineLights: [thruster],
      });
    });
  }

  /**
   * 4. High-Speed Orbital Passenger Transports
   */
  private spawnOrbitalTransports(scene: Scene) {
    const pbrTransport = new PBRMaterial('pbrTransportMat', scene);
    pbrTransport.albedoColor = new Color3(0.92, 0.94, 0.96);
    pbrTransport.roughness = 0.22;

    const engMat = new StandardMaterial('transportEngMat', scene);
    engMat.emissiveColor = new Color3(0.2, 0.75, 1.0);

    const routes = [
      { radius: 17, speed: 0.12, elevation: 1.5, callsign: 'MERCURY EXPRESS-01', dest: 'Mercury Lab' },
      { radius: 39, speed: 0.09, elevation: -2.1, callsign: 'LUNAR COMMUTER-08', dest: 'Earth High Orbit' },
      { radius: 89, speed: 0.055, elevation: 2.4, callsign: 'URANUS LINER-03', dest: 'EDU-Match Outpost' },
    ];

    routes.forEach((r, idx) => {
      const vesselNode = new TransformNode(`transport_${idx}`, scene);
      vesselNode.parent = this.rootNode;

      const body = MeshBuilder.CreateCylinder(`transportHull_${idx}`, { height: 2.2, diameter: 0.8 }, scene);
      body.rotation.x = Math.PI / 2;
      body.material = pbrTransport;
      body.parent = vesselNode;

      const thruster = MeshBuilder.CreateCylinder(`transThruster_${idx}`, { height: 0.5, diameter: 0.4 }, scene);
      thruster.rotation.x = Math.PI / 2;
      thruster.position = new Vector3(0, 0, -1.2);
      thruster.material = engMat;
      thruster.parent = vesselNode;

      vesselNode.metadata = {
        name: r.callsign,
        type: 'ship',
        shipType: 'Orbital Transport',
        destination: r.dest,
        state: 'Docking',
      };

      // Load Sketchfab NPC Spaceship (UID: 9a81a5167c474530881e55127e275c6c)
      const assetManager = AssetManager.getInstance(scene);
      assetManager.loadAsset('ship-npc-spaceship', vesselNode, 2.2).then((res) => {
        if (res) {
          body.isVisible = false;
          body.setEnabled(false);
          thruster.isVisible = false;
          thruster.setEnabled(false);
          res.meshes.forEach((m) => {
            m.metadata = {
              name: r.callsign,
              type: 'ship',
              shipType: 'Orbital Transport',
              destination: r.dest,
              state: 'Docking',
              isHeroModel: true,
            };
          });
        }
      });

      this.vessels.push({
        rootNode: vesselNode,
        type: 'Orbital Transport',
        callsign: r.callsign,
        routeRadius: r.radius,
        routeSpeed: r.speed,
        currentAngle: idx * 2.4 + 1.2,
        elevation: r.elevation,
        state: 'Docking',
        destination: r.dest,
        hullMesh: body,
        engineLights: [thruster],
      });
    });
  }

  public update(delta: number) {
    this.vessels.forEach((v) => {
      v.currentAngle += v.routeSpeed * delta;
      const x = Math.cos(v.currentAngle) * v.routeRadius;
      const z = Math.sin(v.currentAngle) * v.routeRadius;

      // Small vertical cruising oscillation
      const bobbing = Math.sin(v.currentAngle * 2.5) * 0.15;
      v.rootNode.position.set(x, v.elevation + bobbing, z);

      // Tangent heading angle with roll banking
      const tangentHeading = v.currentAngle + (v.routeSpeed > 0 ? Math.PI / 2 : -Math.PI / 2);
      v.rootNode.rotation.y = -tangentHeading;
      v.rootNode.rotation.z = Math.sin(v.currentAngle * 2.0) * 0.08; // subtle banking
    });
  }
}
