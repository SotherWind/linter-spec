import fsExtra from 'fs-extra';
import markdownlint, { type LintError } from 'markdownlint';
import { applyFixes } from 'markdownlint-rule-helpers';
import type { Config, PKG, ScanOptions } from '../../types.js';
import { MARKDOWN_LINT_FILE_EXT, MARKDOWN_LINT_IGNORE_PATTERN } from '../../utils/constants.js';
import { resolveScanFiles } from '../resolve-files.js';
import { formatMarkdownlintResults } from './format-results.js';
import { getMarkdownlintConfig } from './get-config.js';

const { readFile, writeFile } = fsExtra;

export interface DoMarkdownlintOptions extends ScanOptions {
  pkg: PKG;
  config: Config;
}

export async function doMarkdownlint(
  options: DoMarkdownlintOptions,
): Promise<ReturnType<typeof formatMarkdownlintResults>> {
  const files = await resolveScanFiles(
    options,
    MARKDOWN_LINT_FILE_EXT,
    MARKDOWN_LINT_IGNORE_PATTERN,
  );
  if (files.length === 0) return [];

  const results = await markdownlint.promises.markdownlint({
    ...getMarkdownlintConfig(options, options.pkg, options.config),
    files,
  });

  if (options.fix) {
    await Promise.all(
      Object.keys(results).map((filename) => fixMarkdownFile(filename, results[filename] ?? [])),
    );
  }

  return formatMarkdownlintResults(results, options.quiet);
}

async function fixMarkdownFile(filename: string, errors: LintError[]): Promise<LintError[]> {
  const fixes = errors?.filter((error) => error.fixInfo);

  if (fixes?.length > 0) {
    const originalText = await readFile(filename, 'utf8');
    const fixedText = applyFixes(originalText, fixes);
    if (originalText !== fixedText) {
      await writeFile(filename, fixedText, 'utf8');
      return errors.filter((error) => !error.fixInfo);
    }
  }
  return errors;
}
