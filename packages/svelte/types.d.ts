/**
 * Public types for @jolt/svelte (hand-written for Phase 0; generated from source later).
 *
 * Typed as a props-first function so Astro's `.astro` prop-checking (which reads a
 * component's first parameter as its props) validates component attributes. The runtime
 * export is the real Svelte component; this shape only informs type-checking at call sites.
 */
export declare const Hello: (props: { name?: string }) => unknown;
