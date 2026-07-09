// A realistic CSS-interactive (button) contract, used as the fixture for the gen unit tests.
// Mirrors the shape of the shipped shimmer/glow buttons: a native <button>, visual-only props
// plus a `label` fallback (exempt from the cssVar rule), and no required prop.
/** @type {import('../contract.mjs').ComponentContract} */
export default {
  id: 'star-border',
  name: 'StarBorder',
  category: 'button',
  pattern: 'css-interactive',
  blurb: 'A star travels around the border.',
  a11y: 'A native <button>: focusable, keyboard-activatable; the traveling star is decorative.',
  deps: [],
  props: [
    {
      name: 'color',
      type: 'string',
      default: '#7c5cff',
      describe: 'Button base color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 3,
      describe: 'Seconds for one trip around the border.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
    {
      name: 'label',
      type: 'string',
      default: 'Button',
      describe: 'Fallback text when no children are provided.',
    },
  ],
  parity: { kind: 'interactive', pixelParity: false },
  demoProps: { label: 'Star Border' },
  harnessProps: { label: 'Jolt UI' },
  cardText: 'Star Border',
};
