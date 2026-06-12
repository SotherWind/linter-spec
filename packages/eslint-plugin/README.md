# @linter-spec/eslint-plugin

Custom ESLint rules used by the `linter-spec` toolchain. Targets **ESLint 9 flat config**.

## Install

```sh
pnpm add -D @linter-spec/eslint-plugin eslint
```

## Use (flat config)

```js
// eslint.config.js
import linterSpec from '@linter-spec/eslint-plugin';

export default [
  ...linterSpec.configs.recommended,
];
```

Or wire individual rules:

```js
import linterSpec from '@linter-spec/eslint-plugin';

export default [
  {
    plugins: { '@linter-spec': linterSpec },
    rules: {
      '@linter-spec/no-http-url': 'warn',
      '@linter-spec/no-secret-info': 'error',
      '@linter-spec/no-broad-semantic-versioning': 'error',
      '@linter-spec/no-js-in-ts-project': 'warn',
    },
  },
];
```

## Rules

| Rule | What it does |
| --- | --- |
| `no-http-url` | Warn on `http://` URLs in string literals; prefer `https://` |
| `no-secret-info` | Flag string literals assigned to identifiers matching `secret / token / password` (configurable via `dangerousKeys`) |
| `no-broad-semantic-versioning` | Forbid `*`, `x`, `>` ranges in `package.json` dependencies |
| `no-js-in-ts-project` | Discourage `.js`/`.jsx` source files in TS projects (config files are allowed) |

## License

MIT © SotherWind
