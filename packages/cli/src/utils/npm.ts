import fs from 'node:fs';
import path from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'cnpm';

const KNOWN: readonly string[] = ['npm', 'pnpm', 'yarn', 'bun', 'cnpm'];

/**
 * Detect the package manager a project uses, by decreasing reliability:
 *
 * 1. `npm_config_user_agent` — the PM that actually invoked this process
 *    (npm/pnpm/yarn/bun/cnpm all set it; first segment is `<tool>/<version>`).
 * 2. `package.json` `"packageManager"` (Corepack) — the project's declared PM.
 * 3. A lockfile present in `cwd`.
 * 4. `npm` as the final fallback.
 *
 * Replaces the old `command-exists`-based guess, which only checked whether
 * `pnpm` happened to be on PATH and so polluted lockfiles in yarn/bun projects.
 */
export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  // 1. The PM that launched us.
  const ua = process.env.npm_config_user_agent;
  if (ua) {
    const name = ua.split('/')[0];
    if (KNOWN.includes(name)) return name as PackageManager;
  }

  // 2. The project's declared PM.
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    if (typeof pkg.packageManager === 'string') {
      const name = pkg.packageManager.split('@')[0];
      if (KNOWN.includes(name)) return name as PackageManager;
    }
  } catch {
    /* no / unreadable package.json */
  }

  // 3. Lockfile in cwd.
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) {
    return 'bun';
  }
  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';
  if (fs.existsSync(path.join(cwd, 'npm-shrinkwrap.json'))) return 'npm';

  // 4. Fallback.
  return 'npm';
}

/** `[command, args]` to add a dev dependency, per package manager. */
export function addDevCommand(pm: PackageManager, pkg: string): [string, string[]] {
  switch (pm) {
    case 'yarn':
      return ['yarn', ['add', '-D', pkg]];
    case 'bun':
      return ['bun', ['add', '-d', pkg]];
    default: // npm / pnpm / cnpm
      return [pm, ['i', '-D', pkg]];
  }
}

/** `[command, args]` to add a global package, per package manager. */
export function addGlobalCommand(pm: PackageManager, pkg: string): [string, string[]] {
  switch (pm) {
    case 'yarn':
      return ['yarn', ['global', 'add', pkg]];
    case 'bun':
      return ['bun', ['add', '-g', pkg]];
    default: // npm / pnpm / cnpm
      return [pm, ['i', '-g', pkg]];
  }
}

/** `[command, args]` to install all dependencies — `<pm> install` works for all. */
export function installAllCommand(pm: PackageManager): [string, string[]] {
  return [pm, ['install']];
}
