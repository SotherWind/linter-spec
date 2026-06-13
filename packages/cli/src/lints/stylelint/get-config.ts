import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';
import fs from 'fs-extra';
import type { LinterOptions } from 'stylelint';

import type { Config, PKG, ScanOptions } from '../../types.js';
import { STYLELINT_IGNORE_PATTERN } from '../../utils/constants.js';

// Absolute path so Stylelint can resolve `extends` regardless of the project cwd.
const stylelintConfigPath = fileURLToPath(import.meta.resolve('@linter-spec/stylelint-config'));

/**
 * Build the Stylelint options. Uses the shared config unless the project
 * provides its own.
 */
export function getStylelintConfig(
  opts: ScanOptions,
  pkg: PKG,
  config: Config,
): Partial<LinterOptions> {
  const { cwd, fix } = opts;

  const lintConfig: Partial<LinterOptions> = {
    fix: Boolean(fix),
    allowEmptyInput: true,
  };

  if (config.stylelintOptions) {
    Object.assign(lintConfig, config.stylelintOptions);
    return lintConfig;
  }

  const userConfig =
    fg.sync('.stylelintrc?(.@(js|cjs|mjs|yaml|yml|json))', { cwd, dot: true }).length > 0 ||
    fg.sync('stylelint.config.@(js|mjs|cjs)', { cwd, dot: true }).length > 0 ||
    Boolean(pkg.stylelint);

  if (!userConfig) {
    lintConfig.config = { extends: [stylelintConfigPath] };
  }

  const ignoreFilePath = path.resolve(cwd, '.stylelintignore');
  if (!fs.existsSync(ignoreFilePath)) {
    lintConfig.ignorePattern = STYLELINT_IGNORE_PATTERN;
  }

  return lintConfig;
}
