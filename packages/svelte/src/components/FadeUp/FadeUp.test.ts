import { render } from '@testing-library/svelte';
import { splitSegments } from '@jolt/core';
import FadeUp from './FadeUp.svelte';

describe('FadeUp (svelte)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(FadeUp, { props: { text: 'Hello' } });
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(FadeUp, { props: { text: 'Hello' } });
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(FadeUp, { props: { text: 'Hi', distance: 7 } });
    const root = container.querySelector<HTMLElement>('.jolt-fade-up');
    expect(root?.style.getPropertyValue('--jolt-distance')).toBe('7em');
  });
});
