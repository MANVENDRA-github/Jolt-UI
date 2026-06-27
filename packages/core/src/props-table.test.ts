import { z } from 'zod';
import { propsTable } from './props-table';

const schema = z.object({
  label: z.string().describe('A required label.'),
  size: z.enum(['sm', 'lg']).default('sm').describe('The size.'),
  count: z.number().default(3).describe('How many.'),
  colors: z.array(z.string()).default(['#fff', '#000']).describe('Gradient stops.'),
});

describe('propsTable', () => {
  it('covers exactly the schema fields in order', () => {
    expect(propsTable(schema).map((p) => p.name)).toEqual(['label', 'size', 'count', 'colors']);
  });

  it('derives array type and stringified default', () => {
    const colors = propsTable(schema).find((p) => p.name === 'colors');
    expect(colors?.type).toBe('string[]');
    expect(colors?.default).toBe('["#fff","#000"]');
  });

  it('marks a required prop (no default) with a null default', () => {
    expect(propsTable(schema).find((p) => p.name === 'label')).toEqual({
      name: 'label',
      type: 'string',
      default: null,
      description: 'A required label.',
    });
  });

  it('derives enum type and stringified default', () => {
    const size = propsTable(schema).find((p) => p.name === 'size');
    expect(size?.type).toBe("'sm' | 'lg'");
    expect(size?.default).toBe('"sm"');
  });
});
