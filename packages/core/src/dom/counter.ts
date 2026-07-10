/**
 * Pure digit resolution for the Counter — no DOM. The skins render one rolling column per digit,
 * so they need the target value split into its digits (and the accessible label). Keeping this
 * here means the React/Vue/Svelte skins share one implementation and it is unit-testable.
 */

export interface CounterCells {
  /** The accessible number, e.g. `"42"` — carried on an aria-label. */
  label: string;
  /** One digit (0–9) per rolling column, most-significant first. */
  digits: number[];
}

/**
 * Split `value` into rolling-column digits, zero-padded to at least `minDigits`. The value is
 * floored to an integer and taken as its absolute magnitude — this is a digit-roll display
 * (like a car odometer), not a formatter: fractions and signs have no column to roll in. A
 * non-finite value collapses to 0 rather than producing `NaN` columns.
 */
export function counterCells(value: number, minDigits = 1): CounterCells {
  const n = Number.isFinite(value) ? Math.abs(Math.floor(value)) : 0;
  const label = String(n).padStart(Math.max(1, Math.trunc(minDigits)), '0');
  return { label, digits: label.split('').map(Number) };
}
