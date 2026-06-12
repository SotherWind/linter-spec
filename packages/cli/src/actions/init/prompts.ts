import { select, confirm } from '@inquirer/prompts';
import { PROJECT_TYPES } from '../../utils/constants.js';
import { messages } from '../../utils/messages.js';

export const chooseEslintType = (step: number): Promise<string> =>
  select({
    message: messages.stepChooseType(step),
    choices: PROJECT_TYPES.map((t) => ({ name: t.name, value: t.value })),
  });

export const chooseEnableStylelint = (step: number, defaultValue: boolean): Promise<boolean> =>
  confirm({ message: messages.stepEnableStylelint(step), default: defaultValue });

export const chooseEnableMarkdownlint = (step: number): Promise<boolean> =>
  confirm({ message: messages.stepEnableMarkdownlint(step), default: true });

export const chooseEnablePrettier = (step: number): Promise<boolean> =>
  confirm({ message: messages.stepEnablePrettier(step), default: true });
