import js from '@eslint/js';
import globals from 'globals';
import type { Linter } from 'eslint';

import bestPractices from '../rules/best-practices.js';
import es6 from '../rules/es6.js';
import imports from '../rules/imports.js';
import possibleErrors from '../rules/possible-errors.js';
import style from '../rules/style.js';
import variables from '../rules/variables.js';

// Anchors `.jsx` into the lintable set (ESLint v9's default is js/mjs/cjs only)
// AND restricts the JS-specific languageOptions block below to JS-shaped files
// so the TS parser/globals from typescript-eslint aren't fought on .ts/.tsx.
const JS_FILES = ['**/*.{js,mjs,cjs,jsx}'];

/**
 * Base JavaScript preset (the default `@linter-spec/eslint-config` entry).
 * Modern browser + Node globals, ES2022 module syntax.
 *
 * Pure-rules blocks (best-practices, es6, etc.) are intentionally left without
 * a `files` matcher so they ALSO apply to `.ts`/`.tsx` — universal hygiene
 * rules like `no-var`, `eqeqeq`, `array-callback-return` should hold for
 * TypeScript code too. typescript-eslint overrides the few rules that have a
 * TS-aware replacement (e.g. `no-unused-vars`).
 */
const base: Linter.Config[] = [
  js.configs.recommended,
  {
    name: '@linter-spec/base/language',
    // JS-specific parser/globals — keep scoped to JS files so TS files inherit
    // typescript-eslint's parser instead. Doubles as the .jsx file-set anchor.
    files: JS_FILES,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  possibleErrors,
  bestPractices,
  variables,
  es6,
  imports,
  style,
];

export default base;
