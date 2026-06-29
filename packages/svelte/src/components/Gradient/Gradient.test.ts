import { render, fireEvent } from '@testing-library/svelte';
import Gradient from './Gradient.svelte';

describe('Gradient (svelte)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(Gradient, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent?.trim()).toBe('Go');
  });

  it('forwards a click handler', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(Gradient, { props: { onclick } });
    await fireEvent.click(getByRole('button'));
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(Gradient, { props: { disabled: true } });
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('builds the gradient + speed CSS custom properties from props', () => {
    const { getByRole } = render(Gradient, { props: { colors: ['#111', '#222'], speed: 7 } });
    const btn = getByRole('button');
    expect(btn.style.getPropertyValue('--jolt-gradient')).toContain('#111');
    expect(btn.style.getPropertyValue('--jolt-gradient')).toContain('#222');
    expect(btn.style.getPropertyValue('--jolt-speed')).toBe('7s');
  });
});
