import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export type InteractableType = 'Planet' | 'Space Station' | 'Relay Beacon' | 'Asteroid Anomaly' | 'Traffic Vessel';

export interface InteractableObject {
  id: string;
  name: string;
  type: InteractableType;
  description: string;
  actionPrompt?: string;
  position: Vector3;
  interactionRadius: number;
}
