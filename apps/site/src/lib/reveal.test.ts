import { describe, expect, it } from 'vitest';
import { isBelowFold, shouldEnhance } from './reveal';

describe('isBelowFold', () => {
  it('is true when the element top sits past the viewport bottom', () => {
    expect(isBelowFold(900, 800)).toBe(true);
  });

  it('is false when the element is within the first viewport', () => {
    expect(isBelowFold(100, 800)).toBe(false);
    expect(isBelowFold(0, 800)).toBe(false);
  });

  it('treats an element exactly at the fold as in-view (already visible)', () => {
    expect(isBelowFold(800, 800)).toBe(false);
  });
});

describe('shouldEnhance', () => {
  it('enhances only with motion allowed AND IntersectionObserver present', () => {
    expect(shouldEnhance(false, true)).toBe(true);
  });

  it('bails under reduced motion regardless of IO support', () => {
    expect(shouldEnhance(true, true)).toBe(false);
  });

  it('bails when IntersectionObserver is unavailable', () => {
    expect(shouldEnhance(false, false)).toBe(false);
  });
});
