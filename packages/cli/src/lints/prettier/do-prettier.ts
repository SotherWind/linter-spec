import os from 'node:os';

import fsExtra from 'fs-extra';
// Named imports: prettier@3 ships as ESM with no synthetic default — a default
// import works at runtime via Node's CJS interop but fails import-x/default
// because there genuinely is no default in the published ESM entry.
import { format, getFileInfo, resolveConfig } from 'prettier';

import type { ScanOptions } from '../../types.js';
import { PRETTIER_FILE_EXT, PRETTIER_IGNORE_PATTERN } from '../../utils/constants.js';
import { resolveScanFiles } from '../resolve-files.js';

const { readFile, writeFile } = fsExtra;

// Cap how many files Prettier formats at once: an unbounded `Promise.all` over
// thousands of files would spawn that many concurrent reads + format passes and
// can exhaust file handles / memory on large projects.
const CONCURRENCY = Math.max(4, os.cpus().length);

export async function doPrettier(options: ScanOptions): Promise<void> {
  const files = await resolveScanFiles(options, PRETTIER_FILE_EXT, PRETTIER_IGNORE_PATTERN);
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    await Promise.all(files.slice(i, i + CONCURRENCY).map(formatFile));
  }
}

async function formatFile(filepath: string): Promise<void> {
  // Skip files Prettier can't parse / is configured to ignore.
  const info = await getFileInfo(filepath, { resolveConfig: true });
  if (info.ignored || !info.inferredParser) return;

  const text = await readFile(filepath, 'utf8');
  const config = await resolveConfig(filepath);
  // Prettier 3: `format` is async. Default `endOfLine` to `auto` so a file keeps
  // its existing line endings (a CRLF file stays CRLF) when the user's resolved
  // config doesn't pin `endOfLine`; their config still wins via the spread order.
  const formatted = await format(text, { endOfLine: 'auto', ...config, filepath });

  if (formatted !== text) {
    await writeFile(filepath, formatted, 'utf8');
  }
}
