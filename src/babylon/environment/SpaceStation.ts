import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AssetManager } from '../assets/AssetManager';

export interface StationData {
  id: string;
  name: string;
  type: 'Central Space Station' | 'Industrial Mining Rig' | 'Research Relay' | 'Frontier Outpost';
  description: string;
  rootNode: TransformNode;
  rotatingRings: Mesh[];
  rotatingDishes: Mesh[];
  blinkingLights: Mesh[];
}

/**
 * SpaceStationManager - Multi-Station System with Sketchfab 3D Models & Procedural PBR Fallback
 */
export class SpaceStationManager {
  public rootNode: TransformNode;
  public stations: StationData[] = [];
  private blinkTimer: number = 0;

  constructor(scene: Scene) {
    this.rootNode = new TransformNode('spaceStationsRoot', scene);

    this.createCentralCitadel(scene);
    this.createIndustrialMiningRig(scene);
    this.createResearchRelay(scene);
    this.createFrontierOutpost(scene);
  }

  /**
   * 1. Central Space Station: Aegis Prime Citadel (Uses Sketchfab Space Station UID: 0da4a24e7edd49159737675ffcc06228)
   */
  private createCentralCitadel(scene: Scene) {
    const stationNode = new TransformNode('station_central_citadel', scene);
    stationNode.parent = this.rootNode;
    stationNode.position = new Vector3(32, 2.5, 12);

    const pbrHull = new PBRMaterial('pbrCitadelHull', scene);
    pbrHull.albedoColor = new Color3(0.92, 0.94, 0.98);
    pbrHull.metallic = 0.55;
    pbrHull.roughness = 0.22;

    const pbrSolar = new PBRMaterial('pbrCitadelSolar', scene);
    pbrSolar.albedoColor = new Color3(0.04, 0.22, 0.55);
    pbrSolar.metallic = 0.95;
    pbrSolar.roughness = 0.08;

    const dockingMat = new StandardMaterial('citadelDockLight', scene);
    dockingMat.emissiveColor = new Color3(0.15, 0.75, 1.0);

    // Fallback Cylindrical Command Core
    const spine = MeshBuilder.CreateCylinder('citadelSpine', { height: 8.5, diameter: 1.4, tessellation: 20 }, scene);
    spine.material = pbrHull;
    spine.parent = stationNode;

    // Dual Counter-Rotating Habitat Rings
    const ringInner = MeshBuilder.CreateTorus('citadelTorusInner', { diameter: 7.2, thickness: 0.65, tessellation: 48 }, scene);
    ringInner.material = pbrHull;
    ringInner.parent = stationNode;

    const ringOuter = MeshBuilder.CreateTorus('citadelTorusOuter', { diameter: 11.2, thickness: 0.55, tessellation: 48 }, scene);
    ringOuter.material = pbrHull;
    ringOuter.parent = stationNode;

    // Solar Wings
    const solarWings: Mesh[] = [];
    for (let s = -1; s <= 1; s += 2) {
      const solar = MeshBuilder.CreateBox(`citadelSolar_${s}`, { width: 6.8, height: 0.08, depth: 2.2 }, scene);
      solar.position = new Vector3(s * 4.6, 0, 0);
      solar.material = pbrSolar;
      solar.parent = stationNode;
      solarWings.push(solar);
    }

    // Docking Bay Navigation Strobes
    const blinkingLights: Mesh[] = [];
    for (let b = 0; b < 6; b++) {
      const angle = (b / 6) * Math.PI * 2;
      const light = MeshBuilder.CreateSphere(`citadelLight_${b}`, { diameter: 0.24 }, scene);
      light.position = new Vector3(Math.cos(angle) * 1.8, 3.8, Math.sin(angle) * 1.8);
      light.material = dockingMat;
      light.parent = stationNode;
      blinkingLights.push(light);
    }

    stationNode.metadata = {
      name: 'Aegis Prime Citadel',
      type: 'station',
      stationId: 'central-citadel',
      description: 'Major interplanetary commerce and transport hub with multiple docking bays.',
    };

    // Load Sketchfab Space Station GLB Model (0da4a24e7edd49159737675ffcc06228)
    const assetManager = AssetManager.getInstance(scene);
    assetManager.loadAsset('station-01', stationNode, 7.5).then((result) => {
      if (result) {
        spine.isVisible = false;
        spine.setEnabled(false);
        ringInner.isVisible = false;
        ringInner.setEnabled(false);
        ringOuter.isVisible = false;
        ringOuter.setEnabled(false);
        solarWings.forEach((w) => {
          w.isVisible = false;
          w.setEnabled(false);
        });

        result.meshes.forEach((m) => {
          m.metadata = {
            name: 'Aegis Prime Citadel',
            type: 'station',
            stationId: 'central-citadel',
            description: 'Major interplanetary commerce and transport hub with multiple docking bays.',
            isHeroModel: true,
          };
        });
      }
    });

    this.stations.push({
      id: 'central-citadel',
      name: 'Aegis Prime Citadel',
      type: 'Central Space Station',
      description: 'Major interplanetary commerce and transport hub with multiple docking bays.',
      rootNode: stationNode,
      rotatingRings: [ringInner, ringOuter],
      rotatingDishes: [],
      blinkingLights,
    });
  }

  /**
   * 2. Industrial / Mining Station: Titan Deep-Core Refinery (Uses Sketchfab Station Modules UID: e3ba39a1c78540448542cf937b11feab)
   */
  private createIndustrialMiningRig(scene: Scene) {
    const stationNode = new TransformNode('station_mining_rig', scene);
    stationNode.parent = this.rootNode;
    stationNode.position = new Vector3(52, 1.2, -18);

    const pbrIndustrial = new PBRMaterial('pbrMiningHull', scene);
    pbrIndustrial.albedoColor = new Color3(0.72, 0.48, 0.18);
    pbrIndustrial.metallic = 0.75;
    pbrIndustrial.roughness = 0.45;

    const moltenOreMat = new StandardMaterial('moltenOreMat', scene);
    moltenOreMat.emissiveColor = new Color3(1.0, 0.35, 0.05);

    // Modular Smelting Hull
    const mainModule = MeshBuilder.CreateBox('miningCore', { width: 4.2, height: 3.5, depth: 4.8 }, scene);
    mainModule.material = pbrIndustrial;
    mainModule.parent = stationNode;

    // Rock-Crushing Extractor Spur
    const drill = MeshBuilder.CreateCylinder('miningDrill', { height: 6.2, diameterTop: 0.3, diameterBottom: 1.6 }, scene);
    drill.position = new Vector3(0, -3.8, 0);
    drill.material = pbrIndustrial;
    drill.parent = stationNode;

    // Smelter Exhaust Port with Glowing Molten Crucible
    const smelter = MeshBuilder.CreateCylinder('smelterPort', { height: 1.2, diameter: 1.8 }, scene);
    smelter.position = new Vector3(0, 2.2, 0);
    smelter.material = moltenOreMat;
    smelter.parent = stationNode;

    const beaconLight = MeshBuilder.CreateSphere('miningHazardBeacon', { diameter: 0.35 }, scene);
    beaconLight.position = new Vector3(0, 2.8, 0);
    beaconLight.material = moltenOreMat;
    beaconLight.parent = stationNode;

    stationNode.metadata = {
      name: 'Titan Deep-Core Refinery',
      type: 'station',
      stationId: 'industrial-mining',
      description: 'Heavy asteroid mining and ore smelting complex situated in the Asteroid Corridor.',
    };

    // Load Sketchfab Space Station Modules GLB (e3ba39a1c78540448542cf937b11feab)
    const assetManager = AssetManager.getInstance(scene);
    assetManager.loadAsset('station-modules', stationNode, 6.2).then((result) => {
      if (result) {
        mainModule.isVisible = false;
        mainModule.setEnabled(false);
        drill.isVisible = false;
        drill.setEnabled(false);
        smelter.isVisible = false;
        smelter.setEnabled(false);
        beaconLight.isVisible = false;
        beaconLight.setEnabled(false);

        result.meshes.forEach((m) => {
          m.metadata = {
            name: 'Titan Deep-Core Refinery',
            type: 'station',
            stationId: 'industrial-mining',
            description: 'Heavy asteroid mining and ore smelting complex situated in the Asteroid Corridor.',
            isHeroModel: true,
          };
        });
      }
    });

    this.stations.push({
      id: 'industrial-mining',
      name: 'Titan Deep-Core Refinery',
      type: 'Industrial Mining Rig',
      description: 'Heavy asteroid mining and ore smelting complex deployed in the Asteroid Corridor.',
      rootNode: stationNode,
      rotatingRings: [],
      rotatingDishes: [drill],
      blinkingLights: [beaconLight],
    });
  }

  /**
   * 3. Research Station: Hyperion Deep-Space Sensor Relay (Uses Sketchfab Space Station 3 UID: a7a6ad10261149cab31aa394bfcf8940)
   */
  private createResearchRelay(scene: Scene) {
    const stationNode = new TransformNode('station_research_relay', scene);
    stationNode.parent = this.rootNode;
    stationNode.position = new Vector3(-62, -3.8, 38);

    const pbrRelay = new PBRMaterial('pbrRelayHull', scene);
    pbrRelay.albedoColor = new Color3(0.28, 0.32, 0.42);
    pbrRelay.metallic = 0.9;
    pbrRelay.roughness = 0.2;

    const dishMat = new PBRMaterial('pbrDishSurface', scene);
    dishMat.albedoColor = new Color3(0.92, 0.95, 1.0);
    dishMat.metallic = 0.92;
    dishMat.roughness = 0.15;

    const sensorPulseMat = new StandardMaterial('sensorPulseMat', scene);
    sensorPulseMat.emissiveColor = new Color3(0.05, 0.95, 0.65);

    // Mast Frame
    const mast = MeshBuilder.CreateCylinder('relayMast', { height: 7.8, diameter: 0.7 }, scene);
    mast.material = pbrRelay;
    mast.parent = stationNode;

    // High-Gain Parabolic Communications Dish
    const dish = MeshBuilder.CreateCylinder('relayDish', { height: 0.35, diameterTop: 4.2, diameterBottom: 0.8 }, scene);
    dish.rotation.x = Math.PI / 3.8;
    dish.position = new Vector3(0, 3.2, 1.2);
    dish.material = dishMat;
    dish.parent = stationNode;

    // Quantum Signal Transmitter Beacon
    const transmitter = MeshBuilder.CreateSphere('relaySensor', { diameter: 0.5 }, scene);
    transmitter.position = new Vector3(0, 4.2, 0);
    transmitter.material = sensorPulseMat;
    transmitter.parent = stationNode;

    stationNode.metadata = {
      name: 'Hyperion Deep-Space Sensor Relay',
      type: 'station',
      stationId: 'research-relay',
      description: 'Long-range array intercepting interstellar anomalies and monitoring deep solar telemetry.',
    };

    // Load Sketchfab Space Station 3 GLB (a7a6ad10261149cab31aa394bfcf8940)
    const assetManager = AssetManager.getInstance(scene);
    assetManager.loadAsset('station-03', stationNode, 7.0).then((result) => {
      if (result) {
        mast.isVisible = false;
        mast.setEnabled(false);
        dish.isVisible = false;
        dish.setEnabled(false);
        transmitter.isVisible = false;
        transmitter.setEnabled(false);

        result.meshes.forEach((m) => {
          m.metadata = {
            name: 'Hyperion Deep-Space Sensor Relay',
            type: 'station',
            stationId: 'research-relay',
            description: 'Long-range array intercepting interstellar anomalies and monitoring deep solar telemetry.',
            isHeroModel: true,
          };
        });
      }
    });

    this.stations.push({
      id: 'research-relay',
      name: 'Hyperion Deep-Space Sensor Relay',
      type: 'Research Relay',
      description: 'Long-range array intercepting interstellar anomalies and deep cosmos transmissions.',
      rootNode: stationNode,
      rotatingRings: [],
      rotatingDishes: [dish],
      blinkingLights: [transmitter],
    });
  }

  /**
   * 4. Small Remote Outpost: Frontier Outpost 73 (Kuiper Belt / Pluto Sector)
   */
  private createFrontierOutpost(scene: Scene) {
    const stationNode = new TransformNode('station_frontier_outpost', scene);
    stationNode.parent = this.rootNode;
    stationNode.position = new Vector3(98, -2.2, -64);

    const pbrOutpost = new PBRMaterial('pbrOutpostHull', scene);
    pbrOutpost.albedoColor = new Color3(0.35, 0.38, 0.45);
    pbrOutpost.metallic = 0.82;
    pbrOutpost.roughness = 0.32;

    const beaconMat = new StandardMaterial('outpostBeaconMat', scene);
    beaconMat.emissiveColor = new Color3(1.0, 0.15, 0.15); // Red warning beacon

    // Compact Habitation Module
    const habModule = MeshBuilder.CreateCylinder('outpostHab', { height: 2.8, diameter: 2.4, tessellation: 8 }, scene);
    habModule.material = pbrOutpost;
    habModule.parent = stationNode;

    // Small landing pad
    const pad = MeshBuilder.CreateCylinder('outpostPad', { height: 0.2, diameter: 3.8, tessellation: 6 }, scene);
    pad.position = new Vector3(0, -1.4, 0);
    pad.material = pbrOutpost;
    pad.parent = stationNode;

    // Warning Strobe Beacon
    const beacon = MeshBuilder.CreateSphere('outpostBeacon', { diameter: 0.3 }, scene);
    beacon.position = new Vector3(0, 1.6, 0);
    beacon.material = beaconMat;
    beacon.parent = stationNode;

    stationNode.metadata = {
      name: 'Frontier Outpost 73',
      type: 'station',
      stationId: 'frontier-outpost',
      description: 'Isolated deep-space survival station on the edge of the Kuiper Belt.',
    };

    const assetManager = AssetManager.getInstance(scene);
    assetManager.loadAsset('station-modules', stationNode, 4.5).then((result) => {
      if (result) {
        habModule.isVisible = false;
        habModule.setEnabled(false);
        pad.isVisible = false;
        pad.setEnabled(false);
        beacon.isVisible = false;
        beacon.setEnabled(false);

        result.meshes.forEach((m) => {
          m.metadata = {
            name: 'Frontier Outpost 73',
            type: 'station',
            stationId: 'frontier-outpost',
            description: 'Isolated deep-space survival station on the edge of the Kuiper Belt.',
            isHeroModel: true,
          };
        });
      }
    });

    this.stations.push({
      id: 'frontier-outpost',
      name: 'Frontier Outpost 73',
      type: 'Frontier Outpost',
      description: 'Isolated deep-space outpost on the edge of the Kuiper Belt.',
      rootNode: stationNode,
      rotatingRings: [],
      rotatingDishes: [],
      blinkingLights: [beacon],
    });
  }

  public update(delta: number) {
    this.blinkTimer += delta * 3.5;
    const isBlinkOn = Math.sin(this.blinkTimer) > 0.1;

    this.stations.forEach((s) => {
      // Gentle cinematic orbital rotation of entire station
      s.rootNode.rotation.y += delta * 0.035;

      // Rotate habitat rings
      s.rotatingRings.forEach((r, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        r.rotation.y += delta * 0.32 * dir;
      });

      // Rotate sensor dishes
      s.rotatingDishes.forEach((d) => {
        d.rotation.y += delta * 0.2;
      });

      // Toggle navigational strobe lights
      s.blinkingLights.forEach((l) => {
        l.visibility = isBlinkOn ? 1.0 : 0.25;
      });
    });
  }
}
