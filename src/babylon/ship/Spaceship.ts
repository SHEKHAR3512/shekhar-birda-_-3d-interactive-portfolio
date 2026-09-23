import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { ShipEffects } from './ShipEffects';

/**
 * Spaceship - High-Fidelity Sci-Fi Light Fighter Exploration Craft
 * 
 * Features:
 * - Babylon.js GLB loader pipeline with scale/pivot normalization
 * - Resilient PBR aerodynamic composite procedural fallback
 * - Standardized Attachment Points: EngineLeft, EngineRight, Cockpit, WeaponMount, NavLights
 * - Dual Ion Exhaust Plumes & dynamic throttle lighting
 */
export class Spaceship {
  public rootNode: TransformNode;
  public engineLeftNode: AbstractMesh;
  public engineRightNode: AbstractMesh;
  public cockpitNode: TransformNode;
  public weaponMountNode: TransformNode;
  public navLightPortNode: TransformNode;
  public navLightStarboardNode: TransformNode;

  public effects: ShipEffects;
  private isGlbLoaded: boolean = false;

  constructor(scene: Scene) {
    this.rootNode = new TransformNode('starfighterRoot', scene);
    this.rootNode.position = new Vector3(0, 0, 32);

    // ==========================================
    // 1. ATTACHMENT POINTS SETUP
    // ==========================================
    this.engineLeftNode = MeshBuilder.CreateBox('EngineLeft', { size: 0.05 }, scene);
    this.engineLeftNode.isVisible = false;
    this.engineLeftNode.parent = this.rootNode;
    this.engineLeftNode.position = new Vector3(-0.75, 0.05, -2.1);

    this.engineRightNode = MeshBuilder.CreateBox('EngineRight', { size: 0.05 }, scene);
    this.engineRightNode.isVisible = false;
    this.engineRightNode.parent = this.rootNode;
    this.engineRightNode.position = new Vector3(0.75, 0.05, -2.1);

    this.cockpitNode = new TransformNode('Cockpit', scene);
    this.cockpitNode.parent = this.rootNode;
    this.cockpitNode.position = new Vector3(0, 0.65, 0.6);

    this.weaponMountNode = new TransformNode('WeaponMount', scene);
    this.weaponMountNode.parent = this.rootNode;
    this.weaponMountNode.position = new Vector3(0, -0.3, 1.8);

    this.navLightPortNode = new TransformNode('NavigationLightPort', scene);
    this.navLightPortNode.parent = this.rootNode;
    this.navLightPortNode.position = new Vector3(-2.6, 0.1, -0.4);

    this.navLightStarboardNode = new TransformNode('NavigationLightStarboard', scene);
    this.navLightStarboardNode.parent = this.rootNode;
    this.navLightStarboardNode.position = new Vector3(2.6, 0.1, -0.4);

    // ==========================================
    // 2. PROCEDURAL HIGH-POLYGON PBR FIGHTER (DEFAULT / INSTANT)
    // ==========================================
    this.buildProceduralPbrHull(scene);

    // ==========================================
    // 3. ATTACH PARTICLE THRUSTER EFFECTS
    // ==========================================
    this.effects = new ShipEffects(scene, this.engineLeftNode, this.engineRightNode);

    // ==========================================
    // 4. ASYNC SKETCHFAB GLB MODEL PIPELINE
    // ==========================================
    this.loadGlbModel(scene);
  }

  /**
   * Attempts to load external GLB starfighter if available in public/assets/ships/
   */
  private async loadGlbModel(scene: Scene) {
    const candidateFolders = ['/assets/space/ships/player/', '/assets/ships/'];
    const candidateFiles = [
      'light_fighter.glb',
      'light_fighter_spaceship_free.glb',
      'light_fighter_spaceship.glb',
      'scene.gltf',
      'scene.glb',
    ];

    for (const folder of candidateFolders) {
      for (const filename of candidateFiles) {
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            folder,
            filename,
            scene
          );

        if (result.meshes && result.meshes.length > 0) {
          // Hide procedural fallback hull
          const proceduralChildren = this.rootNode.getChildren();
          proceduralChildren.forEach((c) => {
            if (c.name.startsWith('proceduralHull_')) {
              c.setEnabled(false);
            }
          });

          const importedRoot = result.meshes[0];

          // Compute accurate hierarchical bounding box for normalization
          const boundingVectors = importedRoot.getHierarchyBoundingVectors(true);
          const min = boundingVectors.min;
          const max = boundingVectors.max;
          const sizeX = max.x - min.x;
          const sizeY = max.y - min.y;
          const sizeZ = max.z - min.z;

          // Target starfighter length ~ 4.8 units along flight axis
          const targetLength = 4.8;
          const lengthDimension = sizeZ > 0 ? sizeZ : Math.max(sizeX, sizeY);
          const scaleFactor = lengthDimension > 0 ? targetLength / lengthDimension : 1.0;

          // Dedicated pivot node to center and rotate model cleanly around origin
          const modelPivot = new TransformNode('modelPivot', scene);
          modelPivot.parent = this.rootNode;
          importedRoot.parent = modelPivot;

          // Center the raw mesh geometry on (0, 0, 0) inside the pivot
          const rawCenterX = (min.x + max.x) * 0.5;
          const rawCenterY = (min.y + max.y) * 0.5;
          const rawCenterZ = (min.z + max.z) * 0.5;
          importedRoot.position.set(-rawCenterX, -rawCenterY, -rawCenterZ);

          // Apply scale and 180° Y rotation so the nose points forward (+Z) and engines face rear (-Z)
          modelPivot.scaling.set(scaleFactor, scaleFactor, scaleFactor);
          modelPivot.rotation.y = Math.PI;

          // Dynamically position engine plume emitters at rear exhaust nozzles
          // In raw model: rear is at max.z (+5.21), rotating by Math.PI sends rear to -Z
          const rearDistance = (max.z - rawCenterZ) * scaleFactor;
          const nozzleOffsetY = (1.76 - rawCenterY) * scaleFactor;
          const nozzleOffsetX = 0.85 * scaleFactor;

          this.engineLeftNode.position.set(-nozzleOffsetX, nozzleOffsetY, -rearDistance);
          this.engineRightNode.position.set(nozzleOffsetX, nozzleOffsetY, -rearDistance);

          this.isGlbLoaded = true;
          break; // Successfully loaded
        }
      } catch {
        // Try next candidate filename
        continue;
      }
      if (this.isGlbLoaded) break;
    }
    if (this.isGlbLoaded) break;
  }
}

  /**
   * Constructs an aerodynamic, angular stealth sci-fi fighter using Babylon PBR Materials
   */
  private buildProceduralPbrHull(scene: Scene) {
    // 1. Ceramic White Aerospace Armor Material
    const pbrWhite = new PBRMaterial('hullPbrWhite', scene);
    pbrWhite.albedoColor = new Color3(0.98, 0.98, 0.98);
    pbrWhite.metallic = 0.25;
    pbrWhite.roughness = 0.22;
    pbrWhite.environmentIntensity = 0.85;

    // 2. Titanium Carbon Accent Plating
    const pbrTitanium = new PBRMaterial('hullPbrTitanium', scene);
    pbrTitanium.albedoColor = new Color3(0.12, 0.16, 0.22);
    pbrTitanium.metallic = 0.85;
    pbrTitanium.roughness = 0.25;

    // 3. Specular Tinted Flight Deck Canopy
    const pbrCanopy = new PBRMaterial('hullPbrCanopy', scene);
    pbrCanopy.albedoColor = new Color3(0.04, 0.12, 0.22);
    pbrCanopy.metallic = 0.95;
    pbrCanopy.roughness = 0.05;
    pbrCanopy.alpha = 0.75;

    // 4. Chrome Hydraulic Accents
    const pbrChrome = new PBRMaterial('hullPbrChrome', scene);
    pbrChrome.albedoColor = new Color3(0.95, 0.98, 1.0);
    pbrChrome.metallic = 0.98;
    pbrChrome.roughness = 0.08;

    // 5. Port / Starboard Navigation Beacons
    const portMat = new StandardMaterial('portNavMat', scene);
    portMat.emissiveColor = new Color3(1.0, 0.15, 0.15);
    const starMat = new StandardMaterial('starNavMat', scene);
    starMat.emissiveColor = new Color3(0.15, 1.0, 0.35);

    // --- Main Chiseled Fuselage ---
    const fuselage = MeshBuilder.CreateCylinder('proceduralHull_fuselage', {
      height: 4.8,
      diameterTop: 0.15,
      diameterBottom: 1.25,
      tessellation: 6,
    }, scene);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.material = pbrWhite;
    fuselage.parent = this.rootNode;

    // --- Canopy Flight Deck ---
    const canopy = MeshBuilder.CreateSphere('proceduralHull_canopy', {
      diameterX: 0.8,
      diameterY: 0.45,
      diameterZ: 1.8,
      segments: 16,
    }, scene);
    canopy.position = new Vector3(0, 0.32, 0.4);
    canopy.material = pbrCanopy;
    canopy.parent = this.rootNode;

    // --- Swept-Back Main Wings ---
    const leftWing = MeshBuilder.CreateBox('proceduralHull_leftWing', {
      width: 2.4,
      height: 0.08,
      depth: 1.9,
    }, scene);
    leftWing.position = new Vector3(-1.6, 0.02, -0.4);
    leftWing.rotation.y = -0.28;
    leftWing.rotation.z = -0.06;
    leftWing.material = pbrWhite;
    leftWing.parent = this.rootNode;

    const rightWing = MeshBuilder.CreateBox('proceduralHull_rightWing', {
      width: 2.4,
      height: 0.08,
      depth: 1.9,
    }, scene);
    rightWing.position = new Vector3(1.6, 0.02, -0.4);
    rightWing.rotation.y = 0.28;
    rightWing.rotation.z = 0.06;
    rightWing.material = pbrWhite;
    rightWing.parent = this.rootNode;

    // Wingtips / Winglets
    const leftWinglet = MeshBuilder.CreateBox('proceduralHull_leftWinglet', {
      width: 0.08,
      height: 0.65,
      depth: 0.9,
    }, scene);
    leftWinglet.position = new Vector3(-2.7, 0.25, -0.5);
    leftWinglet.rotation.x = 0.1;
    leftWinglet.material = pbrTitanium;
    leftWinglet.parent = this.rootNode;

    const rightWinglet = MeshBuilder.CreateBox('proceduralHull_rightWinglet', {
      width: 0.08,
      height: 0.65,
      depth: 0.9,
    }, scene);
    rightWinglet.position = new Vector3(2.7, 0.25, -0.5);
    rightWinglet.rotation.x = 0.1;
    rightWinglet.material = pbrTitanium;
    rightWinglet.parent = this.rootNode;

    // --- Twin Propulsion Nacelles ---
    const leftNacelle = MeshBuilder.CreateCylinder('proceduralHull_leftNacelle', {
      height: 2.4,
      diameter: 0.58,
      tessellation: 16,
    }, scene);
    leftNacelle.rotation.x = Math.PI / 2;
    leftNacelle.position = new Vector3(-0.75, 0.05, -1.0);
    leftNacelle.material = pbrTitanium;
    leftNacelle.parent = this.rootNode;

    const rightNacelle = MeshBuilder.CreateCylinder('proceduralHull_rightNacelle', {
      height: 2.4,
      diameter: 0.58,
      tessellation: 16,
    }, scene);
    rightNacelle.rotation.x = Math.PI / 2;
    rightNacelle.position = new Vector3(0.75, 0.05, -1.0);
    rightNacelle.material = pbrTitanium;
    rightNacelle.parent = this.rootNode;

    // --- Twin Vertical Stabilizers ---
    const leftFin = MeshBuilder.CreateBox('proceduralHull_leftFin', {
      width: 0.07,
      height: 0.9,
      depth: 1.1,
    }, scene);
    leftFin.position = new Vector3(-0.75, 0.65, -1.2);
    leftFin.rotation.z = -0.22;
    leftFin.material = pbrWhite;
    leftFin.parent = this.rootNode;

    const rightFin = MeshBuilder.CreateBox('proceduralHull_rightFin', {
      width: 0.07,
      height: 0.9,
      depth: 1.1,
    }, scene);
    rightFin.position = new Vector3(0.75, 0.65, -1.2);
    rightFin.rotation.z = 0.22;
    rightFin.material = pbrWhite;
    rightFin.parent = this.rootNode;

    // --- Navigation Beacon Spheres ---
    const portBeacon = MeshBuilder.CreateSphere('proceduralHull_portBeacon', { diameter: 0.12 }, scene);
    portBeacon.position = this.navLightPortNode.position;
    portBeacon.material = portMat;
    portBeacon.parent = this.rootNode;

    const starBeacon = MeshBuilder.CreateSphere('proceduralHull_starBeacon', { diameter: 0.12 }, scene);
    starBeacon.position = this.navLightStarboardNode.position;
    starBeacon.material = starMat;
    starBeacon.parent = this.rootNode;
  }

  /**
   * Update visual effects (thruster plumes, strobe lights, throttle glow)
   */
  public update(delta: number, speed: number, isBoosting: boolean, isAccelerating: boolean) {
    this.effects.update(delta, speed, isBoosting, isAccelerating);
  }

  public dispose() {
    this.effects.dispose();
    this.rootNode.dispose();
  }
}
