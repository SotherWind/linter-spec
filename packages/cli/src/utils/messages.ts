import { CLI_NAME, PKG_NAME } from './constants.js';

/**
 * Centralised user-facing strings (Chinese), parameterised by the CLI name so
 * renames stay in one place.
 */
export const messages = {
  description: `${CLI_NAME} 是配套 linter-spec 前端编码规范的 Lint 工具，提供简单的 CLI 和 Node.js API，让项目一键接入、一键扫描、一键修复、一键升级，并配置 git commit 卡点。`,

  // command descriptions
  initDescription: '一键接入：为项目初始化规范工具和配置，可根据项目类型和需求定制',
  scanDescription: '一键扫描：对项目进行代码规范问题扫描',
  fixDescription: '一键修复：自动修复项目的代码规范扫描问题',
  updateDescription: `更新 ${PKG_NAME} 至最新版本`,
  commitMsgScanDescription: 'commit message 检查：git commit 时对 commit message 进行检查',
  commitFileScanDescription: '代码提交检查：git commit 时对提交代码进行规范问题扫描',

  // option descriptions
  optVscode: '写入 .vscode/settings.json 配置',
  optQuiet: '仅报告错误信息 - 默认: false',
  optOutputReport: '输出扫描出的规范问题日志',
  optInclude: '指定要进行规范扫描的目录',
  optNoIgnore: '忽略 eslint 的 ignore 配置文件和 ignore 规则',
  optStrict: '严格模式，对 warn 和 error 问题都卡口，默认仅对 error 问题卡口',

  // runtime
  runChecking: `执行 ${CLI_NAME} 代码检查`,
  runFixing: `执行 ${CLI_NAME} 代码修复`,
  runCommitChecking: `执行 ${CLI_NAME} 代码提交检查`,
  installingDeps: (npm: string) =>
    `使用项目 Lint 配置，检测到项目未安装依赖，将进行安装（执行 ${npm} install）`,
  notStaged: (files: string) => `[${CLI_NAME}] changes not staged for commit: \n${files}\n`,

  // init steps
  stepChooseType: (step: number) =>
    `Step ${step}. 请选择项目的语言（JS/TS）和框架（React/Vue）类型：`,
  stepEnableStylelint: (step: number) =>
    `Step ${step}. 是否需要使用 stylelint（若没有样式文件则不需要）：`,
  stepEnableMarkdownlint: (step: number) =>
    `Step ${step}. 是否需要使用 markdownlint（若没有 Markdown 文件则不需要）：`,
  stepEnablePrettier: (step: number) => `Step ${step}. 是否需要使用 Prettier 格式化代码：`,
  stepConflict: (step: number) => `Step ${step}. 检查并处理项目中可能存在的依赖和配置冲突`,
  stepConflictDone: (step: number) => `Step ${step}. 已完成项目依赖和配置冲突检查处理 :D`,
  stepInstall: (step: number) => `Step ${step}. 安装依赖`,
  stepInstallDone: (step: number) => `Step ${step}. 安装依赖成功 :D`,
  stepHusky: (step: number) => `Step ${step}. 配置 git commit 卡点`,
  stepHuskyDone: (step: number) => `Step ${step}. 配置 git commit 卡点成功 :D`,
  stepWrite: (step: number) => `Step ${step}. 写入配置文件`,
  stepWriteDone: (step: number) => `Step ${step}. 写入配置文件成功 :D`,
  initDone: `${CLI_NAME} 初始化完成 :D`,

  // conflict resolve
  conflictDetected: `检测到项目中存在可能与 ${CLI_NAME} 冲突的依赖和配置，为保证正常运行将`,
  conflictRemoveDeps: '删除以下依赖：',
  conflictRemoveConfig: '删除以下配置文件：',
  conflictRewriteConfig: '覆盖以下配置文件：',
  conflictConfirm: '请确认是否继续：',
  conflictCancelled: '已取消，未修改任何文件。',

  // update
  updateChecking: `[${PKG_NAME}] 正在检查最新版本...`,
  updateFound: (v: string) => `[${PKG_NAME}] 存在新版本，将升级至 ${v}`,
  updateHint: (latest: string, current: string, command: string) =>
    `最新版本为 ${latest}，本地版本为 ${current}，请尽快升级到最新版本。\n你可以执行 ${command} 来安装此版本\n`,
  updateNone: '当前没有可用的更新',
} as const;
