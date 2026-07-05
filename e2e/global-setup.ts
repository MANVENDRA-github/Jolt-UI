import { chromium, type FullConfig } from '@playwright/test';

// The suite runs against the Astro *dev* server, whose Vite dep-optimizer only
// finalizes a client dependency the first time a real browser requests its island
// chunk. Under a cold server hit by parallel workers, that mid-session re-optimize
// invalidates already-served chunks and crashes island hydration (the volt-field
// canvas fails to mount; Svelte parity cells fail to hydrate — see the astro.config
// optimizeDeps note). Warming the heavy pages once, in a real browser, before the
// workers start makes the optimizer settle deterministically.
const WARM_PATHS = [
  '/', // homepage: three (volt-field) + gsap/lenis + the dogfood islands
  '/internal/parity', // every text/loader/button/card island at once
  '/internal/parity-bg/particles',
  '/internal/parity-bg/aurora', // the shader background
];

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:4321';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const path of WARM_PATHS) {
    try {
      await page.goto(baseURL + path, { waitUntil: 'load', timeout: 60_000 });
      // Give the client islands a beat to request + trigger optimization of their deps.
      await page.waitForTimeout(1500);
    } catch {
      // Best-effort warmup — a failure here shouldn't block the run; the test itself
      // will report the real problem.
    }
  }
  await browser.close();
}
