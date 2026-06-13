---
'@linter-spec/cli': patch
---

修复 `linter-spec init` 后 ESLint 立刻崩溃 / tsconfig 报「找不到任何输入」的问题：

- **钉死 ESLint 及插件的主版本**：之前用 `pnpm add -D eslint` 不带版本号，会拉到 `eslint@10.x`；而 `@linter-spec/eslint-config` 的 peer 写的是 `^9.0.0`，`eslint-plugin-react@7.37.x` 也只支持 ESLint 9（ESLint 10 把 `context.getFilename()` 改成 `context.filename`，旧插件在加载 `react/display-name` 时直接 `TypeError: contextOrFilename.getFilename is not a function`）。现在 `install-deps.ts` 用一张 `PINNED_VERSIONS` 表把 `eslint`、`typescript-eslint`、各 `eslint-plugin-*`、`typescript`、`vue-eslint-parser` 全部按 eslint-config 的 peer 范围钉好版本号再传给 `pnpm add -D`。
- **`tsconfig.json` 模板的 `include` 改宽**：原模板写死 `["src/**/*"]`（外加重复的 `src/**/*.tsx`），项目没有 `src/` 目录时 tsc 直接报「找不到任何输入」。改为 `["**/*.ts", "**/*.tsx", "**/*.vue"]`（按所选类型加），并扩充 `exclude` 加入 `.next` / `.nuxt` / `.turbo`，兼容各种目录布局。
