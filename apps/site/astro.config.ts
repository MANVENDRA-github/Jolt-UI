import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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
