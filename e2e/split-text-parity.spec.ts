import { expect, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const FRAMEWORKS = ['react', 'vue', 'svelte'] as const;
const TEXT = 'Jolt UI';

test('SplitText renders identically across React, Vue, and Svelte', async ({ page }) => {
  await page.goto('/internal/split-text-parity');

  // Every island hydrates and reaches the reduced-motion final state.
  for (const fw of FRAMEWORKS) {
    await expect(page.locator(`[data-testid="${fw}"] [aria-label="${TEXT}"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="${fw}"] [data-jolt-segment]`).first()).toBeVisible();
  }

  // DOM parity: identical segment count and text across frameworks.
  const counts: number[] = [];
  const texts: (string | null)[] = [];
  for (const fw of FRAMEWORKS) {
    counts.push(await page.locator(`[data-testid="${fw}"] [data-jolt-segment]`).count());
    texts.push(await page.locator(`[data-testid="${fw}"] [aria-label]`).first().textContent());
  }
  expect(new Set(counts).size, `segment counts differ: ${counts.join(', ')}`).toBe(1);
  expect(new Set(texts).size, `text differs: ${texts.join(' | ')}`).toBe(1);

  // Visual parity: each framework's rendered output is pixel-identical. Comparing
  // the three to each other within one run keeps this OS-independent (no golden).
  const shots: Record<string, Buffer> = {};
  for (const fw of FRAMEWORKS) {
    shots[fw] = await page.locator(`[data-testid="${fw}"]`).screenshot();
  }
  const base = PNG.sync.read(shots[FRAMEWORKS[0]]);
  for (const fw of FRAMEWORKS.slice(1)) {
    const other = PNG.sync.read(shots[fw]);
    expect(other.width, `${fw} width`).toBe(base.width);
    expect(other.height, `${fw} height`).toBe(base.height);
    const mismatched = pixelmatch(base.data, other.data, null, base.width, base.height, {
      threshold: 0.1,
    });
    const ratio = mismatched / (base.width * base.height);
    expect(ratio, `react vs ${fw}: ${mismatched}px differ`).toBeLessThan(0.01);
  }
});
