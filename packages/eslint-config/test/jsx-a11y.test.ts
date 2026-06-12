import { describe, it, expect } from 'vitest';

import jsxA11yConfig from '../src/configs/jsx-a11y.js';

describe('@linter-spec/eslint-config/jsx-a11y', () => {
  it('exports a non-empty flat-config array', () => {
    expect(jsxA11yConfig.length).toBeGreaterThan(0);
  });
});
