import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
// Import the built ESM bundle, not src, so `import.meta.resolve` (used in
// src/lints/stylelint/get-config.ts) reaches Node's real implementation
// instead of vitest 2.x's Vite-SSR transform — which rewrites `import.meta`
// to a shim object that doesn't carry `.resolve`. The CLI binary test
// already uses dist, so this matches the convention and exercises the same
// code path real consumers would.
import { init, scan } from '../dist/index.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Create an isolated, throwaway project dir under the OS temp folder. */
function makeTmpProject(prefix: string): string {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `linter-spec-${prefix}-`));
  fs.writeJSONSync(path.join(cwd, 'package.json'), { name: 'tmp', version: '1.0.0' });
  return cwd;
}

describe('Node API: init', () => {
  const templatePath = path.resolve(dirname, './fixtures/template/init');
  let outputPath: string;

  beforeEach(() => {
    outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'linter-spec-init-'));
    fs.copySync(templatePath, outputPath);
    fs.renameSync(`${outputPath}/_vscode`, `${outputPath}/.vscode`);
  });

  afterEach(() => {
    fs.removeSync(outputPath);
  });

  test('writes lint config + merges .vscode settings', async () => {
    await init({
      cwd: outputPath,
      eslintType: 'index',
      enableStylelint: true,
      enableMarkdownlint: true,
      enablePrettier: true,
    });

    const settings = fs.readJSONSync(`${outputPath}/.vscode/settings.json`);
    // Prettier enabled -> default formatter rewritten from the fixture's "233".
    expect(settings['editor.defaultFormatter']).toBe('esbenp.prettier-vscode');
    // Existing array entries are preserved (unioned), not clobbered.
    expect(settings['eslint.validate']).toContain('233');
    expect(settings['eslint.validate']).toContain('javascript');
    // Untouched keys from the original settings survive.
    expect(settings.test).toBe(true);

    // The flat ESLint config is generated and points at our shared preset.
    const eslintConfig = fs.readFileSync(`${outputPath}/eslint.config.mjs`, 'utf8');
    expect(eslintConfig).toContain('@linter-spec/eslint-config');

    // husky hooks are wired up and package.json gains the scan/fix scripts.
    expect(fs.existsSync(`${outputPath}/.husky/pre-commit`)).toBe(true);
    expect(fs.existsSync(`${outputPath}/.husky/commit-msg`)).toBe(true);
    const pkg = fs.readJSONSync(`${outputPath}/package.json`);
    expect(pkg.scripts['linter-spec-scan']).toBe('linter-spec scan');
    expect(pkg.scripts['linter-spec-fix']).toBe('linter-spec fix');
  });

  test('honours disabled linters (no stylelint config emitted)', async () => {
    await init({
      cwd: outputPath,
      eslintType: 'index',
      enableStylelint: false,
      enableMarkdownlint: false,
      enablePrettier: false,
    });

    expect(fs.existsSync(`${outputPath}/eslint.config.mjs`)).toBe(true);
    expect(fs.existsSync(`${outputPath}/stylelint.config.mjs`)).toBe(false);

    const settings = fs.readJSONSync(`${outputPath}/.vscode/settings.json`);
    expect(settings['editor.formatOnSave']).toBe(false);
  });
});

describe('Node API: scan', () => {
  let cwd: string;

  afterEach(() => {
    if (cwd) fs.removeSync(cwd);
  });

  test('reports errors and warnings for problematic code', async () => {
    cwd = makeTmpProject('scan');
    fs.writeFileSync(
      path.join(cwd, 'bad.js'),
      'function demo() {\n  debugger;\n  var unused = 42;\n  return 1;\n}\n',
    );

    const report = await scan({ cwd, include: cwd, fix: false });

    expect(report.runErrors).toHaveLength(0);
    expect(report.errorCount).toBeGreaterThan(0);

    const rules = report.results.flatMap((r) => r.messages.map((m) => m.rule));
    expect(rules).toContain('no-debugger');
    expect(rules).toContain('no-var');
  });

  test('clean code produces no findings', async () => {
    cwd = makeTmpProject('scan-clean');
    fs.writeFileSync(
      path.join(cwd, 'ok.js'),
      "const hello = (name) => `hi ${name}`;\n\nhello('world');\n",
    );

    const report = await scan({ cwd, include: cwd, fix: false });

    expect(report.runErrors).toHaveLength(0);
    expect(report.errorCount).toBe(0);
    expect(report.warningCount).toBe(0);
  });

  test('quiet mode suppresses warning-level messages', async () => {
    cwd = makeTmpProject('scan-quiet');
    // `unused` is a warning (no-unused-vars), `debugger` is an error.
    fs.writeFileSync(
      path.join(cwd, 'bad.js'),
      'function demo() {\n  debugger;\n  var unused = 42;\n}\n',
    );

    const report = await scan({ cwd, include: cwd, fix: false, quiet: true });

    const messages = report.results.flatMap((r) => r.messages);
    expect(messages.every((m) => m.errored)).toBe(true);
    expect(report.warningCount).toBe(0);
  });

  test('outputReport writes a JSON report file', async () => {
    cwd = makeTmpProject('scan-report');
    fs.writeFileSync(path.join(cwd, 'bad.js'), 'function demo() {\n  debugger;\n}\n');

    await scan({ cwd, include: cwd, fix: false, outputReport: true });

    const reportPath = path.join(cwd, 'linter-spec-report.json');
    expect(fs.existsSync(reportPath)).toBe(true);
    const parsed = fs.readJSONSync(reportPath);
    expect(Array.isArray(parsed)).toBe(true);
  });
});
