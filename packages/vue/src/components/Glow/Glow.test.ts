import { render, fireEvent } from '@testing-library/vue';
import Glow from './Glow.vue';

describe('Glow (vue)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(Glow, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Go');
  });

  it('renders slot content over the label fallback', () => {
    const { getByRole } = render(Glow, {
      props: { label: 'fallback' },
      slots: { default: () => 'Click me' },
    });
    expect(getByRole('button').textContent).toBe('Click me');
  });

  it('forwards a click handler via attribute fallthrough', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(Glow, { attrs: { onClick } });
    await fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(Glow, { attrs: { disabled: true } });
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(Glow, { props: { color: '#fff', speed: 5 } });
    const btn = getByRole('button');
    expect(btn.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(btn.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });
});
