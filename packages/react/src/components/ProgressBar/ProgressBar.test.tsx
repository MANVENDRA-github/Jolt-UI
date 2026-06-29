import { render } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar (react)', () => {
  it('exposes role=status with an accessible label and one fill bar', () => {
    const { container } = render(<ProgressBar label="Loading data" />);
    const el = container.querySelector('[role="status"]');
    expect(el?.getAttribute('aria-label')).toBe('Loading data');
    expect(el?.querySelectorAll('span').length).toBe(1);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<ProgressBar color="#fff" width={120} thickness={6} speed={2} />);
    const el = container.querySelector<HTMLElement>('[role="status"]');
    expect(el?.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el?.style.getPropertyValue('--jolt-width')).toBe('120px');
    expect(el?.style.getPropertyValue('--jolt-thickness')).toBe('6px');
    expect(el?.style.getPropertyValue('--jolt-speed')).toBe('2s');
  });
});
