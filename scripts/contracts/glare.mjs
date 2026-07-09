// Glare — a glossy sheen that slides across the card toward the cursor. A container
// (presentational <div> wrapping your content) driven by the shared pointer behavior,
// so it needs client hydration for its previews and parity cells.
export default {
  id: 'glare',
  name: 'Glare',
  category: 'card',
  pattern: 'css-container',
  blurb: 'A glossy sheen that follows the cursor across the card',
  a11y:
    'Renders a plain presentational <div> wrapping your content; the sheen is purely decorative. ' +
    'Under reduced-motion the sheen stays centered and the pointer is not tracked.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'color',
      type: 'string',
      default: '#ffffff',
      describe: 'Sheen color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'angle',
      type: 'number',
      default: 105,
      describe: 'Angle of the sheen band, in degrees.',
      cssVar: { name: '--jolt-angle', unit: 'deg' },
    },
    {
      name: 'spread',
      type: 'number',
      default: 220,
      describe: 'Size of the sheen relative to the card, as a percentage.',
      cssVar: { name: '--jolt-spread', unit: '%' },
    },
    {
      name: 'opacity',
      type: 'number',
      default: 0.18,
      describe: 'Peak sheen opacity (0–1).',
      cssVar: { name: '--jolt-opacity' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Glare',
};
