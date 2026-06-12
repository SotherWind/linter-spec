import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import type { ESLint, Linter } from 'eslint';

/**
 * React + react-hooks rules. Composes eslint-plugin-react's flat-config
 * `recommended` with eslint-plugin-react-hooks' rules.
 */
const reactConfig: Linter.Config[] = [
  (react.configs?.flat?.recommended as Linter.Config | undefined) ?? {
    name: '@linter-spec/react/recommended-fallback',
  },
  {
    name: '@linter-spec/react',
    plugins: {
      'react-hooks': reactHooks as unknown as ESLint.Plugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/self-closing-comp': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

export default reactConfig;
