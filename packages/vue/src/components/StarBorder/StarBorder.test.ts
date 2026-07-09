import { render, fireEvent } from '@testing-library/vue';
import StarBorder from './StarBorder.vue';

describe('StarBorder (vue)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(StarBorder, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent?.trim()).toBe('Go');
  });

  it('renders children over the label fallback', () => {
    const { getByRole } = render(StarBorder, {
      props: { label: 'fallback' },
      slots: { default: () => 'Click me' },
    });
    expect(getByRole('button').textContent?.trim()).toBe('Click me');
  });

  it('forwards a click handler', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(StarBorder, { attrs: { onClick } });
    await fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(StarBorder, { attrs: { disabled: true } });
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(StarBorder, { props: { color: '#14141c' } });
    expect(getByRole('button').style.getPropertyValue('--jolt-color')).toBe('#14141c');
  });
});
