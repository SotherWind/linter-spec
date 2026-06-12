import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import stylelint from 'stylelint';
import config from '../src/index';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(dirname, 'fixtures');
const basedir = path.resolve(dirname, '..');

interface LintInfo {
  rules: Set<string>;
  warningCount: number;
  parseErrorCount: number;
  unknownRules: string[];
  errored: boolean;
}

async function lintFixture(file: string): Promise<LintInfo> {
  const result = await stylelint.lint({
    config,
    configBasedir: basedir,
    files: [path.join(fixtures, file)],
    fix: false,
  });
  const r = result.results[0]!;
  return {
    rules: new Set(r.warnings.map((w) => w.rule)),
    warningCount: r.warnings.length,
    parseErrorCount: (r.parseErrors ?? []).length,
    unknownRules: r.warnings.filter((w) => /^Unknown rule/.test(w.text)).map((w) => w.rule),
    errored: Boolean(result.errored),
  };
}

async function lintCode(code: string, customSyntax?: string): Promise<Set<string>> {
  const result = await stylelint.lint({
    config,
    configBasedir: basedir,
    code,
    customSyntax,
  });
  return new Set(result.results[0]!.warnings.map((w) => w.rule));
}

const ALL_FIXTURES = [
  'index.css',
  'sass-test.scss',
  'less-test.less',
  'css-module.scss',
  'essential.css',
];

describe('@linter-spec/stylelint-config', () => {
  it('exports a config with the expected shape', () => {
    expect(config.defaultSeverity).toBe('warning');
    expect(config.extends).toContain('stylelint-config-standard');
    expect(config.plugins).toContain('@stylistic/stylelint-plugin');
    expect(config.ignoreFiles).toEqual(['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']);
    // SCSS rules live in an override scoped to *.scss
    const scssOverride = (config.overrides ?? []).find((o) => o.files.includes('**/*.scss'));
    expect(scssOverride?.plugins).toContain('stylelint-scss');
  });

  it('references no unknown rules across any fixture', async () => {
    for (const file of ALL_FIXTURES) {
      const info = await lintFixture(file);
      expect(info.unknownRules, `unknown rules in ${file}`).toEqual([]);
    }
  });

  it('parses every fixture without syntax errors', async () => {
    for (const file of ALL_FIXTURES) {
      const info = await lintFixture(file);
      expect(info.parseErrorCount, `parse errors in ${file}`).toBe(0);
    }
  });

  describe('index.css (plain CSS)', () => {
    it('flags stylistic + core conventions', async () => {
      const { rules } = await lintFixture('index.css');
      expect(rules).toContain('@stylistic/indentation');
      expect(rules).toContain('@stylistic/color-hex-case'); // #AAA -> lower
      expect(rules).toContain('@stylistic/declaration-colon-space-before');
      expect(rules).toContain('length-zero-no-unit'); // 0rem
      expect(rules).toContain('selector-max-id'); // #foo
      expect(rules).toContain('at-rule-no-unknown'); // @unkown
    });

    it('does not run any SCSS-only rule on CSS', async () => {
      const { rules } = await lintFixture('index.css');
      expect([...rules].some((r) => r?.startsWith('scss/'))).toBe(false);
    });
  });

  describe('sass-test.scss (SCSS)', () => {
    it('applies the scoped SCSS rules', async () => {
      const { rules } = await lintFixture('sass-test.scss');
      expect(rules).toContain('scss/at-rule-no-unknown'); // @unkown
      expect(rules).toContain('scss/double-slash-comment-whitespace-inside'); // //css注释
    });

    it('defers @-rule checking to scss/* (core at-rule-no-unknown disabled)', async () => {
      const { rules } = await lintFixture('sass-test.scss');
      expect(rules).not.toContain('at-rule-no-unknown');
    });
  });

  describe('less-test.less (Less)', () => {
    it('lints with the postcss-less parser without crashing or unknown rules', async () => {
      const info = await lintFixture('less-test.less');
      expect(info.parseErrorCount).toBe(0);
      expect(info.unknownRules).toEqual([]);
    });

    it('does not apply SCSS-only rules to Less', async () => {
      const { rules } = await lintFixture('less-test.less');
      expect([...rules].some((r) => r?.startsWith('scss/'))).toBe(false);
    });
  });

  describe('css-module.scss (CSS Modules)', () => {
    it('allows :global/:local pseudo-classes (clean file)', async () => {
      const info = await lintFixture('css-module.scss');
      expect(info.rules).not.toContain('selector-pseudo-class-no-unknown');
      expect(info.warningCount).toBe(0);
    });
  });

  describe('essential.css (deliberately broken)', () => {
    it('catches the obvious errors', async () => {
      const { rules } = await lintFixture('essential.css');
      expect(rules).toContain('color-no-invalid-hex'); // #fff1az
      expect(rules).toContain('unit-no-unknown'); // 10pixels
      expect(rules).toContain('property-no-unknown'); // colr
      expect(rules).toContain('@stylistic/no-extra-semicolons'); // ;;
    });
  });

  describe('intent options', () => {
    it('allows the rpx unit but still flags genuine unknown units', async () => {
      expect(await lintCode('.a { width: 10rpx; }')).not.toContain('unit-no-unknown');
      expect(await lintCode('.a { width: 10pixels; }')).toContain('unit-no-unknown');
    });

    it('allows :global() but still flags real unknown pseudo-classes', async () => {
      expect(await lintCode('.a :global(.x) { color: red; }')).not.toContain(
        'selector-pseudo-class-no-unknown',
      );
      expect(await lintCode('.a:nonsense { color: red; }')).toContain(
        'selector-pseudo-class-no-unknown',
      );
    });
  });
});
