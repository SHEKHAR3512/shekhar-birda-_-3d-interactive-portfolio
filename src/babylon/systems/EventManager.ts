import { useMissionStore, CosmicEventNotice } from '../../store/missionStore';

/**
 * EventManager - Dynamic Ambient Cosmic Universe Events
 * 
 * Periodically triggers atmospheric space events:
 * - Meteor Showers
 * - Distress Transmissions
 * - Solar Radiation Surges
 * - Autonomous Cargo Convoys
 * - Deep Space Anomalies
 */
export class EventManager {
  private timer: number = 0;
  private nextEventTime: number = 20;
  private eventIndex: number = 0;

  private events: Array<{ title: string; description: string; type: 'info' | 'alert' | 'discovery' }> = [
    {
      title: 'METEOR SHOWER DETECTED',
      description: 'High-velocity micrometeoroid storm crossing the Martian orbital plane. Shields holding at 100%.',
      type: 'alert',
    },
    {
      title: 'SOLAR RADIATION SURGE',
      description: 'Stellar coronal mass ejection recorded by Sol core monitor. Starfighter magnetosphere nominal.',
      type: 'info',
    },
    {
      title: 'DISTRESS SIGNAL INTERCEPTED',
      description: 'Automated emergency transponder beacon echoing from Keplerian Asteroid Sector 04.',
      type: 'alert',
    },
    {
      title: 'RELAY PACKET SYNCHRONIZED',
      description: 'Hyperion Deep-Space Sensor Relay received full-stack portfolio commit telemetry.',
      type: 'discovery',
    },
    {
      title: 'CARGO CONVOY INBOUND',
      description: 'Atlas Heavy Freighter fleet exiting warp transit lane into Titan Refinery docking zone.',
      type: 'info',
    },
    {
      title: 'GRAVITATIONAL ANOMALY',
      description: 'Localized space-time micro-singularity detected near the Kuiper Belt frontier.',
      type: 'discovery',
    },
  ];

  public update(delta: number) {
    this.timer += delta;

    if (this.timer >= this.nextEventTime) {
      this.timer = 0;
      this.nextEventTime = 38 + Math.random() * 30; // Occasional, believable timing

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

      setTimeout(() => {
        const cur = useMissionStore.getState().activeEventNotice;
        if (cur && cur.id === notice.id) {
          useMissionStore.getState().triggerCosmicEvent(null);
        }
      }, 7500);
    }
  }
}
