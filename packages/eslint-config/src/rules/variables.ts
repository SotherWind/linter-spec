import type { Linter } from 'eslint';

/**
 * Variable declaration / scope rules.
 * Ported from fe-spec rules/base/variables.js.
 */
const variables: Linter.Config = {
  name: '@linter-spec/variables',
  rules: {
    'init-declarations': 'off',
    'no-catch-shadow': 'off',
    'no-delete-var': 'error',
    'no-label-var': 'error',
    'no-restricted-globals': 'off',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'off',
    'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
    'no-use-before-define': ['error', { functions: false, classes: false }],
  },
};

export default variables;
