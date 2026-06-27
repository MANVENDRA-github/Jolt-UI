/**
 * TS mirror of the motion tokens declared in `theme.css`.
 *
 * The framework-agnostic animation core (Phase 1) reads these values; the CSS
 * design language declares the same values. A parity test (`tokens.test.ts`)
 * asserts every value here appears in `theme.css`, so the JS and CSS sources of
 * the design language can never silently drift apart.
 */
export const motionTokens = {
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  durationBase: '600ms',
  durationFast: '300ms',
  stagger: '30ms',
} as const;

export type MotionTokens = typeof motionTokens;
