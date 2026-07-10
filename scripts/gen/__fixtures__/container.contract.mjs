// A realistic CSS-container (card) contract, used as the fixture for the gen unit tests.
// Mirrors the shape of the shipped spotlight/tilt cards: a presentational <div> wrapping the
// consumer's content, visual-only props, no `text`/`label`, and no required prop at all.
// `hydrate: true` marks a pointer-driven card whose previews/cells need client hydration.
/** @type {import('../contract.mjs').ComponentContract} */
export default {
  id: 'glare',
  name: 'Glare',
  category: 'card',
  pattern: 'css-container',
  blurb: 'A sheen that follows the cursor across the card.',
  a11y: 'Renders a plain presentational <div> wrapping your content; the sheen is decorative.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'color',
      type: 'string',
      default: '#7c5cff',
      describe: 'Sheen color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'size',
      type: 'number',
      default: 60,
      describe: 'Sheen radius as a % of the card.',
      cssVar: { name: '--jolt-size', unit: '%' },
    },
    {
      name: 'opacity',
      type: 'number',
      default: 0.35,
      describe: 'Peak sheen opacity (0–1).',
      cssVar: { name: '--jolt-opacity' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Glare',
};
