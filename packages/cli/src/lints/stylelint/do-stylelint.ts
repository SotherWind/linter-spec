import stylelint from 'stylelint';
import type { Config, PKG, ScanOptions } from '../../types.js';
import { STYLELINT_FILE_EXT, STYLELINT_IGNORE_PATTERN } from '../../utils/constants.js';
import { resolveScanFiles } from '../resolve-files.js';
import { formatStylelintResults } from './format-results.js';
import { getStylelintConfig } from './get-config.js';

export interface DoStylelintOptions extends ScanOptions {
  pkg: PKG;
  config: Config;
}

export async function doStylelint(
  options: DoStylelintOptions,
): Promise<ReturnType<typeof formatStylelintResults>> {
  const files = await resolveScanFiles(options, STYLELINT_FILE_EXT, STYLELINT_IGNORE_PATTERN);
  if (files.length === 0) return [];

  const data = await stylelint.lint({
    ...getStylelintConfig(options, options.pkg, options.config),
    files,
  });

  return formatStylelintResults(data.results, options.quiet);
}
