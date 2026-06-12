# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets). Each
unreleased change is described by a markdown file here; on release they are consumed to
bump versions and update each package's `CHANGELOG.md`.

## Add a changeset for your change

```bash
pnpm changeset
```

Pick the affected packages and a bump type — `patch` (fixes), `minor` (features), or
`major` (breaking) — then write a short, user-facing summary. Commit the generated file
alongside your code.

## How a release happens

1. Pushing changesets to `main` makes the **Release** workflow open a `Version Packages`
   PR that applies the bumps and rewrites changelogs.
2. Merging that PR triggers `changeset publish`, which publishes the changed packages to
   npm and creates a git tag per package (e.g. `@linter-spec/cli@1.2.0`).

See <https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md>.
