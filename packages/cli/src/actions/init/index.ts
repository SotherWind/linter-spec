import path from 'node:path';
import fs from 'fs-extra';
import update from '../update.js';
import log from '../../utils/log.js';
import conflictResolve from '../../utils/conflict-resolve.js';
import generateTemplate from '../../utils/generate-template.js';
import { CLI_NAME, PROJECT_TYPES } from '../../utils/constants.js';
import { messages } from '../../utils/messages.js';
import {
  chooseEnableMarkdownlint,
  chooseEnablePrettier,
  chooseEnableStylelint,
  chooseEslintType,
} from './prompts.js';
import { installCliDep } from './install-deps.js';
import { setupHusky } from './setup-husky.js';
import type { InitOptions, PKG } from '../../types.js';

interface InitConfig {
  enableESLint: boolean;
  eslintType: string;
  enableStylelint: boolean;
  enableMarkdownlint: boolean;
  enablePrettier: boolean;
}

export default async function init(options: InitOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();
  const isTest = process.env.NODE_ENV === 'test';
  const checkVersionUpdate = options.checkVersionUpdate || false;
  const disableNpmInstall = options.disableNpmInstall || false;
  const pkgPath = path.resolve(cwd, 'package.json');
  let pkg: PKG = fs.readJSONSync(pkgPath);
  let step = 0;

  if (!isTest && checkVersionUpdate) {
    await update(false);
  }

  const enableESLint = typeof options.enableESLint === 'boolean' ? options.enableESLint : true;

  const eslintType =
    options.eslintType && PROJECT_TYPES.some((c) => c.value === options.eslintType)
      ? options.eslintType
      : await chooseEslintType(++step);

  const enableStylelint =
    typeof options.enableStylelint === 'boolean'
      ? options.enableStylelint
      : await chooseEnableStylelint(++step, !/node/.test(eslintType));

  const enableMarkdownlint =
    typeof options.enableMarkdownlint === 'boolean'
      ? options.enableMarkdownlint
      : await chooseEnableMarkdownlint(++step);

  const enablePrettier =
    typeof options.enablePrettier === 'boolean'
      ? options.enablePrettier
      : await chooseEnablePrettier(++step);

  const config: InitConfig = {
    enableESLint,
    eslintType,
    enableStylelint,
    enableMarkdownlint,
    enablePrettier,
  };

  if (!isTest) {
    log.info(messages.stepConflict(++step));
    pkg = await conflictResolve(cwd, options.rewriteConfig);
    log.success(messages.stepConflictDone(step));

    if (!disableNpmInstall) {
      log.info(messages.stepInstall(++step));
      await installCliDep(cwd);
      log.success(messages.stepInstallDone(step));
    }
  }

  // Re-read: install / conflict-resolve may have rewritten package.json.
  pkg = fs.readJSONSync(pkgPath);
  if (!pkg.scripts) pkg.scripts = {};
  pkg.scripts[`${CLI_NAME}-scan`] ??= `${CLI_NAME} scan`;
  pkg.scripts[`${CLI_NAME}-fix`] ??= `${CLI_NAME} fix`;

  log.info(messages.stepHusky(++step));
  setupHusky(cwd, pkg);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  log.success(messages.stepHuskyDone(step));

  log.info(messages.stepWrite(++step));
  generateTemplate(cwd, config as unknown as Record<string, unknown>);
  log.success(messages.stepWriteDone(step));

  log.success(messages.initDone);
}
