import * as THREE from 'three';

export interface StarfighterFlightInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  boost: boolean;
  brake: boolean;
  rollLeft: boolean;
  rollRight: boolean;
}

// Global flight input state shared across keyboard and touch overlay
export const flightInput: StarfighterFlightInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
  brake: false,
  rollLeft: false,
  rollRight: false,
};

/**
 * Starfighter - High-Fidelity Sci-Fi Exploration Craft
 * 
 * Features:
 * - Chiseled stealth composite fuselage with layered armor plating
 * - Tinted high-specular cockpit canopy with internal flight deck glow
 * - Swept-back aerodynamic delta wings with chrome leading edges & low-profile winglets
 * - Dual heavy propulsion engine nacelles with cooling fins, recessed titanium bells & white-hot turbine cores
 * - Dynamic multi-stage ion exhaust plumes with additive blending & throttle response
 * - Authentic port (red) / starboard (green) navigation strobes and dorsal white strobe
 * - RCS maneuvering thruster blocks on wingroots
 * - Organic idle hovering/breathing animation when stationary
 */
export class Starfighter {
  public group: THREE.Group;

  // Key mesh references for animation
  private leftFlameCore: THREE.Mesh;
  private rightFlameCore: THREE.Mesh;
  private leftFlameOuter: THREE.Mesh;
  private rightFlameOuter: THREE.Mesh;
  private shockRings: THREE.Mesh[] = [];
  private thrusterLight: THREE.PointLight;
  private cockpitGlowLight: THREE.PointLight;
  private portBeacon: THREE.Mesh;
  private starboardBeacon: THREE.Mesh;
  private dorsalBeacon: THREE.Mesh;
  private portBeaconLight: THREE.PointLight;
  private starboardBeaconLight: THREE.PointLight;
  private canardLeft: THREE.Mesh;
  private canardRight: THREE.Mesh;

  // Materials for animation modulation
  private beaconRedMat: THREE.MeshBasicMaterial;
  private beaconGreenMat: THREE.MeshBasicMaterial;
  private beaconWhiteMat: THREE.MeshBasicMaterial;
  private flameCoreMat: THREE.MeshBasicMaterial;
  private flameOuterMat: THREE.MeshBasicMaterial;

  // Animation internal clocks
  private idleClock: number = 0;
  private strobeTimer: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // ==========================================
    // 1. AEROSPACE MATERIALS SYSTEM (BRILLIANT WHITE THEME)
    // ==========================================
    // Pure brilliant aerospace white ceramic composite
    const hullWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.28,
      roughness: 0.22,
    });

    // Platinum-white titanium accent plating
    const hullSilverMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.65,
      roughness: 0.18,
    });

    // Contrast carbon composite accent for heat vents & interior bays
    const hullContrastMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.82,
      roughness: 0.35,
    });

    // Mirror polished chrome leading-edge trims & hydraulic actuators
    const chromeTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.05,
    });

    // Dark carbon radiator heat sinks
    const heatsinkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.65,
      roughness: 0.6,
    });

    // Tinted polarized cockpit canopy
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      roughness: 0.02,
      metalness: 0.96,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.92,
    });

    // Hyper-luminescent cyan plasma conduits
    const plasmaGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
    });

    // White-hot turbine core
    const turbineCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // Navigation Strobe Materials
    this.beaconRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    this.beaconGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    this.beaconWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Multi-stage exhaust flame materials
    this.flameCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    this.flameOuterMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    // ==========================================
    // 2. FUSELAGE & MAIN CHASSIS
    // ==========================================
    // Main Hull Body (Segmented aerodynamic hexagonal monocoque in pure white)
    const mainFuselageGeom = new THREE.CylinderGeometry(0.32, 0.54, 2.3, 6);
    mainFuselageGeom.rotateX(Math.PI / 2);
    const mainFuselage = new THREE.Mesh(mainFuselageGeom, hullWhiteMat);
    mainFuselage.position.set(0, 0, 0.15);
    this.group.add(mainFuselage);

    // Chiseled Stealth Nose Cone (White with titanium sensor tip)
    const noseGeom = new THREE.ConeGeometry(0.32, 1.7, 6);
    noseGeom.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeom, hullWhiteMat);
    nose.position.set(0, 0, 2.15);
    this.group.add(nose);

    // Nose Ceramic Thermal Tile Crest (Silver top armor)
    const nosePlateGeom = new THREE.BoxGeometry(0.16, 0.07, 1.5);
    const nosePlate = new THREE.Mesh(nosePlateGeom, hullSilverMat);
    nosePlate.position.set(0, 0.18, 1.85);
    this.group.add(nosePlate);

    // Forward Pitot Air/Telemetry Sensor Probe
    const probeGeom = new THREE.CylinderGeometry(0.015, 0.04, 1.1, 8);
    probeGeom.rotateX(Math.PI / 2);
    const probe = new THREE.Mesh(probeGeom, chromeTrimMat);
    probe.position.set(0, 0, 3.2);
    this.group.add(probe);

    const probeTipGeom = new THREE.SphereGeometry(0.035, 8, 8);
    const probeTip = new THREE.Mesh(probeTipGeom, plasmaGlowMat);
    probeTip.position.set(0, 0, 3.76);
    this.group.add(probeTip);

    // Dorsal Spine & Shielded Avionics Ridge
    const spineGeom = new THREE.BoxGeometry(0.14, 0.22, 2.0);
    const spine = new THREE.Mesh(spineGeom, hullSilverMat);
    spine.position.set(0, 0.32, 0.1);
    this.group.add(spine);

    // Dorsal Glowing Plasma Data Conduit
    const spineGlowGeom = new THREE.BoxGeometry(0.035, 0.035, 1.7);
    const spineGlow = new THREE.Mesh(spineGlowGeom, plasmaGlowMat);
    spineGlow.position.set(0, 0.44, 0.1);
    this.group.add(spineGlow);

    // Dorsal Navigation Beacon Strobe
    this.dorsalBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), this.beaconWhiteMat);
    this.dorsalBeacon.position.set(0, 0.46, -0.6);
    this.group.add(this.dorsalBeacon);

    // Ventral Keel & Underbelly Sensor Dome
    const ventralKeelGeom = new THREE.BoxGeometry(0.1, 0.16, 1.8);
    const ventralKeel = new THREE.Mesh(ventralKeelGeom, hullContrastMat);
    ventralKeel.position.set(0, -0.28, 0.1);
    this.group.add(ventralKeel);

    const sensorDomeGeom = new THREE.SphereGeometry(0.1, 12, 12);
    sensorDomeGeom.scale(1, 0.5, 1.4);
    const sensorDome = new THREE.Mesh(sensorDomeGeom, chromeTrimMat);
    sensorDome.position.set(0, -0.32, 1.0);
    this.group.add(sensorDome);

    // ==========================================
    // 3. COCKPIT & CANOPY INTERIOR
    // ==========================================
    // Glass Canopy Bubble
    const canopyGeom = new THREE.SphereGeometry(0.27, 18, 18);
    canopyGeom.scale(0.82, 0.58, 1.45);
    const canopy = new THREE.Mesh(canopyGeom, canopyMat);
    canopy.position.set(0, 0.33, 0.82);
    this.group.add(canopy);

    // Canopy Titanium Roll-Cage Frame
    const canopyFrameGeom = new THREE.TorusGeometry(0.24, 0.028, 8, 20);
    canopyFrameGeom.rotateX(Math.PI / 2);
    const canopyFrame = new THREE.Mesh(canopyFrameGeom, chromeTrimMat);
    canopyFrame.position.set(0, 0.34, 0.82);
    canopyFrame.scale.set(0.95, 1.35, 0.65);
    this.group.add(canopyFrame);

    // Cockpit Instrument Deck Interior Light
    this.cockpitGlowLight = new THREE.PointLight(0x00f5ff, 1.6, 3.5);
    this.cockpitGlowLight.position.set(0, 0.28, 0.85);
    this.group.add(this.cockpitGlowLight);

    // ==========================================
    // 4. FORWARD CANARDS (AGILE STABILIZERS IN WHITE)
    // ==========================================
    const canardShape = new THREE.Shape();
    canardShape.moveTo(0, 0.32);
    canardShape.lineTo(-0.7, 0.06);
    canardShape.lineTo(-0.54, -0.16);
    canardShape.lineTo(0, -0.06);
    canardShape.closePath();

    const canardGeom = new THREE.ExtrudeGeometry(canardShape, { depth: 0.03, bevelEnabled: false });
    canardGeom.rotateX(Math.PI / 2);

    this.canardLeft = new THREE.Mesh(canardGeom, hullWhiteMat);
    this.canardLeft.position.set(-0.32, 0.08, 1.35);
    this.group.add(this.canardLeft);

    this.canardRight = new THREE.Mesh(canardGeom, hullWhiteMat);
    this.canardRight.position.set(0.32, 0.08, 1.35);
    this.canardRight.scale.x = -1;
    this.group.add(this.canardRight);

    // ==========================================
    // 5. SWEPT DELTA WINGS (BRILLIANT AEROSPACE WHITE)
    // ==========================================
    const wingExtrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 2,
    };

    // Left Wing (Continuous Swept Interceptor Shape)
    const leftWingShape = new THREE.Shape();
    leftWingShape.moveTo(0, 0.85);       // Forward wing root
    leftWingShape.lineTo(-2.85, -0.55);  // Outer wing tip leading edge
    leftWingShape.lineTo(-2.65, -1.02);  // Outer wing tip trailing edge
    leftWingShape.lineTo(-0.4, -0.78);   // Rear wing root
    leftWingShape.closePath();

    const leftWingGeom = new THREE.ExtrudeGeometry(leftWingShape, wingExtrudeSettings);
    leftWingGeom.rotateX(Math.PI / 2);
    const leftWing = new THREE.Mesh(leftWingGeom, hullWhiteMat);
    leftWing.position.set(-0.35, 0.02, 0);
    this.group.add(leftWing);

    // Right Wing (mirrored)
    const rightWingShape = new THREE.Shape();
    rightWingShape.moveTo(0, 0.85);
    rightWingShape.lineTo(2.85, -0.55);
    rightWingShape.lineTo(2.65, -1.02);
    rightWingShape.lineTo(0.4, -0.78);
    rightWingShape.closePath();

    const rightWingGeom = new THREE.ExtrudeGeometry(rightWingShape, wingExtrudeSettings);
    rightWingGeom.rotateX(Math.PI / 2);
    const rightWing = new THREE.Mesh(rightWingGeom, hullWhiteMat);
    rightWing.position.set(0.35, 0.02, 0);
    this.group.add(rightWing);

    // Wing Leading-Edge Polished Chrome Deflector Trims
    const leftTrimGeom = new THREE.BoxGeometry(2.85, 0.045, 0.05);
    leftTrimGeom.rotateY(-0.43);
    const leftTrim = new THREE.Mesh(leftTrimGeom, chromeTrimMat);
    leftTrim.position.set(-1.62, 0.04, 0.28);
    this.group.add(leftTrim);

    const rightTrimGeom = new THREE.BoxGeometry(2.85, 0.045, 0.05);
    rightTrimGeom.rotateY(0.43);
    const rightTrim = new THREE.Mesh(rightTrimGeom, chromeTrimMat);
    rightTrim.position.set(1.62, 0.04, 0.28);
    this.group.add(rightTrim);

    // Glowing Plasma Wing Conduits
    const leftGlowGeom = new THREE.BoxGeometry(2.35, 0.03, 0.035);
    leftGlowGeom.rotateY(-0.43);
    const leftGlow = new THREE.Mesh(leftGlowGeom, plasmaGlowMat);
    leftGlow.position.set(-1.48, 0.05, 0.24);
    this.group.add(leftGlow);

    const rightGlowGeom = new THREE.BoxGeometry(2.35, 0.03, 0.035);
    rightGlowGeom.rotateY(0.43);
    const rightGlow = new THREE.Mesh(rightGlowGeom, plasmaGlowMat);
    rightGlow.position.set(1.48, 0.05, 0.24);
    this.group.add(rightGlow);

    // Integrated Low-Profile 45° Winglets (White)
    const wingletShape = new THREE.Shape();
    wingletShape.moveTo(0, 0);
    wingletShape.lineTo(0, 0.38);
    wingletShape.lineTo(-0.38, 0.28);
    wingletShape.lineTo(-0.48, 0);
    wingletShape.closePath();

    const wingletGeom = new THREE.ExtrudeGeometry(wingletShape, { depth: 0.03, bevelEnabled: false });

    const leftWinglet = new THREE.Mesh(wingletGeom, hullWhiteMat);
    leftWinglet.position.set(-2.85, 0, -0.55);
    leftWinglet.rotation.z = -0.45;
    this.group.add(leftWinglet);

    const rightWinglet = new THREE.Mesh(wingletGeom, hullWhiteMat);
    rightWinglet.position.set(2.85, 0, -0.55);
    rightWinglet.rotation.z = 0.45;
    rightWinglet.scale.x = -1;
    this.group.add(rightWinglet);

    // Navigation Strobes: Port (Red) & Starboard (Green)
    this.portBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), this.beaconRedMat);
    this.portBeacon.position.set(-2.9, 0.06, -0.55);
    this.group.add(this.portBeacon);

    this.portBeaconLight = new THREE.PointLight(0xef4444, 1.2, 3);
    this.portBeaconLight.position.set(-2.9, 0.06, -0.55);
    this.group.add(this.portBeaconLight);

    this.starboardBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), this.beaconGreenMat);
    this.starboardBeacon.position.set(2.9, 0.06, -0.55);
    this.group.add(this.starboardBeacon);

    this.starboardBeaconLight = new THREE.PointLight(0x10b981, 1.2, 3);
    this.starboardBeaconLight.position.set(2.9, 0.06, -0.55);
    this.group.add(this.starboardBeaconLight);

    // Wing Under-Hardpoints: Exploration Survey Blasters / Sensors
    const cannonGeom = new THREE.CylinderGeometry(0.035, 0.045, 0.95, 8);
    cannonGeom.rotateX(Math.PI / 2);

    const leftCannon = new THREE.Mesh(cannonGeom, hullContrastMat);
    leftCannon.position.set(-1.42, -0.06, 0.22);
    this.group.add(leftCannon);

    const leftMuzzle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), plasmaGlowMat);
    leftMuzzle.position.set(-1.42, -0.06, 0.72);
    this.group.add(leftMuzzle);

    const rightCannon = new THREE.Mesh(cannonGeom, hullContrastMat);
    rightCannon.position.set(1.42, -0.06, 0.22);
    this.group.add(rightCannon);

    const rightMuzzle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), plasmaGlowMat);
    rightMuzzle.position.set(1.42, -0.06, 0.72);
    this.group.add(rightMuzzle);

    // Wing Root RCS (Reaction Control System) Thruster Quads
    const rcsBlockGeom = new THREE.BoxGeometry(0.12, 0.08, 0.16);
    const leftRcs = new THREE.Mesh(rcsBlockGeom, chromeTrimMat);
    leftRcs.position.set(-0.62, 0.08, 0.6);
    this.group.add(leftRcs);

    const rightRcs = new THREE.Mesh(rcsBlockGeom, chromeTrimMat);
    rightRcs.position.set(0.62, 0.08, 0.6);
    this.group.add(rightRcs);

    // ==========================================
    // 6. TWIN HEAVY PROPULSION ENGINES (REAR DECK IN WHITE)
    // ==========================================
    const nacelleGeom = new THREE.CylinderGeometry(0.24, 0.28, 1.65, 16);
    nacelleGeom.rotateX(Math.PI / 2);

    const leftNacelle = new THREE.Mesh(nacelleGeom, hullWhiteMat);
    leftNacelle.position.set(-0.8, 0, -0.38);
    this.group.add(leftNacelle);

    const rightNacelle = new THREE.Mesh(nacelleGeom, hullWhiteMat);
    rightNacelle.position.set(0.8, 0, -0.38);
    this.group.add(rightNacelle);

    // Nacelle Top Radiator Heat Sinks (Segmented fins)
    const heatSinkGeom = new THREE.BoxGeometry(0.12, 0.06, 1.25);
    const leftHeatSink = new THREE.Mesh(heatSinkGeom, heatsinkMat);
    leftHeatSink.position.set(-0.8, 0.22, -0.38);
    this.group.add(leftHeatSink);

    const rightHeatSink = new THREE.Mesh(heatSinkGeom, heatsinkMat);
    rightHeatSink.position.set(0.8, 0.22, -0.38);
    this.group.add(rightHeatSink);

    // Top Nacelle White Cowlings
    const cowlGeom = new THREE.BoxGeometry(0.16, 0.03, 1.15);
    const leftCowl = new THREE.Mesh(cowlGeom, hullSilverMat);
    leftCowl.position.set(-0.8, 0.25, -0.38);
    this.group.add(leftCowl);

    const rightCowl = new THREE.Mesh(cowlGeom, hullSilverMat);
    rightCowl.position.set(0.8, 0.25, -0.38);
    this.group.add(rightCowl);

    // Chrome Intake Rings (Front)
    const intakeRingGeom = new THREE.TorusGeometry(0.22, 0.035, 8, 18);
    const leftIntake = new THREE.Mesh(intakeRingGeom, chromeTrimMat);
    leftIntake.position.set(-0.8, 0, 0.45);
    this.group.add(leftIntake);

    const rightIntake = new THREE.Mesh(intakeRingGeom, chromeTrimMat);
    rightIntake.position.set(0.8, 0, 0.45);
    this.group.add(rightIntake);

    // Recessed Titanium Nozzle Bells (Rear)
    const nozzleBellGeom = new THREE.CylinderGeometry(0.26, 0.2, 0.44, 16);
    nozzleBellGeom.rotateX(Math.PI / 2);
    const nozzleBellMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });

    const leftBell = new THREE.Mesh(nozzleBellGeom, nozzleBellMat);
    leftBell.position.set(-0.8, 0, -1.22);
    this.group.add(leftBell);

    const rightBell = new THREE.Mesh(nozzleBellGeom, nozzleBellMat);
    rightBell.position.set(0.8, 0, -1.22);
    this.group.add(rightBell);

    // Glowing White-Hot Turbine Core Disks
    const turbineCoreGeom = new THREE.CylinderGeometry(0.14, 0.08, 0.2, 16);
    turbineCoreGeom.rotateX(Math.PI / 2);
    const leftTurbine = new THREE.Mesh(turbineCoreGeom, turbineCoreMat);
    leftTurbine.position.set(-0.8, 0, -1.26);
    this.group.add(leftTurbine);

    const rightTurbine = new THREE.Mesh(turbineCoreGeom, turbineCoreMat);
    rightTurbine.position.set(0.8, 0, -1.26);
    this.group.add(rightTurbine);

    // Hyper-Luminescent Cyan Magnetic Nozzle Rings
    const nozzleRingGeom = new THREE.TorusGeometry(0.21, 0.045, 8, 20);
    const leftNozzle = new THREE.Mesh(nozzleRingGeom, plasmaGlowMat);
    leftNozzle.position.set(-0.8, 0, -1.36);
    this.group.add(leftNozzle);

    const rightNozzle = new THREE.Mesh(nozzleRingGeom, plasmaGlowMat);
    rightNozzle.position.set(0.8, 0, -1.36);
    this.group.add(rightNozzle);

    // Central Fuselage Rear Vector Keel Flap
    const vectorFlapGeom = new THREE.BoxGeometry(0.08, 0.38, 0.85);
    const vectorFlap = new THREE.Mesh(vectorFlapGeom, hullSilverMat);
    vectorFlap.position.set(0, -0.16, -0.92);
    this.group.add(vectorFlap);

    // ==========================================
    // 7. MULTI-STAGE ION DRIVE EXHAUST PLUMES (BACKWARD FIRING)
    // ==========================================
    // Base is at nozzle exit (0, 0, 0), apex tapers backwards along -Z to (0, 0, -length)
    const createExhaustPlumeGeom = (radius: number, length: number) => {
      const geom = new THREE.ConeGeometry(radius, length, 16);
      geom.translate(0, length / 2, 0); // Base at 0, apex at +length
      geom.rotateX(-Math.PI / 2);       // Rotate around X: +Y points to -Z, apex is at -length
      return geom;
    };

    // Inner Hyper-Bright White Core Flame
    const coreFlameGeom = createExhaustPlumeGeom(0.14, 2.2);
    this.leftFlameCore = new THREE.Mesh(coreFlameGeom, this.flameCoreMat);
    this.leftFlameCore.position.set(-0.8, 0, -1.36);
    this.group.add(this.leftFlameCore);

    this.rightFlameCore = new THREE.Mesh(coreFlameGeom, this.flameCoreMat);
    this.rightFlameCore.position.set(0.8, 0, -1.36);
    this.group.add(this.rightFlameCore);

    // Outer Expanding Radiant Cyan Plasma Shroud Flame
    const outerFlameGeom = createExhaustPlumeGeom(0.26, 3.4);
    this.leftFlameOuter = new THREE.Mesh(outerFlameGeom, this.flameOuterMat);
    this.leftFlameOuter.position.set(-0.8, 0, -1.36);
    this.group.add(this.leftFlameOuter);

    this.rightFlameOuter = new THREE.Mesh(outerFlameGeom, this.flameOuterMat);
    this.rightFlameOuter.position.set(0.8, 0, -1.36);
    this.group.add(this.rightFlameOuter);

    // Mach Shock Diamond Rings (Afterburner ionization rings spaced along the exhaust)
    const shockRingGeom = new THREE.TorusGeometry(0.13, 0.022, 8, 16);
    const shockRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    [-0.8, 0.8].forEach((xOffset) => {
      [0.6, 1.2, 1.8].forEach((zOffset) => {
        const ring = new THREE.Mesh(shockRingGeom, shockRingMat);
        ring.position.set(xOffset, 0, -1.36 - zOffset);
        this.group.add(ring);
        this.shockRings.push(ring);
      });
    });

    // Propulsion Plasma Glow Light
    this.thrusterLight = new THREE.PointLight(0x00f5ff, 5.0, 20);
    this.thrusterLight.position.set(0, 0, -1.8);
    this.group.add(this.thrusterLight);

    // Forward Exploration Dual Headlights (Casting illumination onto planets & stardust)
    const headlightLeft = new THREE.SpotLight(0xcffafe, 4.5, 60, Math.PI / 6, 0.4);
    headlightLeft.position.set(-0.6, 0, 1.2);
    headlightLeft.target.position.set(-0.6, 0, 40);
    this.group.add(headlightLeft);
    this.group.add(headlightLeft.target);

    const headlightRight = new THREE.SpotLight(0xcffafe, 4.5, 60, Math.PI / 6, 0.4);
    headlightRight.position.set(0.6, 0, 1.2);
    headlightRight.target.position.set(0.6, 0, 40);
    this.group.add(headlightRight);
    this.group.add(headlightRight.target);
  }

  /**
   * Per-frame animation update for the starfighter
   */
  public update(delta: number, input: StarfighterFlightInput, speed: number) {
    this.idleClock += delta;
    this.strobeTimer += delta;

    // 1. Organic Idle Hover Animation (subtle pitch/roll/vertical float when stationary)
    const isMoving = speed > 0.8;
    if (!isMoving) {
      const hoverFloat = Math.sin(this.idleClock * 1.8) * 0.08;
      const hoverRoll = Math.sin(this.idleClock * 1.2) * 0.02;
      const hoverPitch = Math.cos(this.idleClock * 1.5) * 0.015;

      // Apply subtle breathing offsets to group
      this.group.position.y += (hoverFloat - (this.group.position.y % 0.1)) * 0.05;
      this.canardLeft.rotation.z = hoverRoll * 2;
      this.canardRight.rotation.z = -hoverRoll * 2;
    } else {
      // Dynamic canard deflection during active flight turns
      const canardDeflect = input.left ? 0.22 : input.right ? -0.22 : 0;
      this.canardLeft.rotation.z = THREE.MathUtils.lerp(this.canardLeft.rotation.z, canardDeflect, 0.12);
      this.canardRight.rotation.z = THREE.MathUtils.lerp(this.canardRight.rotation.z, -canardDeflect, 0.12);
    }

    // 2. Backward Exhaust Plume Scaling & Flare
    const targetScale = input.boost
      ? 2.6
      : input.forward
      ? 1.7
      : speed > 1
      ? 1.15
      : 0.35;

    const flicker = 1.0 + (Math.random() - 0.5) * 0.14;
    const currentScale = targetScale * flicker;

    this.leftFlameCore.scale.set(1, 1, currentScale * 0.85);
    this.rightFlameCore.scale.set(1, 1, currentScale * 0.85);
    this.leftFlameOuter.scale.set(1, 1, currentScale);
    this.rightFlameOuter.scale.set(1, 1, currentScale);

    // Pulse Mach shock diamonds
    this.shockRings.forEach((ring, idx) => {
      const ringScale = (input.boost ? 1.4 : speed > 1 ? 1.0 : 0.35) * (0.85 + Math.sin(this.idleClock * 16 + idx) * 0.15);
      ring.scale.set(ringScale, ringScale, ringScale);
      ring.visible = targetScale > 0.4;
    });

    // Light Intensity Modulation
    const targetLightIntensity = input.boost ? 8.0 : speed > 1 ? 4.8 : 1.8;
    this.thrusterLight.intensity = THREE.MathUtils.lerp(
      this.thrusterLight.intensity,
      targetLightIntensity,
      0.15
    );

    // Cockpit interior subtle pulse
    this.cockpitGlowLight.intensity = 1.2 + Math.sin(this.idleClock * 2.5) * 0.4;

    // 3. Navigation Strobes Rhythmic Flash
    // Port/Starboard strobe flashes every 1.2s for 80ms
    const strobeCycle = this.strobeTimer % 1.2;
    const isStrobeOn = strobeCycle < 0.08 || (strobeCycle > 0.16 && strobeCycle < 0.24);

    this.portBeaconLight.intensity = isStrobeOn ? 2.5 : 0.2;
    this.starboardBeaconLight.intensity = isStrobeOn ? 2.5 : 0.2;
    this.beaconRedMat.color.setHex(isStrobeOn ? 0xff4444 : 0x7f1d1d);
    this.beaconGreenMat.color.setHex(isStrobeOn ? 0x22c55e : 0x064e3b);

    // Dorsal beacon flashes white once every 1.8s
    const dorsalCycle = this.strobeTimer % 1.8;
    const isDorsalOn = dorsalCycle < 0.06;
    this.beaconWhiteMat.color.setHex(isDorsalOn ? 0xffffff : 0x475569);
  }
}
