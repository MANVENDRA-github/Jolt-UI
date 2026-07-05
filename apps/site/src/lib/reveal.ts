/**
 * Shared scroll-reveal utility. Elements marked `data-reveal` are visible by default;
 * this only *enhances* — in motion mode it arms the below-the-fold ones (hidden, then
 * eased in on intersection). With no JS, no IntersectionObserver, or reduced motion,
 * every element stays visible. Pure predicates below are node-tested; the DOM wiring
 * is a thin shell.
 */

/** True when an element's top sits strictly below the fold (needs arming). */
export function isBelowFold(elementTop: number, viewportHeight: number): boolean {
  return elementTop > viewportHeight;
}

/** Enhance only when motion is allowed and IntersectionObserver exists. */
export function shouldEnhance(reducedMotion: boolean, hasIO: boolean): boolean {
  return !reducedMotion && hasIO;
}

/** Arm + observe every `[data-reveal]` element. Call once on DOMContentLoaded. */
export function initReveal(): void {
  if (typeof window === 'undefined') return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  if (!shouldEnhance(reducedMotion, hasIO)) return;

  const vh = window.innerHeight;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter((el) =>
    isBelowFold(el.getBoundingClientRect().top, vh),
  );
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = '';
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  for (const el of targets) {
    el.dataset.revealArmed = '';
    io.observe(el);
  }
}
