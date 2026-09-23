import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AssetManager } from '../assets/AssetManager';
import { SOLAR_PLANET_CONFIGS, PlanetConfig } from '../../config/planets';
import { MISSION_PROJECTS } from '../../data/projects';
import { Planet } from './Planet';

/**
 * PlanetManager - Coordinates the Solar System Planetary Bodies and Central Star
 */
export class PlanetManager {
  public rootNode: TransformNode;
  public planets: Planet[] = [];
  public sunMesh: Mesh;
  public sunCorona: Mesh;
  public externalSunModelNode?: TransformNode;

  constructor(scene: Scene) {
    this.rootNode = new TransformNode('solarSystemRoot', scene);

    // ==========================================
    // 1. CENTRAL STAR: THE SUN
    // ==========================================
    this.sunMesh = MeshBuilder.CreateSphere('theSun', { diameter: 10.4, segments: 48 }, scene);
    this.sunMesh.parent = this.rootNode;
    this.sunMesh.position = new Vector3(0, 0, 0);

    const sunMat = new StandardMaterial('sunMat', scene);
    sunMat.emissiveColor = new Color3(1.0, 0.85, 0.45);
    sunMat.diffuseColor = new Color3(1.0, 0.9, 0.5);

    const sunTex = new DynamicTexture('sunTex', 512, scene, false);
    const sCtx = sunTex.getContext();
    const grad = sCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, '#fffbeb');
    grad.addColorStop(0.4, '#f59e0b');
    grad.addColorStop(0.8, '#d97706');
    grad.addColorStop(1, '#9a3412');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 512, 512);
    sunTex.update();
    sunMat.diffuseTexture = sunTex;
    this.sunMesh.material = sunMat;

    // Solar Corona Glow
    this.sunCorona = MeshBuilder.CreateSphere('sunCorona', { diameter: 13.5, segments: 24 }, scene);
    this.sunCorona.parent = this.rootNode;
    const coronaMat = new StandardMaterial('coronaMat', scene);
    coronaMat.emissiveColor = new Color3(0.95, 0.65, 0.15);
    coronaMat.alpha = 0.22;
    coronaMat.backFaceCulling = false;
    this.sunCorona.material = coronaMat;

    // ==========================================
    // 2. ORBITAL PLANETARY BODIES (MERCURY -> PLUTO)
    // ==========================================
    SOLAR_PLANET_CONFIGS.forEach((config: PlanetConfig, idx: number) => {
      const initialAngle = (idx * (Math.PI * 2)) / SOLAR_PLANET_CONFIGS.length + 0.45;
      const matchedProject = MISSION_PROJECTS.find(
        (p) => p.id === config.projectId || p.planet.toLowerCase() === config.id.toLowerCase()
      );
      const planet = new Planet(scene, config, initialAngle, matchedProject);
      planet.rootNode.parent = this.rootNode;
      this.planets.push(planet);
    });

    // 3. Load external Sketchfab 3D Sun model if available
    this.loadExternalSunModel(scene);
  }

  /**
   * Loads high-fidelity Sketchfab 3D Sun model and replaces procedural sphere
   */
  private async loadExternalSunModel(scene: Scene) {
    try {
      const assetManager = AssetManager.getInstance(scene);
      const result = await assetManager.loadAsset('star-sun', this.rootNode, 10.4);
      if (result) {
        this.externalSunModelNode = result.root;
        this.sunMesh.isVisible = false;
        this.sunMesh.setEnabled(false);

        // Adjust corona opacity to let detailed solar granulation & prominences shine through
        if (this.sunCorona.material && this.sunCorona.material instanceof StandardMaterial) {
          this.sunCorona.material.alpha = 0.16;
        }

        // Attach interactive picking metadata
        result.meshes.forEach((mesh) => {
          mesh.metadata = {
            planetId: 'sun',
            planetName: 'The Sun (Sol)',
            projectId: 'sun-core',
            description: 'The central star of the Solar System, powering the cosmic portfolio.',
            isHeroModel: true,
            type: 'star',
          };
        });
      }
    } catch (err) {
      console.warn('[PlanetManager] External Sun model fallback to procedural core:', err);
    }
  }

  public update(delta: number, selectedPlanetId: string | null) {
    if (this.sunMesh.isEnabled()) {
      this.sunMesh.rotation.y += 0.003;
    }
    if (this.externalSunModelNode) {
      this.externalSunModelNode.rotation.y += 0.0018;
    }

    this.planets.forEach((p) => {
      const isSelected = p.config.id === selectedPlanetId || p.project?.id === selectedPlanetId;
      p.update(delta, isSelected);
    });
  }

  public getPlanet(id: string): Planet | undefined {
    return this.planets.find((p) => p.config.id === id || p.project?.id === id);
  }

  public getPlanetMeshes(): Mesh[] {
    return this.planets.map((p) => p.bodyMesh);
  }
}
