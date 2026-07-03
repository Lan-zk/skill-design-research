---
name: skill-anatomy
description: Deep research into how the cloned skill repos are designed — each repo's first-principles design assumptions, design philosophy, trigger strategy, and progressive-disclosure usage, written in plain Feynman-style language. Produces per-repo deep-research docs under design-docs/summaries/ and, for multi-repo runs, a cross-repo synthesis under design-docs/comparisons/ that passes adversarial review by the skill-critic subagent. Use when the user wants to study skill anatomy, compare skill designs across repos, or deeply understand one repo's skill-authoring approach.
disable-model-invocation: true
---

# skill-anatomy

Produce **deep research** into how skill repos are authored — not just a surface scan of frontmatter, but the why behind the design. Output always goes under `design-docs/`. Never write inside the cloned repos.

## Two modes (decide up front from the user's request)

- **Single-repo mode** — research one repo. Produce one deep-research doc. That doc then goes through adversarial review.
- **Multi-repo mode** — research several repos, then synthesize. Produce one deep-research doc per repo (the raw material) + one cross-repo synthesis. Only the **synthesis** goes through adversarial review; the per-repo docs are kept as-is (raw material).

The adversarial-review rule in one line: **review happens at the top of the output chain — the single most synthesized artifact.** Single-repo run → review the deep-research doc. Multi-repo run → review only the synthesis, not each per-repo doc.

## Step 1 — Scope & dispatch

1. Confirm with the user which repo(s) and what angle/topic (e.g. "trigger wording", "progressive disclosure", "first principles", or a full anatomy pass). Default to a full anatomy pass.
2. Read `skills/README.md` for the repo list, git URLs, default branches, and each repo's SKILL.md location.
3. For each repo in scope, dispatch the **`skill-analyzer` subagent** (one per repo, in parallel) to collect raw material: frontmatter fields, verbatim `description` triggers, bundled resources, layout, SKILL.md counts/locations, **plus** design-philosophy leads — the repo's root `README.md`, agent-integration files (`CLAUDE.md`/`AGENTS.md`/`GEMINI.md`/`CURSOR.md`), and skill-directory organization. The subagent returns a structured Markdown bundle per repo. This avoids loading dozens of SKILL.md files into the main context.

## Step 2 — Write per-repo deep research

For each repo, write `design-docs/summaries/<repo>-deep-research.md` using this skeleton. Adapt depth to what the repo actually offers; don't pad.

```markdown
# <repo> 深度研究

> Generated <YYYY-MM-DD> · repo: <repo> · source: <owner/repo>

## 一句话定位
<这个仓库是什么、给谁用、解决什么问题 —— 一句大白话>

## 核心数据
- SKILL.md 数量 / 位置：<…>
- 默认分支 / 作者：<…>
- 根级 agent 集成文件：<…>

## 它在解决什么问题
<这个仓库到底想解决什么？为谁解决？不解决什么？>

## 第一性原理  ← 固定章节，必写
它的设计建立在什么根本假设上？为什么作者相信这个假设是对的？
- 根本假设：<…>
- 为什么相信：<…>
- 假设成立的前提条件：<…>
- 假设失效的条件：<…>
（不是"用了渐进式披露"，而是"为什么相信渐进式披露比单文件大说明更对"。）

## 设计哲学
- 技能组织方式：<…> 及其意图
- 触发词策略：<…> —— verbatim 引用 description，再解释为什么这么写
- 渐进式披露的实际用法：<SKILL.md 多大、引用了哪些 references/scripts/assets>
- agent 集成文件策略：<…>

## 代表性 skill 解剖
挑 1-3 个最能体现其哲学的 skill，读 SKILL.md + 引用资源，讲清它具体怎么工作、为什么这么设计。

## 与别家的本质差异
<要点，留给综合篇展开。单仓库模式下这一节可略写。>

## 局限 / 可借鉴点
<…>
```

## Step 3 — Synthesize (multi-repo mode only)

Write `design-docs/comparisons/<topic-or-date>-<short-slug>.md`:

```markdown
# <综合标题>

> Generated <YYYY-MM-DD> · scope: <which repos covered>

## 概览
<2-4 句大白话：这次比较一眼能看到什么>

## 各仓库第一性原理横向对照
| 仓库 | 根本假设 | 为什么相信 | 失效条件 |
|---|---|---|---|
| superpowers | <…> | <…> | <…> |

（同一问题，不同作者的根本假设差异 —— 这是综合篇的核心。）

## 共性模式 vs 本质分歧
- 共性：<…>
- 本质分歧（不是措辞差异，是假设差异）：<…>

## 对 skill 设计的启示
<…>
```

## Step 4 — Adversarial review (mandatory, at the top of the chain)

After the target artifact is written (single-repo deep-research doc, OR the multi-repo synthesis — never both, never per-repo docs in multi-repo mode):

1. Dispatch the **`skill-critic` subagent** against that one artifact. Give it: the artifact path, the repo(s) in scope, and the four review dimensions below.
2. The critic returns a structured defect list (each defect: dimension, what's wrong, evidence/missing-evidence, suggested fix).
3. You (the writer) revise the artifact to address every valid defect. Re-read source repos where the critic flagged missing evidence — don't just rewrite from memory.
4. If a defect is genuinely a matter of opinion and the writer disagrees, note the disagreement in the artifact rather than silently ignoring it.

### The four review dimensions (critic must check all)

- **事实性 (Factual)** — Is every claim backed by code/SKILL.md evidence the critic can re-find? Flag any assertion with no verifiable source, or any misreading. The critic should re-open files to verify.
- **第一性原理 (First principles)** — Did the analysis reach the *root assumption*, not just "what pattern is used"? Are the conditions under which the assumption holds/fails stated? Flag shallow "it uses X" without the "why believe X".
- **费曼标准 (Feynman clarity)** — Any abstract empty phrasing (赋能/闭环/范式/降维打击 etc.) used *instead of* explanation? Every term present but unexplained? Can a non-expert follow it? Flag each opaque passage and demand a plain-language rewrite.
- **横向对照 (Cross-cutting, synthesis only)** — Are the claimed cross-repo differences real (root-cause) or just surface wording? Flag false contrasts.

## Writing standard — Feynman style (applies to ALL output)

This is a hard constraint on every artifact this skill produces, and a primary review axis.

- **可以用专有名词，但每个名词后必须跟一句大白话解释。** Example OK: "渐进式披露（progressive disclosure：先给一个小的入口文件，需要细节时再展开下一层）". Example BAD: "采用渐进式披露范式赋能上下文管理".
- **禁止空话套话**：赋能、闭环、范式、降维打击、抓手、链路、生态化反 等。用了就算违规。
- **解释机制要落到"它具体在干嘛、为什么这么干"**，而不是"它体现了 X 思想"。
- **及格线**：一个不熟悉 skill / agent 领域的人能读懂这段在说什么。
- 中文产出为主；专有名词保留英文原词并括注解释。

## Rules

- **Read-only on cloned repos.** Only Read/Glob/Grep inside repos under `skills/`. Writes go to `design-docs/` only (`summaries/` and `comparisons/`).
- Quote `description` fields verbatim — they are the trigger surface and precise wording matters.
- Adversarial review is **mandatory** and happens **once per run**, at the top of the output chain (single-repo doc, or multi-repo synthesis — not both).
- The `skill-analyzer` subagent collects raw material; the `skill-critic` subagent reviews. The main agent writes and revises.
- Don't fabricate. If a repo has no `SKILL.md` or no README, say so explicitly.
- `design-docs/` subdirectory convention: `summaries/` (per-repo deep research), `comparisons/` (cross-repo synthesis), `methods/` (methodology notes if needed).

## 派发技巧

- **派 skill-critic 时，附上完整仓库列表**（读 `skills/README.md` manifest）。否则 critic 会把对 anthropic-skills / impeccable / gstack 等**同在工作区内**的仓库的引用误判为"不在工作区、不可验证"，产生大量假缺陷。
- **skill-analyzer 报告的行数常系统性偏小**（trailing newline / `wc -l` 口径差异），视为近似值；critic 会重读源文件核实。涉及精确行数的论断（如"超 500 行"）以 critic 核实为准。
