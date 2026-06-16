# @linter-spec/eslint-plugin

除了本包，你需要同时安装 [ESLint](https://eslint.org/)。本插件面向 **ESLint 9 扁平配置（flat config）**。

```shell
npm install @linter-spec/eslint-plugin eslint --save-dev
```

## 使用

在 `eslint.config.mjs` 中使用（ESM、扁平配置）。

### 引入推荐配置（presets）

```js
// eslint.config.mjs
import linterSpec from '@linter-spec/eslint-plugin';

export default [...linterSpec.configs.recommended];
```

`recommended` 默认开启 `@linter-spec/no-http-url`（warn）与 `@linter-spec/no-secret-info`（error）。

### 按需开启单条规则

插件命名空间为 `@linter-spec`，规则全名形如 `@linter-spec/<规则名>`：

```js
// eslint.config.mjs
import linterSpec from '@linter-spec/eslint-plugin';

export default [
  {
    plugins: { '@linter-spec': linterSpec },
    rules: {
      '@linter-spec/no-http-url': 'warn',
      '@linter-spec/no-secret-info': 'error',
      '@linter-spec/no-broad-semantic-versioning': 'error',
      '@linter-spec/no-js-in-ts-project': 'warn',
    },
  },
];
```

## 支持的规则

### `no-broad-semantic-versioning`

不要在 `package.json` 中使用太过宽泛的版本指定方式，包括 `*`、`x` 和 `> x` 。

#### 规则内容

参照 [npm 语义化版本说明](https://docs.npmjs.com/about-semantic-versioning)。

使用 `*`、 `x` 和 `> x` 指定版本会被警告。

### `no-http-url`

推荐将 HTTP 链接换为 HTTPS 链接。

#### 规则内容

**错误代码**示例:

```js
var test = 'http://example.com';
var jsx = <img src="http://example.com" />;
```

#### 何时不适用

如果你的网站只支持 HTTP 时。

### `no-js-in-ts-project`

不推荐在项目中同时存在 `JS` 和 `TS` 文件。

#### 规则内容

**错误示例**，TS 项目中包含 JS 文件:

```Bash
.
├── index.ts
├── home.js
└── tsconfig.json
```

**正确示例**:

```Bash
.
├── index.ts
├── home.ts
└── tsconfig.json
```

#### 规则选项

默认白名单包含 `commitlint.config.js`、`eslint.config.js`、`prettier.config.js`、`stylelint.config.js`、`.eslintrc.js`、`.prettierrc.js`、`.stylelintrc.js`，命中这些文件不会报错。可通过 `whiteList` 选项自定义（默认与内置白名单合并；设 `autoMerge: false` 则完全用自定义列表覆盖）。

### `no-secret-info`

不在代码中直接通过纯文本值设置 `password` `token` 和 `secret` 信息。

#### 规则内容

在包含 `password`、`token` 和 `secret` 名称的 key 中禁止使用纯文本值。

**错误**代码示例:

```js
var accessKeySecret = 'xxxx';

var client = {
  accessKeyToken: 'xxxx',
};
```

**正确**代码示例:

```js
var accessKeySecret = process.env.ACCESS_KEY_SECRET;

var client = {
  accessKeyToken: process.env.ACCESS_KEY_SECRET,
};
```
