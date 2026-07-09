import { render } from '@testing-library/vue';
import Glare from './Glare.vue';

describe('Glare (vue)', () => {
  it('renders a <div> card wrapping its content', () => {
    const { getByText } = render(Glare, { slots: { default: () => 'Card body' } });
    expect(getByText('Card body').closest('.jolt-glare')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Glare, { props: { color: '#ffffff' } });
    const el = container.querySelector('.jolt-glare') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#ffffff');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(Glare);
    expect(() => unmount()).not.toThrow();
  });

  it('tracks the pointer: the resting centre state is written on mount', () => {
    const { container } = render(Glare);
    const el = container.querySelector('.jolt-glare') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-x')).toBe('50%');
    expect(el.style.getPropertyValue('--jolt-y')).toBe('50%');
  });
});
