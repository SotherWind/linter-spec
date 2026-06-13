import type { ESLint, Linter } from 'eslint';
import fg from 'fast-glob';

import { eslintConfigSpecifier, getESLintConfigType } from './get-config-type.js';
import type { Config, PKG, ScanOptions } from '../../types.js';
import { ESLINT_IGNORE_GLOBS } from '../../utils/constants.js';

/** True when the project ships its own ESLint flat config / inline config. */
function hasUserConfig(cwd: string, pkg: PKG): boolean {
  const flatConfig = fg.sync('eslint.config.@(js|mjs|cjs|ts|mts|cts)', { cwd, dot: true });
  return flatConfig.length > 0 || Boolean(pkg.eslintConfig);
}

/**
 * Build the ESLint 9 constructor options.
 *
 * - If the project has its own flat config, let ESLint discover it.
 * - Otherwise synthesise a `baseConfig` from the matching
 *   `@linter-spec/eslint-config` export (resolved relative to this package).
 */
export async function getESLintConfig(
  opts: ScanOptions,
  pkg: PKG,
  config: Config,
): Promise<ESLint.Options> {
  const { cwd, fix, ignore } = opts;

  const lintConfig: ESLint.Options = {
    cwd,
    fix,
    ignore: ignore !== false,
    errorOnUnmatchedPattern: false,
  };

  if (config.eslintOptions) {
    Object.assign(lintConfig, config.eslintOptions);
    return lintConfig;
  }

  if (hasUserConfig(cwd, pkg)) {
    // ESLint will auto-discover the project's own flat config.
    return lintConfig;
  }

  const type = getESLintConfigType(cwd, pkg);
  const specifier = eslintConfigSpecifier(type);
  const mod = (await import(specifier)) as { default?: Linter.Config[] };
  const baseConfig = (mod.default ?? (mod as unknown as Linter.Config[])) as Linter.Config[];

  lintConfig.overrideConfigFile = true;
  lintConfig.baseConfig = [...baseConfig, { ignores: ESLINT_IGNORE_GLOBS }];

  return lintConfig;
}
