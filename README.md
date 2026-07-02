# skill-design-project

一个**只读研究工作区**，用于研究流行的开源 agent "skill" 项目。

工作区本身是 git 仓库；`skills/` 下的 9 个开源 skill 仓库**不**纳入版本控制——它们是只读参考资料，由初始化步骤拉取到本地。

## 快速上手

1. **克隆本仓库**
   ```bash
   git clone <this-repo-url>
   cd skill-design-project
   ```

2. **初始化拉取 skill 仓库** —— 在 Claude Code 里跑：
   ```
   /sync-skills
   ```
   这会把 `skills/README.md`（manifest）里登记的 9 个仓库克隆到 `skills/<仓库名>/` 下。已存在的仓库则 `git pull --ff-only` 同步到最新。所以 `/sync-skills` 既能初始化、也能日常同步。

   > 不用 Claude Code？手动对照 `skills/README.md` 的"仓库表"逐个 `git clone` 即可，例如：
   > `git clone https://github.com/obra/superpowers.git skills/superpowers`

3. **开始研究** —— 读 `skills/README.md` 了解每个仓库的 SKILL.md 位置和定位；研究产出（分析、对比、笔记）写在 `design-docs/` 下。

## 目录结构

```
.
├── CLAUDE.md          # 给 Claude Code 的技术指引 + 只读策略
├── README.md          # 本文件（面向人）
├── .gitignore         # 排除 skills/*/ 克隆目录，放行 skills/README.md
├── skills/
│   ├── README.md      # ★ manifest：仓库表 + 拉取规则 + 内部结构（单一信息源）
│   └── <repo>/        # 克隆的只读仓库，由 /sync-skills 拉取，不进版本控制
├── design-docs/       # 研究产出（对比 / 摘要 / 方法论），可写
└── .claude/           # 自动化：guard hook、skills、subagent
```

## 约定

- **克隆仓库严格只读**：`skills/<repo>/` 下的任何文件都不得修改/删除/提交/推送。`skills/README.md` 是 workspace 元数据（manifest），可写。`.claude/hooks/guard-repos.js` 会机械拦截对 `skills/<repo>/` 的写入。
- **研究产出放 `design-docs/`**：按主题组织，`/skill-anatomy` skill 已建立 `comparisons/`、`summaries/`、`methods/` 子目录约定。
- **同步仓库**：日常 `git pull` 各仓库用 `/sync-skills`，它只做 `git fetch` + `git pull --ff-only`，绝不 force/reset/push/commit。

## 自动化（`.claude/`）

- **`/sync-skills`** — 初始化 + 同步 skill 仓库（clone if missing / pull --ff-only）。
- **`/add-skill`** — 新增一个 skill 仓库：给 git 地址 → clone 到 `skills/<repo>/` → 自动推断元数据 → 更新 `skills/README.md` manifest。
- **`/skill-anatomy`** — 深度研究 skill 仓库的设计：第一性原理、设计哲学、触发词策略，费曼式通俗表达。单仓库模式审查该仓库报告，多仓库模式只审查综合篇。
- **`skill-analyzer` subagent** — 单仓库只读素材采集，可并行 fan-out。
- **`skill-critic` subagent** — 对抗性审查者，审查 skill-anatomy 产出的事实性/第一性原理深度/费曼清晰度。
- **guard-repos hook** — PreToolUse 拦截对 `skills/<repo>/` 的写入。
