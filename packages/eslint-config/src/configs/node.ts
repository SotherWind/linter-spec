import type { Linter } from 'eslint';

import base from './base.js';
import nodeRules from '../rules/node.js';

/**
 * Node.js preset = base + n (Node-flavoured rules from eslint-plugin-n).
 */
const config: Linter.Config[] = [...base, ...nodeRules];

export default config;
