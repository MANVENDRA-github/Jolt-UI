// GlitchText — a chromatic RGB split with micro-jitter, glitching on a loop. CSS-only,
// whole-text (the string animates as one, so it stays natively readable).
export default {
  id: 'glitch-text',
  name: 'GlitchText',
  pattern: 'css-whole-text',
  blurb: 'Chromatic split and jitter, glitching on a loop',
  a11y: 'Renders the text directly (natively readable); the glitch is decorative.',
  deps: [],
  props: [
    { name: 'text', type: 'string', required: true, describe: 'The text to animate.' },
    {
      name: 'color',
      type: 'string',
      default: '#7c5cff',
      describe: 'Base text color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'offset',
      type: 'number',
      default: 2,
      describe: 'How far the color channels split, in pixels.',
      cssVar: { name: '--jolt-offset', unit: 'px' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 2.5,
      describe: 'Seconds for one glitch cycle.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
  ],
  parity: { kind: 'whole-text', pixelParity: true },
  demoProps: { text: 'Glitch Text' },
  harnessProps: { text: 'Jolt UI' },
  cardText: 'Glitch Text',
};
