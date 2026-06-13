import path from 'node:path';

import fs from 'fs-extra';

import type { PKG } from '../../types.js';
import { CLI_NAME } from '../../utils/constants.js';

/**
 * Configure git commit hooks via husky v9.
 * Writes the hook scripts and ensures a `prepare` script so husky installs on
 * the next `npm install`. Mutates `pkg.scripts` (caller persists package.json).
 */
export function setupHusky(cwd: string, pkg: PKG): void {
  if (!pkg.scripts) pkg.scripts = {};
  if (!pkg.scripts.prepare) pkg.scripts.prepare = 'husky';

  const huskyDir = path.resolve(cwd, '.husky');
  fs.ensureDirSync(huskyDir);
  fs.writeFileSync(path.join(huskyDir, 'pre-commit'), `${CLI_NAME} commit-file-scan\n`, 'utf8');
  fs.writeFileSync(path.join(huskyDir, 'commit-msg'), `${CLI_NAME} commit-msg-scan "$1"\n`, 'utf8');
}
