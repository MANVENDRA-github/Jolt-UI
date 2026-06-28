import { render } from '@testing-library/svelte';
import Spinner from './Spinner.svelte';

describe('Spinner (svelte)', () => {
  it('exposes role=status with an accessible label', () => {
    const { container } = render(Spinner, { props: { label: 'Loading data' } });
    expect(container.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe(
      'Loading data',
    );
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Spinner, { props: { color: '#fff', size: 60, speed: 1.5 } });
    const el = container.querySelector<HTMLElement>('[role="status"]');
    expect(el?.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el?.style.getPropertyValue('--jolt-size')).toBe('60px');
    expect(el?.style.getPropertyValue('--jolt-speed')).toBe('1.5s');
  });
});
