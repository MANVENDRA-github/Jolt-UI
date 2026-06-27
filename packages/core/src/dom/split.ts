/**
 * Split text into animatable segments. Pure and framework-agnostic — every skin
 * renders the segments the same way, so the split is identical across frameworks.
 *
 * `words` keeps whitespace as its own segments so spacing is preserved when each
 * segment is rendered as an inline-block span.
 */
export function splitSegments(text: string, by: 'chars' | 'words'): string[] {
  if (by === 'words') {
    return text.split(/(\s+)/).filter((segment) => segment.length > 0);
  }
  return Array.from(text);
}
