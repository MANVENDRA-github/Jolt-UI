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
// gen:shims
