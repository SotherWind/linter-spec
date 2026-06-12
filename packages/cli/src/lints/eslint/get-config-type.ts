import fg from 'fast-glob';
import type { PKG } from '../../types.js';

/**
 * Detect the project type from its files and dependencies.
 * The returned value is a `PROJECT_TYPES` value (e.g. `index`, `typescript`,
 * `typescript/react`) which maps directly onto a `@linter-spec/eslint-config`
 * export subpath.
 */
export function getESLintConfigType(cwd: string, pkg: PKG): string {
  const tsFiles = fg.sync('./!(node_modules)/**/*.@(ts|tsx)', { cwd });
  const reactFiles = fg.sync('./!(node_modules)/**/*.@(jsx|tsx)', { cwd });
  const vueFiles = fg.sync('./!(node_modules)/**/*.vue', { cwd });
  const dependencies = Object.keys(pkg.dependencies || {});
  const language = tsFiles.length > 0 ? 'typescript' : '';
  let dsl = '';

  if (reactFiles.length > 0 || dependencies.some((name) => /^react(-|$)/.test(name))) {
    dsl = 'react';
  } else if (vueFiles.length > 0 || dependencies.some((name) => /^vue(-|$)/.test(name))) {
    dsl = 'vue';
  }

  // `''` -> `index`, `typescript/` -> `typescript`, `/react` -> `react`, etc.
  return `${language}/${dsl}`.replace(/\/$/, '').replace(/^\//, '') || 'index';
}

/**
 * Resolve a project type to the `@linter-spec/eslint-config` import specifier.
 */
export function eslintConfigSpecifier(type: string): string {
  const base = '@linter-spec/eslint-config';
  return type === 'index' ? base : `${base}/${type}`;
}
