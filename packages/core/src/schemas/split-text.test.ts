import { splitTextSchema } from './split-text';
import { propsTable } from '../props-table';

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

describe('splitTextPropsTable', () => {
  it('covers exactly the schema fields (no drift)', () => {
    const names = propsTable(splitTextSchema).map((p) => p.name);
    expect(names).toEqual(Object.keys(splitTextSchema.shape));
  });

  it('derives type, default, and description from the schema', () => {
    const table = propsTable(splitTextSchema);
    const by = table.find((p) => p.name === 'by');
    expect(by).toEqual({
      name: 'by',
      type: "'chars' | 'words'",
      default: '"chars"',
      description: 'Split granularity.',
    });
    const text = table.find((p) => p.name === 'text');
    expect(text?.type).toBe('string');
    expect(text?.default).toBeNull(); // required prop
  });
});
