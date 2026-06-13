/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  // `auto` defers to whatever line endings the file already uses, so the
  // pre-commit prettier --check passes both on Windows (CRLF working tree) and
  // on Linux runners (LF), e.g. the changesets bot's `Version Packages` commit.
  endOfLine: 'auto',
};
