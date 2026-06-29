import { render, fireEvent } from '@testing-library/vue';
import Sweep from './Sweep.vue';

describe('Sweep (vue)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(Sweep, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Go');
  });

  it('renders slot content over the label fallback', () => {
    const { getByRole } = render(Sweep, {
      props: { label: 'fallback' },
      slots: { default: () => 'Click me' },
    });
    expect(getByRole('button').textContent).toBe('Click me');
  });

  it('forwards a click handler via attribute fallthrough', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(Sweep, { attrs: { onClick } });
    await fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(Sweep, { attrs: { disabled: true } });
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = render(Sweep, { props: { color: '#fff', speed: 5 } });
    const btn = getByRole('button');
    expect(btn.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(btn.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });
});
