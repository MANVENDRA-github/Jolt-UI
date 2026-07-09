# DESIGN_SYSTEM — Jolt UI

How a component stays **identical across React, Vue, and Svelte**. This is the contract; `COMPONENT_GUIDE.md` is the procedure.

## The four single-sources (+ one enforcer)

| Layer                   | Lives in                                      | Rule                                                                                                                                     |
| ----------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Look**                | `@jolt/tokens` (`theme.css` + `tokens.ts`)    | All color/spacing/easing/duration/stagger + keyframes are defined once. Skins never hard-code these — they reference tokens.             |
| **Behavior**            | `@jolt/core/primitives/*`                     | Animation logic (timing, stagger, cleanup) is vanilla TS, written once. Skins call it; they never reimplement it.                        |
| **API**                 | `@jolt/core/schemas/*` (Zod)                  | One schema per component defines props + defaults. Each framework's prop types derive from `z.infer`. Add a prop once; all three get it. |
| **Behavior (CSS-only)** | `@jolt/tokens` keyframes + `@jolt/core/dom/*` | Pure-CSS components share keyframes + a tiny DOM splitter; no per-framework JS.                                                          |
| **Enforcer**            | Playwright `parity` E2E (Phase 1+)            | Renders all 3 demos at a deterministic frame; fails CI if they diverge beyond threshold.                                                 |

## Tokens

- Defined in `packages/tokens/src/theme.css` via Tailwind v4 `@theme` (emitted as CSS variables) + plain `:root`/`[data-theme]` blocks for light/dark surfaces.
- Motion tokens are **mirrored** in `tokens.ts` for the JS animation core; `tokens.test.ts` asserts every JS value appears in the CSS so they can't drift.
- **Naming:** brand colors `--color-jolt-*`; motion `--ease-jolt-*`, `--duration-jolt-*`, `--jolt-stagger`. Add new tokens here first, mirror in `tokens.ts` if the JS core needs them.

## Animation conventions

- **CSS / Web Animations first.** Reach for **GSAP** only when the effect needs sequencing/splitting/scroll-trigger. GSAP is a **peer dependency**, registered client-side in `core/motion.ts`, never bundled per component.
- **Respect `prefers-reduced-motion`:** every component renders a correct, static final state when reduced motion is requested (and the server-rendered HTML is that final state, so no-JS users see correct content).
- **Cleanup is mandatory:** the core primitive returns a `revert()` that kills tweens and restores the DOM; each skin calls it on unmount (`useGSAP` cleanup / `onUnmounted` / `onMount` return). A unit test asserts no leaked instances.
- **Determinism for tests:** animations are tested by _seeking_ to a frame, never by wall-clock timing.

## What a skin may and may not vary

- **May vary:** idiomatic lifecycle glue — React hooks vs Vue `onMounted`/`onUnmounted` vs Svelte `onMount` + cleanup; how props are declared per framework.
- **May NOT vary:** the look, the motion, the prop names/defaults/behavior. Anything a _user perceives_ is single-sourced. If you find yourself changing motion in one skin only, lift it into `core`.
