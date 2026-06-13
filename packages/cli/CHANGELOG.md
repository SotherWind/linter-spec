# @linter-spec/cli

## 1.0.1

### Patch Changes

- 7d5be33: 修复 `linter-spec init` 后项目无法直接使用的问题：
  - **安装齐全所选项目类型必需的 ESLint 插件**：`installCliDep` 之前只装 `@linter-spec/cli` 本身，导致 `@linter-spec/eslint-config` 的可选 peer（`typescript-eslint`、`eslint-plugin-react`、`eslint-plugin-react-hooks`、`eslint-plugin-jsx-a11y`、`eslint-plugin-vue`、`vue-eslint-parser`、`eslint-plugin-n`）不会随之安装；同时 `@linter-spec/eslint-config` 仅作为传递依赖存在，VS Code ESLint 扩展在 pnpm 严格模式等场景下解析不到。现在 `init` 会按所选 `eslintType` 一次性把 `eslint`、`@linter-spec/eslint-config` 以及对应的 React/Vue/Node/TypeScript 插件全部写入用户项目的 devDependencies。
  - **为 TypeScript 项目生成 `tsconfig.json`**：新增 `tsconfig.json.ejs` 模板，仅在 `typescript/*` 类型下渲染，并按 react/vue/node 调整 `lib`、`jsx`、`include`；已存在的 `tsconfig.json` 不会被覆盖。
  - 安装命令失败时（exit code ≠ 0）抛出明确错误，不再吞掉。
