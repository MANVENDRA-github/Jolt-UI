import { render } from '@testing-library/react';
import { Pulse } from './Pulse';

describe('Pulse (react)', () => {
  it('exposes role=status with an accessible label and two discs', () => {
    const { container } = render(<Pulse label="Loading data" />);
    const el = container.querySelector('[role="status"]');
    expect(el?.getAttribute('aria-label')).toBe('Loading data');
    expect(el?.querySelectorAll('span').length).toBe(2);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<Pulse color="#fff" size={20} speed={2} />);
    const el = container.querySelector<HTMLElement>('[role="status"]');
    expect(el?.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el?.style.getPropertyValue('--jolt-size')).toBe('20px');
    expect(el?.style.getPropertyValue('--jolt-speed')).toBe('2s');
  });
});
