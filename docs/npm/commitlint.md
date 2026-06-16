# @linter-spec/commitlint-config

:::tip
linter-spec Git 规范
:::

支持配套的 [commitlint 配置](https://commitlint.js.org/#/concepts-shareable-config)，用于对 `git commit message` 进行校验。

## 安装

使用时，需要安装 [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli)：

```bash
npm install @linter-spec/commitlint-config @commitlint/cli --save-dev
```

## 使用

在 `commitlint.config.cjs` 中集成本包：

```javascript
module.exports = {
  extends: ['@linter-spec/commitlint-config'],
};
```

> 根目录为 `type: "module"` 时用 `.cjs` 最省心；也可用 `commitlint.config.mjs` 配合 `export default { extends: ['@linter-spec/commitlint-config'] }`。

## 设置 git hook

可通过 [husky](https://www.npmjs.com/package/husky)（v9）设置在 `git commit` 时触发 `commitlint`。

首先安装并初始化 husky：

```bash
npm install husky --save-dev
npx husky init
```

然后写入 `commit-msg` 钩子（husky v9 已移除 `husky add` 子命令，改为直接写文件）：

```bash
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
```

更多信息可参考 [commitlint 文档](https://commitlint.js.org/guides/local-setup)。
