/**
 * The pointer-tracking imperative shell for the Card components — the first DOM-event
 * behavior in core. A skin mounts a container and calls `trackPointer(el, writer)`; the
 * writer maps each pointer position (via the pure `./pointer-math`) onto CSS custom
 * properties the shared stylesheet reads. SSR/jsdom-safe (no `window` → no-op), and under
 * reduced motion it sets the rest state once and attaches no listeners. The skins only
 * mount + revert, so they cannot drift in behavior (cf. the WebGL factories, D-028/D-030).
 */
import { prefersReducedMotion } from '../motion';
import { magnetOffset, pointerFraction, tiltRotation, type PointerFraction } from './pointer-math';

export interface PointerController {
  /** Remove the pointer listeners — call on unmount. */
  revert(): void;
}

/** Returned when there's nothing to track (SSR, or reduced motion) — a safe no-op. */
const NOOP: PointerController = { revert() {} };

/** Writes a pointer fraction onto `el` as CSS custom properties. */
export type PointerWriter = (el: HTMLElement, f: PointerFraction) => void;

/** The resting position: the card's center. */
const CENTER: PointerFraction = { x: 0.5, y: 0.5 };

/**
 * Track the pointer over `el`, calling `write` with a 0..1 fraction on every move and
 * resetting to center on leave. Sets the rest (center) state once up front so the card
 * is never blank before the first move. Returns a controller whose `revert()` detaches
 * the listeners. Under reduced motion (or SSR), stays at the rest state with no listeners.
 */
export function trackPointer(el: HTMLElement, write: PointerWriter): PointerController {
  if (typeof window === 'undefined') return NOOP;

  // Establish the rest state first (deterministic for SSR hydration + the parity freeze).
  write(el, CENTER);
  if (prefersReducedMotion()) return NOOP;

  const onMove = (e: PointerEvent): void => {
    write(el, pointerFraction(e.clientX, e.clientY, el.getBoundingClientRect()));
  };
  const onLeave = (): void => write(el, CENTER);

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return {
    revert() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    },
  };
}

/** Spotlight writer: positions the radial glow at the pointer (`--jolt-x` / `--jolt-y`). */
export const writeSpotlight: PointerWriter = (el, f) => {
  el.style.setProperty('--jolt-x', `${f.x * 100}%`);
  el.style.setProperty('--jolt-y', `${f.y * 100}%`);
};

/** Tilt writer factory: rotates the card toward the pointer, capped at `maxTilt` per axis. */
export function makeTiltWriter(maxTilt: number): PointerWriter {
  return (el, f) => {
    const { rotateX, rotateY } = tiltRotation(f, maxTilt);
    el.style.setProperty('--jolt-rx', `${rotateX}deg`);
    el.style.setProperty('--jolt-ry', `${rotateY}deg`);
  };
}

/**
 * Magnet writer: publishes a signed `-1..1` pull toward the pointer (`--jolt-fx` / `--jolt-fy`).
 * Unitless on purpose — the stylesheet scales it by the component's `--jolt-strength`, so the
 * travel distance is a CSS concern and this needs no factory (contrast `makeTiltWriter`).
 */
export const writeMagnet: PointerWriter = (el, f) => {
  const { x, y } = magnetOffset(f);
  el.style.setProperty('--jolt-fx', String(x));
  el.style.setProperty('--jolt-fy', String(y));
};
