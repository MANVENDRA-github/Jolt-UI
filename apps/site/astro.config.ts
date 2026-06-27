import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), vue(), svelte(), mdx()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Transform our workspace packages (incl. .vue/.svelte) on the server,
      // instead of treating them as external node_modules.
      noExternal: ['@jolt/react', '@jolt/vue', '@jolt/svelte', '@jolt/tokens'],
    },
  },
});
