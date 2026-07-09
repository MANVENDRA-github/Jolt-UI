import { render, fireEvent } from '@testing-library/svelte';
import StarBorder from './StarBorder.svelte';

describe('StarBorder (svelte)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(StarBorder, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent?.trim()).toBe('Go');
  });

  it('forwards a click handler', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(StarBorder, { props: { onclick } });
    await fireEvent.click(getByRole('button'));
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(StarBorder, { props: { disabled: true } });
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(StarBorder, { props: { color: '#14141c' } });
    expect(getByRole('button').style.getPropertyValue('--jolt-color')).toBe('#14141c');
  });
});
