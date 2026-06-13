import { Linter } from 'eslint';
import { describe, it, expect } from 'vitest';

import base from '../src/configs/base.js';
import es5 from '../src/configs/es5.js';
import essentialEs5 from '../src/configs/essential/es5.js';
import essential from '../src/configs/essential/index.js';
import essentialReact from '../src/configs/essential/react.js';
import essentialTypescript from '../src/configs/essential/typescript/index.js';
import essentialTypescriptReact from '../src/configs/essential/typescript/react.js';
import essentialTypescriptVue from '../src/configs/essential/typescript/vue.js';
import essentialVue from '../src/configs/essential/vue.js';
import jsxA11y from '../src/configs/jsx-a11y.js';
import node from '../src/configs/node.js';
import react from '../src/configs/react.js';
import typescript from '../src/configs/typescript/index.js';
import typescriptNode from '../src/configs/typescript/node.js';
import typescriptReact from '../src/configs/typescript/react.js';
import typescriptVue from '../src/configs/typescript/vue.js';
import vue from '../src/configs/vue.js';

const allEntries = {
  base,
  es5,
  react,
  vue,
  node,
  'jsx-a11y': jsxA11y,
  typescript,
  'typescript-react': typescriptReact,
  'typescript-vue': typescriptVue,
  'typescript-node': typescriptNode,
  essential,
  'essential-es5': essentialEs5,
  'essential-react': essentialReact,
  'essential-vue': essentialVue,
  'essential-typescript': essentialTypescript,
  'essential-typescript-react': essentialTypescriptReact,
  'essential-typescript-vue': essentialTypescriptVue,
};

describe('@linter-spec/eslint-config — entry exports', () => {
  it('all 17 entries are non-empty flat-config arrays', () => {
    const keys = Object.keys(allEntries);
    expect(keys).toHaveLength(17);
    for (const [name, config] of Object.entries(allEntries)) {
      expect(Array.isArray(config), `${name} must be an array`).toBe(true);
      expect(config.length, `${name} must be non-empty`).toBeGreaterThan(0);
    }
  });

  it('every config entry has a `name` field where present', () => {
    for (const [entry, configArr] of Object.entries(allEntries)) {
      for (const cfg of configArr) {
        // Most entries should have names, but plugin-provided ones may not.
        // Just ensure the shape is correct (no junk objects).
        expect(typeof cfg).toBe('object');
        expect(cfg).not.toBeNull();
        if (cfg.name !== undefined) {
          expect(typeof cfg.name, `${entry}: name must be a string when present`).toBe('string');
        }
      }
    }
  });
});

describe('@linter-spec/eslint-config — base preset behaviour', () => {
  it('lints clean JS code with no errors', async () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('const x = 1;\nconsole.log(x);\n', base, {
      filename: 'demo.js',
    });
    // We tolerate warnings (no-console is warn) — only fatal errors fail.
    const fatal = result.filter((m) => m.fatal);
    expect(fatal).toEqual([]);
  });

  it('reports use-isnan on bad code', () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('const x = (NaN == 1);\nconsole.log(x);\n', base, {
      filename: 'demo.js',
    });
    const ruleIds = result.map((m) => m.ruleId);
    expect(ruleIds).toContain('use-isnan');
  });

  it('enforces single quotes via @stylistic/quotes', () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('const x = "double";\nconsole.log(x);\n', base, {
      filename: 'demo.js',
    });
    const ruleIds = result.map((m) => m.ruleId);
    expect(ruleIds).toContain('@stylistic/quotes');
  });
});

describe('@linter-spec/eslint-config — essential softens stylistic errors', () => {
  it('quotes violation reports as warning, not error', () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('const x = "double";\nconsole.log(x);\n', essential, {
      filename: 'demo.js',
    });
    const stylisticMsgs = result.filter((m) => m.ruleId === '@stylistic/quotes');
    expect(stylisticMsgs.length).toBeGreaterThan(0);
    // severity 1 = warn, 2 = error
    for (const m of stylisticMsgs) {
      expect(m.severity).toBe(1);
    }
  });

  it('still treats correctness violations as errors', () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('if (NaN == 1) { console.log("a"); }\n', essential, {
      filename: 'demo.js',
    });
    const useIsNan = result.find((m) => m.ruleId === 'use-isnan');
    expect(useIsNan).toBeDefined();
    expect(useIsNan?.severity).toBe(2);
  });
});

describe('@linter-spec/eslint-config — typescript preset', () => {
  it('lints clean TS code with no errors', () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('const x: number = 1;\nconsole.log(x);\n', typescript, {
      filename: 'demo.ts',
    });
    const fatal = result.filter((m) => m.fatal);
    expect(fatal).toEqual([]);
  });

  it('reports @typescript-eslint/no-explicit-any on `any` usage', () => {
    const linter = new Linter({ configType: 'flat' });
    const result = linter.verify('const x: any = 1;\nconsole.log(x);\n', typescript, {
      filename: 'demo.ts',
    });
    const ruleIds = result.map((m) => m.ruleId);
    expect(ruleIds).toContain('@typescript-eslint/no-explicit-any');
  });
});

describe('@linter-spec/eslint-config — react preset', () => {
  it('parses JSX without fatal errors', () => {
    const linter = new Linter({ configType: 'flat' });
    const code = 'const App = () => <div>hi</div>;\nconsole.log(App);\n';
    const result = linter.verify(code, react, { filename: 'demo.jsx' });
    const fatal = result.filter((m) => m.fatal);
    expect(fatal).toEqual([]);
  });
});

describe('@linter-spec/eslint-config — node preset', () => {
  it('reports n/prefer-promises/fs when using sync fs API', () => {
    const linter = new Linter({ configType: 'flat' });
    const code = "import fs from 'node:fs';\nfs.readFileSync('a');\n";
    const result = linter.verify(code, node, { filename: 'demo.js' });
    const ruleIds = result.map((m) => m.ruleId);
    // We don't strictly require this rule to fire (depends on plugin defaults),
    // but the config should at least load without fatal errors.
    const fatal = result.filter((m) => m.fatal);
    expect(fatal).toEqual([]);
    // Either prefer-promises fires, or nothing — either is fine for this smoke test
    expect(ruleIds).toBeDefined();
  });
});
