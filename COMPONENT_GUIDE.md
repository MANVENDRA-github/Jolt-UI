# COMPONENT_GUIDE — adding a component to Jolt UI

The repeatable unit of work. A new component = **one small PR** that touches a predictable set of files. Follow `DESIGN_SYSTEM.md` for the rules; this is the procedure. Test-first throughout (`TEST_CONTRACT.md`).

> Naming: kebab-case id (`split-text`), PascalCase component (`SplitText`). Use the id in the registry, schema filename, and demo folder; the PascalCase name for the exported component.

## Steps

1. **Contract (core).** Add `packages/core/src/schemas/<id>.ts`: a Zod schema for props with `.default()`s, plus `export type XProps = z.infer<...>` and a `meta` (id, category, deps, a11y note). Write a failing test for the defaults; make it pass.

2. **Behavior (core).** If the effect needs JS, add `packages/core/src/primitives/<id>.ts` exporting a factory `(el, opts) => { play, pause, revert }` (vanilla TS + GSAP if needed). If pure-CSS, add keyframes to `@jolt/tokens` and (if splitting text) reuse `core/dom/split.ts` instead. Unit-test the pure logic.

3. **Three skins.** Add `SplitText` to each of `packages/{react,vue,svelte}/src/components/<Name>/`:
   - React: `useGSAP`/`useEffect` calling the core, returning `revert` for cleanup.
   - Vue: `<script setup lang="ts">`, `onMounted` to start, `onUnmounted` to `revert`.
   - Svelte: `onMount` returning the cleanup that calls `revert`.
   - Props come from the Zod-derived type; defaults from the schema. Re-export from each package's `index.ts`.
   - Update the package's hand-written `types.d.ts` (vue/svelte) until generated types exist.

4. **Unit tests (per framework).** Assert: identical DOM for identical props **across all three**; defaults applied; `revert` called on unmount (no leaked tweens); reduced-motion renders the final state.

5. **Demo + docs (site).** Add `apps/site/src/demos/<id>/{React,Vue,Svelte}Demo.*` and a component page that mounts all three as islands with tabbed source (expressive-code) + copy. Add the MDX doc with a props table generated from the schema. Pick client directives by risk (`client:visible` for SSR-safe, `client:only` for DOM-measuring/canvas).

6. **Registry.** Add the component's blocks to `packages/registry/jsrepo.config.ts` (`react|vue|svelte/<id>` + any shared `lib/core`/`lib/tokens` deps + peer deps like `gsap`). Run `pnpm registry:build`; ensure `pnpm registry:check` (source === block === code tab) is green.

7. **Parity + CLI E2E.** Add/extend the Playwright parity test (3 demos match at the deterministic frame) and confirm the CLI smoke test installs the component into the fixture and typechecks.

8. **Gate.** `pnpm verify` green, capture output in the PR. Update `PROGRESS.md`.

## Definition of done for a component

Exists in all three frameworks · identical look/motion/API (parity green) · copy-paste === CLI === source (sync green) · documented with a schema-driven props table · reduced-motion + cleanup tested · `pnpm verify` green.
