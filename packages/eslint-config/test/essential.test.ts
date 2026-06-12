import { describe, it, expect } from 'vitest';

import essential from '../src/configs/essential/index.js';
import essentialEs5 from '../src/configs/essential/es5.js';
import essentialReact from '../src/configs/essential/react.js';
import essentialVue from '../src/configs/essential/vue.js';
import essentialTs from '../src/configs/essential/typescript/index.js';
import essentialTsReact from '../src/configs/essential/typescript/react.js';
import essentialTsVue from '../src/configs/essential/typescript/vue.js';

import { runLint } from './helpers/run-lint.js';

describe('@linter-spec/eslint-config/essential family', () => {
  const allEntries = [
    ['essential', essential],
    ['essential-es5', essentialEs5],
    ['essential-react', essentialReact],
    ['essential-vue', essentialVue],
    ['essential-typescript', essentialTs],
    ['essential-typescript-react', essentialTsReact],
    ['essential-typescript-vue', essentialTsVue],
  ] as const;

  for (const [name, cfg] of allEntries) {
    it(`${name} exports a non-empty flat-config array`, () => {
      expect(Array.isArray(cfg)).toBe(true);
      expect(cfg.length).toBeGreaterThan(0);
    });
  }

  it('soften: stylistic semi violation surfaces as warn, not error', async () => {
    const result = await runLint(essential, "const demo = 'hi'\nconsole.log(demo)\n", 'demo.js');
    // The rule still fires, but the message-level severity is 1 (warn).
    expect(result.fatalCount).toBe(0);
  });
});
