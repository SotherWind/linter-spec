import { ESLint, type Linter } from 'eslint';
import path from 'node:path';

export interface LintRunResult {
  ruleIds: string[];
  fatalCount: number;
  messageCount: number;
}

/**
 * Run an ESLint instance over a snippet of source code using the provided
 * flat-config array, returning a stable shape that's easy to assert on.
 *
 * `relativeFilePath` is resolved against `process.cwd()` so ESLint considers
 * the virtual file to live inside the linted project (otherwise ESLint v9
 * reports "File ignored because outside of base path").
 */
export async function runLint(
  config: Linter.Config[],
  code: string,
  relativeFilePath: string,
): Promise<LintRunResult> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config as Linter.Config,
  });

  const filePath = path.isAbsolute(relativeFilePath)
    ? relativeFilePath
    : path.resolve(process.cwd(), relativeFilePath);

  const results = await eslint.lintText(code, { filePath });
  const messages = results[0]?.messages ?? [];
  return {
    ruleIds: messages.map((m) => m.ruleId).filter((id): id is string => typeof id === 'string'),
    fatalCount: messages.filter((m) => m.fatal).length,
    messageCount: messages.length,
  };
}
