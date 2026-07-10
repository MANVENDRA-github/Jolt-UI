import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertContract, isCssPattern, categorySlug } from './contract.mjs';
import sample from './__fixtures__/sample.contract.mjs';
import container from './__fixtures__/container.contract.mjs';
import interactive from './__fixtures__/interactive.contract.mjs';

/** The fixture with one top-level field overridden. */
const withField = (over) => ({ ...sample, ...over });
const withContainer = (over) => ({ ...container, ...over });
const withInteractive = (over) => ({ ...interactive, ...over });

test('accepts the valid fixture and returns it', () => {
  assert.equal(assertContract(sample), sample);
});

test('rejects a non-object', () => {
  assert.throws(() => assertContract(null), /must be an object/);
});

test('rejects a non-kebab id', () => {
  assert.throws(() => assertContract(withField({ id: 'FadeUp' })), /id must be kebab-case/);
});

test('rejects a non-Pascal name', () => {
  assert.throws(() => assertContract(withField({ name: 'fadeUp' })), /name must be PascalCase/);
});

test('rejects an unknown pattern', () => {
  assert.throws(() => assertContract(withField({ pattern: 'webgl' })), /pattern must be one of/);
});

test('rejects an empty blurb', () => {
  assert.throws(() => assertContract(withField({ blurb: '  ' })), /blurb must be a non-empty/);
});

test('rejects a prop with neither default nor required', () => {
  const props = [
    { name: 'text', type: 'string', required: true, describe: 'x' },
    { name: 'gap', type: 'number', describe: 'no default and not required' },
  ];
  assert.throws(
    () => assertContract(withField({ props })),
    /must be required:true or have a default/,
  );
});

test('rejects a required prop that also has a default', () => {
  const props = [{ name: 'text', type: 'string', required: true, default: 'hi', describe: 'x' }];
  assert.throws(() => assertContract(withField({ props })), /must not have a default/);
});

test('rejects an enum prop without values', () => {
  const props = [
    { name: 'text', type: 'string', required: true, describe: 'x' },
    { name: 'by', type: 'enum', default: 'chars', describe: 'no values' },
  ];
  assert.throws(() => assertContract(withField({ props })), /values must be a non-empty array/);
});

test('rejects an enum default outside its values', () => {
  const props = [
    { name: 'text', type: 'string', required: true, describe: 'x' },
    { name: 'by', type: 'enum', values: ['chars', 'words'], default: 'lines', describe: 'x' },
  ];
  assert.throws(
    () => assertContract(withField({ props })),
    /default must be one of its enum values/,
  );
});

test('rejects a cssVar name not starting with --', () => {
  const props = [
    {
      name: 'text',
      type: 'string',
      required: true,
      describe: 'x',
      cssVar: { name: 'jolt-x' },
    },
  ];
  assert.throws(() => assertContract(withField({ props })), /must be a custom property/);
});

test('rejects no required prop', () => {
  const props = [{ name: 'speed', type: 'number', default: 1, describe: 'x' }];
  assert.throws(() => assertContract(withField({ props })), /at least one prop must be required/);
});

test('rejects a gsap pattern that omits gsap from deps', () => {
  assert.throws(
    () => assertContract(withField({ pattern: 'gsap', deps: [] })),
    /must list 'gsap' in deps/,
  );
});

test('rejects a css pattern that lists gsap in deps', () => {
  assert.throws(
    () => assertContract(withField({ deps: ['gsap'] })),
    /must not list 'gsap' in deps/,
  );
});

test('rejects an invalid parity kind', () => {
  const parity = { kind: 'glyph', pixelParity: true };
  assert.throws(() => assertContract(withField({ parity })), /parity.kind must be one of/);
});

test('rejects non-boolean pixelParity', () => {
  const parity = { kind: 'per-char', pixelParity: 'yes' };
  assert.throws(() => assertContract(withField({ parity })), /pixelParity must be a boolean/);
});

test('rejects a contract without a text prop', () => {
  // A required prop (so the "at least one required" check passes) but no `text`.
  const props = [{ name: 'speed', type: 'number', required: true, describe: 'x' }];
  assert.throws(() => assertContract(withField({ props })), /a 'text' string prop is required/);
});

test('rejects a per-char contract without a by enum prop', () => {
  const props = [{ name: 'text', type: 'string', required: true, describe: 'x' }];
  assert.throws(
    () => assertContract(withField({ props, parity: { kind: 'per-char', pixelParity: true } })),
    /needs a 'by' enum prop/,
  );
});

test('isCssPattern distinguishes css from gsap', () => {
  assert.equal(isCssPattern('css-per-char'), true);
  assert.equal(isCssPattern('css-whole-text'), true);
  assert.equal(isCssPattern('css-structural'), true);
  assert.equal(isCssPattern('css-container'), true);
  assert.equal(isCssPattern('css-interactive'), true);
  assert.equal(isCssPattern('gsap'), false);
});

// --- v2: container (card) + interactive (button) kinds -----------------------

test('accepts the container fixture: no text, no label, zero required props', () => {
  assert.equal(assertContract(container), container);
});

test('accepts the interactive fixture: a label prop instead of text', () => {
  assert.equal(assertContract(interactive), interactive);
});

test('category defaults to text and rejects an unknown category', () => {
  // The text fixture omits `category` entirely.
  assert.equal(sample.category, undefined);
  assert.equal(assertContract(sample).category ?? 'text', 'text');
  assert.throws(() => assertContract(withField({ category: 'loader' })), /category must be one of/);
});

test('categorySlug maps a category id to its plural URL segment', () => {
  assert.equal(categorySlug('text'), 'text');
  assert.equal(categorySlug('card'), 'cards');
  assert.equal(categorySlug('button'), 'buttons');
  assert.equal(categorySlug('effect'), 'effects');
  assert.equal(categorySlug('ui'), 'ui');
  assert.equal(categorySlug(undefined), 'text');
});

test('an interactive contract must declare a label string prop', () => {
  const props = interactive.props.filter((p) => p.name !== 'label');
  assert.throws(
    () => assertContract(withInteractive({ props })),
    /a 'label' string prop is required/,
  );
});

test("the label prop is exempt from the cssVar rule (it isn't a --jolt-*)", () => {
  // Sanity: the fixture's label carries no cssVar and still validates.
  assert.equal(interactive.props.find((p) => p.name === 'label').cssVar, undefined);
  assert.equal(assertContract(interactive), interactive);
});

test('a container prop other than text/by/label still needs a cssVar', () => {
  const props = [...container.props, { name: 'gap', type: 'number', default: 1, describe: 'x' }];
  assert.throws(() => assertContract(withContainer({ props })), /must declare a cssVar/);
});

test('pattern and parity.kind must agree for the container/interactive kinds', () => {
  assert.throws(
    () => assertContract(withContainer({ parity: { kind: 'interactive', pixelParity: true } })),
    /pattern 'css-container' requires parity.kind 'container'/,
  );
  assert.throws(
    () => assertContract(withInteractive({ pattern: 'css-whole-text' })),
    /parity.kind 'interactive' requires pattern 'css-interactive'/,
  );
});

test('container/interactive contracts need at least one prop but no required prop', () => {
  assert.throws(() => assertContract(withContainer({ props: [] })), /props must be a non-empty/);
  assert.equal(
    container.props.some((p) => p.required),
    false,
  );
});

test('hydrate defaults to false and must be a boolean', () => {
  assert.equal(assertContract(sample).hydrate ?? false, false);
  assert.equal(assertContract(container).hydrate, true);
  assert.throws(
    () => assertContract(withContainer({ hydrate: 'yes' })),
    /hydrate must be a boolean/,
  );
});
