/**
 * Resolve the documentation URL for a Stylelint rule.
 */
export function getStylelintRuleDocUrl(rule: string | undefined): string {
  if (!rule) return '';

  const scss = rule.match(/^scss\/(\S+)$/);
  if (scss) {
    return `https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/${scss[1]}`;
  }

  const stylistic = rule.match(/^@stylistic\/(\S+)$/);
  if (stylistic) {
    return `https://github.com/stylelint-stylistic/stylelint-stylistic/blob/main/lib/rules/${stylistic[1]}/README.md`;
  }

  if (rule !== 'CssSyntaxError') return `https://stylelint.io/user-guide/rules/${rule}`;

  return '';
}
