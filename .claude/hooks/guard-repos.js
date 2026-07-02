#!/usr/bin/env node
/**
 * guard-repos.js — PreToolUse hook for the skill-design-project workspace.
 *
 * Enforces the workspace's #1 constraint: the cloned skill repos — each a
 * subdirectory under skills/ — are read-only. Blocks any Edit/Write/NotebookEdit
 * whose target lives inside skills/<repo>/.
 *
 * Writable locations:
 *   - skills/ root files (direct children of skills/, e.g. skills/README.md —
 *     the repo index). These are workspace metadata, NOT repo contents.
 *   - design-docs/ (research output)
 *   - .claude/ (config)
 *
 * The repo check is filesystem-based: any existing subdirectory under skills/
 * is treated as a cloned repo and blocked. This adapts automatically when repos
 * are added or renamed — no list to keep in sync.
 *
 * Claude Code PreToolUse contract:
 *   - reads the hook event JSON from stdin
 *   - exit 0  -> allow
 *   - exit 2  -> block; stderr is shown to the user
 *   - other   -> non-blocking error
 */
const path = require("path");
const fs = require("fs");

const SKILLS_DIR = "skills";

// Directories under the workspace root where writes ARE permitted (other than
// skills/, which is handled by its own branch below).
const ALLOWED_TOP = new Set(["design-docs", ".claude", ".git"]);

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    // Malformed input — don't block, let the tool proceed.
    process.exit(0);
  }

  const filePath =
    input?.tool_input?.file_path || input?.tool_input?.notebook_path;
  if (!filePath) process.exit(0);

  const cwd = input?.cwd || process.cwd();
  const abs = path.resolve(cwd, filePath);
  const rel = path.relative(cwd, abs);

  // Outside the workspace entirely — not our concern.
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);

  const segments = rel.split(path.sep);
  const first = segments[0];

  // Under skills/: subdirectories are cloned repos (read-only), but direct-child
  // files at the skills/ root (the repo index, etc.) are writable.
  if (first === SKILLS_DIR) {
    const second = segments[1];
    if (second) {
      let isDir = false;
      try {
        isDir = fs.statSync(path.join(cwd, SKILLS_DIR, second)).isDirectory();
      } catch {
        isDir = false;
      }
      if (isDir) {
        console.error(
          `[guard-repos] BLOCKED: "skills/${second}" is a read-only cloned repo.\n` +
            `Writes inside skills/<repo>/ are not allowed. Writable locations: skills/ root files (e.g. skills/README.md), design-docs/, .claude/.\n` +
            `Target was: ${rel}`
        );
        process.exit(2);
      }
    }
    // skills/ itself, or a direct-child file at the skills/ root → allowed.
    process.exit(0);
  }

  // Defensive: if some new top-level dir appears that isn't allowed, allow it
  // but warn in stderr (non-blocking) so it's visible.
  if (!ALLOWED_TOP.has(first)) {
    console.error(`[guard-repos] note: writing to unlisted top-level dir "${first}"`);
  }

  process.exit(0);
});
