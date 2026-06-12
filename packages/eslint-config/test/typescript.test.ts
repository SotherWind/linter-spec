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
});
