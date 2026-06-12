# linter-spec 迁移进度清单

> 来源仓库：`D:\web\fe-spec`
> 目标仓库：`D:\web\linter-spec`
> 详细方案：`C:\Users\yang\.claude\plans\1-d-web-fe-spec-sdk-2-package-json-name-goofy-goblet.md`

---

## Phase 0 — 工作区骨架  ✅ 已完成

- [x] 根 `package.json`：name=linter-spec、type=module、SotherWind、MIT、pnpm@10.33.2
- [x] `pnpm-workspace.yaml`
- [x] `.gitignore` / `.npmrc` / `.editorconfig`
- [x] `LICENSE`（MIT © SotherWind）
- [x] `tsconfig.base.json`（公共 tsc 选项）
- [x] `vitest.workspace.ts`
- [x] `commitlint.config.cjs`（extend `@linter-spec/commitlint-config`）
- [x] `.prettierrc.cjs`
- [x] `.markdownlint-cli2.cjs`（import `@linter-spec/markdownlint-config`，见 Phase 5.5：原 `.jsonc` extend 无法加载 JS 配置包，已改 `.cjs`）
- [x] `.husky/pre-commit` + `.husky/commit-msg`（v9 写法）
- [x] `README.md`（中文，列出所有 6 个子包）
- [x] 创建 6 个空的 `packages/<name>/` 目录
- [x] `pnpm install` 通过

---

## Phase 1 — `@linter-spec/commitlint-config`  ✅ 已完成

- [x] `package.json`（CJS，conventional-changelog-conventionalcommits@^8）
- [x] `tsconfig.json`（module=commonjs）
- [x] `vitest.config.ts`
- [x] `src/index.ts`（用 `@commitlint/types` 的 `UserConfig` 类型，rule list 同 fe-spec）
- [x] `test/index.test.ts`（6 个用例：valid commit / unknown type / over-length / upper-case scope / missing type）
- [x] `README.md`（英文，描述 type-enum 等规则）
- [x] **构建通过 + 6 个测试全绿**

---

## Phase 2 — `@linter-spec/markdownlint-config`  ✅ 已完成

- [x] `package.json`（CJS，peer `markdownlint@^0.34`）
- [x] `tsconfig.json`（CJS）
- [x] `vitest.config.ts`
- [x] `src/index.ts`（`no-duplicate-header` 改名为 `no-duplicate-heading`、`first-line-heading` 等用新名、proper-names 列表无 `印客学院` 等品牌）
- [x] `test/index.test.ts`（7 个用例：clean / dup-heading / ul-style / trailing-spaces / proper-names / inline-HTML）
- [x] `README.md`
- [x] **构建通过 + 7 个测试全绿**

---

## Phase 3 — `@linter-spec/eslint-plugin`  ✅ 已完成

- [x] `package.json`（ESM，peer `eslint@^9`）
- [x] `tsconfig.json`（module=NodeNext，需要带 `.js` import 后缀）
- [x] `vitest.config.ts`
- [x] `src/index.ts`（flat-config 插件导出 `{ meta, rules, configs.recommended }`）
- [x] `src/rules/no-http-url.ts`（ESLint 9 `Rule.RuleModule`，`context.filename` 替代旧 `context.getFilename()`）
- [x] `src/rules/no-secret-info.ts`
- [x] `src/rules/no-broad-semantic-versioning.ts`
- [x] `src/rules/no-js-in-ts-project.ts`
- [x] `test/rules/*.test.ts`（4 文件，每条规则的 valid/invalid 用例）
- [x] `test/index.test.ts`（插件 Meta / rules / configs.recommended 形状）
- [x] `README.md`
- [x] **构建通过 + 26 个测试全绿**（4 条规则 + 3 个 plugin contract）

---

## Phase 4 — `@linter-spec/eslint-config`  ✅ 已完成

### 包基础

- [x] `package.json`（ESM，17 个 exports 子路径，devDeps 含所有插件最新版）
- [x] `tsconfig.json`（NodeNext + 自定义 typeRoots 兜底 jsx-a11y 类型）
- [x] `vitest.config.ts`
- [x] `src/types/eslint-plugin-jsx-a11y.d.ts`（补全没有 d.ts 的插件）

### Helpers

- [x] `src/helpers/constants.ts`（ID_BLACKLIST / ES6_BLACKLIST / TS_BLACKLIST）
- [x] `src/helpers/apply-blacklist.ts`（合并 `id-denylist`）
- [x] `src/helpers/soften-stylistic.ts`（原 set-style-to-warn，改名）

### 共享规则碎片

- [x] `src/rules/possible-errors.ts`
- [x] `src/rules/best-practices.ts`
- [x] `src/rules/variables.ts`
- [x] `src/rules/es6.ts`
- [x] `src/rules/strict.ts`
- [x] `src/rules/style.ts`（`@stylistic/eslint-plugin` 接管 ESLint 9 移除的 stylistic 规则）
- [x] `src/rules/imports.ts`（`eslint-plugin-import-x`）
- [x] `src/rules/node.ts`（`eslint-plugin-n`，`flat/recommended-module`）
- [x] `src/rules/react.ts`（`eslint-plugin-react` + `eslint-plugin-react-hooks` flat）
- [x] `src/rules/jsx-a11y.ts`（`eslint-plugin-jsx-a11y` v6.10+ flat）
- [x] `src/rules/vue.ts`（`eslint-plugin-vue@9` flat）
- [x] `src/rules/typescript.ts`（`typescript-eslint` 伞包）
- [x] `src/rules/es5.ts`

### 17 个 entry

- [x] `src/configs/base.ts`（默认入口，含 `files: ['**/*.{js,mjs,cjs,jsx}']`）
- [x] `src/configs/es5.ts`
- [x] `src/configs/react.ts`
- [x] `src/configs/vue.ts`
- [x] `src/configs/node.ts`
- [x] `src/configs/jsx-a11y.ts`
- [x] `src/configs/typescript.ts`
- [x] `src/configs/typescript-react.ts`
- [x] `src/configs/typescript-vue.ts`
- [x] `src/configs/typescript-node.ts`
- [x] `src/configs/essential.ts`
- [x] `src/configs/essential-es5.ts`
- [x] `src/configs/essential-react.ts`
- [x] `src/configs/essential-vue.ts`
- [x] `src/configs/essential-typescript.ts`
- [x] `src/configs/essential-typescript-react.ts`
- [x] `src/configs/essential-typescript-vue.ts`

### 测试 + 文档

- [x] `test/helpers/run-lint.ts`（fixture 驱动 ESLint，cwd-relative 路径）
- [x] `test/base.test.ts`（4 用例）
- [x] `test/es5.test.ts`（2 用例）
- [x] `test/react.test.ts`（3 用例）
- [x] `test/vue.test.ts`（2 用例）
- [x] `test/node.test.ts`（2 用例）
- [x] `test/jsx-a11y.test.ts`（1 用例）
- [x] `test/typescript.test.ts`（3 用例）
- [x] `test/typescript-combos.test.ts`（3 用例）
- [x] `test/essential.test.ts`（8 用例）
- [x] `test/configs.test.ts`（11 用例，由用户编辑器/编辑期间补全）
- [x] `README.md`
- [x] **构建通过 + 39 个测试全绿**

---

## Phase 5 — `@linter-spec/stylelint-config`  ✅ 已完成

> 说明：fe-spec 时代 stylelint 14，本仓库整套生态升级到 **stylelint 17**（`stylelint-config-standard@40` 的 peer 已要求 `^17`），与 markdownlint/eslint 包「全用最新版」的策略一致。stylelint 16 起 stylistic 规则全部移出核心，迁到 `@stylistic/stylelint-plugin`。

- [x] `package.json`（CJS，peer `stylelint@^17`；runtime deps：`stylelint-config-standard`、`stylelint-config-recommended-scss`、`stylelint-scss`、`@stylistic/stylelint-plugin`、`postcss-less` —— 放 `dependencies` 而非 devDep，否则消费方/CLI 无法解析 extends/plugins）
- [x] `tsconfig.json`（NodeNext + 无 `type:module` → 输出 CJS `module.exports`；`node` 解析无法读取 stylelint 的 exports-gated 类型，故用 NodeNext）
- [x] `vitest.config.ts`
- [x] `src/index.ts`：
  - root extend `stylelint-config-standard` + plugin `@stylistic`，意图规则
  - **SCSS 规则限定到 `overrides: ['**/*.scss']`**（extend recommended-SCSS + plugin stylelint-SCSS）——全局生效会让 `scss/operator-no-unspaced` 在 Less AST 上崩溃
  - `overrides: ['**/*.less'] → customSyntax: 'postcss-less'`
  - 意图类规则保留：`color-no-invalid-hex`、`declaration-block-no-duplicate-properties`、`selector-max-id: 0`、`unit-no-unknown` 含 `rpx`、`no-descending-specificity: null`、`selector-pseudo-class-no-unknown` 含 `:global`/`:local`/`:export`、`scss/double-slash-comment-whitespace-inside`、`scss/at-rule-no-unknown`
  - stylistic 规则加 `@stylistic/` 前缀（`indentation` → `@stylistic/indentation` 等，逐条用 stylelint 实跑校验过规则名存在）
  - `comment-whitespace-inside` 仍是核心规则（无 `@stylistic/` 版本），保持无前缀
  - `ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']`
- [x] `test/fixtures/*.{css,scss,less}`（沿用 fe-spec 5 个 fixture，无品牌字样）
- [x] `test/rules-validate.test.ts`（断言 `warnings[].rule` 含/不含特定规则；含 rpx/`:global` 意图正反例、无 Unknown rule、无 parseError 回归守卫）
- [x] `README.md`
- [x] **构建通过 + 13 个测试全绿**

---

## Phase 5.5 — config 包统一 ESM-only 改造  ✅ 已完成

> **背景 / 决策**：markdownlint/commitlint/stylelint 三个 config 包当前是 CJS（`exports` 只有 `require` 条件、源码用 `export =`）。CLI 是 ESM，加载共享 config 时被迫写 `createRequire`（见 [`packages/cli/src/lints/markdownlint/get-config.ts`](packages/cli/src/lints/markdownlint/get-config.ts) 顶部）。
>
> **为什么现在能改 ESM-only**：`require(ESM)` 已在 `^20.19.0 || >=22.12.0` 稳定且默认开启（唯一限制：被 require 的 ESM 不能含 top-level await —— config 是纯数据对象，天然满足）。因此 markdownlint-cli2 等用 `require()` 加载 config 的工具，加载 ESM 包也不再报 `ERR_REQUIRE_ESM`。
>
> **前提**：engines 抬到 `^20.19.0 || >=22.12.0`，放弃 Node 18（已于 2025-04 EOL，本就该升）。本机 Node v24.15.0，require(esm) 可用。
>
> **收益**：单源、单产物、零额外打包工具（`tsc` 即可），所有消费方原生加载，对齐 stylelint/commitlint 官网的 ESM 推荐，并彻底删除 CLI 的 `createRequire`。备选方案（不采用）：双格式 tsup 构建。
>
> **关键修正（exports 用 `default` 而非 `import`）**：裸标识符 `require('@linter-spec/...')`（如 markdownlint-cli2、CJS 配置文件）按 `exports` 的 **`require` 条件**解析，只声明 `import` 会 `ERR_PACKAGE_PATH_NOT_EXPORTED`——`require(esm)` 只负责"加载"已解析到的 ESM，不会绕过 exports 条件去"解析"。故三个包的 `exports` 用 **`"default"`**（通配 import + require，均指向同一个 ESM 文件）：import 原生加载、require 经 require(esm) 加载。这是 ESM-only 包同时服务两类解析器的正确写法。

### 逐包改造（markdownlint-config / commitlint-config / stylelint-config）

- [x] `package.json`：加 `"type": "module"`；`exports` 的 `"require"` → `"import"`；`"engines.node"` → `^20.19.0 || >=22.12.0`；`main` 仍指 `./dist/index.js`（现为 ESM）
- [x] `tsconfig.json`：`module` / `moduleResolution` → `NodeNext`（commitlint/markdownlint 原 `commonjs`+`node`；stylelint 原本已是 NodeNext）
- [x] `src/index.ts`：`export = config` → `export default config`（保留原有 `const config: XxxConfig` 显式类型标注，等价类型安全、diff 更小，未改用 `satisfies`）
- [x] 重新 `build` + 跑测试：commitlint 6 / markdownlint 7 / stylelint 13 全绿；产物 `dist/index.js` 确认为 `export default`（ESM）

### CLI 侧收尾

- [x] [`packages/cli/src/lints/markdownlint/get-config.ts`](packages/cli/src/lints/markdownlint/get-config.ts)：删 `createRequire` 三行，改为 `import markdownlintConfig from '@linter-spec/markdownlint-config'`
- [x] [`packages/cli/src/lints/stylelint/get-config.ts`](packages/cli/src/lints/stylelint/get-config.ts)：`require.resolve(pkg)` → `fileURLToPath(import.meta.resolve(pkg))`（ESM-only 后 `require.resolve` 会 `ERR_PACKAGE_PATH_NOT_EXPORTED`）
- [x] 全局自查：CLI 仅剩 [`utils/constants.ts`](packages/cli/src/utils/constants.ts) 一处 `createRequire`，用途是读 CLI **自身** `package.json`（与 config 包无关），保留
  - **Phase 6 后续：这处 `createRequire` 也已删除**，见下方"修正"段——改用 ESM JSON import attributes（`import pkg from '../../package.json' with { type: 'json' }`），现在 `packages/cli/src/` 零 `createRequire`

### 全局一致性

- [x] 根 `package.json` engines → `^20.19.0 || >=22.12.0`（`tsconfig.base.json` 无 engines 字段，仅 compilerOptions）
- [x] `pnpm -r build`：6 个包全部构建通过（含 CLI，证明两处 get-config.ts 改动可编译）
- [x] `pnpm -r test`：5 个已完成包全绿（commitlint 6 / eslint-config 39 / eslint-plugin 26 / markdownlint 7 / stylelint 13 = 91）；CLI 报 "No test files found"（Phase 6 尚未写测试，属预期，非回归）
- [x] `require(esm)` + `import` 双探针：三个构建产物均成功加载（验证核心技术主张）

> **⚠️ 发现的预存问题（非本次引入，留待 Phase 9 / 根依赖接线）**：根 `commitlint.config.cjs`、`.markdownlint-cli2.jsonc` extend 这三个 workspace 包，但**根 `package.json` 未把它们声明为依赖**，pnpm 不会链接到根 `node_modules/@linter-spec/`，导致从根运行 `pnpm lint`（markdownlint-cli2）与 commitlint 会 `MODULE_NOT_FOUND`。这与 CJS/ESM 无关——旧 CJS 版本同样解析不到。修法：根 devDeps 加 `@linter-spec/markdownlint-config`、`@linter-spec/commitlint-config`（`workspace:*`）后 `pnpm install`。

---

## Phase 6 — `@linter-spec/cli`  ✅ 已完成

> 说明：src 实现与构建脚手架（`scripts/copy-templates.mjs` 拷 `.ejs` 模板到 dist）在本阶段开始前已存在并能 `build`；本次补齐**测试套件 + README**，并修掉一处 Vitest 不兼容的解析方式。

### 包基础

- [x] `package.json`（ESM，`bin: { "linter-spec": "./dist/cli.js" }`，workspace ref 4 个兄弟 config 包）
- [x] `tsconfig.json`（NodeNext）
- [x] `vitest.config.ts`（`include: test/**/*.test.ts`，超时 60s）

### src 结构

- [x] `src/cli.ts`（commander bin 入口）
- [x] `src/index.ts`（Node API：`init` / `scan` + 类型再导出）
- [x] `src/types.ts`
- [x] `src/commands/{index,init,scan,fix,update,commit-msg-scan,commit-file-scan}.ts`
- [x] `src/actions/init/{index,prompts,install-deps,write-vscode,setup-husky}.ts`
- [x] `src/actions/scan/{index,orchestrate}.ts`
- [x] `src/actions/update.ts`
- [x] `src/lints/eslint/{do-eslint,format-results,get-config,get-config-type,index}.ts`（flat-config 动态 import）
- [x] `src/lints/stylelint/{do-stylelint,format-results,get-config,get-doc-url,index}.ts`
- [x] `src/lints/markdownlint/{do-markdownlint,format-results,get-config,index}.ts`
- [x] `src/lints/prettier/{do-prettier,index}.ts`（Prettier 3 async format）
- [x] `src/utils/{conflict-resolve,constants,messages,generate-template,git,log,npm,print-report,read-config}.ts`
- [x] `src/config/*.ejs`（模板已改名：`linter-spec.config.mjs.ejs`、`eslint.config.mjs.ejs`、`stylelint.config.mjs.ejs`、`commitlint.config.mjs.ejs`、`prettier.config.mjs.ejs`）

### 修正（本次）

- [x] **源码保持纯 ESM `import.meta.resolve`**，从测试侧解决 Vitest 兼容性。Vitest 2.x（底层 Vite 5）的 SSR transform 会把 `import.meta` 改写成不带 `.resolve` 的 shim，导致 `src/lints/stylelint/get-config.ts` 顶层执行抛 `TypeError`、Node API 测试无法加载。曾短暂改用 `createRequire(import.meta.url).resolve(...)`，但这违反 Phase 5.5 的明确约定（"CLI 仅剩 `utils/constants.ts` 一处 `createRequire`，专用于读 CLI 自身 `package.json`"），已回退。最终方案：
  - `src` 保持 `fileURLToPath(import.meta.resolve(...))`，不再引入 `createRequire`
  - [`test/index.test.ts`](packages/cli/test/index.test.ts) 改为从 `../dist/index.js` 导入（与既有 `test/cli.test.ts` 对 dist 的依赖一致；也更贴近真实消费方场景）
  - [`vitest.config.ts`](packages/cli/vitest.config.ts) 加 `test.server.deps.external: [/packages\/cli\/dist\//]`，让 Vitest 走 Node 原生 ESM loader 加载 dist，不再做 SSR transform
  - [`package.json`](packages/cli/package.json) 加 `pretest: pnpm build`，保证 `pnpm test` 单独运行时 dist 也是最新的（CI 的 `pnpm -r build && pnpm -r test` 顺序本就满足这条）
- [x] 顺手干掉 Phase 5.5 当时保留的"最后一处 `createRequire`"：[`src/utils/constants.ts`](packages/cli/src/utils/constants.ts) 读自身 `package.json` 改用 ESM JSON import attributes —— `import pkg from '../../package.json' with { type: 'json' }`。前置条件 Node 20.19+/22.12+（import attributes 早已稳定）与 TS 5.6（≥5.3 支持 `with` 语法）本仓库已满足；`tsc` 原样保留语法到 dist，运行 `node dist/cli.js --version → 1.0.0`。现在 `packages/cli/src/` **完全无 `createRequire`**，CLI 实现真正的纯 ESM。

### 测试（共 14 个，全绿）

- [x] `test/cli.test.ts`（execa 跑 `dist/cli.js`：`--version`、`--help` 列命令、`fix` 原地改写、`scan` clean 退 0 / `--output-report` 产文件 —— 5 例）
- [x] `test/index.test.ts`（Node API：`init` 写配置+合并 `.vscode`+husky、disabled 分支；`scan` 报错/clean/quiet/outputReport —— 6 例）
- [x] `test/commands.test.ts`（git 仓库驱动 `commit-file-scan`：clean 退 0 / error 退 1 / `--strict` 将 warn 卡口 —— 3 例）
  - 说明：`commit-msg-scan` 为 `commitlint --edit` 透传薄封装，可靠测试需「git root + 工作区可解析的 config 包 + PATH 上的 commitlint」三者同时满足，过于脆弱（含 Windows `.git` 句柄 EBUSY 清理问题），且不在原计划必测项内，故不单测；其 husky 接线已由 `init` 测试覆盖。
- [x] `test/fixtures/autofix/{semi-error.js,semi-expected.js}`（按本仓库 eslint+prettier 实际 fix 结果生成的确定性 fixture）
- [x] `test/fixtures/template/init/{package.json,_vscode/settings.json}`

### 收尾

- [x] `README.md`（英文，对齐其余包风格：Install / Quick start / 命令表 / 选项表 / Node API / 项目类型 / 配置文件）
- [x] **构建通过 + 14 个测试全绿**；`pnpm -r build` / `pnpm -r test` 6 包全绿（commitlint 6 / markdownlint 7 / eslint-plugin 26 / stylelint 13 / eslint-config 39 / cli 14 = 105）
- [x] `node packages/cli/dist/cli.js --version` → `1.0.0`

---

## Phase 7 — 文档：VuePress 1 → VitePress  ✅ 已完成

> 一次性脚本（已删除）对从 fe-spec 拷过来的 14 个 `.md` 做批量 transform：strip vdoing frontmatter、rebrand、strip `.md` 链接后缀。后续 index 重写与 config 手写。

- [x] 从 fe-spec 拷 `docs/{coding,engineering,npm,cli,index.md}`；`docs/.vuepress/public/img/logo.png` → `docs/public/img/logo.png`（VitePress 约定 public 根目录在 `docs/public/`）
- [x] [`docs/.vitepress/config.ts`](docs/.vitepress/config.ts)：`base: '/linter-spec/'`、`title`、`zh-CN` lang/themeConfig 全套（含中文 `outline / docFooter / lastUpdatedText` 等）、`nav` + path-scoped `sidebar`、`socialLinks` GitHub、local search、footer
- [x] 重命名 `docs/cli/encode-fe-lint.md` → [`docs/cli/linter-spec.md`](docs/cli/linter-spec.md)
- [x] 14 个 `.md` 批量替换（**顺序敏感**：先长后短，避免 `eslint-config-encode` 被先匹配的 `encode-fe-lint` 截断；先 `chenghuai.com` 再裸 `chenghuai`）：
  - `eslint-config-encode` → `@linter-spec/eslint-config`、`stylelint-config-encode` → `@linter-spec/stylelint-config`、commitlint / markdownlint config 同理
  - `eslint-plugin-encode` → `@linter-spec/eslint-plugin`
  - `encode-fe-lint` → `linter-spec`
  - `encode-studio-fe-web.github.io/fe-spec` → `sotherwind.github.io/linter-spec`；`encode-studio-fe(-web)/fe-spec` → `SotherWind/linter-spec`
  - `chenghuai.com` → `example.com`；`chenghuai` → `demo`；`huaicheng` → `example`（JS demo 块里的标识符对）
  - `印客学院`：在 `coding/html.md` 的 HTML 示例里 → `Demo Site`（保留 `<title>印客学院</title>` → `<title>Demo Site</title>` 的语义），其余位置 → `linter-spec`；`印客教育` → `linter-spec`
- [x] 删 `.md` 顶部 vdoing 的 frontmatter 整块（title/categories/tags/author/link）
- [x] `[x](./foo.md#a)` → `[x](./foo#a)`（仅本地相对路径，外链 `.md` 不动；正则锚定 `./` `../` 开头）
  - 顺手修复源仓库一个跨阶段 bug：`engineering/changelog.md` 里 `./1.git.md#1.3.1-type` 实际目标是 `git`，已改为 `./git#1.3.1-type`
- [x] [`docs/index.md`](docs/index.md)：VuePress `home: true` → VitePress `layout: home`（hero / actions / features 重写，链接指 GitHub + `/coding/html`）
- [x] `pnpm docs:dev` 启动到 `http://localhost:5173/linter-spec/` 无错
- [x] **`pnpm docs:build` 11.88s 构建通过**，产出 15 个内容页 + 404；`grep -rE '印客|encode-fe-lint|encode-studio|chenghuai|huaicheng|config-encode|plugin-encode|澄怀'` 在 `docs/` 与 `docs/.vitepress/dist/` 均 **0 命中**

---

## Phase 8 — CI / GitHub Actions  ✅ 已完成

> **Node 矩阵偏离原计划**：原计划写的是 `18/20/22`，但 Phase 5.5 已把 `engines.node` 抬到 `^20.19.0 || >=22.12.0`（require(esm) 稳定门槛 + Node 18 EOL）。在 CI 跑 Node 18 必然失败，与本仓库工程取向相悖。实际矩阵改为 **`20.19` / `22` / `24`**，覆盖 LTS 全部活跃版本。

- [x] [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)：VitePress + `actions/configure-pages@v5` + `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`，目录 `docs/.vitepress/dist`；build/deploy 拆两 job；`pages` concurrency group + `cancel-in-progress`（新 push 取消排队的旧部署）；触发分支 `main`。`docs:build` 之前先 `pnpm -r build`，因为根 `.markdownlint-cli2.cjs` 在 root config 解析期会 `require('@linter-spec/markdownlint-config')`，需要 workspace dist 存在
- [x] [`.github/workflows/ci.yml`](.github/workflows/ci.yml)：node 20.19/22/24 matrix（`fail-fast: false`），`pnpm/action-setup@v4` + `setup-node@v4 cache: pnpm`，`pnpm install --frozen-lockfile` → `pnpm -r build` → `pnpm -r test`
- [x] 无 `NODE_OPTIONS: --openssl-legacy-provider`（本仓库从未引入，源仓 fe-spec 的 4G heap + legacy openssl 是 Node 14/16 时代的 webpack 4 兼容残留，VitePress + Node 20+ 无此需求）
- [x] 根 `deploy.sh` 不存在（同样未拷贝；fe-spec 那份是 push 到 `gh-pages` 分支的老式脚本，已由 `actions/deploy-pages` 取代）

---

## Phase 9 — 全局扫描清理  ✅ 已完成

5 个必查 grep 全部 0 命中（已排除 `node_modules` / `dist` / `pnpm-lock.yaml` / `PROGRESS.md` 自身——PROGRESS 在 diff 里记录这些迁移项）：

- [x] `Grep "印客"`：0 命中
- [x] `Grep "encode-fe"`：0 命中
- [x] `Grep "encode-studio-fe"`：0 命中
- [x] `Grep "chenghuai"`：0 命中
- [x] `Grep "(eslint-config-encode|stylelint-config-encode|commitlint-config-encode|markdownlint-config-encode|eslint-plugin-encode)"`：0 命中

最后：

- [x] `pnpm -r build`：6 包构建通过
- [x] `pnpm -r test`：6 包全绿，共 **105** 个测试（commitlint 6 / markdownlint 7 / stylelint 13 / eslint-plugin 26 / eslint-config 39 / cli 14）
- [x] `pnpm docs:build`：8.08s 通过；产物 15 个内容页 + 404，无品牌遗留
- [x] 端到端验证：CLI `--version` → `1.0.0`；`init` Node API 写出正确 `eslint.config.mjs` + `.vscode/settings.json` + husky 钩子；`scan` / `fix` / `commit-file-scan` 路径均在测试中覆盖（commit-msg-scan 为 `commitlint --edit` 透传，未单测——理由见 Phase 6）

---

## 累计测试数（最终）

| 包 | 测试数 |
| --- | --- |
| commitlint-config | 6 |
| markdownlint-config | 7 |
| stylelint-config | 13 |
| eslint-plugin | 26 |
| eslint-config | 39 |
| cli | 14 |
| **合计** | **105** |
