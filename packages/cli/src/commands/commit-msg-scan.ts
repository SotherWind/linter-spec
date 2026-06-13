import { createRequire } from 'node:module';

import type { Command } from 'commander';
import spawn from 'cross-spawn';

import { messages } from '../utils/messages.js';

const require = createRequire(import.meta.url);

export function registerCommitMsgScan(program: Command): void {
  program
    .command('commit-msg-scan [msgPath]')
    .description(messages.commitMsgScanDescription)
    .action((msgPath?: string) => {
      const editFile =
        msgPath || process.env.HUSKY_GIT_PARAMS || process.env.GIT_PARAMS || '.git/COMMIT_EDITMSG';

      // Resolve @commitlint/cli from our own dependencies and run it via node,
      // rather than assuming a `commitlint` binary is on PATH — it isn't when
      // this CLI is installed globally into a project that lacks commitlint.
      const commitlintBin = require.resolve('@commitlint/cli/cli.js');
      const result = spawn.sync(process.execPath, [commitlintBin, '--edit', editFile], {
        stdio: 'inherit',
      });

      if (result.status) {
        // Propagate commitlint's own exit code to the git hook verbatim.
        // eslint-disable-next-line n/no-process-exit
        process.exit(result.status);
      }
    });
}
