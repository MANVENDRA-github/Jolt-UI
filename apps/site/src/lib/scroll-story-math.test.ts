import { describe, expect, it } from 'vitest';
import { activeBeat, splitProgress } from './scroll-story-math';

// The scene track = hero (first ~third) + split story (the rest). All functions
// take the whole track's scroll progress in [0, 1].
const HERO = 1 / 3;

describe('splitProgress', () => {
  it('stays 0 across the hero portion', () => {
    expect(splitProgress(0, HERO)).toBe(0);
    expect(splitProgress(HERO / 2, HERO)).toBe(0);
    expect(splitProgress(HERO, HERO)).toBe(0);
  });

  it('reaches 1 at the end of the track', () => {
    expect(splitProgress(1, HERO)).toBe(1);
  });

  it('rises monotonically across the split segment', () => {
    let prev = 0;
    for (const p of [0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
      const v = splitProgress(p, HERO);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('eases in — slower than linear near the segment start', () => {
    // A quarter into the split segment, an eased curve sits below the linear line.
    const quarter = HERO + (1 - HERO) * 0.25;
    expect(splitProgress(quarter, HERO)).toBeLessThan(0.25);
  });

  it('clamps input outside [0, 1]', () => {
    expect(splitProgress(-1, HERO)).toBe(0);
    expect(splitProgress(2, HERO)).toBe(1);
  });
});

describe('activeBeat', () => {
  it('is beat 0 before and at the start of the split segment', () => {
    expect(activeBeat(0, HERO)).toBe(0);
    expect(activeBeat(HERO, HERO)).toBe(0);
  });

  it('walks through beats 0 → 1 → 2 across the segment thirds', () => {
    const seg = (f: number) => HERO + (1 - HERO) * f;
    expect(activeBeat(seg(0.15), HERO)).toBe(0);
    expect(activeBeat(seg(0.5), HERO)).toBe(1);
    expect(activeBeat(seg(0.85), HERO)).toBe(2);
  });

  it('stays beat 2 past the end', () => {
    expect(activeBeat(1, HERO)).toBe(2);
    expect(activeBeat(5, HERO)).toBe(2);
  });
});
