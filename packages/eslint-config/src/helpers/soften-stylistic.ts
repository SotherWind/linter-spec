import type { Linter } from 'eslint';

/**
 * Walk a flat-config array and downgrade every `'error'` / `2` rule whose ID
 * looks "stylistic" (formatting/whitespace/punctuation) to `'warn'`.
 *
 * Used by the `essential/*` family of presets to produce a "softer" preset
 * suitable for legacy codebases — formatting violations surface as warnings,
 * correctness violations stay as errors.
 *
 * Renamed from fe-spec's `set-style-to-warn.js` — semantics are identical.
 */
export function softenStylistic(configs: Linter.Config[]): Linter.Config[] {
  return configs.map((config) => {
    if (!config.rules) return config;
    const newRules: Linter.RulesRecord = {};
    for (const [ruleId, level] of Object.entries(config.rules)) {
      newRules[ruleId] = (isStylistic(ruleId) ? softenLevel(level) : level) as Linter.RuleEntry;
    }
    return { ...config, rules: newRules };
  });
}

function isStylistic(ruleId: string): boolean {
  // Anything under @stylistic/* is by definition stylistic.
  // Also legacy ESLint formatting rules that may still be referenced.
  if (ruleId.startsWith('@stylistic/')) return true;
  const STYLISTIC_LEGACY = new Set([
    'indent',
    'quotes',
    'semi',
    'comma-dangle',
    'comma-spacing',
    'comma-style',
    'space-before-function-paren',
    'space-in-parens',
    'space-infix-ops',
    'space-before-blocks',
    'spaced-comment',
    'arrow-parens',
    'arrow-spacing',
    'object-curly-spacing',
    'array-bracket-spacing',
    'key-spacing',
    'keyword-spacing',
    'no-multi-spaces',
    'no-multiple-empty-lines',
    'no-trailing-spaces',
    'eol-last',
    'padded-blocks',
    'max-len',
    'block-spacing',
    'brace-style',
    'computed-property-spacing',
    'curly',
    'dot-location',
    'func-call-spacing',
    'function-paren-newline',
    'implicit-arrow-linebreak',
    'jsx-quotes',
    'linebreak-style',
    'lines-around-comment',
    'lines-between-class-members',
    'multiline-ternary',
    'new-parens',
    'newline-per-chained-call',
    'no-extra-parens',
    'no-mixed-operators',
    'no-mixed-spaces-and-tabs',
    'no-whitespace-before-property',
    'nonblock-statement-body-position',
    'object-curly-newline',
    'object-property-newline',
    'operator-linebreak',
    'quote-props',
    'semi-spacing',
    'semi-style',
    'switch-colon-spacing',
    'template-curly-spacing',
    'template-tag-spacing',
    'unicode-bom',
    'wrap-iife',
    'wrap-regex',
    'yield-star-spacing',
  ]);
  return STYLISTIC_LEGACY.has(ruleId);
}

function softenLevel(level: unknown): unknown {
  if (level === 'error' || level === 2) return 'warn';
  if (Array.isArray(level) && level.length > 0) {
    const [first, ...rest] = level;
    if (first === 'error' || first === 2) return ['warn', ...rest];
  }
  return level;
}
