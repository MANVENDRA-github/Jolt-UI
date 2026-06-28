import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertContract, isCssPattern } from './contract.mjs';
import sample from './__fixtures__/sample.contract.mjs';

/** The fixture with one top-level field overridden. */
const withField = (over) => ({ ...sample, ...over });

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
  assert.throws(() => assertContract(withField({ props })), /must be required:true or have a default/);
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
  assert.throws(() => assertContract(withField({ props })), /default must be one of its enum values/);
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

test('isCssPattern distinguishes css from gsap', () => {
  assert.equal(isCssPattern('css-per-char'), true);
  assert.equal(isCssPattern('css-whole-text'), true);
  assert.equal(isCssPattern('css-structural'), true);
  assert.equal(isCssPattern('gsap'), false);
});
