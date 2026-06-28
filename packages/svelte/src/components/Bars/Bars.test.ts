import { render } from '@testing-library/svelte';
import Bars from './Bars.svelte';

describe('Bars (svelte)', () => {
  it('exposes role=status with an accessible label and five bars', () => {
    const { container } = render(Bars, { props: { label: 'Loading data' } });
    const el = container.querySelector('[role="status"]');
    expect(el?.getAttribute('aria-label')).toBe('Loading data');
    expect(el?.querySelectorAll('span').length).toBe(5);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Bars, { props: { color: '#fff', size: 48, speed: 2 } });
    const el = container.querySelector<HTMLElement>('[role="status"]');
    expect(el?.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el?.style.getPropertyValue('--jolt-size')).toBe('48px');
    expect(el?.style.getPropertyValue('--jolt-speed')).toBe('2s');
  });
});
