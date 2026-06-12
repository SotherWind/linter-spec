import type markdownlint from 'markdownlint';
import type { ScanResult } from '../../types.js';

/**
 * Normalise markdownlint results into the shared `ScanResult` shape.
 * markdownlint findings are always warnings.
 */
export function formatMarkdownlintResults(
  results: markdownlint.LintResults,
  quiet: boolean | undefined,
): ScanResult[] {
  const parsedResults: ScanResult[] = [];

  for (const file in results) {
    if (!Object.prototype.hasOwnProperty.call(results, file) || quiet) continue;

    const fileErrors = results[file];
    if (!fileErrors) continue;

    let warningCount = 0;
    let fixableWarningCount = 0;
    const messages = fileErrors.map(
      ({ lineNumber, ruleNames, ruleDescription, ruleInformation, errorRange, fixInfo }) => {
        if (fixInfo) fixableWarningCount++;
        warningCount++;

        return {
          line: lineNumber,
          column: Array.isArray(errorRange) ? (errorRange[0] ?? 1) : 1,
          rule: ruleNames[0] ?? null,
          url: ruleInformation ?? '',
          message: ruleDescription,
          errored: false,
        };
      },
    );

    parsedResults.push({
      filePath: file,
      messages,
      errorCount: 0,
      warningCount,
      fixableErrorCount: 0,
      fixableWarningCount,
    });
  }

  return parsedResults;
}
