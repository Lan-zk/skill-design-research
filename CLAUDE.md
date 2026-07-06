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

Run this across all repos listed in the manifest. Each repo's default branch is usually `main` (a few use `master`, e.g. `ljg-skills`); `git pull --ff-only` follows whatever the checked-out branch tracks. If a repo refuses (local diverge, detached HEAD, etc.), report it and do nothing further there — never reset or force.

**Bash cwd persists across calls** — `cd skills/<repo>` to read metadata leaks into the next command's relative paths. When cloning (`/add-skill`, `/sync-skills`), pass an **absolute** clone target (or `cd` to the workspace root first); a relative `skills/<name>` target can otherwise land inside the previously-visited read-only repo, where the guard hook won't catch it (see above).

## Skill anatomy (what you'll be reading)

Across these repos, a "skill" is a directory containing a `SKILL.md` with YAML frontmatter (`name`, `description`, sometimes `license`/`allowed-tools`). The `description` is the trigger surface — it's what an agent matches against to decide when to invoke the skill. Supporting material (scripts, references, assets, examples) lives alongside `SKILL.md` in the same directory. This progressive-disclosure layout (small entry file → bundled references) is the central pattern under study.

Repos also ship agent-integration files at their roots (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `CURSOR.md`) — these document how each project expects to be consumed by different agents and are worth comparing across repos.

### Agent Skills 官方规范基准（agentskills.io）

The canonical standard is cloned at `skills/agentskills/`（agentskills/agentskills，Anthropic 发起、现已开放）——`docs/specification.mdx` 是规范文本，`skills-ref/` 是参考验证器。研究本工作区里的技能仓库时，以此为准绳判断"遵循还是偏离"。严格区分三类，避免把"建议"误读成"强制"（history-docs 里已删除的 3 个 spec 文档就是这个错误）：

**Must（spec 硬性规定，`skills-ref` validator 强制）**
- 一个技能 = 一个目录 + 一个 `SKILL.md`（YAML frontmatter + Markdown 正文）。
- frontmatter 必填 `name` + `description`；`name` 1-64 字符、小写字母/数字/连字符、不得开头或结尾或连续连字符、**必须匹配父目录名**；`description` 1-1024 字符、非空。
- 允许的 top-level 字段仅 6 个（`validator.py` 的 `ALLOWED_FIELDS`）：`name`、`description`、`license`、`compatibility`（≤500 字符）、`metadata`（string→string 任意键值）、`allowed-tools`（实验性）。

**Recommended（建议，非强制；validator 不查）**
- 渐进式披露三层：metadata（~100 tokens，启动时全技能加载）→ instructions（SKILL.md body，<5000 tokens 建议，激活时加载）→ resources（scripts/references/assets，按需）。
- `SKILL.md` 主体 < 500 行 / 5000 tokens；超长内容拆进 `references/`。**是建议不是硬规则**——本工作区 gstack（中位数 ~800 行）、anthropic docx 590 行、guizang 541 行、ui-ux-pro-max 704 行都超 500 且合理。
- 文件引用保持一级深度，避免深层嵌套链。
- description 应同时说"做什么"+"何时用"，含触发关键词。

**Convention（de facto 约定：实践中普遍使用，spec 未强制）**
- `.agents/skills/` 是跨客户端技能目录约定（spec 不规定扫描路径，但实现方普遍扫这里）；同名技能 project-level 覆盖 user-level。
- 不可信仓库的项目级技能应做 trust 门控（防指令注入）——本工作区的 `guard-repos.js` 是写侧信任门控（拦截对克隆仓库的修改），与 spec 的读侧门控互补，机制不同。
- `disable-model-invocation` 字段被客户端实现指南承认为过滤标志，但**未进 spec 的 `ALLOWED_FIELDS`**——属 provider 扩展。本工作区 mattpocock/impeccable/gstack/ljg 等在 top-level 用了 spec 不认的扩展字段（`disable-model-invocation` / `user-invocable` / `argument-hint` / `version` / `preamble-tier` 等），跨客户端兼容性会受影响。

验证：`skills-ref validate <skill-dir>`（参考实现，README 明确 "not for production"）只验格式不验质量。完整规范见 `skills/agentskills/docs/specification.mdx`，深度研究见 `design-docs/summaries/agentskills-deep-research.md`。

## Project-level Claude Code configuration

`.claude/` holds automations tailored to this workspace's read-only research workflow.

### PreToolUse hook — `.claude/hooks/guard-repos.js` (enforces constraint #1 mechanically)

Configured in `.claude/settings.json`, matches `Edit|Write|NotebookEdit`. For every write, it resolves the target path against the workspace root and checks the first path segment:

- **Inside a cloned repo** (`skills/<repo>/…`) → exits with code `2`, **blocking** the write. The check is filesystem-based: any *existing subdirectory* under `skills/` is treated as a cloned repo, so newly added repos are protected automatically without updating a list.
- **A direct-child file at the `skills/` root** (`skills/README.md`, etc.) → allowed. These are workspace metadata, not repo contents.
- **Inside `design-docs/` or `.claude/`** → allowed.
- Anywhere else → allowed with a non-blocking stderr note.

This converts the read-only policy from a convention into a hard guarantee for `Edit|Write|NotebookEdit` only — **Bash commands (`git clone`, `rm`, `git checkout`, …) are not intercepted** and can write into `skills/<repo>/` undetected, so use absolute paths and verify targets when running git/rm near `skills/`. The hook is a pure Node script with no deps; it reads the hook-event JSON from stdin.

### Skills (user-invocable, `disable-model-invocation: true`)

- **`/sync-skills`** — `.claude/skills/sync-skills/SKILL.md`. Initializes and syncs the repos under `skills/`: clones missing repos (default branch) and fast-forwards existing ones, all read-only. Reads the repo list from `skills/README.md`. Triggered by "拉取最新的" / "pull latest" / "sync repos" / "初始化" / "initialize". Never force/reset/push/commit; on failure it reports and leaves the repo untouched. This is the operational form of the "Initializing & syncing repos" section above — prefer it over running the git loop by hand.
- **`/add-skill`** — `.claude/skills/add-skill/SKILL.md`. Adds a new repo to the workspace: given a git URL, clones it to `skills/<repo-name>/` (read-only), auto-infers its metadata (author, default branch, SKILL.md location/count, one-line purpose), and appends a row to both tables in `skills/README.md` (the manifest) and bumps the repo count. The write-side companion to `/sync-skills` (which only reads the manifest). Triggered by "新增一个skill" / "add a skill" / "添加仓库" or by the user pasting a git URL to incorporate. Never force/reset/push/commit; leaves committing to the user. If a new repo's name collides with an existing manifest row (e.g. two repos named `skills`), the filesystem pre-flight won't catch it when the dir isn't cloned yet — check the manifest's 目录 column and disambiguate by author-prefixing the directory (e.g. `slavingia-skills`), asking the user if needed.
- **`/skill-anatomy`** — `.claude/skills/skill-anatomy/SKILL.md`. Deep research into how skill repos are designed. Two modes: **single-repo** (one deep-research doc under `design-docs/summaries/`, then adversarially reviewed) or **multi-repo** (one deep-research doc per repo as raw material + one cross-repo synthesis under `design-docs/comparisons/`, with only the synthesis reviewed). Each repo's analysis reaches its **first-principles design assumptions** (not just what patterns it uses, but why the author believes they're right and when they'd fail). All output is written in **Feynman-style plain language** — technical terms allowed but each must be explained so a non-expert can follow; no empty abstractions (赋能/闭环/范式 etc.). Uses `skill-analyzer` to collect raw material and `skill-critic` for the adversarial review pass.

### Subagents (Claude-invocable)

- **`skill-analyzer`** — `.claude/agents/skill-analyzer.md`. Read-only raw-material collector for **one** repo at a time. `tools: Read, Glob, Grep`. Returns a structured bundle: per-skill facts (frontmatter, verbatim `description`, bundled resources, layout, invocation model) **plus** repo-level design-philosophy leads (README, agent-integration files, skill-directory organization, trigger-wording house style, progressive-disclosure usage, author's stated philosophy). Fan out one per repo in parallel during `/skill-anatomy`, then synthesize — avoids loading dozens of `SKILL.md` files into the main context.
- **`skill-critic`** — `.claude/agents/skill-critic.md`. Adversarial reviewer. `tools: Read, Glob, Grep`. Reviews **one** artifact per invocation (a single-repo deep-research doc, or a multi-repo synthesis — never both, never per-repo docs in multi-repo mode). Checks four dimensions: factual accuracy (re-opens source files to verify), first-principles depth, Feynman clarity, and (syntheses only) cross-cutting validity. Returns a structured defect list the writer revises against. Review happens once per run, at the top of the output chain.

### Where writes are allowed (recap)

`skills/` root files (repo index only), `.claude/` (config), and `design-docs/` (research output). Everything inside `skills/<repo>/` is blocked by the hook; the skills/agent are read-only on the repos by construction.

## Working in this repo

- Use `design-docs/` for any artifact you produce (analysis, comparisons, writeups). The `/skill-anatomy` skill establishes subdirectories (`comparisons/`, `summaries/`, `methods/`) — follow that convention.
- `skills/README.md` is the registry of repos; keep it in sync when repos are added or removed. Do not put research output there — that goes in `design-docs/`.
- When investigating a skill, read its `SKILL.md` first, then any `references/` or bundled scripts it points to. Cross-repo comparison (same concept, different authors) is a common task — compare structure, trigger wording, and bundled-resource strategy. For large scopes, dispatch the `skill-analyzer` subagent once per repo in parallel.
- There are no tests, linters, or build steps to run. Verification here means reading and reasoning about the source, not executing it. The only executable is the Node guard hook (no deps).
