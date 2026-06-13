import ora from 'ora';

import initAction from './actions/init/index.js';
import scanAction from './actions/scan/index.js';
import type { InitOptions, ScanOptions, ScanReport } from './types.js';
import { messages } from './utils/messages.js';
import printReport from './utils/print-report.js';

/** Programmatically initialise a project (never self-updates the CLI). */
export const init = (options: Omit<InitOptions, 'checkVersionUpdate'>): Promise<void> =>
  initAction({ ...options, checkVersionUpdate: false });

/** Programmatically scan a project, printing a report. */
export const scan = async (options: ScanOptions): Promise<ScanReport> => {
  const checking = ora();
  checking.start(messages.runChecking);

  const report = await scanAction(options);
  const { results, errorCount, warningCount } = report;

  if (errorCount > 0) checking.fail();
  else if (warningCount > 0) checking.warn();
  else checking.succeed();

  if (results.length > 0) printReport(results, false);

  return report;
};

export type {
  Config,
  ScanOptions,
  ScanReport,
  ScanResult,
  ScanMessage,
  InitOptions,
} from './types.js';
