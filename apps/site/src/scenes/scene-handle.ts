import type { VoltFieldScene } from './volt-field';

/**
 * Hand-off point between the SceneStage mount script and the scroll-story script.
 * Both are bundled page scripts importing this same module instance, so a plain
 * module singleton is enough — no globals, no DOM property stashing.
 */
let scene: VoltFieldScene | null = null;
const waiters: Array<(s: VoltFieldScene) => void> = [];

export function setSceneHandle(next: VoltFieldScene): void {
  scene = next;
  while (waiters.length) waiters.shift()?.(next);
}

/** Resolves once the scene exists (or immediately if it already does). */
export function whenSceneReady(cb: (s: VoltFieldScene) => void): void {
  if (scene) cb(scene);
  else waiters.push(cb);
}
