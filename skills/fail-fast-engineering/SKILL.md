---
name: fail-fast-engineering
description: >
  Use when implementing or reviewing parsers, normalizers, adapters, tool
  contracts, derived-state helpers, or external integrations where fallback
  logic could hide bad data. Prefer explicit contracts, typed validation, and
  surfaced errors over silent defaults. Includes a small audit script for
  changed files that flags suspicious fallback patterns for review.
---

# Fail Fast Engineering

Use this skill when a code path turns loose input into structured state or hides
operational failure behind defaults. If the contract is wrong, fail near the
boundary and make the fix obvious.

## Use This Skill When

- Adding or editing normalizers, parsers, mappers, deserializers, or schema adapters.
- Shaping tool output before it enters app or agent state.
- Wiring provider or API responses into typed models.
- Adding catch blocks, retry logic, or default values that could suppress a real bug.
- Reviewing a diff that introduces `??`, `||`, `fallback`, or broad "safe/default" helpers.

## Default Stance

- Required data must be required. Throw, return a structured error, or fail validation instead of inventing substitute values.
- Optional data can stay optional. Preserve `null` or `undefined` rather than coercing it into fake content.
- Presentational placeholders are allowed only at leaf UI render sites, never in shared domain helpers or persisted state.
- Parse once at the boundary, then keep the rest of the code simple.
- If a fallback survives review, leave a short comment explaining why it is local, safe, and not part of the domain contract.

## Workflow

1. Identify the boundary.
   This is the line where untrusted input enters: external API payloads, tool output, form data, JSON files, env vars, or cross-package messages.
2. Remove silent repair.
   Delete helpers that coerce arbitrary values into seemingly valid objects. Replace them with explicit parsing, schema validation, or assertions.
3. Surface failure with context.
   Error messages should name the contract that failed and include the missing or invalid field when possible.
4. Keep fallbacks at the edge.
   UI copy placeholders are acceptable in leaf render code. Shared state builders, persistence code, and contract helpers should not guess.
5. Test the unhappy path.
   Add or update at least one test that proves invalid input fails loudly instead of being normalized away.
6. Audit the touched files.
   Run `python3 skills/fail-fast-engineering/scripts/audit_fallbacks.py <files...>` and review every hit before shipping.

## Preferred Patterns

- Parse required fields with explicit checks or schema validators.
- Keep optional fields nullable instead of backfilling fake defaults.
- Return structured failures only when the caller genuinely needs a recoverable error shape.
- Use test fixtures that omit or corrupt required fields so the contract stays honest.

Read [references/patterns.md](references/patterns.md) when you need concrete "bad vs good" examples.

## Allowed Exceptions

- Leaf-level UI placeholders such as `"Untitled scene"` when the placeholder is clearly visual and never re-enters shared state.
- Backward-compatibility shims that have an owner and removal note.
- Retries around flaky infrastructure when the failure still surfaces after the retry budget is exhausted.

## Resources

- `scripts/audit_fallbacks.py` scans touched files for common fallback-shaped code so you can review each case explicitly.
- `references/patterns.md` contains concrete examples of acceptable and unacceptable fallback behavior at different layers.
