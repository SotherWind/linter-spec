import type { Linter } from 'eslint';

import jsxA11yRules from '../../rules/jsx-a11y.js';
import reactRules from '../../rules/react.js';
import tsRules from '../../rules/typescript.js';

import base from '../base.js';

const config: Linter.Config[] = [...base, ...tsRules, ...reactRules, ...jsxA11yRules];

export default config;
