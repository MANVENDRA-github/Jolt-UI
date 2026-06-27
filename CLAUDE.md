# CLAUDE.md

Operating guidance for any AI assistant (or human) working on **Jolt UI**. Read this first, every session.

The product source of truth is `PRP_SPEC.md`. The build order is `ROADMAP.md`. The live state across sessions is `PROGRESS.md` — **read it at the start and update it at the end of every session.** Test rules are binding in `TEST_CONTRACT.md`. The design contract every component obeys is `DESIGN_SYSTEM.md`; the steps to add one are `COMPONENT_GUIDE.md`. Architecture decisions are logged in `DECISIONS.md`. Plan non-trivial work with `PLAN_TEMPLATE.md` first.

## Project

**What this is:** Jolt UI is a **multi-framework animated UI component gallery** — a website where developers browse animated/interactive components and consume them for **React, Vue, and Svelte** via copy-paste or a CLI registry. Unlike react-bits (React-only, with separate drifting Vue/Svelte ports), Jolt UI ships all three frameworks from **one design language**, kept identical by a shared animation core and an automated parity gate. For: front-end developers who want polished motion components in whichever framework they use.

**Stack** (do not introduce alternatives without updating this file + `DECISIONS.md`):

- Language: **TypeScript 5.x**, `strict: true`, ESM. Runtime: **Node.js ≥ 20.3**. Package manager: **pnpm** workspaces.
- Site / docs: **Astro 5** (static) — renders React + Vue + Svelte islands on one page.
- Components: **React 19**, **Vue 3.5**, **Svelte 5**, each in **TS + Tailwind** (v1; JS/plain-CSS variants deferred).
- Styling: **Tailwind v4** (CSS-first `@theme`) + shared CSS-var tokens in `@jolt/tokens`.
- Animation: CSS / Web Animations first; **GSAP** when needed; Three.js deferred to the Backgrounds category.
- Registry / CLI: **jsrepo** (planned Phase 1+) — copy-paste + `npx jsrepo add`.
- Tests: **Vitest** (one project per framework) + `@testing-library/{react,vue,svelte}`; **Playwright** for the site (planned).
- Quality: **ESLint** (flat config) + **Prettier**. CI: **GitHub Actions**.

**Commands** (canonical — use these, don't invent):

- Install: `pnpm install`
- Dev (site): `pnpm dev`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck` (tsc + vue-tsc + svelte-check + astro check)
- Lint: `pnpm lint` (fix: `pnpm lint:fix`) · Format: `pnpm format`
- Test: `pnpm test` (watch: `pnpm test:watch`, coverage: `pnpm test:cov`)
- **Pre-PR gate (must pass): `pnpm verify`** = typecheck + lint + test. (Registry sync + E2E join the gate in later phases.)

**Structure** (build per `ROADMAP.md`; don't scaffold ahead of the current phase):

- `apps/site/` — Astro gallery + docs.
- `packages/tokens/` — the design language (CSS-var tokens + keyframes). Single source of visual identity.
- `packages/core/` — framework-agnostic behavior + Zod prop schemas (added Phase 1). The anti-drift core.
- `packages/{react,vue,svelte}/` — thin framework skins over `core`.
- `packages/registry/` — jsrepo config (added Phase 1+).

## Coding style (strict — not suggestions)

- **`strict: true` stays on. No `any`.** Unknown shapes are `unknown`, narrowed by a Zod schema or type guard. Never `as any`.
- **Silence a type error with `// @ts-expect-error` + a one-line reason — never `// @ts-ignore` / `// @ts-nocheck`.**
- **One design language, three skins.** Look lives in `@jolt/tokens`, behavior + API in `@jolt/core`. A framework skin may only differ in idiomatic lifecycle glue — never in look, motion, or props. If you're reimplementing animation logic per framework, stop and lift it into `core`.
- **Functional core, imperative shell.** Pure decision logic (animation math, prop parsing) separate from I/O (DOM, lifecycle).
- **Small modules, named exports, no default exports** (except framework component files, which export a default component). Read 2–3 existing files and match conventions before adding new ones.
- **Fail visibly.** No `catch {}` that hides a failure.

## How to work

**Read `PROGRESS.md` first.** It tells you the current phase, what's done, and how to resume. **Plan before coding** for non-trivial work (`PLAN_TEMPLATE.md`). Stay in the current ROADMAP phase.

**Test-first is mandatory** (`TEST_CONTRACT.md`). Write a failing test that captures the behavior, watch it fail for the right reason, make it pass. No production code without a test that would fail without it. No live network in unit tests.

**Simplicity first.** Minimum code for the current phase. No speculative abstractions. If 200 lines could be 50, write 50.

**Surgical changes.** Touch only what the task requires. Match existing style. Every changed line traces to the task.

**Verify, don't assume done.** Run `pnpm verify` before finishing and capture the output. This repo is proof-first: show the green run.

**Working asynchronously.** When unsupervised, don't stop to ask unless truly blocked — make the most reasonable choice, proceed, and record the assumption in the PLAN / PR body and `PROGRESS.md`.

**End every session by updating `PROGRESS.md`** (what you did, what's next, any new decisions/known issues).

## Definition of done

Before opening a PR: `pnpm verify` passes; new behavior is covered by a test that fails without the change; the component (if any) exists in all three frameworks and passes parity; no stray debug output, commented-out code, or TODOs you introduced; no secrets; `DECISIONS.md` updated if you made an architectural choice; `PROGRESS.md` updated; the change does only what the current ROADMAP phase asked.

## Pull requests

One focused PR per task or phase-slice, small and reviewable. Conventional-commit title (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`). Body: what changed (1–2 sentences), why (the ROADMAP item), how to verify (exact commands), assumptions/flags. Write it to be approved from a phone.

## Never

- Never commit secrets, API keys, tokens, or `.env` files.
- Never push directly to `main` — always a feature branch + PR (once a remote exists).
- Never use `any`, `// @ts-ignore`, or `as any` to get past the type-checker.
- Never let a component's frameworks drift in look/motion/API — fix the shared source, not one skin.
- Never let a unit test hit a live network endpoint.
- Never delete or rewrite files outside the task's scope.
