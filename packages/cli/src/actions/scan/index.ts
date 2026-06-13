import path from 'node:path';

import fs from 'fs-extra';

import { orchestrate } from './orchestrate.js';
import type { Config, PKG, ScanOptions, ScanReport } from '../../types.js';
import { CLI_NAME } from '../../utils/constants.js';
import { readLinterSpecConfig } from '../../utils/read-config.js';

/**
 * Read project config, run the linters, and (optionally) write a JSON report.
 */
export default async function scan(options: ScanOptions): Promise<ScanReport> {
  const { cwd, outputReport, config: inlineConfig } = options;

  const pkgPath = path.resolve(cwd, 'package.json');
  const pkg: PKG = fs.existsSync(pkgPath) ? fs.readJSONSync(pkgPath) : {};
  const config: Config = inlineConfig || (await readLinterSpecConfig(cwd));

  const report = await orchestrate(options, pkg, config);

  if (outputReport) {
    const reportPath = path.resolve(cwd, `./${CLI_NAME}-report.json`);
    await fs.outputFile(reportPath, JSON.stringify(report.results, null, 2));
  }

  return report;
}
