import jsxA11y from 'eslint-plugin-jsx-a11y';
import type { ESLint, Linter } from 'eslint';

/**
 * JSX a11y rules via eslint-plugin-jsx-a11y (v6.10+ supports flat config).
 */
const jsxA11yConfig: Linter.Config[] = [
  (jsxA11y.flatConfigs?.recommended as Linter.Config | undefined) ?? {
    name: '@linter-spec/jsx-a11y/recommended-fallback',
    plugins: {
      'jsx-a11y': jsxA11y as unknown as ESLint.Plugin,
    },
  },
];

export default jsxA11yConfig;
