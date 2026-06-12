// dist/utils/constants.js (and src/utils/constants.ts) are both two levels deep,
// so the relative path to the package manifest is identical at build & runtime.
import pkg from '../../package.json' with { type: 'json' };

export const UNICODE = {
  success: '✔', // ✔
  failure: '✖', // ✖
} as const;

/** npm package name, e.g. `@linter-spec/cli` (used for install / update). */
export const PKG_NAME: string = pkg.name;

/** Package version. */
export const PKG_VERSION: string = pkg.version;

/** The user-facing command name / config-file prefix, e.g. `linter-spec`. */
export const CLI_NAME = 'linter-spec';

/**
 * Project types — values map 1:1 to `@linter-spec/eslint-config` export
 * subpaths (`index` → the package root export).
 */
export const PROJECT_TYPES: Array<{ name: string; value: string }> = [
  { name: '未使用 React、Vue、Node.js 的项目（JavaScript）', value: 'index' },
  { name: '未使用 React、Vue、Node.js 的项目（TypeScript）', value: 'typescript' },
  { name: 'React 项目（JavaScript）', value: 'react' },
  { name: 'React 项目（TypeScript）', value: 'typescript/react' },
  { name: 'Vue 项目（JavaScript）', value: 'vue' },
  { name: 'Vue 项目（TypeScript）', value: 'typescript/vue' },
  { name: 'Node.js 项目（JavaScript）', value: 'node' },
  { name: 'Node.js 项目（TypeScript）', value: 'typescript/node' },
  { name: '使用 ES5 及之前版本 JavaScript 的老项目', value: 'es5' },
];

/** ESLint scan file extensions. */
export const ESLINT_FILE_EXT: string[] = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs', '.cjs'];

/**
 * ESLint flat-config global ignore globs.
 * (ESLint 9 dropped `.eslintignore`; ignores now live in the flat config.)
 */
export const ESLINT_IGNORE_GLOBS: string[] = [
  '**/node_modules/**',
  '**/build/**',
  '**/dist/**',
  '**/coverage/**',
  '**/es/**',
  '**/lib/**',
  '**/*.min.js',
  '**/*-min.js',
  '**/*.bundle.js',
];

/** Stylelint scan file extensions. */
export const STYLELINT_FILE_EXT: string[] = ['.css', '.scss', '.less', '.acss'];

/** Stylelint ignore patterns. */
export const STYLELINT_IGNORE_PATTERN: string[] = [
  '**/node_modules/**',
  '**/build/**',
  '**/dist/**',
  '**/coverage/**',
  '**/es/**',
  '**/lib/**',
  '**/*.min.css',
  '**/*-min.css',
  '**/*.bundle.css',
];

/** markdownlint scan file extensions. */
export const MARKDOWN_LINT_FILE_EXT: string[] = ['.md'];

/**
 * markdownlint ignore patterns — micromatch globs.
 *
 * Used as fast-glob's `ignore` in `linter-spec scan/fix`, AND emitted into the
 * generated `.markdownlint-cli2.cjs`'s `ignores` field which markdownlint-cli2
 * matches with micromatch. Globs that work in both: `**\/<dir>/**`.
 */
export const MARKDOWN_LINT_IGNORE_PATTERN: string[] = [
  '**/node_modules/**',
  '**/build/**',
  '**/dist/**',
  '**/coverage/**',
  '**/es/**',
  '**/lib/**',
];

/** Prettier scan file extensions (union of the lint extensions). */
export const PRETTIER_FILE_EXT: string[] = [
  ...STYLELINT_FILE_EXT,
  ...ESLINT_FILE_EXT,
  ...MARKDOWN_LINT_FILE_EXT,
];

/** Prettier ignore patterns. */
export const PRETTIER_IGNORE_PATTERN: string[] = [
  'node_modules/**/*',
  'build/**/*',
  'dist/**/*',
  'lib/**/*',
  'es/**/*',
  'coverage/**/*',
];
