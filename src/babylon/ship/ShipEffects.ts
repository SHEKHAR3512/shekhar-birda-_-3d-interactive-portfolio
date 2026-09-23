import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { Color4, Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { Scene } from '@babylonjs/core/scene';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';

/**
 * ShipEffects - High-Performance Ion Thruster Plumes & Navigation Beacons
 */
export class ShipEffects {
  private leftEngineParticles: ParticleSystem | null = null;
  private rightEngineParticles: ParticleSystem | null = null;
  private thrusterGlowLight: PointLight;
  private strobeTimer: number = 0;

  constructor(
    scene: Scene,
    engineLeftNode: AbstractMesh,
    engineRightNode: AbstractMesh
  ) {
    // 1. Procedural circular flame flare texture
    const flareTex = new DynamicTexture('flareTex', 64, scene, false);
    const ctx = flareTex.getContext();
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.85)');
    grad.addColorStop(0.7, 'rgba(14, 116, 144, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    flareTex.update();

    // 2. Left Engine Thruster
    this.leftEngineParticles = this.createThruster(scene, engineLeftNode, flareTex);
    // 3. Right Engine Thruster
    this.rightEngineParticles = this.createThruster(scene, engineRightNode, flareTex);

    // 4. Dynamic Thruster Emissive Point Light
    this.thrusterGlowLight = new PointLight('thrusterGlowLight', new Vector3(0, 0, -2.5), scene);
    this.thrusterGlowLight.parent = engineLeftNode.parent;
    this.thrusterGlowLight.diffuse = new Color3(0.22, 0.74, 1.0);
    this.thrusterGlowLight.specular = new Color3(0.5, 0.85, 1.0);
    this.thrusterGlowLight.range = 12;
    this.thrusterGlowLight.intensity = 1.5;
  }

  private createThruster(scene: Scene, emitterNode: AbstractMesh, texture: DynamicTexture): ParticleSystem {
    const ps = new ParticleSystem('enginePlume', 300, scene);
    ps.particleTexture = texture;
    ps.emitter = emitterNode;

    ps.minEmitBox = new Vector3(-0.08, -0.08, 0);
    ps.maxEmitBox = new Vector3(0.08, 0.08, 0);

    // Color: White-hot core transitioning to ion cyan and deep space void
    ps.color1 = new Color4(1.0, 1.0, 1.0, 1.0);
    ps.color2 = new Color4(0.22, 0.74, 1.0, 0.85);
    ps.colorDead = new Color4(0.05, 0.15, 0.5, 0.0);

    ps.minSize = 0.25;
    ps.maxSize = 0.55;

    ps.minLifeTime = 0.12;
    ps.maxLifeTime = 0.35;

    ps.emitRate = 180;
    ps.blendMode = ParticleSystem.BLENDMODE_ADD;

    ps.gravity = new Vector3(0, 0, 0);
    // Particles shoot out backwards relative to ship
    ps.direction1 = new Vector3(-0.1, -0.1, -1.0);
    ps.direction2 = new Vector3(0.1, 0.1, -1.0);

    ps.minEmitPower = 8.0;
    ps.maxEmitPower = 14.0;
    ps.updateSpeed = 0.02;

    ps.start();
    return ps;
  }

  /**
   * Update particle dynamics based on speed and throttle
   */
  public update(delta: number, speed: number, isBoosting: boolean, isAccelerating: boolean) {
    this.strobeTimer += delta;

    const baseEmit = isAccelerating ? (isBoosting ? 380 : 260) : 100;
    const powerMult = isBoosting ? 2.2 : isAccelerating ? 1.4 : 0.8;
    const lightIntensity = isBoosting ? 3.5 : isAccelerating ? 2.0 : 0.9;

    if (this.leftEngineParticles && this.rightEngineParticles) {
      this.leftEngineParticles.emitRate = baseEmit;
      this.rightEngineParticles.emitRate = baseEmit;

      this.leftEngineParticles.minEmitPower = 6.0 * powerMult;
      this.leftEngineParticles.maxEmitPower = 12.0 * powerMult;
      this.rightEngineParticles.minEmitPower = 6.0 * powerMult;
      this.rightEngineParticles.maxEmitPower = 12.0 * powerMult;

      if (isBoosting) {
        this.leftEngineParticles.color2 = new Color4(0.55, 0.9, 1.0, 1.0);
        this.rightEngineParticles.color2 = new Color4(0.55, 0.9, 1.0, 1.0);
      } else {
        this.leftEngineParticles.color2 = new Color4(0.22, 0.74, 1.0, 0.85);
        this.rightEngineParticles.color2 = new Color4(0.22, 0.74, 1.0, 0.85);
      }
    }

    this.thrusterGlowLight.intensity = lightIntensity;
  }

  public dispose() {
    this.leftEngineParticles?.dispose();
    this.rightEngineParticles?.dispose();
    this.thrusterGlowLight.dispose();
  }
}
