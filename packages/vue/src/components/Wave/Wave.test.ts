import { render } from '@testing-library/vue';
import { splitSegments } from '@jolt/core';
import Wave from './Wave.vue';

describe('Wave (vue)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(Wave, { props: { text: 'Hello' } });
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(Wave, { props: { text: 'Hello' } });
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Wave, { props: { text: 'Hi', amplitude: 20 } });
    const root = container.querySelector<HTMLElement>('.jolt-wave');
    expect(root?.style.getPropertyValue('--jolt-amplitude')).toBe('20px');
  });
});
