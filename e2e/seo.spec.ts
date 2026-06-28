import { expect, test } from '@playwright/test';

// The dev server has `Astro.site` set (from astro.config `site`), so canonical/OG
// absolute URLs render and are assertable here. Sitemap + Pagefind are build-only
// and covered by scripts/dist-check.mjs instead.
const ORIGIN = 'https://jolt-ui.pages.dev';

test('the homepage exposes core SEO metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Jolt UI/);
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}/`);
  await expect(page.locator('head link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');

  await expect(page.locator('head meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/`,
  );
  await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og.svg`,
  );
  await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );

  const ld = await page.locator('head script[type="application/ld+json"]').textContent();
  const data = JSON.parse(ld ?? '{}');
  expect(data['@type']).toBe('WebSite');
  expect(data.url).toBe(`${ORIGIN}/`);
});

test('a component page sets a path-specific canonical + its own description', async ({ page }) => {
  await page.goto('/components/blur-in');
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/components/blur-in`,
  );
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /de-blur/);
});

test('the internal parity harness is noindex', async ({ page }) => {
  await page.goto('/internal/parity');
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
