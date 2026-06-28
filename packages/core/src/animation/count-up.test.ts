import { createCountUp, formatNumber } from './count-up';

function makeEl(): HTMLElement {
  const el = document.createElement('span');
  document.body.appendChild(el);
  return el;
}

describe('formatNumber', () => {
  it('groups thousands and respects decimals', () => {
    expect(formatNumber(1234.5, { decimals: 1, separator: ',' })).toBe('1,234.5');
    expect(formatNumber(1000000, { decimals: 0, separator: ',' })).toBe('1,000,000');
    expect(formatNumber(42, { decimals: 0, separator: '' })).toBe('42');
    expect(formatNumber(7, { decimals: 2, separator: '' })).toBe('7.00');
  });
});

describe('createCountUp', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('renders the final value under reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    const el = makeEl();
    createCountUp(el, { to: 1000, separator: ',' });
    expect(el.textContent).toBe('1,000');
  });

  it('shows the target after revert (no leaked tween)', () => {
    const el = makeEl();
    const controller = createCountUp(el, { to: 100, from: 0 });
    controller.revert();
    expect(el.textContent).toBe('100');
  });

  it('returns a controller', () => {
    const el = makeEl();
    const controller = createCountUp(el, { to: 5 });
    expect(typeof controller.play).toBe('function');
    expect(() => controller.revert()).not.toThrow();
  });
});
