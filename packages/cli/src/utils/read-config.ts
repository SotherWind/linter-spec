import path from 'node:path';
import { pathToFileURL } from 'node:url';

import fs from 'fs-extra';

import { CLI_NAME } from './constants.js';
import type { Config } from '../types.js';

/** Read `<cli>.config.{mjs,cjs,js}` from the project, if present. */
export async function readLinterSpecConfig(cwd: string): Promise<Config> {
  for (const ext of ['mjs', 'cjs', 'js']) {
    const configPath = path.resolve(cwd, `${CLI_NAME}.config.${ext}`);
    if (fs.existsSync(configPath)) {
      const mod = await import(pathToFileURL(configPath).href);
      return (mod.default ?? mod) as Config;
    }
  }
  return {};
}
