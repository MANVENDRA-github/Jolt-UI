import { render } from '@testing-library/vue';
import { splitSegments } from '@jolt/core';
import FlipIn from './FlipIn.vue';

describe('FlipIn (vue)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(FlipIn, { props: { text: 'Hello' } });
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(FlipIn, { props: { text: 'Hello' } });
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(FlipIn, { props: { text: 'Hi', duration: 7 } });
    const root = container.querySelector<HTMLElement>('.jolt-flip-in');
    expect(root?.style.getPropertyValue('--jolt-duration')).toBe('7s');
  });
});
