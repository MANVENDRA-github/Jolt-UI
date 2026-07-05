import { expect, test } from '@playwright/test';

// Phase 5a: components are organized into categories — nested /components/<category>/<id>
// routes, a category sub-nav, and a grouped index. The old flat paths redirect.

test('the old flat component path redirects to its category path', async ({ page }) => {
  await page.goto('/components/split-text');
  await expect(page).toHaveURL(/\/components\/text\/split-text/);
  await expect(page.getByRole('heading', { name: 'SplitText', level: 1 })).toBeVisible();
});

test('the components index groups components under a category section + sub-nav', async ({
  page,
}) => {
  await page.goto('/components');
  const nav = page.locator('nav[aria-label="Components"]');
  await expect(nav.getByRole('link', { name: 'Text Animations' })).toBeVisible();
  await expect(page.locator('section#text')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Text Animations' })).toBeVisible();
});

test('a demo page shows the components sub-nav', async ({ page }) => {
  await page.goto('/components/text/wave');
  const nav = page.locator('nav[aria-label="Components"]');
  await expect(nav.getByRole('link', { name: 'All' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Text Animations' })).toBeVisible();
});

test('scroll reveals never hide content under reduced motion', async ({ page }) => {
  // Reveals are an enhancement — under this suite's reduced motion, the reveal
  // script bails and every below-fold section stays visible from first paint.
  await page.goto('/components');
  await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();
  await expect(page.locator('section#cards a').first()).toBeVisible();
});
