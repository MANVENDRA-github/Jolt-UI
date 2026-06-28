import { render } from '@testing-library/svelte';
import DotBounce from './DotBounce.svelte';

describe('DotBounce (svelte)', () => {
  it('exposes role=status with an accessible label and three dots', () => {
    const { container } = render(DotBounce, { props: { label: 'Loading data' } });
    const el = container.querySelector('[role="status"]');
    expect(el?.getAttribute('aria-label')).toBe('Loading data');
    expect(el?.querySelectorAll('span').length).toBe(3);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(DotBounce, { props: { color: '#fff', size: 20, speed: 2 } });
    const el = container.querySelector<HTMLElement>('[role="status"]');
    expect(el?.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el?.style.getPropertyValue('--jolt-size')).toBe('20px');
    expect(el?.style.getPropertyValue('--jolt-speed')).toBe('2s');
  });
});
