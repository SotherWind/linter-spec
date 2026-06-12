import type { Linter } from 'eslint';

/**
 * Strict mode rule. ESLint 9 retains the legacy `strict` rule for non-module code.
 */
const strictRules: Linter.Config = {
  name: '@linter-spec/strict',
  rules: {
    strict: 'error',
  },
};

export default strictRules;
