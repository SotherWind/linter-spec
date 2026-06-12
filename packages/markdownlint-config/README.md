# @linter-spec/markdownlint-config

Shareable [markdownlint](https://github.com/DavidAnson/markdownlint) configuration used by the `linter-spec` toolchain. Targets markdownlint **0.34+** rule names.

## Install

```sh
pnpm add -D @linter-spec/markdownlint-config markdownlint
```

## Use

Add a `.markdownlint-cli2.jsonc` (recommended) or `.markdownlint.json` at your project root:

```jsonc
{
  "config": {
    "extends": "@linter-spec/markdownlint-config"
  }
}
```

## What it tweaks vs. `default: true`

| Rule | Setting | Why |
| --- | --- | --- |
| `ul-style` | `dash` | Consistency across files |
| `no-trailing-spaces` | `br_spaces: 0` | Forbid soft-break trailing-space syntax |
| `list-marker-space` | off | Too strict for nested lists |
| `line-length` | off | Long lines are common in docs |
| `no-inline-html` | off | Useful for `<details>` and similar |
| `no-duplicate-heading` | off | Multiple sections may share titles |
| `first-line-heading` | off | YAML frontmatter conflicts |
| `proper-names` | configured | Enforce correct capitalisation of common brand/tech names |

## License

MIT © SotherWind
