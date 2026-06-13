import type { Linter } from 'eslint';

import { softenStylistic } from '../../helpers/soften-stylistic.js';
import es5 from '../es5.js';

const config: Linter.Config[] = softenStylistic(es5);

export default config;
