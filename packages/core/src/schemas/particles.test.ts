import { describe, it, expect } from 'vitest';
import { particlesSchema, particlesMeta } from './particles';

describe('particlesSchema', () => {
  it('applies sensible defaults (no required props)', () => {
    const opts = particlesSchema.parse({});
    expect(opts).toEqual({
      count: 800,
      color: '#6d5efc',
      size: 2,
      speed: 0.4,
      spread: 12,
      opacity: 0.8,
    });
  });

  it('rejects a non-positive count', () => {
    expect(() => particlesSchema.parse({ count: 0 })).toThrow();
  });

  it('rejects an out-of-range opacity', () => {
    expect(() => particlesSchema.parse({ opacity: 1.5 })).toThrow();
  });
});

describe('particlesMeta', () => {
  it('declares the background category and three as its only dep', () => {
    expect(particlesMeta.category).toBe('background');
    expect(particlesMeta.deps).toEqual(['three']);
  });
});
