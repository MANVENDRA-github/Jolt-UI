import type { AstroIntegration } from 'astro';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Index the built site with Pagefind at the end of `astro build`. This runs only
 * for the production build (never `astro dev`), so the search index + UI exist only
 * in `dist/pagefind/`; the Search component feature-detects and degrades in dev.
 */
export default function pagefind(): AstroIntegration {
  return {
    name: 'pagefind',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const site = fileURLToPath(dir);
        logger.info('Indexing the build with Pagefind…');
        execSync(`pnpm exec pagefind --site "${site}"`, { stdio: 'inherit' });
      },
    },
  };
}
