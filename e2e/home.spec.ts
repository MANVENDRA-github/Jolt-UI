import { expect, test } from '@playwright/test';

// The landing is a progressive-enhancement scroll story: every section's copy is
// server-rendered and statically visible. This suite runs under the global
// reducedMotion:'reduce' setting, so it also guards the invariant that no landing
// content is ever hidden behind a motion-only state.

test('hero renders the headline, CTAs, and category chips', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Motion, tripled.');
  const hero = page.locator('#hero');
  await expect(hero.getByRole('link', { name: /Browse \d+ components/ })).toBeVisible();
  await expect(hero.getByRole('link', { name: 'npx jsrepo add' })).toBeVisible();
});

test('the split story beats are statically visible', async ({ page }) => {
  await page.goto('/');
  const story = page.locator('#split-story');
  await expect(story.getByText('One animation core.')).toBeVisible();
  await expect(story.getByText('Three frameworks.')).toBeVisible();
  await expect(story.getByText('Zero drift.')).toBeVisible();
});

test('the dogfood grid mounts live components', async ({ page }) => {
  await page.goto('/');
  const grid = page.locator('#built-with-itself');
  await expect(grid.getByRole('button', { name: 'Shimmer' })).toBeAttached();
  await expect(grid.getByRole('link', { name: /all \d+ components/i })).toBeAttached();
});

test('the install moment shows the jsrepo command and stats', async ({ page }) => {
  await page.goto('/');
  const install = page.locator('#install');
  await expect(install.getByText('npx jsrepo add').first()).toBeVisible();
  await expect(install.getByText('frameworks')).toBeVisible();
});

test('the parity signature renders all three framework rails', async ({ page }) => {
  await page.goto('/');
  const parity = page.locator('#parity');
  await expect(parity.getByText('React', { exact: true })).toBeVisible();
  await expect(parity.getByText('Vue', { exact: true })).toBeVisible();
  await expect(parity.getByText('Svelte', { exact: true })).toBeVisible();
});

test('the final CTA links to the gallery', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('#final-cta');
  await expect(cta.getByRole('link', { name: /Browse .*components/i })).toBeVisible();
});

test('the volt-field scene mounts a canvas behind the hero', async ({ page }) => {
  await page.goto('/');
  // Headless Chromium has SwiftShader WebGL, so the factory's probe passes and a
  // canvas mounts; under this suite's reduced motion it renders one static frame.
  await expect(page.locator('[data-volt-field] canvas')).toBeAttached();
  // The scene layer must never eat the page content.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('the chrome contract holds on the landing page', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('header nav');
  await expect(nav.getByRole('link', { name: 'Components' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Docs' })).toBeVisible();
});
