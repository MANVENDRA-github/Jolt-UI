// CircularText — the text is laid out around a circle and the ring turns slowly.
// CSS-only, per-character (each segment is rotated to its own slot on the ring).
export default {
  id: 'circular-text',
  name: 'CircularText',
  pattern: 'css-per-char',
  blurb: 'Text laid around a circle, turning slowly',
  a11y: 'Full text is exposed via aria-label; the rotated segments are aria-hidden.',
  deps: [],
  props: [
    { name: 'text', type: 'string', required: true, describe: 'The text to animate.' },
    {
      name: 'by',
      type: 'enum',
      values: ['chars', 'words'],
      default: 'chars',
      describe: 'Split granularity.',
    },
    {
      name: 'radius',
      type: 'number',
      default: 48,
      describe: 'Radius of the ring, in pixels.',
      cssVar: { name: '--jolt-radius', unit: 'px' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 14,
      describe: 'Seconds for one full turn.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
  ],
  parity: { kind: 'per-char', pixelParity: true },
  demoProps: { text: 'CIRCULAR TEXT · JOLT UI · ' },
  harnessProps: { text: 'Jolt UI' },
  cardText: 'Circular Text',
};
