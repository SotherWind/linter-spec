import type { Linter } from 'eslint';

import { softenStylistic } from '../../helpers/soften-stylistic.js';
import react from '../react.js';

const config: Linter.Config[] = softenStylistic(react);

export default config;
