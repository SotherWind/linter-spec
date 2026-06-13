import { describe, it, expect } from 'vitest';

import tsNode from '../src/configs/typescript/node.js';
import tsReact from '../src/configs/typescript/react.js';
import tsVue from '../src/configs/typescript/vue.js';

describe('@linter-spec/eslint-config/typescript/* combo configs', () => {
  it('typescript/react exports a flat-config array', () => {
    expect(Array.isArray(tsReact)).toBe(true);
    expect(tsReact.length).toBeGreaterThan(0);
  });

  it('typescript/vue exports a flat-config array', () => {
    expect(Array.isArray(tsVue)).toBe(true);
    expect(tsVue.length).toBeGreaterThan(0);
  });

  it('typescript/node exports a flat-config array', () => {
    expect(Array.isArray(tsNode)).toBe(true);
    expect(tsNode.length).toBeGreaterThan(0);
  });
});
