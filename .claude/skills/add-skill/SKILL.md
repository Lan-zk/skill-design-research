---
name: add-skill
description: Add a new open-source skill repo to this workspace. Given a git URL, clone it to skills/<repo-name>/ (default branch, read-only), auto-infer its metadata (author, default branch, SKILL.md location/count, one-line purpose), and append a row to skills/README.md (the manifest) for both the repo table and the per-repo structure table. Use when the user says "新增一个skill", "add a skill", "添加仓库", or provides a git URL to incorporate into the workspace.
disable-model-invocation: true
---

# add-skill

Add one new cloned skill repo to the workspace and register it in the manifest.

## Scope & boundary

- This skill **adds** a repo and **writes** the manifest (`skills/README.md`). It is the write-side companion to `/sync-skills`, which only reads the manifest to clone-or-sync already-registered repos.
- Once added, the new repo is just like the other 9 — read-only, and covered by `/sync-skills` and the guard hook automatically.

## Constraints (hard)

- The cloned repo under `skills/<repo-name>/` is **read-only**. Do not modify, stage, or delete any file inside it. The only write this skill performs is to `skills/README.md` (the manifest).
- Only `git clone` (default branch). **Never** run `git reset`, `git checkout --`, `git push`, `git commit`, `git merge`, `git rebase`, `--force`, etc.
- If `skills/<repo-name>/` already exists, **do not overwrite** — report the conflict and tell the user to use `/sync-skills` to update it instead.
- If clone fails, report the error and do nothing further (do not partially edit the manifest).
- Do **not** commit. Leave staging/committing to the user.

## Procedure

Inputs from the user: a git URL `<u>` (e.g. `https://github.com/owner/repo.git`).

### 1. Derive repo name and target path

- Repo name = last path segment of `<u>`, with a trailing `.git` stripped. Example: `https://github.com/obra/superpowers.git` → `superpowers`.
- Target path = `skills/<repo-name>/`.

### 2. Pre-flight check

- If `skills/<repo-name>/` already exists → **stop**. Report: "`skills/<repo-name>/` already exists; use `/sync-skills` to sync it instead." Do not clone or edit anything.

### 3. Clone (read-only)

```bash
git clone "<u>" "skills/<repo-name>" 2>&1 || echo "!! clone failed"
```

- If clone fails, report the exact error and stop. Do not edit the manifest.

### 4. Auto-infer metadata

From the freshly cloned repo:

- **Default branch**: `git -C "skills/<repo-name>" branch --show-current`
- **Author / source**:
  - If `<u>` is a GitHub URL (`github.com/<owner>/<repo>`): author = `<owner>`, source = `<owner>/<repo>`.
  - Otherwise: author = the URL's host, source = the full URL. (Note this in the manifest row so a human can refine later.)
- **SKILL.md location & count**:
  - Root SKILL.md? `[ -f "skills/<repo-name>/SKILL.md" ]`
  - Nested SKILL.md count and the common prefix path, via `find "skills/<repo-name>" -mindepth 2 -name SKILL.md`.
  - Summarize the location pattern, e.g. `skills/<repo>/skills/<name>/SKILL.md (N 个)` or `根 SKILL.md (单个技能)` — mirror the existing rows' style.
- **Root agent-integration files**: check for `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` / `CURSOR.md` at the repo root (mention in the structure row's note if present).
- **One-line purpose**: read the repo's root `README.md` (and root `SKILL.md` if present), then write a single concise Chinese sentence describing what the repo is. Keep it parallel in tone to the existing rows.

### 5. Update the manifest (`skills/README.md`)

Make exactly three edits:

1. **Repo table** — append one row at the end of the `## 仓库表` table, matching column order: `| skills/<repo-name>/ | <repo-name> | <u> | <author> | <default-branch> | <source> |`.
2. **Per-repo structure table** — append one row at the end of the `## 每仓库内部结构` table: `| <repo-name> | <SKILL.md 位置与数量> | <one-line 定位> |`.
3. **Repo count** — in the line `仓库总数：**N**` near the top, increment N by 1. Also update any other place the total appears as a literal (e.g. the intro line) if present.

Follow the existing rows' wording and formatting exactly. Keep the table column alignment. Use the Edit tool on `skills/README.md`.

### 6. Report to the user

Give the user:

- ✅ cloned `skills/<repo-name>/` → `<short sha>` (`<default-branch>`)
- The manifest row that was added (paste it).
- A reminder: the manifest edit is uncommitted — review it, then `git add skills/README.md && git commit` when ready.
- Note that the new repo is now covered by `/sync-skills` and the guard hook.

## Example

User: "新增一个 skill: https://github.com/anthropics/claude-code.git"

→ repo name `claude-code`, clone to `skills/claude-code/`, infer metadata, append rows to both tables in `skills/README.md`, bump the count, report. (Do not actually run this unless asked.)
