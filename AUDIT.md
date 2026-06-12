# linter-spec 优化清单

> 日期：2026-06-09 · 范围：全仓 6 个 package + 根配置 + docs + CI
>
> 分级：**H** = 用户流程已坏 / 发布后会出锅；**M** = 工程契约不一致 / 不会立刻坏但会绊倒消费方；**L** = 代码味道 / 重构机会 / 死代码；**Doc** = 文档与产物漂移

---

## H — 已坏 / 发布即出锅

### H1. `eslint-config` 把所有运行时插件放在 `devDependencies`

[packages/eslint-config/package.JSON](packages/eslint-config/package.json) 的 `devDependencies` 里包含 ESLint 加载时需要的 **运行时** 插件：

```text
@stylistic/eslint-plugin, eslint-plugin-import-x, eslint-plugin-jsx-a11y,
eslint-plugin-n, eslint-plugin-react, eslint-plugin-react-hooks,
eslint-plugin-vue, typescript-eslint, vue-eslint-parser, globals, @eslint/js
```

`dependencies` 字段为空（仅有 `peerDependencies: { eslint: ^9 }`）。

**为什么是 bug**：`npm/pnpm i @linter-spec/eslint-config` 不会装 devDeps。消费方 ESLint 启动时立即抛 `Cannot find module 'eslint-plugin-react'`。本仓 monorepo 内 `pnpm install` 会装 devDeps 所以**本地测试看起来是绿的**，但发布到 npm 后必坏。

**修法（按"用户按需安装"取向）**：用 **可选 peerDependencies**（airbnb / standard / antfu 的通行做法），而不是粗放放进 `dependencies`——后者会让只用 `node` preset 的用户也被迫装一整套 React/Vue/TS 插件。分两类：

- **`dependencies`（每个 entry 都用到）**：`@eslint/js`、`globals`、`@stylistic/eslint-plugin`、`eslint-plugin-import-x` —— 这 4 个被 `base.ts` 引用，所有 17 个 entry 都会传递依赖
- **`peerDependencies` + `peerDependenciesMeta[name].optional: true`（按 entry 选装）**：
  - `typescript-eslint`、`typescript` —— 只 TS entries 需要
  - `eslint-plugin-react`、`eslint-plugin-react-hooks` —— 只 React entries
  - `eslint-plugin-jsx-a11y` —— 只 `jsx-a11y` / React entries
  - `eslint-plugin-vue`、`vue-eslint-parser` —— 只 Vue entries
  - `eslint-plugin-n` —— 只 Node entries

`peerDependenciesMeta` 设 `optional: true` 后，npm/pnpm 会 **WARN 但不 ERROR**；用户跑 ESLint 时若引用了对应 entry 但没装插件，ESLint 自身会抛清晰的 `Cannot find module` 指明缺哪个插件。配套：README 里建插件矩阵表，写明每个 entry 需要哪些 peer。

devDeps 只留：`eslint`、`rimraf`、`vitest`、`@types/eslint`——这些只是本仓库 build/test 用。

### H2. `linter-spec init` 生成的 `.markdownlint.json` 无法被 markdownlint 加载

[packages/cli/src/config/_markdownlint.JSON.ejs](packages/cli/src/config/_markdownlint.json.ejs) 生成：

```json
{ "extends": "@linter-spec/markdownlint-config" }
```

但 markdownlint 核心的 `extends` 只能解析 **JSON/YAML** 文件路径——`@linter-spec/markdownlint-config` 是 ESM JS 包，markdownlint 拿到 dist 入口 `.js` 文件后直接抛 `Unable to parse ... Unexpected token '/', "/**\n * Sha"...`。已实跑复现：

```sh
node packages/cli/dist/cli.js init
# 生成 .markdownlint.json 后
npx markdownlint **/*.md  # → Error: Unable to parse .../@linter-spec/markdownlint-config/dist/index.js
```

讽刺的是这个限制**我们自己的根 `.markdownlint-cli2.cjs` 顶部注释里就明确写过**，但 init 模板还是踩了。

**修法**：模板改成 JS 形态，参照根配置 `const config = require('@linter-spec/markdownlint-config').default; module.exports = { config, ignores: [...] }`——这条路在 `require(esm)` 稳定后已经能跑。配套删 `_markdownlintignore.ejs`（ignores 内联进 cli2 config 即可）。

**关于文件名的选择**（澄清一个常见误解）：

markdownlint 工具链识别的配置文件名**没有 `<tool>.config.<ext>` 这一族**。实测 markdownlint-cli2 v0.14 源码（[markdownlint-cli2.js:172-190](node_modules/.pnpm/markdownlint-cli2@0.14.0/node_modules/markdownlint-cli2/markdownlint-cli2.js#L172)）只接受这两类：

- `.markdownlint-cli2.{jsonc,yaml,cjs,mjs}` —— **cli2 专属**
- `.markdownlint.{jsonc,json,yaml,yml,cjs,mjs}` —— cli2 + 编辑器扩展（VS Code DavidAnson 那个）都读

`markdownlint.config.js`（无前导点 + 用 `.config.` 中缀，对齐 `prettier.config.js` / `eslint.config.js` / `stylelint.config.js` 的约定）**不被任何 markdownlint 工具识别**——这是 markdownlint 生态与其它 Lint 工具的命名分歧。

所以候选只有 `.markdownlint-cli2.cjs` 或 `.markdownlint.cjs`：

| 文件名 | 谁会读 | 适用场景 |
| --- | --- | --- |
| `.markdownlint.cjs` | cli2 + 编辑器扩展 + 任何走 markdownlint-cli2 协议的工具 | **更通用**，推荐 |
| `.markdownlint-cli2.cjs` | 只有 cli2 | 仅当显式想区分 "这是 cli2 专属配置" 时用 |

本仓库根目录用的是后者（`.markdownlint-cli2.cjs`），原因是当初想强调"这是 cli2 调用形态"。对 init 模板而言，用户项目的目标读者不只是 cli2 还有他们的 IDE 扩展，**建议改用 `.markdownlint.cjs`**——同时根目录的也可以一并改。

同时 cli 的 `dependencies` 加 `markdownlint-cli2`（或仅 peer）。

### H3. `cli` `package.json` 的 `files` 字段漏了 `README.md`

[packages/cli/package.JSON](packages/cli/package.json) `"files": ["dist"]`，而其它 5 个 config 包都是 `["dist", "README.md"]`。Phase 6 写的 [packages/cli/README.md](packages/cli/README.md) 不会进入发布的 tarball——npm 页面只显示 "no README"。

**修法**：改成 `["dist", "README.md"]`。

---

## M — 工程契约不一致

### M1. `engines.node` 三套不同标准

Phase 5.5 把 3 个 config 包抬到 `^20.19.0 || >=22.12.0`（require(esm) 稳定 + Node 18 EOL），但只改了它直接动到的包：

| 包 | 当前 | 应统一为 |
| --- | --- | --- |
| commitlint-config / markdownlint-config / stylelint-config | `^20.19.0 \|\| >=22.12.0` ✓ | 不变 |
| eslint-config | `>=18.18` | `^20.19.0 \|\| >=22.12.0` |
| eslint-plugin | `>=18.18` | 同上 |
| cli | `>=20.17` | 同上 |

CLI 还更宽（`>=20.17` 比 Phase 5.5 的 20.19 低）。eslint-config / eslint-plugin 的 Node 18 下限是 ESLint 9 官方下限的复写，但本项目工程策略已显式排除 Node 18。

**修法**：6 个 `package.json` 的 `engines.node` 全部对齐 `^20.19.0 || >=22.12.0`。根 package.JSON 已经是这个值。

### M2. `exports` 条件混搭：`"import"` vs `"default"`

| 包 | exports 条件 |
| --- | --- |
| commitlint-config / markdownlint-config / stylelint-config | `"default"` ✓ |
| eslint-config | 裸字符串（等价 default） |
| eslint-plugin | 只 `"import"` |
| cli | 只 `"import"` |

Phase 5.5 明确决策：ESM-only 包用 `"default"` 同时服务 `import` 与 `require(esm)`。`"import"` 单条件下，任何 `require('@linter-spec/cli')` 会得 `ERR_PACKAGE_PATH_NOT_EXPORTED`。当下没有 CJS 消费方所以没炸，但与 Phase 5.5 决策不一致。

**修法**：eslint-plugin / cli 的 `exports['.'].import` → `default`（无副作用，等价覆盖 ESM 与 require(esm) 两种解析）。

### M3. root 的 `commitlint-config` / `markdownlint-config` 是 dev 而非真的"配置"

[package.JSON](package.json) 把这两个 workspace 包列在 `devDependencies` 是对的，但 [.markdownlint-cli2.cjs](.markdownlint-cli2.cjs) 在 root config 解析阶段就 `require('@linter-spec/markdownlint-config')`——这要求 workspace 已构建（`dist/` 存在）。新 clone 仓库后 `pnpm install` 不会自动 build，**直接跑 `pnpm lint` 会 `Cannot find module '...dist/index.js'`**。

**修法两选一**：

- 在 root `prepare`（已是 `husky`）之后追加 `pnpm -r build`，即新 clone 自动构建；或
- root scripts 加 `"postinstall": "pnpm -r --filter '@linter-spec/markdownlint-config' --filter '@linter-spec/commitlint-config' build"`，明确只构建 root 用到的两个

CI 不受影响（CI 已 `pnpm -r build` 在前）。本地开发者新 clone 会踩这个坑。

### M4. `.husky/pre-commit` 跑全量测试，不吃自己的狗粮

[.husky/pre-commit](.husky/pre-commit) 是 `pnpm -r --workspace-concurrency=1 run test`，整套测试要 ~25s（CLI 测试 spawn 真实 ESLint）。这违反 pre-commit 哲学（只检查暂存文件）。本仓库的 CLI 自带 `linter-spec commit-file-scan --strict` 命令就是干这个的，但根 husky 没用它。

**修法**：

- `.husky/pre-commit` 改成 `pnpm exec linter-spec commit-file-scan --strict`（但需要 CLI dist 已构建——参考 M3 同时解决）
- 或保守地：仅在 CI 跑全量测试，pre-commit 不跑（只跑 markdownlint --fix）

### M5. CI 矩阵只跑 Ubuntu，但代码到处 `cross-spawn` 暗示 Windows 支持

[.GitHub/workflows/ci.yml](.github/workflows/ci.yml) `runs-on: ubuntu-latest`。但 [packages/cli](packages/cli) 的 src 显式依赖 `cross-spawn` 解决 Windows 兼容性，作者在 Windows 上开发（用户机器是 win32）。Windows 路径分隔符、行尾、husky 脚本 shebang 都是常见踩点。

**修法**：CI matrix 加 `os: [ubuntu-latest, windows-latest]`，可选加 `macos-latest`。

### M6. `deploy.yml` 不依赖 `ci.yml` 通过

push 到 main 同时触发 `ci` 和 `deploy`，两者并行。即使 `ci` 因为某个包测试失败，`deploy` 仍会发布——线上文档有可能描述的是没通过测试的代码。

**修法两选一**：

- `deploy.yml` 触发条件改成 `on: workflow_run: { workflows: [CI], types: [completed], branches: [main] }` 并在 step 里检查 `conclusion == success`
- 或在 `deploy.yml` 的 build job 里加一步 `pnpm -r test`，把"测试通过"作为发布的前置

### M7. `cli` 仍然引用了根 `pnpm-lock.yaml` 的 lockfile，但子包没单独 `.npmrc`

非阻塞性，但子包发布到 npm 时如果有 install-time 行为（如 `prepare` script），可能继承根 `.npmrc` 的设置（`auto-install-peers=true` 等）。目前几个 config 包没有 prepare script 所以暂时没问题。**仅 watch**。

---

## L — 代码味道 / 重构机会

### L1. CLI `lints/*/do-*.ts` 文件解析逻辑 4 处重复

[do-eslint.ts](packages/cli/src/lints/eslint/do-eslint.ts)、[do-stylelint.ts](packages/cli/src/lints/stylelint/do-stylelint.ts)、[do-markdownlint.ts](packages/cli/src/lints/markdownlint/do-markdownlint.ts)、[do-prettier.ts](packages/cli/src/lints/prettier/do-prettier.ts) 各有一份相同形态的「options.files → filter+resolve / else glob」分支，~11 行 × 4 = 44 行可压成一个 `resolveFiles(opts, exts, ignore)` helper，~6 行。

### L2. CLI `lints/*/format-results.ts` 三处近重复

[eslint/format-results.ts](packages/cli/src/lints/eslint/format-results.ts) ~42 行、[stylelint/format-results.ts](packages/cli/src/lints/stylelint/format-results.ts) ~46 行、[markdownlint/format-results.ts](packages/cli/src/lints/markdownlint/format-results.ts) ~46 行——三者都是「过滤无问题文件 → 映射到 ScanResult → 处理 quiet」。差异只是每个 linter 字段名不同。可抽 `normalizeResults(results, adapter, quiet)`，~80 行可压成 ~30 行。

### L3. `lodash` 只为了一处 `_.mergeWith`

[utils/generate-template.ts:26](packages/cli/src/utils/generate-template.ts#L26) 是 lodash 全包的唯一调用点。`mergeWith(target, source, (t, s) => Array.isArray(t)&&Array.isArray(s) ? [...new Set([...s, ...t])] : undefined)` 这种深合并可以 ~10 行手写，或换 `defu`（~2KB）。lodash unpacked ~600KB。

### L4. `utils/npm.ts` 两个问题：同步包 Promise + 只识别 npm/pnpm

[utils/npm.ts:6-8](packages/cli/src/utils/npm.ts#L6-L8)：

```ts
export const npmType: Promise<'npm' | 'pnpm'> = new Promise((resolve) => {
  resolve(commandExistsSync('pnpm') ? 'pnpm' : 'npm');
});
```

**L4a — 多余的 Promise 壳**：`commandExistsSync` 是同步的；包成 Promise 让所有调用方都 `await npmType`，徒增 await。直接 `export const npmType = ...` 即可，4 处引用点同步去掉 await。

**L4b — 检测方式选错了**：`commandExists` 检测的是 "PATH 上有没有这个命令"，跟 "**用户用什么 PM 触发了这次调用**" 不是一回事——PATH 上同时装了 npm 和 pnpm 是常态，命中 `pnpm` 不代表用户当前项目用 pnpm。当前实现只能输出 `npm` 或 `pnpm`，碰到 Yarn / cnpm / Bun 项目会把用户的 lockfile 跟 `npm install` 的产物混到一起，污染 lockfile。

正确的信号源**有 4 个，按可靠度排级联**：

1. **`process.env.npm_config_user_agent`（首选）**——npm 标准的 npm-config 变量，npm/pnpm/Yarn/cnpm/Bun 全都遵守。第一段 `<tool>/<version>` 就是触发本次调用的 PM。已实测：
    - `pnpm exec node` → `pnpm/10.33.2 npm/? node/v24.15.0 win32 x64`
    - `npm i / npm exec / npx` → `npm/<v> node/<v> ...`
    - install 阶段触发的 `postinstall` 等 lifecycle 脚本也带 UA

   **盲区**：用户全局安装后裸跑 `linter-spec init` 或经 PATH 直接调，没有任何 PM 包装，UA 为空。此时往下走 2/3/4。

2. **`package.json` 的 `packageManager` 字段（Corepack 标准）**——`"packageManager": "pnpm@10.33.2"` 这种，是当前项目"声明的"PM。比 lockfile 更直接表达意图。

3. **lockfile**——回退兜底：

   | 文件 | PM |
   | --- | --- |
   | `pnpm-lock.yaml` | pnpm |
   | `yarn.lock` | Yarn |
   | `bun.lockb` | Bun |
   | `package-lock.json` / `npm-shrinkwrap.json` | npm |

4. **`npm`** 作为最终兜底。

**修法**：

```ts
type PM = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'cnpm';
const KNOWN: PM[] = ['npm', 'pnpm', 'yarn', 'bun', 'cnpm'];

export function detectPackageManager(cwd: string): PM {
  // 1. UA（用户当前是经哪个 PM 调进来的）
  const ua = process.env.npm_config_user_agent;
  if (ua) {
    const name = ua.split('/')[0];
    if (KNOWN.includes(name as PM)) return name as PM;
  }
  // 2. packageManager 字段（项目声明）
  try {
    const pkg = fs.readJSONSync(path.join(cwd, 'package.json'));
    if (typeof pkg.packageManager === 'string') {
      const name = pkg.packageManager.split('@')[0];
      if (KNOWN.includes(name as PM)) return name as PM;
    }
  } catch { /* no package.json */ }
  // 3. lockfile
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';
  if (fs.existsSync(path.join(cwd, 'npm-shrinkwrap.json'))) return 'npm';
  // 4. 兜底
  return 'npm';
}
```

调用方（`install-deps.ts`、`update.ts` 等）随之要兼容不同包管理器的命令语法差异（`yarn add -D` vs `npm i -D` vs `bun add -d` vs `pnpm add -D`）——可以抽一张 `INSTALL_FLAGS` 表统一。

`command-exists` 这个 dep 可以一并删掉，少 1 个 dep。

### L5. `actions/update.ts` 用 `execSync` 阻塞主线程跑网络请求

[actions/update.ts:11](packages/cli/src/actions/update.ts#L11) 用 `execSync` 跑 `${npm} view ${PKG_NAME} version`——同步等 npm registry。CLI 启动时本身就阻塞 ~500ms+。应改用 `execa(..., { stdio: 'pipe' })` 异步等待，或调用 npm registry 的 HTTPS API。

### L6. `actions/update.ts` 手写 semver 比较

[actions/update.ts:15-22](packages/cli/src/actions/update.ts#L15-L22) 把 version 字符串按 `.` split 成 number 数组逐位比。只处理 `x.y.z`，遇到 `1.0.0-beta.1` / `1.0.0+build.5` 会乱。若引入 `semver` 包（cli 没有这个 dep），多 ~50KB；若坚持手写，至少注释 "仅支持简单 x.y.z"。

### L7. `doPrettier` 无并发限制

[do-prettier.ts:26](packages/cli/src/lints/prettier/do-prettier.ts#L26) `Promise.all(files.map(formatFile))`——大型项目数千文件并发 IO + prettier worker，可能打挂。建议 `p-limit` 或 `Promise.all` 分批。

### L8. `conflict-resolve.ts` 在 Node API 路径 `process.exit(0)`

[utils/conflict-resolve.ts:87, 89](packages/cli/src/utils/conflict-resolve.ts#L87)——库代码直接 `process.exit`，调用方无法捕获。`NODE_ENV==='test'` 时短路所以测试看不到，但消费 Node API 的程序遇到冲突会被静默杀掉。应 throw 一个标记错误，由 CLI 层捕获后再 exit。

### L9. `utils/log.ts` `error` 只打 `e.message`，吞了 stack

[utils/log.ts:16-18](packages/cli/src/utils/log.ts#L16-L18) `log.error(Error)` → `red(e.message)`。开发期排查没 stack 难定位。

### L10. `utils/print-report.ts` 中英文混排

[utils/print-report.ts](packages/cli/src/utils/print-report.ts) 既有中文文案（line 58、60）又有英文 `X problems (Y errors, Z warnings)` + 英文 `pluralize`。其它地方（`messages.ts`）UX 是统一中文。建议二选一彻底贯穿。

### L11. `commands/commit-msg-scan.ts` 假设 `commitlint` 在 PATH

[commands/commit-msg-scan.ts:16](packages/cli/src/commands/commit-msg-scan.ts#L16) `spawn.sync('commitlint', ...)`。若 CLI 全局安装（`npm i -g`），用户项目可能没有 commitlint 在 PATH 上。`@commitlint/cli` 已是 cli 的 dep，可解析到 `node_modules/@commitlint/cli/cli.js` 直接 node spawn，比依赖 PATH 稳。

### L12. root `vitest.workspace.ts` 是孤儿

[Vitest.workspace.ts](vitest.workspace.ts) 文件存在但没人引用。`pnpm -r test` 走每个包自己的 Vitest.config，不经 workspace 文件。或者删掉、或者用上（加 root `"test": "vitest run"`，去掉所有子包的 Vitest.config.ts）。

### L13. 5 个子包 Vitest.config.ts 重复

[commitlint-config/Vitest.config.ts](packages/commitlint-config/vitest.config.ts)、markdownlint-config、stylelint-config、eslint-plugin、（eslint-config 多一行超时）几乎一模一样。如果保留 per-package，应该 extends 一个 `tsconfig.base.json` 同样级别的 `vitest.base.ts`。

### L14. `tsconfig.base.json` 的 target 还停在 ES2022

[tsconfig.base.JSON](tsconfig.base.json) `target/lib: ES2022`。Node 20.19+/22.12+ 已支持 ES2023。`ES2023` 会启用 `Array.prototype.findLast/at` 等的类型。低优先级，无功能影响。

### L15. 5 个 rule 文件的 `files: JS_FILES` 重复

[packages/eslint-config/src/configs/base.ts:40-45](packages/eslint-config/src/configs/base.ts#L40-L45) 把 `files: JS_FILES` 重复 spread 进每条规则。可以一行 `.map(rule => ({ ...rule, files: JS_FILES }))`。无功能差异。

### L16. cli `dist` 体积没量过

CLI 的 deps 25 个（lodash + 一票 chalk 系），dist 体积值得测一下。`tsc` 不做 tree-shake，prod tarball 全量 deps + dist 大概几 MB。**仅 watch**。

### L17. `eslint-config/src/configs/` 扁平化，名字会随轴数膨胀

[packages/eslint-config/src/configs/](packages/eslint-config/src/configs/) 现状是把组合维度全压扁到文件名里——`essential-typescript-react.ts`、`essential-typescript-vue.ts` 已经 3 段了。如果将来再加一个轴（例如"monorepo 适配"、"Vitest 适配"、"严格度"），就会出现 `essential-monorepo-typescript-vue.ts` 这种 4–5 段名，难读、`grep` 时 tab 补全也痛苦。

**修法**：改成与 `exports` 路径一一对应的嵌套目录。子路径 `@linter-spec/eslint-config/typescript/react` 就映射到 `dist/configs/typescript/react.js`：

```text
src/configs/
  base.ts
  es5.ts
  jsx-a11y.ts
  node.ts
  react.ts
  vue.ts
  typescript/
    index.ts
    node.ts
    react.ts
    vue.ts
  essential/
    index.ts
    es5.ts
    react.ts
    vue.ts
    typescript/
      index.ts
      react.ts
      vue.ts
```

文件数与现在一致，但每个文件名最多 1 段。`package.json` 的 17 个 `exports` 条目里 `./dist/configs/typescript-react.js` 改成 `./dist/configs/typescript/react.js`，是机械的批量替换。代价：

- `tsc` 还能正常出，`rootDir/outDir` 不动
- 内部 import 路径（如 `essential-react.ts` 引 `./react.js`）改为相对新位置（如 `essential/react.ts` 引 `../react.js`）
- 测试 fixture 引 entry 的方式不变（用 `@linter-spec/eslint-config/...` 子路径）
- 新增轴时（"monorepo"）：直接加目录 `src/configs/monorepo/typescript/react.ts`，文件名仍只 1 段

**建议**：在还没大量外部用户的现在迁，发布后再改就是 breaking change（虽然 npm 子路径不变，但 `exports` 重排会被严格的 monorepo 工具感知到）。

---

## Doc — 文档 / 产物漂移

### Doc1. README 写的是 Stylelint 16，实际是 17

[README.md:7](README.md#L7) "Stylelint 16, Prettier 3, commitlint 19" + [README.md:16](README.md#L16) 表格里 "Stylelint 16 preset"。Phase 5 升级时 peer 已是 `^17.0.0`、PROGRESS.md 也写明"整套升到 stylelint 17"。

### Doc2. 文档 markdownlint 残留 135 个 warning

`pnpm lint` 在迁移过来的 14 个 docs/*.md 上跑出 ~120 个 MD044（proper-names 大小写：`typescript`→`TypeScript`、`scss`→`SCSS` 等）和若干 MD040（fenced block 缺语言）。这是从 fe-spec 拷过来的历史文本，迁移没做 lint 清理。讽刺的是这套 lint 规则就是本仓库自己的 [`@linter-spec/markdownlint-config`](packages/markdownlint-config/src/index.ts)。建议 `pnpm lint --fix` 跑一遍。

### Doc3. CLI README 是英文，CLI 实际 UI 是中文

[packages/cli/README.md](packages/cli/README.md) 是英文，CLI 实际 UI 是中文（messages.ts）。可能本意如此（README 给国际化、CLI 给目标用户），但要 review 一遍。

---

## 修复优先级建议

| 立刻 (发布前 must) | 一周内 | 闲时 |
| --- | --- | --- |
| H1 eslint-config deps | M1 engines 对齐 | L1/L2 重构 |
| H2 markdownlint init 模板 | M2 exports 对齐 | L3 lodash 替换 |
| H3 cli files+README | M4 husky 改用 dog-food | L4 npmType 同步化 |
| Doc1 README 版本号 | M5 CI 加 Windows | L5/L6/L7 update/prettier 改进 |
| — | M6 deploy 依赖 ci | L8 conflict-resolve throw |
| — | M3 root postinstall 构建 | L9-L17 其它（含 L17 嵌套目录） |
| — | Doc2 docs/*.md lint --fix | — |

H 类 4 项（含 Doc1）合计 ~30 分钟可修完，是发布前最值得做的。
