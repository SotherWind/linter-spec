#!/usr/bin/env node
import { program } from 'commander';
import { registerCommands } from './commands/index.js';
import { messages } from './utils/messages.js';
import { CLI_NAME, PKG_VERSION } from './utils/constants.js';

const cwd = process.cwd();

program.name(CLI_NAME).version(PKG_VERSION).description(messages.description);

registerCommands(program, cwd);

program.parse(process.argv);
