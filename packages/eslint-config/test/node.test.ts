import { describe, it, expect } from 'vitest';

import { runLint } from './helpers/run-lint.js';
import nodeConfig from '../src/configs/node.js';

describe('@linter-spec/eslint-config/node', () => {
  it('exports a non-empty flat-config array', () => {
    expect(nodeConfig.length).toBeGreaterThan(0);
  });

  it('flags using global Buffer (n/prefer-global/buffer)', async () => {
    const result = await runLint(
      nodeConfig,
      "const b = Buffer.from('hi'); console.log(b);\n",
      'demo.js',
    );
    expect(result.ruleIds).toContain('n/prefer-global/buffer');
  });
});
