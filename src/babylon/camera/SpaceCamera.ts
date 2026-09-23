import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scalar } from '@babylonjs/core/Maths/math.scalar';
import { Scene } from '@babylonjs/core/scene';
import { CameraMode } from '../../store/missionStore';

export interface SpaceCameraConfig {
  baseFov?: number;
  boostFov?: number;
  baseDistance?: number;
  boostDistance?: number;
  camHeight?: number;
}

/**
 * SpaceCamera - High-Performance Cinematic Spacecraft Camera Controller
 * 
 * Supports:
 * - Dynamic chase camera with spring lag and banking interpolation
 * - Speed-based dynamic FOV expansion
 * - Boost micro-shake
 * - 5 Camera Modes: Flight, Orbit, Cinematic, Isometric, Chart
 */
export class SpaceCamera {
  public camera: TargetCamera;
  public currentMode: CameraMode = 'flight';

  // Config
  private baseFov: number = 0.82; // ~47 degrees in radians
  private boostFov: number = 1.08; // ~62 degrees in radians
  private baseDistance: number = 14.5;
  private boostDistance: number = 19.5;
  private camHeight: number = 5.2;

  // Smoothing state
  private currentPos: Vector3 = new Vector3(0, 20, 60);
  private currentLookTarget: Vector3 = new Vector3(0, 0, 0);
  private currentFov: number = 0.82;
  private shakeTimer: number = 0;
  private cinematicAngle: number = 0;

  constructor(scene: Scene, config?: SpaceCameraConfig) {
    if (config?.baseFov) this.baseFov = config.baseFov;
    if (config?.boostFov) this.boostFov = config.boostFov;
    if (config?.baseDistance) this.baseDistance = config.baseDistance;
    if (config?.boostDistance) this.boostDistance = config.boostDistance;
    if (config?.camHeight) this.camHeight = config.camHeight;

    this.camera = new TargetCamera('spaceTargetCamera', new Vector3(0, 20, 60), scene);
    this.camera.fov = this.baseFov;
    this.camera.minZ = 0.1;
    this.camera.maxZ = 3000;
  }

  public setMode(mode: CameraMode) {
    this.currentMode = mode;
  }

  /**
   * Update camera positioning and targets based on mode and ship state
   */
  public update(
    delta: number,
    shipPos: Vector3,
    shipHeading: number,
    shipPitch: number,
    shipRoll: number,
    currentSpeed: number,
    isBoosting: boolean,
    targetPlanetPos?: Vector3 | null,
    targetPlanetSize?: number
  ) {
    switch (this.currentMode) {
      case 'flight':
        this.updateFlightMode(delta, shipPos, shipHeading, shipRoll, currentSpeed, isBoosting);
        break;
      case 'orbit':
        this.updateOrbitMode(delta, targetPlanetPos || shipPos, targetPlanetSize || 5.0);
        break;
      case 'cinematic':
        this.updateCinematicMode(delta, shipPos);
        break;
      case 'isometric':
        this.updateIsometricMode(delta, shipPos);
        break;
      case 'chart':
        this.updateChartMode(delta);
        break;
      default:
        this.updateFlightMode(delta, shipPos, shipHeading, shipRoll, currentSpeed, isBoosting);
    }
  }

  /**
   * 1. Flight Chase Camera with Spring Lag & Speed FOV
   */
  private updateFlightMode(
    delta: number,
    shipPos: Vector3,
    shipHeading: number,
    shipRoll: number,
    currentSpeed: number,
    isBoosting: boolean
  ) {
    // Dynamic distance & FOV scaling
    const speedRatio = Scalar.Clamp(currentSpeed / 36.0, 0, 1);
    const targetDistance = Scalar.Lerp(this.baseDistance, this.boostDistance, speedRatio);
    const targetFov = isBoosting ? this.boostFov : Scalar.Lerp(this.baseFov, this.boostFov, speedRatio * 0.5);

    this.currentFov = Scalar.Lerp(this.currentFov, targetFov, Scalar.Clamp(delta * 4.0, 0, 1));
    this.camera.fov = this.currentFov;

    // Ideal camera position behind ship
    // Ship forward vector: sin(heading), 0, cos(heading)
    const sinH = Math.sin(shipHeading);
    const cosH = Math.cos(shipHeading);

    const behindX = shipPos.x - sinH * targetDistance;
    const behindZ = shipPos.z - cosH * targetDistance;
    const rollTilt = Math.sin(shipRoll) * 2.2;
    const behindY = shipPos.y + this.camHeight + rollTilt;

    const idealCamPos = new Vector3(behindX, behindY, behindZ);

    // Camera shake under boost
    if (isBoosting) {
      this.shakeTimer += delta * 45;
      const shakeMag = 0.28;
      idealCamPos.x += Math.sin(this.shakeTimer) * shakeMag;
      idealCamPos.y += Math.cos(this.shakeTimer * 1.3) * shakeMag;
      idealCamPos.z += Math.sin(this.shakeTimer * 0.8) * shakeMag;
    }

    // Smooth position interpolation
    this.currentPos = Vector3.Lerp(this.currentPos, idealCamPos, Scalar.Clamp(delta * 5.5, 0, 1));
    this.camera.position.copyFrom(this.currentPos);

    // Forward look-ahead targeting
    const lookAheadDist = 18.0 + currentSpeed * 0.4;
    const targetLook = new Vector3(
      shipPos.x + sinH * lookAheadDist,
      shipPos.y + 0.8,
      shipPos.z + cosH * lookAheadDist
    );

    this.currentLookTarget = Vector3.Lerp(this.currentLookTarget, targetLook, Scalar.Clamp(delta * 6.5, 0, 1));
    this.camera.setTarget(this.currentLookTarget);
  }

  /**
   * 2. Orbit Mode: Focuses on selected planet or starfighter
   */
  private updateOrbitMode(delta: number, centerPos: Vector3, radius: number) {
    this.cinematicAngle += delta * 0.35;
    const dist = Math.max(radius * 4.0, 16.0);
    const height = Math.max(radius * 1.6, 6.0);

    const targetPos = new Vector3(
      centerPos.x + Math.sin(this.cinematicAngle) * dist,
      centerPos.y + height,
      centerPos.z + Math.cos(this.cinematicAngle) * dist
    );

    this.currentPos = Vector3.Lerp(this.currentPos, targetPos, Scalar.Clamp(delta * 3.5, 0, 1));
    this.camera.position.copyFrom(this.currentPos);
    this.currentLookTarget = Vector3.Lerp(this.currentLookTarget, centerPos, Scalar.Clamp(delta * 4.5, 0, 1));
    this.camera.setTarget(this.currentLookTarget);
  }

  /**
   * 3. Cinematic Mode: Sweeping majestic angle around starfighter
   */
  private updateCinematicMode(delta: number, shipPos: Vector3) {
    this.cinematicAngle += delta * 0.22;
    const dist = 32.0;
    const height = 9.0 + Math.sin(this.cinematicAngle * 0.5) * 4.0;

    const targetPos = new Vector3(
      shipPos.x + Math.sin(this.cinematicAngle) * dist,
      shipPos.y + height,
      shipPos.z + Math.cos(this.cinematicAngle) * dist
    );

    this.currentPos = Vector3.Lerp(this.currentPos, targetPos, Scalar.Clamp(delta * 2.5, 0, 1));
    this.camera.position.copyFrom(this.currentPos);
    this.currentLookTarget = Vector3.Lerp(this.currentLookTarget, shipPos, Scalar.Clamp(delta * 3.5, 0, 1));
    this.camera.setTarget(this.currentLookTarget);
  }

  /**
   * 4. Isometric Mode: Elevated 45-degree tactical perspective
   */
  private updateIsometricMode(delta: number, shipPos: Vector3) {
    const targetPos = new Vector3(shipPos.x + 35, shipPos.y + 45, shipPos.z + 35);
    this.currentPos = Vector3.Lerp(this.currentPos, targetPos, Scalar.Clamp(delta * 4.0, 0, 1));
    this.camera.position.copyFrom(this.currentPos);
    this.currentLookTarget = Vector3.Lerp(this.currentLookTarget, shipPos, Scalar.Clamp(delta * 4.5, 0, 1));
    this.camera.setTarget(this.currentLookTarget);
  }

  /**
   * 5. Chart Mode: Tactical top-down sector map
   */
  private updateChartMode(delta: number) {
    const targetPos = new Vector3(0, 320, 0);
    this.currentPos = Vector3.Lerp(this.currentPos, targetPos, Scalar.Clamp(delta * 3.5, 0, 1));
    this.camera.position.copyFrom(this.currentPos);
    this.currentLookTarget = Vector3.Lerp(this.currentLookTarget, new Vector3(0, 0, 0), Scalar.Clamp(delta * 4.5, 0, 1));
    this.camera.setTarget(this.currentLookTarget);
  }
}
