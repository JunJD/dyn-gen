# Fail-Fast Patterns

Use this file when you need concrete examples of where fallbacks are acceptable
and where they are dangerous.

## Required Domain Fields

Bad:

```ts
const title = payload.title ?? "Untitled";
```

Good:

```ts
const title = payload.title;
```

If the field defines identity, workflow, storage, or agent behavior, do not
invent a value.

## Optional Fields

Bad:

```ts
const subtitle = asString(payload.subtitle, "");
```

Good:

```ts
const subtitle = payload.subtitle;
```

Keep optional data optional. Empty-string coercion usually destroys signal.

## Exceptions and Error Handling

Bad:

```ts
try {
  return buildTimeline(payload);
} catch {
  return [];
}
```

Good:

```ts
return buildTimeline(payload);
```

Swallowing the error trades a fast fix for a long debugging session.

## UI Placeholders

Allowed:

```tsx
<span>{title ?? "Untitled scene"}</span>
```

This is acceptable only when:

- the placeholder is strictly visual
- the value does not get persisted
- the placeholder does not flow back into shared state or tool input

## Compatibility Shims

Sometimes a temporary fallback is necessary during a migration. When that
happens:

- keep the shim at the boundary
- name the legacy shape explicitly
- leave a TODO with the removal condition
- add a test that covers both the old and new contract while the migration lives

If you cannot justify a fallback in one sentence, remove it.
