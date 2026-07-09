import { render } from '@testing-library/svelte';
import AnimatedContent from './AnimatedContent.svelte';

describe('AnimatedContent (svelte)', () => {
  it('renders a <div> card wrapping its content', () => {
    const { container } = render(AnimatedContent);
    const el = container.querySelector('.jolt-animated-content') as HTMLElement;
    expect(el.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(AnimatedContent, { props: { distance: 7 } });
    const el = container.querySelector('.jolt-animated-content') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-distance')).toBe('7px');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(AnimatedContent);
    expect(() => unmount()).not.toThrow();
  });

  it('arms the reveal on mount when the browser can observe it', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    const { container } = render(AnimatedContent);
    const el = container.querySelector('.jolt-animated-content') as HTMLElement;
    expect(el.hasAttribute('data-jolt-armed')).toBe(true);
    vi.unstubAllGlobals();
  });

  it('leaves the content visible when nothing can observe it (jsdom has no IntersectionObserver)', () => {
    const { container } = render(AnimatedContent);
    const el = container.querySelector('.jolt-animated-content') as HTMLElement;
    expect(el.hasAttribute('data-jolt-armed')).toBe(false);
  });
});
