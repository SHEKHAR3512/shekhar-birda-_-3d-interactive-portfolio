import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { AssetManager } from '../assets/AssetManager';

export interface AsteroidInstance {
  orbitRadius: number;
  angle: number;
  speed: number;
  yOffset: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  currentRotX: number;
  currentRotY: number;
  currentRotZ: number;
  scale: number;
}

export interface SpecialCosmicObject {
  root: TransformNode;
  orbitRadius: number;
  orbitSpeed: number;
  currentAngle: number;
  elevation: number;
  rotSpeed: number;
}

/**
 * AsteroidField - Multi-Tier Asteroid System with Sketchfab Asteroid Packs & Special Meteors
 */
export class AsteroidField {
  public baseMesh: Mesh;
  public debrisMesh: Mesh;
  public heroAsteroids: Mesh[] = [];
  public specialObjects: SpecialCosmicObject[] = [];
  public sketchfabBeltMeshes: Mesh[] = [];
  private sketchfabBuffers: Float32Array[] = [];

  private asteroids: AsteroidInstance[] = [];
  private debrisInstances: AsteroidInstance[] = [];
  private matricesData: Float32Array;
  private debrisMatricesData: Float32Array;
  private count: number = 520;
  private debrisCount: number = 80;

  constructor(scene: Scene) {
    // 1. Chondrite Rocky PBR Material
    const pbrRock = new PBRMaterial('pbrAsteroid', scene);
    pbrRock.albedoColor = new Color3(0.42, 0.45, 0.52);
    pbrRock.roughness = 0.92;
    pbrRock.metallic = 0.18;

    // 2. Metallic Debris PBR Material
    const pbrDebris = new PBRMaterial('pbrDebris', scene);
    pbrDebris.albedoColor = new Color3(0.68, 0.72, 0.78);
    pbrDebris.roughness = 0.35;
    pbrDebris.metallic = 0.85;

    // 3. Procedural Fallback Meshes
    this.baseMesh = MeshBuilder.CreatePolyhedron('baseAsteroid', { type: 1, size: 0.85 }, scene);
    this.baseMesh.material = pbrRock;
    this.matricesData = new Float32Array(this.count * 16);

    this.debrisMesh = MeshBuilder.CreatePolyhedron('baseDebris', { type: 2, size: 0.35 }, scene);
    this.debrisMesh.material = pbrDebris;
    this.debrisMatricesData = new Float32Array(this.debrisCount * 16);

    // 4. Populate Main Asteroid Belt Coordinates (Between Mars at 48 and Jupiter at 60)
    for (let i = 0; i < this.count; i++) {
      const orbitRadius = 51 + Math.random() * 8.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.012 + Math.random() * 0.018;
      const yOffset = (Math.random() - 0.5) * 4.2;
      const scale = 0.28 + Math.random() * 0.95;

      this.asteroids.push({
        orbitRadius,
        angle,
        speed,
        yOffset,
        rotSpeedX: (Math.random() - 0.5) * 0.6,
        rotSpeedY: (Math.random() - 0.5) * 0.6,
        rotSpeedZ: (Math.random() - 0.5) * 0.6,
        currentRotX: Math.random() * Math.PI,
        currentRotY: Math.random() * Math.PI,
        currentRotZ: Math.random() * Math.PI,
        scale,
      });

      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const matrix = Matrix.Compose(
        new Vector3(scale, scale, scale),
        Quaternion.FromEulerAngles(0, 0, 0),
        new Vector3(x, yOffset, z)
      );
      matrix.copyToArray(this.matricesData, i * 16);
    }
    this.baseMesh.thinInstanceSetBuffer('matrix', this.matricesData, 16, false);

    // 5. Populate Debris Field
    for (let i = 0; i < this.debrisCount; i++) {
      const orbitRadius = 57 + Math.random() * 4.0;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.025 + Math.random() * 0.035;
      const yOffset = (Math.random() - 0.5) * 2.5;
      const scale = 0.15 + Math.random() * 0.45;

      this.debrisInstances.push({
        orbitRadius,
        angle,
        speed,
        yOffset,
        rotSpeedX: (Math.random() - 0.5) * 1.8,
        rotSpeedY: (Math.random() - 0.5) * 1.8,
        rotSpeedZ: (Math.random() - 0.5) * 1.8,
        currentRotX: Math.random() * Math.PI,
        currentRotY: Math.random() * Math.PI,
        currentRotZ: Math.random() * Math.PI,
        scale,
      });

      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const matrix = Matrix.Compose(
        new Vector3(scale, scale, scale),
        Quaternion.FromEulerAngles(0, 0, 0),
        new Vector3(x, yOffset, z)
      );
      matrix.copyToArray(this.debrisMatricesData, i * 16);
    }
    this.debrisMesh.thinInstanceSetBuffer('matrix', this.debrisMatricesData, 16, false);

    // 6. Hero Asteroids & Special Encounters
    this.createHeroAsteroids(scene, pbrRock);
    this.createSpecialEncounters(scene);

    // 7. Load Sketchfab 3D Asteroid Pack to replace polyhedron belt instances
    this.loadSketchfabAsteroids(scene);
  }

  /**
   * Loads real 3D Sketchfab asteroid meshes and distributes thin instances across the belt
   */
  private async loadSketchfabAsteroids(scene: Scene) {
    try {
      const result = await SceneLoader.ImportMeshAsync(
        '',
        '/assets/space/asteroids/low_poly/',
        'model.glb',
        scene
      );

      const validMeshes = result.meshes.filter((m) => m instanceof Mesh && m.getTotalVertices() > 0) as Mesh[];
      if (validMeshes.length === 0) return;

      this.sketchfabBeltMeshes = validMeshes;

      // Disable procedural polyhedrons
      this.baseMesh.setEnabled(false);
      this.baseMesh.isVisible = false;
      this.debrisMesh.setEnabled(false);
      this.debrisMesh.isVisible = false;

      // Distribute instances across the real Sketchfab asteroid meshes
      const meshCount = validMeshes.length;
      const perMeshCount = Math.ceil(this.count / meshCount);

      this.sketchfabBuffers = validMeshes.map(() => new Float32Array(perMeshCount * 16));

      validMeshes.forEach((mesh, mIdx) => {
        mesh.isVisible = true;
        mesh.setEnabled(true);
        mesh.parent = null;
        mesh.position.set(0, 0, 0);

        const buffer = this.sketchfabBuffers[mIdx];
        let instIdx = 0;

        for (let i = mIdx; i < this.count; i += meshCount) {
          const a = this.asteroids[i];
          const x = Math.cos(a.angle) * a.orbitRadius;
          const z = Math.sin(a.angle) * a.orbitRadius;
          const q = Quaternion.FromEulerAngles(a.currentRotX, a.currentRotY, a.currentRotZ);
          // Scale factor calibrated for Sketchfab asteroid mesh bounds (~0.008 for native 100-unit mesh)
          const meshScale = a.scale * 0.012;
          const matrix = Matrix.Compose(
            new Vector3(meshScale, meshScale, meshScale),
            q,
            new Vector3(x, a.yOffset, z)
          );
          matrix.copyToArray(buffer, instIdx * 16);
          instIdx++;
        }

        mesh.thinInstanceSetBuffer('matrix', buffer, 16, false);
      });

      console.log(`[AsteroidField] Successfully instantiated ${this.count} real Sketchfab asteroids across ${meshCount} models.`);
    } catch (err) {
      console.warn('[AsteroidField] Could not load Sketchfab asteroid belt models, using fallback.', err);
    }
  }

  private createHeroAsteroids(scene: Scene, mat: PBRMaterial) {
    const heroConfigs = [
      { name: 'Ceres Prime (Hero Asteroid)', pos: new Vector3(53, 0.5, 8), size: 3.2, ore: 'Platinum Rich', asset: 'asteroid-med-poly' },
      { name: 'Vesta Deep Core', pos: new Vector3(-32, -1.2, 42), size: 2.6, ore: 'Titanium Silicate', asset: 'asteroid-low-poly' },
      { name: 'Pallas Mining Outpost Rock', pos: new Vector3(25, 0.8, -48), size: 2.9, ore: 'Heavy Water Ice', asset: 'asteroid-med-poly' },
    ];

    const oreMat = new StandardMaterial('oreGlowMat', scene);
    oreMat.emissiveColor = new Color3(0.2, 0.85, 0.95);

    const assetManager = AssetManager.getInstance(scene);

    heroConfigs.forEach((cfg, idx) => {
      const hero = MeshBuilder.CreatePolyhedron(`heroAsteroid_${idx}`, { type: 1, size: cfg.size }, scene);
      hero.position.copyFrom(cfg.pos);
      hero.material = mat;
      hero.metadata = {
        name: cfg.name,
        type: 'asteroid',
        oreDeposit: cfg.ore,
        scanInfo: `High-density ore formation. Exploitable mineral yield: 94%.`,
      };

      // Glowing mineral vein marker
      const vein = MeshBuilder.CreateBox(`vein_${idx}`, { width: cfg.size * 0.4, height: 0.12, depth: cfg.size * 0.3 }, scene);
      vein.parent = hero;
      vein.material = oreMat;
      vein.position.set(0, cfg.size * 0.45, 0);

      this.heroAsteroids.push(hero);

      // Load Sketchfab 3D Asteroid Model
      assetManager.loadAsset(cfg.asset, hero, cfg.size * 1.2).then((res) => {
        if (res) {
          hero.isVisible = false;
          hero.setEnabled(false);
          res.meshes.forEach((m) => {
            m.metadata = {
              name: cfg.name,
              type: 'asteroid',
              oreDeposit: cfg.ore,
              scanInfo: `High-density ore formation. Exploitable mineral yield: 94%.`,
              isHeroModel: true,
            };
          });
        }
      });
    });
  }

  /**
   * Special Encounters: Ancient Meteorite & Hypervelocity Glowing Meteor
   */
  private createSpecialEncounters(scene: Scene) {
    const assetManager = AssetManager.getInstance(scene);

    // Special 1: Ancient Meteorite
    const meteoriteNode = new TransformNode('special_meteorite_root', scene);
    meteoriteNode.position.set(58, 2.5, -24);
    meteoriteNode.metadata = {
      name: 'Ancient Chondritic Meteorite',
      type: 'special-anomaly',
      description: 'Pre-solar primitive meteorite rich in nickel-iron and interstellar carbon chondrules.',
    };

    assetManager.loadAsset('special-meteorite', meteoriteNode, 2.8).then((res) => {
      if (res) {
        res.meshes.forEach((m) => {
          m.metadata = meteoriteNode.metadata;
        });
      }
    });

    this.specialObjects.push({
      root: meteoriteNode,
      orbitRadius: 58,
      orbitSpeed: 0.022,
      currentAngle: 1.8,
      elevation: 2.5,
      rotSpeed: 0.18,
    });

    // Special 2: Hypervelocity Glowing Meteor
    const meteorNode = new TransformNode('special_meteor_root', scene);
    meteorNode.position.set(66, -1.8, 32);
    meteorNode.metadata = {
      name: 'Hypervelocity Meteor Omega',
      type: 'special-anomaly',
      description: 'Active interstellar meteoroid shedding ionized plasma as it traverses the solar plane.',
    };

    const comaMat = new StandardMaterial('meteorComaMat', scene);
    comaMat.emissiveColor = new Color3(1.0, 0.45, 0.1);
    comaMat.alpha = 0.35;
    const comaHalo = MeshBuilder.CreateSphere('meteorHalo', { diameter: 3.6 }, scene);
    comaHalo.material = comaMat;
    comaHalo.parent = meteorNode;

    assetManager.loadAsset('special-meteor', meteorNode, 3.0).then((res) => {
      if (res) {
        res.meshes.forEach((m) => {
          m.metadata = meteorNode.metadata;
        });
      }
    });

    this.specialObjects.push({
      root: meteorNode,
      orbitRadius: 66,
      orbitSpeed: 0.038,
      currentAngle: 4.2,
      elevation: -1.8,
      rotSpeed: 0.42,
    });
  }

  public update(delta: number) {
    const meshCount = this.sketchfabBeltMeshes.length;

    // 1. Update Belt Instances (Sketchfab models if loaded, otherwise fallback)
    if (meshCount > 0) {
      for (let mIdx = 0; mIdx < meshCount; mIdx++) {
        const buffer = this.sketchfabBuffers[mIdx];
        let instIdx = 0;

        for (let i = mIdx; i < this.count; i += meshCount) {
          const a = this.asteroids[i];
          a.angle += a.speed * delta;
          a.currentRotX += a.rotSpeedX * delta;
          a.currentRotY += a.rotSpeedY * delta;

          const x = Math.cos(a.angle) * a.orbitRadius;
          const z = Math.sin(a.angle) * a.orbitRadius;
          const q = Quaternion.FromEulerAngles(a.currentRotX, a.currentRotY, a.currentRotZ);
          const meshScale = a.scale * 0.012;

          const matrix = Matrix.Compose(
            new Vector3(meshScale, meshScale, meshScale),
            q,
            new Vector3(x, a.yOffset, z)
          );
          matrix.copyToArray(buffer, instIdx * 16);
          instIdx++;
        }

        this.sketchfabBeltMeshes[mIdx].thinInstanceBufferUpdated('matrix');
      }
    } else {
      // Fallback
      for (let i = 0; i < this.count; i++) {
        const a = this.asteroids[i];
        a.angle += a.speed * delta;
        a.currentRotX += a.rotSpeedX * delta;
        a.currentRotY += a.rotSpeedY * delta;

        const x = Math.cos(a.angle) * a.orbitRadius;
        const z = Math.sin(a.angle) * a.orbitRadius;
        const q = Quaternion.FromEulerAngles(a.currentRotX, a.currentRotY, a.currentRotZ);
        const matrix = Matrix.Compose(
          new Vector3(a.scale, a.scale, a.scale),
          q,
          new Vector3(x, a.yOffset, z)
        );
        matrix.copyToArray(this.matricesData, i * 16);
      }
      this.baseMesh.thinInstanceBufferUpdated('matrix');
    }

    // 2. Slowly tumble hero asteroids
    this.heroAsteroids.forEach((h, idx) => {
      h.rotation.y += delta * (0.05 + idx * 0.02);
      h.rotation.x += delta * 0.02;
    });

    // 3. Update Special Cosmic Encounters
    this.specialObjects.forEach((s) => {
      s.currentAngle += s.orbitSpeed * delta;
      s.root.position.x = Math.cos(s.currentAngle) * s.orbitRadius;
      s.root.position.z = Math.sin(s.currentAngle) * s.orbitRadius;
      s.root.rotation.y += s.rotSpeed * delta;
      s.root.rotation.x += s.rotSpeed * 0.4 * delta;
    });
  }
}
