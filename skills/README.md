# Skills 仓库索引 / Manifest

> 本文件是 `skills/` 下所有克隆仓库的**登记表 + 拉取清单（manifest）**，agent-readable。
> 它是"哪些仓库要拉、怎么拉、拉到哪、内部结构如何"的单一信息源。
> 新增或移除仓库时**只改本文件**，`/sync-skills` 与 guard hook 都据此工作，无需同步别处。
> 本文件位于 `skills/` 根级，是 workspace 元数据，不属于任何克隆仓库；`skills/<repo>/` 子目录全部由 `.gitignore` 排除，不进版本控制。

仓库总数：**12**

## 仓库表

| 目录 | 仓库名 | Git 地址 | 作者 | 默认分支 | 来源 |
|---|---|---|---|---|---|
| `skills/superpowers/` | superpowers | https://github.com/obra/superpowers.git | obra | main | obra/superpowers |
| `skills/skills/` | skills | https://github.com/mattpocock/skills.git | mattpocock | main | mattpocock/skills |
| `skills/obsidian-skills/` | obsidian-skills | https://github.com/kepano/obsidian-skills.git | kepano | main | kepano/obsidian-skills |
| `skills/gsap-skills/` | gsap-skills | https://github.com/greensock/gsap-skills.git | greensock | main | greensock/gsap-skills |
| `skills/gstack/` | gstack | https://github.com/garrytan/gstack.git | garrytan | main | garrytan/gstack |
| `skills/guizang-ppt-skill/` | guizang-ppt-skill | https://github.com/op7418/guizang-ppt-skill.git | op7418 | main | op7418/guizang-ppt-skill |
| `skills/ljg-skills/` | ljg-skills | https://github.com/lijigang/ljg-skills.git | lijigang | master | lijigang/ljg-skills |
| `skills/andrej-karpathy-skills/` | andrej-karpathy-skills | https://github.com/multica-ai/andrej-karpathy-skills.git | multica-ai | main | multica-ai/andrej-karpathy-skills |
| `skills/impeccable/` | impeccable | https://github.com/pbakaus/impeccable.git | pbakaus | main | pbakaus/impeccable |
| `skills/anthropic-skills/` | skills | https://github.com/anthropics/skills.git | anthropics | main | anthropics/skills |
| `skills/ui-ux-pro-max-skill/` | ui-ux-pro-max-skill | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git | nextlevelbuilder | main | nextlevelbuilder/ui-ux-pro-max-skill |
| `skills/slavingia-skills/` | slavingia-skills | https://github.com/slavingia/skills.git | slavingia | main | slavingia/skills |

## 拉取规则（hard，初始化与同步共用）

- **目标路径**：一律克隆到 `skills/<仓库名>/`，目录名即上表"仓库名"列。`skills/skills/` 不是笔误——mattpocock 的仓库名就叫 `skills`，嵌套在工作区 `skills/` 下。
- **只读**：克隆仓库内的任何文件都不许修改/删除/提交/推送/分支。只作为参考资料。
- **初始化（仓库不存在）**：`git clone <Git 地址> skills/<仓库名>`，克隆默认分支即可，不指定分支。
- **同步（仓库已存在）**：`git -C skills/<仓库名> fetch origin && git -C skills/<仓库名> pull --ff-only`，跟随其检出的分支（多数 `main`，`ljg-skills` 为 `master`）。
- **失败处理**：若 clone 或 `--ff-only` 失败（网络、本地分叉、detached HEAD、uncommitted changes 等），**只报告原因并跳过该仓库**，不做任何后续动作。
- **禁止操作**（即使在失败后也不许跑）：`git reset`、`git checkout --`、`git stash drop`、`git push`、`git commit`、`git merge`、`git rebase`、`--force`，以及任何修改提交/历史的命令。
- **不拉取的子目录**：若 `skills/` 下出现了"仓库表"以外的新目录，agent 应忽略它，不要尝试 clone/拉取，并向用户报告。

## 每仓库内部结构（轻量，每仓库一行；SKILL.md 详情自行进入读取）

| 仓库 | SKILL.md 位置 | 定位 |
|---|---|---|
| superpowers | `skills/superpowers/skills/<name>/SKILL.md`（14 个）| obra 的通用开发流程技能集（brainstorming / debugging / TDD 等）|
| skills | `skills/skills/skills/<name>/SKILL.md`（36 个，含 `deprecated/`）| mattpocock 的技能集，含大量前端/写作技能 |
| obsidian-skills | `skills/obsidian-skills/skills/<name>/SKILL.md`（5 个）| kepano 的 Obsidian 相关技能（defuddle / json-canvas / obsidian-bases 等）|
| gsap-skills | `skills/gsap-skills/skills/<name>/SKILL.md`（8 个）| greensock 的 GSAP 动画技能（core / frameworks / performance 等）|
| gstack | 根 `skills/gstack/SKILL.md` + `skills/gstack/<name>/SKILL.md`（58 个技能目录）| garrytan 的 gstack 技能集，根 SKILL.md 为总入口 |
| guizang-ppt-skill | 根 `skills/guizang-ppt-skill/SKILL.md`（单个技能）| op7418 的网页 PPT 生成技能，单仓库即单技能 |
| ljg-skills | `skills/ljg-skills/skills/<name>/SKILL.md`（23 个）| 词典 / 卡片 / 投资 / 公众号写作等中文技能 |
| andrej-karpathy-skills | `skills/andrej-karpathy-skills/skills/karpathy-guidelines/SKILL.md`（1 个）| multica-ai 的 Karpathy 风格写作指南，单技能 |
| impeccable | `skills/impeccable/.claude/skills/impeccable/SKILL.md`（多 agent 目录镜像，13 处）| pbakaus 的前端设计技能，按 agent（.claude/.cursor/.agents）分目录镜像 |
| anthropic-skills | `skills/anthropic-skills/skills/<name>/SKILL.md`（18 个）| Anthropic 官方示例技能集，含创意设计 / 开发测试 / 企业沟通 / 文档生成（docx/pdf/pptx/xlsx），并附 Agent Skills 规范与模板 |
| ui-ux-pro-max-skill | `skills/ui-ux-pro-max-skill/.claude/skills/<name>/SKILL.md`（7 个，`cli/assets/skills/` 镜像 6 个）| NextLevelBuilder 的 UI/UX 设计智能技能，含 UI 风格 / 配色 / 字体配对 / UX 准则与设计系统生成器，以 Claude Code 插件形式经 npx CLI 跨 19 个 AI 平台分发 |
| slavingia-skills | `skills/slavingia-skills/skills/<name>/SKILL.md`（10 个）| Sahil Lavingia 的极简创业者技能集，基于其著作《The Minimalist Entrepreneur》，覆盖找社区 / 验证想法 / MVP / 定价 / 营销 / 可持续增长等创业全流程，以 Claude Code 插件形式分发 |

> 各仓库根级常带 agent 集成文件（`CLAUDE.md` / `AGENTS.md` / `GEMINI.md` / `CURSOR.md`），记录其被消费方式，跨仓库对比时值得关注。
