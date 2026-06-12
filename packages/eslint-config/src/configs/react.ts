import type { Linter } from 'eslint';

import reactRules from '../rules/react.js';
import jsxA11yRules from '../rules/jsx-a11y.js';

import base from './base.js';

/**
 * React preset = base + react + jsx-a11y.
 * jsx-a11y is folded in (no separate entry needed for typical React projects).
 */
const config: Linter.Config[] = [...base, ...reactRules, ...jsxA11yRules];

export default config;
