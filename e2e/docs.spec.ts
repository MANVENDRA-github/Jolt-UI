import { expect, test } from '@playwright/test';

test('docs pages render with the docs sub-nav', async ({ page }) => {
  await page.goto('/docs/getting-started');
  await expect(page.getByRole('heading', { name: 'Getting Started', level: 1 })).toBeVisible();
  const docsNav = page.locator('nav[aria-label="Documentation"]');
  await expect(docsNav.getByRole('link', { name: 'Theming' })).toBeVisible();

  await page.goto('/docs/theming');
  await expect(page.getByRole('heading', { name: 'Theming', level: 1 })).toBeVisible();
  await expect(page.getByText('--color-jolt-accent').first()).toBeVisible();
});

test('accessibility + contributing pages render', async ({ page }) => {
  await page.goto('/docs/accessibility');
  await expect(page.getByRole('heading', { name: 'Accessibility', level: 1 })).toBeVisible();
  // The a11y table is generated from every component's meta — at least the 10 shipped.
  const rows = page.locator('article table tbody tr');
  expect(await rows.count()).toBeGreaterThanOrEqual(10);

  await page.goto('/docs/contributing');
  await expect(page.getByRole('heading', { name: 'Contributing', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add a component' })).toBeVisible();
});

test('the site nav links resolve (Components / Docs)', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('header nav');
  await expect(nav.getByRole('link', { name: 'Components' })).toBeVisible();
  await nav.getByRole('link', { name: 'Docs' }).click();
  await expect(page).toHaveURL(/\/docs\/getting-started/);
  await expect(page.getByRole('heading', { name: 'Getting Started', level: 1 })).toBeVisible();
});

test('bare /docs redirects to the first doc page', async ({ page }) => {
  await page.goto('/docs');
  await expect(page).toHaveURL(/\/docs\/getting-started/);
});
