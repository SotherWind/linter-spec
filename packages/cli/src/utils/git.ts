import { execa, type Options } from 'execa';

/**
 * Files changed in this commit (staged, added/copied/modified/renamed).
 */
export const getCommitFiles = async (options: Options = {}): Promise<string[]> => {
  try {
    const { stdout } = await execa(
      'git',
      ['diff', '--staged', '--diff-filter=ACMR', '--name-only', '--ignore-submodules'],
      { ...options, cwd: options.cwd || process.cwd() },
    );

    return typeof stdout === 'string' && stdout ? stdout.split(/\s/).filter(Boolean) : [];
  } catch {
    return [];
  }
};

/**
 * Files modified in the working tree but not yet staged.
 */
export const getAmendFiles = async (options: Options = {}): Promise<string> => {
  try {
    const { stdout } = await execa('git', ['diff', '--name-only'], {
      ...options,
      cwd: options.cwd || process.cwd(),
    });

    return typeof stdout === 'string' ? stdout : '';
  } catch {
    return '';
  }
};
