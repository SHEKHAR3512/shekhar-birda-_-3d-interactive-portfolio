import { Engine } from '@babylonjs/core/Engines/engine';

/**
 * PerformanceManager - Adaptive Resolution, Hardware Scaling, and FPS Optimization
 */
export class PerformanceManager {
  private engine: Engine;
  private sampleTimer: number = 0;
  private fpsSamples: number[] = [];

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public update(delta: number) {
    this.sampleTimer += delta;

    if (this.sampleTimer >= 2.0) {
      this.sampleTimer = 0;
      const currentFps = this.engine.getFps();
      this.fpsSamples.push(currentFps);

      if (this.fpsSamples.length > 5) {
        this.fpsSamples.shift();
      }

      const avgFps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;

      // Adaptive hardware scaling if struggling under 30 FPS
      if (avgFps < 32 && this.engine.getHardwareScalingLevel() < 1.4) {
        this.engine.setHardwareScalingLevel(1.25);
      } else if (avgFps > 55 && this.engine.getHardwareScalingLevel() > 1.0) {
        this.engine.setHardwareScalingLevel(1.0);
      }
    }
  }
}
