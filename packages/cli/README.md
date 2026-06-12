# @linter-spec/cli

`linter-spec` 前端编码规范的一站式 Lint 工具链。将 ESLint 9、Stylelint 17、markdownlint、Prettier 3 和 commitlint 19 封装在单个 CLI（以及一个轻量 Node API）之下，让项目用一条命令即可接入、扫描、修复并对提交做卡点。

## 安装

```sh
pnpm add -D @linter-spec/cli
```

各共享配置（`@linter-spec/eslint-config`、`@linter-spec/stylelint-config`、`@linter-spec/markdownlint-config`、`@linter-spec/commitlint-config`）以依赖形式一并安装——装好 CLI 即可扫描项目。

> 需要 Node.js `^20.19.0 || >=22.12.0`。

## 快速开始

```sh
# 交互式接入：写入配置、VS Code 设置与 git 钩子
npx linter-spec init

# 扫描项目中的规范问题
npx linter-spec scan

# 自动修复可修复的问题（先跑 Prettier，再跑各 Linter）
npx linter-spec fix
```

`init` 会向 `package.json` 添加 `linter-spec-scan` / `linter-spec-fix` 脚本，并安装 husky 钩子（pre-commit 上的 `commit-file-scan`、commit-msg 上的 `commit-msg-scan`）。

## 命令

| 命令 | 说明 |
| --- | --- |
| `init` | 初始化项目：选择项目类型、写入 Lint 配置、合并 `.vscode/settings.json`、配置 husky 钩子。`--vscode` 仅写入 VS Code 设置。 |
| `scan` | 运行已启用的 Linter 并打印报告。有错误时以非零状态码退出。 |
| `fix` | 自动修复：Prettier 先格式化，随后 ESLint / Stylelint / markdownlint 应用各自的修复。 |
| `commit-file-scan` | 扫描已暂存待提交的文件（供 pre-commit 钩子使用）。 |
| `commit-msg-scan [msgPath]` | 通过 commitlint 校验提交信息（供 commit-msg 钩子使用）。 |
| `update` | 将 `@linter-spec/cli` 升级到最新版本。 |

### 常用选项

| 选项 | 适用命令 | 说明 |
| --- | --- | --- |
| `-i, --include <dirpath>` | `scan`、`fix` | 要扫描的目录（默认为项目根目录）。 |
| `-q, --quiet` | `scan` | 仅报告错误，忽略警告。 |
| `-o, --output-report` | `scan` | 写出一份 `linter-spec-report.json` 报告文件。 |
| `--no-ignore` | `scan`、`fix` | 忽略 ESLint 的 ignore 文件 / 规则。 |
| `-s, --strict` | `commit-file-scan` | 警告也视为失败，而不仅仅是错误。 |
| `--vscode` | `init` | 仅写入 `.vscode/settings.json`。 |

## Node API

```js
import { init, scan } from '@linter-spec/cli';

// 编程式 init（绝不会自我升级 CLI）
await init({
  cwd: process.cwd(),
  eslintType: 'typescript/react', // 取值见下文「项目类型」
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true,
});

// 编程式 scan —— 返回结构化报告
const report = await scan({ cwd: process.cwd(), include: process.cwd(), fix: false });
console.log(report.errorCount, report.warningCount);
```

`scan` 解析为一个 `ScanReport`：

```ts
interface ScanReport {
  results: ScanResult[]; // 每个文件的消息与计数
  errorCount: number;
  warningCount: number;
  runErrors: Error[]; // 某个 Linter 崩溃不会中断其余 Linter
}
```

### 项目类型

`init` 的 `eslintType`（以及交互式选项）与 `@linter-spec/eslint-config` 的入口一一对应：

| 取值 | 项目 |
| --- | --- |
| `index` | 纯 JavaScript |
| `typescript` | TypeScript |
| `react` / `typescript/react` | React（JS / TS） |
| `vue` / `typescript/vue` | Vue（JS / TS） |
| `node` / `typescript/node` | Node.js（JS / TS） |
| `es5` | 传统 ES5 |

## 配置文件

在项目根目录放置 `linter-spec.config.{mjs,cjs,js}` 即可开关各 Linter 或透传选项。传给 Node API 的内联配置优先级更高。

```js
// linter-spec.config.mjs
export default {
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true,
  // eslintOptions / stylelintOptions / markdownlintOptions 会被透传
};
```

## 仓库

- 源码：<https://github.com/SotherWind/linter-spec>
- 许可证：MIT
- 作者：SotherWind
