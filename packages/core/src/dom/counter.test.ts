import { counterCells } from './counter';

describe('counterCells', () => {
  it('splits a value into most-significant-first digits', () => {
    expect(counterCells(42).digits).toEqual([4, 2]);
    expect(counterCells(1990).digits).toEqual([1, 9, 9, 0]);
  });

  it('carries the number as an accessible label', () => {
    expect(counterCells(42).label).toBe('42');
  });

  it('zero-pads to at least minDigits', () => {
    expect(counterCells(7, 3)).toEqual({ label: '007', digits: [0, 0, 7] });
  });

  it('never truncates a value longer than minDigits', () => {
    expect(counterCells(12345, 2).digits).toEqual([1, 2, 3, 4, 5]);
  });

  it('floors to an integer magnitude — a roll display has no fraction or sign column', () => {
    expect(counterCells(42.9).digits).toEqual([4, 2]);
    expect(counterCells(-42).digits).toEqual([4, 2]);
  });

  it('collapses a non-finite value to zero rather than NaN columns', () => {
    expect(counterCells(Number.NaN)).toEqual({ label: '0', digits: [0] });
    expect(counterCells(Number.POSITIVE_INFINITY).digits).toEqual([0]);
  });
});
