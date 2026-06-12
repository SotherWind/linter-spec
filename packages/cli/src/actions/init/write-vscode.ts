import generateTemplate from '../../utils/generate-template.js';

/**
 * Write (and merge) only the `.vscode/*` config into the project.
 */
export function writeVSCodeConfig(cwd: string, data: Record<string, unknown>): void {
  generateTemplate(cwd, data, true);
}
