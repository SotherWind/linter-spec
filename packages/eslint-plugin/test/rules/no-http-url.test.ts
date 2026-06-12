import { RuleTester } from 'eslint';
import * as vitest from 'vitest';
import rule from '../../src/rules/no-http-url.js';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [
    { code: "const test = 'https://example.com';" },
    { code: "const test = 'ftp://example.com';" },
    { code: 'const n = 42;' },
  ],

  invalid: [
    {
      code: "const test = 'http://example.com';",
      errors: [{ messageId: 'noHttpUrl' }],
    },
    {
      code: "const test = 'http://example.com/api';",
      errors: [{ messageId: 'noHttpUrl' }],
    },
    {
      code: "const img = <img src='http://example.com' />;",
      languageOptions: {
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      errors: [{ messageId: 'noHttpUrl' }],
    },
  ],
});
