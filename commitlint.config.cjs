// Root commitlint config. Uses .cjs because the root package.json is type:module
// and commitlint discovers config via cosmiconfig — .cjs avoids ESM interop quirks.
/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@linter-spec/commitlint-config'],
};
