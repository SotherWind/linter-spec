import type { Linter } from 'eslint';

import nodeRules from '../rules/node.js';

import base from './base.js';

/**
 * Node.js preset = base + n (Node-flavoured rules from eslint-plugin-n).
 */
const config: Linter.Config[] = [...base, ...nodeRules];

export default config;
