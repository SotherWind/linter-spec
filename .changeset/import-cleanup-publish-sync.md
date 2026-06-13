---
'@linter-spec/cli': patch
'@linter-spec/eslint-config': patch
'@linter-spec/eslint-plugin': patch
---

将 `e8292d5 chore: apply import-x/order autofix and switch prettier to named imports` 中的代码整洁化同步到 npm：

- `@linter-spec/cli`: `packages/cli/src/lints/prettier/do-prettier.ts` 由 `import prettier from 'prettier'` 改为 `import { format, getFileInfo, resolveConfig } from 'prettier'` —— prettier 3 是纯 ESM、没有真正的默认导出，原写法仅靠 Node 的 CJS interop 才能跑通，且让 `import-x/default` 误报；新写法编译出的 JS 略有不同但调用同一份 prettier API。
- `@linter-spec/eslint-config` / `@linter-spec/eslint-plugin`: `eslint . --fix` 在 `.ts` 源码各 import 分组间插入空行，tsc 编译产物随之改变（但不影响任何规则行为）。

无任何用户可观察的行为变化，纯粹是让 npm 上发布的 JS 与 GitHub 上的 TS 源码保持同步。
