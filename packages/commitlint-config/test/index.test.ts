import { describe, it, expect } from 'vitest';
import lint from '@commitlint/lint';
import config from '../src/index';

const rules = config.rules ?? {};
const parserPreset = config.parserPreset;

async function loadParser(): Promise<unknown> {
  if (!parserPreset) return undefined;
  const mod = await import(parserPreset as string);
  // The preset's default export is itself a Promise that resolves to the parser opts
  const preset = await (mod.default ?? mod);
  return preset?.parserOpts ?? preset;
}

describe('@linter-spec/commitlint-config', () => {
  it('exports a non-empty rules map', () => {
    expect(Object.keys(rules).length).toBeGreaterThan(0);
    expect(rules['type-enum']).toBeDefined();
    expect(rules['header-max-length']).toBeDefined();
  });

  it('passes a valid conventional commit', async () => {
    const parserOpts = await loadParser();
    const report = await lint('feat(scope): add new feature', rules, {
      parserOpts: parserOpts as Record<string, unknown> | undefined,
    });
    expect(report.valid).toBe(true);
    expect(report.errors).toHaveLength(0);
  });

  it('rejects an unknown type', async () => {
    const parserOpts = await loadParser();
    const report = await lint('wibble(scope): wrong type', rules, {
      parserOpts: parserOpts as Record<string, unknown> | undefined,
    });
    expect(report.valid).toBe(false);
    const ruleNames = report.errors.map((e) => e.name);
    expect(ruleNames).toContain('type-enum');
  });

  it('rejects a header that is too long', async () => {
    const parserOpts = await loadParser();
    const longSubject = 'a'.repeat(150);
    const report = await lint(`feat: ${longSubject}`, rules, {
      parserOpts: parserOpts as Record<string, unknown> | undefined,
    });
    expect(report.valid).toBe(false);
    const ruleNames = report.errors.map((e) => e.name);
    expect(ruleNames).toContain('header-max-length');
  });

  it('rejects upper-case scope', async () => {
    const parserOpts = await loadParser();
    const report = await lint('feat(MyScope): hello', rules, {
      parserOpts: parserOpts as Record<string, unknown> | undefined,
    });
    expect(report.valid).toBe(false);
    const ruleNames = report.errors.map((e) => e.name);
    expect(ruleNames).toContain('scope-case');
  });

  it('rejects a missing type', async () => {
    const parserOpts = await loadParser();
    const report = await lint(': nothing here', rules, {
      parserOpts: parserOpts as Record<string, unknown> | undefined,
    });
    expect(report.valid).toBe(false);
    const ruleNames = report.errors.map((e) => e.name);
    expect(ruleNames).toContain('type-empty');
  });
});
