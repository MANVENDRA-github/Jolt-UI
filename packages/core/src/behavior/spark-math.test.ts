import { sparkRays } from './spark-math';

describe('sparkRays', () => {
  it('returns one unit vector per ray, evenly spaced around the circle', () => {
    const rays = sparkRays(4);
    expect(rays.length).toBe(4);
    for (const { dx, dy } of rays) {
      expect(Math.hypot(dx, dy)).toBeCloseTo(1, 10);
    }
  });

  it('starts at 3 o’clock and walks clockwise in screen coordinates', () => {
    const [east, south, west, north] = sparkRays(4);
    expect(east.dx).toBeCloseTo(1, 10);
    expect(east.dy).toBeCloseTo(0, 10);
    // y grows downward on screen, so a quarter turn from east is south.
    expect(south.dx).toBeCloseTo(0, 10);
    expect(south.dy).toBeCloseTo(1, 10);
    expect(west.dx).toBeCloseTo(-1, 10);
    expect(north.dy).toBeCloseTo(-1, 10);
  });

  it('spaces the rays at 2π / count radians', () => {
    const rays = sparkRays(8);
    const angle = (r: { dx: number; dy: number }) => Math.atan2(r.dy, r.dx);
    const step = angle(rays[1]) - angle(rays[0]);
    expect(step).toBeCloseTo((2 * Math.PI) / 8, 10);
  });

  it('returns nothing for a non-positive count rather than throwing', () => {
    expect(sparkRays(0)).toEqual([]);
    expect(sparkRays(-3)).toEqual([]);
  });
});
