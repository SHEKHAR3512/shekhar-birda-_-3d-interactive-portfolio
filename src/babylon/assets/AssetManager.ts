import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { SPACE_ASSETS } from '../../config/spaceAssets';

export interface NormalizedModelInstance {
  root: TransformNode;
  meshes: AbstractMesh[];
  assetId: string;
  isExternalModel: boolean;
}

/**
 * AssetManager - Centralized Babylon.js Asset Loader & Normalizer
 * 
 * Uses SceneLoader.ImportMeshAsync to reliably load GLB models directly into the active scene.
 */
export class AssetManager {
  private static instance: AssetManager | null = null;
  public scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    AssetManager.instance = this;
  }

  public static getInstance(scene?: Scene): AssetManager {
    if (scene) {
      if (!AssetManager.instance) {
        AssetManager.instance = new AssetManager(scene);
      } else {
        AssetManager.instance.scene = scene;
      }
    }
    return AssetManager.instance!;
  }

  /**
   * Loads an asset from the SPACE_ASSETS registry with bounding normalization
   */
  public async loadAsset(
    assetId: string,
    parentNode?: TransformNode,
    customScale?: number,
    customRotation?: { x: number; y: number; z: number }
  ): Promise<NormalizedModelInstance | null> {
    const assetConfig = SPACE_ASSETS[assetId];
    if (!assetConfig) {
      console.warn(`[AssetManager] Asset ID "${assetId}" not found in SPACE_ASSETS registry.`);
      return null;
    }

    const modelUrl = assetConfig.model;
    const lastSlash = modelUrl.lastIndexOf('/');
    const rootUrl = lastSlash !== -1 ? modelUrl.substring(0, lastSlash + 1) : '';
    const fileName = lastSlash !== -1 ? modelUrl.substring(lastSlash + 1) : modelUrl;

    try {
      console.log(`[AssetManager] Loading GLB: ${assetConfig.name} (${modelUrl})`);
      const result = await SceneLoader.ImportMeshAsync('', rootUrl, fileName, this.scene);

      if (!result.meshes || result.meshes.length === 0) {
        console.warn(`[AssetManager] No meshes found in GLB: ${modelUrl}`);
        return null;
      }

      const wrapper = new TransformNode(`assetWrapper_${assetId}_${Date.now()}`, this.scene);
      if (parentNode) {
        wrapper.parent = parentNode;
      }

      const importedRoot = result.meshes[0];

      // Dedicated pivot node to center raw geometry
      const pivotNode = new TransformNode(`pivot_${assetId}_${Date.now()}`, this.scene);
      pivotNode.parent = wrapper;
      importedRoot.parent = pivotNode;

      // Bounding Box Normalization
      const bounds = importedRoot.getHierarchyBoundingVectors(true);
      const min = bounds.min;
      const max = bounds.max;
      const sizeX = max.x - min.x;
      const sizeY = max.y - min.y;
      const sizeZ = max.z - min.z;
      const maxDimension = Math.max(sizeX, sizeY, sizeZ);

      // Center on (0, 0, 0)
      const rawCenterX = (min.x + max.x) * 0.5;
      const rawCenterY = (min.y + max.y) * 0.5;
      const rawCenterZ = (min.z + max.z) * 0.5;
      importedRoot.position.set(-rawCenterX, -rawCenterY, -rawCenterZ);

      // Scale to target size
      const targetScale = customScale !== undefined ? customScale : assetConfig.defaultScale;
      const scaleFactor = maxDimension > 0 ? targetScale / maxDimension : 1.0;
      pivotNode.scaling.set(scaleFactor, scaleFactor, scaleFactor);

      // Apply rotation offsets
      const rot = customRotation || assetConfig.rotationOffset;
      if (rot) {
        pivotNode.rotation.set(rot.x, rot.y, rot.z);
      }

      const allMeshes = importedRoot.getChildMeshes(false);
      const meshesToReturn = allMeshes.length > 0 ? allMeshes : result.meshes;

      // Ensure all meshes are visible and enabled
      meshesToReturn.forEach((m) => {
        m.isVisible = true;
        m.setEnabled(true);
      });

      console.log(`[AssetManager] Successfully loaded and normalized: ${assetConfig.name}`);

      return {
        root: wrapper,
        meshes: meshesToReturn,
        assetId,
        isExternalModel: true,
      };
    } catch (err: any) {
      console.warn(`[AssetManager] Unable to load GLB at "${modelUrl}". Using fallback. Error:`, err?.message || err);
      return null;
    }
  }

  public dispose() {
    AssetManager.instance = null;
  }
}
