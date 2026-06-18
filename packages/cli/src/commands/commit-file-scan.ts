import type { Command } from 'commander';
import ora from 'ora';

import { hasLocalLintConfig, installProjectDepsIfMissing } from '../actions/init/install-deps.js';
import scan from '../actions/scan/index.js';
import { getAmendFiles, getCommitFiles } from '../utils/git.js';
import log from '../utils/log.js';
import { messages } from '../utils/messages.js';
import printReport from '../utils/print-report.js';

interface CommitFileScanCmd {
  strict?: boolean;
}

export function registerCommitFileScan(program: Command, cwd: string): void {
  program
    .command('commit-file-scan')
    .description(messages.commitFileScanDescription)
    .option('-s, --strict', messages.optStrict)
    .action(async (cmd: CommitFileScanCmd) => {
      await installProjectDepsIfMissing(cwd, hasLocalLintConfig(cwd));

      const files = await getAmendFiles({ cwd });
      if (files) log.warn(messages.notStaged(files));

      const checking = ora();
      checking.start(messages.runCommitChecking);

      const { results, errorCount, warningCount, runErrors } = await scan({
        cwd,
        include: cwd,
        quiet: !cmd.strict,
        files: await getCommitFiles({ cwd }),
      });

      if (runErrors.length > 0 || errorCount > 0 || (cmd.strict && warningCount > 0)) {
        checking.fail();
        printReport(results, false);
        runErrors.forEach((e) => log.error(e));
        process.exitCode = 1;
      } else {
        checking.succeed();
      }
    });
}
