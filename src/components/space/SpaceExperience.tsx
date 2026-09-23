import React, { useEffect, useRef, useState } from 'react';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scalar } from '@babylonjs/core/Maths/math.scalar';
import { createEngine, disposeEngine } from '../../babylon/engine/createEngine';
import { createScene } from '../../babylon/engine/createScene';
import { SpaceCamera } from '../../babylon/camera/SpaceCamera';
import { Spaceship } from '../../babylon/ship/Spaceship';
import { ShipController, StarfighterFlightInput, defaultFlightInput } from '../../babylon/ship/ShipController';
import { PlanetManager } from '../../babylon/planets/PlanetManager';
import { StarField } from '../../babylon/environment/StarField';
import { AsteroidField } from '../../babylon/environment/AsteroidField';
import { SpaceTraffic } from '../../babylon/environment/SpaceTraffic';
import { SpaceStationManager } from '../../babylon/environment/SpaceStation';
import { InteractionManager } from '../../babylon/interactions/InteractionManager';
import { EventManager } from '../../babylon/systems/EventManager';
import { DiscoverySystem } from '../../babylon/systems/DiscoverySystem';
import { PerformanceManager } from '../../babylon/systems/PerformanceManager';
import { useMissionStore } from '../../store/missionStore';
import { LoadingScreen } from './LoadingScreen';

// Export shared flight input state for FlightControlsOverlay touch controls
export const flightInput: StarfighterFlightInput = { ...defaultFlightInput };

export const SpaceExperience: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  const selectPlanet = useMissionStore((state) => state.selectPlanet);
  const hoverPlanet = useMissionStore((state) => state.hoverPlanet);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize Babylon Engine & Scene Context
    const engine = createEngine(canvas);
    const { scene, sunLight, chaseLight } = createScene(engine);

    // 2. Camera Controller
    const spaceCamera = new SpaceCamera(scene);
    scene.activeCamera = spaceCamera.camera;

    // 3. Main Starfighter Spaceship & Controller
    const ship = new Spaceship(scene);
    const shipController = new ShipController();
    shipController.setTransform(new Vector3(0, 0, 32), 0, 0);

    // 4. Planets & Central Star
    const planetManager = new PlanetManager(scene);

    // 5. Deep Space Environment (Stars, Asteroid Belt, Traffic, Stations)
    const starField = new StarField(scene);
    const asteroidField = new AsteroidField(scene);
    const trafficManager = new SpaceTraffic(scene);
    const stationManager = new SpaceStationManager(scene);

    // 6. Interaction Array & Sonar Scanner
    const interactionManager = new InteractionManager(scene);

    // 7. Exploration & Ambient Event Systems
    const eventManager = new EventManager();
    const discoverySystem = new DiscoverySystem();
    const performanceManager = new PerformanceManager(engine);

    let orbitAngle = 0;
    let disengagedPlanetId: string | null = null;
    let disengageCooldownUntil = 0;
    let prevPlanetId: string | null = null;

    // Orbit Disengagement Function (Launches ship outward into free flight)
    const disengageOrbitAndLaunch = (launchBoost: boolean = true) => {
      const activeCurrentPlanet = useMissionStore.getState().currentPlanet;
      if (!activeCurrentPlanet) return;

      const activePlanet = planetManager.getPlanet(activeCurrentPlanet);
      disengagedPlanetId = activeCurrentPlanet;
      disengageCooldownUntil = performance.now() + 5000;

      if (activePlanet) {
        const planetPos = activePlanet.rootNode.position;
        const escapeDir = shipController.position.subtract(planetPos);
        escapeDir.y = 0;
        const normDir = escapeDir.lengthSquared() < 0.001 ? new Vector3(0, 0, 1) : escapeDir.normalize();

        const pRadius = activePlanet.project?.size || activePlanet.config.radius;
        const safeDist = pRadius * 3.6 + 6.0;
        const newPos = planetPos.add(normDir.scale(safeDist));
        const heading = Math.atan2(normDir.x, normDir.z);
        const launchSpeed = launchBoost ? 24.0 : 18.0;

        shipController.setTransform(newPos, heading, launchSpeed);

        flightInput.forward = true;
        setTimeout(() => {
          flightInput.forward = false;
        }, 400);
      }

      selectPlanet(null);
    };

    // Expose for UI button triggers
    (window as unknown as { __launchShipFromOrbit?: () => void }).__launchShipFromOrbit = () => {
      disengageOrbitAndLaunch(true);
    };

    (window as unknown as { __triggerScannerPing?: () => void }).__triggerScannerPing = () => {
      interactionManager.triggerScannerPing(shipController.position);
    };

    // ================= KEYBOARD INPUT LISTENERS =================
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();

      // Orbit disengagement on movement keys
      const inOrbit = !!useMissionStore.getState().currentPlanet;
      if (inOrbit && (k === 'w' || e.key === 'ArrowUp' || e.code === 'Space' || e.key === 'Escape' || e.key === 'Enter')) {
        disengageOrbitAndLaunch(true);
        return;
      }

      // Sensor Sonar Ping
      if (k === 'v' || k === 'x') {
        interactionManager.triggerScannerPing(shipController.position);
      }

      if (k === 'w' || e.key === 'ArrowUp') flightInput.forward = true;
      if (k === 's' || e.key === 'ArrowDown') flightInput.backward = true;
      if (k === 'a' || e.key === 'ArrowLeft') flightInput.left = true;
      if (k === 'd' || e.key === 'ArrowRight') flightInput.right = true;
      if (k === 'q') flightInput.rollLeft = true;
      if (k === 'e') flightInput.rollRight = true;
      if (e.shiftKey) flightInput.boost = true;
      if (e.code === 'Space') flightInput.brake = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();

      if (k === 'w' || e.key === 'ArrowUp') flightInput.forward = false;
      if (k === 's' || e.key === 'ArrowDown') flightInput.backward = false;
      if (k === 'a' || e.key === 'ArrowLeft') flightInput.left = false;
      if (k === 'd' || e.key === 'ArrowRight') flightInput.right = false;
      if (k === 'q') flightInput.rollLeft = false;
      if (k === 'e') flightInput.rollRight = false;
      if (!e.shiftKey) flightInput.boost = false;
      if (e.code === 'Space') flightInput.brake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ================= POINTER HOVER & CLICK PICKING =================
    const handlePointerMove = (e: PointerEvent) => {
      const pickResult = scene.pick(
        e.clientX,
        e.clientY,
        (m) => m.name.startsWith('mesh_') || Boolean(m.metadata?.projectId)
      );

      if (pickResult?.hit && pickResult.pickedMesh?.metadata?.projectId) {
        canvas.style.cursor = 'pointer';
        hoverPlanet(pickResult.pickedMesh.metadata.projectId, { x: e.clientX, y: e.clientY });
      } else {
        canvas.style.cursor = 'default';
        hoverPlanet(null, null);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const pickResult = scene.pick(
        e.clientX,
        e.clientY,
        (m) => m.name.startsWith('mesh_') || Boolean(m.metadata?.projectId)
      );
      if (pickResult?.hit && pickResult.pickedMesh?.metadata?.projectId) {
        selectPlanet(pickResult.pickedMesh.metadata.projectId);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);

    // ================= MAIN BABYLON.JS RENDER LOOP =================
    engine.runRenderLoop(() => {
      const rawDelta = engine.getDeltaTime() / 1000;
      const delta = Math.min(rawDelta, 0.1);

      const storeState = useMissionStore.getState();
      const currentPlanetId = storeState.currentPlanet;
      const targetPlanetId = storeState.targetPlanet;
      const isAutopilot = storeState.isAutopilot;
      const activeCameraMode = storeState.cameraMode;

      // Update Systems
      starField.update(delta);
      asteroidField.update(delta);
      trafficManager.update(delta);
      stationManager.update(delta);
      eventManager.update(delta);
      performanceManager.update(delta);

      // Update Planets
      planetManager.update(delta, currentPlanetId);

      // External disengagement detection
      if (prevPlanetId && !currentPlanetId) {
        disengagedPlanetId = prevPlanetId;
        disengageCooldownUntil = performance.now() + 5000;
        const prevPlanet = planetManager.getPlanet(prevPlanetId);
        if (prevPlanet) {
          const planetPos = prevPlanet.rootNode.position;
          const escapeDir = shipController.position.subtract(planetPos);
          escapeDir.y = 0;
          const normDir = escapeDir.lengthSquared() < 0.001 ? new Vector3(0, 0, 1) : escapeDir.normalize();

          const pRadius = prevPlanet.project?.size || prevPlanet.config.radius;
          const safeDist = pRadius * 3.6 + 6.0;
          const newPos = planetPos.add(normDir.scale(safeDist));
          const heading = Math.atan2(normDir.x, normDir.z);
          shipController.setTransform(newPos, heading, 18.0);
        }
      }
      prevPlanetId = currentPlanetId;

      // ================= FLIGHT LOGIC =================
      if (currentPlanetId) {
        // --- 1. Orbit Mode: Locked in planetary orbit ---
        const activePlanet = planetManager.getPlanet(currentPlanetId);
        if (activePlanet) {
          const planetPos = activePlanet.rootNode.position;
          const pRadius = activePlanet.project?.size || activePlanet.config.radius;
          const orbitDist = pRadius * 3.0;
          orbitAngle += delta * 0.45;

          const shipX = planetPos.x + Math.cos(orbitAngle) * orbitDist;
          const shipZ = planetPos.z + Math.sin(orbitAngle) * orbitDist;
          const shipY = planetPos.y + 0.6;

          const targetOrbitPos = new Vector3(shipX, shipY, shipZ);
          shipController.position = Vector3.Lerp(shipController.position, targetOrbitPos, 0.08);

          // Look at planet center
          const toPlanet = planetPos.subtract(shipController.position);
          shipController.heading = Math.atan2(toPlanet.x, toPlanet.z);

          ship.rootNode.position.copyFrom(shipController.position);
          ship.rootNode.rotation.set(0, shipController.heading, 0);
          ship.update(delta, 0, false, false);
        }
      } else if (isAutopilot && targetPlanetId) {
        // --- 2. Autopilot Mode: Steer automatically toward target planet ---
        const targetPlanet = planetManager.getPlanet(targetPlanetId);
        if (targetPlanet) {
          const targetPos = targetPlanet.rootNode.position;
          const toTarget = targetPos.subtract(shipController.position);
          const dist = toTarget.length();
          const pRadius = targetPlanet.project?.size || targetPlanet.config.radius;
          const pId = targetPlanet.project?.id || targetPlanet.config.id;

          if (dist < pRadius * 3.5 || dist < 6.5) {
            selectPlanet(pId);
          } else {
            const normTarget = toTarget.normalize();
            const targetHeading = Math.atan2(normTarget.x, normTarget.z);
            shipController.heading = Scalar.Lerp(shipController.heading, targetHeading, 0.08);

            const cruiseSpeed = 22.0;
            shipController.currentSpeed = Scalar.Lerp(shipController.currentSpeed, cruiseSpeed, 0.06);

            shipController.position.addInPlace(normTarget.scale(shipController.currentSpeed * delta));

            ship.rootNode.position.copyFrom(shipController.position);
            ship.rootNode.rotation.set(0, shipController.heading, 0);
            ship.update(delta, shipController.currentSpeed, false, true);
          }
        }
      } else {
        // --- 3. Free Flight Mode ---
        shipController.update(delta, flightInput, ship);

        // Planetary Proximity Orbit Locking Check
        planetManager.planets.forEach((p) => {
          const curTime = performance.now();
          const pId = p.project?.id || p.config.id;
          if (pId === disengagedPlanetId && curTime < disengageCooldownUntil) {
            return;
          }

          const dist = Vector3.Distance(shipController.position, p.rootNode.position);
          const pRadius = p.project?.size || p.config.radius;
          const threshold = pRadius * 2.8 + 2.5;

          if (dist < threshold && shipController.currentSpeed > 0) {
            selectPlanet(pId);
          }
        });
      }

      // Check Discovery milestones
      discoverySystem.checkProximity(shipController.position, planetManager, stationManager);

      // Update Sensor Array & Proximity Tracking
      interactionManager.update(delta, shipController.position, planetManager, stationManager, trafficManager, asteroidField);

      // Update Dynamic Chase Light
      chaseLight.position.copyFrom(spaceCamera.camera.position);
      chaseLight.direction = shipController.position.subtract(spaceCamera.camera.position).normalize();

      // ================= CAMERA UPDATE =================
      spaceCamera.setMode(activeCameraMode);
      let targetPlanetPos: Vector3 | null = null;
      let targetPlanetSize: number = 5.0;

      if (currentPlanetId) {
        const activePlanet = planetManager.getPlanet(currentPlanetId);
        if (activePlanet) {
          targetPlanetPos = activePlanet.rootNode.position;
          targetPlanetSize = activePlanet.project?.size || activePlanet.config.radius;
        }
      }

      spaceCamera.update(
        delta,
        shipController.position,
        shipController.heading,
        shipController.pitch,
        shipController.roll,
        shipController.currentSpeed,
        flightInput.boost,
        targetPlanetPos,
        targetPlanetSize
      );

      // Render Scene
      scene.render();
    });

    return () => {
      delete (window as unknown as { __launchShipFromOrbit?: () => void }).__launchShipFromOrbit;
      delete (window as unknown as { __triggerScannerPing?: () => void }).__triggerScannerPing;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      engine.stopRenderLoop();
      scene.dispose();
      disposeEngine(engine);
    };
  }, [selectPlanet, hoverPlanet]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden">
      {!isReady && <LoadingScreen onLoaded={() => setIsReady(true)} />}
      <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" />
    </div>
  );
};
