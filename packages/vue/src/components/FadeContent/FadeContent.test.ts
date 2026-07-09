import { render } from '@testing-library/vue';
import FadeContent from './FadeContent.vue';

describe('FadeContent (vue)', () => {
  it('renders a <div> card wrapping its content', () => {
    const { getByText } = render(FadeContent, { slots: { default: () => 'Card body' } });
    expect(getByText('Card body').closest('.jolt-fade-content')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(FadeContent, { props: { duration: 7 } });
    const el = container.querySelector('.jolt-fade-content') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-duration')).toBe('7s');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(FadeContent);
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
    const { container } = render(FadeContent, { slots: { default: () => 'Jolt UI' } });
    const el = container.querySelector('.jolt-fade-content') as HTMLElement;
    expect(el.hasAttribute('data-jolt-armed')).toBe(true);
    vi.unstubAllGlobals();
  });

  it('leaves the content visible when nothing can observe it (jsdom has no IntersectionObserver)', () => {
    const { container } = render(FadeContent, { slots: { default: () => 'Jolt UI' } });
    const el = container.querySelector('.jolt-fade-content') as HTMLElement;
    expect(el.hasAttribute('data-jolt-armed')).toBe(false);
  });
});
