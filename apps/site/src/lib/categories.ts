/**
 * The component-category registry — the single source mapping a component's
 * `meta.category` data value to its URL slug + display label, plus the helper
 * that tells the nav/index which categories actually have shipped components.
 */
import * as core from '@jolt/core';

/** The data value carried on each component's `meta.category`. */
export type CategoryId = 'text' | 'background' | 'loader' | 'button' | 'card' | 'effect';

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
  { id: 'loader', slug: 'loaders', label: 'Loaders', order: 2 },
  { id: 'button', slug: 'buttons', label: 'Buttons', order: 3 },
  { id: 'card', slug: 'cards', label: 'Cards', order: 4 },
  // "Effects", not "Animations" (which reads as a duplicate of "Text Animations"): these wrap
  // your content and animate it — a reveal, a spark, a pull toward the cursor. See D-042.
  { id: 'effect', slug: 'effects', label: 'Effects', order: 5 },
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

/** A component's place in the ordered catalogue — for breadcrumbs + prev/next nav. */
export interface ComponentRef {
  id: string;
  name: string;
  /** The category URL slug (e.g. 'backgrounds'). */
  slug: string;
  /** The category display label (e.g. 'Backgrounds'). */
  categoryLabel: string;
}

/** Every shipped component flattened in catalogue order: category order, then barrel order. */
export function orderedComponents(): ComponentRef[] {
  const byId = new Map(CATEGORIES.map((c) => [c.id, c]));
  return COMPONENT_METAS.flatMap((m) => {
    const cat = byId.get(m.category as CategoryId);
    return cat
      ? [{ id: m.id, name: m.name, slug: cat.slug, categoryLabel: cat.label, order: cat.order }]
      : [];
  })
    .sort((a, b) => a.order - b.order) // stable sort preserves barrel order within a category
    .map(({ order: _order, ...ref }) => ref);
}

/** The current component plus its previous/next neighbours in catalogue order. */
export function componentNeighbors(id: string): {
  current?: ComponentRef;
  prev?: ComponentRef;
  next?: ComponentRef;
} {
  const list = orderedComponents();
  const i = list.findIndex((c) => c.id === id);
  if (i === -1) return {};
  return { current: list[i], prev: list[i - 1], next: list[i + 1] };
}
