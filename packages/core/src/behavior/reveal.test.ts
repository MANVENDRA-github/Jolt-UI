import { observeReveal } from './reveal';

/** A minimal IntersectionObserver double: capture the callback, fire it on demand. */
function stubObserver() {
  const state = {
    observed: [] as Element[],
    unobserved: [] as Element[],
    disconnected: 0,
    fire: (_el: Element) => {},
    options: undefined as IntersectionObserverInit | undefined,
  };
  class IO {
    constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      state.options = options;
      state.fire = (el) =>
        cb([{ target: el, isIntersecting: true } as IntersectionObserverEntry], this as never);
    }
    observe(el: Element) {
      state.observed.push(el);
    }
    unobserve(el: Element) {
      state.unobserved.push(el);
    }
    disconnect() {
      state.disconnected++;
    }
  }
  vi.stubGlobal('IntersectionObserver', IO);
  return state;
}

const el = () => document.createElement('div');

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('observeReveal', () => {
  it('arms the element (hiding it) and observes it when motion is allowed', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const io = stubObserver();
    const node = el();

    observeReveal(node);

    expect(node.hasAttribute('data-jolt-armed')).toBe(true);
    expect(io.observed).toEqual([node]);
  });

  it('disarms and stops observing once the element intersects', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const io = stubObserver();
    const node = el();

    observeReveal(node);
    io.fire(node);

    expect(node.hasAttribute('data-jolt-armed')).toBe(false);
    expect(io.unobserved).toEqual([node]);
  });

  it('under reduced motion it never arms and never observes — content stays visible', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const io = stubObserver();
    const node = el();

    observeReveal(node);

    expect(node.hasAttribute('data-jolt-armed')).toBe(false);
    expect(io.observed).toEqual([]);
  });

  it('without an IntersectionObserver it never arms — nothing would un-hide it', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('IntersectionObserver', undefined);
    const node = el();

    observeReveal(node);

    expect(node.hasAttribute('data-jolt-armed')).toBe(false);
  });

  it('revert() disconnects the observer and disarms a still-hidden element', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const io = stubObserver();
    const node = el();

    observeReveal(node).revert();

    expect(io.disconnected).toBe(1);
    expect(node.hasAttribute('data-jolt-armed')).toBe(false);
  });

  it('passes the offset through as a bottom rootMargin', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const io = stubObserver();

    observeReveal(el(), { offset: 20 });

    expect(io.options?.rootMargin).toBe('0px 0px -20% 0px');
  });
});
