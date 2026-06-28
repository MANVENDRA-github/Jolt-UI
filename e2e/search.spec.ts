import { expect, test } from '@playwright/test';

// The Pagefind UI only mounts in the production build (the index is build-only), so
// against the dev server the search container is present but inert. Assert it's wired
// into the nav; the built index + UI files are checked by scripts/dist-check.mjs.
test('the search container is wired into the site nav', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header nav #jolt-search')).toBeAttached();
});
