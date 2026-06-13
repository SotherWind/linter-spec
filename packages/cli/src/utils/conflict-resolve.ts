import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { confirm } from '@inquirer/prompts';
import log from './log.js';
import { messages } from './messages.js';
import { CliAbortError } from './errors.js';
import { SKIP_IF_EXISTS } from './generate-template.js';
import type { PKG } from '../types.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Remove these exact dependencies (they conflict or are superseded).
const packageNamesToRemove = [
  '@babel/eslint-parser',
  '@commitlint/cli',
  '@iceworks/spec',
  'babel-eslint',
  'eslint',
  'husky',
  'markdownlint',
  'prettier',
  'stylelint',
  'tslint',
];

// Remove dependencies starting with these prefixes.
const packagePrefixesToRemove = [
  '@commitlint/',
  '@typescript-eslint/',
  'eslint-',
  'stylelint-',
  'markdownlint-',
  'commitlint-',
];

/** Old, now-unused lint config files to delete. */
const checkUselessConfig = (cwd: string): string[] =>
  ([] as string[])
    .concat(fg.sync('.eslintrc?(.@(yaml|yml|json))', { cwd, dot: true }))
    .concat(fg.sync('.stylelintrc?(.@(yaml|yml|json))', { cwd, dot: true }))
    // Old markdownlint config slots we no longer write — all superseded by the
    // single `.markdownlint-cli2.cjs` we now emit:
    //   - `.markdownlint.{json,jsonc,yaml,yml}` / `.markdownlintrc`: legacy
    //     ruleset slots.
    //   - `.markdownlint.cjs`: the ruleset slot an earlier version of this CLI
    //     wrote; cli2 reads it but at lower precedence than `.markdownlint-cli2.cjs`,
    //     so leaving it behind would only confuse readers.
    //   - `.markdownlintignore`: never read by cli2 or the VS Code extension
    //     (only by the legacy `markdownlint-cli`); ignores now live in the cli2
    //     config's `ignores` field.
    .concat(fg.sync('.markdownlint@(rc|.@(json|jsonc|yaml|yml|cjs))', { cwd, dot: true }))
    .concat(fg.sync('.markdownlintignore', { cwd, dot: true }))
    .concat(
      fg.sync('.prettierrc?(.@(cjs|config.js|config.cjs|yaml|yml|json|json5|toml))', {
        cwd,
        dot: true,
      }),
    )
    .concat(fg.sync('tslint.@(yaml|yml|json)', { cwd, dot: true }))
    .concat(fg.sync('.kylerc?(.@(yaml|yml|json))', { cwd, dot: true }));

/** Config files we are about to (over)write that already exist. */
const checkReWriteConfig = (cwd: string): string[] =>
  fg
    .sync('**/*.ejs', { cwd: path.resolve(dirname, '../config'), dot: true })
    .map((name) => name.replace(/^_/, '.').replace(/\.ejs$/, ''))
    .filter((filename) => !SKIP_IF_EXISTS.has(path.basename(filename)))
    .filter((filename) => fs.existsSync(path.resolve(cwd, filename)));

export default async function conflictResolve(cwd: string, rewriteConfig?: boolean): Promise<PKG> {
  const pkgPath = path.resolve(cwd, 'package.json');
  const pkg: PKG = fs.readJSONSync(pkgPath);
  const dependencies = ([] as string[]).concat(
    Object.keys(pkg.dependencies || {}),
    Object.keys(pkg.devDependencies || {}),
  );
  const willRemovePackage = dependencies.filter(
    (name) =>
      packageNamesToRemove.includes(name) ||
      packagePrefixesToRemove.some((prefix) => name.startsWith(prefix)),
  );
  const uselessConfig = checkUselessConfig(cwd);
  const reWriteConfig = checkReWriteConfig(cwd);
  const willChangeCount = willRemovePackage.length + uselessConfig.length + reWriteConfig.length;

  if (willChangeCount > 0) {
    log.warn(messages.conflictDetected);

    if (willRemovePackage.length > 0) {
      log.warn(messages.conflictRemoveDeps);
      log.warn(JSON.stringify(willRemovePackage, null, 2));
    }
    if (uselessConfig.length > 0) {
      log.warn(messages.conflictRemoveConfig);
      log.warn(JSON.stringify(uselessConfig, null, 2));
    }
    if (reWriteConfig.length > 0) {
      log.warn(messages.conflictRewriteConfig);
      log.warn(JSON.stringify(reWriteConfig, null, 2));
    }

    if (typeof rewriteConfig === 'undefined') {
      const isOverWrite = await confirm({ message: messages.conflictConfirm });
      if (!isOverWrite) throw new CliAbortError();
    } else if (!rewriteConfig) {
      throw new CliAbortError();
    }
  }

  for (const name of uselessConfig) {
    fs.removeSync(path.resolve(cwd, name));
  }

  delete pkg.eslintConfig;
  delete pkg.eslintIgnore;
  delete pkg.stylelint;
  for (const name of willRemovePackage) {
    delete (pkg.dependencies || {})[name];
    delete (pkg.devDependencies || {})[name];
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

  return pkg;
}
