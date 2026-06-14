# @linter-spec/eslint-config

## 1.0.2

### Patch Changes

- b386528: 将 `e8292d5 chore: apply import-x/order autofix and switch prettier to named imports` 中的代码整洁化同步到 npm：
  - `@linter-spec/cli`: `packages/cli/src/lints/prettier/do-prettier.ts` 由 `import prettier from 'prettier'` 改为 `import { format, getFileInfo, resolveConfig } from 'prettier'` —— prettier 3 是纯 ESM、没有真正的默认导出，原写法仅靠 Node 的 CJS interop 才能跑通，且让 `import-x/default` 误报；新写法编译出的 JS 略有不同但调用同一份 prettier API。
  - `@linter-spec/eslint-config` / `@linter-spec/eslint-plugin`: `eslint . --fix` 在 `.ts` 源码各 import 分组间插入空行，tsc 编译产物随之改变（但不影响任何规则行为）。

  无任何用户可观察的行为变化，纯粹是让 npm 上发布的 JS 与 GitHub 上的 TS 源码保持同步。

## 1.0.1

### Patch Changes

- 2ecd529: 修复 base 预设里所有 rules 在 `.ts` / `.tsx` 文件上完全不生效的严重 bug：

  `packages/eslint-config/src/configs/base.ts` 之前在末尾用 `.map((config) => ({ ...config, files: ['**/*.{js,mjs,cjs,jsx}'] }))` 把整个 base 数组里**每一个 block**（包括 `js.configs.recommended`、`possibleErrors`、`bestPractices`、`variables`、`es6`、`imports`、`style`）都加上了 JS-only 的 `files` 匹配。结果在 TS 项目里：
  - `no-var`、`eqeqeq`、`curly`、`array-callback-return`、`complexity`、`no-implied-eval` 等几十条通用 hygiene 规则**完全不会对 TS 文件触发**；
  - 用户改 `@linter-spec/eslint-config/es5`、`/es6` 里的 `no-var` 也没用 —— 因为这两份 rules 根本没被加载到 .ts 文件上。

  原注释里说这样写是为了让 ESLint v9 把 `.jsx` 纳入默认 lint 集，但其实只需要把 `files: JS_FILES` 加到「携带 JS 专属 languageOptions 的那个 block」一处即可。

  修复：移除 `.map(...)`，只在 `@linter-spec/base/language` block 上保留 `files: JS_FILES`（它既负责 JS 解析器/全局变量隔离，又承担 `.jsx` 文件集锚点的角色）。所有纯 rules block 不再带 `files`，从而对 `.js` 与 `.ts/.tsx` 都生效；`typescript-eslint` 仍会对少数有 TS-aware 替代的规则做 override（如 `no-unused-vars`）。

  新增两个回归测试（`packages/eslint-config/test/typescript.test.ts`）：验证 `no-var`、`array-callback-return` 现在确实在 `.ts` 文件里报。
