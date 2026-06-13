import type { Linter } from 'eslint';
import vue from 'eslint-plugin-vue';

/**
 * Vue 3 rules via eslint-plugin-vue@9's flat-config preset.
 */
const flatVue = (vue.configs?.['flat/recommended'] as Linter.Config[] | undefined) ?? [];

const vueConfig: Linter.Config[] = [
  ...flatVue,
  {
    name: '@linter-spec/vue',
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'off',
    },
  },
];

export default vueConfig;
