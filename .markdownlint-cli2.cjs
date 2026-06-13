// markdownlint-cli2 config. Uses .cjs (not .jsonc/.mjs) for two reasons:
//   1. markdownlint core's `extends` only resolves JSON/YAML files by path and
//      cannot load a JS config package, so the shared rule set is inlined here.
//   2. markdownlint-cli2's require path returns the un-unwrapped ES module
//      namespace for an .mjs options file under Node's require(esm); a .cjs is
//      unambiguously CommonJS, so we control unwrapping of the ESM-only package.
const config = require('@linter-spec/markdownlint-config').default;

module.exports = {
  config,
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    'docs/.vitepress/**',
    // Tooling-generated changelogs (root + per-package, written by changesets).
    '**/CHANGELOG.md',
    // Changeset files are tooling-managed (frontmatter + short summary), not prose.
    '.changeset/**',
  ],
};
