import type { Linter } from 'eslint';

import tsRules from '../../rules/typescript.js';

import base from '../base.js';

/**
 * TypeScript preset = base + typescript-eslint.
 */
const config: Linter.Config[] = [...base, ...tsRules];

export default config;
