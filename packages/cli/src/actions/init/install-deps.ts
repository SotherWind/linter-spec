import path from 'node:path';

import spawn from 'cross-spawn';
import fg from 'fast-glob';
import fs from 'fs-extra';

import { PKG_NAME } from '../../utils/constants.js';
import log from '../../utils/log.js';
import { messages } from '../../utils/messages.js';
import { detectPackageManager, addDevCommand, installAllCommand } from '../../utils/npm.js';

/** True when the project carries its own lint config files. */
export function hasLocalLintConfig(cwd: string): boolean {
  return (
    fg.sync(
      [
        '.eslintrc?(.@(js|cjs|mjs|yaml|yml|json))',
        'eslint.config.@(js|mjs|cjs|ts)',
        '.stylelintrc?(.@(js|cjs|mjs|yaml|yml|json))',
        'stylelint.config.@(js|mjs|cjs)',
        '.markdownlint?(-cli2).@(jsonc|json|yaml|yml|cjs|mjs)',
      ],
      { cwd, dot: true },
    ).length > 0
  );
}

export interface ProjectDepsConfig {
  enableESLint: boolean;
  eslintType: string;
  enableStylelint: boolean;
  enableMarkdownlint: boolean;
  enablePrettier: boolean;
}

/**
 * Version ranges to pin so npm/pnpm don't pull a major that the config doesn't
 * support yet. Mirrors `@linter-spec/eslint-config`'s `peerDependencies` —
 * e.g., ESLint 10 changed `context.getFilename()` to `context.filename`, which
 * crashes `eslint-plugin-react@7` at rule-load time. Keep this in sync with
 * eslint-config's peers if those ranges bump.
 */
const PINNED_VERSIONS: Readonly<Record<string, string>> = {
  eslint: '^9.0.0',
  typescript: '^6.0.2',
  'typescript-eslint': '^8.8.1',
  'eslint-plugin-react': '^7.37.1',
  'eslint-plugin-react-hooks': '^5.0.0',
  'eslint-plugin-jsx-a11y': '^6.10.0',
  'eslint-plugin-vue': '^9.28.0',
  'vue-eslint-parser': '^9.4.3',
  'eslint-plugin-n': '^17.10.3',
  husky: '^9.0.0',
};

function pin(name: string): string {
  const v = PINNED_VERSIONS[name];
  return v ? `${name}@${v}` : name;
}

/**
 * The npm packages to install as devDependencies of the user's project so that
 * the generated `eslint.config.mjs` (and friends) can resolve everything they
 * need — including peers of `@linter-spec/eslint-config` that are marked
 * `optional` in its `peerDependenciesMeta` and therefore would NOT be installed
 * transitively just by adding `@linter-spec/cli`.
 */
export function projectDepsToInstall(config: ProjectDepsConfig): string[] {
  const deps = new Set<string>([PKG_NAME, 'husky']);

  if (config.enableESLint) {
    deps.add('eslint');
    deps.add('@linter-spec/eslint-config');

    const t = config.eslintType;
    const isTs = t.startsWith('typescript');
    const isReact = t === 'react' || t === 'typescript/react';
    const isVue = t === 'vue' || t === 'typescript/vue';
    const isNode = t === 'node' || t === 'typescript/node';

    if (isTs) {
      deps.add('typescript');
      deps.add('typescript-eslint');
    }
    if (isReact) {
      deps.add('eslint-plugin-react');
      deps.add('eslint-plugin-react-hooks');
      deps.add('eslint-plugin-jsx-a11y');
    }
    if (isVue) {
      deps.add('eslint-plugin-vue');
      deps.add('vue-eslint-parser');
    }
    if (isNode) {
      deps.add('eslint-plugin-n');
    }
  }

  if (config.enableStylelint) {
    deps.add('stylelint');
    deps.add('@linter-spec/stylelint-config');
  }
  if (config.enableMarkdownlint) {
    deps.add('markdownlint-cli2');
    deps.add('@linter-spec/markdownlint-config');
  }
  if (config.enablePrettier) {
    deps.add('prettier');
  }

  return [...deps].map(pin);
}

/**
 * Install everything the chosen lint setup needs (CLI + eslint-config +
 * project-type-specific plugins + selected toolchains) as devDeps of `cwd`.
 */
export async function installProjectDeps(cwd: string, config: ProjectDepsConfig): Promise<void> {
  const pm = detectPackageManager(cwd);
  const pkgs = projectDepsToInstall(config);
  const [command, args] = addDevCommand(pm, pkgs);

  const result = spawn.sync(command, args, { stdio: 'inherit', cwd });
  if (result.status !== 0) {
    throw new Error(
      `Failed to install project dependencies (\`${command} ${args.join(' ')}\` exited with ${result.status}).`,
    );
  }
}

/**
 * When a project relies on the bundled lint configs but has no `node_modules`,
 * install its dependencies first (otherwise config resolution fails).
 */
export async function installProjectDepsIfMissing(
  cwd: string,
  hasLocalConfig: boolean,
): Promise<void> {
  const nodeModulesPath = path.resolve(cwd, 'node_modules');
  if (!fs.existsSync(nodeModulesPath) && hasLocalConfig) {
    const pm = detectPackageManager(cwd);
    log.info(messages.installingDeps(pm));
    const [command, args] = installAllCommand(pm);
    spawn.sync(command, args, { cwd, stdio: 'inherit' });
  }
}
