import type { Linter } from 'eslint';

/**
 * ES5 / legacy-browser rules. Tightens or relaxes rules to match an ES5 target:
 * - no `let` / `const` enforcement removed
 * - var declarations allowed
 * - prefer-* rules disabled
 */
const es5: Linter.Config = {
  name: '@linter-spec/es5',
  languageOptions: {
    ecmaVersion: 5,
    sourceType: 'script',
  },
  rules: {
    'no-var': 'off',
    'prefer-const': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'prefer-template': 'off',
    'object-shorthand': 'off',
    'arrow-body-style': 'off',
    'no-use-before-define': ['error', 'nofunc'],
  },
};

export default es5;
