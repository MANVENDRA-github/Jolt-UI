import { render, fireEvent } from '@testing-library/react';
import { Glow } from './Glow';

describe('Glow (react)', () => {
  it('renders a <button>; the label prop is the fallback text; type defaults to button', () => {
    const { getByRole } = render(<Glow label="Go" />);
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Go');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('renders children over the label fallback', () => {
    const { getByRole } = render(<Glow label="fallback">Click me</Glow>);
    expect(getByRole('button').textContent).toBe('Click me');
  });

  it('forwards a click handler', () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Glow onClick={onClick}>Go</Glow>);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(<Glow disabled>Go</Glow>);
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(<Glow color="#fff" speed={5} />);
    const btn = getByRole('button');
    expect(btn.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(btn.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });
});
