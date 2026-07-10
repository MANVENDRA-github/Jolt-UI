/**
 * The Dock's pointer-magnification shell. A skin renders a row of `[data-jolt-dock-item]`
 * elements and calls `trackDock(el)`; on every `pointermove` each item is scaled by its distance
 * to the cursor (via the pure `./dock-math`), so the row swells like a macOS dock. Writes each
 * item's `--jolt-scale`, which the shared stylesheet reads.
 *
 * SSR/jsdom-safe (no `window` → no-op). It writes the rest state (`scale 1`) to every item once
 * on mount so the row is deterministic before the first move and under the parity freeze; under
 * reduced motion it does that and attaches no listeners. Skins only mount + revert, so they
 * cannot drift (cf. `pointer.ts`, D-037).
 */
import { prefersReducedMotion } from '../motion';
import { dockScale } from './dock-math';

export interface DockController {
  /** Remove the pointer listeners — call on unmount. */
  revert(): void;
}

const NOOP: DockController = { revert() {} };

/** The attribute a skin marks each magnifiable item with. */
export const DOCK_ITEM_SELECTOR = '[data-jolt-dock-item]';

export interface DockOptions {
  /** Distance in px over which an item returns to rest scale. */
  range?: number;
  /** Scale of the item directly under the pointer. */
  maxScale?: number;
}

/** Set every item's `--jolt-scale` to its magnification for a given pointer X (px, viewport). */
function paint(items: HTMLElement[], pointerX: number, range: number, maxScale: number): void {
  for (const item of items) {
    const rect = item.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    item.style.setProperty('--jolt-scale', String(dockScale(center - pointerX, range, maxScale)));
  }
}

/** Reset every item to rest scale. */
const rest = (items: HTMLElement[]): void => {
  for (const item of items) item.style.setProperty('--jolt-scale', '1');
};

/**
 * Magnify the dock's items toward the pointer. Returns a controller whose `revert()` detaches the
 * listeners. Under reduced motion (or SSR) the items stay at rest scale with no listeners.
 */
export function trackDock(
  el: HTMLElement,
  { range = 120, maxScale = 2 }: DockOptions = {},
): DockController {
  if (typeof window === 'undefined') return NOOP;

  const items = Array.from(el.querySelectorAll<HTMLElement>(DOCK_ITEM_SELECTOR));
  // Establish the rest state first (deterministic for SSR hydration + the parity freeze).
  rest(items);
  if (prefersReducedMotion()) return NOOP;

  const onMove = (e: PointerEvent): void => paint(items, e.clientX, range, maxScale);
  const onLeave = (): void => rest(items);

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return {
    revert() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    },
  };
}
