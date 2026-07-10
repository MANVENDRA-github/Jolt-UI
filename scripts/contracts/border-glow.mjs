// BorderGlow — the card's border lights up where the cursor is. A container driven by the
// shared pointer behavior (so it hydrates); the ring itself never self-animates, which keeps
// its rest frame deterministic and pixel-parity-safe.
export default {
  id: 'border-glow',
  name: 'BorderGlow',
  category: 'card',
  pattern: 'css-container',
  blurb: 'The border lights up where the cursor is',
  a11y:
    'Renders a plain presentational <div> wrapping your content; the glowing border is purely ' +
    'decorative. Under reduced-motion the glow stays centered and the pointer is not tracked.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'color',
      type: 'string',
      default: '#7c5cff',
      describe: 'Glow color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'width',
      type: 'number',
      default: 2,
      describe: 'Border thickness, in pixels.',
      cssVar: { name: '--jolt-width', unit: 'px' },
    },
    {
      name: 'glow',
      type: 'number',
      default: 120,
      describe: 'Radius of the lit stretch of border, in pixels.',
      cssVar: { name: '--jolt-glow', unit: 'px' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Border Glow',
};
