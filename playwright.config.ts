import { defineConfig, devices } from '@playwright/test';

// E2E runs against the Astro dev server. `reducedMotion: 'reduce'` makes the
// SplitText core render its final (static) state, giving a deterministic frame
// for cross-framework parity comparison.
export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  forbidOnly: !!process.env.CI,
  // Warm the dev server's Vite dep-optimizer in a real browser before the parallel
  // workers hit it (see e2e/global-setup.ts) — avoids a cold-start hydration race.
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:4321',
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm --filter @jolt/site exec astro dev --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Disable Astro's dev toolbar (see astro.config.ts) so it can't bleed into
    // the parity screenshots.
    env: { JOLT_E2E: '1' },
  },
});
