// The component contract: the single declarative input the scaffolder reads to
// stamp a whole component slice. A contract lives at `scripts/contracts/<id>.mjs`
// as `export default { ... }`. `assertContract` validates it at runtime (the
// generator is plain Node — no compiler to lean on), failing loudly and early so
// a malformed contract never writes a half-broken slice.
//
// Three component kinds are scaffoldable (D-040):
//   - text       (`per-char` / `whole-text`) — a `text` prop, split or rendered whole
//   - container  (`container`)               — a presentational <div> wrapping children (cards, effects)
//   - interactive(`interactive`)             — a native <button> with a `label` fallback
// Loaders (`graphic`) and Three.js backgrounds stay hand-written.

/**
 * @typedef {Object} PropSpec
 * @property {string} name                      camelCase prop name.
 * @property {'string'|'number'|'boolean'|'enum'|'string[]'} type
 * @property {boolean} [required]               true → required (no default).
 * @property {string|number|boolean|string[]} [default]  default value (when not required).
 * @property {string[]} [values]                allowed values, for type 'enum'.
 * @property {string} describe                  one-line docs string (drives the props table).
 * @property {{ name: string, unit?: string }} [cssVar]  CSS-only: maps the prop to a --jolt-* var.
 */

/**
 * @typedef {Object} ComponentContract
 * @property {string} id            kebab-case id (file/route/registry/testid).
 * @property {string} name          PascalCase component name (export + folder).
 * @property {'css-per-char'|'css-whole-text'|'css-structural'|'css-container'|'css-interactive'|'gsap'} pattern
 * @property {'text'|'card'|'button'|'effect'|'ui'} [category]  meta.category + URL segment. Default 'text'.
 * @property {string} blurb         one-line description (demo page subtitle).
 * @property {string} a11y          meta.a11y string.
 * @property {string[]} deps        peer deps beyond zod — [] or ['gsap'].
 * @property {boolean} [hydrate]    true → previews/parity cells need a client directive (pointer-driven).
 * @property {PropSpec[]} props     ordered prop list.
 * @property {{ kind: 'per-char'|'whole-text'|'container'|'interactive', pixelParity: boolean }} parity
 * @property {Record<string, unknown>} demoProps    props for the three live demos.
 * @property {Record<string, unknown>} harnessProps props for the parity-harness cells.
 * @property {string} cardText      label on the /components index card.
 */

export const PATTERNS = [
  'css-per-char',
  'css-whole-text',
  'css-structural',
  'css-container',
  'css-interactive',
  'gsap',
];
export const PARITY_KINDS = ['per-char', 'whole-text', 'container', 'interactive'];
export const PROP_TYPES = ['string', 'number', 'boolean', 'enum', 'string[]'];

/**
 * The categories the scaffolder can emit, mapped to their plural URL segment. The
 * singular id matches `meta.category`; the slug is the `/components/<slug>/` route
 * and the `gen:card:<slug>` marker in the gallery index (mirrors `apps/site/src/lib/categories.ts`).
 */
export const CATEGORY_SLUGS = {
  text: 'text',
  card: 'cards',
  button: 'buttons',
  effect: 'effects',
  ui: 'ui',
};
export const CATEGORIES = Object.keys(CATEGORY_SLUGS);

/** A contract's category (defaulted) → its plural URL segment. */
export function categorySlug(category) {
  return CATEGORY_SLUGS[category ?? 'text'];
}

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const PASCAL = /^[A-Z][A-Za-z0-9]*$/;
const IDENT = /^[a-z][A-Za-z0-9]*$/;

/** A CSS-only pattern (behavior is a stylesheet, not a GSAP factory). */
export function isCssPattern(pattern) {
  return pattern !== 'gsap' && PATTERNS.includes(pattern);
}

/** A text component (a `text` prop the skin renders or splits). */
export function isTextKind(kind) {
  return kind === 'per-char' || kind === 'whole-text';
}

/** Props that never map to a `--jolt-*` custom property. */
const NON_CSS_VAR_PROPS = new Set(['text', 'by', 'label']);

function fail(msg) {
  throw new Error(`gen-component: invalid contract — ${msg}`);
}

function assertProp(prop, i) {
  const where = `props[${i}]`;
  if (!prop || typeof prop !== 'object') fail(`${where} must be an object`);
  if (typeof prop.name !== 'string' || !IDENT.test(prop.name)) {
    fail(`${where}.name must be a camelCase identifier`);
  }
  if (!PROP_TYPES.includes(prop.type)) {
    fail(`${where}.type must be one of ${PROP_TYPES.join(', ')} (got ${String(prop.type)})`);
  }
  if (typeof prop.describe !== 'string' || prop.describe.trim() === '') {
    fail(`${where}.describe must be a non-empty string`);
  }
  if (prop.required === true) {
    if (prop.default !== undefined) fail(`${where} is required, so it must not have a default`);
  } else if (prop.default === undefined) {
    fail(`${where} must be required:true or have a default`);
  }
  if (prop.type === 'enum') {
    if (!Array.isArray(prop.values) || prop.values.length === 0) {
      fail(`${where}.values must be a non-empty array for an enum prop`);
    }
    if (!prop.values.every((v) => typeof v === 'string')) fail(`${where}.values must be strings`);
    if (prop.default !== undefined && !prop.values.includes(prop.default)) {
      fail(`${where}.default must be one of its enum values`);
    }
  }
  if (prop.cssVar !== undefined) {
    if (typeof prop.cssVar !== 'object' || prop.cssVar === null)
      fail(`${where}.cssVar must be an object`);
    if (typeof prop.cssVar.name !== 'string' || !prop.cssVar.name.startsWith('--')) {
      fail(`${where}.cssVar.name must be a custom property starting with --`);
    }
  }
}

/**
 * Validate a component contract, throwing on the first problem. Returns the
 * contract (typed as ComponentContract) so callers can `const c = assertContract(raw)`.
 * @param {unknown} raw
 * @returns {ComponentContract}
 */
export function assertContract(raw) {
  if (!raw || typeof raw !== 'object') fail('contract must be an object');
  const c = /** @type {Record<string, unknown>} */ (raw);

  if (typeof c.id !== 'string' || !KEBAB.test(c.id)) fail('id must be kebab-case');
  if (typeof c.name !== 'string' || !PASCAL.test(c.name)) fail('name must be PascalCase');
  if (!PATTERNS.includes(/** @type {string} */ (c.pattern))) {
    fail(`pattern must be one of ${PATTERNS.join(', ')} (got ${String(c.pattern)})`);
  }
  if (c.category !== undefined && !CATEGORIES.includes(/** @type {string} */ (c.category))) {
    fail(`category must be one of ${CATEGORIES.join(', ')} (got ${String(c.category)})`);
  }
  if (c.hydrate !== undefined && typeof c.hydrate !== 'boolean') fail('hydrate must be a boolean');
  for (const key of ['blurb', 'a11y', 'cardText']) {
    if (typeof c[key] !== 'string' || c[key].trim() === '')
      fail(`${key} must be a non-empty string`);
  }
  if (!Array.isArray(c.deps) || !c.deps.every((d) => typeof d === 'string')) {
    fail('deps must be an array of strings');
  }
  // Keep deps coherent with the pattern: GSAP needs gsap; CSS must not pull it.
  const declaresGsap = /** @type {string[]} */ (c.deps).includes('gsap');
  if (c.pattern === 'gsap' && !declaresGsap) fail("a 'gsap' pattern must list 'gsap' in deps");
  if (isCssPattern(/** @type {string} */ (c.pattern)) && declaresGsap) {
    fail("a CSS pattern must not list 'gsap' in deps");
  }

  const parity = /** @type {Record<string, unknown>} */ (c.parity);
  if (!parity || typeof parity !== 'object') fail('parity must be an object');
  const kind = /** @type {string} */ (parity.kind);
  if (!PARITY_KINDS.includes(kind)) fail(`parity.kind must be one of ${PARITY_KINDS.join(', ')}`);
  if (typeof parity.pixelParity !== 'boolean') fail('parity.pixelParity must be a boolean');

  // The container/interactive patterns and kinds are two views of one decision — a
  // mismatch would emit a <div> skin behind an INTERACTIVE parity assert (or vice versa).
  if (c.pattern === 'css-container' && kind !== 'container') {
    fail("pattern 'css-container' requires parity.kind 'container'");
  }
  if (c.pattern === 'css-interactive' && kind !== 'interactive') {
    fail("pattern 'css-interactive' requires parity.kind 'interactive'");
  }
  if (kind === 'container' && c.pattern !== 'css-container') {
    fail("parity.kind 'container' requires pattern 'css-container'");
  }
  if (kind === 'interactive' && c.pattern !== 'css-interactive') {
    fail("parity.kind 'interactive' requires pattern 'css-interactive'");
  }

  if (!Array.isArray(c.props) || c.props.length === 0) fail('props must be a non-empty array');
  c.props.forEach(assertProp);

  if (isTextKind(kind)) {
    // The generated skins render `text` (the animated content); per-char skins also
    // split it with `splitSegments(text, by)`, so it must be a required prop.
    if (!c.props.some((p) => p.required)) fail('at least one prop must be required');
    const textProp = c.props.find((p) => p.name === 'text');
    if (!textProp || textProp.type !== 'string') fail("a 'text' string prop is required");
    if (kind === 'per-char') {
      const byProp = c.props.find((p) => p.name === 'by');
      if (!byProp || byProp.type !== 'enum') fail("a per-char component needs a 'by' enum prop");
    }
  } else if (kind === 'interactive') {
    // A button's text comes from children/slot, with `label` as the fallback (D-036).
    // Its visual props are all defaulted, so there is no required prop.
    const labelProp = c.props.find((p) => p.name === 'label');
    if (!labelProp || labelProp.type !== 'string') fail("a 'label' string prop is required");
  }
  // Containers carry neither `text` nor `label` — the content is the consumer's (D-037).

  // For CSS components, every tunable beyond text/by/label maps to a --jolt-* custom
  // property the skin sets — so each such prop must declare a cssVar (and is used).
  if (isCssPattern(/** @type {string} */ (c.pattern))) {
    for (const p of c.props) {
      if (NON_CSS_VAR_PROPS.has(p.name)) continue;
      if (!p.cssVar) fail(`CSS prop '${p.name}' must declare a cssVar`);
    }
  }

  for (const key of ['demoProps', 'harnessProps']) {
    if (!c[key] || typeof c[key] !== 'object' || Array.isArray(c[key])) {
      fail(`${key} must be an object`);
    }
  }

  return /** @type {ComponentContract} */ (raw);
}
