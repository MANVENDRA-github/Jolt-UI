import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { motionTokens } from './tokens';

const themeCss = readFileSync(fileURLToPath(new URL('./theme.css', import.meta.url)), 'utf8');

describe('design token parity', () => {
  it('exposes the expected motion tokens', () => {
    expect(Object.keys(motionTokens)).toEqual([
      'easeOut',
      'durationBase',
      'durationFast',
      'stagger',
    ]);
  });

  it('every motion token value is present in theme.css', () => {
    for (const value of Object.values(motionTokens)) {
      expect(themeCss).toContain(value);
    }
  });
});
