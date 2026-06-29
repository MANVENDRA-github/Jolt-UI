/**
 * Public types for @jolt/svelte (hand-written for Phase 0; generated from source later).
 *
 * Typed as a props-first function so Astro's `.astro` prop-checking (which reads a
 * component's first parameter as its props) validates component attributes. The runtime
 * export is the real Svelte component; this shape only informs type-checking at call sites.
 */
export declare const Hello: (props: { name?: string }) => unknown;
export declare const SplitText: (props: {
  text: string;
  by?: 'chars' | 'words';
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
}) => unknown;
export declare const BlurIn: (props: {
  text: string;
  by?: 'chars' | 'words';
  blur?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
}) => unknown;
export declare const Wave: (props: {
  text: string;
  by?: 'chars' | 'words';
  amplitude?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}) => unknown;
export declare const GradientText: (props: {
  text: string;
  colors?: string[];
  duration?: number;
}) => unknown;
export declare const ShinyText: (props: { text: string; duration?: number }) => unknown;
export declare const Typewriter: (props: {
  text: string;
  duration?: number;
  delay?: number;
  caret?: boolean;
}) => unknown;
export declare const RotatingWords: (props: {
  words?: string[];
  interval?: number;
  delay?: number;
}) => unknown;
export declare const CountUp: (props: {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  separator?: string;
}) => unknown;
export declare const Scramble: (props: {
  text: string;
  duration?: number;
  delay?: number;
  chars?: string;
  revealDelay?: number;
  speed?: number;
}) => unknown;
export declare const ScrollVelocity: (props: {
  text: string;
  baseVelocity?: number;
  direction?: 'left' | 'right';
}) => unknown;
export declare const Particles: (props: {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
  opacity?: number;
}) => unknown;
export declare const Waves: (props: {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  density?: number;
  opacity?: number;
}) => unknown;
export declare const Dots: (props: {
  color?: string;
  count?: number;
  size?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
}) => unknown;
export declare const Globe: (props: {
  color?: string;
  count?: number;
  size?: number;
  radius?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}) => unknown;
export declare const Rings: (props: {
  color?: string;
  ringCount?: number;
  pointsPerRing?: number;
  spacing?: number;
  size?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}) => unknown;
export declare const Aurora: (props: {
  colors?: string[];
  speed?: number;
  intensity?: number;
  scale?: number;
  opacity?: number;
}) => unknown;
export declare const Spinner: (props: {
  color?: string;
  size?: number;
  thickness?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const DotBounce: (props: {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const Bars: (props: {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const Pulse: (props: {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const Ripple: (props: {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const Grid: (props: {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const ProgressBar: (props: {
  color?: string;
  width?: number;
  thickness?: number;
  speed?: number;
  label?: string;
}) => unknown;
export declare const Shimmer: (props: {
  color?: string;
  shine?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}) => unknown;
export declare const Glow: (props: {
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}) => unknown;
export declare const Gradient: (props: {
  colors?: string[];
  speed?: number;
  label?: string;
  disabled?: boolean;
}) => unknown;
export declare const Sweep: (props: {
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}) => unknown;
export declare const BorderDraw: (props: {
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}) => unknown;
export declare const Tactile: (props: {
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}) => unknown;
// gen:shims
