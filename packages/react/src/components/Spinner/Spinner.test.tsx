import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner (react)', () => {
  it('exposes role=status with an accessible label', () => {
    const { container } = render(<Spinner label="Loading data" />);
    const el = container.querySelector('[role="status"]');
    expect(el?.getAttribute('aria-label')).toBe('Loading data');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<Spinner color="#fff" size={60} speed={1.5} />);
    const el = container.querySelector<HTMLElement>('[role="status"]');
    expect(el?.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el?.style.getPropertyValue('--jolt-size')).toBe('60px');
    expect(el?.style.getPropertyValue('--jolt-speed')).toBe('1.5s');
  });
});
