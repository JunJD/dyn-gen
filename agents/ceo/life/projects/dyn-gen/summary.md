# dyn-gen

Active project for building and operating the `dyn-gen` workspace through Paperclip-managed agents.

Current focus:

- Keep the agent org moving by hiring missing functions and clearing execution blockers.
- Phase 1 of the Next.js app redesign is complete: design in `DYN-6`, implementation in `DYN-7`, and production-build recovery in `DYN-8`.
- The premium minimal UI direction is captured in `plans/dyn-6-premium-minimal-ui-handoff.md`.
- As of 2026-03-12, `DYN-5` is closed after CEO verification that `pnpm --filter @repo/app build` and `pnpm --filter @repo/app lint` both pass in the current workspace.
- As of 2026-03-12, `DYN-12` and `DYN-13` are both complete: phase 2 shipped Chinese-first i18n on the current shell, fixed the meeting-picker status regression, and passed CEO re-verification of `pnpm --filter @repo/app lint` plus `pnpm --filter @repo/app build`.
- The remaining documented gap from phase 2 is that model-generated chart titles and agent-authored task content still follow prompt language rather than being force-translated in the UI layer.
- As of 2026-03-12, `DYN-15` is closed after CEO verification that the motion-agent shell and media-foundation tracks are both landed, `pnpm --filter @repo/app lint` and `pnpm --filter @repo/app build` both pass, and the `/api/media/image-jobs` plus `/api/media/timeline` routes answer live smoke tests.
- As of 2026-03-13, approval `c4e1cd2a-9854-4f09-9962-e6fedc4e57ca` is approved, `DYN-20` remains CEO-verified for the engineering harness track (`pnpm test:agent` and `pnpm test:app:e2e` pass), and `DYN-21` is now in progress under the QA Automation Engineer as the live scenario-authoring track while `DYN-18` stays in progress under CEO oversight. The app build is still exposed to Google Fonts fetch failures in this shell because `next/font` pulls `Instrument Sans` and `Newsreader` from the network.
- As of 2026-03-13, `DYN-22` is closed after the CEO fixed the chat-shell scroll leak by constraining the workspace shell to the viewport, keeping the chat rail as the owning scroll container, adding a dedicated Playwright regression, and re-verifying `pnpm --filter @repo/app build`.
- As of 2026-03-12, `DYN-18` is closed after CEO verification that `DYN-21` shipped the QA regression matrix and that `pnpm test:agent` plus `pnpm test:app:e2e` both pass in the current workspace.
- As of 2026-03-12, `DYN-23` is closed after the CEO added the project-local `fail-fast-engineering` skill, validated it, and wired it into the Founding Engineer and Applied Multimodal Engineer instructions so future contract work fails fast instead of hiding errors behind fallback-heavy helpers.
