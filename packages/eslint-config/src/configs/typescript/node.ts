import type { Linter } from 'eslint';

import nodeRules from '../../rules/node.js';
import tsRules from '../../rules/typescript.js';

import base from '../base.js';

const config: Linter.Config[] = [...base, ...tsRules, ...nodeRules];

export default config;
