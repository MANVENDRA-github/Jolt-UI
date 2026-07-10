import { magnetOffset, pointerFraction, tiltRotation } from './pointer-math';

const RECT = { left: 100, top: 50, width: 200, height: 100 };

describe('pointerFraction', () => {
  it('maps the rect center to {0.5, 0.5}', () => {
    expect(pointerFraction(200, 100, RECT)).toEqual({ x: 0.5, y: 0.5 });
  });

  it('maps the top-left corner to {0, 0} and bottom-right to {1, 1}', () => {
    expect(pointerFraction(100, 50, RECT)).toEqual({ x: 0, y: 0 });
    expect(pointerFraction(300, 150, RECT)).toEqual({ x: 1, y: 1 });
  });

  it('clamps positions outside the rect to [0, 1]', () => {
    expect(pointerFraction(0, 0, RECT)).toEqual({ x: 0, y: 0 });
    expect(pointerFraction(9999, 9999, RECT)).toEqual({ x: 1, y: 1 });
  });

  it('does not divide by zero for a zero-sized rect', () => {
    const f = pointerFraction(10, 10, { left: 0, top: 0, width: 0, height: 0 });
    expect(Number.isNaN(f.x)).toBe(false);
    expect(Number.isNaN(f.y)).toBe(false);
  });
});

describe('tiltRotation', () => {
  it('is flat at the center', () => {
    expect(tiltRotation({ x: 0.5, y: 0.5 }, 12)).toEqual({ rotateX: 0, rotateY: 0 });
  });

  it('reaches ±max at the corners', () => {
    expect(tiltRotation({ x: 0, y: 0 }, 12)).toEqual({ rotateX: 12, rotateY: -12 });
    expect(tiltRotation({ x: 1, y: 1 }, 12)).toEqual({ rotateX: -12, rotateY: 12 });
  });

  it('inverts rotateX relative to the y axis (pointer lower → rotateX lower)', () => {
    const top = tiltRotation({ x: 0.5, y: 0.2 }, 12);
    const bottom = tiltRotation({ x: 0.5, y: 0.8 }, 12);
    expect(top.rotateX).toBeGreaterThan(bottom.rotateX);
  });

  it('respects the max cap', () => {
    const { rotateX, rotateY } = tiltRotation({ x: 0, y: 1 }, 5);
    expect(Math.abs(rotateX)).toBeLessThanOrEqual(5);
    expect(Math.abs(rotateY)).toBeLessThanOrEqual(5);
  });
});

describe('magnetOffset', () => {
  it('is at rest in the center', () => {
    expect(magnetOffset({ x: 0.5, y: 0.5 })).toEqual({ x: 0, y: 0 });
  });

  it('pulls toward the pointer: right of center is a positive x offset', () => {
    expect(magnetOffset({ x: 1, y: 0.5 })).toEqual({ x: 1, y: 0 });
    expect(magnetOffset({ x: 0, y: 0.5 })).toEqual({ x: -1, y: 0 });
  });

  it('pulls down toward a pointer below center (screen y grows downward)', () => {
    expect(magnetOffset({ x: 0.5, y: 1 })).toEqual({ x: 0, y: 1 });
  });

  it('returns a signed fraction in [-1, 1], not a pixel distance', () => {
    const { x, y } = magnetOffset({ x: 0.75, y: 0.25 });
    expect(x).toBeCloseTo(0.5, 10);
    expect(y).toBeCloseTo(-0.5, 10);
  });
});
