import tsNode from '@linter-spec/eslint-config/typescript/node';

// This repo dog-foods its own preset: the workspace TS sources are linted with
// the `typescript/node` entry, plus a few overrides justified for this codebase.
export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/test/fixtures/**',
      'docs/.vitepress/**',
      'packages/cli/scripts/**',
    ],
  },
  ...tsNode,
  {
    rules: {
      // The packages are ESM and run on modern Node where the global `process`
      // is standard — `require("process")` would be a regression, not a fix.
      'n/prefer-global/process': 'off',
      // eslint-plugin-n's support data lags: `fetch` is stable on our engine
      // floor (Node 20.19+/22.12+), but the rule still flags it as experimental.
      'n/no-unsupported-features/node-builtins': 'off',
      // cli.ts is a published `bin` entry and must keep its shebang; the rule
      // does not read the bin field, so it wrongly reports "needs no shebang".
      'n/hashbang': 'off',
    },
  },
  {
    // Test files lean on non-null assertions for fixture/result access.
    files: ['**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    // Root tooling configs (.markdownlint-cli2.cjs, .prettierrc.cjs, commitlint.config.cjs)
    // are genuinely CommonJS — the package is type:module, so a .cjs extension is the
    // only way these `require()`/`module.exports` files load.
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
