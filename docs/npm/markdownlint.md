
# @linter-spec/markdownlint-config

:::tip
linter-spec 文档 规范
:::

支持配套的 [markdownlint 可共享配置](https://www.npmjs.com/package/markdownlint#optionsconfig)。

## 安装

安装本包、[markdownlint](https://www.npmjs.com/package/markdownlint) 以及运行器 [markdownlint-cli2](https://www.npmjs.com/package/markdownlint-cli2)：

```bash
npm install @linter-spec/markdownlint-config markdownlint markdownlint-cli2 --save-dev
```

## 使用

本共享配置是 **ESM-only** 包，markdownlint 的 `extends` 只能按路径解析 JSON/YAML、无法加载 JS 包，因此**不要**用 `{ "extends": "@linter-spec/markdownlint-config" }`。请在 `.markdownlint-cli2.cjs` 中 `require` 它的默认导出，作为 cli2 的 `config` 字段传入；同时在 `ignores` 里写忽略路径：

```js
// .markdownlint-cli2.cjs
const config = require('@linter-spec/markdownlint-config').default;

module.exports = {
  config,
  ignores: ['**/node_modules/**', '**/dist/**', 'CHANGELOG.md'],
};
```

> 关于文件名：markdownlint-cli2 引擎同时是 VS Code markdownlint 扩展的内核，按官方[配置优先级](https://github.com/DavidAnson/markdownlint-cli2#configuration)，`.markdownlint-cli2.{cjs,jsonc,yaml}` 高于 `.markdownlint.{cjs,json,...}`。命令行 cli2 和 VS Code 扩展都会读它，且都支持 `{ config, ignores }` 完整选项形状。`.markdownlintignore` **只有旧版** `markdownlint-cli` 读取，cli2 与 VS Code 扩展均不识别；不要再用它。

然后用 markdownlint-cli2 运行：

```bash
npx markdownlint-cli2 "**/*.md"
```
