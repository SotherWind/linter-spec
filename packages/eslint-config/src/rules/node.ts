import type { Linter } from 'eslint';
import n from 'eslint-plugin-n';

/**
 * Node.js rules via eslint-plugin-n (community-maintained fork of
 * eslint-plugin-node).
 *
 * eslint-plugin-n@17 ships its flat-config presets as single Linter.Config
 * objects (not arrays), so we wrap and append our own overrides.
 */
const nRecommended = n.configs?.['flat/recommended-module'] as Linter.Config | undefined;

const nodeConfig: Linter.Config[] = [
  ...(nRecommended ? [nRecommended] : []),
  {
    name: '@linter-spec/node',
    rules: {
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/prefer-global/buffer': ['error', 'never'],
      'n/prefer-global/process': ['error', 'never'],
      'n/prefer-promises/fs': 'warn',
      'n/prefer-promises/dns': 'warn',
    },
  },
];

export default nodeConfig;
