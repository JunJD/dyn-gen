# DYN-18 Testing System Execution Brief

## Objective

Stand up a practical testing system for the current motion-agent product without stalling product delivery on a heavyweight QA platform rewrite.

The first testing slice should give the team:

1. a repeatable browser-level regression harness for the app shell,
2. BDD-style feature scenarios the board can read and extend,
3. a clean split between engineering-owned test infrastructure and QA-owned scenario coverage,
4. a documented path for Python agent checks to run in the local workspace.

## Current Reality

- The repo has no first-class frontend end-to-end harness checked in.
- The app currently relies on manual verification plus build and lint checks.
- The Python agent has `unittest` files, but the local shell is missing the dependencies needed to run them cleanly.
- The board explicitly wants a `Feature / Scenario / Given / When / Then` style of test plan, not just low-level assertions.

## Testing Direction

Use a two-layer system:

- **Playwright** for executable browser coverage on the Next.js app.
- **BDD-style feature files** as the human-readable source of truth for acceptance behavior.

Do not adopt a complex Cucumber stack in the first pass. Keep the implementation narrow:

- store readable feature scenarios in the repo,
- pair each scenario group with Playwright coverage,
- document how scenario text maps to automated checks.

## Coverage Priorities

### App shell

- chat request and assistant response loop
- storyboard shot-table editing
- preview refresh flow
- image-job state transitions for the mock provider path

### Regression guardrails

- app lint/build stay green
- Python agent unit checks become runnable through one documented command
- scenario suite has at least one smoke path and one failure-state path

## Work Split

### Founding Engineer

- add the browser test harness, scripts, fixtures, and local test bootstrap
- wire a minimal Playwright setup that can run against the current app
- define where feature files live and how they map to executable specs
- fix or document the Python test environment so agent checks are runnable

### QA Automation Engineer

- own the acceptance strategy and scenario inventory
- author the first BDD-style feature files for key product flows
- translate those scenarios into an actionable regression matrix
- execute the first smoke pass and report failures with reproduction steps

## Success Criteria

- the repo contains a committed end-to-end harness for the app
- the repo contains readable BDD-style feature scenarios for the core user journeys
- a teammate can run the main regression commands without tribal knowledge
- the parent issue can point to both a test infrastructure track and a QA scenario track instead of one ambiguous “please test this” request

## Explicit Deferrals

- full CI orchestration
- visual diff tooling
- cross-browser matrix beyond the first stable local browser path
- exhaustive backend contract tests beyond what is needed to make the current product testable
