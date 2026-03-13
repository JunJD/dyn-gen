# DYN-15 Motion Agent Execution Brief

## Objective

Turn the current CopilotKit + LangGraph todo demo into a first real motion-agent vertical slice without trying to solve the entire video stack in one jump.

The first shipped slice should let a user:

1. ask for a video concept,
2. receive an editable shot/script table,
3. generate shot images with prompt + seed tracking,
4. preview a minimal timeline composition,
5. leave audio/TTS as an explicit follow-on once the image pipeline is stable.

## Current Reality

- The repository is still a todo-oriented CopilotKit/LangGraph template.
- The frontend already has a premium shell and Chinese-first locale support.
- There is no media pipeline yet: no image provider abstraction, no timeline schema, no Remotion integration, and no TTS path.
- The current team has one designer and one generalist engineer. That is enough for UX and app integration, but not enough to own the multimodal generation layer cleanly.

## Product Direction

The motion agent should behave like a lightweight pre-production workstation:

- Chat drives intent and revisions.
- The main canvas becomes a shot/script editor rather than a todo board.
- Each row represents a shot with fields like scene goal, narration, image prompt, visual style, duration, status, and generated asset references.
- Generated media should be reproducible. Every image job stores provider, prompt, seed, model, and output metadata.
- Timeline preview should use a small catalog of reusable scene components instead of bespoke React for every output.

## Phase Plan

### Phase 1: Script and Shot Workbench

- Replace the todo-state mental model with a project -> script -> shots state model.
- Let the agent draft a shot table from a user request.
- Make the table editable by the user in the app canvas.
- Add row-level statuses for draft, generating, ready, failed.

### Phase 2: Image Generation Foundation

- Add a provider abstraction behind app routes so the UI and agent do not depend on a single model vendor.
- Start with prompt-to-image generation plus seed capture and asset metadata persistence.
- Keep storage local/simple for now: structured manifests in the repo or another lightweight local persistence layer is acceptable for this phase.

### Phase 3: Timeline Preview Foundation

- Introduce `@json-render/remotion` and a minimal timeline schema.
- Keep the first component catalog intentionally small: title card, narration card, image scene, caption/lower-third overlay.
- Ship preview before worrying about a full production export queue.

### Phase 4: Audio Decision

- TTS is a bounded research task, not a blocker for the first visual slice.
- The team should compare a small number of providers, define what metadata must be stored, and only then wire one provider into the pipeline.

## Staffing Decision

Keep the existing team on product shell + app integration. Add one specialist hire now:

- **Applied Multimodal Engineer**
  Own the media generation layer: image provider adapters, prompt normalization, seed/reproducibility rules, asset manifests, timeline handoff contracts, and the first TTS recommendation.

Do not hire more roles yet. A second specialist only makes sense after the first vertical slice exposes a real bottleneck.

## Work Split

### Senior UI/UX Designer

- Define the shot-table workbench UX.
- Specify row states, asset states, generation affordances, preview layout, and revision flows.
- Hand off implementation-ready states for desktop first, mobile-safe second.

### Founding Engineer

- Refactor the app and LangGraph state from todos to script/shots.
- Implement the editable workbench shell in the current Next.js app.
- Wire the first agent workflow for script generation and revision.
- Integrate the media job contract and preview shell without waiting for final TTS.

### Applied Multimodal Engineer

- Design the provider abstraction for image generation.
- Implement prompt + seed capture, output manifests, and media-job contracts.
- Stand up the first `@json-render/remotion` timeline adapter and minimal component catalog.
- Run the initial TTS spike and recommend one provider with explicit tradeoffs.

## Sequencing

1. Designer defines the workbench and shot lifecycle.
2. Founding Engineer replaces todo-state with script/shot-state and lands the editable shell.
3. Applied Multimodal Engineer builds the media pipeline contract and preview-layer foundation in parallel once hired.
4. CEO keeps the parent issue open until design handoff, shell integration, and media-pipeline staffing are all concrete.

## Explicit Deferrals

- Full render farm / background job orchestration
- Large custom component catalogs
- Voice cloning or advanced audio editing
- Multi-project persistence and collaboration features
- Provider-specific lock-in before the abstraction is proven

## Success Criteria

- A user can go from prompt -> editable shot table -> image generation requests -> minimal timeline preview in the current app.
- The system records enough metadata to reproduce image outputs.
- The codebase has a clear split between app-shell logic and multimodal provider logic.
- Audio remains optional, but the team has a documented recommendation instead of an open-ended question.
