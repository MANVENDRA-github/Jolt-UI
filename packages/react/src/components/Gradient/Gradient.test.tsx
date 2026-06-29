import { render, fireEvent } from '@testing-library/react';
import { Gradient } from './Gradient';

describe('Gradient (react)', () => {
  it('renders a <button>; the label prop is the fallback text; type defaults to button', () => {
    const { getByRole } = render(<Gradient label="Go" />);
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Go');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('renders children over the label fallback', () => {
    const { getByRole } = render(<Gradient label="fallback">Click me</Gradient>);
    expect(getByRole('button').textContent).toBe('Click me');
  });

  it('forwards a click handler', () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Gradient onClick={onClick}>Go</Gradient>);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(<Gradient disabled>Go</Gradient>);
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('builds the gradient + speed CSS custom properties from props', () => {
    const { getByRole } = render(<Gradient colors={['#111', '#222']} speed={7} />);
    const btn = getByRole('button');
    expect(btn.style.getPropertyValue('--jolt-gradient')).toContain('#111');
    expect(btn.style.getPropertyValue('--jolt-gradient')).toContain('#222');
    expect(btn.style.getPropertyValue('--jolt-speed')).toBe('7s');
  });
});
