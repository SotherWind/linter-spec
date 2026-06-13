import type { Command } from 'commander';

import init from '../actions/init/index.js';
import { writeVSCodeConfig } from '../actions/init/write-vscode.js';
import { CliAbortError } from '../utils/errors.js';
import log from '../utils/log.js';
import { messages } from '../utils/messages.js';
import { readLinterSpecConfig } from '../utils/read-config.js';

export function registerInit(program: Command, cwd: string): void {
  program
    .command('init')
    .description(messages.initDescription)
    .option('--vscode', messages.optVscode)
    .action(async (cmd: { vscode?: boolean }) => {
      try {
        if (cmd.vscode) {
          const config = await readLinterSpecConfig(cwd);
          writeVSCodeConfig(cwd, config as Record<string, unknown>);
        } else {
          await init({ cwd, checkVersionUpdate: true });
        }
      } catch (e) {
        // User declined a destructive step — exit cleanly, not as a crash.
        if (e instanceof CliAbortError) {
          log.info(messages.conflictCancelled);
          return;
        }
        throw e;
      }
    });
}
