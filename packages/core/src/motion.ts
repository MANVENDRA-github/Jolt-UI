/**
 * True when the user has requested reduced motion. Guarded for SSR / test
 * environments where `window` or `matchMedia` may be unavailable.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
