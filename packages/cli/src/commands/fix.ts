import type { Command } from 'commander';
import ora from 'ora';

import { hasLocalLintConfig, installProjectDepsIfMissing } from '../actions/init/install-deps.js';
import scan from '../actions/scan/index.js';
import { messages } from '../utils/messages.js';
import printReport from '../utils/print-report.js';

interface FixCmd {
  include?: string;
  ignore?: boolean;
}

export function registerFix(program: Command, cwd: string): void {
  program
    .command('fix')
    .description(messages.fixDescription)
    .option('-i, --include <dirpath>', messages.optInclude)
    .option('--no-ignore', messages.optNoIgnore)
    .action(async (cmd: FixCmd) => {
      await installProjectDepsIfMissing(cwd, hasLocalLintConfig(cwd));

      const checking = ora();
      checking.start(messages.runFixing);

      const { results } = await scan({
        cwd,
        fix: true,
        include: cmd.include || cwd,
        ignore: cmd.ignore,
      });

      checking.succeed();
      if (results.length > 0) printReport(results, true);
    });
}
