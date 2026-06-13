import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

/**
 * TypeScript rules via the `typescript-eslint` umbrella package.
 * We use the plugin's `recommended` flat-config and override a few opinions
 * to match fe-spec's old rules/typescript.js.
 *
 * Note: deliberately uses non type-aware rules (no `parserOptions.project`)
 * so this config can be applied without users having to set up a tsconfig path.
 */
const tsConfig: Linter.Config[] = [
  ...(tseslint.configs.recommended as Linter.Config[]),
  {
    name: '@linter-spec/typescript',
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      // Disable core no-unused-vars in favour of the TS one
      'no-unused-vars': 'off',
    },
  },
];

export default tsConfig;
