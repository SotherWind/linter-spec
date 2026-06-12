import { doESLint, doMarkdownlint, doPrettier, doStylelint } from '../../lints/index.js';
import type { Config, PKG, ScanOptions, ScanReport, ScanResult } from '../../types.js';

/**
 * Run the enabled linters over the project and collect a unified report.
 * Each linter is isolated so one crashing does not abort the others.
 */
export async function orchestrate(
  options: ScanOptions,
  pkg: PKG,
  config: Config,
): Promise<ScanReport> {
  const { fix } = options;
  const runErrors: Error[] = [];
  let results: ScanResult[] = [];

  // Prettier first (only on fix), so subsequent linters see formatted code.
  if (fix && config.enablePrettier !== false) {
    try {
      await doPrettier(options);
    } catch (e) {
      runErrors.push(e as Error);
    }
  }

  if (config.enableESLint !== false) {
    try {
      results = results.concat(await doESLint({ ...options, pkg, config }));
    } catch (e) {
      runErrors.push(e as Error);
    }
  }

  if (config.enableStylelint !== false) {
    try {
      results = results.concat(await doStylelint({ ...options, pkg, config }));
    } catch (e) {
      runErrors.push(e as Error);
    }
  }

  if (config.enableMarkdownlint !== false) {
    try {
      results = results.concat(await doMarkdownlint({ ...options, pkg, config }));
    } catch (e) {
      runErrors.push(e as Error);
    }
  }

  return {
    results,
    errorCount: results.reduce((count, { errorCount }) => count + errorCount, 0),
    warningCount: results.reduce((count, { warningCount }) => count + warningCount, 0),
    runErrors,
  };
}
