declare module 'markdownlint-rule-helpers' {
  import type { LintError } from 'markdownlint';

  /** Apply markdownlint fix-info to the source text, returning the fixed text. */
  export function applyFixes(input: string, errors: LintError[]): string;
}
