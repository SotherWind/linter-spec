import { RuleTester } from 'eslint';
import * as vitest from 'vitest';

import rule from '../../src/rules/no-broad-semantic-versioning.js';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: { ecmaVersion: 'latest' },
  },
});

const PACKAGE_FILE = '/repo/package.json';

ruleTester.run('no-broad-semantic-versioning', rule, {
  valid: [
    // Pinned versions are fine
    {
      filename: PACKAGE_FILE,
      code: '({ "name": "p", "dependencies": { "a": "^1.0.0", "b": "~2.3.4" } });',
    },
    // Outside package.json, the rule does nothing
    {
      filename: '/repo/index.js',
      code: '({ "dependencies": { "a": "*" } });',
    },
  ],

  invalid: [
    {
      filename: PACKAGE_FILE,
      code: '({ "name": "p", "dependencies": { "a": "*" } });',
      errors: [{ messageId: 'noBroadSemanticVersioning' }],
    },
    {
      filename: PACKAGE_FILE,
      code: '({ "name": "p", "devDependencies": { "b": "1.x.x" } });',
      errors: [{ messageId: 'noBroadSemanticVersioning' }],
    },
    {
      filename: PACKAGE_FILE,
      code: '({ "name": "p", "dependencies": { "c": ">=1.0.0" } });',
      errors: [{ messageId: 'noBroadSemanticVersioning' }],
    },
  ],
});
