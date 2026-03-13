# DYN-6 Premium Minimal UI Handoff

## Current read of the product

The current app is still visibly starter-template UI:

- `page.tsx` mounts the default `CopilotChat` beside the todo canvas with no product framing.
- `globals.css` only defines a white/black theme pair and uses Arial.
- `ExampleLayout` switches between chat and app mode, but the shell has no visual hierarchy beyond a border.
- `ExampleCanvas` uses a dotted white background that reads like a demo workspace, not a premium product surface.

The redesign should position the product as an agent operations desk, not a chatbot demo.

## Visual direction

The product should feel quiet, editorial, and operational:

- Default to a warm light theme with strong text contrast and one restrained accent.
- Treat chat and canvas as two tools inside one shared workspace, not two unrelated panes.
- Use tonal separation, hairline borders, and depth from shadow and blur instead of loud cards or heavy outlines.
- Keep the interface dense enough for work, but never cramped. Premium here means restraint and precise spacing, not decoration.

Working art direction:

- Core mood: bone, graphite, oxidized green.
- Light theme is canonical. Dark theme should mirror the same hierarchy rather than become neon or blue-heavy.
- No dotted pattern background, no generic CopilotKit chrome, no purple accents.

## Design principles

1. The shell should explain the product before the conversation does.
2. Chat is an operator rail, not the whole page.
3. Canvas surfaces should feel like work surfaces: quiet, structured, slightly elevated.
4. Status should be visible at a glance through color and labels, not motion-heavy effects.
5. Empty, loading, and error states must look designed, not like missing content.

## Token system

### Color roles

Use semantic CSS variables in `apps/app/src/app/globals.css`. Do not encode color meaning in component names.

```css
:root {
  --bg-app: #f3efe8;
  --bg-app-accent: #e9f0ed;
  --bg-panel: rgba(255, 252, 246, 0.78);
  --bg-panel-solid: #fcfaf6;
  --bg-surface: #fffdf9;
  --bg-surface-muted: #ede6da;
  --bg-surface-strong: #e4dbcd;
  --bg-inverse: #171714;

  --border-subtle: rgba(27, 24, 20, 0.08);
  --border-default: rgba(27, 24, 20, 0.14);
  --border-strong: rgba(27, 24, 20, 0.22);

  --text-primary: #1b1814;
  --text-secondary: #4e493f;
  --text-tertiary: #746d61;
  --text-inverse: #f8f4ee;

  --accent: #1f6a5a;
  --accent-hover: #175245;
  --accent-soft: #d9e9e3;
  --accent-contrast: #f3fbf8;

  --success: #2e6a4f;
  --warning: #8a6234;
  --danger: #a04d3f;
  --focus: #1f6a5a;

  --shadow-sm: 0 8px 24px rgba(17, 17, 15, 0.06);
  --shadow-md: 0 18px 48px rgba(17, 17, 15, 0.1);
  --shadow-lg: 0 28px 80px rgba(17, 17, 15, 0.14);
}

.dark {
  --bg-app: #121311;
  --bg-app-accent: #16201d;
  --bg-panel: rgba(24, 26, 23, 0.82);
  --bg-panel-solid: #181a17;
  --bg-surface: #1d201c;
  --bg-surface-muted: #252923;
  --bg-surface-strong: #2d342d;
  --bg-inverse: #f6f1e9;

  --border-subtle: rgba(244, 238, 229, 0.08);
  --border-default: rgba(244, 238, 229, 0.14);
  --border-strong: rgba(244, 238, 229, 0.22);

  --text-primary: #f3efe8;
  --text-secondary: #c9c1b4;
  --text-tertiary: #968f83;
  --text-inverse: #121311;

  --accent: #6ea996;
  --accent-hover: #88bdab;
  --accent-soft: rgba(110, 169, 150, 0.18);
  --accent-contrast: #e8f6f1;

  --success: #7bb892;
  --warning: #c59a62;
  --danger: #db8375;
  --focus: #88bdab;

  --shadow-sm: 0 12px 30px rgba(0, 0, 0, 0.22);
  --shadow-md: 0 20px 56px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 28px 84px rgba(0, 0, 0, 0.38);
}
```

Usage rules:

- `--bg-app` is page background only.
- `--bg-panel` is for the chat rail and top-level shell surfaces.
- `--bg-surface` is for cards and message bubbles.
- `--accent` is the only brand accent in phase one.
- `--danger` and `--warning` are functional only; do not use them decoratively.

### Typography

Use `next/font/google` and stop using Arial.

- Sans: `Instrument Sans` for all body, UI labels, buttons, chat content.
- Display: `Newsreader` for sparse use in page titles, empty-state headlines, and hero-level labels only.

Type scale:

| Token | Size / Line Height | Weight | Use |
| --- | --- | --- | --- |
| `--text-display` | 48 / 52 | 500 | Marketing-like page heading only |
| `--text-h1` | 32 / 38 | 600 | Main workspace title |
| `--text-h2` | 24 / 30 | 600 | Section headers |
| `--text-h3` | 18 / 24 | 600 | Column titles, panel titles |
| `--text-body` | 15 / 24 | 450 | Default body copy |
| `--text-body-strong` | 15 / 24 | 550 | Task titles, message emphasis |
| `--text-small` | 13 / 20 | 500 | Labels, pills, secondary metadata |
| `--text-micro` | 12 / 16 | 500 | Timestamps, helper text |

Rules:

- Keep letter-spacing neutral or slightly tight on headings.
- Do not use the serif face inside dense lists or chat transcripts.
- Chat composer text should use body scale, not small scale.

### Spacing

Use a 4px base scale:

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

Layout spacing rules:

- Outer shell padding: 24px desktop, 20px tablet, 12px mobile.
- Internal panel padding: 20px default, 16px compact.
- Card padding: 16px for task cards, 14px for chat bubbles.
- Vertical rhythm between stacked content should be 12px or 16px, not arbitrary gaps.

### Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 10px | Inputs, pills |
| `--radius-md` | 16px | Cards, chat composer |
| `--radius-lg` | 22px | Panels |
| `--radius-xl` | 28px | Large shell containers |
| `--radius-pill` | 999px | Segmented controls, status pills |

### Shadow

| Token | Use |
| --- | --- |
| `--shadow-sm` | Hover lift for cards and controls |
| `--shadow-md` | Resting panel elevation |
| `--shadow-lg` | Dialogs or temporary overlays only |

Rules:

- Panels get one shadow layer max.
- Cards should rely on tonal separation first, shadow second.

### Motion

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 140ms | Hover and press feedback |
| `--motion-base` | 220ms | Panel, tab, and card transitions |
| `--motion-slow` | 320ms | Large surface enter/exit only |
| `--ease-standard` | cubic-bezier(0.2, 0.8, 0.2, 1) | Default easing |

Motion rules:

- No bouncing, elastic, or attention-seeking loops.
- Agent activity can pulse opacity or icon rotation subtly while running.
- Respect `prefers-reduced-motion` by removing transform-heavy transitions.

## Layout system

### Overall shell

Replace the current undifferentiated split with a framed workspace shell.

Desktop:

- Left rail: fixed 420px width chat panel.
- Right surface: fluid canvas with a minimum useful width of 720px.
- Gap between panels: 20px.
- Shell sits inside the viewport with 24px outer padding and rounded panel corners.

Tablet:

- Left rail drops to 360px.
- Canvas remains primary and scrollable.
- If the viewport falls below comfortable split width, collapse into one visible surface at a time using the mode switch.

Mobile:

- Never show both panes side by side.
- Use a sticky top bar with product title, agent status, and a segmented surface switcher.
- Chat and canvas each occupy full width and full remaining height.

### Background treatment

Use a layered background, not a pattern:

- Base: `--bg-app`
- Soft wash: a single radial accent glow from the top-right using `--bg-app-accent`
- Optional grain: only if extremely subtle and CSS-only; skip if it adds noise or complexity

The board background should be a quiet tonal field. Remove the dotted grid.

### Panel breakdown

Chat panel:

- Header: product or workflow title, short context subtitle, agent status pill.
- Body: conversation transcript with clear message grouping and enough side padding.
- Footer: sticky composer with one primary submit action and optional helper row.

Canvas panel:

- Header: current view label, count summary, and quick actions.
- Body: task board with two columns.
- Column headers stay visible during scroll when feasible.

## Component inventory and states

### Workspace shell

- Default: glass-like panel background with subtle border.
- Mobile: top bar remains visible while content scrolls.
- Loading: fade in panels, then content.
- Error: inline banner pinned to the top edge of the active panel.

### Surface switcher

This replaces the current floating mode toggle styling.

- Default: pill container inside the shell header, not floating over content.
- Hover: active option tint deepens by 4 to 6 percent.
- Active: selected segment uses `--bg-surface` with `--shadow-sm`.
- Focus: 2px outline using `--focus`.

### Agent status pill

States:

- Idle: muted neutral.
- Thinking: accent soft background with animated dot or icon.
- Streaming: accent foreground with subtle live indicator.
- Error: danger tint with short label.

### Chat transcript

Message types:

- Assistant: surface card aligned left, max width 78 percent.
- User: inverse bubble aligned right with tighter padding.
- Tool/result: muted framed block with label and structured content area.

States:

- Loading: skeleton lines in place of the next assistant response.
- Empty: editorial empty state with one-line explanation and 2 to 3 example prompts.
- Error: inline retry row above the composer.
- Long-content: clamp by default only for tool payloads; normal messages should wrap naturally and preserve readability.

### Composer

- Default: rounded field embedded in the chat footer panel.
- Focused: stronger border plus focus ring.
- Submitting: button swaps to spinner; input remains readable.
- Disabled: reduced contrast but still legible.
- Error: helper text below field in `--danger`.

### Board column

- Default: framed column with soft surface tint, not full-bleed into the page.
- Empty: dashed or tonal placeholder with a short sentence and optional add action.
- Loading: 3 card skeletons.
- Long-content: vertical scroll inside the column without collapsing the header.

### Task card

States:

- Default: `--bg-surface`, `--border-subtle`, no harsh outlines.
- Hover: slight lift plus border emphasis.
- Active/editing: stronger border and visible focus treatment.
- Completed: reduced contrast, preserved readability, no washed-out illegibility.
- Agent-updating: soft accent halo or progress stripe, not a blocking overlay.
- Error: inline row with retry affordance.
- Long-content: title wraps to 3 lines max before expanding; description clamps to 4 lines until focused.

Card anatomy:

- Leading status control
- Title
- Description
- Optional emoji or icon chip
- Secondary actions revealed on hover and always visible on touch devices

### Buttons

Primary:

- Filled with `--accent`
- Hover darkens to `--accent-hover`
- Disabled uses `--bg-surface-strong` and `--text-tertiary`

Secondary:

- Tonal background using `--bg-surface-muted`
- Stronger border on hover

Ghost:

- Text only with subtle hover wash
- Use for non-destructive tertiary actions only

## Implementation notes for Next.js + Tailwind v4

1. Keep tokens semantic and global.
   Put the variables above in `apps/app/src/app/globals.css` under `:root` and `.dark`.

2. Replace the font setup in `apps/app/src/app/layout.tsx`.
   Load `Instrument Sans` and `Newsreader` via `next/font/google`, then attach CSS variable class names to `<body>`.

3. Stop designing around the default `CopilotChat` skin.
   The current `@copilotkit/react-core/v2/styles.css` import will fight a premium system. Phase one should move toward a custom chat shell built from CopilotKit state and primitives. The existing `HeadlessChat` file is the right direction, even though it is currently barebones.

4. Keep `ExampleLayout` as the shell seam.
   The current layout split is the right architectural seam for the redesign. Engineers should restyle and restructure it into a durable workspace shell rather than bolting more UI onto page-level markup.

5. Remove decorative starter patterns.
   The dotted board background in `ExampleCanvas` should be replaced by a tonal board surface plus clear column containers.

6. Use CSS variables directly in Tailwind classes when needed.
   Example: `bg-[var(--bg-panel)]`, `text-[var(--text-secondary)]`, `border-[color:var(--border-default)]`.

7. Ship light theme first, then mirror it carefully in dark.
   The light theme is the reference design. Dark mode should follow the same semantic roles and spacing, not invent a second visual language.

8. Preserve comfortable reading widths.
   Chat transcript content should never exceed roughly 72 to 78 characters per line in normal usage. Canvas cards should prioritize scanability over density.

## Suggested engineering sequence

1. Replace global tokens and fonts.
2. Rebuild `ExampleLayout` into the new shell and header structure.
3. Replace the floating mode toggle with an in-shell segmented control.
4. Restyle the canvas, columns, and cards to match the token system.
5. Replace or fully skin the default chat UI so chat and canvas feel like one product.

## Decision summary for handoff

- Use a warm-neutral, editorial operations aesthetic rather than default chatbot chrome.
- Keep one restrained green accent and disciplined semantic neutrals.
- Make the desktop experience a true dual-pane workspace; collapse to single-pane on smaller screens.
- Treat empty, loading, error, and long-content states as first-class surfaces.
- Use CopilotKit for behavior, not for the final visual language.
