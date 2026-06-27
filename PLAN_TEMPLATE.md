# PLAN_TEMPLATE — Jolt UI

Copy this into your plan before starting any non-trivial task. Keep it short; fill every section.

---

## Task
<One sentence: what and why. Link the `ROADMAP.md` phase/item.>

## Scope
- **In:** <files/packages this touches>
- **Out:** <explicitly not touching>
- **Stays within phase:** <which ROADMAP phase>

## Approach
<2–6 bullets. For a component, name the schema/primitive/skins/demo/registry files per `COMPONENT_GUIDE.md`. Reuse existing core/tokens — don't reimplement.>

## Multi-framework impact
<If it adds/changes a component: confirm all three skins change together and how parity is preserved (shared core/tokens/schema). If single-framework, justify why.>

## Risks
<What could break; mitigation. e.g. SSR/hydration, drift, registry sync.>

## Test plan (test-first)
- **Failing test(s) to write first:** <…>
- **Unit:** <core logic / per-framework DOM parity / cleanup / reduced-motion>
- **E2E (if applicable):** <parity / copy / CLI smoke>

## Verification
- Commands: `pnpm verify` (+ `pnpm registry:check` / `pnpm test:e2e` if relevant) — capture output.
- Manual: <e.g. `pnpm dev`, open the component page, all 3 demos identical>

## Assumptions / flags
<Anything decided without asking; anything risky to surface in the PR. Record durable ones in `DECISIONS.md`.>
