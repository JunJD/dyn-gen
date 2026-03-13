# App Regression Harness

This app uses a deliberately small two-layer testing setup:

- `tests/features/*.feature` holds readable BDD-style acceptance scenarios.
- `tests/e2e/*.spec.ts` holds the executable Playwright coverage.
- `tests/e2e/fixtures.ts` owns the shared browser bootstrap for the workbench.

## Scenario Mapping

- `tests/features/storyboard-workbench.feature`
  maps to `tests/e2e/storyboard-workbench.spec.ts`
- `tests/features/storyboard-chat.feature`
  maps to `tests/e2e/storyboard-chat.spec.ts`
- `tests/e2e/app-shell.spec.ts`
  is an executable shell-containment regression that currently does not have a paired `.feature` contract because it is owned by the separate DYN-22 track
- `tests/regression-matrix.md`
  tracks which product flows are automated, expected-failing, or still manual

The mapping rule is intentionally simple for the first pass:

1. Keep one feature area per `.feature` file.
2. Mirror each feature area with one Playwright spec file of the same stem.
3. Keep the Playwright test titles aligned with the scenario titles.

Known current risk:

- `tests/e2e/storyboard-chat.spec.ts` is marked as an expected failure because the chat loop stalls after the first workspace-read tool call instead of returning a storyboard draft.

## Commands

From the repo root:

```bash
pnpm test:app:e2e:install
pnpm test:app:e2e
```

To run the Python agent checks that back the shared workspace contract:

```bash
pnpm test:agent
```

## Scope

This harness intentionally does not add a Cucumber runtime yet. The feature files
are the readable contract, and Playwright remains the only executable browser layer.
