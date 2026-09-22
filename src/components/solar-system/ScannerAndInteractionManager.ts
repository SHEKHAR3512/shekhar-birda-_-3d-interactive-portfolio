import * as THREE from 'three';
import { useMissionStore, ScannedObject } from '../../store/missionStore';
import { sound } from '../../utils/sound';
import { SpaceStation } from './CosmicEnvironment';
import { TrafficVessel } from './SpaceTrafficManager';

/**
 * ScannerAndInteractionManager - Spacecraft Sensor Array & Interactive Objects
 * 
 * Features:
 * - 3D Expanding holographic sonar pulse wave from the ship
 * - Target detection & classification (Planets, Stations, Relays, Traffic)
 * - Proximity alerts & interactive docking/scanning prompts
 * - Real-time synchronization with Zustand store
 */
export class ScannerAndInteractionManager {
  public group: THREE.Group;

  // 3D Sonar Wave Mesh
  private pulseWaveMesh: THREE.Mesh;
  private pulseWaveMat: THREE.MeshBasicMaterial;
  private pulseActive: boolean = false;
  private pulseRadius: number = 0;
  private maxPulseRadius: number = 75;

  private lastAlertTargetId: string | null = null;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    // 3D Sonar Pulse Torus Wave
    const pulseGeom = new THREE.TorusGeometry(1, 0.12, 8, 48);
    pulseGeom.rotateX(Math.PI / 2);
    this.pulseWaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    this.pulseWaveMesh = new THREE.Mesh(pulseGeom, this.pulseWaveMat);
    this.pulseWaveMesh.visible = false;
    this.group.add(this.pulseWaveMesh);
  }

  /**
   * Trigger 3D Holographic Sonar Ping
   */
  public triggerScannerPing(originPos: THREE.Vector3) {
    this.pulseActive = true;
    this.pulseRadius = 1;
    this.pulseWaveMesh.position.copy(originPos);
    this.pulseWaveMesh.scale.set(1, 1, 1);
    this.pulseWaveMesh.visible = true;
    this.pulseWaveMat.opacity = 0.85;

    sound.playScannerPing();
    useMissionStore.getState().triggerScanner();
  }

  /**
   * Per-frame update for pulse expansion & proximity interactables
   */
  public update(
    delta: number,
    shipPos: THREE.Vector3,
    planets: Array<{ id: string; name: string; position: THREE.Vector3; size: number }>,
    stations: SpaceStation[],
    traffic: TrafficVessel[]
  ) {
    // 1. Holographic Sonar Wave Expansion
    if (this.pulseActive) {
      this.pulseRadius += delta * 55;
      const progress = this.pulseRadius / this.maxPulseRadius;

      if (progress >= 1.0) {
        this.pulseActive = false;
        this.pulseWaveMesh.visible = false;
      } else {
        this.pulseWaveMesh.scale.set(this.pulseRadius, 1, this.pulseRadius);
        this.pulseWaveMat.opacity = (1.0 - progress) * 0.75;
      }
    }

    // 2. Scan & Proximity Detection of Nearby Objects
    const detected: ScannedObject[] = [];

    // Check Planets
    planets.forEach((p) => {
      const dist = shipPos.distanceTo(p.position);
      if (dist < 85) {
        detected.push({
          id: p.id,
          name: `${p.name} System`,
          type: 'Planet',
          distance: Math.round(dist),
          description: `Planetary portfolio milestone representing project telemetry. Approach to establish orbital link.`,
          actionPrompt: dist < 12 ? 'PRESS [ENTER] TO ORBIT' : undefined,
          coords: { x: p.position.x, y: p.position.y, z: p.position.z },
        });
      }
    });

    // Check Space Stations
    stations.forEach((s) => {
      const dist = shipPos.distanceTo(s.group.position);
      if (dist < 75) {
        detected.push({
          id: s.id,
          name: s.name,
          type: s.type,
          distance: Math.round(dist),
          description: s.description,
          actionPrompt: dist < 10 ? 'PRESS [E] TO DOCK' : undefined,
          coords: { x: s.group.position.x, y: s.group.position.y, z: s.group.position.z },
        });
      }
    });

    // Check Traffic Vessels
    traffic.forEach((t) => {
      const dist = shipPos.distanceTo(t.mesh.position);
      if (dist < 40) {
        detected.push({
          id: t.callsign,
          name: t.callsign,
          type: 'Traffic Vessel',
          distance: Math.round(dist),
          description: `Autonomous ${t.type} navigating orbital transport corridor at ${Math.round(t.routeRadius)} AU.`,
          coords: { x: t.mesh.position.x, y: t.mesh.position.y, z: t.mesh.position.z },
        });
      }
    });

    // Sort by proximity
    detected.sort((a, b) => a.distance - b.distance);

    // Closest interactable
    const closest = detected.length > 0 && detected[0].distance < 14 ? detected[0] : null;

    if (closest && closest.id !== this.lastAlertTargetId) {
      this.lastAlertTargetId = closest.id;
      sound.playProximityAlert();
    } else if (!closest) {
      this.lastAlertTargetId = null;
    }

    useMissionStore.getState().setNearbyInteractable(closest);
    useMissionStore.getState().setScanResults(detected.slice(0, 5));
  }
}
