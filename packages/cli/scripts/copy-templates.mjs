// Copy the EJS config templates into dist/ after tsc (tsc only emits .ts).
import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../src/config');
const dest = resolve(here, '../dist/config');

if (existsSync(src)) {
  cpSync(src, dest, { recursive: true });
  console.log(`[copy-templates] ${src} -> ${dest}`);
}
