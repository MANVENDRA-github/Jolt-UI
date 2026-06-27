// Validates the built jsrepo registry against the invariants the build must hold.
// Run after `jsrepo build` (see the `registry:check` script). Reads the generated
// item JSONs and fails if the "own-the-code" bundling regressed or tests leaked.
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

for (const fw of FRAMEWORKS) {
  const read = (name) => {
    const path = resolve(registryDir, fw, name);
    if (!existsSync(path)) {
      fail(`${fw}: missing ${name} (did 'jsrepo build' run?)`);
      return null;
    }
    return JSON.parse(readFileSync(path, 'utf8'));
  };

  const splitText = read('split-text.json');
  const core = read('core.json');
  if (!splitText || !core) continue;

  // The component must bundle the core (own-the-code), not pull it from npm.
  if (!(splitText.registryDependencies ?? []).includes('core')) {
    fail(`${fw}: split-text must declare registry dependency "core"`);
  }
  if ((splitText.dependencies ?? []).some((d) => d.name === '@jolt/core')) {
    fail(`${fw}: split-text must not list @jolt/core as an npm dependency (it should be bundled)`);
  }

  // The core import must have been rewritten to the bundleable alias.
  const source = (splitText.files ?? []).map((f) => f.content).join('\n');
  if (source.includes('@jolt/core')) {
    fail(`${fw}: split-text still imports '@jolt/core' (transform did not run)`);
  }
  if (!source.includes('@/jolt-core')) {
    fail(`${fw}: split-text is missing the rewritten '@/jolt-core' import`);
  }

  // No test files may be distributed.
  const leaked = [...(splitText.files ?? []), ...(core.files ?? [])]
    .map((f) => f.path)
    .filter((p) => /\.(test|spec)\./.test(p));
  if (leaked.length) fail(`${fw}: test files leaked into the registry: ${leaked.join(', ')}`);

  // The core item must actually contain the shared source.
  if (!(core.files ?? []).some((f) => f.path === 'index.ts')) {
    fail(`${fw}: core is missing index.ts`);
  }
}

if (failures > 0) {
  console.error(`\nregistry:check FAILED with ${failures} problem(s).`);
  process.exit(1);
}
console.log('registry:check OK — components bundle core, import rewritten, no test files leaked.');
