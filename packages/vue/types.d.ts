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
