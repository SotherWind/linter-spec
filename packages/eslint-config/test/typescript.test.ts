import { describe, it, expect } from 'vitest';

import ts from '../src/configs/typescript/index.js';

import { runLint } from './helpers/run-lint.js';

describe('@linter-spec/eslint-config/typescript', () => {
  it('exports a non-empty flat-config array', () => {
    expect(ts.length).toBeGreaterThan(0);
  });

  it('flags any-type via @typescript-eslint/no-explicit-any', async () => {
    const result = await runLint(ts, 'const demo: any = 1; console.log(demo);\n', 'demo.ts');
    expect(result.ruleIds).toContain('@typescript-eslint/no-explicit-any');
  });

  it('accepts a clean TS file', async () => {
    const result = await runLint(ts, "const demo: string = 'hi';\nconsole.log(demo);\n", 'demo.ts');
    expect(result.fatalCount).toBe(0);
  });

  // Base hygiene rules (es6 `no-var`, best-practices `array-callback-return`,
  // `eqeqeq`, ...) must apply to .ts files too — they used to be silently scoped
  // to `**/*.{js,mjs,cjs,jsx}` by base.ts, leaving TS code unchecked.
  it('applies base es6 rules (no-var) to TS files', async () => {
    const result = await runLint(ts, 'var demo = 1;\nconsole.log(demo);\n', 'demo.ts');
    expect(result.ruleIds).toContain('no-var');
  });

  it('applies base best-practices rules (array-callback-return) to TS files', async () => {
    const src =
      'const xs = [1, 2];\n' +
      'const ys = xs.filter(function (x) { if (x) { return true; } else { return; } });\n' +
      'console.log(ys);\n';
    const result = await runLint(ts, src, 'demo.ts');
    expect(result.ruleIds).toContain('array-callback-return');
  });
});
