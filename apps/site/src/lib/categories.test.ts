import { describe, it, expect } from 'vitest';
import { CATEGORIES, COMPONENT_METAS, categoriesWithComponents } from './categories';

describe('CATEGORIES', () => {
  it('has unique ids and slugs', () => {
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(CATEGORIES.length);
    expect(new Set(CATEGORIES.map((c) => c.slug)).size).toBe(CATEGORIES.length);
  });
});

describe('categoriesWithComponents', () => {
  it('aggregates the shipped component metas from the core barrel', () => {
    // Phase 2 shipped 10 text components; this guards the no-drift aggregation.
    expect(COMPONENT_METAS.length).toBeGreaterThanOrEqual(10);
  });

  it('returns only categories that have ≥1 shipped component', () => {
    const present = new Set(COMPONENT_METAS.map((m) => m.category));
    for (const c of categoriesWithComponents()) {
      expect(present.has(c.id)).toBe(true);
    }
  });

  it('includes the Text Animations category (it has components)', () => {
    expect(categoriesWithComponents().map((c) => c.id)).toContain('text');
  });

  it('is returned in ascending registry order', () => {
    const orders = categoriesWithComponents().map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
});
