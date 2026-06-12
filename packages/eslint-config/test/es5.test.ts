import { describe, it, expect } from 'vitest';

import es5 from '../src/configs/es5.js';

import { runLint } from './helpers/run-lint.js';

describe('@linter-spec/eslint-config/es5', () => {
  it('exports a non-empty flat-config array', () => {
    expect(es5.length).toBeGreaterThan(0);
  });

  it('allows var declarations (no-var disabled for es5)', async () => {
    const result = await runLint(es5, 'var x = 1; console.log(x);\n', 'demo.js');
    expect(result.ruleIds).not.toContain('no-var');
  });
});
