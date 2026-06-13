import { defineConfig, mergeConfig } from 'vitest/config';

import shared from '../../vitest.shared';

export default mergeConfig(
  shared,
  defineConfig({
    test: {
      // Spawning the built CLI / running ESLint over fixtures is slow.
      testTimeout: 60_000,
      hookTimeout: 60_000,
      server: {
        deps: {
          // Treat our own built bundle as external so it loads via Node's native
          // ESM resolver instead of Vite's SSR transform — which in vitest 2.x
          // (Vite 5) rewrites `import.meta` to a shim that doesn't carry
          // `.resolve`. src/lints/stylelint/get-config.ts relies on
          // `import.meta.resolve('@linter-spec/stylelint-config')`.
          external: [/[\\/]packages[\\/]cli[\\/]dist[\\/]/],
        },
      },
    },
  }),
);
