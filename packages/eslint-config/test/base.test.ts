import { describe, it, expect } from 'vitest';

import { runLint } from './helpers/run-lint.js';
import base from '../src/configs/base.js';

describe('@linter-spec/eslint-config (base)', () => {
  it('exports a non-empty flat-config array', () => {
    expect(Array.isArray(base)).toBe(true);
    expect(base.length).toBeGreaterThan(0);
  });

  it('flags unused variables', async () => {
    const result = await runLint(base, 'const demo = 1;\n', 'demo.js');
    expect(result.ruleIds).toContain('no-unused-vars');
    expect(result.fatalCount).toBe(0);
  });

  it('flags missing semicolons via @stylistic/semi', async () => {
    const result = await runLint(base, "const demo = 'hi'\nconsole.log(demo)\n", 'demo.js');
    expect(result.ruleIds).toContain('@stylistic/semi');
  });

  it('accepts a clean file', async () => {
    const result = await runLint(base, "console.log('hi');\n", 'demo.js');
    expect(result.ruleIds).not.toContain('@stylistic/semi');
    expect(result.fatalCount).toBe(0);
  });
});
