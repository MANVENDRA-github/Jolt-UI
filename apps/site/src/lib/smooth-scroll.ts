import Lenis from 'lenis';

/**
 * Site-wide smooth scrolling (Lenis), strictly motion-gated: never constructed on
 * the server or for reduced-motion users — they keep native scrolling and never
 * download the chunk (Base only imports this module behind the media-query gate).
 * `anchors: true` keeps in-page `#category` links working through Lenis.
 */
let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis ??= new Lenis({ anchors: true, autoRaf: true });
  return lenis;
}

/** The singleton, if smooth scrolling is active on this page. */
export function getLenis(): Lenis | null {
  return lenis;
}
