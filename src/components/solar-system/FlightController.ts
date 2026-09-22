import * as THREE from 'three';
import { StarfighterFlightInput } from './Starfighter';
import { sound } from '../../utils/sound';

export interface FlightControllerConfig {
  maxNormalSpeed?: number;
  maxBoostSpeed?: number;
  accelRate?: number;
  brakeRate?: number;
  dragRate?: number;
  turnSpeed?: number;
  baseFov?: number;
  boostFov?: number;
  baseCamDistance?: number;
  boostCamDistance?: number;
  camHeight?: number;
}

/**
 * FlightController - High-Fidelity Flight Physics & Cinematic Camera System
 * 
 * Features:
 * - Real vector velocity with inertia and centrifugal drift
 * - Smooth engine spooling and throttle ramp-up
 * - Proportional banking roll and pitch nose-dip under acceleration
 * - Dynamic chase camera with realistic spring lag
 * - Speed-based dynamic FOV expansion (45° -> 62° on boost)
 * - Multi-frequency camera micro-shake on afterburner boost and hard braking
 * - Forward look-ahead targeting for optimal pilot visibility
 * - Audio engine synthesizer synchronization
 */
export class FlightController {
  // Flight Configuration
  public maxNormalSpeed: number;
  public maxBoostSpeed: number;
  public accelRate: number;
  public brakeRate: number;
  public dragRate: number;
  public turnSpeed: number;
  public baseFov: number;
  public boostFov: number;
  public baseCamDistance: number;
  public boostCamDistance: number;
  public camHeight: number;

  // Physical State Variables
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 32);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public heading: number = 0; // Yaw angle (around Y)
  public pitch: number = 0;   // Pitch angle (around X)
  public roll: number = 0;    // Roll / Banking angle (around Z)
  public currentSpeed: number = 0;
  public targetSpeed: number = 0;

  // Dynamic Camera Internal State
  private currentCamPos: THREE.Vector3 = new THREE.Vector3(0, 50, 100);
  private currentLookTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private currentFov: number = 45;
  private shakeTimer: number = 0;
  private shakeOffset: THREE.Vector3 = new THREE.Vector3();

  constructor(config?: FlightControllerConfig) {
    this.maxNormalSpeed = config?.maxNormalSpeed ?? 17.0;
    this.maxBoostSpeed = config?.maxBoostSpeed ?? 36.0;
    this.accelRate = config?.accelRate ?? 24.0;
    this.brakeRate = config?.brakeRate ?? 32.0;
    this.dragRate = config?.dragRate ?? 5.5;
    this.turnSpeed = config?.turnSpeed ?? 2.6;
    this.baseFov = config?.baseFov ?? 45;
    this.boostFov = config?.boostFov ?? 62;
    this.baseCamDistance = config?.baseCamDistance ?? 14.5;
    this.boostCamDistance = config?.boostCamDistance ?? 19.0;
    this.camHeight = config?.camHeight ?? 5.2;
  }

  /**
   * Reset or re-orient the flight position and heading (e.g. after launching from orbit)
   */
  public setTransform(pos: THREE.Vector3, heading: number, speed: number = 0) {
    this.position.copy(pos);
    this.heading = heading;
    this.pitch = 0;
    this.roll = 0;
    this.currentSpeed = speed;
    const forward = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));
    this.velocity.copy(forward).multiplyScalar(speed);
  }

  /**
   * Update free-flight physics: steering, acceleration, inertia, banking, and elevation spring
   */
  public updatePhysics(delta: number, input: StarfighterFlightInput): {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    speed: number;
  } {
    // 1. Steering & Yaw Rotation
    const isBoosting = input.boost && this.currentSpeed > 4;
    const effectiveTurnRate = isBoosting ? this.turnSpeed * 0.75 : this.turnSpeed;

    if (input.left) {
      this.heading += effectiveTurnRate * delta;
    }
    if (input.right) {
      this.heading -= effectiveTurnRate * delta;
    }

    // Roll controls (Q / E keys)
    if (input.rollLeft) this.heading += effectiveTurnRate * 0.8 * delta;
    if (input.rollRight) this.heading -= effectiveTurnRate * 0.8 * delta;

    // 2. Throttle & Speed Calculation
    const targetMax = input.boost ? this.maxBoostSpeed : this.maxNormalSpeed;
    const isAccelerating = input.forward;

    if (input.forward) {
      this.targetSpeed = THREE.MathUtils.lerp(this.targetSpeed, targetMax, 0.08);
      this.currentSpeed = Math.min(this.currentSpeed + this.accelRate * delta, this.targetSpeed);
    } else if (input.backward || input.brake) {
      this.targetSpeed = 0;
      this.currentSpeed = Math.max(this.currentSpeed - this.brakeRate * delta, 0);
    } else {
      this.targetSpeed = 0;
      this.currentSpeed = Math.max(this.currentSpeed - this.dragRate * delta, 0);
    }

    // 3. Inertia & Forward Velocity Vector with Centrifugal Drift
    const forwardVector = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
    const desiredVelocity = forwardVector.clone().multiplyScalar(this.currentSpeed);

    // Lerp velocity toward desired direction with inertia lag
    const inertiaT = Math.min(1.0, 7.5 * delta);
    this.velocity.lerp(desiredVelocity, inertiaT);

    // Apply movement translation
    this.position.addScaledVector(this.velocity, delta);

    // Gentle spring to ecliptic navigation plane (Y = 0)
    this.position.y = THREE.MathUtils.lerp(this.position.y, 0, Math.min(1.0, 3.5 * delta));

    // 4. Realistic Aerospace Banking & Pitch Reaction
    // Roll: bank into turns proportionally to turn direction and forward velocity
    const speedRatio = Math.min(this.currentSpeed / this.maxNormalSpeed, 1.2);
    const targetRoll = (input.left ? 0.42 : input.right ? -0.42 : 0) * (0.4 + speedRatio * 0.6);
    this.roll = THREE.MathUtils.lerp(this.roll, targetRoll, Math.min(1.0, 6.0 * delta));

    // Pitch: nose dips slightly forward on throttle acceleration, noses up gently on braking
    const targetPitch = input.forward
      ? -0.06 * speedRatio
      : (input.backward || input.brake)
      ? 0.08 * speedRatio
      : 0;
    this.pitch = THREE.MathUtils.lerp(this.pitch, targetPitch, Math.min(1.0, 5.0 * delta));

    // 5. Sound Engine Synchronization
    const normalizedSpeed = this.currentSpeed / this.maxBoostSpeed;
    sound.updateEngine(normalizedSpeed, isAccelerating);

    return {
      position: this.position,
      rotation: new THREE.Euler(this.pitch, this.heading, this.roll, 'YXZ'),
      speed: this.currentSpeed,
    };
  }

  /**
   * Update the dynamic camera with spring follow, speed-based FOV, and shake
   */
  public updateCamera(
    camera: THREE.PerspectiveCamera,
    shipGroup: THREE.Group,
    delta: number,
    input: StarfighterFlightInput
  ) {
    this.shakeTimer += delta;

    // 1. Dynamic FOV based on flight speed & boost
    const speedFraction = Math.min(this.currentSpeed / this.maxBoostSpeed, 1.0);
    const targetFov = this.baseFov + (this.boostFov - this.baseFov) * (speedFraction * speedFraction);
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, targetFov, Math.min(1.0, 4.0 * delta));
    if (Math.abs(camera.fov - this.currentFov) > 0.05) {
      camera.fov = this.currentFov;
      camera.updateProjectionMatrix();
    }

    // 2. Dynamic Camera Distance & Height
    const isBoosting = input.boost && this.currentSpeed > this.maxNormalSpeed * 0.9;
    const targetDist = THREE.MathUtils.lerp(
      this.baseCamDistance,
      this.boostCamDistance,
      speedFraction
    );
    const targetHeight = this.camHeight - (isBoosting ? 0.7 : 0);

    // 3. Chase Camera Ideal Position in ship's local coordinates
    const backwardVector = new THREE.Vector3(-Math.sin(this.heading), 0, -Math.cos(this.heading));
    const idealCamPos = this.position
      .clone()
      .addScaledVector(backwardVector, targetDist)
      .add(new THREE.Vector3(0, targetHeight, 0));

    // 4. Procedural Multi-Frequency Camera Shake
    let shakeIntensity = 0;
    if (isBoosting) {
      shakeIntensity = 0.16;
    } else if (input.brake && this.currentSpeed > 5) {
      shakeIntensity = 0.12;
    } else if (this.currentSpeed > this.maxNormalSpeed) {
      shakeIntensity = 0.06;
    }

    if (shakeIntensity > 0) {
      const sx = (Math.sin(this.shakeTimer * 52) + Math.cos(this.shakeTimer * 31)) * shakeIntensity;
      const sy = (Math.cos(this.shakeTimer * 43) + Math.sin(this.shakeTimer * 67)) * shakeIntensity;
      const sz = Math.sin(this.shakeTimer * 48) * shakeIntensity * 0.6;
      this.shakeOffset.set(sx, sy, sz);
    } else {
      this.shakeOffset.lerp(new THREE.Vector3(), 0.15);
    }

    // 5. Spring Smooth Follow for Position
    // High-speed turns have slight lag for a heavy, physical feeling
    const followTightness = THREE.MathUtils.lerp(0.07, 0.11, Math.min(delta * 60, 1.0));
    this.currentCamPos.lerp(idealCamPos, followTightness);
    camera.position.copy(this.currentCamPos).add(this.shakeOffset);

    // 6. Forward Look-Ahead Target
    // Camera looks slightly ahead of the ship into the flight path
    const lookAheadDistance = 4.0 + this.currentSpeed * 0.35;
    const forwardVector = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
    const idealLookTarget = this.position
      .clone()
      .addScaledVector(forwardVector, lookAheadDistance)
      .add(new THREE.Vector3(0, 0.4, 0));

    this.currentLookTarget.lerp(idealLookTarget, 0.12);
    camera.lookAt(this.currentLookTarget);
  }

  // Multi-View State Tracking
  public orbitAngle: number = 0;
  public cinematicAngleTime: number = 0;

  /**
   * Smoothly revolve camera in 360° orbit around a target position (planet or spaceship)
   */
  public updateOrbitCamera(
    camera: THREE.PerspectiveCamera,
    targetPos: THREE.Vector3,
    targetSize: number,
    delta: number
  ) {
    if (Math.abs(camera.fov - this.baseFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, this.baseFov, 0.08);
      camera.updateProjectionMatrix();
    }

    this.orbitAngle += delta * 0.32;
    const orbitDistance = Math.max(targetSize * 3.2, 16.0);
    const camTarget = new THREE.Vector3(
      targetPos.x + Math.cos(this.orbitAngle) * orbitDistance,
      targetPos.y + orbitDistance * 0.38 + Math.sin(this.orbitAngle * 1.5) * 1.2,
      targetPos.z + Math.sin(this.orbitAngle) * orbitDistance
    );

    camera.position.lerp(camTarget, Math.min(1.0, 3.0 * delta));
    this.currentCamPos.copy(camera.position);

    this.currentLookTarget.lerp(targetPos, Math.min(1.0, 4.0 * delta));
    camera.lookAt(this.currentLookTarget);
  }

  /**
   * Cinematic Director Camera: Sweeping dynamic angles, slow dramatic tracking, and leading shots
   */
  public updateCinematicCamera(
    camera: THREE.PerspectiveCamera,
    shipGroup: THREE.Group,
    delta: number
  ) {
    this.cinematicAngleTime += delta;

    // Cinematic 38° FOV for anamorphic widescreen feel
    if (Math.abs(camera.fov - 38) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 38, 0.08);
      camera.updateProjectionMatrix();
    }

    // Switch between 2 cinematic angles smoothly every 10 seconds:
    // Angle A: Front 3/4 leading shot (camera flies ahead, starfighter cruises towards camera)
    // Angle B: Low-angle dramatic wing tracking shot
    const cycle = this.cinematicAngleTime % 20;
    const forwardVector = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
    const rightVector = new THREE.Vector3(Math.cos(this.heading), 0, -Math.sin(this.heading));

    let idealCamPos: THREE.Vector3;
    if (cycle < 10) {
      // Angle A: Ahead and to the side, looking back at the ship
      idealCamPos = this.position
        .clone()
        .addScaledVector(forwardVector, 18.0)
        .addScaledVector(rightVector, 10.0)
        .add(new THREE.Vector3(0, 3.5, 0));
    } else {
      // Angle B: Low-angle rear-quarter dramatic flyby
      idealCamPos = this.position
        .clone()
        .addScaledVector(forwardVector, -14.0)
        .addScaledVector(rightVector, -12.0)
        .add(new THREE.Vector3(0, -1.8, 0));
    }

    camera.position.lerp(idealCamPos, Math.min(1.0, 1.8 * delta));
    this.currentCamPos.copy(camera.position);

    // Look at center of starfighter with subtle cinematic drift
    const lookTarget = this.position.clone().add(new THREE.Vector3(0, 0.2, 0));
    this.currentLookTarget.lerp(lookTarget, Math.min(1.0, 3.2 * delta));
    camera.lookAt(this.currentLookTarget);
  }

  /**
   * Tactical 3D Isometric View: Elevated 45° angle, low FOV 28°, strategic overview
   */
  public updateIsometricCamera(
    camera: THREE.PerspectiveCamera,
    shipGroup: THREE.Group,
    delta: number
  ) {
    if (Math.abs(camera.fov - 28) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 28, 0.1);
      camera.updateProjectionMatrix();
    }

    const isoDist = 58.0;
    const targetPos = this.position.clone();
    const isoCamPos = new THREE.Vector3(
      targetPos.x + isoDist * 0.72,
      targetPos.y + isoDist * 0.88,
      targetPos.z + isoDist * 0.72
    );

    camera.position.lerp(isoCamPos, Math.min(1.0, 4.0 * delta));
    this.currentCamPos.copy(camera.position);

    this.currentLookTarget.lerp(targetPos, Math.min(1.0, 5.0 * delta));
    camera.lookAt(this.currentLookTarget);
  }

  /**
   * System Chart View: Top-down 90° solar system map overview at Sol center
   */
  public updateChartCamera(
    camera: THREE.PerspectiveCamera,
    delta: number
  ) {
    if (Math.abs(camera.fov - 44) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 44, 0.1);
      camera.updateProjectionMatrix();
    }

    const topDownPos = new THREE.Vector3(0, 205, 0.1);
    camera.position.lerp(topDownPos, Math.min(1.0, 2.5 * delta));
    this.currentCamPos.copy(camera.position);

    this.currentLookTarget.lerp(new THREE.Vector3(0, 0, 0), Math.min(1.0, 3.0 * delta));
    camera.lookAt(this.currentLookTarget);
  }
}
