import { describe, it, expect } from 'vitest';

import plugin from '../src/index.js';

describe('@linter-spec/eslint-plugin', () => {
  it('exposes meta with name and version', () => {
    expect(plugin.meta).toBeDefined();
    expect(plugin.meta?.name).toBe('@linter-spec/eslint-plugin');
    expect(typeof plugin.meta?.version).toBe('string');
  });

  it('exposes 4 rules', () => {
    expect(plugin.rules).toBeDefined();
    expect(Object.keys(plugin.rules ?? {}).sort()).toEqual([
      'no-broad-semantic-versioning',
      'no-http-url',
      'no-js-in-ts-project',
      'no-secret-info',
    ]);
  });

  it('exposes a flat-config recommended array', () => {
    expect(plugin.configs).toBeDefined();
    const recommended = plugin.configs?.recommended;
    expect(Array.isArray(recommended)).toBe(true);
    const config = (recommended as readonly unknown[])[0] as {
      plugins: Record<string, unknown>;
      rules: Record<string, unknown>;
    };
    expect(config.plugins['@linter-spec']).toBe(plugin);
    expect(config.rules['@linter-spec/no-http-url']).toBe('warn');
    expect(config.rules['@linter-spec/no-secret-info']).toBe('error');
  });
});
