# 3D Asset Credits & Licensing Ledger

This document tracks all external 3D models, textures, audio, and cosmic assets utilized in the Shekhar Birda 3D Interactive Cosmos Portfolio.

All external 3D assets used in this application are legally licensed under Creative Commons, Free Standard, or open-source licenses with proper author attribution preserved.

---

## 1. Spaceship & Starfighter Models

### Primary Player Craft: Light Fighter Spaceship
- **Asset Name**: LIGHT FIGHTER SPACESHIP - FREE -
- **Creator / 3D Modeler**: Kerem Kavalci ([@Keremz](https://sketchfab.com/Keremz))
- **Concept Inspiration**: Tobias Frank ([ArtStation](https://www.artstation.com/artwork/B05r4)) / EVERSPACE
- **Source URL**: [https://sketchfab.com/3d-models/light-fighter-spaceship-free-51616ef53af84fe595c5603cd3e0f3e1](https://sketchfab.com/3d-models/light-fighter-spaceship-free-51616ef53af84fe595c5603cd3e0f3e1)
- **License**: Sketchfab Free Standard License ([https://sketchfab.com/licenses](https://sketchfab.com/licenses))
- **Permitted Use**: Use worldwide, on all types of media, commercially or not, and in all types of derivative works.
- **Asset Path**: `public/assets/ships/light_fighter.glb`
- **Modifications**: Integrated into Babylon.js asset pipeline via `@babylonjs/loaders`; normalized scale and center of mass; dual ion thruster attachment points configured for Babylon particle systems.
- **Date Added**: September 2026

---

## 2. Planetary Bodies & Textures

### Solar System Bodies (Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)
- **Asset Type**: High-resolution procedural PBR textures and NASA/USGS scientific planetary maps.
- **Source**: NASA Jet Propulsion Laboratory / USGS Astrogeology Science Center / Solar System Scope (Creative Commons Attribution 4.0 International).
- **License**: Public Domain / CC BY 4.0
- **Modifications**: Optimized into dynamic Babylon.js PBR materials, custom atmospheric rim shaders, and Saturn ring geometry.

---

## 3. Celestial Stations & Points of Interest

### Orbital Research Citadel & Communications Relays
- **Asset Type**: Procedural modular geometric hard-surface models created for Babylon.js.
- **Author**: Shekhar Birda
- **License**: MIT License (included with project repository).

---

## 4. Audio Effects

### Synthesizer & Sensor SFX
- **Asset Type**: Web Audio API Procedural Synthesizer (`src/utils/sound.ts`)
- **Author**: Custom real-time Web Audio API frequency oscillation (zero external audio file dependencies).
- **License**: MIT

### Realistic- Earth- Planet
- **Category / Target**: `public/assets/space/planets/earth/model.glb`
- **Creator**: [PixelMotion4096](https://sketchfab.com/pixelmotion4096)
- **License**: CC Attribution
- **Sketchfab Model UID**: `072ccdc6820c4cb698349d9b71089269`
- **Source Link**: [Realistic- Earth- Planet on Sketchfab](https://sketchfab.com/3d-models/realistic-earth-planet-072ccdc6820c4cb698349d9b71089269)
- **Added Date**: 2026-09-23

### Venus
- **Category / Target**: `public/assets/space/planets/venus/model.glb`
- **Creator**: [Akshat](https://sketchfab.com/shooter24994)
- **License**: CC Attribution
- **Sketchfab Model UID**: `d497ce25553447f3b7b679110c85cfa1`
- **Source Link**: [Venus on Sketchfab](https://sketchfab.com/3d-models/venus-d497ce25553447f3b7b679110c85cfa1)
- **Added Date**: 2026-09-23

### Mars
- **Category / Target**: `public/assets/space/planets/mars/model.glb`
- **Creator**: [Danny.Gallegos](https://sketchfab.com/Danny.Gallegos)
- **License**: CC Attribution
- **Sketchfab Model UID**: `f98432cf20aa426fb3bd299f699ffd51`
- **Source Link**: [Mars on Sketchfab](https://sketchfab.com/3d-models/mars-f98432cf20aa426fb3bd299f699ffd51)
- **Added Date**: 2026-09-23

### Saturn
- **Category / Target**: `public/assets/space/planets/saturn/model.glb`
- **Creator**: [jaxtynvalentine46](https://sketchfab.com/jaxtynvalentine46)
- **License**: CC Attribution
- **Sketchfab Model UID**: `9a279abdabc740419474d2b03dbadb59`
- **Source Link**: [Saturn on Sketchfab](https://sketchfab.com/3d-models/saturn-9a279abdabc740419474d2b03dbadb59)
- **Added Date**: 2026-09-23

### Uranus
- **Category / Target**: `public/assets/space/planets/uranus/model.glb`
- **Creator**: [Nestaeric](https://sketchfab.com/Nestaeric)
- **License**: CC Attribution
- **Sketchfab Model UID**: `0009a69dbace44608c0bd09af9ba20db`
- **Source Link**: [Uranus on Sketchfab](https://sketchfab.com/3d-models/uranus-0009a69dbace44608c0bd09af9ba20db)
- **Added Date**: 2026-09-23

### Neptune
- **Category / Target**: `public/assets/space/planets/neptune/model.glb`
- **Creator**: [Yanez Designs](https://sketchfab.com/Yanez-Designs)
- **License**: CC Attribution
- **Sketchfab Model UID**: `7e7632f6e16b4aaaa7597b9ff91b47b2`
- **Source Link**: [Neptune on Sketchfab](https://sketchfab.com/3d-models/neptune-7e7632f6e16b4aaaa7597b9ff91b47b2)
- **Added Date**: 2026-09-23

### Pluto
- **Category / Target**: `public/assets/space/planets/pluto/model.glb`
- **Creator**: [Yanez Designs](https://sketchfab.com/Yanez-Designs)
- **License**: CC Attribution
- **Sketchfab Model UID**: `82bec3a4536c4a608c3b6e219b16a824`
- **Source Link**: [Pluto on Sketchfab](https://sketchfab.com/3d-models/pluto-82bec3a4536c4a608c3b6e219b16a824)
- **Added Date**: 2026-09-23

### moon
- **Category / Target**: `public/assets/space/planets/moon/model.glb`
- **Creator**: [RenderX](https://sketchfab.com/RenderX)
- **License**: CC Attribution
- **Sketchfab Model UID**: `26cc0b7878bb4d919b68e2be399db466`
- **Source Link**: [moon on Sketchfab](https://sketchfab.com/3d-models/moon-26cc0b7878bb4d919b68e2be399db466)
- **Added Date**: 2026-09-23

### Asteroid Field (100 x low-Poly)
- **Category / Target**: `public/assets/space/asteroids/low_poly/model.glb`
- **Creator**: [Sereib](https://sketchfab.com/Sereib)
- **License**: CC Attribution
- **Sketchfab Model UID**: `24572b5eec404dd7888a76098054cd7a`
- **Source Link**: [Asteroid Field (100 x low-Poly) on Sketchfab](https://sketchfab.com/3d-models/asteroid-field-100-x-low-poly-24572b5eec404dd7888a76098054cd7a)
- **Added Date**: 2026-09-23

### Asteroid Field (100 x medium-Poly)
- **Category / Target**: `public/assets/space/asteroids/medium_poly/model.glb`
- **Creator**: [Sereib](https://sketchfab.com/Sereib)
- **License**: CC Attribution
- **Sketchfab Model UID**: `2dc6d949b60a4128a86d5c34f53b136c`
- **Source Link**: [Asteroid Field (100 x medium-Poly) on Sketchfab](https://sketchfab.com/3d-models/asteroid-field-100-x-medium-poly-2dc6d949b60a4128a86d5c34f53b136c)
- **Added Date**: 2026-09-23

### Space Station
- **Category / Target**: `public/assets/space/stations/station_01/model.glb`
- **Creator**: [re1monsen](https://sketchfab.com/re1monsen)
- **License**: CC Attribution
- **Sketchfab Model UID**: `0da4a24e7edd49159737675ffcc06228`
- **Source Link**: [Space Station on Sketchfab](https://sketchfab.com/3d-models/space-station-0da4a24e7edd49159737675ffcc06228)
- **Added Date**: 2026-09-23

### Space Station 3
- **Category / Target**: `public/assets/space/stations/station_03/model.glb`
- **Creator**: [re1monsen](https://sketchfab.com/re1monsen)
- **License**: CC Attribution
- **Sketchfab Model UID**: `a7a6ad10261149cab31aa394bfcf8940`
- **Source Link**: [Space Station 3 on Sketchfab](https://sketchfab.com/3d-models/space-station-3-a7a6ad10261149cab31aa394bfcf8940)
- **Added Date**: 2026-09-23

### Space Station Modules
- **Category / Target**: `public/assets/space/stations/modules/model.glb`
- **Creator**: [re1monsen](https://sketchfab.com/re1monsen)
- **License**: CC Attribution
- **Sketchfab Model UID**: `e3ba39a1c78540448542cf937b11feab`
- **Source Link**: [Space Station Modules on Sketchfab](https://sketchfab.com/3d-models/space-station-modules-e3ba39a1c78540448542cf937b11feab)
- **Added Date**: 2026-09-23

### Spaceship Free 001
- **Category / Target**: `public/assets/space/ships/npc/spaceship.glb`
- **Creator**: [RitorDP](https://sketchfab.com/ritordp)
- **License**: CC Attribution
- **Sketchfab Model UID**: `9a81a5167c474530881e55127e275c6c`
- **Source Link**: [Spaceship Free 001 on Sketchfab](https://sketchfab.com/3d-models/spaceship-free-001-9a81a5167c474530881e55127e275c6c)
- **Added Date**: 2026-09-23

### Meteorite
- **Category / Target**: `public/assets/space/special/meteorite/model.glb`
- **Creator**: [Hailphilly](https://sketchfab.com/hailphilly)
- **License**: CC Attribution
- **Sketchfab Model UID**: `0a503e5bec784cbc9082e2f6b2d9f701`
- **Source Link**: [Meteorite on Sketchfab](https://sketchfab.com/3d-models/meteorite-0a503e5bec784cbc9082e2f6b2d9f701)
- **Added Date**: 2026-09-23

### Meteor
- **Category / Target**: `public/assets/space/special/meteor/model.glb`
- **Creator**: [Maxim Mavrichev](https://sketchfab.com/mvrc.art)
- **License**: CC Attribution
- **Sketchfab Model UID**: `d3a5a7e9a7d24b76841bf0f49d56a5f3`
- **Source Link**: [Meteor on Sketchfab](https://sketchfab.com/3d-models/meteor-d3a5a7e9a7d24b76841bf0f49d56a5f3)
- **Added Date**: 2026-09-23

### Sun
- **Category / File**: `public/assets/space/planets/sun/model.glb`
- **Creator**: [Cybertron B-127](https://sketchfab.com/robo-reboot)
- **License**: CC Attribution
- **Sketchfab Model UID**: `af2874610d5e4cbdbf49bc951b500bda`
- **Source Link**: [Sun on Sketchfab](https://sketchfab.com/3d-models/sun-af2874610d5e4cbdbf49bc951b500bda)
- **Added Date**: 2026-09-23
