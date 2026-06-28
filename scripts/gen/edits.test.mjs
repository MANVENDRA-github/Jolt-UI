import { test } from 'node:test';
import assert from 'node:assert/strict';
import sample from './__fixtures__/sample.contract.mjs';
import {
  insertBeforeMarker,
  applyCoreIndex,
  applyJsrepoConfig,
  applyParityHarness,
  applyParitySpec,
  applyCliSmoke,
  applyComponentsIndex,
  containsComponent,
} from './edits.mjs';

test('insertBeforeMarker inserts on the line before the marker', () => {
  const src = "export { a } from './a';\n// gen:exports\n";
  const out = insertBeforeMarker(src, '// gen:exports', "export { b } from './b';");
  assert.equal(out, "export { a } from './a';\nexport { b } from './b';\n// gen:exports\n");
});

test('insertBeforeMarker throws when the marker is missing', () => {
  assert.throws(() => insertBeforeMarker('no marker here', '// gen:exports', 'x'), /marker not found/);
});

test('insertBeforeMarker throws when the marker is duplicated', () => {
  const src = '// gen:exports\n// gen:exports\n';
  assert.throws(() => insertBeforeMarker(src, '// gen:exports', 'x'), /appears more than once/);
});

test('applyCoreIndex inserts the schema/meta/type exports', () => {
  const src = "export { propsTable } from './props-table';\n// gen:exports\n";
  const out = applyCoreIndex(src, sample);
  assert.match(out, /export \{ fadeUpSchema, fadeUpMeta \} from '\.\/schemas\/fade-up';/);
  assert.match(out, /export type \{ FadeUpProps \} from '\.\/schemas\/fade-up';/);
});

test('applyJsrepoConfig inserts one item into each framework registry', () => {
  const src = [
    '// react',
    '        // gen:react-items',
    '// vue',
    '        // gen:vue-items',
    '// svelte',
    '        // gen:svelte-items',
    '',
  ].join('\n');
  const out = applyJsrepoConfig(src, sample);
  assert.match(out, /packages\/react\/src\/components\/FadeUp\/FadeUp\.tsx/);
  assert.match(out, /packages\/vue\/src\/components\/FadeUp\/FadeUp\.vue/);
  assert.match(out, /packages\/svelte\/src\/components\/FadeUp\/FadeUp\.svelte/);
  assert.equal((out.match(/name: 'fade-up'/g) ?? []).length, 3);
});

test('applyParityHarness inserts 3 imports + 3 cells', () => {
  const src = [
    'import {',
    '  // gen:react',
    "} from '@jolt/react';",
    'import {',
    '  // gen:vue',
    "} from '@jolt/vue';",
    'import {',
    '  // gen:svelte',
    "} from '@jolt/svelte';",
    '  {/* gen:cells */}',
    '',
  ].join('\n');
  const out = applyParityHarness(src, sample);
  assert.match(out, /FadeUp as RFadeUp,/);
  assert.match(out, /FadeUp as VFadeUp,/);
  assert.match(out, /FadeUp as SFadeUp,/);
  assert.equal((out.match(/data-testid="fade-up-/g) ?? []).length, 3);
});

test('applyParitySpec routes per-char vs whole-text and no-pixel', () => {
  const src = '// gen:per-char\n// gen:whole-text\n// gen:no-pixel\n';
  const perChar = applyParitySpec(src, sample);
  // fade-up is per-char + pixelParity:true → only the per-char array gets it.
  assert.match(perChar, /'fade-up',\n\/\/ gen:per-char/);
  assert.doesNotMatch(perChar, /'fade-up',\n\/\/ gen:whole-text/);

  const wholeNoPixel = applyParitySpec(src, {
    ...sample,
    parity: { kind: 'whole-text', pixelParity: false },
  });
  assert.match(wholeNoPixel, /'fade-up',\n\/\/ gen:whole-text/);
  assert.match(wholeNoPixel, /'fade-up',\n\/\/ gen:no-pixel/);
});

test('applyCliSmoke adds the id + the css skin/sheet assertion', () => {
  const src = '// gen:add\n// gen:css\n';
  const out = applyCliSmoke(src, sample);
  assert.match(out, /'fade-up',\n\/\/ gen:add/);
  assert.match(out, /\['FadeUp\.tsx', 'fade-up\.css'\],/);
});

test('applyComponentsIndex inserts the import + the card', () => {
  const src = ['import {', '  // gen:card-import', "} from '@jolt/react';", '  {/* gen:card */}', ''].join(
    '\n',
  );
  const out = applyComponentsIndex(src, sample);
  assert.match(out, /^ {2}FadeUp,$/m);
  assert.match(out, /href="\/components\/fade-up"/);
});

test('containsComponent detects an already-applied component (idempotency guard)', () => {
  const fresh = "export { propsTable } from './props-table';\n// gen:exports\n";
  assert.equal(containsComponent(fresh, sample), false);
  const applied = applyCoreIndex(fresh, sample);
  assert.equal(containsComponent(applied, sample), true);
});
