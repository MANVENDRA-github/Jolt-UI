import { render } from '@testing-library/svelte';
import RotatingWords from './RotatingWords.svelte';

describe('RotatingWords (svelte)', () => {
  it('exposes all words via aria-label', () => {
    const { container } = render(RotatingWords, { props: { words: ['one', 'two', 'three'] } });
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe(
      'one two three',
    );
  });

  it('renders one aria-hidden segment per word', () => {
    const { container } = render(RotatingWords, { props: { words: ['one', 'two', 'three'] } });
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(3);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('maps word count + interval to CSS custom properties', () => {
    const { container } = render(RotatingWords, {
      props: { words: ['one', 'two', 'three'], interval: 5 },
    });
    const root = container.querySelector<HTMLElement>('.jolt-rotating-words');
    expect(root?.style.getPropertyValue('--jolt-count')).toBe('3');
    expect(root?.style.getPropertyValue('--jolt-interval')).toBe('5s');
  });
});
