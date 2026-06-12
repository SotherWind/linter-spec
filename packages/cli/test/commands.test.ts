import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(dirname, '../dist/cli.js');

function cli(args: string[], cwd: string) {
  return execa('node', [cliPath, ...args], { cwd, reject: false });
}

async function git(args: string[], cwd: string) {
  return execa('git', args, { cwd, reject: false });
}

/** Initialise a throwaway git repo with an identity configured. */
async function initRepo(prefix: string): Promise<string> {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `linter-spec-${prefix}-`));
  fs.writeJSONSync(path.join(cwd, 'package.json'), { name: 'tmp', version: '1.0.0' });
  await git(['init'], cwd);
  await git(['config', 'user.email', 'test@example.com'], cwd);
  await git(['config', 'user.name', 'test'], cwd);
  return cwd;
}

describe('commit-file-scan command', () => {
  let cwd: string;

  afterEach(() => {
    if (cwd) fs.removeSync(cwd);
  });

  test('passes (exit 0) when staged files are clean', async () => {
    cwd = await initRepo('cfs-clean');
    fs.writeFileSync(path.join(cwd, 'ok.js'), 'const x = () => 1;\n\nx();\n');
    await git(['add', '.'], cwd);

    const { exitCode } = await cli(['commit-file-scan'], cwd);
    expect(exitCode).toBe(0);
  });

  test('fails (exit 1) when a staged file has lint errors', async () => {
    cwd = await initRepo('cfs-error');
    fs.writeFileSync(path.join(cwd, 'bad.js'), 'function demo() {\n  debugger;\n}\n');
    await git(['add', '.'], cwd);

    const { exitCode } = await cli(['commit-file-scan'], cwd);
    expect(exitCode).toBe(1);
  });

  test('--strict turns warnings into failures', async () => {
    cwd = await initRepo('cfs-strict');
    // `unused` is a warning (no-unused-vars), not an error.
    fs.writeFileSync(
      path.join(cwd, 'warn.js'),
      'export function demo() {\n  const unused = 42;\n}\n',
    );
    await git(['add', '.'], cwd);

    const lenient = await cli(['commit-file-scan'], cwd);
    expect(lenient.exitCode).toBe(0);

    const strict = await cli(['commit-file-scan', '--strict'], cwd);
    expect(strict.exitCode).toBe(1);
  });
});
