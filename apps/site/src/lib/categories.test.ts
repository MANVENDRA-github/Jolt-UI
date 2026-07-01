import { describe, it, expect } from 'vitest';
import {
  CATEGORIES,
  COMPONENT_METAS,
  categoriesWithComponents,
  orderedComponents,
  componentNeighbors,
} from './categories';

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

describe('orderedComponents', () => {
  it('flattens every shipped component, in category order', () => {
    const list = orderedComponents();
    expect(list.length).toBe(COMPONENT_METAS.length);
    const orders = list.map((c) => CATEGORIES.find((cat) => cat.slug === c.slug)!.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('carries the category slug + label on each entry', () => {
    for (const c of orderedComponents()) {
      expect(CATEGORIES.some((cat) => cat.slug === c.slug && cat.label === c.categoryLabel)).toBe(
        true,
      );
    }
  });
});

describe('componentNeighbors', () => {
  it('the first component has no previous, but has a next', () => {
    const list = orderedComponents();
    const { current, prev, next } = componentNeighbors(list[0].id);
    expect(current?.id).toBe(list[0].id);
    expect(prev).toBeUndefined();
    expect(next?.id).toBe(list[1].id);
  });

  it('the last component has no next, but has a previous', () => {
    const list = orderedComponents();
    const last = list[list.length - 1];
    const { next, prev } = componentNeighbors(last.id);
    expect(next).toBeUndefined();
    expect(prev?.id).toBe(list[list.length - 2].id);
  });

  it('a middle component has both neighbours', () => {
    const list = orderedComponents();
    const { prev, next } = componentNeighbors(list[2].id);
    expect(prev?.id).toBe(list[1].id);
    expect(next?.id).toBe(list[3].id);
  });

  it('an unknown id returns no neighbours', () => {
    expect(componentNeighbors('does-not-exist')).toEqual({});
  });
});
