import type { ESLint } from 'eslint';
import type markdownlint from 'markdownlint';
import type stylelint from 'stylelint';

export interface PKG {
  eslintConfig?: unknown;
  eslintIgnore?: string[];
  stylelint?: unknown;
  husky?: Record<string, unknown>;
  scripts?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
}

export interface Config {
  /** Enable ESLint (default true). */
  enableESLint?: boolean;
  /** Enable Stylelint (default true). */
  enableStylelint?: boolean;
  /** Enable markdownlint (default true). */
  enableMarkdownlint?: boolean;
  /** Enable Prettier (default true). */
  enablePrettier?: boolean;
  /** Override ESLint options. */
  eslintOptions?: ESLint.Options;
  /** Override Stylelint options. */
  stylelintOptions?: Partial<stylelint.LinterOptions>;
  /** Override markdownlint options. */
  markdownlintOptions?: markdownlint.Options;
}

export interface ScanOptions {
  /** Project root the lint runs in. */
  cwd: string;
  /** Directory to scan. */
  include: string;
  /** Explicit file list to scan (overrides `include`). */
  files?: string[];
  /** Only report errors. */
  quiet?: boolean;
  /** Honour ESLint ignore files / rules (maps to `--no-ignore`). */
  ignore?: boolean;
  /** Auto-fix. */
  fix?: boolean;
  /** Write a JSON report file. */
  outputReport?: boolean;
  /** Inline config, takes precedence over `linter-spec.config.*`. */
  config?: Config;
}

export interface ScanMessage {
  line: number;
  column: number;
  rule: string | null;
  url: string;
  message: string;
  errored: boolean;
}

export interface ScanResult {
  filePath: string;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  messages: ScanMessage[];
}

export interface ScanReport {
  results: ScanResult[];
  errorCount: number;
  warningCount: number;
  runErrors: Error[];
}

export interface InitOptions {
  cwd: string;
  /** Check for and self-update the CLI before initialising. */
  checkVersionUpdate: boolean;
  /** Auto-rewrite conflicting lint config without prompting. */
  rewriteConfig?: boolean;
  /** ESLint project type (see `PROJECT_TYPES`). */
  eslintType?: string;
  enableESLint?: boolean;
  enableStylelint?: boolean;
  enableMarkdownlint?: boolean;
  enablePrettier?: boolean;
  /** Skip the post-init dependency install. */
  disableNpmInstall?: boolean;
}
