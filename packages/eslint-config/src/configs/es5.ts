import type { Linter } from 'eslint';

import bestPractices from '../rules/best-practices.js';
import es5Rules from '../rules/es5.js';
import imports from '../rules/imports.js';
import possibleErrors from '../rules/possible-errors.js';
import strictRules from '../rules/strict.js';
import style from '../rules/style.js';
import variables from '../rules/variables.js';

/**
 * ES5 preset — for legacy codebases that must target older runtimes.
 * Drops the es6 rule fragment and applies the es5 overrides.
 */
const es5: Linter.Config[] = [
  possibleErrors,
  bestPractices,
  variables,
  imports,
  strictRules,
  style,
  es5Rules,
];

export default es5;
