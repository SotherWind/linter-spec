import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'linter-spec',
  description: '前端编码规范工程化',
  // Deployed at https://sotherwind.github.io/linter-spec/
  base: '/linter-spec/',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/linter-spec/img/logo-light.svg' }],
    [
      'meta',
      {
        name: 'keywords',
        content: '前端编码规范工程化 ESLint Stylelint Prettier commitlint markdownlint',
      },
    ],
  ],
  themeConfig: {
    logo: { light: '/img/logo-light.svg', dark: '/img/logo-dark.svg' },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/SotherWind/linter-spec' }],
    nav: [
      { text: '首页', link: '/' },
      {
        text: '编码规范',
        items: [
          { text: 'HTML 编码规范', link: '/coding/html' },
          { text: 'CSS 编码规范', link: '/coding/css' },
          { text: 'JavaScript 编码规范', link: '/coding/javascript' },
          { text: 'TypeScript 编码规范', link: '/coding/typescript' },
          { text: 'Node 编码规范', link: '/coding/node' },
        ],
      },
      {
        text: '工程规范',
        items: [
          { text: 'Git 规范', link: '/engineering/git' },
          { text: '文档规范', link: '/engineering/doc' },
          { text: 'CHANGELOG 规范', link: '/engineering/changelog' },
        ],
      },
      {
        text: 'npm 包',
        items: [
          { text: '@linter-spec/eslint-config', link: '/npm/eslint' },
          { text: '@linter-spec/stylelint-config', link: '/npm/stylelint' },
          { text: '@linter-spec/commitlint-config', link: '/npm/commitlint' },
          { text: '@linter-spec/markdownlint-config', link: '/npm/markdownlint' },
          { text: '@linter-spec/eslint-plugin', link: '/npm/eslint-plugin' },
        ],
      },
      {
        text: '脚手架',
        items: [{ text: 'linter-spec', link: '/cli/linter-spec' }],
      },
    ],
    sidebar: {
      '/coding/': [
        {
          text: '编码规范',
          items: [
            { text: 'HTML 编码规范', link: '/coding/html' },
            { text: 'CSS 编码规范', link: '/coding/css' },
            { text: 'JavaScript 编码规范', link: '/coding/javascript' },
            { text: 'TypeScript 编码规范', link: '/coding/typescript' },
            { text: 'Node 编码规范', link: '/coding/node' },
          ],
        },
      ],
      '/engineering/': [
        {
          text: '工程规范',
          items: [
            { text: 'Git 规范', link: '/engineering/git' },
            { text: '文档规范', link: '/engineering/doc' },
            { text: 'CHANGELOG 规范', link: '/engineering/changelog' },
          ],
        },
      ],
      '/npm/': [
        {
          text: 'npm 包',
          items: [
            { text: '@linter-spec/eslint-config', link: '/npm/eslint' },
            { text: '@linter-spec/stylelint-config', link: '/npm/stylelint' },
            { text: '@linter-spec/commitlint-config', link: '/npm/commitlint' },
            { text: '@linter-spec/markdownlint-config', link: '/npm/markdownlint' },
            { text: '@linter-spec/eslint-plugin', link: '/npm/eslint-plugin' },
          ],
        },
      ],
      '/cli/': [
        {
          text: '脚手架',
          items: [{ text: 'linter-spec', link: '/cli/linter-spec' }],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 SotherWind',
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新于',
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },
});
