import { describe, it, expect } from 'vitest';
import { hexToRgb, packColorStops } from './aurora-field';

describe('hexToRgb', () => {
  it('parses #rrggbb', () => {
    expect(hexToRgb('#ffffff')).toEqual([1, 1, 1]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#ff0000')).toEqual([1, 0, 0]);
  });

  it('parses 3-digit shorthand and is #-optional', () => {
    expect(hexToRgb('#0f0')).toEqual([0, 1, 0]);
    expect(hexToRgb('00f')).toEqual([0, 0, 1]);
  });

  it('falls back to white on malformed input', () => {
    expect(hexToRgb('not-a-color')).toEqual([1, 1, 1]);
    expect(hexToRgb('#12')).toEqual([1, 1, 1]);
  });
});

describe('packColorStops', () => {
  it('returns count*3 floats', () => {
    expect(packColorStops(['#ff0000', '#00ff00', '#0000ff'], 3).length).toBe(9);
  });

  it('maps each stop to its rgb', () => {
    const p = packColorStops(['#ff0000', '#00ff00', '#0000ff'], 3);
    expect(Array.from(p)).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  it('pads by repeating the last stop when fewer than count', () => {
    const p = packColorStops(['#ff0000'], 3);
    expect(Array.from(p)).toEqual([1, 0, 0, 1, 0, 0, 1, 0, 0]);
  });

  it('truncates to the first `count` stops when more', () => {
    const p = packColorStops(['#ff0000', '#00ff00', '#0000ff', '#ffffff'], 3);
    expect(Array.from(p)).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  it('falls back to white for an empty list', () => {
    expect(Array.from(packColorStops([], 2))).toEqual([1, 1, 1, 1, 1, 1]);
  });
});
