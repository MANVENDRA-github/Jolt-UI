import { defineConfig } from 'jsrepo';
import { css, js, svelte, vue } from 'jsrepo/langs';
import { distributed } from 'jsrepo/outputs';

// One registry per framework (jsrepo item names must be globally unique within a
// registry). Each is self-contained: the framework `split-text` component plus the
// shared `core`. A component imports `@jolt/core`, which the package tsconfig
// baseUrl+paths alias resolves to `packages/core/src` — so jsrepo treats it as the
// registry `core` item and rewrites the import to the user's install path on `add`.
//
// Files are listed explicitly (no globs) to keep tests out of the distributed blocks.
const core = {
  name: 'core',
  type: 'lib',
  // Recursive glob (base stays `src/`, subdirs preserved) but the `!(webgl)` path
  // segment EXCLUDES `src/webgl/` — its Three.js code lives in the separate
  // `webgl-core` item below so `three` isn't forced on every component's
  // consumers (D-028). The top-level glob catches `src/*.ts`; both keep the proven
  // `!(*.test)` extglob (D-012).
  files: [
    { path: 'packages/core/src/!(*.test).ts' },
    { path: 'packages/core/src/!(webgl)/**/!(*.test).ts' },
    { path: 'packages/core/src/styles/*.css' },
  ],
} as const;

// Every background's Three.js factory lives in ONE shared item so `three` (no bundled
// types, ~600KB) reaches only the background components that import it — never the
// monolithic `core` every component pulls (which would break the text components'
// `tsc`). See D-028 + D-031. `registry-check.mjs` asserts the isolation.
const webglCore = {
  name: 'webgl-core',
  type: 'lib',
  files: [{ path: 'packages/core/src/webgl/!(*.test).ts' }],
} as const;

export default defineConfig({
  languages: [js(), vue(), svelte(), css()],
  // Source imports `@jolt/core` (a workspace package) so the monorepo's runtime and
  // type-checking work normally. For distribution we rewrite that to the `@/jolt-core`
  // path alias (declared in the root tsconfig.json) so jsrepo resolves it to the local
  // `core` item, bundles those files, and rewrites the import to the user's path on add.
  build: {
    transforms: [
      {
        transform: (content) => ({ content: content.replaceAll('@jolt/core', '@/jolt-core') }),
      },
    ],
  },
  registry: [
    {
      name: 'jolt-ui-react',
      version: '0.0.0',
      excludeDeps: ['react', 'react-dom'],
      items: [
        core,
        webglCore,
        {
          name: 'split-text',
          type: 'component',
          files: [{ path: 'packages/react/src/components/SplitText/SplitText.tsx' }],
        },
        {
          name: 'blur-in',
          type: 'component',
          files: [{ path: 'packages/react/src/components/BlurIn/BlurIn.tsx' }],
        },
        {
          name: 'wave',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Wave/Wave.tsx' }],
        },
        {
          name: 'gradient-text',
          type: 'component',
          files: [{ path: 'packages/react/src/components/GradientText/GradientText.tsx' }],
        },
        {
          name: 'shiny-text',
          type: 'component',
          files: [{ path: 'packages/react/src/components/ShinyText/ShinyText.tsx' }],
        },
        {
          name: 'typewriter',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Typewriter/Typewriter.tsx' }],
        },
        {
          name: 'rotating-words',
          type: 'component',
          files: [{ path: 'packages/react/src/components/RotatingWords/RotatingWords.tsx' }],
        },
        {
          name: 'count-up',
          type: 'component',
          files: [{ path: 'packages/react/src/components/CountUp/CountUp.tsx' }],
        },
        {
          name: 'scramble',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Scramble/Scramble.tsx' }],
        },
        {
          name: 'scroll-velocity',
          type: 'component',
          files: [{ path: 'packages/react/src/components/ScrollVelocity/ScrollVelocity.tsx' }],
        },
        {
          name: 'particles',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Particles/Particles.tsx' }],
        },
        {
          name: 'waves',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Waves/Waves.tsx' }],
        },
        {
          name: 'dots',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Dots/Dots.tsx' }],
        },
        {
          name: 'globe',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Globe/Globe.tsx' }],
        },
        {
          name: 'rings',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Rings/Rings.tsx' }],
        },
        {
          name: 'aurora',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Aurora/Aurora.tsx' }],
        },
        {
          name: 'spinner',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Spinner/Spinner.tsx' }],
        },
        {
          name: 'dot-bounce',
          type: 'component',
          files: [{ path: 'packages/react/src/components/DotBounce/DotBounce.tsx' }],
        },
        {
          name: 'bars',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Bars/Bars.tsx' }],
        },
        {
          name: 'pulse',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Pulse/Pulse.tsx' }],
        },
        {
          name: 'ripple',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Ripple/Ripple.tsx' }],
        },
        {
          name: 'grid',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Grid/Grid.tsx' }],
        },
        {
          name: 'progress-bar',
          type: 'component',
          files: [{ path: 'packages/react/src/components/ProgressBar/ProgressBar.tsx' }],
        },
        {
          name: 'shimmer',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Shimmer/Shimmer.tsx' }],
        },
        {
          name: 'glow',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Glow/Glow.tsx' }],
        },
        {
          name: 'gradient',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Gradient/Gradient.tsx' }],
        },
        {
          name: 'sweep',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Sweep/Sweep.tsx' }],
        },
        {
          name: 'border-draw',
          type: 'component',
          files: [{ path: 'packages/react/src/components/BorderDraw/BorderDraw.tsx' }],
        },
        {
          name: 'tactile',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Tactile/Tactile.tsx' }],
        },
        {
          name: 'spotlight',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Spotlight/Spotlight.tsx' }],
        },
        {
          name: 'tilt',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Tilt/Tilt.tsx' }],
        },
        {
          name: 'shine-border',
          type: 'component',
          files: [{ path: 'packages/react/src/components/ShineBorder/ShineBorder.tsx' }],
        },
        {
          name: 'fade-up',
          type: 'component',
          files: [{ path: 'packages/react/src/components/FadeUp/FadeUp.tsx' }],
        },
        {
          name: 'flip-in',
          type: 'component',
          files: [{ path: 'packages/react/src/components/FlipIn/FlipIn.tsx' }],
        },
        {
          name: 'neon',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Neon/Neon.tsx' }],
        },
        {
          name: 'glitch-text',
          type: 'component',
          files: [{ path: 'packages/react/src/components/GlitchText/GlitchText.tsx' }],
        },
        {
          name: 'true-focus',
          type: 'component',
          files: [{ path: 'packages/react/src/components/TrueFocus/TrueFocus.tsx' }],
        },
        {
          name: 'circular-text',
          type: 'component',
          files: [{ path: 'packages/react/src/components/CircularText/CircularText.tsx' }],
        },
        {
          name: 'glare',
          type: 'component',
          files: [{ path: 'packages/react/src/components/Glare/Glare.tsx' }],
        },
        {
          name: 'border-glow',
          type: 'component',
          files: [{ path: 'packages/react/src/components/BorderGlow/BorderGlow.tsx' }],
        },
        {
          name: 'star-border',
          type: 'component',
          files: [{ path: 'packages/react/src/components/StarBorder/StarBorder.tsx' }],
        },
        // gen:react-items
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/react', format: true })],
    },
    {
      name: 'jolt-ui-vue',
      version: '0.0.0',
      excludeDeps: ['vue'],
      items: [
        core,
        webglCore,
        {
          name: 'split-text',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/SplitText/SplitText.vue' }],
        },
        {
          name: 'blur-in',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/BlurIn/BlurIn.vue' }],
        },
        {
          name: 'wave',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Wave/Wave.vue' }],
        },
        {
          name: 'gradient-text',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/GradientText/GradientText.vue' }],
        },
        {
          name: 'shiny-text',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/ShinyText/ShinyText.vue' }],
        },
        {
          name: 'typewriter',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Typewriter/Typewriter.vue' }],
        },
        {
          name: 'rotating-words',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/RotatingWords/RotatingWords.vue' }],
        },
        {
          name: 'count-up',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/CountUp/CountUp.vue' }],
        },
        {
          name: 'scramble',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Scramble/Scramble.vue' }],
        },
        {
          name: 'scroll-velocity',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/ScrollVelocity/ScrollVelocity.vue' }],
        },
        {
          name: 'particles',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Particles/Particles.vue' }],
        },
        {
          name: 'waves',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Waves/Waves.vue' }],
        },
        {
          name: 'dots',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Dots/Dots.vue' }],
        },
        {
          name: 'globe',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Globe/Globe.vue' }],
        },
        {
          name: 'rings',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Rings/Rings.vue' }],
        },
        {
          name: 'aurora',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Aurora/Aurora.vue' }],
        },
        {
          name: 'spinner',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Spinner/Spinner.vue' }],
        },
        {
          name: 'dot-bounce',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/DotBounce/DotBounce.vue' }],
        },
        {
          name: 'bars',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Bars/Bars.vue' }],
        },
        {
          name: 'pulse',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Pulse/Pulse.vue' }],
        },
        {
          name: 'ripple',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Ripple/Ripple.vue' }],
        },
        {
          name: 'grid',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Grid/Grid.vue' }],
        },
        {
          name: 'progress-bar',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/ProgressBar/ProgressBar.vue' }],
        },
        {
          name: 'shimmer',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Shimmer/Shimmer.vue' }],
        },
        {
          name: 'glow',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Glow/Glow.vue' }],
        },
        {
          name: 'gradient',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Gradient/Gradient.vue' }],
        },
        {
          name: 'sweep',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Sweep/Sweep.vue' }],
        },
        {
          name: 'border-draw',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/BorderDraw/BorderDraw.vue' }],
        },
        {
          name: 'tactile',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Tactile/Tactile.vue' }],
        },
        {
          name: 'spotlight',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Spotlight/Spotlight.vue' }],
        },
        {
          name: 'tilt',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Tilt/Tilt.vue' }],
        },
        {
          name: 'shine-border',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/ShineBorder/ShineBorder.vue' }],
        },
        {
          name: 'fade-up',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/FadeUp/FadeUp.vue' }],
        },
        {
          name: 'flip-in',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/FlipIn/FlipIn.vue' }],
        },
        {
          name: 'neon',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Neon/Neon.vue' }],
        },
        {
          name: 'glitch-text',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/GlitchText/GlitchText.vue' }],
        },
        {
          name: 'true-focus',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/TrueFocus/TrueFocus.vue' }],
        },
        {
          name: 'circular-text',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/CircularText/CircularText.vue' }],
        },
        {
          name: 'glare',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/Glare/Glare.vue' }],
        },
        {
          name: 'border-glow',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/BorderGlow/BorderGlow.vue' }],
        },
        {
          name: 'star-border',
          type: 'component',
          files: [{ path: 'packages/vue/src/components/StarBorder/StarBorder.vue' }],
        },
        // gen:vue-items
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/vue', format: true })],
    },
    {
      name: 'jolt-ui-svelte',
      version: '0.0.0',
      excludeDeps: ['svelte'],
      items: [
        core,
        webglCore,
        {
          name: 'split-text',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/SplitText/SplitText.svelte' }],
        },
        {
          name: 'blur-in',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/BlurIn/BlurIn.svelte' }],
        },
        {
          name: 'wave',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Wave/Wave.svelte' }],
        },
        {
          name: 'gradient-text',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/GradientText/GradientText.svelte' }],
        },
        {
          name: 'shiny-text',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/ShinyText/ShinyText.svelte' }],
        },
        {
          name: 'typewriter',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Typewriter/Typewriter.svelte' }],
        },
        {
          name: 'rotating-words',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/RotatingWords/RotatingWords.svelte' }],
        },
        {
          name: 'count-up',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/CountUp/CountUp.svelte' }],
        },
        {
          name: 'scramble',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Scramble/Scramble.svelte' }],
        },
        {
          name: 'scroll-velocity',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/ScrollVelocity/ScrollVelocity.svelte' }],
        },
        {
          name: 'particles',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Particles/Particles.svelte' }],
        },
        {
          name: 'waves',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Waves/Waves.svelte' }],
        },
        {
          name: 'dots',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Dots/Dots.svelte' }],
        },
        {
          name: 'globe',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Globe/Globe.svelte' }],
        },
        {
          name: 'rings',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Rings/Rings.svelte' }],
        },
        {
          name: 'aurora',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Aurora/Aurora.svelte' }],
        },
        {
          name: 'spinner',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Spinner/Spinner.svelte' }],
        },
        {
          name: 'dot-bounce',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/DotBounce/DotBounce.svelte' }],
        },
        {
          name: 'bars',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Bars/Bars.svelte' }],
        },
        {
          name: 'pulse',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Pulse/Pulse.svelte' }],
        },
        {
          name: 'ripple',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Ripple/Ripple.svelte' }],
        },
        {
          name: 'grid',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Grid/Grid.svelte' }],
        },
        {
          name: 'progress-bar',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/ProgressBar/ProgressBar.svelte' }],
        },
        {
          name: 'shimmer',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Shimmer/Shimmer.svelte' }],
        },
        {
          name: 'glow',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Glow/Glow.svelte' }],
        },
        {
          name: 'gradient',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Gradient/Gradient.svelte' }],
        },
        {
          name: 'sweep',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Sweep/Sweep.svelte' }],
        },
        {
          name: 'border-draw',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/BorderDraw/BorderDraw.svelte' }],
        },
        {
          name: 'tactile',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Tactile/Tactile.svelte' }],
        },
        {
          name: 'spotlight',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Spotlight/Spotlight.svelte' }],
        },
        {
          name: 'tilt',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Tilt/Tilt.svelte' }],
        },
        {
          name: 'shine-border',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/ShineBorder/ShineBorder.svelte' }],
        },
        {
          name: 'fade-up',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/FadeUp/FadeUp.svelte' }],
        },
        {
          name: 'flip-in',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/FlipIn/FlipIn.svelte' }],
        },
        {
          name: 'neon',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Neon/Neon.svelte' }],
        },
        {
          name: 'glitch-text',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/GlitchText/GlitchText.svelte' }],
        },
        {
          name: 'true-focus',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/TrueFocus/TrueFocus.svelte' }],
        },
        {
          name: 'circular-text',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/CircularText/CircularText.svelte' }],
        },
        {
          name: 'glare',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/Glare/Glare.svelte' }],
        },
        {
          name: 'border-glow',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/BorderGlow/BorderGlow.svelte' }],
        },
        {
          name: 'star-border',
          type: 'component',
          files: [{ path: 'packages/svelte/src/components/StarBorder/StarBorder.svelte' }],
        },
        // gen:svelte-items
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/svelte', format: true })],
    },
  ],
});
