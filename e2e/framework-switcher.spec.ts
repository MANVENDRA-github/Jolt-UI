import { test, expect } from '@playwright/test';

test('the framework switcher renders all three frameworks and toggles between them', async ({
  page,
}) => {
  await page.goto('/components/text/split-text');
  const fw = page.locator('.jolt-fw').first();
  const tabs = fw.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await expect(tabs.nth(0)).toHaveText('React');
  await expect(tabs.nth(1)).toHaveText('Vue');
  await expect(tabs.nth(2)).toHaveText('Svelte');

  // React is active by default; the other panels are hidden (visibility, not display).
  await expect(fw.locator('#fw-split-text-panel-react')).toBeVisible();
  await expect(fw.locator('#fw-split-text-panel-vue')).toBeHidden();
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

  // Switching activates the Svelte panel and deactivates React.
  await tabs.nth(2).click();
  await expect(fw.locator('#fw-split-text-panel-svelte')).toBeVisible();
  await expect(fw.locator('#fw-split-text-panel-react')).toBeHidden();
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
});

test('a demo page shows breadcrumbs and a component pager', async ({ page }) => {
  await page.goto('/components/text/blur-in');

  const crumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(crumb).toContainText('Components');
  await expect(crumb).toContainText('Text Animations');
  await expect(crumb).toContainText('BlurIn');

  // The pager links to at least one neighbour in catalogue order.
  const pager = page.getByRole('navigation', { name: 'Component pagination' });
  await expect(pager.getByRole('link').first()).toBeVisible();
});
