import type { Command } from 'commander';
import ora from 'ora';

import { hasLocalLintConfig, installProjectDepsIfMissing } from '../actions/init/install-deps.js';
import scan from '../actions/scan/index.js';
import log from '../utils/log.js';
import { messages } from '../utils/messages.js';
import printReport from '../utils/print-report.js';

interface ScanCmd {
  quiet?: boolean;
  outputReport?: boolean;
  include?: string;
  ignore?: boolean;
}

export function registerScan(program: Command, cwd: string): void {
  program
    .command('scan')
    .description(messages.scanDescription)
    .option('-q, --quiet', messages.optQuiet)
    .option('-o, --output-report', messages.optOutputReport)
    .option('-i, --include <dirpath>', messages.optInclude)
    .option('--no-ignore', messages.optNoIgnore)
    .action(async (cmd: ScanCmd) => {
      await installProjectDepsIfMissing(cwd, hasLocalLintConfig(cwd));

      const checking = ora();
      checking.start(messages.runChecking);

      const { results, errorCount, warningCount, runErrors } = await scan({
        cwd,
        fix: false,
        include: cmd.include || cwd,
        quiet: Boolean(cmd.quiet),
        outputReport: Boolean(cmd.outputReport),
        ignore: cmd.ignore,
      });

      if (runErrors.length > 0 || errorCount > 0) checking.fail();
      else if (warningCount > 0) checking.warn();
      else checking.succeed();

      if (results.length > 0) printReport(results, false);
      runErrors.forEach((e) => log.error(e));

      if (runErrors.length > 0 || errorCount > 0) {
        process.exitCode = 1;
      }
    });
}
