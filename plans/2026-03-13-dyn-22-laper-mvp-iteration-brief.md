# DYN-22 Laper MVP Iteration Brief

## Goal

Turn the current app into a usable laper.ai-quality MVP by tightening the product framing, reducing demo-like UI behavior, and fixing the shell so the chat surface scrolls inside its own panel instead of pulling the whole viewport.

## Current Read

- The app already has a solid premium base in `apps/app/src/app/globals.css`, `apps/app/src/components/example-layout/index.tsx`, `apps/app/src/components/headless-chat.tsx`, and `apps/app/src/components/example-canvas/index.tsx`.
- The current product model is correct: chat is the operator rail and the workbench is the execution surface.
- This is not a blank-slate redesign. The work is MVP hardening and product framing.
- The biggest visible usability gap is scroll containment. The top-level shell still uses `min-h-*` viewport sizing, so long chat content can compete with page-level scroll instead of staying inside the rail.
- The shell copy still reads more like an internal storyboard tool than a productized MVP.
- There are no repo-local laper.ai brand assets or a separate token system yet, so this iteration should evolve the current warm-neutral system instead of inventing a new visual identity from scratch.

## Product Direction

- Keep the dual-surface model: chat rail on the left, workbench on the right, mode switch for smaller screens.
- Make the shell read like a product tool immediately, not a hero page or starter template.
- Favor denser, calmer framing over bigger headlines.
- Preserve the current warm-neutral palette and restrained green accent unless the design track finds a very small adjustment that improves clarity.
- Do not reopen the broader "precision console" reset from `plans/dyn-10-design-language-reset.md` unless leadership explicitly asks for that direction again.

## Required UX Changes

### 1. Scroll Containment

- Desktop and mobile shells should fill the viewport during normal use.
- The main page should not become the primary scroll container for chat usage.
- The chat panel should keep:
  - a fixed panel header
  - a transcript area with internal vertical scroll
  - a composer pinned to the bottom of the panel
- The workbench surface should also scroll internally when its content exceeds the viewport.
- On mobile, only the active surface should scroll. Switching between chat and workbench should not create page-jump behavior.

### 2. MVP Framing

- Reduce the current shell's "hero" feeling.
- Tighten the top header height and copy density.
- Replace obviously internal/starter-feeling language with neutral product-facing MVP copy.
- Keep empty states useful and directive so a first-time user knows what to do next.

### 3. Interaction Polish

- Make the chat rail feel like a focused operating surface rather than a generic conversation pane.
- Keep live status visible, but do not add louder motion or extra accent colors.
- Maintain the existing shared-state model between chat and workbench.

## Execution Split

### Design Track

Owner: Senior UI/UX Designer

Deliver:

- an iteration-specific handoff for the laper.ai MVP shell
- updated copy direction for the shell and empty states
- explicit layout notes for desktop and mobile scroll behavior
- component-state notes for chat rail, mode switch, header density, and first-use experience

### Engineering Track

Owner: Founding Engineer

Deliver:

- a concrete fix for the chat/viewport scroll conflict in the current Next.js app
- shell/layout updates needed to make the MVP framing land without waiting for a bigger rewrite
- regression coverage for the scroll behavior if it can be captured cleanly in the existing Playwright harness

## Acceptance Criteria

- At desktop width, a long chat transcript scrolls inside the chat rail without moving the page viewport.
- At mobile width, the active surface scrolls internally and the viewport does not drift with chat content.
- The chat header and composer remain visible while the transcript scrolls.
- The workbench remains usable and scrollable after the shell sizing changes.
- The app no longer reads like a starter template or internal-only demo in its top-level framing and empty states.
- Existing app regression checks remain green, and any new scroll regression should be covered if practical.

## Non-Goals

- No new brand system from scratch.
- No product-model reset away from the current motion workspace.
- No broad backend or agent-behavior changes under this issue unless they are required to keep the MVP usable.
