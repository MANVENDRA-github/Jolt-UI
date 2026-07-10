import { attachClickSpark, SPARK_BURST_CLASS } from './spark';

const mount = (): HTMLElement => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
};

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

const burstsIn = (el: HTMLElement) => el.querySelectorAll(`.${SPARK_BURST_CLASS}`);

describe('attachClickSpark', () => {
  it('emits one burst of `count` rays on click', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const el = mount();

    attachClickSpark(el, { count: 6 });
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const bursts = burstsIn(el);
    expect(bursts.length).toBe(1);
    expect(bursts[0].children.length).toBe(6);
  });

  it('gives each ray its own unit direction as CSS custom properties', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const el = mount();

    attachClickSpark(el, { count: 4 });
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const rays = [...burstsIn(el)[0].children] as HTMLElement[];
    const dirs = rays.map((r) => [
      Number(r.style.getPropertyValue('--jolt-dx')),
      Number(r.style.getPropertyValue('--jolt-dy')),
    ]);
    for (const [dx, dy] of dirs) expect(Math.hypot(dx, dy)).toBeCloseTo(1, 6);
    expect(new Set(dirs.map(String)).size).toBe(4);
  });

  it('hides the burst from assistive tech — it is pure decoration', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const el = mount();

    attachClickSpark(el);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(burstsIn(el)[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('removes the burst once its animation ends, leaving no DOM behind', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const el = mount();

    attachClickSpark(el);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const burst = burstsIn(el)[0];
    burst.dispatchEvent(new Event('animationend', { bubbles: true }));

    expect(burstsIn(el).length).toBe(0);
  });

  it('never adds text, so a container parity check still reads only the children', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const el = mount();
    el.textContent = 'Jolt UI';

    attachClickSpark(el);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(el.textContent).toBe('Jolt UI');
  });

  it('attaches no listener under reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const el = mount();

    attachClickSpark(el);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(burstsIn(el).length).toBe(0);
  });

  it('revert() stops emitting bursts and clears any in flight', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const el = mount();

    const controller = attachClickSpark(el);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(burstsIn(el).length).toBe(1);

    controller.revert();
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(burstsIn(el).length).toBe(0);
  });
});
