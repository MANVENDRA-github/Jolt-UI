// FadeContent — wraps your content and fades + de-blurs it in when it scrolls into view.
// A container driven by the shared scroll-reveal behavior, so it needs client hydration.
export default {
  id: 'fade-content',
  name: 'FadeContent',
  category: 'effect',
  pattern: 'css-container',
  blurb: 'Fades your content in when it scrolls into view',
  a11y:
    'A transparent wrapper around your content — it adds no semantics. The content is visible ' +
    'by default and is only hidden once JS arms the reveal, so no-JS and reduced-motion users ' +
    'always see it.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'duration',
      type: 'number',
      default: 0.7,
      describe: 'Seconds the entrance takes.',
      cssVar: { name: '--jolt-duration', unit: 's' },
    },
    {
      name: 'delay',
      type: 'number',
      default: 0,
      describe: 'Seconds to wait after the content enters view.',
      cssVar: { name: '--jolt-delay', unit: 's' },
    },
    {
      name: 'blur',
      type: 'number',
      default: 6,
      describe: 'How blurred the content starts, in pixels.',
      cssVar: { name: '--jolt-blur', unit: 'px' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Fade Content',
};
