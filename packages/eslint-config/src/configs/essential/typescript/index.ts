import type { Linter } from 'eslint';

import { softenStylistic } from '../../../helpers/soften-stylistic.js';
import typescript from '../../typescript/index.js';

const config: Linter.Config[] = softenStylistic(typescript);

export default config;
