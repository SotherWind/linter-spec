
# linter-spec

`linter-spec` 是[linter-spec 前端编码规范工程化](https://sotherwind.github.io/linter-spec/)的配套 Lint 工具，可以为项目一键接入规范、一键扫描和修复规范问题，保障项目的编码规范和代码质量。

## 背景

我们引入了多个业界流行的 Linter，并根据规范内容定制了规则包，它们包括：

| 规范                                                              | Lint 工具                                                  | npm 包                                                                                 |
| ----------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| JavaScript 编码规范 <br/> TypeScript 编码规范 <br/> Node 编码规范 | [ESLint](https://eslint.org/)                              | [@linter-spec/eslint-config](https://www.npmjs.com/package/@linter-spec/eslint-config)             |
| CSS 编码规范                                                      | [stylelint](https://stylelint.io/)                         | [@linter-spec/stylelint-config](https://www.npmjs.com/package/@linter-spec/stylelint-config)       |
| Git 规范                                                          | [commitlint](https://commitlint.js.org/#/)                 | [@linter-spec/commitlint-config](https://www.npmjs.com/package/@linter-spec/commitlint-config)     |
| 文档规范                                                          | [markdownlint](https://github.com/DavidAnson/markdownlint) | [@linter-spec/markdownlint-config](https://www.npmjs.com/package/@linter-spec/markdownlint-config) |

可以看到这些 `Linter` 和规则包众多且零散，全部安装它们会给项目增加十几个依赖，接入和升级成本都比较高。

`linter-spec` 收敛屏蔽了这些依赖和配置细节，提供简单的 CLI 和 Node.js API，让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡口，降低项目接入规范的成本。

## CLI 使用

### 安装

在终端执行：

```bash
npm install -g @linter-spec/cli
```

> 包名是 `@linter-spec/cli`，安装后提供的命令名为 `linter-spec`。安装完成后，可执行 `linter-spec -h` 以验证安装成功。

### 使用

#### `linter-spec init`：一键接入

在项目根目录执行 `linter-spec init`，即可一键接入规范，为项目安装规范 `Lint` 所需的依赖和配置。

具体会做以下事情：

- 安装各种依赖：包括 `Linter` 依赖，如 [ESLint](https://eslint.org/)、[stylelint](https://stylelint.io/)、[commitlint](https://commitlint.js.org/#/)、[markdownlint](https://github.com/DavidAnson/markdownlint) 等；配置依赖，如 [@linter-spec/eslint-config](https://www.npmjs.com/package/@linter-spec/eslint-config)、[@linter-spec/stylelint-config](https://www.npmjs.com/package/@linter-spec/stylelint-config)、[@linter-spec/commitlint-config](https://www.npmjs.com/package/@linter-spec/commitlint-config)、[@linter-spec/markdownlint-config](https://www.npmjs.com/package/@linter-spec/markdownlint-config) 等
- 写入各种配置文件（均为 ESLint 9 flat config / ESM 形式），包括：
  - `eslint.config.mjs`：ESLint 扁平配置（导入 `@linter-spec/eslint-config`，忽略项内联其中——ESLint 9 已不再使用 `.eslintignore`）
  - `stylelint.config.mjs`、`.stylelintignore`：stylelint 配置（继承 `@linter-spec/stylelint-config`）及黑名单文件
  - `commitlint.config.mjs`：commitlint 配置（继承 `@linter-spec/commitlint-config`）
  - `.markdownlint.cjs`、`.markdownlintignore`：markdownlint 规则集（`module.exports = require('@linter-spec/markdownlint-config').default`——共享配置为 ESM-only，故用 `.cjs` 透传；选 `.markdownlint.cjs` 而非 `-cli2` 后缀，是因为这是 VS Code markdownlint 扩展读取的 ruleset 槽位）及黑名单文件
  - `prettier.config.mjs`：符合规范的 [Prettier 配置](https://prettier.io/docs/en/configuration.html)
  - `.editorconfig`：符合规范的 [editorconfig](https://editorconfig.org/)
  - `.vscode/extensions.json`：规范相关的 [VSCode 插件推荐](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions)，包括 `ESLint`、`stylelint`、`markdownlint`、`prettier` 等
  - `.vscode/settings.json`：规范相关的 [VSCode 设置](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations)，设置 `ESLint`/`stylelint` 插件的 `validate` 及**保存时自动运行 fix**；若选择使用 `Prettier`，会将 `prettier-vscode` 设为各前端语言的 defaultFormatter，并配置**保存时自动格式化**
  - `linter-spec.config.mjs`：linter-spec 自身的配置，如启用的功能等
- 配置 git commit 卡口：使用 [husky](https://www.npmjs.com/package/husky) 设置代码提交卡口，在 git commit 时会运行 `linter-spec commit-file-scan` 和 `linter-spec commit-msg-scan` 分别对提交文件和提交信息进行规范检查。`linter-spec commit-file-scan` 默认仅对 error 问题卡口，如果你想对 warn 问题也卡口，可以增加 `--strict` 参数以开启严格模式

> 注 1：如果项目已经配置过 ESLint、stylelint 等 Linter，执行 `linter-spec init` 将会提示存在冲突的依赖和配置，并在得到确认后进行覆盖：
>
> 注 2：如果项目的 .vscode/ 目录被 .gitignore 忽略，可以在拉取项目后单独执行 `linter-spec init --vscode` 命令写入 `.vscode/extensions.json` 和 `.vscode/settings.json` 配置文件

#### `linter-spec scan`：一键扫描

在项目的根目录执行命令，即可扫描项目的规范问题：

支持下列参数：

- `-q` `--quiet` 仅报告 error 级别的问题
- `-o` `--output-report` 输出扫描出的规范问题日志
- `-i` `--include <dirpath>` 指定要进行规范扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则

> 注 1：事实上，你可以在任意目录执行 `linter-spec scan` `linter-spec` 会根据文件类型、JSON 等特征嗅探项目类型。但我们还是推荐在执行过 `linter-spec init` 的项目根目录执行 `linter-spec scan`，以得到最准确的扫描结果。
>
> 注 2: `linter-spec` 会根据项目内有无 eslint 和 stylelint 配置文件判断使用项目的配置文件还是 `linter-spec` 默认配置进行扫描。若使用项目的，在未安装依赖时会帮其安装（执行 npm i）。若使用项目配置扫描失败，则使用默认配置扫描

#### `linter-spec fix`：一键修复

在项目的根目录执行命令，即可修复部分规范问题：

支持下列参数：

- `-i` `--include <dirpath>` 指定要进行修复扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则

注意请 review 下修复前后的代码，以免工具误修的情况。

#### `linter-spec commit-file-scan` 提交文件扫描

在 git commit 时对提交文件进行规范问题扫描，需配合 git 的 pre-commit 钩子使用。

支持下列参数：

- `-s` `--strict` 严格模式，对 warn 和 error 问题都卡口，默认仅对 error 问题卡口

#### `linter-spec commit-msg-scan` 提交信息扫描

git commit 时对 commit message 的格式进行扫描（使用 commitlint），需配合 [husky](https://www.npmjs.com/package/husky) 的 commit-msg 钩子使用。

## Node.js API 使用

### 安装

```bash
npm install @linter-spec/cli
```

### API

#### init：初始化

`init(config)`：将项目一键接入规范，效果等同于 `linter-spec init`。从 `@linter-spec/cli` 具名导入：

示例：

```js
import { init } from '@linter-spec/cli';

await init({
  cwd: process.cwd(),
  eslintType: 'react',
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true,
  disableNpmInstall: false,
});
```

同样地，`scan(options)` 对应 `linter-spec scan`：

```js
import { scan } from '@linter-spec/cli';

const report = await scan({ cwd: process.cwd(), include: process.cwd(), fix: false });
console.log(report.errorCount, report.warningCount);
```

config 参数如下：

| 参数               | 类型       | 默认值 | 说明                                                                                                                |
| ------------------ | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| cwd                | string     | -      | 项目绝对路径                                                                                                        |
| eslintType         | ESLintType | -      | 语言和框架类型，如果不配置，等同于 linter-spec init，控制台会出现选择器，如果配置，控制台就不会出现选择器        |
| enableESLint       | boolean    | true   | 是否启用 ESLint，如果不配置默认值为 true，即默认启用 ESLint                                                         |
| enableStylelint    | boolean    | -      | 是否启用 stylelint，如果不配置，等同于 linter-spec init，控制台会出现选择器，如果配置，控制台就不会出现选择器    |
| enableMarkdownlint | boolean    | -      | 是否启用 markdownlint，如果不配置，等同于 linter-spec init，控制台会出现选择器，如果配置，控制台就不会出现选择器 |
| enablePrettier     | boolean    | -      | 是否启用 Prettier                                                                                                   |
| disableNpmInstall  | boolean    | false  | 是否禁用自动在初始化完成后安装依赖                                                                                  |

##### ESLintType

取值与 `@linter-spec/eslint-config` 的入口子路径一一对应（基础类型为 `index`，对应包根导出）：

- `index`: 未使用 React、Vue、Node.js 的项目（JavaScript）
- `typescript`: 未使用 React、Vue、Node.js 的项目（TypeScript）
- `react`: React 项目（JavaScript）
- `typescript/react`: React 项目（TypeScript）
- `vue`: Vue 项目（JavaScript）
- `typescript/vue`: Vue 项目（TypeScript）
- `node`: Node.js 项目（JavaScript）
- `typescript/node`: Node.js 项目（TypeScript）
- `es5`: 使用 ES5 及之前版本 JavaScript 的老项目

## 配置

`linter-spec` 基于一份配置进行扫描（但你也可以零配置使用），支持的配置参数有：

| 参数                | 类型                    | 默认值 | 说明                                                                                           |
| ------------------- | ----------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| enableESLint        | boolean                 | true   | 是否启用 ESLint                                                                                |
| enableStylelint     | boolean                 | true   | 是否启用 stylelint                                                                             |
| enableMarkdownlint  | boolean                 | true   | 是否启用 markdownlint                                                                          |
| enablePrettier      | boolean                 | -      | 是否启用 Prettier                                                                              |
| eslintOptions       | ESLint.Options          | -      | ESLint 配置项，若未设置将使用执行目录下或内置的默认 eslintrc 和 eslintignore 进行扫描          |
| stylelintOptions    | stylelint.LinterOptions | -      | stylelint 配置项，若未设置将使用执行目录下或内置的默认 stylelintrc 和 stylelintignore 进行扫描 |
| markdownlintOptions | markdownlint.Options    | -      | markdownlint 配置项，若未设置将使用执行目录下或内置的默认 markdownlint 配置文件进行扫描        |

`linter-spec` 会读取执行目录下的 `linter-spec.config.mjs` 作为配置文件。`linter-spec init` 会在执行目录下新增如下的 `linter-spec.config.mjs` 文件：

```js
// linter-spec.config.mjs
export default {
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true,
};
```

## 常见问题

### TypeScript 项目扫描性能问题

TypeScript 的类型感知 lint（type-aware linting）开销较大，TS 项目的 commit 卡口和 `linter-spec scan` 可能较慢。可从两方面缓解：

- 用 `-i, --include <dirpath>` 把扫描范围收敛到实际源码目录，避免扫描整个仓库；
- 在自己的 `eslint.config.mjs` 中按 `files` 缩小类型感知规则的作用范围，或仅对需要类型信息的目录开启 `languageOptions.parserOptions.project`：

```js
// eslint.config.mjs
import ts from '@linter-spec/eslint-config/typescript';

export default [
  ...ts,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { project: ['./tsconfig.json'] },
    },
  },
];
```
