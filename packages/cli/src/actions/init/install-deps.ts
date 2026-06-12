import spawn from 'cross-spawn';
import path from 'node:path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { detectPackageManager, addDevCommand, installAllCommand } from '../../utils/npm.js';
import log from '../../utils/log.js';
import { messages } from '../../utils/messages.js';
import { PKG_NAME } from '../../utils/constants.js';

/** True when the project carries its own lint config files. */
export function hasLocalLintConfig(cwd: string): boolean {
  return (
    fg.sync(
      [
        '.eslintrc?(.@(js|cjs|mjs|yaml|yml|json))',
        'eslint.config.@(js|mjs|cjs|ts)',
        '.stylelintrc?(.@(js|cjs|mjs|yaml|yml|json))',
        'stylelint.config.@(js|mjs|cjs)',
        '.markdownlint?(-cli2).@(jsonc|json|yaml|yml|cjs|mjs)',
      ],
      { cwd, dot: true },
    ).length > 0
  );
}

/** Install the CLI itself as a dev dependency of the target project. */
export async function installCliDep(cwd: string): Promise<void> {
  const [command, args] = addDevCommand(detectPackageManager(cwd), PKG_NAME);
  spawn.sync(command, args, { stdio: 'inherit', cwd });
}

/**
 * When a project relies on the bundled lint configs but has no `node_modules`,
 * install its dependencies first (otherwise config resolution fails).
 */
export async function installProjectDepsIfMissing(
  cwd: string,
  hasLocalConfig: boolean,
): Promise<void> {
  const nodeModulesPath = path.resolve(cwd, 'node_modules');
  if (!fs.existsSync(nodeModulesPath) && hasLocalConfig) {
    const pm = detectPackageManager(cwd);
    log.info(messages.installingDeps(pm));
    const [command, args] = installAllCommand(pm);
    spawn.sync(command, args, { cwd, stdio: 'inherit' });
  }
}
