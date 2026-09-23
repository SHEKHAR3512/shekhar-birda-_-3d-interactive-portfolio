import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scalar } from '@babylonjs/core/Maths/math.scalar';
import { Spaceship } from './Spaceship';
import { sound } from '../../utils/sound';

export interface StarfighterFlightInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  boost: boolean;
  brake: boolean;
  rollLeft: boolean;
  rollRight: boolean;
}

export const defaultFlightInput: StarfighterFlightInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
  brake: false,
  rollLeft: false,
  rollRight: false,
};

export interface ShipControllerConfig {
  maxNormalSpeed?: number;
  maxBoostSpeed?: number;
  accelRate?: number;
  brakeRate?: number;
  dragRate?: number;
  turnSpeed?: number;
}

/**
 * ShipController - Dedicated Delta-Time Kinematic & Aerodynamic Spacecraft Controller
 */
export class ShipController {
  public maxNormalSpeed: number = 18.0;
  public maxBoostSpeed: number = 38.0;
  public accelRate: number = 26.0;
  public brakeRate: number = 34.0;
  public dragRate: number = 5.2;
  public turnSpeed: number = 2.8;

  // Kinetic state
  public position: Vector3 = new Vector3(0, 0, 32);
  public velocity: Vector3 = new Vector3(0, 0, 0);
  public heading: number = 0; // Yaw (around Y axis)
  public pitch: number = 0;   // Pitch (around X axis)
  public roll: number = 0;    // Banking (around Z axis)
  public currentSpeed: number = 0;
  public targetSpeed: number = 0;

  // Internal visual roll smoothing
  private visualRoll: number = 0;
  private visualPitch: number = 0;

  constructor(config?: ShipControllerConfig) {
    if (config?.maxNormalSpeed) this.maxNormalSpeed = config.maxNormalSpeed;
    if (config?.maxBoostSpeed) this.maxBoostSpeed = config.maxBoostSpeed;
    if (config?.accelRate) this.accelRate = config.accelRate;
    if (config?.brakeRate) this.brakeRate = config.brakeRate;
    if (config?.dragRate) this.dragRate = config.dragRate;
    if (config?.turnSpeed) this.turnSpeed = config.turnSpeed;
  }

  /**
   * Hard re-orient or reposition (e.g. after orbital disengagement or autopilot jump)
   */
  public setTransform(pos: Vector3, heading: number, speed: number = 0) {
    this.position.copyFrom(pos);
    this.heading = heading;
    this.pitch = 0;
    this.roll = 0;
    this.currentSpeed = speed;
    const forwardX = Math.sin(heading);
    const forwardZ = Math.cos(heading);
    this.velocity = new Vector3(forwardX * speed, 0, forwardZ * speed);
  }

  /**
   * Main delta-time update loop for spacecraft kinematics
   */
  public update(delta: number, input: StarfighterFlightInput, ship: Spaceship) {
    const isBoosting = input.boost && this.currentSpeed > 5.0;
    const effectiveTurn = isBoosting ? this.turnSpeed * 0.72 : this.turnSpeed;

    // 1. Steering & Yaw Rotation
    let turnDirection = 0;
    if (input.left || input.rollLeft) turnDirection += 1;
    if (input.right || input.rollRight) turnDirection -= 1;

    this.heading += turnDirection * effectiveTurn * delta;

    // 2. Throttle & Speed Calculation
    const targetMax = input.boost ? this.maxBoostSpeed : this.maxNormalSpeed;

    if (input.forward) {
      this.targetSpeed = Scalar.Lerp(this.targetSpeed, targetMax, Scalar.Clamp(delta * 4.5, 0, 1));
      this.currentSpeed = Math.min(this.currentSpeed + this.accelRate * delta, this.targetSpeed);
    } else if (input.backward || input.brake) {
      this.targetSpeed = 0;
      this.currentSpeed = Math.max(0, this.currentSpeed - this.brakeRate * delta);
    } else {
      // Natural aerodynamic drag deceleration
      this.targetSpeed = 0;
      this.currentSpeed = Math.max(0, this.currentSpeed - this.dragRate * delta);
    }

    // 3. Banking & Aerodynamic Nose Pitch
    const targetRoll = turnDirection * 0.42; // Up to 24° banking on turns
    this.visualRoll = Scalar.Lerp(this.visualRoll, targetRoll, Scalar.Clamp(delta * 6.5, 0, 1));
    this.roll = this.visualRoll;

    const targetPitch = input.forward ? -0.06 : 0; // Subtle aggressive nose dip under throttle
    this.visualPitch = Scalar.Lerp(this.visualPitch, targetPitch, Scalar.Clamp(delta * 5.0, 0, 1));
    this.pitch = this.visualPitch;

    // 4. Update Position Vector
    const forwardX = Math.sin(this.heading);
    const forwardZ = Math.cos(this.heading);

    this.position.x += forwardX * this.currentSpeed * delta;
    this.position.z += forwardZ * this.currentSpeed * delta;

    // Keep slight hover oscillation
    this.position.y = 0.5 + Math.sin(performance.now() * 0.002) * 0.15;

    // 5. Apply to Babylon Spaceship Node
    ship.rootNode.position.copyFrom(this.position);
    ship.rootNode.rotation.set(this.pitch, this.heading, this.roll);

    // 6. Update Visual Particle Effects & Lighting
    ship.update(delta, this.currentSpeed, isBoosting, input.forward);

    // 7. Update Audio Engine Synthesizer
    sound.updateEngine(this.currentSpeed, isBoosting);
  }
}
