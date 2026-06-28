// Pure SEO helpers for the site's <head> (canonical, Open Graph, JSON-LD). The
// origin is always passed in (from `Astro.site`) so these never couple to a
// constant and stay unit-testable independently of the deployed URL.

export const SITE_NAME = 'Jolt UI';
export const SITE_DESCRIPTION =
  'Animated text components for React, Vue, and Svelte — one design language, kept identical across frameworks by a shared core and an automated parity gate. Copy-paste or npx jsrepo add.';

/** Resolve `path` against the site origin into an absolute URL; falls back to `path` when no site is set. */
export function absoluteUrl(site: URL | string | undefined, path: string): string {
  if (!site) return path;
  return new URL(path, site).href;
}

/** schema.org `WebSite` structured data — the site-wide default JSON-LD. */
export function buildWebsiteJsonLd(site: URL | string | undefined): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl(site, '/'),
    description: SITE_DESCRIPTION,
  };
}
