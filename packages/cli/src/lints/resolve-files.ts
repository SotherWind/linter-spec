import path from 'node:path';

import fg from 'fast-glob';

import type { ScanOptions } from '../types.js';

/**
 * Resolve the absolute file list a linter should process: either the explicitly
 * passed `options.files` (filtered to `exts`, resolved against `cwd`) or a
 * fast-glob sweep of `options.include` for those extensions, honoring `ignore`.
 *
 * ESLint does its own globbing and works in relative patterns, so it does not
 * use this helper — see `do-eslint.ts`.
 */
export async function resolveScanFiles(
  options: ScanOptions,
  exts: string[],
  ignore: string[],
): Promise<string[]> {
  if (options.files) {
    return options.files
      .filter((name) => exts.includes(path.extname(name)))
      .map((name) => path.resolve(options.cwd, name));
  }

  const globExts = exts.map((ext) => ext.replace(/^\./, '')).join(',');
  const include = options.include || options.cwd;
  return fg(`**/*.{${globExts}}`, { cwd: include, ignore, absolute: true });
}
