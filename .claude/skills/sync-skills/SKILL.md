---
name: sync-skills
description: Initialize or sync the 9 cloned skill repos nested under skills/. Clones a repo (default branch) when missing, or fast-forwards it when present — read-only, never force/reset/commit/push. Use when the user says "拉取最新的", "pull latest", "sync repos", "初始化", "initialize", or wants to set up / update all skill projects after cloning this workspace.
disable-model-invocation: true
---

# sync-skills

Initialize and sync all 9 cloned skill repositories (each a subdirectory under `skills/`). Idempotent: missing repos are cloned, present repos are fast-forwarded.

## Source of truth

The repo list, git URLs, default branches, and pull rules live in **`skills/README.md`** (the manifest). Read it first — do not hardcode the list here. The table below is a convenience copy; if it ever drifts from the manifest, the manifest wins.

```
andrej-karpathy-skills  gsap-skills  gstack  guizang-ppt-skill  impeccable
ljg-skills  obsidian-skills  skills  superpowers
```

All clone into `skills/<repo>/`. (`skills/skills/` is correct — the mattpocock repo is literally named `skills`.)

## Constraints (hard)

- Each cloned repo is **read-only**. This skill only ever runs `git clone` (for missing repos) and `git fetch` + `git pull --ff-only` (for existing ones).
- **Never** run, even on failure: `git reset`, `git checkout --`, `git stash drop`, `git push`, `git commit`, `git merge`, `git rebase`, `--force`, or anything that mutates commits/history.
- If a repo refuses clone or `--ff-only` (network error, local divergence, detached HEAD, uncommitted changes), **report it and move on** — do nothing further to that repo.
- Do not modify, stage, or delete any file inside the cloned repos.
- Clone the default branch; do not pass `--branch` unless the manifest specifies otherwise (it doesn't — `--ff-only` follows whatever the repo's default checkout tracks).
- Ignore any directory under `skills/` that is **not** in the manifest; report it to the user instead of touching it.

## Procedure

Run from the workspace root (`E:/File/self/github/skill-design-project`). For each repo `<r>` with git URL `<u>` from the manifest:

```bash
if [ -d "skills/$r/.git" ]; then
  # already present → fast-forward
  git -C "skills/$r" fetch origin 2>&1
  git -C "skills/$r" pull --ff-only 2>&1 || echo "!! $r could not fast-forward — leaving untouched"
else
  # missing → clone default branch
  git clone "$u" "skills/$r" 2>&1 || echo "!! $r could not be cloned — leaving untouched"
fi
```

In practice, iterate over all 9 repos from the manifest in one pass.

## Reporting

After running, give the user a one-line-per-repo summary:

- 🆕 `<repo>` — cloned to `<short sha>` (`<branch>`)
- ✅ `<repo>` — updated to `<short sha>` (`<branch>`)
- ⚠️ `<repo>` — already up to date
- ❌ `<repo>` — failed: `<reason>` (no action taken)

For any ❌, paste the exact error and suggest the user resolve it manually outside this workspace (these repos are read-only here).
