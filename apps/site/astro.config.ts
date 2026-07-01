import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { JOLT_ORIGIN } from '../../packages/core/src/origin';
import pagefind from './src/integrations/pagefind';

// https://astro.build/config
export default defineConfig({
  // Production origin (canonical/OG/sitemap) — shares one source with the registry base.
  site: JOLT_ORIGIN,
  // Bare /docs lands on the first doc page; the old flat component paths now live
  // under their category (Phase 5a) — redirect the pre-existing URLs.
  redirects: {
    '/docs': '/docs/getting-started',
    '/components/split-text': '/components/text/split-text',
    '/components/blur-in': '/components/text/blur-in',
    '/components/wave': '/components/text/wave',
    '/components/gradient-text': '/components/text/gradient-text',
    '/components/shiny-text': '/components/text/shiny-text',
    '/components/typewriter': '/components/text/typewriter',
    '/components/rotating-words': '/components/text/rotating-words',
    '/components/count-up': '/components/text/count-up',
    '/components/scramble': '/components/text/scramble',
    '/components/scroll-velocity': '/components/text/scroll-velocity',
  },
  // The dev toolbar is position:fixed and bleeds into the parity E2E's element
  // screenshots; disable it when JOLT_E2E=1 (set by Playwright's webServer).
  // Stays on for a normal `pnpm dev`.
  devToolbar: { enabled: !process.env.JOLT_E2E },
  // expressive-code must come before mdx.
  integrations: [
    react(),
    vue(),
    svelte(),
    // Options live in ec.config.mjs (themeCssSelector is a function → not inline-serializable).
    expressiveCode(),
    mdx(),
    // Exclude the internal parity harness from the sitemap (it's noindex too).
    sitemap({ filter: (page) => !page.includes('/internal/') }),
    // Index the production build for search (Pagefind; no-op during `astro dev`).
    pagefind(),
  ],
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
