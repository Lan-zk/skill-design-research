# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A **read-only research workspace** for studying popular open-source agent "skill" projects. Every cloned repo lives as a subdirectory under `skills/`. The workspace itself is a git repo; the cloned repos under `skills/` are **not** tracked — they're pulled in locally by an init step and excluded via `.gitignore`. There is no build system.

The skill repos under study (each its own git remote, all nested under `skills/`):

| Directory | Source |
|---|---|
| `skills/superpowers/` | obra/superpowers |
| `skills/skills/` | mattpocock/skills |
| `skills/obsidian-skills/` | kepano/obsidian-skills |
| `skills/gsap-skills/` | greensock/gsap-skills |
| `skills/gstack/` | garrytan/gstack |
| `skills/guizang-ppt-skill/` | op7418/guizang-ppt-skill |
| `skills/ljg-skills/` | lijigang/ljg-skills |
| `skills/andrej-karpathy-skills/` | multica-ai/andrej-karpathy-skills |
| `skills/impeccable/` | pbakaus/impeccable |

> Note: `skills/skills/` is not a typo — the mattpocock repo is literally named `skills`, nested one level under the workspace's `skills/` directory.

`skills/README.md` is the **manifest** — the single source of truth for which repos to pull, their git URLs, default branches, pull rules, and each repo's internal SKILL.md layout. It is a workspace metadata file at the `skills/` root, not part of any cloned repo. Adding/removing a repo means editing only this file; `/sync-skills` and the guard hook both work off it. The cloned `skills/<repo>/` directories are `.gitignore`d (only `skills/README.md` is tracked), so a fresh clone of this workspace starts with an empty `skills/` and is initialized by running `/sync-skills`.

## Hard constraints (CRITICAL)

1. **The cloned repos are strictly read-only.** Never modify, delete, create, commit, push, or branch within any subdirectory under `skills/` (e.g. `skills/superpowers/`, `skills/skills/`, `skills/obsidian-skills/`, …). Treat their contents as reference material only. When reading code, do not use Edit/Write on files inside them.
2. **All research output goes in `design-docs/`.** Organize output by type and topic under that folder.
3. **The `skills/` root level is writable for metadata only.** Direct-child files at `skills/` (the repo index `skills/README.md`, and similar registry docs) may be created and edited. Anything *inside* a `skills/<repo>/` subdirectory is covered by constraint #1.

## Initializing & syncing repos (the only mutation ever performed on cloned repos)

A fresh clone of this workspace has an empty `skills/` (the cloned repos are `.gitignore`d). To populate it, run `/sync-skills`: for each repo in the manifest (`skills/README.md`), it `git clone`s the default branch if the repo is missing, or `git fetch origin && git pull --ff-only` if it already exists. Thus the same skill both initializes (first run) and syncs (subsequent runs).

When the user asks to "拉取最新的" / "pull latest" / "sync repos" / "初始化" / "initialize", this is what they mean. Do NOT pull into a dirty tree, do NOT force-push, do NOT commit anything. The intended operation per repo is a read-only clone-or-update:

```bash
# missing repo → clone default branch
git clone <url> skills/<repo>
# existing repo → fast-forward
git -C skills/<repo> fetch origin && git -C skills/<repo> pull --ff-only
```

Run this across all nine repos. Each repo's default branch is usually `main` (a few use `master`, e.g. `ljg-skills`); `git pull --ff-only` follows whatever the checked-out branch tracks. If a repo refuses (local diverge, detached HEAD, etc.), report it and do nothing further there — never reset or force.

## Skill anatomy (what you'll be reading)

Across these repos, a "skill" is a directory containing a `SKILL.md` with YAML frontmatter (`name`, `description`, sometimes `license`/`allowed-tools`). The `description` is the trigger surface — it's what an agent matches against to decide when to invoke the skill. Supporting material (scripts, references, assets, examples) lives alongside `SKILL.md` in the same directory. This progressive-disclosure layout (small entry file → bundled references) is the central pattern under study.

Repos also ship agent-integration files at their roots (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `CURSOR.md`) — these document how each project expects to be consumed by different agents and are worth comparing across repos.

## Project-level Claude Code configuration

`.claude/` holds automations tailored to this workspace's read-only research workflow.

### PreToolUse hook — `.claude/hooks/guard-repos.js` (enforces constraint #1 mechanically)

Configured in `.claude/settings.json`, matches `Edit|Write|NotebookEdit`. For every write, it resolves the target path against the workspace root and checks the first path segment:

- **Inside a cloned repo** (`skills/<repo>/…`) → exits with code `2`, **blocking** the write. The check is filesystem-based: any *existing subdirectory* under `skills/` is treated as a cloned repo, so newly added repos are protected automatically without updating a list.
- **A direct-child file at the `skills/` root** (`skills/README.md`, etc.) → allowed. These are workspace metadata, not repo contents.
- **Inside `design-docs/` or `.claude/`** → allowed.
- Anywhere else → allowed with a non-blocking stderr note.

This converts the read-only policy from a convention into a hard guarantee. The hook is a pure Node script with no deps; it reads the hook-event JSON from stdin.

### Skills (user-invocable, `disable-model-invocation: true`)

- **`/sync-skills`** — `.claude/skills/sync-skills/SKILL.md`. Initializes and syncs the 9 repos under `skills/`: clones missing repos (default branch) and fast-forwards existing ones, all read-only. Reads the repo list from `skills/README.md`. Triggered by "拉取最新的" / "pull latest" / "sync repos" / "初始化" / "initialize". Never force/reset/push/commit; on failure it reports and leaves the repo untouched. This is the operational form of the "Initializing & syncing repos" section above — prefer it over running the git loop by hand.
- **`/skill-anatomy`** — `.claude/skills/skill-anatomy/SKILL.md`. Cross-repo comparison workflow. Captures per-skill frontmatter, verbatim `description` trigger wording, bundled resources, layout, and invocation model; writes the result to `design-docs/comparisons/` using a fixed template. Establishes the `design-docs/` subdirectory convention (`comparisons/`, `summaries/`, `methods/`).

### Subagent — `.claude/agents/skill-analyzer.md` (Claude-invocable)

Read-only analyst for **one** repo at a time. `tools: Read, Glob, Grep` (no write tools). Returns a structured Markdown summary of every `SKILL.md` in the assigned repo. Use it to fan out one agent per repo in parallel during `/skill-anatomy` comparisons, then synthesize — avoids loading dozens of `SKILL.md` files into the main context.

### Where writes are allowed (recap)

`skills/` root files (repo index only), `.claude/` (config), and `design-docs/` (research output). Everything inside `skills/<repo>/` is blocked by the hook; the skills/agent are read-only on the repos by construction.

## Working in this repo

- Use `design-docs/` for any artifact you produce (analysis, comparisons, writeups). The `/skill-anatomy` skill establishes subdirectories (`comparisons/`, `summaries/`, `methods/`) — follow that convention.
- `skills/README.md` is the registry of repos; keep it in sync when repos are added or removed. Do not put research output there — that goes in `design-docs/`.
- When investigating a skill, read its `SKILL.md` first, then any `references/` or bundled scripts it points to. Cross-repo comparison (same concept, different authors) is a common task — compare structure, trigger wording, and bundled-resource strategy. For large scopes, dispatch the `skill-analyzer` subagent once per repo in parallel.
- There are no tests, linters, or build steps to run. Verification here means reading and reasoning about the source, not executing it. The only executable is the Node guard hook (no deps).
