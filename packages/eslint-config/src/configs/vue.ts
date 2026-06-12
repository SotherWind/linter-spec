import type { Linter } from 'eslint';

import vueRules from '../rules/vue.js';

import base from './base.js';

/**
 * Vue 3 preset = base + vue (incl. vue-eslint-parser handling).
 */
const config: Linter.Config[] = [...base, ...vueRules];

export default config;
