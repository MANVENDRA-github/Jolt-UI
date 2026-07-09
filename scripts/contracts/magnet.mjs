// Magnet — wraps your content and pulls it toward the cursor while hovered.
// Reuses trackPointer with the writeMagnet writer; needs client hydration.
export default {
  id: 'magnet',
  name: 'Magnet',
  category: 'effect',
  pattern: 'css-container',
  blurb: 'Pulls your content toward the cursor',
  a11y:
    'A transparent wrapper around your content — it adds no semantics and the pull is purely ' +
    'decorative. Under reduced-motion the content stays put and the pointer is not tracked.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'strength',
      type: 'number',
      default: 14,
      describe: 'How far the content can travel toward the cursor, in pixels.',
      cssVar: { name: '--jolt-strength', unit: 'px' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 0.25,
      describe: 'Seconds the content takes to catch up with the cursor.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Magnet',
};
