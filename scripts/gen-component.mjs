// gen-component — stamp a full component slice from one contract.
//
//   node scripts/gen-component.mjs <id>
//
// Reads scripts/contracts/<id>.mjs, validates it, then (all-or-nothing) writes the
// per-component files and splices the component into the central registration files
// at their `gen:*` anchor markers, and finally runs Prettier over everything touched.
// It emits a *working* scaffold (a trivial opacity-fade animation) that already passes
// the structural invariants + cross-framework parity — you then write the real
// animation test-first. Re-running for an existing component aborts with no writes.
//
// CSS patterns only for now; `gsap` is rejected with a hand-write hint.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertContract } from './gen/contract.mjs';
import * as emit from './gen/emit.mjs';
import * as edits from './gen/edits.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const die = (msg) => {
  console.error(`\n✗ gen-component: ${msg}`);
  process.exit(1);
};

const id = process.argv[2];
if (!id) die('usage: node scripts/gen-component.mjs <id>');

const contractPath = resolve(root, 'scripts/contracts', `${id}.mjs`);
if (!existsSync(contractPath)) die(`no contract at scripts/contracts/${id}.mjs`);

const mod = await import(pathToFileURL(contractPath).href);
const c = assertContract(mod.default);
if (c.id !== id) die(`contract id '${c.id}' does not match filename '${id}'`);
if (c.pattern === 'gsap') {
  die('gsap scaffolding is not supported yet — hand-write the slice per COMPONENT_GUIDE.md');
}

const Name = c.name;
const FW_EXT = { react: 'tsx', vue: 'vue', svelte: 'svelte' };
const skinEmit = { react: emit.emitReactSkin, vue: emit.emitVueSkin, svelte: emit.emitSvelteSkin };
const testEmit = { react: emit.emitReactTest, vue: emit.emitVueTest, svelte: emit.emitSvelteTest };

// Files to CREATE: [relativePath, content].
const creates = [
  [`packages/core/src/schemas/${id}.ts`, emit.emitSchema(c)],
  [`packages/core/src/styles/${id}.css`, emit.emitBehavior(c)],
  [`apps/site/src/pages/components/text/${id}.astro`, emit.emitDemoPage(c)],
];
for (const fw of ['react', 'vue', 'svelte']) {
  const dir = `packages/${fw}/src/components/${Name}`;
  const testExt = fw === 'react' ? 'test.tsx' : 'test.ts';
  creates.push([`${dir}/${Name}.${FW_EXT[fw]}`, skinEmit[fw](c)]);
  creates.push([`${dir}/index.ts`, emit.emitBarrel(fw, c)]);
  creates.push([`${dir}/${Name}.${testExt}`, testEmit[fw](c)]);
}

// Files to EDIT: [relativePath, (content, contract) -> content].
const editTargets = [
  ['packages/core/src/index.ts', edits.applyCoreIndex],
  ['packages/react/src/index.ts', edits.applyPackageIndex],
  ['packages/vue/src/index.ts', edits.applyPackageIndex],
  ['packages/svelte/src/index.ts', edits.applyPackageIndex],
  ['packages/vue/types.d.ts', edits.applyVueShim],
  ['packages/svelte/types.d.ts', edits.applySvelteShim],
  ['jsrepo.config.ts', edits.applyJsrepoConfig],
  ['apps/site/src/pages/internal/parity.astro', edits.applyParityHarness],
  ['e2e/parity.spec.ts', edits.applyParitySpec],
  ['scripts/cli-smoke.mjs', edits.applyCliSmoke],
  ['apps/site/src/pages/components/index.astro', edits.applyComponentsIndex],
];

// Collision precheck — abort with ZERO writes if anything already exists/references it.
const conflicts = [];
for (const [rel] of creates) {
  if (existsSync(resolve(root, rel))) conflicts.push(`file exists: ${rel}`);
}
for (const [rel] of editTargets) {
  if (edits.containsComponent(readFileSync(resolve(root, rel), 'utf8'), c)) {
    conflicts.push(`already references '${id}': ${rel}`);
  }
}
if (conflicts.length) {
  die(`'${id}' looks already generated — aborting (no writes):\n  ${conflicts.join('\n  ')}`);
}

// Write, then splice.
for (const [rel, content] of creates) {
  const abs = resolve(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
}
for (const [rel, apply] of editTargets) {
  const abs = resolve(root, rel);
  writeFileSync(abs, apply(readFileSync(abs, 'utf8'), c));
}

// Normalize formatting so output is lint/format clean (mirrors jsrepo's own format:true).
const touched = [...creates, ...editTargets].map(([rel]) => `"${rel}"`).join(' ');
execSync(`pnpm exec prettier --write ${touched}`, { cwd: root, stdio: 'inherit' });

console.log(`\n✓ generated '${id}' (${Name}) — ${creates.length} files written, ${editTargets.length} files spliced.
  Next: customize the animation test-first, then run: pnpm verify && pnpm test:cli && pnpm test:e2e`);
