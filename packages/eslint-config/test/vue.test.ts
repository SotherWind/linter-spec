import { describe, it, expect } from 'vitest';

import vueConfig from '../src/configs/vue.js';

import { runLint } from './helpers/run-lint.js';

describe('@linter-spec/eslint-config/vue', () => {
  it('exports a non-empty flat-config array', () => {
    expect(vueConfig.length).toBeGreaterThan(0);
  });

  it('lints a basic .vue file without fatal errors', async () => {
    const code = `<template>
  <div>hello {{ name }}</div>
</template>

<script setup>
const name = 'demo';
</script>
`;
    const result = await runLint(vueConfig, code, 'demo.vue');
    expect(result.fatalCount).toBe(0);
  });
});
