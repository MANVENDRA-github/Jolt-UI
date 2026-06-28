import { expect, test } from '@playwright/test';

// The Installation block (apps/site/src/components/InstallBlock.astro) derives its
// dependency badges + npm/pnpm install commands from the component's `meta` via
// `installInfo` — so what a page shows can't drift from what `jsrepo add` pulls.
// These assert the derived output end-to-end for the two dependency shapes.

/** The <section> that holds the Installation heading on a component page. */
const installSection = (page: import('@playwright/test').Page) =>
  page.locator('section', { has: page.getByRole('heading', { name: 'Installation' }) });

test('a GSAP component surfaces gsap + zod badges and its jsrepo add command', async ({ page }) => {
  await page.goto('/components/text/count-up');
  const install = installSection(page);

  await expect(install.locator('[data-testid="dependency-badge"]')).toHaveText(['gsap', 'zod']);
  // The default (npm) tab shows the jsrepo add line for this component + its peers.
  await expect(install).toContainText('npx jsrepo add');
  await expect(install).toContainText('/r/react/count-up');
  await expect(install).toContainText('npm i gsap zod');
});

test('a CSS-only component surfaces only zod (no gsap)', async ({ page }) => {
  await page.goto('/components/text/blur-in');
  const install = installSection(page);

  await expect(install.locator('[data-testid="dependency-badge"]')).toHaveText(['zod']);
  await expect(install).toContainText('/r/react/blur-in');
  await expect(install).toContainText('npm i zod');
});
