import { CLI_NAME, PKG_NAME } from './constants.js';

/**
 * Centralised user-facing strings, parameterised by the CLI name so renames
 * stay in one place.
 */
export const messages = {
  // eslint-disable-next-line @stylistic/max-len
  description: `${CLI_NAME} is the lint toolchain for the linter-spec frontend coding standards. It exposes a simple CLI and Node.js API to set up, scan, fix, and upgrade your project — and to gate commits via git hooks.`,

  // command descriptions
  initDescription:
    'Initialise lint tools and configs for the project (customisable by project type and needs)',
  scanDescription: 'Scan the project for coding-standard issues',
  fixDescription: 'Auto-fix coding-standard issues found by the scan',
  updateDescription: `Update ${PKG_NAME} to the latest version`,
  commitMsgScanDescription:
    'Commit-message check: validates the commit message at `git commit` time',
  commitFileScanDescription: 'Pre-commit scan: lints staged files at `git commit` time',

  // option descriptions
  optVscode: 'Write .vscode/settings.json',
  optQuiet: 'Report errors only (default: false)',
  optOutputReport: 'Write the scan report to a file',
  optInclude: 'Directories to scan',
  optNoIgnore: 'Ignore ESLint ignore-config files and rules',
  optStrict: 'Strict mode: fail on warnings as well as errors (default: errors only)',

  // runtime
  runChecking: `Running ${CLI_NAME} lint check`,
  runFixing: `Running ${CLI_NAME} lint autofix`,
  runCommitChecking: `Running ${CLI_NAME} pre-commit check`,
  installingDeps: (npm: string) =>
    `Project lint config detected but dependencies are missing — installing (\`${npm} install\`)`,
  notStaged: (files: string) => `[${CLI_NAME}] changes not staged for commit: \n${files}\n`,

  // init steps
  stepChooseType: (step: number) =>
    `Step ${step}. Select the project's language (JS/TS) and framework (React/Vue):`,
  stepEnableStylelint: (step: number) =>
    `Step ${step}. Enable stylelint? (skip if the project has no style files):`,
  stepEnableMarkdownlint: (step: number) =>
    `Step ${step}. Enable markdownlint? (skip if the project has no Markdown files):`,
  stepEnablePrettier: (step: number) => `Step ${step}. Enable Prettier for code formatting:`,
  stepConflict: (step: number) =>
    `Step ${step}. Checking for and resolving conflicting dependencies and configs`,
  stepConflictDone: (step: number) =>
    `Step ${step}. Conflicting dependencies and configs resolved :D`,
  stepInstall: (step: number) => `Step ${step}. Installing dependencies`,
  stepInstallDone: (step: number) => `Step ${step}. Dependencies installed :D`,
  stepHusky: (step: number) => `Step ${step}. Configuring git commit hooks`,
  stepHuskyDone: (step: number) => `Step ${step}. Git commit hooks configured :D`,
  stepWrite: (step: number) => `Step ${step}. Writing config files`,
  stepWriteDone: (step: number) => `Step ${step}. Config files written :D`,
  initDone: `${CLI_NAME} initialisation complete :D`,

  // conflict resolve
  conflictDetected: `Detected dependencies/configs that may conflict with ${CLI_NAME}; to keep it working, will`,
  conflictRemoveDeps: 'Remove the following dependencies:',
  conflictRemoveConfig: 'Remove the following config files:',
  conflictRewriteConfig: 'Overwrite the following config files:',
  conflictConfirm: 'Continue?',
  conflictCancelled: 'Cancelled. No files were modified.',

  // update
  updateChecking: `[${PKG_NAME}] Checking for the latest version...`,
  updateFound: (v: string) => `[${PKG_NAME}] A new version is available — upgrading to ${v}`,
  updateHint: (latest: string, current: string, command: string) =>
    `Latest version is ${latest}, local version is ${current}. Please upgrade soon.\nRun ${command} to install it.\n`,
  updateNone: 'No updates available',
} as const;
