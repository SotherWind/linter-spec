import type { Config } from 'stylelint';

/**
 * Shareable Stylelint configuration for the linter-spec toolchain.
 *
 * Targets Stylelint 16/17, which removed every *stylistic* rule from core.
 * Those rules now live in `@stylistic/stylelint-plugin` and are referenced here
 * with the `@stylistic/` prefix (e.g. `indentation` → `@stylistic/indentation`),
 * preserving the original fe-spec conventions.
 *
 * Layering:
 *   - root: `stylelint-config-standard` + `@stylistic` plugin + intent rules.
 *     Applies to every file (CSS / SCSS / Less).
 *   - `*.scss` override: layers `stylelint-config-recommended-scss` + the
 *     `stylelint-scss` plugin on top, so SCSS-only rules never run against
 *     plain CSS or Less ASTs (running them on Less crashes the SCSS parser).
 *   - `*.less` override: switches the parser to `postcss-less`.
 */
const config: Config = {
  defaultSeverity: 'warning',
  extends: ['stylelint-config-standard'],
  plugins: ['@stylistic/stylelint-plugin'],
  rules: {
    /**
     * Possible errors
     * @link https://stylelint.io/user-guide/rules/#avoid-errors
     */
    'color-no-invalid-hex': true,
    'comment-no-empty': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'block-no-empty': null,
    // @reason 实际项目中大量依赖书写顺序的优先级写法，且多数人熟悉 css 优先级
    'no-descending-specificity': null,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': null,
    'no-invalid-double-slash-comments': true,
    'property-no-unknown': true,
    // 允许 CSS Modules 的 :global / :local / :export 伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local', 'export'],
      },
    ],
    'selector-pseudo-element-no-unknown': true,
    'string-no-newline': true,
    // 允许小程序的 rpx 单位
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],

    /**
     * Non-stylistic conventions that remain in core
     */
    'color-hex-length': 'short',
    'comment-whitespace-inside': 'always',
    'declaration-block-single-line-max-declarations': 1,
    'length-zero-no-unit': [
      true,
      {
        ignore: ['custom-properties'],
      },
    ],
    'selector-max-id': 0,

    /**
     * Stylistic issues — moved to `@stylistic/stylelint-plugin` in Stylelint 16
     * @link https://github.com/stylelint-stylistic/stylelint-stylistic
     */
    '@stylistic/indentation': 2,
    '@stylistic/block-closing-brace-newline-before': 'always-multi-line',
    '@stylistic/block-closing-brace-space-before': 'always-single-line',
    '@stylistic/block-opening-brace-newline-after': 'always-multi-line',
    '@stylistic/block-opening-brace-space-before': 'always',
    '@stylistic/block-opening-brace-space-after': 'always-single-line',
    '@stylistic/color-hex-case': 'lower',
    '@stylistic/declaration-colon-space-before': 'never',
    '@stylistic/declaration-colon-space-after': 'always',
    '@stylistic/declaration-block-trailing-semicolon': [
      'always',
      {
        severity: 'error',
      },
    ],
    '@stylistic/max-line-length': 100,
    '@stylistic/no-extra-semicolons': true,
    '@stylistic/value-list-comma-space-after': 'always-single-line',
  },

  overrides: [
    {
      // SCSS-only layer: recommended-scss brings the postcss-scss parser and
      // the recommended SCSS rule set; we keep the intentful SCSS rules below.
      files: ['**/*.scss'],
      extends: ['stylelint-config-recommended-scss'],
      plugins: ['stylelint-scss'],
      rules: {
        // core at-rule-no-unknown can't understand @mixin/@include — defer to scss/*
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'scss/double-slash-comment-whitespace-inside': 'always',
      },
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],

  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
};

export default config;
