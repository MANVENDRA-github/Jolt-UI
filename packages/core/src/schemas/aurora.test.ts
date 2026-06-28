import { describe, it, expect } from 'vitest';
import { auroraSchema, auroraMeta } from './aurora';

describe('auroraSchema', () => {
  it('applies sensible defaults (no required props)', () => {
    const opts = auroraSchema.parse({});
    expect(opts).toEqual({
      colors: ['#5eead4', '#6d5efc', '#22d3ee'],
      speed: 0.3,
      intensity: 1,
      scale: 1,
      opacity: 0.85,
    });
  });

  it('rejects an empty colors array', () => {
    expect(() => auroraSchema.parse({ colors: [] })).toThrow();
  });

  it('rejects an out-of-range opacity', () => {
    expect(() => auroraSchema.parse({ opacity: 1.5 })).toThrow();
  });

  it('rejects a non-positive scale', () => {
    expect(() => auroraSchema.parse({ scale: 0 })).toThrow();
  });
});

describe('auroraMeta', () => {
  it('declares the background category and three as its only dep', () => {
    expect(auroraMeta.category).toBe('background');
    expect(auroraMeta.deps).toEqual(['three']);
  });
});
