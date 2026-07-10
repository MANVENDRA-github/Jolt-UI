import { revealRootMargin, shouldArmReveal } from './reveal-math';

describe('shouldArmReveal', () => {
  it('arms only when there is a window, an IntersectionObserver, and motion is allowed', () => {
    expect(shouldArmReveal({ hasWindow: true, hasObserver: true, reducedMotion: false })).toBe(
      true,
    );
  });

  it('never arms under reduced motion — the content must simply be visible', () => {
    expect(shouldArmReveal({ hasWindow: true, hasObserver: true, reducedMotion: true })).toBe(
      false,
    );
  });

  it('never arms without an IntersectionObserver (nothing would ever un-hide it)', () => {
    expect(shouldArmReveal({ hasWindow: true, hasObserver: false, reducedMotion: false })).toBe(
      false,
    );
  });

  it('never arms during SSR', () => {
    expect(shouldArmReveal({ hasWindow: false, hasObserver: true, reducedMotion: false })).toBe(
      false,
    );
  });
});

describe('revealRootMargin', () => {
  it('pulls the trigger line up from the viewport bottom by the given percentage', () => {
    expect(revealRootMargin(12)).toBe('0px 0px -12% 0px');
  });

  it('treats 0 as "the moment any pixel enters the viewport"', () => {
    expect(revealRootMargin(0)).toBe('0px 0px 0% 0px');
  });

  it('clamps a nonsensical offset into 0..99 so the margin can never hide the viewport', () => {
    expect(revealRootMargin(-5)).toBe('0px 0px 0% 0px');
    expect(revealRootMargin(150)).toBe('0px 0px -99% 0px');
  });
});
