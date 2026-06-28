// dist-check — assert the built site (apps/site/dist) carries the SEO + one-origin
// registry invariants. Sitemap + the Pagefind index are build-only artifacts (absent
// from `astro dev`), so they can only be checked here, after `pnpm build`. Run via
// `pnpm test:dist`. Mirrors scripts/registry-check.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'apps/site/dist');

const die = (msg) => {
  console.error(`\n✗ dist-check FAILED: ${msg}`);
  process.exit(1);
};

if (!existsSync(dist)) die('no build output at apps/site/dist — run `pnpm build` first');

// 1. Required static assets (favicon/og are referenced from the head; robots/sitemap for SEO).
for (const f of ['index.html', 'sitemap-index.xml', 'favicon.svg', 'og.svg', 'robots.txt']) {
  if (!existsSync(join(dist, f))) die(`expected dist/${f}`);
}

// 2. One origin: the jsrepo registry is copied into the same build output (dist/r/*).
if (!existsSync(join(dist, 'r/react/registry.json'))) die('registry not bundled into dist/r/');

// 3. The internal parity harness must be excluded from the sitemap, which must list real pages.
const sitemapText = ['sitemap-index.xml', 'sitemap-0.xml']
  .map((f) => join(dist, f))
  .filter(existsSync)
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');
if (sitemapText.includes('/internal/'))
  die('the /internal/ parity harness leaked into the sitemap');
if (!sitemapText.includes('/components/')) die('sitemap is missing component pages');

// 4. The SEO head actually rendered into the static homepage HTML.
const home = readFileSync(join(dist, 'index.html'), 'utf8');
for (const needle of ['rel="canonical"', 'application/ld+json', 'og:image', 'name="description"']) {
  if (!home.includes(needle)) die(`homepage HTML missing ${needle}`);
}

console.log(
  '\n✓ dist-check OK — sitemap (no /internal/) + favicon/og + dist/r/* registry + canonical/JSON-LD/OG on the homepage.',
);
