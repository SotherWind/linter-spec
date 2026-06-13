import type { Linter } from 'eslint';

import { softenStylistic } from '../../helpers/soften-stylistic.js';
import vue from '../vue.js';

const config: Linter.Config[] = softenStylistic(vue);

export default config;
