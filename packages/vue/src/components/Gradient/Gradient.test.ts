import { render, fireEvent } from '@testing-library/vue';
import Gradient from './Gradient.vue';

describe('Gradient (vue)', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = render(Gradient, { props: { label: 'Go' } });
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Go');
  });

  it('renders slot content over the label fallback', () => {
    const { getByRole } = render(Gradient, {
      props: { label: 'fallback' },
      slots: { default: () => 'Click me' },
    });
    expect(getByRole('button').textContent).toBe('Click me');
  });

  it('forwards a click handler via attribute fallthrough', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(Gradient, { attrs: { onClick } });
    await fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = render(Gradient, { attrs: { disabled: true } });
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
