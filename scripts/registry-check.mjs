// Validates the built jsrepo registry against the invariants the build must hold.
// Run after `jsrepo build` (see the `registry:check` script). Loops every component
// item in every framework registry and fails if the "own-the-code" bundling
// regressed or tests leaked.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryDir = resolve(root, 'apps/site/public/r');
const FRAMEWORKS = ['react', 'vue', 'svelte'];

let failures = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  failures += 1;
};
const hasTests = (files) =>
  (files ?? []).map((f) => f.path).filter((p) => /\.(test|spec)\./.test(p));

for (const fw of FRAMEWORKS) {
  const read = (name) => {
    const path = resolve(registryDir, fw, name);
    if (!existsSync(path)) {
      fail(`${fw}: missing ${name} (did 'jsrepo build' run?)`);
      return null;
    }
    return JSON.parse(readFileSync(path, 'utf8'));
  };

  const manifest = read('registry.json');
  const core = read('core.json');
  if (!manifest || !core) continue;

  // Core must contain the shared source, no tests.
  if (!(core.files ?? []).some((f) => f.path === 'index.ts')) fail(`${fw}: core missing index.ts`);
  const coreTests = hasTests(core.files);
  if (coreTests.length) fail(`${fw}: test files in core: ${coreTests.join(', ')}`);

  // Three.js isolation (D-028): `three` ships no types and is heavy, so it must be a
  // dependency of ONLY the `particles-core` item — never the monolithic `core` that
  // every component pulls (that would break all CSS/GSAP consumers' typecheck).
  const dependsOnThree = (block) => (block?.dependencies ?? []).some((d) => d.name === 'three');
  if (dependsOnThree(core)) {
    fail(`${fw}: core must not depend on three (it would reach every component)`);
  }
  const particlesCore = read('particles-core.json');
  if (particlesCore && !dependsOnThree(particlesCore)) {
    fail(`${fw}: particles-core must declare the three dependency`);
  }

  const components = (manifest.items ?? []).filter((i) => i.type === 'component');
  if (!components.length) fail(`${fw}: registry has no component items`);

  for (const item of components) {
    const block = read(`${item.name}.json`);
    if (!block) continue;

    // Each component must bundle the core (own-the-code), not pull it from npm —
    // directly, or transitively via another lib item (Particles reaches core through
    // particles-core, since the Vue skin imports only the subpath; D-028).
    const directRegDeps = block.registryDependencies ?? [];
    const bundlesCore =
      directRegDeps.includes('core') ||
      directRegDeps.some((d) => (read(`${d}.json`)?.registryDependencies ?? []).includes('core'));
    if (!bundlesCore) {
      fail(`${fw}/${item.name}: must bundle registry item "core" (directly or transitively)`);
    }
    if ((block.dependencies ?? []).some((d) => d.name === '@jolt/core')) {
      fail(
        `${fw}/${item.name}: must not list @jolt/core as an npm dependency (it should be bundled)`,
      );
    }
    // The core import must have been rewritten to the bundleable alias.
    const source = (block.files ?? []).map((f) => f.content).join('\n');
    if (source.includes('@jolt/core')) {
      fail(`${fw}/${item.name}: still imports '@jolt/core' (transform did not run)`);
    }
    const leaked = hasTests(block.files);
    if (leaked.length) fail(`${fw}/${item.name}: test files leaked: ${leaked.join(', ')}`);
  }
}

if (failures > 0) {
  console.error(`\nregistry:check FAILED with ${failures} problem(s).`);
  process.exit(1);
}
console.log(
  'registry:check OK — every component bundles core, imports rewritten, no test files leaked.',
);
