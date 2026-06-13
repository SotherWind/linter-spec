import type { Linter } from 'eslint';

import { softenStylistic } from '../../../helpers/soften-stylistic.js';
import typescriptVue from '../../typescript/vue.js';

const config: Linter.Config[] = softenStylistic(typescriptVue);

export default config;
