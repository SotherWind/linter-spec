import { describe, it, expect } from 'vitest';
import markdownlint from 'markdownlint';
import config from '../src/index';

function lint(strings: Record<string, string>) {
  return new Promise<markdownlint.LintResults>((resolve, reject) => {
    markdownlint({ strings, config }, (err, result) => {
      if (err) reject(err);
      else resolve(result!);
    });
  });
}

describe('@linter-spec/markdownlint-config', () => {
  it('exports a Configuration object with sensible defaults', () => {
    expect(config).toBeDefined();
    expect(config.default).toBe(true);
    expect(config['proper-names']).toBeDefined();
  });

  it('passes clean markdown', async () => {
    const result = await lint({
      good: '# Title\n\nA paragraph.\n\n- item one\n- item two\n',
    });
    expect(result.good).toEqual([]);
  });

  it('does NOT flag duplicate headings (rule disabled)', async () => {
    const result = await lint({
      dup: '# Hello\n\n## A\n\n## A\n',
    });
    expect(result.dup).toEqual([]);
  });

  it('flags incorrect ul-style (asterisk used while config expects dash)', async () => {
    const result = await lint({
      ul: '# Title\n\n* item one\n* item two\n',
    });
    const rules = (result.ul ?? []).flatMap((e) => e.ruleNames);
    expect(rules).toContain('ul-style');
  });

  it('flags trailing spaces beyond the 0-space threshold', async () => {
    const result = await lint({
      tsp: '# Title\n\nA line with two trailing spaces.  \nnext\n',
    });
    const rules = (result.tsp ?? []).flatMap((e) => e.ruleNames);
    expect(rules).toContain('no-trailing-spaces');
  });

  it('flags improper-name capitalisation (javascript)', async () => {
    const result = await lint({
      pn: '# Title\n\nWe use javascript here.\n',
    });
    const rules = (result.pn ?? []).flatMap((e) => e.ruleNames);
    expect(rules).toContain('proper-names');
  });

  it('does NOT flag inline HTML (rule disabled)', async () => {
    const result = await lint({
      html: '# Title\n\n<details><summary>X</summary>body</details>\n',
    });
    const rules = (result.html ?? []).flatMap((e) => e.ruleNames);
    expect(rules).not.toContain('no-inline-html');
  });
});
