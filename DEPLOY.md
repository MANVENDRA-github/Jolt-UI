# DEPLOY — Jolt UI

Jolt UI is a **fully static** Astro site. The build also emits the jsrepo registry into
`dist/r/*`, so a single static deploy serves the gallery, the docs, and the `/r/*` registry
**from one origin** — no SSR adapter, no server.

## Host: Cloudflare Pages (Git integration)

Deploys run on every push to `main`, with free per-PR previews — no CI changes, no secrets.

### One-time setup (Cloudflare dashboard)

1. **Workers & Pages → Create → Pages → Connect to Git** → `MANVENDRA-github/Jolt-UI`.
2. Build settings:
   - **Build command:** `pnpm build`
   - **Build output directory:** `apps/site/dist`
   - **Root directory:** `/`
   - pnpm is auto-detected from `packageManager` in `package.json`.
3. **Environment variable:** `NODE_VERSION = 20`.
4. Deploy. The production URL is `https://<project-name>.pages.dev` (optionally attach a custom domain).

### What the build does

`pnpm build` = `registry:build` (jsrepo → `apps/site/public/r/*`) then `astro build`
(→ `apps/site/dist`, copying `public/` incl. `r/*`, `_headers`, `favicon.svg`, `og.svg`,
`robots.txt`, and running the Pagefind index into `dist/pagefind/`). Edge caching + security
headers come from `apps/site/public/_headers`.

## The origin constant (one value)

`packages/core/src/origin.ts` exports `JOLT_ORIGIN` — the **single source** for both the registry
base (`installInfo` → the `jsrepo add` commands shown on every component page) and astro's `site`
(canonical / Open Graph / sitemap). It is currently `https://jolt-ui.pages.dev`.

- If your Cloudflare project is named **`jolt-ui`**, this is already correct — nothing to change.
- Otherwise, **swap that one value** to your real origin, then update the few literals that hardcode it:
  - `packages/core/src/registry.test.ts`, `apps/site/src/lib/seo.test.ts`, `e2e/seo.spec.ts`
  - `apps/site/public/robots.txt` (the `Sitemap:` line)

## Verify after deploy

```bash
# The registry installs from the live origin (the one-origin proof):
npx jsrepo add https://<origin>/r/react/blur-in
```

Then spot-check in a browser: the homepage, `/components`, `/docs/getting-started`, the nav
**search** (it returns results in production), `https://<origin>/sitemap-index.xml`, and
`https://<origin>/r/react/registry.json`.
