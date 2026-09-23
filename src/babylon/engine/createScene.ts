import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import '@babylonjs/core/Culling/ray';

export interface CosmicSceneContext {
  scene: Scene;
  pipeline: DefaultRenderingPipeline;
  sunLight: PointLight;
  ambientLight: HemisphericLight;
  chaseLight: DirectionalLight;
}

/**
 * createScene - Initializes the Babylon.js 3D Cosmos Scene with PBR Lighting & Post-Processing
 */
export function createScene(engine: Engine): CosmicSceneContext {
  const scene = new Scene(engine);

  // Deep interstellar void background
  scene.clearColor = new Color4(0.012, 0.02, 0.047, 1.0);
  scene.ambientColor = new Color3(0.05, 0.08, 0.15);

  // 1. Cosmic Ambient & Hemisphere Light
  const ambientLight = new HemisphericLight('cosmicHemiLight', new Vector3(0, 1, 0), scene);
  ambientLight.diffuse = new Color3(0.45, 0.65, 0.95);
  ambientLight.groundColor = new Color3(0.04, 0.06, 0.12);
  ambientLight.intensity = 0.85;

  // 2. Central Solar Core Point Light
  const sunLight = new PointLight('sunPointLight', new Vector3(0, 0, 0), scene);
  sunLight.diffuse = new Color3(1.0, 0.96, 0.88);
  sunLight.specular = new Color3(1.0, 0.85, 0.65);
  sunLight.range = 650;
  sunLight.intensity = 3.2;

  // 3. Dynamic Camera Chase Fill Light
  const chaseLight = new DirectionalLight('shipChaseLight', new Vector3(0, -0.3, 1), scene);
  chaseLight.diffuse = new Color3(0.85, 0.92, 1.0);
  chaseLight.specular = new Color3(1.0, 1.0, 1.0);
  chaseLight.intensity = 1.2;

  // 4. Default Cinematic Rendering Pipeline (Bloom, Chromatic Aberration, Tone Mapping)
  const pipeline = new DefaultRenderingPipeline('defaultCosmicPipeline', true, scene, scene.cameras);
  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.65;
  pipeline.bloomWeight = 0.45;
  pipeline.bloomKernel = 64;
  pipeline.bloomScale = 0.5;

  pipeline.chromaticAberrationEnabled = false; // Enabled dynamically during boost
  pipeline.chromaticAberration.aberrationAmount = 25;
  pipeline.chromaticAberration.radialIntensity = 1.2;

  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.toneMappingEnabled = true;
  pipeline.imageProcessing.toneMappingType = 1; // ACES
  pipeline.imageProcessing.exposure = 1.15;

  return {
    scene,
    pipeline,
    sunLight,
    ambientLight,
    chaseLight,
  };
}
