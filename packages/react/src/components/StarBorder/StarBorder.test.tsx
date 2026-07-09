import { render, fireEvent } from '@testing-library/react';
import { StarBorder } from './StarBorder';

describe('StarBorder (react)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(<StarBorder label="Go" />);
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent?.trim()).toBe('Go');
  });

  it('renders children over the label fallback', () => {
    const { getByRole } = render(<StarBorder label="fallback">Click me</StarBorder>);
    expect(getByRole('button').textContent?.trim()).toBe('Click me');
  });

  it('forwards a click handler', () => {
    const onClick = vi.fn();
    const { getByRole } = render(<StarBorder onClick={onClick}>Go</StarBorder>);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(<StarBorder disabled>Go</StarBorder>);
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(<StarBorder color="#14141c" />);
    expect(getByRole('button').style.getPropertyValue('--jolt-color')).toBe('#14141c');
  });
});
