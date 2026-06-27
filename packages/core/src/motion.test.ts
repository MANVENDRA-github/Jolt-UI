import { prefersReducedMotion } from './motion';

describe('prefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('reflects the media query when reduce is requested', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when reduce is not requested', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query }));
    expect(prefersReducedMotion()).toBe(false);
  });
});
