# @linter-spec/eslint-config

Shareable [ESLint 9 flat-config](https://eslint.org/docs/latest/use/configure/configuration-files) presets used by the `linter-spec` toolchain. 17 entry points covering JS / TS × React / Vue / Node, plus softened `essential/*` variants for legacy codebases.

## Install

```sh
pnpm add -D @linter-spec/eslint-config eslint
```

## Use (flat config)

```js
// eslint.config.js
import base from '@linter-spec/eslint-config';
import tsReact from '@linter-spec/eslint-config/typescript/react';

export default [
  ...base,
  // override anything you like:
  { rules: { 'no-console': 'off' } },
];
```

## Entry points

| Entry | Use when |
| --- | --- |
| `@linter-spec/eslint-config` | Plain ES2022 JavaScript (browser + Node globals) |
| `@linter-spec/eslint-config/es5` | Legacy ES5 codebases |
| `@linter-spec/eslint-config/react` | React (incl. jsx-a11y) |
| `@linter-spec/eslint-config/vue` | Vue 3 |
| `@linter-spec/eslint-config/node` | Node.js (eslint-plugin-n) |
| `@linter-spec/eslint-config/jsx-a11y` | JSX a11y only (standalone) |
| `@linter-spec/eslint-config/typescript` | TypeScript |
| `@linter-spec/eslint-config/typescript/react` | TypeScript + React |
| `@linter-spec/eslint-config/typescript/vue` | TypeScript + Vue 3 |
| `@linter-spec/eslint-config/typescript/node` | TypeScript + Node |
| `@linter-spec/eslint-config/essential` | Base with stylistic rules softened to `warn` |
| `@linter-spec/eslint-config/essential/es5` | ES5 softened |
| `@linter-spec/eslint-config/essential/react` | React softened |
| `@linter-spec/eslint-config/essential/vue` | Vue softened |
| `@linter-spec/eslint-config/essential/typescript` | TS softened |
| `@linter-spec/eslint-config/essential/typescript/react` | TS + React softened |
| `@linter-spec/eslint-config/essential/typescript/vue` | TS + Vue softened |

## Plugin matrix

The base plugins ship as **dependencies** — installed automatically, used by every entry:

- `@stylistic/eslint-plugin` — formatting/stylistic rules (ESLint 9 moved them out of core)
- `eslint-plugin-import-x` — module/import rules (maintained fork of `eslint-plugin-import`)
- `@eslint/js` + `globals` — recommended JS rules and global definitions

The framework plugins are **optional `peerDependencies`** — install only the ones for the entries you use (your package manager warns, but does not error, about any you skip):

| If you use… | Also install |
| --- | --- |
| `react`, `typescript/react`, `essential/react`, `essential/typescript/react` | `eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y` |
| `jsx-a11y` | `eslint-plugin-jsx-a11y` |
| `vue`, `typescript/vue`, `essential/vue`, `essential/typescript/vue` | `eslint-plugin-vue vue-eslint-parser` |
| `node`, `typescript/node` | `eslint-plugin-n` |
| any `typescript/*` or `typescript` entry | `typescript typescript-eslint` |

For example, a TypeScript + React project:

```sh
pnpm add -D @linter-spec/eslint-config eslint \
  typescript typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

If an entry is imported without its peer plugin installed, ESLint throws a clear `Cannot find module 'eslint-plugin-…'` naming exactly what is missing.

## License

MIT © SotherWind
