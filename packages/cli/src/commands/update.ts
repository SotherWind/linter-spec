import type { Command } from 'commander';

import update from '../actions/update.js';
import { messages } from '../utils/messages.js';

export function registerUpdate(program: Command): void {
  program
    .command('update')
    .description(messages.updateDescription)
    .action(() => update(true));
}
