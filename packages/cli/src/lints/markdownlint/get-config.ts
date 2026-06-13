import path from 'node:path';

import markdownlintConfig from '@linter-spec/markdownlint-config';
import fg from 'fast-glob';
import markdownlint from 'markdownlint';

import type { Config, PKG, ScanOptions } from '../../types.js';

export type MarkdownlintOptions = markdownlint.Options & { fix?: boolean };

/**
 * Build the markdownlint options. Uses the shared config unless the project
 * provides its own `.markdownlint.*`.
 */
export function getMarkdownlintConfig(
  opts: ScanOptions,
  _pkg: PKG,
  config: Config,
): MarkdownlintOptions {
  const { cwd } = opts;

  const lintConfig: MarkdownlintOptions = {
    fix: Boolean(opts.fix),
    resultVersion: 3,
  };

  if (config.markdownlintOptions) {
    Object.assign(lintConfig, config.markdownlintOptions);
    return lintConfig;
  }

  const userConfigFiles = fg.sync('.markdownlint?(-cli2).@(jsonc|json|yaml|yml)', {
    cwd,
    dot: true,
  });
  const [userConfigFile] = userConfigFiles;
  if (!userConfigFile) {
    lintConfig.config = markdownlintConfig;
  } else {
    lintConfig.config = markdownlint.readConfigSync(path.resolve(cwd, userConfigFile));
  }

  return lintConfig;
}
