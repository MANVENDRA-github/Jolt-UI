import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // The dev toolbar is position:fixed and bleeds into the parity E2E's element
  // screenshots; disable it when JOLT_E2E=1 (set by Playwright's webServer).
  // Stays on for a normal `pnpm dev`.
  devToolbar: { enabled: !process.env.JOLT_E2E },
  // expressive-code must come before mdx.
  integrations: [react(), vue(), svelte(), expressiveCode({ themes: ['github-dark'] }), mdx()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Transform all our workspace packages (incl. @jolt/core's raw .ts and the
      // .vue/.svelte skins) on the server, instead of treating them as external
      // node_modules — otherwise dev SSR tries to load the raw .ts via Node.
      noExternal: [/^@jolt\//],
    },
  },
});
