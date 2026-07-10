import { render } from '@testing-library/svelte';
import Dock from './Dock.svelte';

describe('Dock (svelte)', () => {
  it('renders one magnifiable item per label, each with an accessible name', () => {
    const { container } = render(Dock, { props: { items: ['Home', 'Search', 'Files'] } });
    const items = container.querySelectorAll('[data-jolt-dock-item]');
    expect(items.length).toBe(3);
    expect(items[0].getAttribute('aria-label')).toBe('Home');
  });

  it('is a list, so assistive tech announces the item count', () => {
    const { container } = render(Dock, { props: { items: ['Home', 'Search', 'Files'] } });
    expect(container.querySelector('.jolt-dock')?.getAttribute('role')).toBe('list');
    expect(container.querySelectorAll('[role="listitem"]').length).toBe(3);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Dock, { props: { size: 60, color: '#fff' } });
    const el = container.querySelector('.jolt-dock') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-size')).toBe('60px');
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(Dock);
    expect(() => unmount()).not.toThrow();
  });
});
