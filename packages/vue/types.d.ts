import type { DefineComponent } from 'vue';

/** Public types for @jolt/vue (hand-written for now; generated from source later). */
export declare const Hello: DefineComponent<{ name?: string }>;
export declare const SplitText: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
}>;
export declare const BlurIn: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  blur?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
}>;
export declare const Wave: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  amplitude?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}>;
export declare const GradientText: DefineComponent<{
  text: string;
  colors?: string[];
  duration?: number;
}>;
export declare const ShinyText: DefineComponent<{
  text: string;
  duration?: number;
}>;
export declare const Typewriter: DefineComponent<{
  text: string;
  duration?: number;
  delay?: number;
  caret?: boolean;
}>;
export declare const RotatingWords: DefineComponent<{
  words?: string[];
  interval?: number;
  delay?: number;
}>;
export declare const CountUp: DefineComponent<{
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  separator?: string;
}>;
export declare const Scramble: DefineComponent<{
  text: string;
  duration?: number;
  delay?: number;
  chars?: string;
  revealDelay?: number;
  speed?: number;
}>;
export declare const ScrollVelocity: DefineComponent<{
  text: string;
  baseVelocity?: number;
  direction?: 'left' | 'right';
}>;
export declare const Particles: DefineComponent<{
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
  opacity?: number;
}>;
export declare const Waves: DefineComponent<{
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  density?: number;
  opacity?: number;
}>;
export declare const Dots: DefineComponent<{
  color?: string;
  count?: number;
  size?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
}>;
export declare const Globe: DefineComponent<{
  color?: string;
  count?: number;
  size?: number;
  radius?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}>;
export declare const Rings: DefineComponent<{
  color?: string;
  ringCount?: number;
  pointsPerRing?: number;
  spacing?: number;
  size?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}>;
export declare const Aurora: DefineComponent<{
  colors?: string[];
  speed?: number;
  intensity?: number;
  scale?: number;
  opacity?: number;
}>;
export declare const Spinner: DefineComponent<{
  color?: string;
  size?: number;
  thickness?: number;
  speed?: number;
  label?: string;
}>;
export declare const DotBounce: DefineComponent<{
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}>;
export declare const Bars: DefineComponent<{
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}>;
export declare const Pulse: DefineComponent<{
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}>;
export declare const Ripple: DefineComponent<{
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}>;
export declare const Grid: DefineComponent<{
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}>;
export declare const ProgressBar: DefineComponent<{
  color?: string;
  width?: number;
  thickness?: number;
  speed?: number;
  label?: string;
}>;
export declare const Shimmer: DefineComponent<{
  color?: string;
  shine?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const Glow: DefineComponent<{
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const Gradient: DefineComponent<{
  colors?: string[];
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const Sweep: DefineComponent<{
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const BorderDraw: DefineComponent<{
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const Tactile: DefineComponent<{
  color?: string;
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const Spotlight: DefineComponent<{
  color?: string;
  size?: number;
  opacity?: number;
}>;
export declare const Tilt: DefineComponent<{
  color?: string;
  maxTilt?: number;
  speed?: number;
}>;
export declare const ShineBorder: DefineComponent<{
  color?: string;
  speed?: number;
  width?: number;
}>;
export declare const FadeUp: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  distance?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
}>;
export declare const FlipIn: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  duration?: number;
  stagger?: number;
  perspective?: number;
  delay?: number;
}>;
export declare const Neon: DefineComponent<{
  text: string;
  glow?: number;
  duration?: number;
  color?: string;
}>;
export declare const GlitchText: DefineComponent<{
  text: string;
  color?: string;
  offset?: number;
  speed?: number;
}>;
export declare const TrueFocus: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  blur?: number;
  dim?: number;
  speed?: number;
}>;
export declare const CircularText: DefineComponent<{
  text: string;
  by?: 'chars' | 'words';
  radius?: number;
  speed?: number;
}>;
export declare const Glare: DefineComponent<{
  color?: string;
  angle?: number;
  spread?: number;
  opacity?: number;
}>;
export declare const BorderGlow: DefineComponent<{
  color?: string;
  width?: number;
  glow?: number;
}>;
export declare const StarBorder: DefineComponent<{
  color?: string;
  star?: string;
  width?: number;
  speed?: number;
  label?: string;
  disabled?: boolean;
}>;
export declare const FadeContent: DefineComponent<{
  duration?: number;
  delay?: number;
  blur?: number;
}>;
export declare const AnimatedContent: DefineComponent<{
  distance?: number;
  scale?: number;
  duration?: number;
  delay?: number;
}>;
export declare const ClickSpark: DefineComponent<{
  color?: string;
  size?: number;
  speed?: number;
}>;
export declare const Magnet: DefineComponent<{
  strength?: number;
  speed?: number;
}>;
// gen:shims
