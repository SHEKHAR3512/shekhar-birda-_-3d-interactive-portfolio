import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { useMissionStore } from '../../store/missionStore';
import { sound } from '../../utils/sound';
import { PlanetManager } from '../planets/PlanetManager';
import { SpaceStationManager } from '../environment/SpaceStation';

/**
 * DiscoverySystem - Tracks planetary discovery, exploration milestones, and awards
 */
export class DiscoverySystem {
  private discoveredSet: Set<string> = new Set();

  constructor() {
    const existing = useMissionStore.getState().discoveredPlanets;
    existing.forEach((id) => this.discoveredSet.add(id));
  }

  public checkProximity(shipPos: Vector3, planetManager: PlanetManager, stationManager?: SpaceStationManager) {
    // 1. Check Planets
    planetManager.planets.forEach((p) => {
      const id = p.project?.id || p.config.id;
      if (this.discoveredSet.has(id)) return;

      const dist = Vector3.Distance(shipPos, p.rootNode.position);
      const threshold = p.config.radius * 3.5 + 4.0;

      if (dist < threshold) {
        this.discoveredSet.add(id);
        useMissionStore.getState().discoverPlanet(id);
        sound.playDiscoveryChime();
      }
    });

    // 2. Check Space Stations
    if (stationManager) {
      stationManager.stations.forEach((s) => {
        if (this.discoveredSet.has(s.id)) return;

        const dist = Vector3.Distance(shipPos, s.rootNode.position);
        if (dist < 14.0) {
          this.discoveredSet.add(s.id);
          sound.playDiscoveryChime();
          useMissionStore.getState().triggerCosmicEvent({
            id: `disc-${s.id}`,
            title: 'NEW LOCATION DISCOVERED',
            description: `${s.name}: ${s.description}`,
            type: 'discovery',
            timestamp: Date.now(),
          });
        }
      });
    }
  }
}
