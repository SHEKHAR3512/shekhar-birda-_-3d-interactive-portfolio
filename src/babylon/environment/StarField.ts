import { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';

/**
 * StarField - Ultra-Performance GPU Thin-Instanced Starfield & Volumetric Nebula Dome
 * 
 * Features:
 * - 4,500+ Stars rendered in a SINGLE GPU draw call via Thin Instances
 * - Organic spherical distribution with multi-tier depth (near, mid, far)
 * - Deep interstellar procedural nebula dome with slow celestial drift
 */
export class StarField {
  public starMesh: Mesh;
  public nebulaDome: Mesh;

  constructor(scene: Scene) {
    // ==========================================
    // 1. PROCEDURAL NEBULA BACKGROUND DOME
    // ==========================================
    this.nebulaDome = MeshBuilder.CreateSphere('nebulaSkyDome', { diameter: 1400, segments: 24 }, scene);
    this.nebulaDome.infiniteDistance = true;

    const nebulaMat = new StandardMaterial('nebulaMat', scene);
    nebulaMat.backFaceCulling = false;
    nebulaMat.disableLighting = true;

    // Procedural drifting nebula texture
    const nebTex = new DynamicTexture('nebulaTex', { width: 512, height: 256 }, scene, false);
    const nCtx = nebTex.getContext();
    nCtx.fillStyle = '#02040a';
    nCtx.fillRect(0, 0, 512, 256);

    // Cosmic stardust clouds
    const clouds = [
      { x: 120, y: 90, r: 110, col: 'rgba(30, 27, 75, 0.45)' },
      { x: 280, y: 140, r: 130, col: 'rgba(2, 132, 199, 0.35)' },
      { x: 410, y: 100, r: 100, col: 'rgba(88, 28, 135, 0.38)' },
    ];
    clouds.forEach((c) => {
      const g = nCtx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      g.addColorStop(0, c.col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      nCtx.fillStyle = g;
      nCtx.beginPath();
      nCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      nCtx.fill();
    });
    nebTex.update();
    nebulaMat.emissiveTexture = nebTex;
    this.nebulaDome.material = nebulaMat;

    // ==========================================
    // 2. GPU THIN-INSTANCED STARFIELD (1 DRAW CALL)
    // ==========================================
    const starCount = 4500;
    this.starMesh = MeshBuilder.CreatePlane('baseStar', { size: 0.8 }, scene);
    this.starMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const starMat = new StandardMaterial('starMat', scene);
    starMat.disableLighting = true;
    starMat.emissiveColor = new Color3(1.0, 1.0, 1.0);
    starMat.alpha = 0.88;
    this.starMesh.material = starMat;

    // Prepare thin instance transformation buffer (16 floats per instance)
    const matricesData = new Float32Array(starCount * 16);

    for (let i = 0; i < starCount; i++) {
      const radius = 120 + Math.random() * 520;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const scale = 0.5 + Math.random() * 1.4;
      const matrix = Matrix.Compose(
        new Vector3(scale, scale, scale),
        Quaternion.Identity(),
        new Vector3(x, y, z)
      );

      matrix.copyToArray(matricesData, i * 16);
    }

    this.starMesh.thinInstanceSetBuffer('matrix', matricesData, 16, true);
  }

  public update(delta: number) {
    this.nebulaDome.rotation.y += delta * 0.0012;
  }
}
