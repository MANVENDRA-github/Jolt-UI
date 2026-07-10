import { trackDock, DOCK_ITEM_SELECTOR } from './dock';

/** A dock element with `n` items, each stubbed with a fixed 40px-wide rect at a known x. */
function mountDock(n: number): { el: HTMLElement; items: HTMLElement[] } {
  const el = document.createElement('div');
  const items: HTMLElement[] = [];
  for (let i = 0; i < n; i++) {
    const item = document.createElement('span');
    item.setAttribute('data-jolt-dock-item', '');
    const left = i * 40;
    // jsdom has no layout, so stub the rect the shell reads.
    item.getBoundingClientRect = () =>
      ({
        left,
        top: 0,
        width: 40,
        height: 40,
        right: left + 40,
        bottom: 40,
        x: left,
        y: 0,
      }) as DOMRect;
    el.appendChild(item);
    items.push(item);
  }
  document.body.appendChild(el);
  return { el, items };
}

const scaleOf = (item: HTMLElement) => Number(item.style.getPropertyValue('--jolt-scale'));

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('trackDock', () => {
  it('writes a rest scale of 1 to every item on mount', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const { items } = mountDock(3);
    trackDock(items[0].parentElement as HTMLElement);
    expect(items.every((i) => scaleOf(i) === 1)).toBe(true);
  });

  it('magnifies the item nearest the pointer most', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const { el, items } = mountDock(3);
    trackDock(el, { range: 120, maxScale: 2 });
    // Pointer over the center of item 0 (center x = 20).
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 20 }) as PointerEvent);
    expect(scaleOf(items[0])).toBeGreaterThan(scaleOf(items[1]));
    expect(scaleOf(items[1])).toBeGreaterThan(scaleOf(items[2]));
    expect(scaleOf(items[0])).toBeCloseTo(2, 6);
  });

  it('returns every item to rest scale on pointerleave', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const { el, items } = mountDock(3);
    trackDock(el);
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 20 }) as PointerEvent);
    el.dispatchEvent(new MouseEvent('pointerleave', {}) as PointerEvent);
    expect(items.every((i) => scaleOf(i) === 1)).toBe(true);
  });

  it('attaches no listeners under reduced motion (items stay at rest)', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const { el, items } = mountDock(3);
    trackDock(el);
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 20 }) as PointerEvent);
    expect(items.every((i) => scaleOf(i) === 1)).toBe(true);
  });

  it('revert() detaches the listeners — a later move does not magnify', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const { el, items } = mountDock(3);
    trackDock(el).revert();
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 20 }) as PointerEvent);
    expect(items.every((i) => scaleOf(i) === 1)).toBe(true);
  });

  it('exposes the item selector the skins mark their items with', () => {
    expect(DOCK_ITEM_SELECTOR).toBe('[data-jolt-dock-item]');
  });
});
