# Spaceship 3D Asset Dropzone

This directory hosts the main starfighter model for the Babylon.js 3D cosmos tour.

## Target Model: Light Fighter Spaceship
- **Sketchfab Model URL**: [https://sketchfab.com/3d-models/light-fighter-spaceship-free-51616ef53af84fe595c5603cd3e0f3e1](https://sketchfab.com/3d-models/light-fighter-spaceship-free-51616ef53af84fe595c5603cd3e0f3e1)
- **Author**: Kerem Kavalci (@Keremz)
- **License**: Sketchfab Free Standard License

## Instructions
1. Download the 3D model in **glTF** or **GLB** format from Sketchfab.
2. Place the file in this folder with any of the following names:
   - `light_fighter.glb` (Recommended)
   - `light_fighter_spaceship_free.glb`
   - `scene.gltf` (with textures in this folder)
3. The Babylon.js asset loader (`Spaceship.ts`) will automatically:
   - Detect the file
   - Swap out the procedural fallback
   - Auto-center and normalize the scale to flight simulation dimensions
   - Align the ion thruster particle emitters with the rear engine nacelles
