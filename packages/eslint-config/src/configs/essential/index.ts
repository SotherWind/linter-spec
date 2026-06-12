import type { Linter } from 'eslint';

import { softenStylistic } from '../../helpers/soften-stylistic.js';

import base from '../base.js';

/**
 * Essential preset = soften all stylistic errors of `base` to warnings.
 * Useful for legacy codebases adopting the rules incrementally.
 */
const config: Linter.Config[] = softenStylistic(base);

export default config;
