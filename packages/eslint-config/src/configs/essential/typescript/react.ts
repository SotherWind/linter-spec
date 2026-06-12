import type { Linter } from 'eslint';

import { softenStylistic } from '../../../helpers/soften-stylistic.js';

import typescriptReact from '../../typescript/react.js';

const config: Linter.Config[] = softenStylistic(typescriptReact);

export default config;
