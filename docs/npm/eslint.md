# @linter-spec/eslint-config

:::tip
linter-spec JavaScript / TypeScript / Node 规范
:::

基于 **ESLint 9 扁平配置（flat config）** 的可共享预设，覆盖 `JavaScript` / `TypeScript` × `React` / `Vue` / `Node.js`，并提供把风格规则降级为 `warn` 的 `essential/*` 变体。

## 安装

```shell
pnpm add -D @linter-spec/eslint-config eslint
```

基础插件（`@stylistic/eslint-plugin`、`eslint-plugin-import-x`、`@eslint/js`、`globals`）作为常规依赖随包安装，无需手动安装。框架相关插件是**可选 peerDependencies**，按你用到的入口安装（见下文「插件矩阵」）。

## 基础用法（flat config）

在项目根创建 `eslint.config.mjs`，导入对应入口并展开为配置数组：

```js
// eslint.config.mjs
import config from '@linter-spec/eslint-config';

export default [
  ...config,
  // 按需覆盖：
  { rules: { 'no-console': 'off' } },
  { ignores: ['dist/**'] },
];
```

> 共享配置导出的本身就是「配置数组」，用 `...` 展开即可，**不要**再用 legacy 的 `{ "extends": "..." }` 写法——它在 flat config 下无效。

## 入口一览

| 入口 | 适用场景 |
| --- | --- |
| `@linter-spec/eslint-config` | 原生 ES2022 JavaScript（浏览器 + Node 全局） |
| `@linter-spec/eslint-config/es5` | 旧版 ES5 代码库 |
| `@linter-spec/eslint-config/react` | React（已内置 jsx-a11y） |
| `@linter-spec/eslint-config/vue` | Vue 3 |
| `@linter-spec/eslint-config/node` | Node.js（eslint-plugin-n） |
| `@linter-spec/eslint-config/jsx-a11y` | 仅 JSX 无障碍（独立使用） |
| `@linter-spec/eslint-config/typescript` | TypeScript |
| `@linter-spec/eslint-config/typescript/react` | TypeScript + React |
| `@linter-spec/eslint-config/typescript/vue` | TypeScript + Vue 3 |
| `@linter-spec/eslint-config/typescript/node` | TypeScript + Node |
| `@linter-spec/eslint-config/essential[/…]` | 对应入口的 essential 变体（风格规则降级为 warn） |

essential 变体共 7 个，与上方一一对应：`essential`、`essential/es5`、`essential/react`、`essential/vue`、`essential/typescript`、`essential/typescript/react`、`essential/typescript/vue`。

## 插件矩阵

| 用到的入口 | 需额外安装的 peer 插件 |
| --- | --- |
| `react` / `typescript/react` / `essential/react` / `essential/typescript/react` | `eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y` |
| `jsx-a11y`（独立） | `eslint-plugin-jsx-a11y` |
| `vue` / `typescript/vue` / `essential/vue` / `essential/typescript/vue` | `eslint-plugin-vue vue-eslint-parser` |
| `node` / `typescript/node` | `eslint-plugin-n` |
| 任意 `typescript` 或 `typescript/*` 入口 | `typescript typescript-eslint` |

导入某入口却没装对应 peer 插件时，ESLint 会抛出明确的 `Cannot find module 'eslint-plugin-…'`，直接告诉你缺哪个。

## 各类型配置示例

### 原生 JavaScript

```js
// eslint.config.mjs
import config from '@linter-spec/eslint-config';
export default [...config];
```

### JavaScript + React

```shell
pnpm add -D @linter-spec/eslint-config eslint \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

```js
import react from '@linter-spec/eslint-config/react';
export default [...react];
```

jsx-a11y 已折叠进 `react` 预设，无需再叠加 `/jsx-a11y`（该入口仅在你想单独使用无障碍规则时才需要）。

### JavaScript + Vue 3

```shell
pnpm add -D @linter-spec/eslint-config eslint eslint-plugin-vue vue-eslint-parser
```

```js
import vue from '@linter-spec/eslint-config/vue';
export default [...vue];
```

### Node.js

```shell
pnpm add -D @linter-spec/eslint-config eslint eslint-plugin-n
```

```js
import node from '@linter-spec/eslint-config/node';
export default [...node];
```

### TypeScript

```shell
pnpm add -D @linter-spec/eslint-config eslint typescript typescript-eslint
```

```js
import ts from '@linter-spec/eslint-config/typescript';
export default [...ts];
```

> 需保证项目内已安装 `typescript`。若 `tsconfig.json` 不在默认位置，可在自己的 flat config 末尾追加一段覆盖 `languageOptions.parserOptions.project`。

### TypeScript + React

```shell
pnpm add -D @linter-spec/eslint-config eslint typescript typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

```js
import tsReact from '@linter-spec/eslint-config/typescript/react';
export default [...tsReact];
```

### TypeScript + Vue 3

```shell
pnpm add -D @linter-spec/eslint-config eslint typescript typescript-eslint \
  eslint-plugin-vue vue-eslint-parser
```

```js
import tsVue from '@linter-spec/eslint-config/typescript/vue';
export default [...tsVue];
```

### TypeScript + Node

```shell
pnpm add -D @linter-spec/eslint-config eslint typescript typescript-eslint eslint-plugin-n
```

```js
import tsNode from '@linter-spec/eslint-config/typescript/node';
export default [...tsNode];
```

## 将风格问题降级（essential）

默认配置把大量风格相关规则设为 `error` 以引起重视。如果你用 ESLint error 做流程卡点、不希望风格问题阻断流程，可改用 `essential` 变体：它把所有风格问题降为 `warn`，仅把必要问题报为 `error`。用法是在入口后加 `/essential`：

```js
// 例如 JS React → essential/react；TS Vue → essential/typescript/vue
import react from '@linter-spec/eslint-config/essential/react';
export default [...react];
```

## 配合 Prettier 使用

linter-spec 把 Prettier 作为**独立步骤**运行（独立的 `prettier.config.mjs`），并未在 ESLint 侧集成 `eslint-plugin-prettier`。如果你单独使用本 ESLint 配置又担心风格规则与 Prettier 冲突，二选一即可：

- 使用 `essential/*` 变体（风格规则均为 `warn`，不阻断流程），或
- 自行安装 `eslint-config-prettier` 并在 flat config 末尾追加，以关闭与 Prettier 冲突的风格规则。

## 了解更多

- 不熟悉 ESLint：官网 [Getting Started](https://eslint.org/docs/latest/use/getting-started)
- 扁平配置说明：[Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)
- 编辑器集成：[Integrations](https://eslint.org/docs/latest/use/integrations)
