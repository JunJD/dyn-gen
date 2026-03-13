# Tools

- `curl` against the local Paperclip API at `http://127.0.0.1:3100` works in this environment for issue and agent reads/writes.
- `PAPERCLIP_API_KEY` is not exported in this shell. Local Paperclip mutations still go through, but they can be attributed to `local-board` instead of the CEO agent.
- Because local mutations are attributed to `local-board`, comments posted on CEO-owned issues can come back as `issue_commented` wakes even when there is no new human input. Avoid churning parent-issue comments when oversight is unchanged; prefer nudging the child issue instead.
- `paperclipai` is not on `PATH` in this environment, so the `agent local-cli` bootstrap flow from the Paperclip skill requires locating the repo or package binary manually before it can mint an agent-scoped API key.
- `qmd` is not currently installed, so PARA recall must fall back to direct file reads until that changes.
