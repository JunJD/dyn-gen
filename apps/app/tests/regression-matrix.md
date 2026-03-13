# App Regression Matrix

Last executed: March 13, 2026

## Coverage

| Product flow | Feature contract | Executable check | Status | Notes |
| --- | --- | --- | --- | --- |
| App shell scroll containment | None yet | `tests/e2e/app-shell.spec.ts` | Automated | Engineering-owned regression from DYN-22. The browser suite enforces it, but the flow still lacks a board-readable `.feature` contract. |
| Chat request and assistant response loop | `tests/features/storyboard-chat.feature` | `tests/e2e/storyboard-chat.spec.ts` | Expected failure | Browser can submit a prompt, but the loop currently stalls after the initial workspace-read tool call. |
| Shot-table add, reorder, delete, and duration editing | `tests/features/storyboard-workbench.feature` | `tests/e2e/storyboard-workbench.spec.ts` | Automated | Covers add-shot, rename, duration edits, row reorder, delete, and preview sync against the editable storyboard table. |
| Preview refresh flow | `tests/features/storyboard-workbench.feature` | `tests/e2e/storyboard-workbench.spec.ts` | Automated | Smoke path verifies ready-count, preview scene count, scene label, and refresh timestamp. |
| Image-job state transitions | `tests/features/storyboard-workbench.feature` | `tests/e2e/storyboard-workbench.spec.ts` | Automated | Covers queue -> failed -> reset and ready-state rendering for the mock provider contract. |

## Latest run

```bash
pnpm test:agent
pnpm test:app:e2e
```

- `test:agent`: passed
- `Feature: App shell containment / Scenario: keep viewport scrolling pinned to the chat rail`: passed
- `Feature: Storyboard workbench / Scenario: add a shot and refresh preview @smoke`: passed
- `Feature: Storyboard workbench / Scenario: mark a shot image job as failed`: passed
- `Feature: Storyboard workbench / Scenario: reset a failed image job back to idle`: passed
- `Feature: Storyboard workbench / Scenario: delete a shot and collapse the preview timeline`: passed
- `Feature: Storyboard workbench / Scenario: reorder storyboard shots and keep preview in sync`: initially failed because duplicate mobile and desktop `shot-duration-*` test IDs made the Playwright locator ambiguous; selector scoping has been tightened in the spec and the suite was rerun
- `Feature: Storyboard chat loop / Scenario: request a storyboard draft from chat @known-failure`: expected failure

## Known failure

### Chat loop stalls after the first tool call

Risk: High. The left-rail chat accepts input, but the user does not get a completed assistant response or a populated storyboard draft.

Reproduction:

1. Start the app in local dev mode on `http://127.0.0.1:3000`.
2. In the chat rail, submit `Create a 3-shot launch storyboard for a new camera bag`.
3. Wait 20 to 30 seconds.

Observed result:

- The user message renders.
- The tool reasoning line shows the workspace read (`读取工作台状态`).
- The assistant does not complete a natural-language reply.
- The workbench stays at `0` shots.

Expected result:

- The assistant replies with a first storyboard draft.
- The workbench mutates into a 3-shot editable storyboard.

## Remaining manual checks

- Mobile layout behavior for the workbench and preview stack.
- Real provider-backed image generation beyond the mock job controls.
- Cross-locale acceptance beyond the default Chinese-first shell exercised in local automation.
- A board-readable `.feature` contract for the app-shell containment regression now enforced by `tests/e2e/app-shell.spec.ts`.
