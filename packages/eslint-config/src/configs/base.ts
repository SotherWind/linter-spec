import js from '@eslint/js';
import globals from 'globals';
import type { Linter } from 'eslint';

import bestPractices from '../rules/best-practices.js';
import es6 from '../rules/es6.js';
import imports from '../rules/imports.js';
import possibleErrors from '../rules/possible-errors.js';
import style from '../rules/style.js';
import variables from '../rules/variables.js';

const JS_FILES = ['**/*.{js,mjs,cjs,jsx}'];

/**
 * Base JavaScript preset (the default `@linter-spec/eslint-config` entry).
 * Modern browser + Node globals, ES2022 module syntax.
 *
 * `files: ['**\/*.{js,mjs,cjs,jsx}']` is set so ESLint v9's default file
 * matcher accepts `.jsx` (otherwise only `.js`/`.mjs`/`.cjs` are linted by
 * default).
 */
const base: Linter.Config[] = [
  js.configs.recommended,
  {
    name: '@linter-spec/base/language',
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
  // Every block lints the same JS file set; apply `files` once here so ESLint
  // v9's default matcher accepts `.jsx` (otherwise only `.js`/`.mjs`/`.cjs`).
].map((config) => ({ ...config, files: JS_FILES }));

export default base;
