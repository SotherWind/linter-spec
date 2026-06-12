import type { Linter } from 'eslint';

/**
 * Apply an identifier blacklist via the `id-denylist` rule.
 * Replaces fe-spec's old `essential/rules/blacklist.js` + `es6-blacklist.js`
 * + `ts-blacklist.js` trio with a single helper.
 */
export function applyBlacklist(names: readonly string[]): Linter.Config {
  return {
    name: '@linter-spec/blacklist',
    rules: {
      'id-denylist': ['error', ...names],
    },
  };
}
