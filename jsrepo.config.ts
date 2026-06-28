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
        // gen:svelte-items
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/svelte', format: true })],
    },
  ],
});
