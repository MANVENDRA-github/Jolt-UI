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
