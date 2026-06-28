/**
 * The component-category registry — the single source mapping a component's
 * `meta.category` data value to its URL slug + display label, plus the helper
 * that tells the nav/index which categories actually have shipped components.
 */
import * as core from '@jolt/core';

/** The data value carried on each component's `meta.category`. */
export type CategoryId = 'text' | 'background';

export interface Category {
  /** Matches `meta.category` on a component. */
  id: CategoryId;
  /** URL segment under `/components/` (e.g. 'backgrounds'). */
  slug: string;
  /** Display label in the sub-nav + index section headings. */
  label: string;
  /** Sort order in the nav + index. */
  order: number;
}

/** The ordered category registry. The plural URL slug lives only here; `meta.category` stays singular. */
export const CATEGORIES: readonly Category[] = [
  { id: 'text', slug: 'text', label: 'Text Animations', order: 0 },
  { id: 'background', slug: 'backgrounds', label: 'Backgrounds', order: 1 },
];

interface ComponentMeta {
  id: string;
  name: string;
  category: string;
  a11y: string;
}
function isMeta(v: unknown): v is ComponentMeta {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in v &&
    'name' in v &&
    'category' in v &&
    'a11y' in v
  );
}

/** Every shipped component's meta, aggregated from the core barrel (can't drift from the code). */
export const COMPONENT_METAS: readonly ComponentMeta[] = (Object.values(core) as unknown[]).filter(
  isMeta,
);

/** The categories that currently have ≥1 shipped component, in registry order. */
export function categoriesWithComponents(): Category[] {
  const present = new Set(COMPONENT_METAS.map((m) => m.category));
  return CATEGORIES.filter((c) => present.has(c.id))
    .slice()
    .sort((a, b) => a.order - b.order);
}
