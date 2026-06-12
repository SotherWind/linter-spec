# @linter-spec/stylelint-config

Shareable [Stylelint](https://stylelint.io/) configuration used by the `linter-spec` toolchain. Lints **CSS**, **SCSS** and **Less**, targeting Stylelint **16/17**.

## Install

```sh
pnpm add -D @linter-spec/stylelint-config stylelint
```

`stylelint` is the only peer dependency. The shared configs and plugins this
config builds on (`stylelint-config-standard`, `stylelint-config-recommended-scss`,
`stylelint-scss`, `@stylistic/stylelint-plugin`, `postcss-less`) ship as regular
dependencies, so nothing else needs to be installed.

## Use

Create a `stylelint.config.js` (or `.stylelintrc.json`) at your project root:

```js
// stylelint.config.js
export default {
  extends: ['@linter-spec/stylelint-config'],
};
```

## How it is layered

Stylelint 16 removed every *stylistic* rule from core. They now live in
`@stylistic/stylelint-plugin` and are referenced here with the `@stylistic/`
prefix (e.g. `indentation` → `@stylistic/indentation`), preserving the original
conventions.

| Layer | Scope | Provides |
| --- | --- | --- |
| `stylelint-config-standard` | all files | Modern CSS best-practice baseline |
| `@stylistic/stylelint-plugin` | all files | Whitespace / casing / brace style |
| `stylelint-config-recommended-scss` + `stylelint-scss` | `*.scss` only | SCSS parsing + SCSS-aware rules |
| `postcss-less` | `*.less` only | Less parsing |

Scoping the SCSS rules to `*.scss` (via `overrides`) is deliberate: running the
SCSS parser/rules against a Less AST crashes Stylelint.

## Notable intent rules

| Rule | Setting | Why |
| --- | --- | --- |
| `unit-no-unknown` | `ignoreUnits: ['rpx']` | Allow the mini-program `rpx` unit |
| `selector-pseudo-class-no-unknown` | `ignorePseudoClasses: ['global', 'local', 'export']` | Allow CSS Modules `:global` / `:local` / `:export` |
| `no-descending-specificity` | off | Source-order specificity is common and well understood |
| `selector-max-id` | `0` | Disallow `#id` selectors |
| `declaration-block-no-duplicate-properties` | allow consecutive fallbacks | Permit progressive-enhancement fallbacks |
| `scss/at-rule-no-unknown` | on (`*.scss`) | Understands `@mixin` / `@include`, unlike core |

The default severity is `warning`, so issues surface without blocking the build
(`@stylistic/declaration-block-trailing-semicolon` is kept at `error`).

## License

MIT © SotherWind
