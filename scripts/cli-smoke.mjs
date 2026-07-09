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
      // @types/three: three ships no bundled types, so the bundled particles webgl
      // shell needs them for the consumer typecheck (jsrepo installs three at runtime
      // but not its types). See D-028.
      devDependencies: {
        '@types/react': '^19',
        '@types/react-dom': '^19',
        '@types/three': '^0.185.0',
      },
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
const COMPONENTS_TO_ADD = [
  'split-text',
  'blur-in',
  'wave',
  'gradient-text',
  'shiny-text',
  'typewriter',
  'rotating-words',
  'count-up',
  'scramble',
  'scroll-velocity',
  'particles',
  'waves',
  'dots',
  'globe',
  'rings',
  'aurora',
  'spinner',
  'dot-bounce',
  'bars',
  'pulse',
  'ripple',
  'grid',
  'progress-bar',
  'shimmer',
  'glow',
  'gradient',
  'sweep',
  'border-draw',
  'tactile',
  'spotlight',
  'tilt',
  'shine-border',
  'fade-up',
  'flip-in',
  'neon',
  'glitch-text',
  'true-focus',
  'circular-text',
  // gen:add
];
run(`pnpm exec jsrepo add ${COMPONENTS_TO_ADD.join(' ')} --yes --cwd "${fixture}"`, root);

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

// CSS-only components must ship their shared stylesheet bundled, and the skin's
// CSS import rewritten to a local path (the @jolt/core scan below catches a miss).
const CSS_SKINS = [
  ['BlurIn.tsx', 'blur-in.css'],
  ['Wave.tsx', 'wave.css'],
  ['GradientText.tsx', 'gradient-text.css'],
  ['ShinyText.tsx', 'shiny-text.css'],
  ['Typewriter.tsx', 'typewriter.css'],
  ['RotatingWords.tsx', 'rotating-words.css'],
  ['Spinner.tsx', 'spinner.css'],
  ['DotBounce.tsx', 'dot-bounce.css'],
  ['Bars.tsx', 'bars.css'],
  ['Pulse.tsx', 'pulse.css'],
  ['Ripple.tsx', 'ripple.css'],
  ['Grid.tsx', 'grid.css'],
  ['ProgressBar.tsx', 'progress-bar.css'],
  ['Shimmer.tsx', 'shimmer.css'],
  ['Glow.tsx', 'glow.css'],
  ['Gradient.tsx', 'gradient.css'],
  ['Sweep.tsx', 'sweep.css'],
  ['BorderDraw.tsx', 'border-draw.css'],
  ['Tactile.tsx', 'tactile.css'],
  ['Spotlight.tsx', 'spotlight.css'],
  ['Tilt.tsx', 'tilt.css'],
  ['ShineBorder.tsx', 'shine-border.css'],
  ['FadeUp.tsx', 'fade-up.css'],
  ['FlipIn.tsx', 'flip-in.css'],
  ['Neon.tsx', 'neon.css'],
  ['GlitchText.tsx', 'glitch-text.css'],
  ['TrueFocus.tsx', 'true-focus.css'],
  ['CircularText.tsx', 'circular-text.css'],
  // gen:css
];
for (const [skin, sheet] of CSS_SKINS) {
  if (!files.some((f) => f.endsWith(skin))) die(`${skin} component not added`);
  if (!files.some((f) => f.endsWith(sheet))) die(`${sheet} stylesheet not bundled`);
}

// GSAP components ship no stylesheet — just assert the skin file landed (the
// consumer typecheck below validates the gsap/ScrambleTextPlugin import resolves).
for (const skin of [
  'CountUp.tsx',
  'Scramble.tsx',
  'ScrollVelocity.tsx',
  'Particles.tsx',
  'Waves.tsx',
  'Dots.tsx',
  'Globe.tsx',
  'Rings.tsx',
  'Aurora.tsx',
]) {
  if (!files.some((f) => f.endsWith(skin))) die(`${skin} component not added`);
}

for (const f of files) {
  const content = readFileSync(f, 'utf8');
  if (content.includes('@jolt/core') || content.includes('@/jolt-core')) {
    die(`unrewritten core import remains in ${f}`);
  }
}

// 4. The bundled component must type-check in a real consumer project. Consumers
// resolve `.css` side-effect imports through their bundler; give tsc the ambient
// module declaration a real project would have.
writeFileSync(join(srcDir, 'css.d.ts'), "declare module '*.css';\n");
run('pnpm exec tsc --noEmit -p tsconfig.json', fixture);

cleanup();
console.log(
  '\n✓ cli-smoke OK — jsrepo add bundled the core, rewrote imports, no tests leaked, consumer type-checks.',
);
