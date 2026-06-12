import importX from 'eslint-plugin-import-x';
import type { ESLint, Linter } from 'eslint';

/**
 * Module/import rules via eslint-plugin-import-x (the community fork of
 * eslint-plugin-import with better flat-config + ESLint 9 support).
 */
const imports: Linter.Config = {
  name: '@linter-spec/imports',
  plugins: {
    'import-x': importX as unknown as ESLint.Plugin,
  },
  rules: {
    'import-x/no-unresolved': 'off',
    'import-x/named': 'error',
    'import-x/default': 'error',
    'import-x/namespace': 'error',
    'import-x/no-absolute-path': 'error',
    'import-x/no-self-import': 'error',
    'import-x/no-mutable-exports': 'error',
    'import-x/no-named-as-default': 'warn',
    'import-x/no-named-as-default-member': 'warn',
    'import-x/no-duplicates': 'error',
    'import-x/first': 'error',
    'import-x/newline-after-import': 'error',
    'import-x/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};

export default imports;
