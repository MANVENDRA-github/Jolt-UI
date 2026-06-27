import { z } from 'zod';

/** A documented prop, derived from a Zod object schema for the docs site's props table. */
export interface PropDoc {
  name: string;
  type: string;
  /** Stringified default, or `null` when the prop is required. */
  default: string | null;
  description: string;
}

function describeType(schema: z.ZodTypeAny): string {
  if (schema instanceof z.ZodString) return 'string';
  if (schema instanceof z.ZodNumber) return 'number';
  if (schema instanceof z.ZodBoolean) return 'boolean';
  if (schema instanceof z.ZodEnum) return schema.options.map((o: string) => `'${o}'`).join(' | ');
  return 'unknown';
}

/**
 * Build a props table from a Zod object schema — the single source for every
 * component's docs table. Each field's `.describe()` is its description, its
 * `.default()` (if any) is the default, and the type is derived from the schema.
 */
export function propsTable(schema: z.AnyZodObject): PropDoc[] {
  return Object.entries(schema.shape).map(([name, value]) => {
    const field = value as z.ZodTypeAny;
    if (field instanceof z.ZodDefault) {
      return {
        name,
        type: describeType(field._def.innerType),
        default: JSON.stringify(field._def.defaultValue()),
        description: field.description ?? '',
      };
    }
    return { name, type: describeType(field), default: null, description: field.description ?? '' };
  });
}
