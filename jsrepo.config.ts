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
  files: [
    { path: 'packages/core/src/**/!(*.test).ts' },
    { path: 'packages/core/src/styles/*.css' },
  ],
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
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/react', format: true })],
    },
    {
      name: 'jolt-ui-vue',
      version: '0.0.0',
      excludeDeps: ['vue'],
      items: [
        core,
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
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/vue', format: true })],
    },
    {
      name: 'jolt-ui-svelte',
      version: '0.0.0',
      excludeDeps: ['svelte'],
      items: [
        core,
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
      ],
      outputs: [distributed({ dir: 'apps/site/public/r/svelte', format: true })],
    },
  ],
});
