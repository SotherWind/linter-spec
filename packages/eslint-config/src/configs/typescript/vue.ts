import type { Linter } from 'eslint';

import tsRules from '../../rules/typescript.js';
import vueRules from '../../rules/vue.js';

import base from '../base.js';

const config: Linter.Config[] = [...base, ...tsRules, ...vueRules];

export default config;
