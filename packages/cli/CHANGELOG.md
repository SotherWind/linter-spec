# @linter-spec/cli

## 1.0.4

### Patch Changes

- 3fc8eea: `linter-spec init` 修两处用户可见的问题，外加 TypeScript 6 适配：
  - **安装 husky 作为 devDependency**：`setupHusky` 一直会向 `package.json` 写入 `"prepare": "husky"`，但 `installProjectDeps` 从未把 `husky` 加进要安装的包列表。init 阶段不会报错（prepare 是写完才生效，当时的 `pnpm add` 已经跑过了），但下一次 `pnpm install` / `npm install` 触发 prepare 脚本时会失败 —— `'husky' 不是内部命令`。现在 `husky@^9.0.0` 进入了 init 的 devDeps 安装集合。
  - **生成的 `.vscode/settings.json` 将 `source.fixAll.eslint` 由 `'explicit'` 改为 `'never'`**：避免保存时静默触发 ESLint 自动修复（用户报告希望显式手动 fix，stylelint / markdownlint 仍保留 `'explicit'`）。
  - **TypeScript 6 支持**：`@linter-spec/cli` 的 `PINNED_VERSIONS.typescript` 由 `^5.6.2` 升级到 `^6.0.2`，新 init 出的项目默认装 TS 6.0.x（typescript-eslint 8.61 的 peer 范围 `>=4.8.4 <6.1.0` 完全兼容）。同步把 `@linter-spec/eslint-config` 的 `typescript` peerDependency 升到 `^6.0.0`。
  - **CLI 所有用户可见文案改为英文**：`messages.ts`、`print-report.ts`、`constants.ts` 里命令描述、option 帮助、init 流程的 step 提示、conflict 解析提示、update 提示、扫描报告 summary、项目类型选项等全部英文化。仅 `@linter-spec/cli`（runtime 字符串）受影响；presets 包不受影响。

- Updated dependencies [3fc8eea]
  - @linter-spec/eslint-config@1.0.3

## 1.0.3

### Patch Changes

- b386528: 将 `e8292d5 chore: apply import-x/order autofix and switch prettier to named imports` 中的代码整洁化同步到 npm：
  - `@linter-spec/cli`: `packages/cli/src/lints/prettier/do-prettier.ts` 由 `import prettier from 'prettier'` 改为 `import { format, getFileInfo, resolveConfig } from 'prettier'` —— prettier 3 是纯 ESM、没有真正的默认导出，原写法仅靠 Node 的 CJS interop 才能跑通，且让 `import-x/default` 误报；新写法编译出的 JS 略有不同但调用同一份 prettier API。
  - `@linter-spec/eslint-config` / `@linter-spec/eslint-plugin`: `eslint . --fix` 在 `.ts` 源码各 import 分组间插入空行，tsc 编译产物随之改变（但不影响任何规则行为）。

  无任何用户可观察的行为变化，纯粹是让 npm 上发布的 JS 与 GitHub 上的 TS 源码保持同步。

- Updated dependencies [b386528]
  - @linter-spec/eslint-config@1.0.2

## 1.0.2

### Patch Changes

- 8416619: 修复 `linter-spec init` 后 ESLint 立刻崩溃 / tsconfig 报「找不到任何输入」的问题：
  - **钉死 ESLint 及插件的主版本**：之前用 `pnpm add -D eslint` 不带版本号，会拉到 `eslint@10.x`；而 `@linter-spec/eslint-config` 的 peer 写的是 `^9.0.0`，`eslint-plugin-react@7.37.x` 也只支持 ESLint 9（ESLint 10 把 `context.getFilename()` 改成 `context.filename`，旧插件在加载 `react/display-name` 时直接 `TypeError: contextOrFilename.getFilename is not a function`）。现在 `install-deps.ts` 用一张 `PINNED_VERSIONS` 表把 `eslint`、`typescript-eslint`、各 `eslint-plugin-*`、`typescript`、`vue-eslint-parser` 全部按 eslint-config 的 peer 范围钉好版本号再传给 `pnpm add -D`。
  - **`tsconfig.json` 模板的 `include` 改宽**：原模板写死 `["src/**/*"]`（外加重复的 `src/**/*.tsx`），项目没有 `src/` 目录时 tsc 直接报「找不到任何输入」。改为 `["**/*.ts", "**/*.tsx", "**/*.vue"]`（按所选类型加），并扩充 `exclude` 加入 `.next` / `.nuxt` / `.turbo`，兼容各种目录布局。

## 1.0.1

### Patch Changes

- 7d5be33: 修复 `linter-spec init` 后项目无法直接使用的问题：
  - **安装齐全所选项目类型必需的 ESLint 插件**：`installCliDep` 之前只装 `@linter-spec/cli` 本身，导致 `@linter-spec/eslint-config` 的可选 peer（`typescript-eslint`、`eslint-plugin-react`、`eslint-plugin-react-hooks`、`eslint-plugin-jsx-a11y`、`eslint-plugin-vue`、`vue-eslint-parser`、`eslint-plugin-n`）不会随之安装；同时 `@linter-spec/eslint-config` 仅作为传递依赖存在，VS Code ESLint 扩展在 pnpm 严格模式等场景下解析不到。现在 `init` 会按所选 `eslintType` 一次性把 `eslint`、`@linter-spec/eslint-config` 以及对应的 React/Vue/Node/TypeScript 插件全部写入用户项目的 devDependencies。
  - **为 TypeScript 项目生成 `tsconfig.json`**：新增 `tsconfig.json.ejs` 模板，仅在 `typescript/*` 类型下渲染，并按 react/vue/node 调整 `lib`、`jsx`、`include`；已存在的 `tsconfig.json` 不会被覆盖。
  - 安装命令失败时（exit code ≠ 0）抛出明确错误，不再吞掉。
