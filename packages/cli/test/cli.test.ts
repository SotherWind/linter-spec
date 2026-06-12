import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(dirname, '../dist/cli.js');
const pkg = fs.readJSONSync(path.resolve(dirname, '../package.json'));

/** Spawn the built CLI binary with the given args. */
function cli(args: string[], options?: Record<string, unknown>) {
  return execa('node', [cliPath, ...args], { reject: false, ...options });
}

describe('CLI binary', () => {
  test('--version prints the package version', async () => {
    const { stdout } = await cli(['--version']);
    expect(stdout.trim()).toBe(pkg.version);
  });

  test('--help lists the core commands', async () => {
    const { stdout } = await cli(['--help']);
    for (const command of ['init', 'scan', 'fix', 'commit-msg-scan', 'commit-file-scan']) {
      expect(stdout).toContain(command);
    }
  });

  describe('fix command', () => {
    let dir: string;
    const expectedPath = path.resolve(dirname, './fixtures/autofix/semi-expected.js');
    const errorPath = path.resolve(dirname, './fixtures/autofix/semi-error.js');

    beforeEach(() => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), 'linter-spec-fix-'));
      fs.writeJSONSync(path.join(dir, 'package.json'), { name: 'tmp', version: '1.0.0' });
      fs.copySync(errorPath, path.join(dir, 'index.js'));
    });

    afterEach(() => {
      fs.removeSync(dir);
    });

    test('rewrites problematic code in place', async () => {
      await cli(['fix'], { cwd: dir });
      const fixed = fs.readFileSync(path.join(dir, 'index.js'), 'utf8');
      const expected = fs.readFileSync(expectedPath, 'utf8');
      expect(fixed).toBe(expected);
    });

    test("preserves a file's existing CRLF line endings", async () => {
      // Badly-formatted but CRLF-terminated. With no endOfLine in config, the CLI
      // falls back to Prettier's `auto`, so the code is tidied yet CRLF is kept.
      const crlfPath = path.join(dir, 'crlf.js');
      fs.writeFileSync(crlfPath, 'const  x=1\r\nconsole.log( x )\r\n');

      await cli(['fix'], { cwd: dir });

      const out = fs.readFileSync(crlfPath, 'utf8');
      expect(out).toContain('const x = 1;'); // Prettier reformatted the code…
      expect(out).toContain('\r\n'); // …and every newline stayed CRLF…
      expect(/[^\r]\n/.test(out)).toBe(false); // …with no bare LF introduced.
    });
  });

  describe('scan command', () => {
    let dir: string;

    beforeEach(() => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), 'linter-spec-scan-'));
      fs.writeJSONSync(path.join(dir, 'package.json'), { name: 'tmp', version: '1.0.0' });
    });

    afterEach(() => {
      fs.removeSync(dir);
    });

    test('clean project exits 0', async () => {
      fs.writeFileSync(path.join(dir, 'ok.js'), 'const x = () => 1;\n\nx();\n');
      const { exitCode } = await cli(['scan'], { cwd: dir });
      expect(exitCode).toBe(0);
    });

    test('--output-report writes the report file', async () => {
      fs.writeFileSync(path.join(dir, 'bad.js'), 'function demo() {\n  debugger;\n}\n');
      await cli(['scan', '--output-report'], { cwd: dir });
      expect(fs.existsSync(path.join(dir, 'linter-spec-report.json'))).toBe(true);
    });
  });
});
