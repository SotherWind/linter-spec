import type { ESLint } from 'eslint';

import type { ScanResult } from '../../types.js';

/**
 * Normalise ESLint results into the shared `ScanResult` shape.
 */
export function formatESLintResults(
  results: ESLint.LintResult[],
  quiet: boolean | undefined,
  eslint: ESLint,
): ScanResult[] {
  const rulesMeta = eslint.getRulesMetaForResults(results);

  return results
    .filter(({ warningCount, errorCount }) => errorCount || warningCount)
    .map(
      ({
        filePath,
        messages,
        errorCount,
        warningCount,
        fixableErrorCount,
        fixableWarningCount,
      }) => ({
        filePath,
        errorCount,
        warningCount: quiet ? 0 : warningCount,
        fixableErrorCount,
        fixableWarningCount: quiet ? 0 : fixableWarningCount,
        messages: messages
          .map(({ line = 0, column = 0, ruleId, message, fatal, severity }) => ({
            line,
            column,
            rule: ruleId,
            url: (ruleId && rulesMeta[ruleId]?.docs?.url) || '',
            message: message.replace(/([^ ])\.$/u, '$1'),
            errored: Boolean(fatal) || severity === 2,
          }))
          .filter(({ errored }) => (quiet ? errored : true)),
      }),
    );
}
