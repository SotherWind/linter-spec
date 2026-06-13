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

  if (fix) output += chalk.green('代码规范问题自动修复完成，请通过 git diff 确认修复效果 :D\n');
  if (fix && total > 0) {
    output += chalk.green('ps. 以上显示的是无法被自动修复的问题，需要手动进行修复\n');
  }

  if (!fix && total > 0) {
    output += chalk[summaryColor].bold(
      `${UNICODE.failure} 共 ${total} 个问题（${errorCount} 个错误，${warningCount} 个警告）\n`,
    );
    if (fixableErrorCount > 0 || fixableWarningCount > 0) {
      output += chalk[summaryColor].bold(
        `  其中 ${fixableErrorCount} 个错误、${fixableWarningCount} 个警告可通过 \`${CLI_NAME} fix\` 自动修复`,
      );
    }
  }
  if (!fix && total === 0) output = chalk.green.bold(`${UNICODE.success} 没有发现问题`);

  console.log(chalk.reset(output));
}
