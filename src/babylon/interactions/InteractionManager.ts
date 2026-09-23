import { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { useMissionStore, ScannedObject } from '../../store/missionStore';
import { sound } from '../../utils/sound';
import { PlanetManager } from '../planets/PlanetManager';
import { SpaceStationManager } from '../environment/SpaceStation';
import { SpaceTraffic } from '../environment/SpaceTraffic';
import { AsteroidField } from '../environment/AsteroidField';

/**
 * InteractionManager - 3D Holographic Sonar Wave, Object Picking, and Proximity Detection
 */
export class InteractionManager {
  private pulseWaveMesh: Mesh;
  private pulseWaveMat: StandardMaterial;
  private pulseActive: boolean = false;
  private pulseRadius: number = 0;
  private maxPulseRadius: number = 105;

  private lastAlertTargetId: string | null = null;

  constructor(scene: Scene) {
    // 3D Sonar Wave Torus Mesh
    this.pulseWaveMesh = MeshBuilder.CreateTorus('sonarPulseWave', { diameter: 2, thickness: 0.15, tessellation: 48 }, scene);
    this.pulseWaveMesh.rotation.x = Math.PI / 2;
    this.pulseWaveMesh.isVisible = false;

    this.pulseWaveMat = new StandardMaterial('sonarPulseMat', scene);
    this.pulseWaveMat.emissiveColor = new Color3(0.0, 0.96, 1.0);
    this.pulseWaveMat.alpha = 0.85;
    this.pulseWaveMat.disableLighting = true;
    this.pulseWaveMesh.material = this.pulseWaveMat;
  }

  /**
   * Trigger 3D Holographic Sonar Wave Expansion
   */
  public triggerScannerPing(originPos: Vector3) {
    this.pulseActive = true;
    this.pulseRadius = 1;
    this.pulseWaveMesh.position.copyFrom(originPos);
    this.pulseWaveMesh.scaling.set(1, 1, 1);
    this.pulseWaveMesh.isVisible = true;
    this.pulseWaveMat.alpha = 0.85;

    sound.playScannerPing();
    useMissionStore.getState().triggerScanner();
  }

  /**
   * Continuous update for sonar wave expansion and proximity scanning
   */
  public update(
    delta: number,
    shipPos: Vector3,
    planetManager: PlanetManager,
    stationManager: SpaceStationManager,
    trafficManager: SpaceTraffic,
    asteroidField?: AsteroidField
  ) {
    // 1. Expand Sonar Pulse Wave
    if (this.pulseActive) {
      this.pulseRadius += delta * 72.0;
      const scale = this.pulseRadius;
      this.pulseWaveMesh.scaling.set(scale, scale, scale);

      const lifeRatio = this.pulseRadius / this.maxPulseRadius;
      this.pulseWaveMat.alpha = Math.max(0, 0.85 * (1 - lifeRatio));

      if (this.pulseRadius >= this.maxPulseRadius) {
        this.pulseActive = false;
        this.pulseWaveMesh.isVisible = false;
      }
    }

    // 2. Discover & Aggregate Nearby Objects
    const detected: ScannedObject[] = [];

    // Planetary Bodies
    planetManager.planets.forEach((p) => {
      const pPos = p.rootNode.position;
      const dist = Vector3.Distance(shipPos, pPos);
      if (dist < 95.0) {
        const title = p.project?.title || `${p.config.name} Sector`;
        const radius = p.config.radius;
        detected.push({
          id: p.project?.id || p.config.id,
          name: `${p.config.name} • ${title}`,
          type: 'Planet',
          distance: Math.round(dist * 10) / 10,
          description: p.project?.shortDescription || p.config.description,
          actionPrompt: dist < radius * 3.5 + 4.0 ? 'Press [W] or [Space] to break orbit' : 'Press [T] to engage Autopilot',
          coords: { x: pPos.x, y: pPos.y, z: pPos.z },
        });
      }
    });

    // Space Stations
    stationManager.stations.forEach((s) => {
      const sPos = s.rootNode.position;
      const dist = Vector3.Distance(shipPos, sPos);
      if (dist < 75.0) {
        detected.push({
          id: s.id,
          name: s.name,
          type: s.type === 'Research Relay' ? 'Relay Beacon' : 'Space Station',
          distance: Math.round(dist * 10) / 10,
          description: s.description,
          actionPrompt: dist < 12.0 ? 'Docking Corridor Active' : 'Maintain Approach Vector',
          coords: { x: sPos.x, y: sPos.y, z: sPos.z },
        });
      }
    });

    // Hero Asteroids & Ore Veins
    if (asteroidField?.heroAsteroids) {
      asteroidField.heroAsteroids.forEach((h, idx) => {
        const hPos = h.position;
        const dist = Vector3.Distance(shipPos, hPos);
        if (dist < 45.0) {
          detected.push({
            id: `hero_asteroid_${idx}`,
            name: h.metadata?.name || 'Asteroid Landmark',
            type: 'Asteroid Anomaly',
            distance: Math.round(dist * 10) / 10,
            description: h.metadata?.scanInfo || 'Mineral formation in the Keplerian belt.',
            actionPrompt: 'Harvest Yield: Available',
            coords: { x: hPos.x, y: hPos.y, z: hPos.z },
          });
        }
      });
    }

    // Traffic Vessels
    trafficManager.vessels.forEach((v, idx) => {
      const vPos = v.rootNode.position;
      const dist = Vector3.Distance(shipPos, vPos);
      if (dist < 38.0) {
        detected.push({
          id: `vessel_${idx}`,
          name: `${v.callsign} (${v.type})`,
          type: 'Traffic Vessel',
          distance: Math.round(dist * 10) / 10,
          description: `Navigating toward ${v.destination}. Transponder state: ${v.state}.`,
          actionPrompt: 'Caution: Autonomous Traffic Lane',
          coords: { x: vPos.x, y: vPos.y, z: vPos.z },
        });
      }
    });

    detected.sort((a, b) => a.distance - b.distance);

    // 3. Proximity Alert Notification
    const closest = detected[0] || null;
    if (closest && closest.distance < 14.0 && closest.id !== this.lastAlertTargetId) {
      this.lastAlertTargetId = closest.id;
      sound.playProximityAlert();
    } else if (!closest || closest.distance >= 18.0) {
      this.lastAlertTargetId = null;
    }

    useMissionStore.getState().setNearbyInteractable(closest);
    useMissionStore.getState().setScanResults(detected.slice(0, 6));
  }
}
