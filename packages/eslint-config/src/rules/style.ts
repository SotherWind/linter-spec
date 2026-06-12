import stylistic from '@stylistic/eslint-plugin';
import type { ESLint, Linter } from 'eslint';

/**
 * Stylistic / formatting rules. In ESLint 9 these rules were moved out of core
 * to `@stylistic/eslint-plugin`. Rule names are unchanged except for the
 * `@stylistic/` prefix.
 */
const style: Linter.Config = {
  name: '@linter-spec/style',
  plugins: {
    '@stylistic': stylistic as unknown as ESLint.Plugin,
  },
  rules: {
    // Core style decisions matching fe-spec's old rules/base/style.js
    '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/comma-spacing': ['error', { before: false, after: true }],
    '@stylistic/comma-style': ['error', 'last'],
    '@stylistic/space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/spaced-comment': ['error', 'always', { exceptions: ['-', '+', '*'] }],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
    '@stylistic/keyword-spacing': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/padded-blocks': ['error', 'never'],
    '@stylistic/max-len': [
      'warn',
      { code: 120, ignoreUrls: true, ignoreComments: true, ignoreStrings: true },
    ],
    '@stylistic/block-spacing': 'error',
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/computed-property-spacing': ['error', 'never'],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/func-call-spacing': ['error', 'never'],
    '@stylistic/linebreak-style': 'off',
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/semi-spacing': ['error', { before: false, after: true }],
    '@stylistic/template-curly-spacing': ['error', 'never'],
  },
};

export default style;
