import { Engine } from '@babylonjs/core/Engines/engine';

/**
 * createEngine - Factory for initializing the high-performance Babylon.js Engine
 */
export function createEngine(canvas: HTMLCanvasElement): Engine {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
    powerPreference: 'high-performance',
    adaptToDeviceRatio: true,
  });

  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener('resize', handleResize);

  // Store cleanup handler on engine custom property
  (engine as unknown as { __resizeHandler?: () => void }).__resizeHandler = handleResize;

  return engine;
}

export function disposeEngine(engine: Engine) {
  const resizeHandler = (engine as unknown as { __resizeHandler?: () => void }).__resizeHandler;
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  engine.dispose();
}
