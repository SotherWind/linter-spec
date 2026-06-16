---
'@linter-spec/cli': patch
'@linter-spec/eslint-config': patch
---

`linter-spec init` 修两处用户可见的问题，外加 TypeScript 6 适配：

- **安装 husky 作为 devDependency**：`setupHusky` 一直会向 `package.json` 写入 `"prepare": "husky"`，但 `installProjectDeps` 从未把 `husky` 加进要安装的包列表。init 阶段不会报错（prepare 是写完才生效，当时的 `pnpm add` 已经跑过了），但下一次 `pnpm install` / `npm install` 触发 prepare 脚本时会失败 —— `'husky' 不是内部命令`。现在 `husky@^9.0.0` 进入了 init 的 devDeps 安装集合。
- **生成的 `.vscode/settings.json` 将 `source.fixAll.eslint` 由 `'explicit'` 改为 `'never'`**：避免保存时静默触发 ESLint 自动修复（用户报告希望显式手动 fix，stylelint / markdownlint 仍保留 `'explicit'`）。
- **TypeScript 6 支持**：`@linter-spec/cli` 的 `PINNED_VERSIONS.typescript` 由 `^5.6.2` 升级到 `^6.0.2`，新 init 出的项目默认装 TS 6.0.x（typescript-eslint 8.61 的 peer 范围 `>=4.8.4 <6.1.0` 完全兼容）。同步把 `@linter-spec/eslint-config` 的 `typescript` peerDependency 升到 `^6.0.0`。
- **CLI 所有用户可见文案改为英文**：`messages.ts`、`print-report.ts`、`constants.ts` 里命令描述、option 帮助、init 流程的 step 提示、conflict 解析提示、update 提示、扫描报告 summary、项目类型选项等全部英文化。仅 `@linter-spec/cli`（runtime 字符串）受影响；presets 包不受影响。
