import { splitSegments } from './split';

describe('splitSegments', () => {
  it('splits into characters by default', () => {
    expect(splitSegments('Hi!', 'chars')).toEqual(['H', 'i', '!']);
  });

  it('splits into words, keeping whitespace as its own segments', () => {
    expect(splitSegments('a b', 'words')).toEqual(['a', ' ', 'b']);
  });

  it('handles multi-byte characters as single segments', () => {
    expect(splitSegments('é😀', 'chars')).toEqual(['é', '😀']);
  });

  it('returns an empty array for empty text', () => {
    expect(splitSegments('', 'chars')).toEqual([]);
  });
});
