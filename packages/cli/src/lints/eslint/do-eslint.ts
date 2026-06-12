import path from 'node:path';
import { ESLint } from 'eslint';
import type { Config, PKG, ScanOptions } from '../../types.js';
import { ESLINT_FILE_EXT } from '../../utils/constants.js';
import { formatESLintResults } from './format-results.js';
import { getESLintConfig } from './get-config.js';

export interface DoESLintOptions extends ScanOptions {
  pkg: PKG;
  config: Config;
}

/** Glob (relative to cwd) covering every ESLint-handled extension. */
function buildPattern(cwd: string, include: string): string {
  const exts = ESLINT_FILE_EXT.map((ext) => ext.replace(/^\./, '')).join(',');
  const rel = path.relative(cwd, include).replace(/\\/g, '/');
  const prefix = rel && rel !== '.' ? `${rel}/` : '';
  return `${prefix}**/*.{${exts}}`;
}

export async function doESLint(
  options: DoESLintOptions,
): Promise<ReturnType<typeof formatESLintResults>> {
  let patterns: string[];
  if (options.files) {
    const files = options.files.filter((name) => ESLINT_FILE_EXT.includes(path.extname(name)));
    if (files.length === 0) return [];
    patterns = files;
  } else {
    patterns = [buildPattern(options.cwd, options.include || options.cwd)];
  }

  const eslintOptions = await getESLintConfig(options, options.pkg, options.config);
  const eslint = new ESLint(eslintOptions);
  const reports = await eslint.lintFiles(patterns);

  if (options.fix) {
    await ESLint.outputFixes(reports);
  }

  return formatESLintResults(reports, options.quiet, eslint);
}
