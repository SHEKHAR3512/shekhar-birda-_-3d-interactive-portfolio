import { useMissionStore, CosmicEventNotice } from '../../store/missionStore';

/**
 * SpaceEventManager - Dynamic Ambient Space Events
 * 
 * Features:
 * - Controls timed deep space events (Convoys, Solar wind surges, Relay transmissions)
 * - Non-intrusive notifications to HUD
 * - Periodic timer intervals
 */
export class SpaceEventManager {
  private timer: number = 0;
  private nextEventTime: number = 18; // First event after 18 seconds
  private eventIndex: number = 0;

  private events: Array<{ title: string; description: string; type: 'info' | 'alert' | 'discovery' }> = [
    {
      title: 'SOLAR RADIATION SURGE',
      description: 'Stellar flare detected from Sol core. Starfighter deflector shields nominal.',
      type: 'info',
    },
    {
      title: 'RELAY PACKET SYNCHRONIZED',
      description: 'Alpha Research Citadel transmitted 14 React architecture benchmarks.',
      type: 'discovery',
    },
    {
      title: 'CARVOY DELTA INBOUND',
      description: 'Autonomous freighter convoy entering Trans-Martian cargo corridor.',
      type: 'info',
    },
    {
      title: 'DEEP SPACE TELEMETRY ECHO',
      description: 'Quantum signal detected from Sector 09. New project telemetry verified.',
      type: 'discovery',
    },
  ];

  public update(delta: number) {
    this.timer += delta;

    if (this.timer >= this.nextEventTime) {
      this.timer = 0;
      this.nextEventTime = 35 + Math.random() * 25; // 35 - 60 seconds interval

      const ev = this.events[this.eventIndex % this.events.length];
      this.eventIndex++;

      const notice: CosmicEventNotice = {
        id: `ev-${Date.now()}`,
        title: ev.title,
        description: ev.description,
        type: ev.type,
        timestamp: Date.now(),
      };

      useMissionStore.getState().triggerCosmicEvent(notice);

      // Auto-clear notice after 6.5s
      setTimeout(() => {
        const cur = useMissionStore.getState().activeEventNotice;
        if (cur && cur.id === notice.id) {
          useMissionStore.getState().triggerCosmicEvent(null);
        }
      }, 6500);
    }
  }
}
