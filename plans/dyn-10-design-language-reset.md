# DYN-10 Design Language Reset

## Decision

Drop the current editorial / gallery styling and reset the product to a **precision operations console**.

This product is not a lifestyle workspace and not a chatbot demo. It is an agent control surface. The UI should read as:

- precise
- sober
- high-signal
- premium through restraint, not softness

## Why the current direction is not landing

The existing redesign is internally consistent, but the visual language is still ambiguous:

- The serif headline and large hero copy read like publishing or portfolio UI, not agent operations software.
- The warm bone palette plus blur-glass panels make the shell feel atmospheric instead of controlled.
- Emoji-first task cards introduce a playful tone that weakens trust in the operational surface.
- The top area behaves like a landing-page hero, while the product itself is a work tool.

The result is "styled" but not clearly "product". Leadership is reacting to that ambiguity, not to a lack of polish.

## New visual direction

### Working name

**Precision console**

### Core mood

- quiet neutral base
- crisp hierarchy
- compact utility chrome
- one restrained teal accent

### Reference behavior

Think premium control plane, not editorial SaaS:

- tighter headers
- smaller radii
- solid panels instead of glass
- data-facing metadata rows
- mono treatment for counts, timestamps, and status

### Anti-direction

Do not carry these forward:

- serif display headlines
- oversized hero copy
- cream-and-glass atmosphere
- playful emoji-led hierarchy
- decorative gradients inside core work surfaces

## Token system

Define the system in `apps/app/src/app/globals.css` using semantic tokens only.

### Color

```css
:root {
  --bg-app: #eef2f4;
  --bg-canvas: #f7f9fa;
  --bg-panel: #ffffff;
  --bg-panel-muted: #f2f5f6;
  --bg-panel-strong: #e5eaed;
  --bg-panel-inverse: #11161a;

  --border-subtle: rgba(17, 22, 26, 0.08);
  --border-default: rgba(17, 22, 26, 0.14);
  --border-strong: rgba(17, 22, 26, 0.22);

  --text-primary: #11161a;
  --text-secondary: #44515d;
  --text-tertiary: #6a7681;
  --text-inverse: #f6f8f9;

  --accent: #0f766e;
  --accent-hover: #0c5f59;
  --accent-soft: #d7efeb;
  --accent-contrast: #f3fffd;

  --success: #1e7a50;
  --warning: #9a6a1c;
  --danger: #bf4c37;
  --focus: #0f766e;

  --shadow-sm: 0 6px 18px rgba(14, 20, 24, 0.06);
  --shadow-md: 0 14px 36px rgba(14, 20, 24, 0.08);
  --shadow-lg: 0 24px 60px rgba(14, 20, 24, 0.12);
}

.dark {
  --bg-app: #0c1114;
  --bg-canvas: #11171b;
  --bg-panel: #171d22;
  --bg-panel-muted: #1d252b;
  --bg-panel-strong: #27313a;
  --bg-panel-inverse: #f4f7f8;

  --border-subtle: rgba(244, 247, 248, 0.08);
  --border-default: rgba(244, 247, 248, 0.14);
  --border-strong: rgba(244, 247, 248, 0.22);

  --text-primary: #f4f7f8;
  --text-secondary: #c3ccd3;
  --text-tertiary: #8a96a1;
  --text-inverse: #0c1114;

  --accent: #4fb3a7;
  --accent-hover: #69c6bb;
  --accent-soft: rgba(79, 179, 167, 0.16);
  --accent-contrast: #061816;

  --success: #59b382;
  --warning: #d6a457;
  --danger: #ea836d;
  --focus: #69c6bb;

  --shadow-sm: 0 10px 24px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 18px 42px rgba(0, 0, 0, 0.28);
  --shadow-lg: 0 28px 72px rgba(0, 0, 0, 0.36);
}
```

Rules:

- `--bg-app` is the viewport background only.
- `--bg-canvas` is the shell background behind panels and board regions.
- `--bg-panel` is the default solid panel fill.
- Use `--accent` for focus, active state, and the primary action only.
- Success, warning, and danger are functional states only.

### Typography

Keep typography explicit and technical.

- Primary sans: `Instrument Sans`
- Secondary mono: `IBM Plex Mono`
- Remove the serif display face completely

Type scale:

| Token | Size / Line Height | Weight | Use |
| --- | --- | --- | --- |
| `--text-h1` | 28 / 32 | 600 | Workspace title in the top bar |
| `--text-h2` | 20 / 26 | 600 | Panel headers |
| `--text-h3` | 16 / 22 | 600 | Column titles, card titles |
| `--text-body` | 14 / 22 | 450 | Default body copy |
| `--text-body-strong` | 14 / 22 | 550 | Assistant emphasis, action labels |
| `--text-small` | 12 / 18 | 500 | Labels, helper text |
| `--text-micro` | 11 / 16 | 500 | Status, timestamps, counters |
| `--text-mono` | 12 / 18 | 500 | Counts, run state, metadata |

Rules:

- Titles should be compact, not theatrical.
- Use mono selectively for operational metadata only.
- Do not use all caps for large headlines. Reserve uppercase for micro labels.

### Spacing

Stay on a 4px base scale:

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

Layout rules:

- Outer shell padding: 20px desktop, 16px tablet, 12px mobile
- Panel header padding: 16px
- Panel body padding: 16px
- Card padding: 14px to 16px
- Vertical rhythm: prefer 8px, 12px, or 16px only

### Radius

Reduce softness. The current 24px to 28px system is too lounge-like.

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 8px | Inputs, inline pills |
| `--radius-md` | 12px | Message bubbles, compact cards |
| `--radius-lg` | 16px | Panels, composer |
| `--radius-xl` | 20px | Outer shell only |
| `--radius-pill` | 999px | Segmented controls, status pills |

### Shadow

Shadows should support layering, not mood.

| Token | Use |
| --- | --- |
| `--shadow-sm` | Hover lift or inline overlays |
| `--shadow-md` | Resting elevation for main panels |
| `--shadow-lg` | Menus and transient popovers only |

Rules:

- Prefer border plus tonal separation before adding shadow.
- Remove panel blur from the default shell.

### Motion

```css
--motion-fast: 120ms;
--motion-base: 180ms;
--motion-slow: 260ms;
--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
```

Rules:

- No ambient pulsing except for a tiny active status dot.
- No large translate animations on content blocks.
- Respect `prefers-reduced-motion`.

## Layout system

### Global shell

Replace the current hero-like header with a compact control bar.

Desktop:

- Top bar height: 72px
- Left rail: 384px fixed width
- Right surface: fluid, min 720px useful width
- Gap between surfaces: 16px

Tablet:

- Left rail: 320px
- Keep a single-row top bar if possible
- Collapse to one visible surface only when split width becomes cramped

Mobile:

- One surface visible at a time
- Sticky top bar with title, status, theme, and surface switcher
- Chat and task board both fill remaining height

### Background treatment

- Use a clean app field from `--bg-app`
- Allow one subtle top-edge gradient wash only
- No visible glassmorphism and no atmospheric radial glows inside panels

### Header breakdown

The header should contain:

- product title
- current workspace label
- live status pill
- theme toggle
- segmented switch between `Chat` and `Board`

Do not include:

- marketing headline
- descriptive hero paragraph
- decorative support copy above the fold

### Panel model

Chat rail:

- solid panel
- compact title row
- thin context strip for project / agent / sync state
- transcript body
- sticky composer footer

Board surface:

- compact utility header
- summary counts in mono or tabular figures
- primary action at the right edge
- scrollable columns below

## Component inventory and states

### Workspace header

States:

- idle
- running
- syncing
- error

Rules:

- Status pill uses accent only when active
- Error uses danger outline plus icon, never a full red header
- Surface switcher remains visible on all breakpoints

### Surface switcher

Tabs:

- `Chat`
- `Board`

States:

- default
- hover
- active
- focus-visible
- disabled

Rule:

- Active state is a filled neutral or accent-soft pill, not a shadow-heavy chip

### Chat transcript

Use chat as an operator tool, not a marketing demo.

States:

- empty
- loading
- streaming
- complete
- error
- long-content

Rules:

- Empty state headline should be task-oriented, for example "Start an agent run"
- Keep suggestion chips operational, not aspirational
- Tool output blocks should look like embedded system cards, not detached demos

### Composer

Rules:

- Min height 52px
- Max auto-grow height around 140px before internal scroll
- Primary send button sits at the lower right
- Helper text can show keyboard or scope hints in micro copy

States:

- default
- focus
- disabled
- sending
- error

### Board header

Rules:

- Replace the current narrative intro with a compact utility bar
- Counts use mono numerals
- Keep the primary action on the same row as summary data at desktop sizes

### Task columns

States:

- populated
- empty
- loading
- blocked

Rules:

- Column headers stay visible while scrolling
- Count badges are muted and data-like
- Empty states should suggest next action in one sentence max

### Task card

The card needs the biggest tonal correction.

States:

- default
- hover
- focus
- editing
- syncing
- completed
- destructive-confirm

Rules:

- De-emphasize emoji to a small optional secondary marker
- Lead with title, status, and actionability
- Metadata and secondary actions can sit in a lower row
- Completed state should reduce contrast, not turn decorative
- Editing state should use a precise outline, not a glowing ring

## Copy direction

Current copy is too cinematic for the product.

Use:

- direct labels
- short operational nouns
- precise helper text

Avoid:

- "Operations desk"
- "shared shell"
- other phrases that sound like concept copy rather than product language

Preferred examples:

- `Agent Console`
- `Run Status`
- `Task Board`
- `Last Sync`
- `Active Agent`

## Implementation notes for the current Next.js frontend

### `apps/app/src/app/layout.tsx`

- Keep `Instrument Sans`
- Add `IBM Plex Mono`
- Remove `Newsreader`
- Expose mono font variable for metadata usage

### `apps/app/src/app/globals.css`

- Replace the warm editorial token set with the precision-console token set above
- Remove default panel blur as the base visual treatment
- Tighten radii and shadows
- Add a mono utility class
- Add reduced-motion handling for status and skeleton effects

### `apps/app/src/components/example-layout/index.tsx`

- Replace the large hero header with a compact top control bar
- Reduce the left rail width from the current 420px feel to 384px
- Keep theme toggle and mode toggle, but merge them into one tighter utility row
- Move descriptive context into a small metadata strip instead of a hero paragraph

### `apps/app/src/components/headless-chat.tsx`

- Rewrite the empty state to look like an operator starting point
- Tighten bubble spacing and reduce decorative framing
- Style tool outputs as integrated panel modules
- Make the composer feel like control chrome, not a soft card

### `apps/app/src/components/example-canvas/index.tsx`

- Replace the narrative section header with a compact board utility header
- Align summary pills to data counters
- Keep one clear primary action

### `apps/app/src/components/example-canvas/todo-column.tsx`

- Keep sticky headers
- Tighten padding and radius
- Use stronger separation between header chrome and card list
- Make empty and loading states shorter and more matter-of-fact

### `apps/app/src/components/example-canvas/todo-card.tsx`

- Reduce emoji prominence immediately
- Move card hierarchy to: status, title, description, actions
- Use smaller controls and tighter spacing
- Remove the lounge-like visual softness from borders, ring states, and large rounded corners

## Acceptance criteria for engineering

The redesign is correct when:

- the first read is "agent control surface", not "design concept"
- the header feels like product chrome, not a landing page
- chat and board feel like two tools in one system
- cards read as operational units, not playful demo content
- the interface still feels premium without relying on glass, glow, or oversized typography

## Handoff summary

This is a directional reset, not a polish pass.

Engineering should treat `DYN-10` as permission to replace the current editorial shell with a clearer control-plane language while keeping the existing CopilotKit and agent-state mechanics intact.
