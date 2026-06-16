import chalk from 'chalk';
import isDocker from 'is-docker';
import stripAnsi from 'strip-ansi';
import terminalLink from 'terminal-link';
import table from 'text-table';

import { CLI_NAME, UNICODE } from './constants.js';
import type { ScanMessage, ScanResult } from '../types.js';

/**
 * Print the scan report to the console.
 */
export default function printReport(results: ScanResult[], fix: boolean): void {
  let output = '\n';
  let errorCount = 0;
  let warningCount = 0;
  let fixableErrorCount = 0;
  let fixableWarningCount = 0;
  let summaryColor: 'red' | 'yellow' = 'yellow';

  const transformMessage = ({ line, column, rule, url, message, errored }: ScanMessage) => {
    if (errored) summaryColor = 'red';
    let text = '';
    if (rule && url) {
      text = terminalLink(chalk.blue(rule), chalk.dim(` ${url} `), { fallback: !isDocker() });
    } else if (rule) {
      text = chalk.blue(rule);
    }

    return [
      '',
      chalk.dim(`${line}:${column}`),
      errored ? chalk.red('error') : chalk.yellow('warning'),
      message,
      text,
    ];
  };

  for (const result of results) {
    if (result.messages.length === 0) continue;

    errorCount += result.errorCount;
    warningCount += result.warningCount;
    fixableErrorCount += result.fixableErrorCount;
    fixableWarningCount += result.fixableWarningCount;

    output += `${chalk.underline(result.filePath)}\n`;
    output += `${table(result.messages.map(transformMessage), {
      align: ['.', 'r', 'l'],
      stringLength: (str) => stripAnsi(str).length,
    })}\n\n`;
  }

  const total = errorCount + warningCount;

  if (fix) output += chalk.green('Auto-fix complete. Run `git diff` to review the changes :D\n');
  if (fix && total > 0) {
    output += chalk.green(
      'Note: the issues above could not be auto-fixed and need manual attention\n',
    );
  }

  if (!fix && total > 0) {
    output += chalk[summaryColor].bold(
      `${UNICODE.failure} ${total} issue(s) found (${errorCount} error(s), ${warningCount} warning(s))\n`,
    );
    if (fixableErrorCount > 0 || fixableWarningCount > 0) {
      output += chalk[summaryColor].bold(
        `  ${fixableErrorCount} error(s) / ${fixableWarningCount} warning(s) fixable via \`${CLI_NAME} fix\``,
      );
    }
  }
  if (!fix && total === 0) output = chalk.green.bold(`${UNICODE.success} No issues found`);

  console.log(chalk.reset(output));
}
