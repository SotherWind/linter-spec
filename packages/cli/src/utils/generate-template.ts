import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import ejs from 'ejs';
import {
  ESLINT_IGNORE_GLOBS,
  STYLELINT_FILE_EXT,
  STYLELINT_IGNORE_PATTERN,
  MARKDOWN_LINT_IGNORE_PATTERN,
} from './constants.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

type Json = unknown;

const isObject = (v: Json): v is Record<string, Json> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Deep-merge two parsed-JSON values: objects merge recursively, arrays are
 * unioned (source first, deduped), and primitives take the source value.
 * Replaces the single former `lodash.mergeWith` call site.
 */
const deepMerge = (target: Json, source: Json): Json => {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...new Set([...source, ...target])];
  }
  if (isObject(target) && isObject(source)) {
    const out: Record<string, Json> = { ...target };
    for (const key of Object.keys(source)) {
      out[key] = key in target ? deepMerge(target[key], source[key]) : source[key];
    }
    return out;
  }
  return source;
};

/**
 * Merge a generated VS Code config into an existing one (arrays are unioned).
 */
const mergeVSCodeConfig = (filepath: string, content: string): string => {
  if (!fs.existsSync(filepath)) return content;

  try {
    const targetData = fs.readJSONSync(filepath);
    const sourceData = JSON.parse(content);
    return JSON.stringify(deepMerge(targetData, sourceData), null, 2);
  } catch {
    return '';
  }
};

/**
 * Render the EJS config templates into `cwd`.
 * @param cwd  target project root
 * @param data template variables (the resolved `Config` plus `eslintType`)
 * @param vscode only emit the `.vscode/*` templates
 */
export default function generateTemplate(
  cwd: string,
  data: Record<string, unknown>,
  vscode?: boolean,
): void {
  const templatePath = path.resolve(dirname, '../config');
  const templates = fg.sync(`${vscode ? '_vscode' : '**'}/*.ejs`, { cwd: templatePath, dot: true });

  for (const name of templates) {
    const filepath = path.resolve(cwd, name.replace(/\.ejs$/, '').replace(/^_/, '.'));
    let content = ejs.render(fs.readFileSync(path.resolve(templatePath, name), 'utf8'), {
      eslintIgnores: ESLINT_IGNORE_GLOBS,
      stylelintExt: STYLELINT_FILE_EXT,
      stylelintIgnores: STYLELINT_IGNORE_PATTERN,
      markdownLintIgnores: MARKDOWN_LINT_IGNORE_PATTERN,
      ...data,
    });

    if (/^_vscode/.test(name)) {
      content = mergeVSCodeConfig(filepath, content);
    }

    if (!content.trim()) continue;

    fs.outputFileSync(filepath, content, 'utf8');
  }
}
