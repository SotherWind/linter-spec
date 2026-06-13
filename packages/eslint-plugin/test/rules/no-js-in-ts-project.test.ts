import { RuleTester } from 'eslint';
import * as vitest from 'vitest';

import rule from '../../src/rules/no-js-in-ts-project.js';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run('no-js-in-ts-project', rule, {
  valid: [
    // .ts files are fine
    { filename: '/repo/src/app.ts', code: 'export const x = 1;' },
    // Whitelisted config files are fine
    { filename: '/repo/commitlint.config.js', code: 'module.exports = {};' },
    { filename: '/repo/eslint.config.js', code: 'export default [];' },
  ],

  invalid: [
    {
      filename: '/repo/src/app.js',
      code: 'const x = 1;',
      errors: [{ messageId: 'noJSInTSProject' }],
    },
    {
      filename: '/repo/src/app.jsx',
      code: 'const x = 1;',
      errors: [{ messageId: 'noJSInTSProject' }],
    },
  ],
});
