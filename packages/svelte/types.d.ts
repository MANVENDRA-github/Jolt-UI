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
