import type { ESLint, Linter, Rule } from 'eslint';

import noBroadSemanticVersioning from './rules/no-broad-semantic-versioning.js';
import noHttpUrl from './rules/no-http-url.js';
import noJsInTsProject from './rules/no-js-in-ts-project.js';
import noSecretInfo from './rules/no-secret-info.js';

import pkg from '../package.json' with { type: 'json' };

const PLUGIN_NAME = '@linter-spec';

const rules: Record<string, Rule.RuleModule> = {
  'no-broad-semantic-versioning': noBroadSemanticVersioning,
  'no-http-url': noHttpUrl,
  'no-js-in-ts-project': noJsInTsProject,
  'no-secret-info': noSecretInfo,
};

const plugin: ESLint.Plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules,
};

const recommended: Linter.Config[] = [
  {
    name: `${PLUGIN_NAME}/recommended`,
    plugins: { [PLUGIN_NAME]: plugin },
    rules: {
      [`${PLUGIN_NAME}/no-http-url`]: 'warn',
      [`${PLUGIN_NAME}/no-secret-info`]: 'error',
    },
  },
];

plugin.configs = {
  recommended,
};

export default plugin;
export { rules };
