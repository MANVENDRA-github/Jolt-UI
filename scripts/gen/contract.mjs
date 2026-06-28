// The component contract: the single declarative input the scaffolder reads to
// stamp a whole component slice. A contract lives at `scripts/contracts/<id>.mjs`
// as `export default { ... }`. `assertContract` validates it at runtime (the
// generator is plain Node — no compiler to lean on), failing loudly and early so
// a malformed contract never writes a half-broken slice.

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
 * @property {'css-per-char'|'css-whole-text'|'css-structural'|'gsap'} pattern
 * @property {string} blurb         one-line description (demo page subtitle).
 * @property {string} a11y          meta.a11y string.
 * @property {string[]} deps        peer deps beyond zod — [] or ['gsap'].
 * @property {PropSpec[]} props     ordered prop list.
 * @property {{ kind: 'per-char'|'whole-text', pixelParity: boolean }} parity
 * @property {Record<string, unknown>} demoProps    props for the three live demos.
 * @property {Record<string, unknown>} harnessProps props for the parity-harness cells.
 * @property {string} cardText      label on the /components index card.
 */

export const PATTERNS = ['css-per-char', 'css-whole-text', 'css-structural', 'gsap'];
export const PARITY_KINDS = ['per-char', 'whole-text'];
export const PROP_TYPES = ['string', 'number', 'boolean', 'enum', 'string[]'];

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const PASCAL = /^[A-Z][A-Za-z0-9]*$/;
const IDENT = /^[a-z][A-Za-z0-9]*$/;

/** A CSS-only pattern (behavior is a stylesheet, not a GSAP factory). */
export function isCssPattern(pattern) {
  return pattern === 'css-per-char' || pattern === 'css-whole-text' || pattern === 'css-structural';
}

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
    if (typeof prop.cssVar !== 'object' || prop.cssVar === null) fail(`${where}.cssVar must be an object`);
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
  for (const key of ['blurb', 'a11y', 'cardText']) {
    if (typeof c[key] !== 'string' || c[key].trim() === '') fail(`${key} must be a non-empty string`);
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

  if (!Array.isArray(c.props) || c.props.length === 0) fail('props must be a non-empty array');
  c.props.forEach(assertProp);
  if (!c.props.some((p) => p.required)) fail('at least one prop must be required');

  const parity = /** @type {Record<string, unknown>} */ (c.parity);
  if (!parity || typeof parity !== 'object') fail('parity must be an object');
  if (!PARITY_KINDS.includes(/** @type {string} */ (parity.kind))) {
    fail(`parity.kind must be one of ${PARITY_KINDS.join(', ')}`);
  }
  if (typeof parity.pixelParity !== 'boolean') fail('parity.pixelParity must be a boolean');

  for (const key of ['demoProps', 'harnessProps']) {
    if (!c[key] || typeof c[key] !== 'object' || Array.isArray(c[key])) {
      fail(`${key} must be an object`);
    }
  }

  return /** @type {ComponentContract} */ (raw);
}
