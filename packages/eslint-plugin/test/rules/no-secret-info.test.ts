import { RuleTester } from 'eslint';
import * as vitest from 'vitest';
import rule from '../../src/rules/no-secret-info.js';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run('no-secret-info', rule, {
  valid: [
    { code: "const safe = 'hello';" },
    { code: "const cfg = { name: 'demo' };" },
    {
      // Custom dangerousKeys list that does NOT include 'password'
      code: "const password = 'p4ss';",
      options: [{ dangerousKeys: ['nothing'], autoMerge: false }],
    },
  ],

  invalid: [
    {
      code: "const password = 'p4ss';",
      errors: [{ messageId: 'noSecretInfo' }],
    },
    {
      code: "const apiToken = 'abc123';",
      errors: [{ messageId: 'noSecretInfo' }],
    },
    {
      code: "const obj = { secret: 'shh' };",
      errors: [{ messageId: 'noSecretInfo' }],
    },
    {
      // Custom dangerousKeys, autoMerge true (merges with default)
      code: "const apikey = 'x';",
      options: [{ dangerousKeys: ['apikey'], autoMerge: true }],
      errors: [{ messageId: 'noSecretInfo' }],
    },
  ],
});
