---
'@linter-spec/eslint-config': patch
---

修复 base 预设里所有 rules 在 `.ts` / `.tsx` 文件上完全不生效的严重 bug：

`packages/eslint-config/src/configs/base.ts` 之前在末尾用 `.map((config) => ({ ...config, files: ['**/*.{js,mjs,cjs,jsx}'] }))` 把整个 base 数组里**每一个 block**（包括 `js.configs.recommended`、`possibleErrors`、`bestPractices`、`variables`、`es6`、`imports`、`style`）都加上了 JS-only 的 `files` 匹配。结果在 TS 项目里：

- `no-var`、`eqeqeq`、`curly`、`array-callback-return`、`complexity`、`no-implied-eval` 等几十条通用 hygiene 规则**完全不会对 TS 文件触发**；
- 用户改 `@linter-spec/eslint-config/es5`、`/es6` 里的 `no-var` 也没用 —— 因为这两份 rules 根本没被加载到 .ts 文件上。

原注释里说这样写是为了让 ESLint v9 把 `.jsx` 纳入默认 lint 集，但其实只需要把 `files: JS_FILES` 加到「携带 JS 专属 languageOptions 的那个 block」一处即可。

修复：移除 `.map(...)`，只在 `@linter-spec/base/language` block 上保留 `files: JS_FILES`（它既负责 JS 解析器/全局变量隔离，又承担 `.jsx` 文件集锚点的角色）。所有纯 rules block 不再带 `files`，从而对 `.js` 与 `.ts/.tsx` 都生效；`typescript-eslint` 仍会对少数有 TS-aware 替代的规则做 override（如 `no-unused-vars`）。

新增两个回归测试（`packages/eslint-config/test/typescript.test.ts`）：验证 `no-var`、`array-callback-return` 现在确实在 `.ts` 文件里报。
