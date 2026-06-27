// CLI-smoke E2E: build the registry, `jsrepo add` a component into a throwaway
// fixture via the local `fs` provider (no network/live origin), then assert the
// core was bundled, the import was rewritten, no tests leaked — and the consumer
// project type-checks. Run via `pnpm test:cli`.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = resolve(root, '.cli-smoke-tmp');
const fixture = join(tmp, 'fixture');
const registryUrl = `fs://${resolve(root, 'apps/site/public/r/react').replaceAll('\\', '/')}`;

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

// `jsrepo add` installs the component's deps into the fixture, which transiently
// records the throwaway fixture in the root pnpm-lock.yaml. We snapshot the lockfile
// just before the add and restore that exact content afterward — removing the
// fixture's trace while preserving any unrelated (e.g. uncommitted) lockfile state.
const lockfilePath = resolve(root, 'pnpm-lock.yaml');
let lockfileBackup = null;
const restoreLockfile = () => {
  if (lockfileBackup !== null) writeFileSync(lockfilePath, lockfileBackup);
};
const cleanup = () => {
  rmSync(tmp, { recursive: true, force: true });
  restoreLockfile();
};
const die = (msg) => {
  console.error(`\n✗ cli-smoke FAILED: ${msg}`);
  cleanup();
  process.exit(1);
};

// Isolate the fixture's `jsrepo add` install from the monorepo workspace + root
// lockfile, and don't trip CI's frozen-lockfile default on the fixture's own deps.
process.env.npm_config_ignore_workspace = 'true';
process.env.npm_config_frozen_lockfile = 'false';

// 1. Fresh registry + fresh fixture project (consumer side).
run('pnpm exec jsrepo build', root);
rmSync(tmp, { recursive: true, force: true });
mkdirSync(fixture, { recursive: true });

writeFileSync(
  join(fixture, 'package.json'),
  `${JSON.stringify(
    {
      name: 'cli-smoke-fixture',
      private: true,
      type: 'module',
      dependencies: { react: '^19', 'react-dom': '^19' },
      devDependencies: { '@types/react': '^19', '@types/react-dom': '^19' },
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  join(fixture, 'tsconfig.json'),
  `${JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        target: 'ES2022',
        jsx: 'react-jsx',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true,
        noEmit: true,
      },
      include: ['src'],
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  join(fixture, 'jsrepo.config.ts'),
  `import { defineConfig } from 'jsrepo';\n` +
    `import { fs } from 'jsrepo/providers';\n\n` +
    `export default defineConfig({\n` +
    `  providers: [fs()],\n` +
    `  registries: ['${registryUrl}'],\n` +
    `  paths: { '*': './src' },\n` +
    `});\n`,
);
// Keep the fixture's `jsrepo add` install isolated from the monorepo workspace +
// root lockfile, and don't require a lockfile under CI's frozen-lockfile default.
writeFileSync(join(fixture, '.npmrc'), 'ignore-workspace=true\nfrozen-lockfile=false\n');

// 2. Add the component from the local registry (installs gsap/zod + the fixture deps).
lockfileBackup = existsSync(lockfilePath) ? readFileSync(lockfilePath, 'utf8') : null;
run(`pnpm exec jsrepo add split-text --yes --cwd "${fixture}"`, root);

// 3. Assert the install is correct and self-contained.
const srcDir = join(fixture, 'src');
const expected = [
  'SplitText.tsx',
  'index.ts',
  'motion.ts',
  'dom/split.ts',
  'schemas/split-text.ts',
  'animation/split-text.ts',
];
for (const f of expected) {
  if (!existsSync(join(srcDir, f))) die(`expected file not added: src/${f}`);
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
const files = walk(srcDir);

const tests = files.filter((f) => /\.(test|spec)\./.test(f));
if (tests.length) die(`test files leaked into the install: ${tests.join(', ')}`);

for (const f of files) {
  const content = readFileSync(f, 'utf8');
  if (content.includes('@jolt/core') || content.includes('@/jolt-core')) {
    die(`unrewritten core import remains in ${f}`);
  }
}

// 4. The bundled component must type-check in a real consumer project.
run('pnpm exec tsc --noEmit -p tsconfig.json', fixture);

cleanup();
console.log('\n✓ cli-smoke OK — jsrepo add bundled the core, rewrote imports, no tests leaked, consumer type-checks.');
