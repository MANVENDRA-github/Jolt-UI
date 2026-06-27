import { splitTextSchema } from './split-text';

describe('splitTextSchema', () => {
  it('applies defaults when only text is given', () => {
    expect(splitTextSchema.parse({ text: 'hello' })).toEqual({
      text: 'hello',
      by: 'chars',
      stagger: 0.03,
      duration: 0.6,
      delay: 0,
      y: 20,
    });
  });

  it('keeps provided values', () => {
    const r = splitTextSchema.parse({ text: 'x', by: 'words', stagger: 0.1 });
    expect(r.by).toBe('words');
    expect(r.stagger).toBe(0.1);
  });

  it('rejects a non-positive duration', () => {
    expect(() => splitTextSchema.parse({ text: 'x', duration: 0 })).toThrow();
  });

  it('rejects an unknown split mode', () => {
    expect(() => splitTextSchema.parse({ text: 'x', by: 'lines' })).toThrow();
  });
});
