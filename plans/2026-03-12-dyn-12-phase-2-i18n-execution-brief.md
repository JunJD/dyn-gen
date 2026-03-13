# DYN-12 Phase 2 Execution Brief

## Goal

Ship Chinese-first i18n for the Next.js app, keep English as a secondary locale, and fix any discrete legacy regressions uncovered in the same surface area without reopening unrelated redesign work.

## Current Baseline

- Verified on 2026-03-12 that `pnpm --filter @repo/app lint` passes.
- Verified on 2026-03-12 that `pnpm --filter @repo/app build` passes.
- The current app is still English-first across the shell, chat rail, canvas, suggestions, chart empty states, and meeting picker flows.
- `DYN-11` remains a separate backlog item for the design-language reset and is not part of this execution brief unless the board reprioritizes it explicitly.

## Required Scope

1. Add an app-level i18n structure with `zh-CN` as the default locale and `en` as the secondary locale.
2. Replace hard-coded user-facing copy in the current app shell:
   - `apps/app/src/app/layout.tsx`
   - `apps/app/src/components/example-layout/index.tsx`
   - `apps/app/src/components/example-layout/mode-toggle.tsx`
   - `apps/app/src/components/headless-chat.tsx`
   - `apps/app/src/components/example-canvas/index.tsx`
   - `apps/app/src/components/example-canvas/todo-card.tsx`
   - `apps/app/src/components/example-canvas/todo-column.tsx`
   - `apps/app/src/components/example-canvas/todo-list.tsx`
   - `apps/app/src/hooks/use-example-suggestions.tsx`
   - `apps/app/src/components/generative-ui/charts/bar-chart.tsx`
   - `apps/app/src/components/generative-ui/charts/pie-chart.tsx`
   - `apps/app/src/components/generative-ui/meeting-time-picker.tsx`
3. Update document-level locale metadata such as `<html lang>` so the default rendered experience is Chinese.
4. Preserve the current interaction model and visual direction. This is not a redesign task.
5. Fix discrete legacy bugs found while implementing the above if they are in the same product path and can be resolved inside this pass.

## Boundaries

- Do not fold `DYN-11` into this task.
- Do not rewrite the agent architecture.
- Do not broaden "legacy bugs" into an open-ended cleanup. If a bug is material but out of scope, document it and escalate instead of stalling the delivery.

## Suggested Implementation Shape

- Use a small locale dictionary layer or another lightweight Next.js-compatible i18n setup that keeps the codebase simple.
- Centralize copy instead of scattering translated literals across components.
- Keep the locale mechanism compatible with the existing CopilotKit shell and app-router structure.
- Add a language switcher only if it is low-cost and does not destabilize the shell. Default-Chinese support is mandatory; locale switching is optional.

## Acceptance Criteria

- Chinese is the default user-facing language on first render.
- English strings that are currently visible in the main UI are either localized or intentionally documented as deferred.
- `pnpm --filter @repo/app lint` passes.
- `pnpm --filter @repo/app build` passes.
- The implementation summary calls out:
  - i18n architecture choice
  - which strings/surfaces were localized
  - which legacy bugs were fixed
  - any deliberate deferrals or follow-up issues
