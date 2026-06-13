import { execa } from 'execa';
import ora from 'ora';

import { PKG_NAME, PKG_VERSION } from '../utils/constants.js';
import log from '../utils/log.js';
import { messages } from '../utils/messages.js';
import { detectPackageManager, addGlobalCommand } from '../utils/npm.js';

/** Return the latest published version if it is newer than the local one. */
async function checkLatestVersion(): Promise<string | null> {
  // Query the registry directly — package-manager agnostic, and avoids spawning
  // a child process just to read one version string.
  const res = await fetch(`https://registry.npmjs.org/${PKG_NAME}/latest`);
  if (!res.ok) return null;
  const data = (await res.json()) as { version?: string };
  const latestVersion = data.version;

  if (!latestVersion || PKG_VERSION === latestVersion) return null;

  // NOTE: simple numeric `x.y.z` comparison only — pre-release / build metadata
  // (`1.0.0-beta.1`, `1.0.0+build.5`) is not handled. Our own releases are plain
  // semver, so this holds; swap in the `semver` package if that ever changes.
  const current = PKG_VERSION.split('.').map(Number);
  const latest = latestVersion.split('.').map(Number);

  for (let i = 0; i < current.length; i++) {
    if ((current[i] ?? 0) > (latest[i] ?? 0)) return null;
    if ((current[i] ?? 0) < (latest[i] ?? 0)) return latestVersion;
  }
  return null;
}

/**
 * Check for (and optionally install) a newer version of the CLI.
 * @param install install the new version globally when found
 */
export default async function update(install = true): Promise<void> {
  const checking = ora(messages.updateChecking);
  checking.start();

  try {
    const pm = detectPackageManager();
    const latestVersion = await checkLatestVersion();
    checking.stop();

    if (latestVersion && install) {
      const updating = ora(messages.updateFound(latestVersion));
      updating.start();
      const [command, args] = addGlobalCommand(pm, PKG_NAME);
      await execa(command, args, { stdio: 'inherit' });
      updating.stop();
    } else if (latestVersion) {
      const [command, args] = addGlobalCommand(pm, `${PKG_NAME}@latest`);
      log.warn(messages.updateHint(latestVersion, PKG_VERSION, [command, ...args].join(' ')));
    } else if (install) {
      log.info(messages.updateNone);
    }
  } catch (e) {
    checking.stop();
    log.error(e as Error);
  }
}
