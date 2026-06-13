import type { Linter } from 'eslint';

import base from './base.js';
import jsxA11yRules from '../rules/jsx-a11y.js';

/**
 * Standalone jsx-a11y preset. Use this when you want JSX a11y checks without
 * the rest of the React-specific rule set (most users want `./react` instead).
 */
const config: Linter.Config[] = [...base, ...jsxA11yRules];

export default config;
