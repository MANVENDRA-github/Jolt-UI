import { defineConfig } from 'vitest/config';

// Root orchestrator: one Vitest project per package (each owns its own
// environment + framework plugin in its local vitest.config.ts).
export default defineConfig({
  test: {
    projects: [
      'packages/tokens',
      'packages/core',
      'packages/react',
      'packages/vue',
      'packages/svelte',
    ],
  },
});
