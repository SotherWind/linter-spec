import type { Command } from 'commander';

import { registerCommitFileScan } from './commit-file-scan.js';
import { registerCommitMsgScan } from './commit-msg-scan.js';
import { registerFix } from './fix.js';
import { registerInit } from './init.js';
import { registerScan } from './scan.js';
import { registerUpdate } from './update.js';

/** Register every CLI command on the commander program. */
export function registerCommands(program: Command, cwd: string): void {
  registerInit(program, cwd);
  registerScan(program, cwd);
  registerFix(program, cwd);
  registerCommitMsgScan(program);
  registerCommitFileScan(program, cwd);
  registerUpdate(program);
}
