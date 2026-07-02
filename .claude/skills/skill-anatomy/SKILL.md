---
name: skill-anatomy
description: Analyze and compare how SKILL.md files are structured across the cloned skill repos (trigger wording in description, progressive disclosure, bundled references/scripts/assets, layout). Writes the comparison as a structured Markdown doc under design-docs/. Use when the user wants to compare skill designs, study skill anatomy, or survey how different authors author skills.
disable-model-invocation: true
---

# skill-anatomy

Produce a cross-repo comparison of skill authoring patterns. Output is always written under `design-docs/` — never inside the cloned repos.

## What to capture per skill

For each `SKILL.md` examined, record:

1. **Frontmatter fields** — which keys are present (`name`, `description`, `license`, `allowed-tools`, `disable-model-invocation`, etc.) and any non-standard ones.
2. **Trigger wording** — quote the `description` verbatim. Note the trigger style (keyword list vs. natural-language sentence vs. scenario-based).
3. **Progressive disclosure** — size of `SKILL.md` vs. whether it references bundled `references/`, `scripts/`, `assets/`, `examples/`. List bundled files.
4. **Layout** — directory structure of the skill folder.
5. **Invocation model** — user-only / Claude-only / both (from `disable-model-invocation` / `user-invocable`).
6. **Notable patterns** — anything idiosyncratic worth flagging.

## Output structure

Write to `design-docs/comparisons/<topic-or-date>-<short-slug>.md` using this template:

```markdown
# <Comparison title>

> Generated <YYYY-MM-DD> · scope: <which repos / skills covered>

## Summary
<2-4 sentences: what the comparison shows at a glance>

## Repos covered
| Repo | Skills examined | Source |
|---|---|---|
| skills/superpowers | brainstorming, … | obra/superpowers |

## Per-skill findings
### <repo>/<skill-name>
- **Frontmatter**: …
- **Trigger (description)**: "<verbatim>"
- **Bundled resources**: …
- **Layout**: …
- **Notes**: …

## Cross-cutting observations
- <pattern shared across repos>
- <notable divergence>

## Implications for skill design
- <takeaways>
```

## Rules

- **Read-only on cloned repos.** Only Read/Glob/Grep inside the 9 repos (subdirectories under `skills/`). Writes go to `design-docs/` only.
- Quote `description` fields verbatim — they are the trigger surface and precise wording matters.
- When the scope is large (many skills), prefer dispatching the `skill-analyzer` subagent once per repo in parallel, then synthesize.
- Establish subdirectories under `design-docs/` as needed (`comparisons/`, `summaries/`, `methods/`).
