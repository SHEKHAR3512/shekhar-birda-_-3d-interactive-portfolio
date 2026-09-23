import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { PlanetConfig } from '../../config/planets';
import { MissionProject } from '../../data/projects';
import { AssetManager } from '../assets/AssetManager';

export interface CelestialMoon {
  root: TransformNode;
  orbitRadius: number;
  orbitSpeed: number;
  currentAngle: number;
}

/**
 * Planet - PBR Celestial Body with Multi-Layer Atmosphere, Dynamic Clouds, Saturn Rings, and Moons
 */
export class Planet {
  public rootNode: TransformNode;
  public bodyMesh: Mesh;
  public cloudMesh?: Mesh;
  public ringMesh?: Mesh;
  public atmosphereGlow?: Mesh;
  public orbitLine: Mesh;
  public moons: CelestialMoon[] = [];

  public config: PlanetConfig;
  public project?: MissionProject;
  public currentAngle: number;
  public orbitRadius: number;
  public orbitSpeed: number;
  public rotationSpeed: number;
  private externalModelNode?: TransformNode;

  constructor(scene: Scene, config: PlanetConfig, initialAngle: number, project?: MissionProject) {
    this.config = config;
    this.project = project;
    this.currentAngle = initialAngle;
    this.orbitRadius = config.orbitRadius;
    this.orbitSpeed = config.orbitSpeed;
    this.rotationSpeed = config.rotationSpeed;

    this.rootNode = new TransformNode(`planet_${config.id}`, scene);

    // Initial positioning on orbital plane
    this.rootNode.position = new Vector3(
      Math.cos(initialAngle) * this.orbitRadius,
      0,
      Math.sin(initialAngle) * this.orbitRadius
    );

    // 1. Planetary Sphere Body
    this.bodyMesh = MeshBuilder.CreateSphere(
      `mesh_${config.id}`,
      { diameter: config.radius * 2, segments: 48 },
      scene
    );
    this.bodyMesh.parent = this.rootNode;
    this.bodyMesh.metadata = {
      planetId: config.id,
      planetName: config.name,
      projectId: project?.id || config.projectId || config.id,
      description: config.description,
    };

    // Apply High-Detail Procedural PBR Material
    this.applyPlanetMaterial(scene);

    // 2. Dynamic Clouds Layer (Earth & Venus)
    if (config.clouds) {
      this.createCloudLayer(scene);
    }

    // 3. Realistic Planetary Ring System (Saturn & Uranus)
    if (config.rings) {
      this.createRingSystem(scene);
    }

    // 4. Atmospheric Rayleigh Scattering Glow
    if (config.atmosphere) {
      this.createAtmosphericGlow(scene);
    }

    // 5. Planetary Moons
    if (config.moons && config.moons.length > 0) {
      this.createMoons(scene);
    }

    // 6. Orbital Ellipse Path Line
    this.orbitLine = this.createOrbitLine(scene);

    // 7. Check for external Sketchfab GLB model via AssetManager
    this.loadExternalModel(scene);
  }

  /**
   * Attempts to load external Sketchfab model if placed in assets/space/planets/${id}
   */
  private async loadExternalModel(scene: Scene) {
    const assetManager = AssetManager.getInstance(scene);
    const assetKey = `planet-${this.config.id}`;
    // Scale hero model to the exact celestial diameter
    const result = await assetManager.loadAsset(assetKey, this.rootNode, this.config.radius * 2);
    if (result) {
      this.externalModelNode = result.root;
      this.bodyMesh.isVisible = false;
      this.bodyMesh.setEnabled(false);

      // Saturn: If Saturn has its own rings in the Sketchfab GLB, hide procedural disc
      if (this.config.id === 'saturn' && this.ringMesh) {
        this.ringMesh.isVisible = false;
        this.ringMesh.setEnabled(false);
      }

      // Earth: If Earth has its own clouds in the Sketchfab GLB, hide procedural clouds
      if (this.config.id === 'earth' && this.cloudMesh) {
        this.cloudMesh.isVisible = false;
        this.cloudMesh.setEnabled(false);
      }

      // Hide atmospheric glow so the realistic planet model texture is not obscured
      if (this.atmosphereGlow) {
        this.atmosphereGlow.isVisible = false;
        this.atmosphereGlow.setEnabled(false);
      }

      // Propagate interactive picking metadata to all submeshes
      result.meshes.forEach((mesh) => {
        mesh.metadata = {
          planetId: this.config.id,
          planetName: this.config.name,
          projectId: this.project?.id || this.config.projectId || this.config.id,
          description: this.config.description,
          isHeroModel: true,
        };
      });
    }
  }

  private applyPlanetMaterial(scene: Scene) {
    const pbr = new PBRMaterial(`pbr_${this.config.id}`, scene);
    pbr.metallic = 0.08;
    pbr.roughness = 0.72;
    pbr.environmentIntensity = 0.75;

    // Generate high-resolution procedural canvas texture (1024x512)
    const texture = new DynamicTexture(`tex_${this.config.id}`, { width: 1024, height: 512 }, scene, false);
    const ctx = texture.getContext() as unknown as CanvasRenderingContext2D;
    this.renderProceduralSurface(ctx, texture.getSize().width, texture.getSize().height);
    texture.update();

    pbr.albedoTexture = texture;
    this.bodyMesh.material = pbr;
  }

  private renderProceduralSurface(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const type = this.config.surfaceTextureType;

    switch (type) {
      case 'mercury': {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, w, h);
        // Craters & impact basins
        for (let i = 0; i < 90; i++) {
          const cx = Math.random() * w;
          const cy = Math.random() * h;
          const r = Math.random() * 22 + 4;
          const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
          grad.addColorStop(0, '#334155');
          grad.addColorStop(0.7, '#475569');
          grad.addColorStop(1, '#94a3b8');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'venus': {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.3, '#fde047');
        grad.addColorStop(0.6, '#eab308');
        grad.addColorStop(1, '#ca8a04');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Sulphuric cloud chevron bands
        ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
        for (let i = 0; i < 28; i++) {
          const y = (h / 28) * i;
          ctx.beginPath();
          ctx.ellipse(w / 2, y, w * 0.6, 12, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'earth': {
        // Deep oceanic blue
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Continental landmasses
        ctx.fillStyle = '#15803d';
        for (let i = 0; i < 18; i++) {
          const cx = Math.random() * w;
          const cy = Math.random() * h * 0.8 + h * 0.1;
          const rx = Math.random() * 140 + 60;
          const ry = Math.random() * 80 + 40;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mountain ridge highlights
        ctx.fillStyle = '#b45309';
        for (let i = 0; i < 12; i++) {
          const cx = Math.random() * w;
          const cy = Math.random() * h * 0.6 + h * 0.2;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.random() * 24 + 10, 0, Math.PI * 2);
          ctx.fill();
        }

        // Night side city lights (golden micro-clusters)
        ctx.fillStyle = 'rgba(253, 224, 71, 0.75)';
        for (let i = 0; i < 120; i++) {
          const cx = Math.random() * w * 0.5; // Concentrated on night half
          const cy = Math.random() * h * 0.7 + h * 0.15;
          ctx.fillRect(cx, cy, 2, 2);
        }

        // Polar ice caps
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, 32);
        ctx.fillRect(0, h - 32, w, 32);
        break;
      }

      case 'moon': {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 0, w, h);
        // Lunar maria (dark basalt plains)
        ctx.fillStyle = '#475569';
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.ellipse(Math.random() * w, Math.random() * h, Math.random() * 80 + 30, Math.random() * 60 + 20, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // Impact craters
        for (let i = 0; i < 120; i++) {
          const cx = Math.random() * w;
          const cy = Math.random() * h;
          const r = Math.random() * 16 + 2;
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'mars': {
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(0, 0, w, h);
        // Dark iron oxide basalt streaks
        ctx.fillStyle = '#7c2d12';
        for (let i = 0; i < 22; i++) {
          const y = (h / 22) * i;
          ctx.fillRect(0, y, w, Math.random() * 14 + 6);
        }
        // Polar ice caps
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, h - 20, w, 20);
        break;
      }

      case 'jupiter': {
        // Atmospheric zonal jets
        const bands = ['#78350f', '#b45309', '#d97706', '#f59e0b', '#fed7aa', '#92400e', '#451a03'];
        const bandHeight = h / 24;
        for (let i = 0; i < 24; i++) {
          ctx.fillStyle = bands[i % bands.length];
          ctx.fillRect(0, i * bandHeight, w, bandHeight);
        }
        // Great Red Spot storm vortex
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.ellipse(w * 0.65, h * 0.62, 54, 32, 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(w * 0.65, h * 0.62, 38, 20, 0.08, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'saturn': {
        const bands = ['#fef3c7', '#fde68a', '#fcd34d', '#f59e0b', '#d97706', '#b45309'];
        const bandHeight = h / 20;
        for (let i = 0; i < 20; i++) {
          ctx.fillStyle = bands[i % bands.length];
          ctx.fillRect(0, i * bandHeight, w, bandHeight);
        }
        break;
      }

      case 'uranus': {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#7dd3fc');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        break;
      }

      case 'neptune': {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#60a5fa');
        grad.addColorStop(0.5, '#2563eb');
        grad.addColorStop(1, '#1e40af');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Supersonic methane storm streak
        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.ellipse(w * 0.4, h * 0.45, 65, 12, -0.05, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'pluto': {
        // Muted nitrogen-methane plains
        ctx.fillStyle = '#78716c';
        ctx.fillRect(0, 0, w, h);
        // Tombaugh Regio "Heart" feature
        ctx.fillStyle = '#f5f5f4';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.48, 70, 55, 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Hydrocarbon tholin red-brown fringes
        ctx.fillStyle = '#831843';
        for (let i = 0; i < 15; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h * 0.5 + h * 0.4, Math.random() * 40 + 20, 14);
        }
        break;
      }
    }
  }

  private createCloudLayer(scene: Scene) {
    this.cloudMesh = MeshBuilder.CreateSphere(
      `clouds_${this.config.id}`,
      { diameter: this.config.radius * 2.03, segments: 36 },
      scene
    );
    this.cloudMesh.parent = this.rootNode;

    const cloudMat = new StandardMaterial(`cloudMat_${this.config.id}`, scene);
    cloudMat.alpha = 0.45;
    cloudMat.diffuseColor = new Color3(1, 1, 1);
    this.cloudMesh.material = cloudMat;
  }

  private createRingSystem(scene: Scene) {
    const innerRadius = this.config.ringInnerRadius || this.config.radius * 1.5;
    const outerRadius = this.config.ringOuterRadius || this.config.radius * 2.8;

    this.ringMesh = MeshBuilder.CreateDisc(
      `rings_${this.config.id}`,
      { radius: outerRadius, tessellation: 72 },
      scene
    );
    this.ringMesh.parent = this.rootNode;
    // Realistic Saturn axial tilt (~26.7 degrees)
    this.ringMesh.rotation.x = Math.PI / 2.3;

    const ringMat = new StandardMaterial(`ringMat_${this.config.id}`, scene);
    ringMat.diffuseColor = Color3.FromHexString(this.config.ringColor || '#fed7aa');
    ringMat.alpha = 0.88;
    ringMat.backFaceCulling = false;
    this.ringMesh.material = ringMat;
  }

  private createAtmosphericGlow(scene: Scene) {
    const scale = this.config.atmosphereScale || 1.14;
    this.atmosphereGlow = MeshBuilder.CreateSphere(
      `atmo_${this.config.id}`,
      { diameter: this.config.radius * 2 * scale, segments: 24 },
      scene
    );
    this.atmosphereGlow.parent = this.rootNode;

    const atmoMat = new StandardMaterial(`atmoMat_${this.config.id}`, scene);
    atmoMat.diffuseColor = Color3.FromHexString(this.config.atmosphereColor || this.config.color);
    atmoMat.alpha = 0.14;
    atmoMat.backFaceCulling = false;
    this.atmosphereGlow.material = atmoMat;
  }

  private createMoons(scene: Scene) {
    if (!this.config.moons) return;

    this.config.moons.forEach(async (cfg) => {
      const moonRoot = new TransformNode(`moonRoot_${this.config.id}_${cfg.id}`, scene);
      moonRoot.parent = this.rootNode;

      const moonMesh = MeshBuilder.CreateSphere(`moon_${this.config.id}_${cfg.id}`, { diameter: cfg.radius * 2, segments: 18 }, scene);
      const moonMat = new StandardMaterial(`moonMat_${cfg.id}`, scene);
      moonMat.diffuseColor = Color3.FromHexString(cfg.color);
      moonMesh.material = moonMat;
      moonMesh.parent = moonRoot;

      // If this is Earth's moon (Luna), load the external Sketchfab Moon GLB!
      if (cfg.id === 'moon') {
        const assetManager = AssetManager.getInstance(scene);
        const moonResult = await assetManager.loadAsset('planet-moon', moonRoot, cfg.radius * 2);
        if (moonResult) {
          moonMesh.isVisible = false;
        }
      }

      this.moons.push({
        root: moonRoot,
        orbitRadius: cfg.dist,
        orbitSpeed: cfg.speed,
        currentAngle: Math.random() * Math.PI * 2,
      });
    });
  }

  private createOrbitLine(scene: Scene): Mesh {
    const points: Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new Vector3(Math.cos(theta) * this.orbitRadius, 0, Math.sin(theta) * this.orbitRadius));
    }

    const orbit = MeshBuilder.CreateLines(`orbit_${this.config.id}`, { points }, scene);
    orbit.color = Color3.FromHexString(this.config.color);
    orbit.alpha = 0.22;
    return orbit;
  }

  public update(delta: number, isSelected: boolean) {
    // 1. Orbital revolution
    const orbitMult = isSelected ? 0.05 : 0.35;
    this.currentAngle += this.orbitSpeed * delta * orbitMult;

    this.rootNode.position.x = Math.cos(this.currentAngle) * this.orbitRadius;
    this.rootNode.position.z = Math.sin(this.currentAngle) * this.orbitRadius;

    // 2. Axial rotation
    this.bodyMesh.rotation.y += this.rotationSpeed;
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += this.rotationSpeed * (this.config.cloudSpeed || 1.3);
    }
    if (this.externalModelNode) {
      this.externalModelNode.rotation.y += this.rotationSpeed;
    }

    // 3. Moon revolutions
    this.moons.forEach((m) => {
      m.currentAngle += m.orbitSpeed * delta;
      m.root.position.x = Math.cos(m.currentAngle) * m.orbitRadius;
      m.root.position.z = Math.sin(m.currentAngle) * m.orbitRadius;
    });

    // 4. Orbit line highlight
    this.orbitLine.visibility = isSelected ? 0.75 : 0.2;
  }
}
