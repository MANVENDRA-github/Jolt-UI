import { test } from 'node:test';
import assert from 'node:assert/strict';
import sample from './__fixtures__/sample.contract.mjs';
import * as emit from './emit.mjs';

// A whole-text variant of the fixture (drops `by`, flips parity kind).
const whole = {
  ...sample,
  id: 'glow-in',
  name: 'GlowIn',
  parity: { kind: 'whole-text', pixelParity: true },
  props: sample.props.filter((p) => p.name !== 'by'),
  cardText: 'Glow In',
};

test('emitSchema: zod object, defaults, Props type, meta', () => {
  const out = emit.emitSchema(sample);
  assert.match(out, /export const fadeUpSchema = z\.object\(\{/);
  assert.match(out, /text: z\.string\(\)\.describe\('The text to animate\.'\),/);
  assert.match(out, /by: z\.enum\(\['chars', 'words'\]\)\.default\('chars'\)/);
  assert.match(out, /distance: z\.number\(\)\.default\(16\)/);
  assert.match(out, /export type FadeUpProps = z\.input<typeof fadeUpSchema>;/);
  assert.match(out, /export const fadeUpMeta = \{/);
  assert.match(out, /id: 'fade-up',/);
  assert.match(out, /deps: \[\],/);
});

test('emitCss (per-char): keyframes, segment rule, reduced-motion releases will-change', () => {
  const out = emit.emitCss(sample);
  assert.match(out, /@keyframes jolt-fade-up \{/);
  assert.match(out, /\.jolt-fade-up \[data-jolt-segment\] \{/);
  assert.match(out, /animation-delay: calc\(/);
  assert.match(out, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(out, /will-change: auto;/);
});

test('emitCss (whole-text): animates the element, no segment rule', () => {
  const out = emit.emitCss(whole);
  assert.match(out, /\.jolt-glow-in \{/);
  assert.doesNotMatch(out, /data-jolt-segment/);
});

test('emitReactSkin (per-char): splitSegments, css import, prop->var, aria-label, segments', () => {
  const out = emit.emitReactSkin(sample);
  assert.match(out, /import \{ splitSegments, type FadeUpProps \} from '@jolt\/core';/);
  assert.match(out, /import '@jolt\/core\/styles\/fade-up\.css';/);
  assert.match(out, /export function FadeUp\(\{ text, by = 'chars', distance = 16/);
  assert.match(out, /'--jolt-distance': `\$\{distance\}px`,/);
  assert.match(out, /aria-label=\{text\}/);
  assert.match(out, /data-jolt-segment=""/);
});

test('emitReactSkin (whole-text): renders text directly, no aria-label/segments', () => {
  const out = emit.emitReactSkin(whole);
  assert.match(out, /import type \{ GlowInProps \} from '@jolt\/core';/);
  assert.doesNotMatch(out, /splitSegments/);
  assert.doesNotMatch(out, /aria-label/);
  assert.match(out, /\{text\}/);
});

test('emitVueSkin (per-char): local Props interface, defineProps destructure', () => {
  const out = emit.emitVueSkin(sample);
  assert.match(out, /interface Props \{/);
  assert.match(out, /text: string;/);
  assert.match(out, /by\?: 'chars' \| 'words';/);
  assert.match(out, /const \{ text, by = 'chars'.*\} =\n? *defineProps<Props>\(\);/s);
  assert.match(out, /:aria-label="text"/);
});

test('emitSvelteSkin (per-char): $props rune, inline --jolt-* style, segments', () => {
  const out = emit.emitSvelteSkin(sample);
  assert.match(out, /let \{ text, by = 'chars'.*\}: FadeUpProps =\n? *\$props\(\);/s);
  assert.match(out, /\$derived\(splitSegments\(text, by\)\)/);
  assert.match(out, /style="--jolt-distance:\{distance\}px; /);
  assert.match(out, /data-jolt-segment aria-hidden="true" style="--jolt-i:\{i\}"/);
});

test('emitBarrel: framework-correct re-export', () => {
  assert.equal(emit.emitBarrel('react', sample), "export { FadeUp } from './FadeUp';\n");
  assert.equal(
    emit.emitBarrel('vue', sample),
    "export { default as FadeUp } from './FadeUp.vue';\n",
  );
  assert.equal(
    emit.emitBarrel('svelte', sample),
    "export { default as FadeUp } from './FadeUp.svelte';\n",
  );
});

test('emitReactTest (per-char): aria-label, segment count, var mapping', () => {
  const out = emit.emitReactTest(sample);
  assert.match(out, /describe\('FadeUp \(react\)'/);
  assert.match(out, /splitSegments\('Hello', 'chars'\)\.length/);
  assert.match(out, /<FadeUp text="Hi" distance=\{7\} \/>/);
  assert.match(out, /getPropertyValue\('--jolt-distance'\)\)\.toBe\('7px'\)/);
});

test('emitVueTest / emitSvelteTest: correct testing-library import', () => {
  assert.match(emit.emitVueTest(sample), /from '@testing-library\/vue'/);
  assert.match(emit.emitSvelteTest(sample), /from '@testing-library\/svelte'/);
  assert.match(emit.emitVueTest(sample), /describe\('FadeUp \(vue\)'/);
});

test('emitDemoPage: InstallBlock from meta, live demos, propsTable', () => {
  const out = emit.emitDemoPage(sample);
  assert.match(out, /import InstallBlock from '\.\.\/\.\.\/components\/InstallBlock\.astro';/);
  assert.match(out, /<InstallBlock meta=\{fadeUpMeta\} \/>/);
  assert.match(out, /const props = propsTable\(fadeUpSchema\);/);
  assert.match(out, /<ReactFadeUp text="Fade up into place" \/>/);
});

test('emitVueShim / emitSvelteShim: typed prop declarations', () => {
  assert.match(emit.emitVueShim(sample), /export declare const FadeUp: DefineComponent<\{/);
  assert.match(emit.emitVueShim(sample), /by\?: 'chars' \| 'words';/);
  assert.match(emit.emitSvelteShim(sample), /export declare const FadeUp: \(props: \{/);
  assert.match(emit.emitSvelteShim(sample), /\}\) => unknown;/);
});

test('emitJsrepoItem: per-framework path + ext', () => {
  assert.match(emit.emitJsrepoItem(sample, 'react'), /name: 'fade-up'/);
  assert.match(
    emit.emitJsrepoItem(sample, 'react'),
    /path: 'packages\/react\/src\/components\/FadeUp\/FadeUp\.tsx'/,
  );
  assert.match(emit.emitJsrepoItem(sample, 'svelte'), /FadeUp\.svelte'/);
});

test('emitParityImport / emitParityCells: R/V/S aliases + testids', () => {
  assert.equal(emit.emitParityImport(sample, 'react'), '  FadeUp as RFadeUp,');
  assert.equal(emit.emitParityImport(sample, 'vue'), '  FadeUp as VFadeUp,');
  const cells = emit.emitParityCells(sample);
  assert.match(cells, /data-testid="fade-up-react"><RFadeUp text="Jolt UI" \/>/);
  assert.match(cells, /data-testid="fade-up-svelte"><SFadeUp text="Jolt UI" \/>/);
});

test('emitCard / emitCoreExports / emitPackageExport', () => {
  assert.match(emit.emitCard(sample), /href="\/components\/fade-up"/);
  assert.match(emit.emitCard(sample), /<FadeUp text="Fade Up" \/>/);
  assert.equal(
    emit.emitCoreExports(sample),
    "export { fadeUpSchema, fadeUpMeta } from './schemas/fade-up';\n" +
      "export type { FadeUpProps } from './schemas/fade-up';",
  );
  assert.equal(emit.emitPackageExport(sample), "export { FadeUp } from './components/FadeUp';");
});

test('emitBehavior rejects non-CSS patterns', () => {
  assert.throws(() => emit.emitBehavior({ ...sample, pattern: 'gsap' }), /only CSS patterns/);
});
