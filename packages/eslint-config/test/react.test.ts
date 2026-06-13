import { describe, it, expect } from 'vitest';

import { runLint } from './helpers/run-lint.js';
import react from '../src/configs/react.js';

describe('@linter-spec/eslint-config/react', () => {
  it('exports a non-empty flat-config array', () => {
    expect(react.length).toBeGreaterThan(0);
  });

  it('lints a basic JSX file without fatal errors', async () => {
    const code = `import React from 'react';

function Demo() {
  return <div>hello</div>;
}

export default Demo;
`;
    const result = await runLint(react, code, 'demo.jsx');
    expect(result.fatalCount).toBe(0);
  });

  it('flags duplicate JSX props', async () => {
    const code = `import React from 'react';

function Demo() {
  return <div id="a" id="b" />;
}

export default Demo;
`;
    const result = await runLint(react, code, 'demo.jsx');
    expect(result.ruleIds).toContain('react/jsx-no-duplicate-props');
  });
});
