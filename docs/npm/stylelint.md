
# @linter-spec/stylelint-config

:::tip
linter-spec CSS 规范
:::

支持配套的 [stylelint 可共享配置](https://stylelint.io/user-guide/configure)。

## 安装

只需安装 [stylelint](https://www.npmjs.com/package/stylelint) 这一个 peer 依赖即可。本配置依赖的 `stylelint-config-standard`、`stylelint-config-recommended-scss`、`stylelint-scss`、`@stylistic/stylelint-plugin`、`postcss-less` 等都已作为常规依赖随包安装，无需单独安装。

```bash
npm install @linter-spec/stylelint-config stylelint --save-dev
```

## 使用

在 `stylelint.config.mjs` 中继承本包：

```js
// stylelint.config.mjs
export default {
  extends: ['@linter-spec/stylelint-config'],
};
```

> 也可使用 `.stylelintrc.json` 等格式：`{ "extends": ["@linter-spec/stylelint-config"] }`。
