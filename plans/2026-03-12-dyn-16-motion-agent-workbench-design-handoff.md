# DYN-16 Motion Agent Workbench Design Handoff

## Decision

Keep the current warm premium shell and replace the todo canvas with a **script and shot workbench**.

This should not become a new visual exploration. The app already has the right level of polish in `globals.css`, `ExampleLayout`, and `HeadlessChat`. The work here is to turn that shell into a pre-production workstation with clear shot structure, generation state, and preview flow.

## Why this is the right move

- DYN-15 explicitly says the shell is already premium and the next problem is workflow shape, not brand direction.
- The current split between operator rail and canvas already matches the product model: chat drives intent, canvas holds execution state.
- A literal spreadsheet will be too rigid for prompt, narration, and asset metadata. The right pattern is a **table-like stacked list** with fixed headers and expandable rows.

## Visual direction

The product should read as a calm production desk:

- warm neutral surfaces
- one green accent for action and live state
- restrained functional colors for success, warning, and failure
- dense enough for work, but still breathable

Do not add a second accent, dark neon highlights, or decorative gradients inside the workbench. Preserve the current typography and shell framing.

## Token direction

Keep the existing base tokens in `apps/app/src/app/globals.css`. Only add semantic extensions needed for the motion workflow.

### Add status tokens

```css
:root {
  --state-draft-bg: color-mix(in srgb, var(--bg-surface-muted) 74%, var(--bg-surface));
  --state-draft-text: var(--text-secondary);
  --state-draft-dot: var(--text-tertiary);

  --state-generating-bg: color-mix(in srgb, var(--accent-soft) 88%, var(--bg-surface));
  --state-generating-text: var(--accent);
  --state-generating-dot: var(--accent);

  --state-ready-bg: color-mix(in srgb, var(--success) 14%, var(--bg-surface));
  --state-ready-text: var(--success);
  --state-ready-dot: var(--success);

  --state-failed-bg: color-mix(in srgb, var(--danger) 12%, var(--bg-surface));
  --state-failed-text: var(--danger);
  --state-failed-dot: var(--danger);

  --state-stale-bg: color-mix(in srgb, var(--warning) 14%, var(--bg-surface));
  --state-stale-text: var(--warning);
  --state-stale-dot: var(--warning);

  --timeline-track: color-mix(in srgb, var(--bg-surface-muted) 88%, var(--bg-surface));
  --timeline-segment: var(--bg-surface-strong);
  --timeline-segment-active: var(--accent);
  --timeline-playhead: var(--text-primary);
  --timeline-selection: color-mix(in srgb, var(--accent) 18%, transparent);
}
```

### Usage rules

- `draft` is the default row state before generation.
- `generating` is the only state that should pulse, and only through the existing subtle dot treatment.
- `ready` means the row has a usable latest asset.
- `failed` means the latest attempt failed and needs explicit retry.
- `stale` is for previously generated media invalidated by later prompt or script edits.

## Workbench structure

### Desktop layout

Keep the current shell split:

- left rail: existing chat panel, fixed at `420px`
- right surface: motion workbench

Inside the right surface, use a second grid:

- primary column: shot table, `minmax(0, 1fr)`
- secondary column: timeline preview, `360px`
- gap: `20px`

At widths below `1280px`, shrink preview to `320px`.

At widths below `1180px`, move the preview below the shot table and keep both full width.

### Mobile-safe behavior

- Keep the top-level chat/app mode switch from the current shell.
- Inside the workbench, do not try to keep table and preview side by side.
- The shot list stays first.
- The preview becomes a collapsible section below the list.
- Each shot row becomes a stacked card with the same field order as desktop.

## Canvas information architecture

The motion canvas should have three layers:

1. `WorkbenchHeader`
2. `ShotTable`
3. `TimelinePreviewPanel`

### 1. WorkbenchHeader

Purpose: orient the user before they inspect rows.

Content:

- project title or current brief
- total shot count
- ready count
- generating count
- total estimated duration
- primary action: `Generate selected`
- secondary action: `Add shot`

Layout rules:

- title and description on the left
- counts and actions on the right
- counts use compact pills, not big stat cards
- this header stays visually lighter than the shell header above it

### 2. ShotTable

Use a sticky header plus scrollable rows. Do not use kanban columns anymore.

Recommended desktop columns:

| Column | Width | Content |
| --- | --- | --- |
| Order | 56px | drag handle, shot number |
| Script | min 260px | shot title, scene goal, narration |
| Visual | min 300px | prompt, style tags |
| Duration | 88px | seconds |
| Asset | 220px | thumbnail, provider, seed, failure text |
| Status | 120px | row state pill |
| Actions | 96px | generate, retry, menu |

Rules:

- The table header stays sticky.
- Rows can expand inline for editing.
- Default row height: `104px`.
- Expanded row height: auto, but keep the visible summary row intact.
- Row selection is checkbox-based. Selection drives batch generation and chat revision context.

### 3. TimelinePreviewPanel

Purpose: preview sequence logic, not full edit-suite control.

Panel structure:

- preview frame, fixed `16:9`
- transport row: play/pause, current time, total duration
- timeline strip with segments sized by duration
- selected shot inspector

Rules:

- The panel is sticky within the canvas column.
- Clicking a timeline segment selects the matching row.
- Clicking a row highlights the matching segment.
- Hover sync is optional. Selection sync is required.
- Do not build frame-accurate trimming in phase one.

## Shot row design

Each row is a compact work object with one persistent summary layer and one optional detail layer.

### Summary layer

Visible at all times:

- shot number
- short shot title
- scene goal, max 2 lines
- narration excerpt, max 2 lines
- prompt excerpt, max 2 lines
- style chips
- duration
- latest asset thumbnail or empty placeholder
- status pill
- primary row action

### Detail layer

Visible on expand:

- full editable scene goal field
- full editable narration field
- full editable image prompt textarea
- visual style tags
- seed, provider, model metadata
- error message or last generation timestamp
- per-row actions: `Generate`, `Retry`, `Duplicate`, `Delete`

### Interaction rules

- Clicking anywhere in the row selects it.
- Editing controls appear only on selected or expanded rows.
- Expansion should not navigate away from the table.
- The active row gets a stronger border and a faint accent wash, not a large shadow jump.

## Required row states

These are row-level states and must be mutually exclusive.

### Draft

- no usable latest asset
- primary action is `Generate`
- asset cell shows empty placeholder or stale thumbnail

### Generating

- row is locked for destructive actions
- primary action becomes disabled or `Generating`
- asset cell shows thumbnail skeleton and metadata placeholders
- subtle live dot animation is allowed

### Ready

- latest asset exists and matches current prompt/script values
- primary action becomes `Regenerate`
- asset cell shows thumbnail, provider, model, seed, and updated time

### Failed

- latest job failed
- row keeps editable fields active
- asset cell shows compact error copy plus retry action
- failure tone is contained to the pill, icon, and helper text only

## Required asset states

Asset state is separate from row state because it controls the asset cell behavior.

### Empty

- no image generated yet
- show aspect-ratio placeholder
- helper copy: `No frame yet`

### Queued

- request accepted, generation not started
- show metadata shell without progress percentage

### Rendering

- thumbnail skeleton
- provider and seed slots remain visible as placeholders
- optional thin accent loading bar at the top edge of the asset cell

### Ready

- show thumbnail
- show provider, model, seed, and timestamp in compact metadata rows
- allow open/lightbox later, but keep phase-one interaction to select/regenerate

### Failed

- thumbnail area becomes muted placeholder
- error copy stays under two lines
- `Retry` remains local to the asset cell and row action area

### Stale

- keep the previous thumbnail visible
- overlay a `Stale` badge
- row status falls back to `draft`
- `Generate` becomes the primary action again

## Chat and canvas revision flow

This is the most important product behavior. Chat should not feel detached from the table.

### Flow 1: Initial draft

1. User asks for a video concept in chat.
2. Assistant replies with a concise summary, not the whole script blob.
3. Canvas updates immediately with drafted shots.
4. A compact system banner appears above the table: `Drafted 8 shots from the latest brief`.

### Flow 2: Row-targeted revision from canvas

1. User selects one or more rows.
2. Chat rail shows selection context above the composer.
3. User types a revision request.
4. Assistant responds with what changed.
5. Changed rows receive a temporary `Updated` flash and `Edited by agent` meta label.

### Flow 3: Manual inline edit

1. User edits narration or prompt directly in the row.
2. The row gets a `Manual edit` meta tag.
3. If the row had a ready asset, that asset becomes `stale`.
4. The chat rail does not need to echo every manual field edit.

### Flow 4: Generate selected

1. User selects rows and presses `Generate selected`.
2. Only selected rows enter `generating`.
3. Timeline segments for those rows show active generation styling.
4. Completed rows become `ready` individually; do not wait for the whole batch to finish.

### Revision rules

- Chat messages should summarize applied changes in human language.
- Canvas should carry the exact state truth.
- The latest modifier should be visible per row: `Agent` or `You`.
- Do not rely on chat history alone to explain the current row state.

## Timeline preview framework

The preview panel is a synchronized navigator, not a full editor.

### Preview frame

- fixed `16:9` stage
- empty state when no ready assets exist
- active shot image fills the frame with letterboxing when needed
- narration can appear as a caption overlay toggle later, but not required for phase one

### Timeline strip

- one segment per shot
- segment width proportional to `duration`
- segment label uses shot number only
- active segment uses accent fill
- generating segment uses accent outline plus live dot
- failed segment uses danger hairline and warning icon

### Selected shot inspector

Show:

- shot title
- narration excerpt
- visual style tags
- provider, model, seed
- actions: `Select row`, `Regenerate`

Do not add deep inspector controls yet. This panel is for orientation and quick confirmation.

## Empty, loading, and error states

### Empty table

- title: this is a script workbench, not a generic board
- primary action: `Draft shots with the agent`
- secondary action: `Add first shot`

### Loading draft

- show 4 to 6 row skeletons in the table
- show the preview panel skeleton with inactive transport controls

### Empty preview

- if shots exist but no ready assets exist, say that preview activates after the first frame is ready

### Generation error

- error belongs at row level first
- only escalate to a global banner if batch generation fails for every selected row

## Component inventory

Recommended frontend components:

- `MotionWorkbench`
- `WorkbenchHeader`
- `ShotTable`
- `ShotTableHeader`
- `ShotRow`
- `ShotRowDetails`
- `ShotStatusPill`
- `ShotAssetCell`
- `SelectionContextBar`
- `RevisionBanner`
- `TimelinePreviewPanel`
- `TimelineStrip`
- `TimelineSegment`
- `SelectedShotInspector`

## Next.js implementation notes

### Preserve and replace

- keep `apps/app/src/components/example-layout/index.tsx` as the outer shell pattern
- keep `apps/app/src/components/headless-chat.tsx` as the chat foundation
- replace `apps/app/src/components/example-canvas/*` with motion-workbench components

### Recommended state shape

Use a project-first state model instead of the current todo array:

```ts
type ShotRowStatus = "draft" | "generating" | "ready" | "failed";
type AssetStatus = "empty" | "queued" | "rendering" | "ready" | "failed" | "stale";

type Shot = {
  id: string;
  index: number;
  title: string;
  goal: string;
  narration: string;
  prompt: string;
  styleTags: string[];
  durationSec: number;
  rowStatus: ShotRowStatus;
  assetStatus: AssetStatus;
  assetUrl?: string;
  provider?: string;
  model?: string;
  seed?: string;
  updatedAt?: string;
  errorMessage?: string;
  lastEditedBy?: "agent" | "user";
  selected?: boolean;
  expanded?: boolean;
};
```

### CopilotKit-specific notes

- treat row selection as first-class shared state so chat and canvas stay synchronized
- assistant messages should emit concise applied-change summaries
- generative UI blocks should be used for revision summaries and generation receipts, not decorative cards

### i18n notes

Add a dedicated `workbench` namespace in `apps/app/src/i18n/messages.ts` for:

- header labels
- shot row fields
- row states
- asset states
- timeline controls
- empty/loading/error copy

## Handoff summary for engineering

Build the first motion-agent canvas as a **shot table plus synchronized preview**, not a kanban and not a full NLE.

The key behaviors to preserve:

- chat remains the intent and revision rail
- canvas remains the source of structured truth
- rows hold both editable script data and generation status
- preview is tightly synchronized to row selection and duration order

If engineering keeps those four constraints, the phase-one workbench will feel like a real product surface instead of a demo scaffold.
