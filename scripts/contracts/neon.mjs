// Neon — whole-text neon sign that flickers on and holds a steady glow. CSS-only.
export default {
  id: 'neon',
  name: 'Neon',
  pattern: 'css-whole-text',
  blurb: 'Neon sign that flickers on to a steady glow',
  a11y: 'Renders the text directly (natively readable); the glow is decorative.',
  deps: [],
  props: [
    { name: 'text', type: 'string', required: true, describe: 'The text to animate.' },
    {
      name: 'glow',
      type: 'number',
      default: 12,
      describe: 'Glow radius in pixels.',
      cssVar: { name: '--jolt-glow', unit: 'px' },
    },
    {
      name: 'duration',
      type: 'number',
      default: 1.6,
      describe: 'Seconds for the flicker-on to settle.',
      cssVar: { name: '--jolt-duration', unit: 's' },
    },
    {
      name: 'color',
      type: 'string',
      default: '#7c5cff',
      describe: 'Neon tube color (text + glow).',
      cssVar: { name: '--jolt-color' },
    },
  ],
  parity: { kind: 'whole-text', pixelParity: true },
  demoProps: { text: 'Neon' },
  harnessProps: { text: 'Jolt UI' },
  cardText: 'Neon',
};
