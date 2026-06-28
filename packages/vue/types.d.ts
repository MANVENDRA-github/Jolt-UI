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
