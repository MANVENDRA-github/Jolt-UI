import { render } from '@testing-library/svelte';
import ClickSpark from './ClickSpark.svelte';

describe('ClickSpark (svelte)', () => {
  it('renders a <div> card wrapping its content', () => {
    const { container } = render(ClickSpark);
    const el = container.querySelector('.jolt-click-spark') as HTMLElement;
    expect(el.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(ClickSpark, { props: { color: '#c6ff4f' } });
    const el = container.querySelector('.jolt-click-spark') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#c6ff4f');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(ClickSpark);
    expect(() => unmount()).not.toThrow();
  });

  it('throws a burst of aria-hidden rays on click', () => {
    const { container } = render(ClickSpark);
    const el = container.querySelector('.jolt-click-spark') as HTMLElement;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const burst = el.querySelector('.jolt-spark-burst') as HTMLElement;
    expect(burst).toBeTruthy();
    expect(burst.getAttribute('aria-hidden')).toBe('true');
    expect(burst.children.length).toBeGreaterThan(0);
  });
});
