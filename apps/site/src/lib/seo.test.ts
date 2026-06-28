import { describe, it, expect } from 'vitest';
import { absoluteUrl, buildWebsiteJsonLd, SITE_NAME } from './seo';

const ORIGIN = 'https://jolt-ui.pages.dev';

describe('absoluteUrl', () => {
  it('joins the origin and a path', () => {
    expect(absoluteUrl(ORIGIN, '/components/blur-in')).toBe(`${ORIGIN}/components/blur-in`);
  });

  it('resolves the root path with a trailing slash', () => {
    expect(absoluteUrl(ORIGIN, '/')).toBe(`${ORIGIN}/`);
  });

  it('accepts a URL object (as Astro.site provides)', () => {
    expect(absoluteUrl(new URL(ORIGIN), '/x')).toBe(`${ORIGIN}/x`);
  });

  it('falls back to the path when the site is unset', () => {
    expect(absoluteUrl(undefined, '/x')).toBe('/x');
  });
});

describe('buildWebsiteJsonLd', () => {
  it('builds WebSite structured data with an absolute url', () => {
    const ld = buildWebsiteJsonLd(ORIGIN);
    expect(ld['@type']).toBe('WebSite');
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld.url).toBe(`${ORIGIN}/`);
    expect(ld.name).toBe(SITE_NAME);
  });
});
