/**
 * Identifier blacklist applied via `id-denylist`/`id-blacklist`.
 * These are commonly-overloaded global names that shadow built-ins
 * and tend to produce confusing code.
 */
export const ID_BLACKLIST: readonly string[] = [
  'callback',
  'cb',
  'data',
  'err',
  'e',
  'i',
  'j',
  'k',
];

/**
 * ES6 / module-system blacklist. These globals or patterns shouldn't appear
 * in modern source.
 */
export const ES6_BLACKLIST: readonly string[] = ['arguments'];

/**
 * TypeScript-specific blacklist — features that are technically allowed but
 * discouraged inside our codebase.
 */
export const TS_BLACKLIST: readonly string[] = [
  // Reserved as expansion point; currently empty.
];
