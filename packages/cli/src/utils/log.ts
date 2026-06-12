import chalk from 'chalk';
import { CLI_NAME, UNICODE } from './constants.js';

const { green, blue, yellow, red } = chalk;

const log = {
  success(text: string) {
    console.log(green(text));
  },
  info(text: string) {
    console.info(blue(text));
  },
  warn(text: string) {
    console.info(yellow(text));
  },
  error(text: string | Error) {
    // Print the full stack when given an Error (the stack string already
    // includes the message); fall back to the message / raw string otherwise.
    console.error(red(text instanceof Error ? (text.stack ?? text.message) : text));
  },
  result(text: string, pass: boolean) {
    console.info(
      blue(`[${CLI_NAME}] ${text}`),
      pass ? green(UNICODE.success) : red(UNICODE.failure),
    );
  },
};

export default log;
