import { test } from 'node:test';
import assert from 'node:assert/strict';
import sample from './__fixtures__/sample.contract.mjs';
import container from './__fixtures__/container.contract.mjs';
import interactive from './__fixtures__/interactive.contract.mjs';
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

test('emitDemoPage: switcher slots, InstallBlock, PropsTable, breadcrumbs + pager', () => {
  const out = emit.emitDemoPage(sample);
  assert.match(
    out,
    /import InstallBlock from '\.\.\/\.\.\/\.\.\/components\/InstallBlock\.astro';/,
  );
  assert.match(
    out,
    /import FrameworkSwitcher from '\.\.\/\.\.\/\.\.\/components\/FrameworkSwitcher\.astro';/,
  );
  assert.match(out, /import PropsTable from '\.\.\/\.\.\/\.\.\/components\/PropsTable\.astro';/);
  assert.match(out, /<Breadcrumbs id="fade-up" \/>/);
  assert.match(out, /<FrameworkSwitcher id="fade-up">/);
  // The framework preview is slotted (slot on the wrapping div, not the component).
  assert.match(out, /slot="react"><ReactFadeUp text="Fade up into place" \/>/);
  assert.match(out, /<InstallBlock meta=\{fadeUpMeta\} \/>/);
  assert.match(out, /<PropsTable schema=\{fadeUpSchema\} \/>/);
  assert.match(out, /<ComponentPager id="fade-up" \/>/);
  // The old inline props table + propsTable frontmatter are gone.
  assert.doesNotMatch(out, /propsTable\(/);
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
  assert.match(emit.emitCard(sample), /href="\/components\/text\/fade-up"/);
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

// --- v2: container (card) + interactive (button) kinds -----------------------

test('emitSchema: emits the contract category, not a hardcoded text', () => {
  assert.match(emit.emitSchema(container), /category: 'card',/);
  assert.match(emit.emitSchema(interactive), /category: 'button',/);
  // The text fixture omits `category` and still lands on 'text'.
  assert.match(emit.emitSchema(sample), /category: 'text',/);
  // A container has no `text`; an interactive carries `label`.
  assert.doesNotMatch(emit.emitSchema(container), /^\s*text:/m);
  assert.match(emit.emitSchema(interactive), /label: z\.string\(\)\.default\('Button'\)/);
});

test('emitCss (container): styles a div, no segments, no self-running keyframe', () => {
  const out = emit.emitCss(container);
  assert.match(out, /\.jolt-glare \{/);
  assert.doesNotMatch(out, /data-jolt-segment/);
  assert.match(out, /@media \(prefers-reduced-motion: reduce\)/);
});

test('emitCss (interactive): targets a button with :disabled + reduced-motion', () => {
  const out = emit.emitCss(interactive);
  assert.match(out, /\.jolt-star-border \{/);
  assert.match(out, /\.jolt-star-border:disabled \{/);
  assert.match(out, /cursor: pointer;/);
  assert.match(out, /@media \(prefers-reduced-motion: reduce\)/);
});

test('emitReactSkin (container): div root, HTMLAttributes, rest spread, children', () => {
  const out = emit.emitReactSkin(container);
  assert.match(out, /type GlareProps = GlareStyleProps & HTMLAttributes<HTMLDivElement>;/);
  assert.match(out, /\{\.\.\.rest\}/);
  assert.match(out, /className=\{`jolt-glare\$\{className \? ` \$\{className\}` : ''\}`\}/);
  assert.match(out, /\{children\}/);
  assert.doesNotMatch(out, /aria-label/);
});

test('emitReactSkin (interactive): button root, ButtonHTMLAttributes, children ?? label', () => {
  const out = emit.emitReactSkin(interactive);
  assert.match(
    out,
    /type StarBorderProps = StarBorderStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;/,
  );
  assert.match(out, /type = 'button',/);
  assert.match(out, /\{children \?\? label\}/);
  assert.match(out, /<button/);
});

test('emitVueSkin (container/interactive): single root + fallthrough, no defineEmits', () => {
  const div = emit.emitVueSkin(container);
  assert.match(div, /<div class="jolt-glare" :style="style"><slot \/><\/div>/);
  assert.doesNotMatch(div, /defineEmits/);
  const btn = emit.emitVueSkin(interactive);
  assert.match(btn, /<button class="jolt-star-border" :style="style">/);
  assert.match(btn, /<slot>\{\{ label \}\}<\/slot>/);
  assert.doesNotMatch(btn, /defineEmits/);
});

test('emitSvelteSkin (container/interactive): Snippet children + typed rest spread', () => {
  const div = emit.emitSvelteSkin(container);
  assert.match(div, /Omit<HTMLAttributes<HTMLDivElement>, 'children' \| 'class' \| 'style'>/);
  assert.match(div, /\{#if children\}\{@render children\(\)\}\{\/if\}/);
  const btn = emit.emitSvelteSkin(interactive);
  assert.match(btn, /Omit<HTMLButtonAttributes, 'children' \| 'class' \| 'style'>/);
  assert.match(btn, /\{#if children\}\{@render children\(\)\}\{:else\}\{label\}\{\/if\}/);
});

test('emitReactTest (container): div root, var mapping, mount/unmount does not throw', () => {
  const out = emit.emitReactTest(container);
  assert.match(out, /describe\('Glare \(react\)'/);
  assert.match(out, /\.jolt-glare/);
  assert.match(out, /expect\(\(\) => unmount\(\)\)\.not\.toThrow\(\)/);
  assert.match(out, /getPropertyValue\('--jolt-color'\)\)\.toBe\('#7c5cff'\)/);
});

test('emitReactTest (interactive): button, label fallback, click, disabled', () => {
  const out = emit.emitReactTest(interactive);
  assert.match(out, /import \{ render, fireEvent \} from '@testing-library\/react';/);
  assert.match(out, /expect\(btn\.tagName\)\.toBe\('BUTTON'\)/);
  assert.match(out, /renders children over the label fallback/);
  assert.match(out, /fireEvent\.click\(getByRole\('button'\)\)/);
  assert.match(out, /\)\.disabled\)\.toBe\(true\)/);
});

test('emitVueTest (interactive): fallthrough props go through `attrs`, not `props`', () => {
  const out = emit.emitVueTest(interactive);
  assert.match(out, /render\(StarBorder, \{ attrs: \{ onClick \} \}\)/);
  assert.match(out, /render\(StarBorder, \{ attrs: \{ disabled: true \} \}\)/);
  assert.match(out, /slots: \{ default: \(\) => 'Click me' \}/);
});

test('emitSvelteTest (container): renders children snippet-free and cleans up', () => {
  const out = emit.emitSvelteTest(container);
  assert.match(out, /from '@testing-library\/svelte'/);
  assert.match(out, /expect\(\(\) => unmount\(\)\)\.not\.toThrow\(\)/);
});

test('emitDemoPage: path/import depth follow the category slug', () => {
  const card = emit.emitDemoPage(container);
  assert.match(card, /<Breadcrumbs id="glare" \/>/);
  // Pointer-driven (hydrate) previews hydrate; the wrapper div carries the slot.
  assert.match(card, /slot="react"><ReactGlare client:visible>/);
  const button = emit.emitDemoPage(interactive);
  assert.match(button, /slot="react"><ReactStarBorder label="Star Border" \/>/);
  assert.doesNotMatch(button, /client:visible/);
});

test('emitCard: slug-correct href; buttons use the div card + View link', () => {
  const card = emit.emitCard(container);
  assert.match(card, /href="\/components\/cards\/glare"/);
  assert.match(card, /<Glare client:visible>/);
  const button = emit.emitCard(interactive);
  assert.match(button, /class=\{buttonCard\}/);
  assert.match(button, /<StarBorder label="Star Border" \/>/);
  assert.match(button, /href="\/components\/buttons\/star-border" class=\{viewLink\}/);
});

test('emitParityCells: containers slot TEXT (+ client:load when hydrate); buttons render bare', () => {
  const cells = emit.emitParityCells(container);
  assert.match(cells, /data-testid="glare-react"><RGlare client:load>\{TEXT\}<\/RGlare>/);
  assert.match(cells, /data-testid="glare-svelte"><SGlare client:load>\{TEXT\}<\/SGlare>/);
  const still = emit.emitParityCells({ ...container, hydrate: false });
  assert.match(still, /<RGlare>\{TEXT\}<\/RGlare>/);
  const btn = emit.emitParityCells(interactive);
  assert.match(btn, /data-testid="star-border-vue"><VStarBorder label="Jolt UI" \/>/);
});

test('emitVueShim / emitSvelteShim: interactive declares disabled?: boolean', () => {
  assert.match(emit.emitVueShim(interactive), /disabled\?: boolean;/);
  assert.match(emit.emitSvelteShim(interactive), /disabled\?: boolean;/);
  assert.doesNotMatch(emit.emitVueShim(container), /disabled\?: boolean;/);
});
