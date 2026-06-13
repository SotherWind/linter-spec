import spawn from 'cross-spawn';
import path from 'node:path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { detectPackageManager, addDevCommand, installAllCommand } from '../../utils/npm.js';
import log from '../../utils/log.js';
import { messages } from '../../utils/messages.js';
import { PKG_NAME } from '../../utils/constants.js';

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
 * The npm packages to install as devDependencies of the user's project so that
 * the generated `eslint.config.mjs` (and friends) can resolve everything they
 * need — including peers of `@linter-spec/eslint-config` that are marked
 * `optional` in its `peerDependenciesMeta` and therefore would NOT be installed
 * transitively just by adding `@linter-spec/cli`.
 */
export function projectDepsToInstall(config: ProjectDepsConfig): string[] {
  const deps = new Set<string>([PKG_NAME]);

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

  return [...deps];
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
