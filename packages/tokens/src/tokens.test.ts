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

describe('landing tokens (Voltage 2)', () => {
  const NAMES = ['--jolt-abyss', '--jolt-filament', '--shadow-jolt-glow-lg'];

  it('defines each landing token in both semantic theme blocks', () => {
    const lightStart = themeCss.indexOf("[data-theme='light']");
    expect(lightStart).toBeGreaterThan(-1);
    const darkBlock = themeCss.slice(0, lightStart);
    const lightBlock = themeCss.slice(lightStart);
    for (const name of NAMES) {
      expect(darkBlock).toContain(`${name}:`);
      expect(lightBlock).toContain(`${name}:`);
    }
  });
});
