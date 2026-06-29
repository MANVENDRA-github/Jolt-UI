import { render, fireEvent } from '@testing-library/svelte';
import Sweep from './Sweep.svelte';

describe('Sweep (svelte)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(Sweep, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent?.trim()).toBe('Go');
  });

  it('forwards a click handler', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(Sweep, { props: { onclick } });
    await fireEvent.click(getByRole('button'));
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(Sweep, { props: { disabled: true } });
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(Sweep, { props: { color: '#fff', speed: 5 } });
    const btn = getByRole('button');
    expect(btn.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(btn.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });
});
