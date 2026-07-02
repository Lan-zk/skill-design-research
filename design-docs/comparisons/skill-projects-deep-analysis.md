# 8 个热门 Agent Skill 项目深度分析报告

> 研究对象：`skill-design-project` 工作区下的 8 个开源 agent "skill" 仓库。
> 研究性质：只读分析。所有引用尽量保留文件路径与原文措辞，便于溯源。
> 撰写日期：2026-06-30。

---

## 一、摘要与研究方法

### 1.1 研究对象一览

| 仓库 | 来源 | 领域 | 核心定位 | 规模 |
|---|---|---|---|---|
| `superpowers/` | obra/superpowers | 通用软件工程方法论 | 完整 end-to-end 编码方法论（brainstorm→plan→TDD→review→ship），多 harness 适配 | 中大型，多技能 + 脚本 + hooks |
| `gstack/` | garrytan/gstack | 通用虚拟工程团队 | "23 专家 + 8 工具"虚拟工程团队，Think→Plan→Build→Review→Test→Ship | 超大型，~50 技能 + ~70 CLI + 模板生成 |
| `skills/` | mattpocock/skills | 通用工程 | "Skills For Real Engineers"，小而可组合，强调用户控制，反 process-heavy | 小型，桶式分组 |
| `gsap-skills/` | greensock/gsap-skills | 动画（领域 SDK） | GSAP 官方 API 技能，按 API 领域切分 | 中型，8 技能 + 示例 |
| `guizang-ppt-skill/` | op7418/guizang-ppt-skill | 演示文稿 | 单 HTML 文件网页 PPT，两种锁定视觉风格 + 校验器 | 单体技能，大模板 + 校验器 |
| `obsidian-skills/` | kepano/obsidian-skills | 笔记 / PKM | Obsidian 文件格式技能（.md/.base/.canvas）+ CLI 包装 | 小型，5 技能 |
| `ljg-skills/` | lijigang/ljg-skills | 个人生产力 / 内容创作 | 23 个中文技能，原子自包含，双分支(org/md)分发 | 中大型，23 技能 + 脚本 + 模板 |
| `andrej-karpathy-skills/` | multica-ai/andrej-karpathy-skills | 行为准则 | 单技能，把 Karpathy 推文提炼为 4 条编码行为准则，跨 IDE | 极小，单技能纯提示 |
| `impeccable/` | impeccable（impeccable.style） | 前端设计质量 | "产品化设计技能"：1 源技能 → 编译生成 13 个 agent 分发物 + 确定性反模式检测器（44 规则）+ CLI + 浏览器扩展 + live 迭代 | 超大型 monorepo（bun/astro/wrangler + cli/extension/functions/site/plugin） |

### 1.2 研究方法

- 工作区为只读研究环境，克隆仓库严格只读，产出仅写入 `design-docs/`。
- 采用 3 个并行 Explore agent，按主题分组（通用框架组 / 领域创意组 / 个人集合组）对 8 个仓库做结构化调研，每个 agent 按"顶层结构 → skill 解剖 → 渐进式披露 → 编排协同 → 实现机制 → 架构哲学 → 独有模式"七维度取证。
- 本报告基于上述调研结论撰写，重点回答用户关注的：**实现方式、领域与功能、编排与协同、架构、设计、实现机制**。

### 1.3 核心结论速览

1. **"skill"的共性骨架**：一个目录 + 一个 `SKILL.md`（YAML frontmatter：`name` + `description`）+ 同目录 bundled 资源。`description` 是触发面，bundled 资源承载细节——这是全部 9 个仓库共享的**渐进式披露**范式。
2. **差异主要在四个轴上**：① frontmatter 字段丰富度；② 编排/协同范式；③ 实现机制（纯提示 → 提示+脚本 → 提示+CLI 生态+模板生成 → **编译式跨 agent 代码生成**）；④ 跨 IDE/agent 适配广度。
3. **可清晰分为五类编排范式**：bootstrap 自触发链式（superpowers）、根路由器+/command（gstack）、用户触发编排器+模型触发被编排者（mattpocock）、单技能命令路由+/impeccable 子命令（impeccable）、无编排/单体（其余）。
4. **领域知识编码方式随领域而变**：SDK 类用 API 规则 + 反模式（gsap）；格式类用语法小抄 + CLI 命令（obsidian）；创意类用锁定模板 + 校验器 + 红线（guizang、ljg）；方法论类用流程链 + 反合理化清单（superpowers）；行为类用极简准则 + before/after 示例（karpathy）；**设计质量类用确定性检测器 + 寄存器（register）+ 编译分发**（impeccable）。
5. **impeccable 是谱系的极端**：它把 skill 当作"跨平台发布的产品"而非单文件——单一源 `SKILL.src.md` 经构建编译为 13 个 agent 的可安装技能 + hooks + 子代理，并用同一份 44 规则确定性检测器贯穿 CLI / 浏览器扩展 / agent hooks / 网站。这是本组研究中工程化程度最高的实现。

---

## 二、逐仓库剖析

### 2.1 superpowers（obra/superpowers）

**领域与功能**：通用软件工程方法论。把编码 agent 的工作流改造成"先理解再动手"的纪律性流程：brainstorming（设计）→ using-git-worktrees（隔离工作区）→ writing-plans（任务拆解）→ subagent-driven-development / executing-plans（执行）→ test-driven-development → requesting-code-review → finishing-a-development-branch。

**顶层结构与 agent 集成文件**：
- `CLAUDE.md`（8.7K）开门见山："If You Are an AI Agent — Stop. Read this section before doing anything. This repo has a 94% PR rejection rate."
- `AGENTS.md`（9 字节，仅写 "CLAUDE.md"）。
- `GEMINI.md` 仅 `@./skills/using-superpowers/SKILL.md` 与 `@./skills/using-superpowers/references/gemini-tools.md`。
- `.claude-plugin/plugin.json` 自述："Core skills library for Claude Code: TDD, debugging, collaboration patterns, and proven techniques"。
- 多 harness 适配目录：`.codex-plugin/`、`.cursor-plugin/`、`.kimi-plugin/`、`.opencode/`、`.pi/`。

**skill 解剖与 frontmatter**：每个技能 `skills/<name>/SKILL.md`。frontmatter **极简**，仅 `name` + `description`，无 `disable-model-invocation`、无 `allowed-tools`、无 `triggers`。`writing-skills/SKILL.md` 是风格指南，明确："Two required fields: `name` and `description` ... `description`: Third-person, describes ONLY when to use (NOT what it does). Start with 'Use when...'"。

代表性触发措辞（原文）：
- `using-superpowers`：`"Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response including clarifying questions"`
- `brainstorming`：`"You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior..."`
- `test-driven-development`：`"Use when implementing any feature or bugfix, before writing implementation code"`

**渐进式披露与 bundled 资源**：`references/`（如 `using-superpowers/references/{claude-code,codex,copilot,gemini,pi,antigravity}-tools.md`）、`scripts/`（如 `brainstorming/scripts/server.cjs` ~26K、`subagent-driven-development/scripts/review-package`）、`examples/`、附加提示文件（`implementer-prompt.md`、`task-reviewer-prompt.md`、`code-reviewer.md`）。入口 `SKILL.md` 用相对 markdown 链接指向：`test-driven-development/SKILL.md` → "read [testing-anti-patterns.md](testing-anti-patterns.md)"。入口文件 ~2.6K–26.8K，bundled 文件 ~2K–5.7K。

**编排与协同**：**Bootstrap 自触发 + 链式调用**范式。元技能 `using-superpowers` + `hooks/hooks.json` 声明的 `SessionStart` hook（matcher `startup|clear|compact`，执行 `hooks/session-start` bash 脚本，读取 `using-superpowers/SKILL.md` 注入为 `additionalContext`）共同保证"会话一开始就强制建立 skill 使用纪律"。技能之间在散文中按名调用：brainstorming 收尾调用 writing-plans → subagent-driven-development；后者又要求 using-git-worktrees、writing-plans、requesting-code-review、finishing-a-development-branch，子代理须用 test-driven-development。无 `.claude/agents` 注册表——子代理在技能散文中内联派发。

**实现机制**：以纯 Markdown 提示为主；脚本为 bash / node(.cjs) / TypeScript，由 agent 读取技能后调用，而非 harness 直接执行。无 `allowed-tools`、无 MCP 配置。

**架构与设计哲学**：完整软件开发方法论。理念：TDD、系统化胜过临时性、复杂度削减、证据胜过声明；刻意使用"your human partner"称谓。`writing-skills` 内含大量"Red Flags"反合理化清单，把"技能即塑造行为的代码"作为一等公民，要求压力测试。

**独有模式**：
- 多 harness plugin 目录（Claude/Codex/Cursor/Gemini/Copilot/Kimi/OpenCode/Pi/Antigravity/Factory Droid）。
- 零依赖插件设计，拒绝引入第三方依赖的 PR。
- brainstorming 配本地浏览器 server（`server.cjs`）做可视化伴侣。

---

### 2.2 gstack（garrytan/gstack）

**领域与功能**：通用虚拟工程团队。Garry Tan 的"23 专家 + 8 工具"，把 Claude Code 变成"CEO / eng manager / designer / reviewer / QA lead / security officer / release engineer"的虚拟团队，覆盖 Think→Plan→Build→Review→Test→Ship→Reflect。

**顶层结构与 agent 集成文件**：
- `CLAUDE.md`（59K，巨型贡献/开发指南），含 "Skill routing" 段："When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill."
- `AGENTS.md`（公开技能目录）、`SKILL.md` + `SKILL.md.tmpl`（生成的根路由技能）、`ARCHITECTURE.md`、`ETHOS.md`、`DESIGN.md`、`conductor.json`。
- ~50 个顶层技能目录（`office-hours/`、`ship/`、`qa/`、`browse/`、`codex/`、`investigate/`…）+ `bin/`、`scripts/`、`lib/`、`browse/`、`design/`、`hosts/`、`test/`、`supabase/`。
- 无 `.claude-plugin/plugin.json`，作为 git clone 安装到 `~/.claude/skills/gstack`。

**skill 解剖与 frontmatter**：技能由 `.tmpl` 模板**生成**为 `SKILL.md`，`CLAUDE.md` 警告 "Edit the template, not the output."。frontmatter **最丰富**：`name`、`description`、`version`、`preamble-tier`（1–4，控制注入多少共享前言）、`allowed-tools:` 列表（如 `Bash, Read, Write, Edit, Grep, Glob, Agent, AskUserQuestion, WebSearch`）、`triggers:` 用户短语列表、`hooks:`（如 `PreToolUse` freeze 边界检查）、`gbrain:` 上下文查询块。

代表性触发措辞（原文）：
- 根 `gstack`：`"Router for the gstack skill suite. (gstack)"`
- `ship`：`"Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. (gstack)"`
- `investigate`：`"Systematic debugging with root cause investigation. (gstack)"`

**渐进式披露与 bundled 资源**：大型技能用 `sections/` 子目录 + `manifest.json` + 分节 `.md`（如 `ship/sections/{adversarial,changelog,greptile,plan-completion,pr-body,review-army,test-coverage,tests}.md`）。共享 TypeScript 生成器 `scripts/gen-skill-docs.ts` 解析 `{{PREAMBLE}}`、`{{REDACT_TAXONOMY_TABLE}}` 等占位符。bundled CLI 在 `bin/`（~70 个可执行）。入口 `SKILL.md` ~29K–127K，但根模板仅 ~3K——大部分内容由解析器注入。

**编排与协同**：**根路由器 + /command 路由表**范式。根 `gstack` skill 含 "Route first" 大路由表：用户描述新想法 → `/office-hours`；报告 bug → `/investigate`；要发布 → `/ship`；要测站点 → `/qa`。技能间按 `/skill-name` 散文互调：`ask-matt` 映射 `/grill-with-docs` → `/handoff`/`/prototype` → `/to-prd` → `/to-issues` → `/implement`；`improve-codebase-architecture` 调用 `/codebase-design`、`/grilling`、`/domain-modeling`。跨会话记忆靠 `bin/gstack-decision-log` / `bin/gstack-decision-search` 与 gbrain。`investigate` 声明 `PreToolUse` hook 检查 freeze 边界（`freeze/bin/check-freeze.sh`）。

**实现机制**：提示为 Markdown，但每个技能含大段可执行 bash 前言（会话初始化、遥测、更新检查、gbrain 检测、plan-mode 检测）。重度使用 `bin/` 的 bash/TypeScript 可执行（`gstack-config`、`gstack-slug`、`gstack-update-check`、`gstack-brain-sync`…）。技能通过 `$B <command>` 调用 browse 二进制。显式 `allowed-tools` 收敛工具面。

**架构与设计哲学**："虚拟工程团队"。`ETHOS.md`：Boil the Ocean、Search Before Building、三层知识。生成式技能文档 + 类型化解析器管道（`scripts/resolvers/`），160KB token 上限告警。preamble-tier 自动注入共享 onboarding/遥测/plan-mode 散文。

**独有模式**：
- 模板生成 + 解析器管道的"编译式"技能工程。
- ~70 CLI 的工具生态（redaction、遥测、gbrain sync、iOS QA daemon、browser、security dashboard）。
- gbrain 跨会话持久记忆（`setup-gbrain`、`sync-gbrain`）。
- `/codex` 技能调度 OpenAI Codex CLI 做"第二意见"；`/pair-agent` 跨 agent 浏览器协同。
- iOS 真机 QA 技能（`ios-qa`、`ios-fix`，Mac daemon + Tailscale）。
- 浏览器侧栏 agent 的 prompt-injection 防御栈（ML 分类器）。

---

### 2.3 skills / mattpocock（mattpocock/skills）

**领域与功能**：通用工程。定位 "Skills For Real Engineers"，明确反对 process-heavy 框架："Approaches like GSD, BMAD, and Spec-Kit try to help by owning the process... take away your control and make bugs in the process hard to resolve. These skills are designed to be small, easy to adapt, and composable." 针对四类失败模式：对齐缺失（grill-me / grill-with-docs）、agent 啰嗦（CONTEXT.md 共享语言）、代码不工作（tdd / diagnosing-bugs）、泥球架构（improve-codebase-architecture / codebase-design）。

**顶层结构与 agent 集成文件**：
- `CLAUDE.md`（短）：描述桶布局与 README/plugin 规则——"Skills are organized into bucket folders under `skills/`: engineering/, productivity/, misc/, personal/, in-progress/, deprecated/"。
- `CONTEXT.md`（领域语言：Issue tracker、Issue、Triage role）、`README.md`（公开目录）、`.claude-plugin/plugin.json`、`package.json`、`CHANGELOG.md`。无 `AGENTS.md`/`GEMINI.md`。

**skill 解剖与 frontmatter**：手写 `skills/<bucket>/<skill>/SKILL.md`。frontmatter **极简偏中**：`name`、`description`、对用户触发技能加 `disable-model-invocation: true`；无 `allowed-tools`、`triggers`、`version`、`preamble-tier`。`docs/invocation.md` 解释："User-invoked — reachable only by the human typing its name. Set `disable-model-invocation: true`... Model-invoked — reachable by model or user."

代表性触发措辞（原文）：
- `ask-matt`：`"Ask which skill or flow fits your situation. A router over the user-invocable skills in this repo."`
- `tdd`：`"Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions 'red-green-refactor', or wants integration tests."`
- `diagnosing-bugs`：`"Diagnosis loop for hard bugs and performance regressions. Use when the user says 'diagnose'/'debug this'..."`

**渐进式披露与 bundled 资源**：bundled 极简、同目录共置。`tdd/SKILL.md` 链到 `tests.md`、`mocking.md`、`refactoring.md`；`setup-matt-pocock-skills/` 含种子模板（`issue-tracker-github.md`、`triage-labels.md`、`domain.md`）；`improve-codebase-architecture/HTML-REPORT.md` 是生成报告脚手架。入口 ~3K–9.6K，bundled 同量级（`writing-great-skills/GLOSSARY.md` ~17.7K 最大）。

**编排与协同**：**用户触发编排器 + 模型触发被编排者**范式。`ask-matt` 文档化主流程：`/grill-with-docs` → 可选 `/handoff`/`/prototype` → `/to-prd` → `/to-issues` → 新会话 `/implement`。`grill-me` 是薄封装："Run a `/grilling` session."；`grill-with-docs`："Run a `/grilling` session, using the `/domain-modeling` skill." 无 `.claude/agents` 注册表，无 hooks。

**实现机制**：几乎全纯 Markdown 提示。少量 shell 脚本：`scripts/link-skills.sh`、`scripts/list-skills.sh`、`diagnosing-bugs/scripts/hitl-loop.template.sh`、`git-guardrails-claude-code/scripts/block-dangerous-git.sh`。无技能内 TS/Node，无 `allowed-tools`。`improve-codebase-architecture` 使用 `Agent` 工具（`subagent_type=Explore`）。

**架构与设计哲学**：小、可组合、用户可控。显式区分用户触发 vs 模型触发技能；用户触发技能编排模型触发技能。桶式分组，README 强制只 `engineering/`、`productivity/`、`misc/` 进 `plugin.json`。强调 `CONTEXT.md` + ADR 作为共享领域语言。用 changesets 版本管理。

**独有模式**：
- 用户/模型触发二分 + 编排器/被编排者分层。
- 与 gstack/superpowers 形成对照：刻意"小而可控"。
- CONTEXT.md 共享词汇表驱动一致性。

---

### 2.4 gsap-skills（greensock/gsap-skills）

**领域与功能**：动画领域 SDK 官方技能。GSAP（GreenSock Animation Platform）官方出品，按 API 领域切分为 8 个技能：`gsap-core`、`gsap-timeline`、`gsap-scrolltrigger`、`gsap-plugins`、`gsap-utils`、`gsap-react`、`gsap-performance`、`gsap-frameworks`。

**顶层结构与 agent 集成文件**：`AGENTS.md`（主，定义结构/frontmatter 规则/约定）、`CLAUDE.md` 与 `GEMINI.md`（仅 `AGENTS.md` 重定向）、`.github/copilot-instructions.md`（因 Copilot 不加载 Cursor/Claude 技能文件，故单独提供）、`.claude-plugin/plugin.json`、`.cursor-plugin/plugin.json`（双 plugin）。`assets/`（SVG）、`examples/`（vanilla/react/vue/nuxt 可运行示例）、`skills/llms.txt`（agent 索引）。

**skill 解剖与 frontmatter**：`skills/<name>/SKILL.md`，目录名须与 frontmatter `name` 完全一致。frontmatter **极简**：`name`、`description`、`license`（恒为 MIT）。无 `allowed-tools`、`disable-model-invocation`、`hooks`。

代表性触发措辞（原文）：
- `gsap-core`：`"Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia()... Use when the user asks for a JavaScript animation library, animation in React/Vue/vanilla, GSAP tweens, easing, basic animation, responsive or reduced-motion animation..."`
- `gsap-scrolltrigger`：`"Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building or recommending scroll-based animation, parallax, pinned sections..."`
- `gsap-react`：`"Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js..."`

**渐进式披露与 bundled 资源**：每个 SKILL.md 末尾 "Related skills" 链到兄弟技能。长参考内容控制在入口文件内（~79–433 行），`skills/llms.txt`（39 行）作 agent 发现/触发索引。`examples/` 为可运行参考代码（`examples/react/App.jsx`、`examples/vue/app.vue`、`examples/nuxt/app/composables/useGSAP.ts`）。

**编排与协同**：**无编排**。无路由/调度技能，技能间不互相调用。发现靠 `npx skills` CLI 或 marketplace 扫描 `skills/`，`llms.txt` 充当人可读索引供 agent 选技能。无子代理、无 hooks、无注册表。

**实现机制**：**纯 Markdown 提示**。无技能内可执行脚本；examples 是可运行参考但不被技能调用；无 MCP、无 `allowed-tools`。领域知识编码为：API 用法规则（transform 别名、autoAlpha、gsap.matchMedia、ScrollTrigger 配置表、插件注册）、React/Vue/Nuxt 复制粘贴代码模式、反模式（"Do Not" 段）。

**架构与设计哲学**：模块化、按 API 领域切分（`gsap-<domain>`）。`AGENTS.md` 要求聚焦正确 API 用法/陷阱/清理，第三人称描述，SKILL.md 控制在 ~500 行内。

**独有模式**：
- 强调清理（`ctx.revert()`、`ScrollTrigger.refresh()`、unmount kill）。
- 许可护栏：`gsap-plugins/SKILL.md` 反复声明 Club GSAP 插件已免费，警告 agent 不要生成 `.npmrc` auth token 或私有 registry 指令。
- `llms.txt` 显式发现/触发索引。
- 双 plugin（Claude + Cursor）+ Copilot 专用 instructions 的三端适配。

---

### 2.5 guizang-ppt-skill（op7418/guizang-ppt-skill）

**领域与功能**：演示文稿。生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。两种锁定视觉风格：①"电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色）；②"瑞士国际主义"（无衬线 + 网格点阵 + IKB/柠檬黄/柠檬绿/安全橙高亮）。

**顶层结构与 agent 集成文件**：**仓库本身即单技能**，根 `SKILL.md` + `README.md`/`README.en.md` + `assets/`（`template.html` 40K、`template-swiss.html` 102K、`motion.min.js` 63K、`screenshot-backgrounds/` WebP）+ `references/`（`checklist.md` 568 行、`components.md`、`layouts.md` 667 行、`layouts-swiss.md`、`themes.md`、`themes-swiss.md`、`swiss-layout-lock.md`、`screenshot-framing.md`、`image-prompts.md`）+ `scripts/validate-swiss-deck.mjs`。无 `CLAUDE.md`/`AGENTS.md`/plugin manifest。

**skill 解剖与 frontmatter**：根 `SKILL.md`（541 行）。frontmatter `name: guizang-ppt-skill` + `description`，无 `license`/`allowed-tools`/`disable-model-invocation`。触发措辞（原文）："生成横向翻页网页 PPT（单 HTML 文件）...当用户需要制作分享 / 演讲 / 发布会风格的网页 PPT，或提到'杂志风 PPT'、'瑞士风 PPT'、'Swiss Style'、'horizontal swipe deck'时使用。"

**渐进式披露与 bundled 资源**：入口 `SKILL.md` 大但几乎全部委派给 bundled。指向方式：Step 2 `cp '<SKILL_ROOT>/assets/template.html' '项目/XXX/ppt/index.html'`；布局选择"风格 A → `references/layouts.md`"、"风格 B → 先读 `references/swiss-layout-lock.md`，再读 `references/layouts-swiss.md`"；主题"打开 `references/themes.md`，找到对应主题的 `:root` 块"；交付前"运行 `node <SKILL_ROOT>/scripts/validate-swiss-deck.mjs index.html`"。

**编排与协同**：**单体工作流，无编排**。无技能间调用/注册表/路由/子代理。流程为单体步骤推进：选风格 → 澄清 → 拷模板 → 填布局 → 校验。

**实现机制**：**Markdown 提示 + 可执行脚本 + 模板**。一个 Node 校验器 `validate-swiss-deck.mjs`（110 行，静态校验 Swiss 风：`data-layout` 须在 `S01`–`S22`，拒 P23/P24、SVG text、缺图位、居中标题等）。SKILL.md 内含 bash 拷贝命令。无 MCP/`allowed-tools`/hooks。领域知识编码为：HTML/CSS 模板（内嵌 WebGL shader、Motion One 动画、导航 JS、设计 token）、布局骨架（可粘贴 `<section>` 块）、主题预设（硬规则"不允许用户自定义 hex 值"）、P0/P1/P2/P3 质量清单、截图构图指南 + WebP 背景。

**架构与设计哲学**：单体、强观点、审美优先。两套不兼容锁定视觉系统。核心理念（原文）："克制优于炫技 — WebGL 背景只在 hero 页透出"、"结构优于装饰 — 不用阴影、不用浮动卡片..."、"瑞士风必须守版式 — Style B 优先还原原始 22P 版式"。

**独有模式**：
- 单 HTML 文件交付，无构建步骤。
- 两套不兼容模板，显式禁止混用。
- Swiss 布局锁 + 校验器：仅 22 个注册布局（`S01`–`S22`），每页须 `data-layout`，校验器强制。
- WebGL 背景 + Motion One 动画，`B` 键低功耗回退。
- CleanShot 式截图构图 + 内置 WebP 背景。
- Codex 图像生成工作流（`references/image-prompts.md`，GPT-Image / GPT-M 2.0）。

---

### 2.6 obsidian-skills（kepano/obsidian-skills）

**领域与功能**：笔记 / PKM。Obsidian 文件格式技能：`obsidian-markdown`（.md）、`obsidian-bases`（.base）、`json-canvas`（.canvas）、`obsidian-cli`（CLI 包装）、`defuddle`（网页→markdown 提取）。

**顶层结构与 agent 集成文件**：无 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`。仅 `.claude-plugin/plugin.json`（`name: obsidian`，作者 Steph Ango）+ `marketplace.json`。

**skill 解剖与 frontmatter**：`skills/<name>/SKILL.md`。frontmatter **极简**：`name` + `description`，无 `license`/`allowed-tools`/`disable-model-invocation`。代表性触发措辞：
- `obsidian-markdown`：`"Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties... Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds..."`
- `obsidian-bases`：`"Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files..."`
- `obsidian-cli`：`"Interact with Obsidian vaults using the Obsidian CLI to read, create, search... Use when the user asks to interact with their Obsidian vault..."`

**渐进式披露与 bundled 资源**：入口 SKILL.md 106–499 行，bundled 为**小抄式**单主题 reference（`references/FUNCTIONS_REFERENCE.md` 173 行、`EXAMPLES.md` 329 行、`CALLOUTS.md` 58 行、`EMBEDS.md` 70 行、`PROPERTIES.md` 61 行）。入口用相对链接指向："See [PROPERTIES.md](references/PROPERTIES.md)"。

**编排与协同**：**无编排**。5 个独立技能，无互相调用。仅 `obsidian-cli` 触达外部 CLI。无路由/注册表/子代理/hooks。

**实现机制**：4 个纯 Markdown 提示；`obsidian-cli` 是**外部 CLI 包装**（文档化 `obsidian create name="..."`、`obsidian search query="..."`、`obsidian daily:append`、`obsidian plugin:reload`、`obsidian eval` 等命令）。`defuddle` 推荐外部 CLI（`defuddle parse <url> --md`）作为 WebFetch 的优先替代。无脚本/无 MCP/无 `allowed-tools`。领域知识编码为：语法参考（wikilinks、embeds、callouts、properties、JSON Canvas schema、Base 公式函数）、CLI 命令模式、工作流（六步笔记工作流、Canvas 创建/编辑/校验、Base 文件 schema）。

**架构与设计哲学**：按文件格式组织的模块化技能，每种 Obsidian 制品一个技能 + CLI 包装 + 网页提取器。刻意简洁、参考手册式。README："These skills follow the Agent Skills specification so they can be used by any skills-compatible agent, including Claude Code, Codex, and Open Code."

**独有模式**：
- `obsidian-cli` 包装真实 CLI 而非生成代码。
- `defuddle` 推荐外部 CLI 替代 WebFetch。
- reference 文件小而单主题（小抄式）。
- vault 导向安装（Claude Code 加到 vault 内 `/.claude`）。

---

### 2.7 ljg-skills（lijigang/ljg-skills）

**领域与功能**：个人生产力 / 内容创作。23 个中文技能，覆盖论文阅读（`ljg-paper`）、写作（`ljg-writes`、`ljg-plain`）、概念剖析（`ljg-learn`、`ljg-think`、`ljg-rank`）、视觉铸图（`ljg-card`、`ljg-library`、`ljg-map`、`ljg-present`）、旅行研究（`ljg-travel`）、关系分析（`ljg-relationship`）等。

**顶层结构与 agent 集成文件**：`CLAUDE.md`（自述"This is a personal Claude Code skills repository..."）、`.claude-plugin/plugin.json`（`version 1.17.41`）、`marketplace.json`（categories: Productivity/Research/Content Creation）、`README.md`、`scripts/install.sh`、`scripts/sync-push.sh`。无 `AGENTS.md`/`GEMINI.md`。

**skill 解剖与 frontmatter**：`skills/ljg-<name>/SKILL.md`。frontmatter：`name`、`description`、`user_invocable`（`true|false`，控制 `/skill-name` 触发）、`version`（部分技能省略）。无 `allowed-tools`/`disable-model-invocation`。代表性触发措辞（原文）：
- `ljg-card`："Content caster (铸). Transforms content into PNG visuals. Seven molds... Use when user says '铸', 'cast', '做成图', '做成卡片', '做成信息图', '做成海报', '视觉笔记', 'sketchnote', '杂志', 'editorial', '漫画', 'comic', 'manga', '白板', 'whiteboard', '大字', '附件图', 'big fonts', '小红书卡片'."
- `ljg-plain`："Cognitive atom: Plain (白). Rewrites any content so a smart 12-year-old groks it... Use when user says '白话说', '说人话', '解释一下', 'plain', 'grok'."
- `ljg-paper`："Paper reader for non-academics... seven-beat spine (主角 / 困境 / 旧路 / 转折 / 解法 / 结局 / 内核)... Trigger words: '读论文', '讲论文'..."

**渐进式披露与 bundled 资源**：入口 `SKILL.md` 小，bundled 丰富（总入口 ~215KB，bundled ~653KB，约 3 倍）。`references/`（详细指令/模板/品味指南）、`assets/`（HTML 模板、图片、Node/Python 脚本）、`scripts/`、`Tools/`、`Workflows/`。例：`ljg-card/SKILL.md` 4.1KB，而 `references/mode-sketchnote.md` 41.3KB、`assets/logo.png` 326KB。入口显式指向："执行任何模具前，先 Read `references/taste.md`"、"按 `references/template.org`"。

**编排与协同**：**workflow 技能串联 + 元技能发现**（半编排）。`ljg-paper-flow` 调 `ljg-paper` 再 `ljg-library`，用 Agent 子代理并行处理多篇论文；`ljg-word-flow` 调 `ljg-word` 再 `ljg-card -i`。`ljg-skill-map` 扫描 `~/.claude/skills/` 渲染 ASCII 概览（扫描器 `scripts/scan.sh`）。`ljg-push` 同步到 GitHub 双分支并自动 bump 版本、org→md 转换。无 `.claude/agents`/hooks/MCP。

**实现机制**：以中文 Markdown 提示为主 + 可执行脚本。Bash（`install.sh`、`sync-push.sh`、`scan.sh`、`Push.sh`）；Node（`ljg-card/assets/capture.js` Playwright 截图 HTML→PNG，依赖 `playwright`）；Python（`extract_color.py`、`gen_illustration.py` 调 `api.marswave.ai` 图像生成，用 `LISTENHUB_API_KEY`）。无 `allowed-tools`，靠自然语言约束工具。双分支输出：`master` 产 org-mode，`md` 产 Markdown，`ljg-push` 负责 org→md 转换。

**架构与设计哲学**：原子自包含技能（CLAUDE.md："Skills are atomic units—each skill directory is self-contained."）。中文工艺语言，善用隐喻（"铸"、"追本之箭"、"取景框"）。输出约定：org-mode + Denote 文件名（`{timestamp}--{title}__{type}.org`）、ASCII only、单星号粗体、输出到 `~/Documents/notes/`。反 AI 视觉审美：`references/taste.md` 明禁 Inter 字体、纯黑、居中 hero、三栏卡片、"AI 紫蓝"、假数据、AI 营销腔。

**独有模式**：
- 双分支分发（master org / md markdown）+ 自动化推送管道。
- 视觉"铸图"技能组合 HTML 模板 + Playwright 截图 + AI 图像生成。
- 硬质量护栏：红线、清单、显式自验步骤（"写完默读"、"Read 自验"）。
- 强叙事工艺：`ljg-paper` 七拍故事结构 + 严格标题约束（6–15 中文字符、零英文术语）。
- `ljg-push` README 硬门：本地 `ljg-*` 技能若未在 `README.md` 列出则脚本中止。

---

### 2.8 andrej-karpathy-skills（multica-ai/andrej-karpathy-skills）

**领域与功能**：行为准则。单技能，把 Andrej Karpathy 关于 LLM 编码的观察提炼为 4 条行为准则，降低常见 LLM 编码错误（错误假设、过度复杂、无关改动、薄弱成功标准）。

**顶层结构与 agent 集成文件**：`CLAUDE.md`（行为指南，"Merge with project-specific instructions as needed"）、`CURSOR.md`（Cursor 用法）、`.cursor/rules/karpathy-guidelines.mdc`（`alwaysApply: true`）、`.claude-plugin/plugin.json`（`version 1.0.0`）、`marketplace.json`（category: workflow）、`README.md`/`README.zh.md`、`EXAMPLES.md`（15KB before/after 示例）。无 `AGENTS.md`/`GEMINI.md`。

**skill 解剖与 frontmatter**：仅 `skills/karpathy-guidelines/SKILL.md`（2.5KB）。frontmatter：`name`、`description`、`license: MIT`。触发措辞（原文）："Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria."

**渐进式披露与 bundled 资源**：技能几乎全在 `SKILL.md` 内，技能内**无** references/assets/scripts。bundled 文档在仓库根：`CLAUDE.md`（精简版）、`README.md`（完整解释 + 权衡说明）、`README.zh.md`、`EXAMPLES.md`（~15KB，每条原则的 before/after Python 示例，远大于技能本身）、`.cursor/rules/*.mdc`。

**编排与协同**：**无编排**。单技能仓库，无技能间调用/路由/注册表/子代理/hooks/MCP。Cursor 的 `alwaysApply: true` 使准则在 Cursor 中自动生效，无需 slash 触发。

**实现机制**：**纯 Markdown 提示**，无任何可执行脚本/模板/`allowed-tools`。跨工具交付：Claude Code 走 plugin marketplace 或拷 `CLAUDE.md`；Cursor 走 `.cursor/rules/*.mdc`。Karpathy 风格编码为 4 条祈使句原则（原文）：
1. Think Before Coding："Don't assume. Don't hide confusion. Surface tradeoffs."
2. Simplicity First："Minimum code that solves the problem. Nothing speculative."
3. Surgical Changes："Touch only what you must. Clean up only your own mess."
4. Goal-Driven Execution："Define success criteria. Loop until verified."

并直引 Karpathy："LLMs are exceptionally good at looping until they meet specific goals... Don't tell it what to do, give it success criteria and watch it go."，附推文来源 `https://x.com/karpathy/status/2015883857489522876`。

**架构与设计哲学**：行为护栏而非工具。`Tradeoff` 注："These guidelines bias toward caution over speed. For trivial tasks, use judgment." 通用可合并，设计为并入项目 `CLAUDE.md` 或 Cursor 自动应用。

**独有模式**：
- 单技能、跨 IDE 仓库（Claude plugin + Cursor rule 双交付）。
- `EXAMPLES.md` 作主要教学载体（~15KB before/after 示例）。
- Cursor `alwaysApply: true` 免触发常驻。
- 极简表面积：无 bundled 脚本/参考/资产，能力即提示文本。

---

### 2.9 impeccable（impeccable.style）— 编译式跨 agent 产品化设计技能

> 本仓库实现方式与其余 8 个截然不同，是本组研究中工程化程度最高的样本，单独详述。

**领域与功能**：前端设计质量。README 自述："Design guidance for AI coding agents. 1 skill, 23 commands, live browser iteration, and 44 deterministic detector rules for AI-generated frontend design." 核心论点：当今编码模型训练自同一批 SaaS 模板，视觉上趋同于同一套 cliché（Inter 字体、紫蓝渐变、嵌套卡片、灰字配彩色背景、圆角图标砖），团队需要**共享的、有观点的设计词汇** + **确定性护栏**把 AI 输出导向专业设计。名字即成功标准——产出界面不应"看起来像 AI 做的"。源技能内含显式 **"AI slop test"**（`skill/SKILL.src.md`）："If someone could look at this interface and say 'AI made that' without doubt, it's failed." `PRODUCT.md` 定义双成功标准：① 用户能用设计精度而非模糊散文 steering AI；② AI 产出的界面能通过专业设计评审。

**顶层结构与 agent 集成文件**：**monorepo**，刻意区分**源**（创作面）与**生成的分发物**（提交到各 harness 目录）。

| 目录 | 角色 |
|---|---|
| `skill/` | **唯一源真相**：`SKILL.src.md`（注意是 `.src.md`，非 `SKILL.md`）+ `reference/<command>.md` + `scripts/*.mjs` + `agents/*.md` |
| `.claude/ .cursor/ .codex/ .gemini/ .agents/ .github/ .kiro/ .opencode/ .pi/ .qoder/ .rovodev/ .trae/ .trae-cn/` | **生成的分发物**：每个 agent 的技能载荷 + hook 清单，提交到 main 以便直接安装 |
| `cli/` | **npm CLI**：`cli/bin/cli.js` 入口 + `cli/engine/` 反模式检测引擎；命令含 `detect / ignores / install / link / update / check` |
| `extension/` | **浏览器扩展**（Chrome/Firefox DevTools，Manifest v3），在实时页面跑检测器 |
| `functions/` + `wrangler.toml` | **Cloudflare Pages Functions**，提供下载 API（`/api/download/...`） |
| `site/` + `astro.config.mjs` | **Astro 静态营销/文档站**，部署到 Cloudflare Pages |
| `plugin/` | 生成的 **Claude Code marketplace 子树**（~0.3MB），由 `.claude-plugin/` 构建 |
| `.claude-plugin/` | 源 marketplace manifest（`plugin.json` 当前 `3.8.0`、`marketplace.json`） |
| `scripts/` | 构建系统、transformer、release、OG 图生成、测试编排 |
| `demos/` | 示例项目（`landing-demo/`），演示 PRODUCT.md + DESIGN.md 工作流 |
| `.impeccable/` | 消费项目的本地运行时/配置目录（`config.json`、`design.json`、`live/config.json`） |
| `tests/` | 大型测试套件（单元、检测器 fixture、live E2E、skill-behavior LLM eval） |
| `skills-lock.json` | 当前为空 stub（`{ "version": 1, "skills": {} }`），被 `pin.mjs` 用作项目根标记，预留未来 lock 语义 |

**为什么是 `skill/` 而非 `skills/`、`SKILL.src.md` 而非 `SKILL.md`**：`scripts/lib/utils.js` 解释——`vercel-labs/skills` CLI 通过查找字面 `SKILL.md` 发现技能并逐字拷贝该目录。若 `skill/SKILL.md` 存在，`npx skills` 会安装**未编译源**（含未解析的 `{{placeholders}}`、无 vendored 检测器）。命名 `SKILL.src.md` 使其对发现机制隐形，CLI 转而落到已编译的 harness 目录。

**skill 解剖与 frontmatter**：技能**不是纯 markdown**，而是带自定义源格式的编译产物。源 `SKILL.src.md` frontmatter：
```yaml
name: impeccable
description: "Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface..."
argument-hint: "[{{command_hint}}] [target]"
user-invocable: true
allowed-tools:
  - Bash(npx impeccable *)
  - Bash(node {{scripts_path}}/*)
license: Apache 2.0
```

**自定义占位符系统**（构建时按目标解析，`scripts/lib/utils.js`）：`{{model}}`（Claude/GPT/Gemini）、`{{config_file}}`（CLAUDE.md/.cursorrules/AGENTS.md）、`{{ask_instruction}}`、`{{command_prefix}}`（多数 `/`，Codex `$`）、`{{available_commands}}`、`{{scripts_path}}`。

**provider 条件块**：源支持标签化 markdown 块按目标保留/剥离，如 `<codex>...</codex>`，由 `compileProviderBlocks` 处理——Codex 专属的 tracking 缺陷警告只出现在 `.agents/skills/impeccable/SKILL.md`，从 `.claude/` 版本中删除。

**构建/编译管道**（`scripts/build.js`）：① `readSourceFiles` 解析源 + references + scripts + agents；② `createTransformer`（`transformers/factory.js`）对每个 provider 跑一次；③ 每个 transformer 生成目标 frontmatter、解析占位符、编译条件块、剥离规则标记 `<!-- rule:id -->`、拷脚本、emit hook 清单与子代理；④ `assembleUniversal` 合并为 `dist/universal/`；⑤ `createAllZips` 产出 per-provider + universal ZIP；⑥ `generateApiData` 写静态 JSON；⑦ `generateCFConfig` 写 Cloudflare `_headers/_redirects/_routes.json`；⑧ 同步生成物到根 harness 目录并重建 `plugin/`。构建还校验：frontmatter 长度、plugin 版本一致性、README/AGENTS/plugin 中的命令/检测数、prose 质量（AI 营销腔禁用词表）、主题护栏（无意外 light-mode 默认）。

**多 agent 分发**：13 个 provider 配置（`scripts/lib/transformers/providers.js`）：`cursor / claude-code / gemini / codex / agents / github / kiro / opencode / pi / qoder / trae-cn / trae / rovo-dev`。一份源变多目标的机制：provider 配置声明 `configDir`、`providerTags`、`frontmatterFields`、`placeholderProvider`、`agentFormat`、`emitHooks` 等；transformer 据此写出 `<configDir>/skills/impeccable/SKILL.md` + references + scripts + agents + hook 清单。具体差异示例：
- **Claude Code**：保留 `user-invocable`/`allowed-tools`，脚本路径 `.claude/skills/impeccable/scripts/*`。
- **Cursor**：无 `user-invocable`/`allowed-tools`，路径 `.cursor/skills/impeccable/scripts/*`，含 `preToolUse` 写入门控 hook。
- **Codex/.agents**：用 `$` 前缀与 "GPT"，保留 `<codex>` 块内容。
- hook 清单按 provider 生成（`.claude/settings.local.json`→PostToolUse、`.cursor/hooks.json`→preToolUse、`.codex/hooks.json`、`.github/hooks/impeccable.json`）。

**实现机制**：TypeScript/JavaScript ESM（Node 24+，bun 用于开发/构建）。`package.json` `"type": "module"`，`bin: impeccable`，检测器亦作库导出。构建工具：bun、Astro、Biome、Wrangler/Cloudflare Pages、Playwright（E2E + OG 图）、marked/css-tree/css-select/htmlparser2（解析）、fflate（CLI 安装器 ZIP）。**无 MCP server**——集成面是 agent harness 技能 + 独立 CLI + 浏览器扩展。安装：`npx impeccable install` → 检测 harness 目录 → 下载 `universal.zip` → 解压 `<configDir>` → 安装原生 hook 清单 → 用户键入 `/impeccable <command> [target]` → 跑 `context.mjs` 加载 `reference/<command>.md`。注册/市场：npm（CLI）、Claude Code Marketplace、GitHub releases（`skill-v*`/`cli-v*`/`ext-v*` 独立版本）、网站下载 API。

**编排与协同**：**单技能命令路由**——一个 user-invocable 技能 `/impeccable` 下 23 个子命令，路由表在 `SKILL.src.md`。调用链：`context.mjs` 加载 PRODUCT.md/DESIGN.md（或分支到 init）→ 加载 `reference/<command>.md` → 加载寄存器 reference（brand.md/product.md）→ 执行，常调辅助脚本（`detect.mjs`/`palette.mjs`/`critique-storage.mjs`）。`pin.mjs` 创建轻量重定向 shim 让 `/audit` 触发 `/impeccable audit`。**hook 形成运行时反馈环**：Claude/Codex/Copilot 的 PostToolUse hook 在编辑 UI 文件后把检测结果作为 system reminder 注入；Cursor 的 preToolUse hook 在检测到问题时**阻断**拟议写入。**live 模式**（`reference/live.md`）最复杂：`live.mjs` 启 helper HTTP server → 用户浏览器选元素 → agent 轮询 `live-poll.mjs` 的 `generate/steer/accept/discard/exit` 事件 → `generate` 时写变体、HMR 热替换 → `accept` 时 `live-accept.mjs` 应用并清理。支持 Vite/Next.js/SvelteKit/Astro/Nuxt/静态 HTML。

**架构与设计哲学**：把 skill 当作"跨平台发布的产品"。`DESIGN.md` 品牌原则：① Practice what you preach（站点须通过自己的反模式检测）；② Show, don't tell（站点即 demo）；③ Expert confidence（直接、有观点、果断，不 hedge）；④ Editorial over marketing；⑤ Purposeful restraint。这解释了为何不是纯 markdown：确定性检测器（44 规则）因散文易被模型遗忘；跨 agent 构建系统因各 harness frontmatter/命令前缀/hook 格式不同；hooks 为在编辑时闭环而非只在评审时；live 模式因设计迭代是视觉非文本；CLI+扩展+站为让同一设计智能可于任一 harness 外使用。`AGENTS.md` 总结："`skill/` is the source of truth... root harness folders... and `plugin/` stay tracked so `main` remains installable... They are still generated artifacts."

**独有模式**（区别于其余 8 仓库的关键）：
1. **编译式技能源**：`SKILL.src.md` 不可直接安装，按目标 transform；自定义占位符 + provider 条件标签。
2. **跨 agent 代码生成 + 提交生成物**：构建 emit 13+ provider 目录 + universal bundle，生成物提交到 main 以便直接安装（与其余仓库"手写即最终"形成对照）。
3. **同一确定性检测器贯穿多面**：`cli/engine/registry/antipatterns.mjs`（44 规则）同时驱动 `npx impeccable detect`、agent hooks、浏览器扩展、站点 overlay、首页规则计数。
4. **构建内严格质量门**：校验陈旧数字计数、plugin 版本漂移、AI 营销腔禁用词、主题回归。
5. **寄存器（register）概念**：每个任务要么 brand（设计即产品）要么 product（设计服务产品），`PRODUCT.md` 的 `## Register` 决定读哪个 reference。
6. **live 浏览器迭代模式**：完整握手/轮询/接受/清理环 + HMR 变体热替换。
7. **agent 子代理**：源定义辅助 agent（如 asset-producer），bundled 进 Codex/Claude agent 目录。
8. **`skills-lock.json` 根标记**：当前空 lockfile，已接入 `pin.mjs` 作项目根信号，预留未来 pin 语义。
9. **按组件独立版本**：CLI/skill/extension 各自版本，release tag `skill-v*`/`cli-v*`/`ext-v*`。
10. **本地工件保留**：构建前 stash `config.json` 等以免 `build:release` 清洗 harness 目录时丢失本地状态。

---

## 三、横向对比

### 3.1 编排/协同范式五分类

| 范式 | 代表 | 机制 | 触发方式 |
|---|---|---|---|
| Bootstrap 自触发 + 链式调用 | superpowers | 元技能 `using-superpowers` + SessionStart hook 注入；技能散文按名调下一技能 | 模型自动触发，hook 强制建立使用纪律 |
| 根路由器 + /command 路由表 | gstack | 根 skill 含大路由表，按意图分发 /office-hours、/investigate、/ship、/qa | 用户 /command + 模型主动建议 |
| 用户触发编排器 + 模型触发被编排者 | mattpocock | `disable-model-invocation: true` 的 ask-matt/grill-me 编排模型触发 tdd/grilling | 用户键入编排器，编排器调被编排者 |
| 单技能命令路由 + hook 反馈环 | impeccable | 一个 `/impeccable` 技能下 23 子命令路由表；PostToolUse/preToolUse hook 把检测器结果回灌 agent；live 模式浏览器迭代 | 用户 `/impeccable <cmd>` + hook 运行时闭环 |
| 无编排 / 单体工作流 | gsap、obsidian、guizang、karpathy、（ljg 半编排） | 技能独立无互调；靠 llms.txt 索引或单体步骤推进 | 单技能独立触发；ljg 有 workflow 技能串联 |

注：ljg-skills 介于三、五之间——有 `ljg-paper-flow`/`ljg-word-flow` 等 workflow 技能串联基础技能，并用 Agent 子代理并行，但无中心路由器。impeccable 的"命令路由"是单技能内的子命令分发，与 gstack 的"多技能间路由"不同维度。

### 3.2 实现机制谱系

| 谱系 | 代表 | 特征 |
|---|---|---|
| 纯 Markdown 提示 | karpathy、obsidian、gsap、mattpocock 主体 | 能力即提示文本，无/极少可执行代码 |
| 提示 + 可执行脚本/模板 | guizang（validator + HTML 模板）、ljg（Playwright + Python 图像）、superpowers（node/bash 脚本） | 提示为主，脚本处理确定性子任务（校验、截图、图像生成） |
| 提示 + 大型 CLI 生态 + 模板生成 | gstack | ~70 bin/ 可执行、.tmpl→SKILL.md 生成器、preamble-tier 注入、gbrain 跨会话记忆、hooks |
| 编译式跨 agent 代码生成 + 确定性检测器 | impeccable | 单源 `SKILL.src.md`（占位符 + provider 条件块）经构建编译为 13 agent 分发物；44 规则检测器贯穿 CLI/扩展/hooks/站点；live 浏览器迭代 |

### 3.3 Frontmatter 字段丰富度梯度

| 梯度 | 代表 | 字段 |
|---|---|---|
| 极简 | karpathy、obsidian、gsap | `name`、`description`（+ `license`） |
| 偏中 | mattpocock | + `disable-model-invocation` |
| 中 | ljg | + `user_invocable`、`version` |
| 丰富 | impeccable | + `argument-hint`、`user-invocable`、`allowed-tools`（含 `Bash(...)` 模式）、`license` |
| 最丰富 | gstack | + `version`、`preamble-tier`、`allowed-tools`、`triggers`、`hooks`、`gbrain` |
| 特殊 | superpowers | 极简（仅 `name`+`description`），靠 hook + 元技能而非 frontmatter 控制行为 |

### 3.4 渐进式披露策略对比

| 仓库 | 入口大小 | bundled 组织 | 指向方式 |
|---|---|---|---|
| impeccable | 源 `SKILL.src.md`（编译） | `reference/<command>.md` + `scripts/*.mjs` + `agents/*.md`，编译后分 agent 目录 | 命令路由表 + `context.mjs` 加载 reference + 寄存器分支 |
| gstack | 29K–127K（生成） | `sections/`+`manifest.json`、`bin/`、模板占位符注入 | 解析器注入 + 路由表 |
| guizang | 541 行 | 大 HTML 模板 + references + 校验器 | `cp` 命令 + "读 references/X" |
| superpowers | 2.6K–26.8K | references/scripts/examples/提示模板 | 相对 markdown 链接 |
| mattpocock | 3K–9.6K | 同目录 .md + 种子模板 | 相对 markdown 链接 |
| obsidian | 106–499 行 | 小抄式单主题 references | 相对 markdown 链接 |
| ljg | 入口 ~215KB 总 / bundled ~653KB | references/assets/scripts/Tools/Workflows | "先 Read references/X" 显式指令 |
| gsap | 79–433 行 | examples + llms.txt | "Related skills" 链 |
| karpathy | 2.5KB | 无（docs 在仓库根） | 无 |

### 3.5 工具限制与触发控制策略

| 策略 | 代表 | 做法 |
|---|---|---|
| `allowed-tools` 收敛 | gstack、impeccable | frontmatter 显式列出允许工具；impeccable 还用 `Bash(npx impeccable *)`/`Bash(node {{scripts_path}}/*)` 模式限定命令 |
| `disable-model-invocation` 二分 | mattpocock | 用户触发 vs 模型触发 |
| `user-invocable`/`user_invocable` 开关 | impeccable、ljg | 控制 /skill-name 是否可触发 |
| 自然语言约束 | superpowers、gsap、obsidian、guizang、karpathy | 无 frontmatter 工具字段，靠提示约束 |
| hook 强制 | superpowers（SessionStart）、gstack（PreToolUse freeze）、impeccable（PostToolUse 检测回灌 / preToolUse 写入门控） | harness 级机械保证 |

### 3.6 跨 IDE / agent 适配广度

| 广度 | 代表 | 做法 |
|---|---|---|
| 编译式跨 agent 代码生成（13 target） | impeccable | 单源 `SKILL.src.md` 经构建为 13 个 agent（cursor/claude-code/gemini/codex/agents/github/kiro/opencode/pi/qoder/trae-cn/trae/rovo-dev）生成专属技能 + hooks + 子代理，生成物提交到 main |
| 多 harness plugin 目录 | superpowers | Claude/Codex/Cursor/Gemini/Copilot/Kimi/OpenCode/Pi/Antigravity/Factory Droid |
| 双 plugin + Copilot 指令 | gsap | `.claude-plugin` + `.cursor-plugin` + `.github/copilot-instructions.md` |
| Claude + Cursor 双交付 | karpathy | plugin + `.cursor/rules/*.mdc`（`alwaysApply`） |
| 仅 Claude plugin | ljg、obsidian | 单一 `.claude-plugin` |
| git clone 安装 | gstack、mattpocock | 无 plugin manifest，clone 到 skills 目录 |
| 规范化声明 | obsidian | "follow the Agent Skills specification... any skills-compatible agent" |

> impeccable 与 superpowers 都覆盖大量 harness，但路径相反：superpowers 为每个 harness 维护独立 plugin 目录（手写/适配），impeccable 用一份源**编译生成**所有 harness 目录——后者可扩展性更强，新增 agent 只需加一个 provider 配置。

### 3.7 领域知识编码方式

| 领域类型 | 代表 | 编码方式 |
|---|---|---|
| 设计质量 | impeccable | 确定性检测器（44 规则）+ 寄存器（brand/product）+ 编译分发 + live 迭代 + "AI slop test" |
| SDK / API | gsap | API 规则 + 代码模式 + 反模式（Do Not）+ 清理护栏 + 许可护栏 |
| 文件格式 | obsidian | 语法小抄 + CLI 命令 + 工作流 |
| 创意 / 视觉 | guizang、ljg | 锁定模板 + 布局骨架 + 主题预设 + 校验器 + 红线/品味指南 |
| 方法论 / 流程 | superpowers、gstack、mattpocock | 流程链 + 反合理化清单 + 共享词汇表（CONTEXT.md/领域语言） |
| 行为准则 | karpathy | 极简祈使句原则 + before/after 示例 |

---

## 四、架构与设计模式提炼

### 4.1 渐进式披露（所有仓库的共识骨架）

9 个仓库共享同一骨架：**小入口 `SKILL.md`（frontmatter `name`+`description` 作触发面）+ 同目录 bundled 资源承载细节**。差异仅在 bundled 的组织与指向方式——从 obsidian 的小抄式单主题 reference，到 guizang/ljg 的大模板 + 强制 "Read references/X" 指令，到 gstack 的模板生成 + 解析器注入，到 impeccable 的源 `SKILL.src.md` + 编译期 reference 加载。这是 agent skill 区别于传统插件的核心：**触发面尽量小、细节按需加载**，以节省上下文窗口。

### 4.2 触发面设计（description 即接口）

- 一律第三人称、描述"何时用"而非"做什么"（superpowers `writing-skills` 明文规定，gsap `AGENTS.md` 同此）。
- 中英混合触发词：ljg 用大量中文口语触发（"白话说"、"做成图"、"读论文"），gsap 用英文 API 名（"ScrollTrigger"、"parallax"），guizang 双语（"杂志风 PPT"、"Swiss Style"），impeccable 用密集英文动词列举（"design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract"）最大化语义命中。
- 部分仓库用辅助发现索引：gsap `llms.txt`、ljg `ljg-skill-map` 扫描器、gstack 根路由表、impeccable 命令路由表 + `pin.mjs` 短命令 shim。

### 4.3 路由 / 编排的四种成熟形态

1. **hook 强制 bootstrap**（superpowers）：把"使用 skill 的纪律"本身做成 SessionStart hook，从源头保证 agent 不绕过技能——最"硬"。
2. **根路由器 + 路由表**（gstack）：单一入口按意图分发，适合大型多技能套件。
3. **编排器/被编排者分层**（mattpocock）：用 `disable-model-invocation` 把控制权交给用户，编排器只做选择，被编排者执行——最"可控"。
4. **单技能子命令路由 + hook 运行时反馈环**（impeccable）：一个 user-invocable 技能内 23 子命令分发；hook 把确定性检测器结果在编辑时回灌/阻断 agent，形成"写→检测→纠"闭环——最"闭环"。

### 4.4 工具收敛的两极

- **gstack/impeccable 极**：frontmatter `allowed-tools` 显式收敛；impeccable 进一步用 `Bash(npx impeccable *)`/`Bash(node {{scripts_path}}/*)` 模式把 agent 可调命令收敛到自家 CLI 与脚本，工程化最强。
- **多数仓库极**：靠自然语言约束工具，frontmatter 不设工具字段——简单但无机械保证。
- 介于其间：mattpocock 用 `disable-model-invocation` 控制触发权而非工具面；ljg 用 `user_invocable` 控制可触发性。

### 4.5 领域知识编码的领域相关性

领域决定编码方式：SDK 用 API 规则 + 反模式；格式用语法小抄 + CLI；创意用锁定模板 + 校验器 + 红线；方法论用流程链 + 反合理化清单；行为用极简原则 + 示例；**设计质量用确定性检测器 + 寄存器 + 编译分发**（impeccable 把"不像 AI 做的"变成 44 条可机械判定的规则）。**没有万能编码法，领域特性决定形态**。

### 4.6 质量护栏（防 agent 跑偏）

| 仓库 | 护栏 |
|---|---|
| impeccable | 44 规则确定性检测器贯穿 CLI/hooks/扩展/站点 + PostToolUse 回灌 & preToolUse 阻断 hook + 构建内校验（版本/计数/禁用词/主题回归）+ "AI slop test" + 寄存器分支 |
| guizang | `validate-swiss-deck.mjs` 静态校验器 + P0–P3 checklist + "不允许自定义 hex" |
| ljg | 红线 + 自验步骤（"写完默读"、"Read 自验"）+ `ljg-push` README 硬门 + 反 AI 审美 `taste.md` |
| superpowers | `writing-skills` 的 Red Flags 反合理化表 + 94% PR 拒绝率纪律 |
| gstack | `PreToolUse` freeze 边界 hook + redaction/遥测 CLI + token 上限告警 |
| mattpocock | `CONTEXT.md` 共享词汇 + git-guardrails 脚本 |
| gsap | "Do Not" 反模式 + 许可护栏（禁生成 auth token） |
| karpathy | before/after 示例 + "bias toward caution over speed" 权衡注 |

> 护栏从"提示级"（karpathy/ljg 红线）→"工具级"（guizang/gstack 校验器与脚本）→"运行时闭环级"（impeccable hook 把检测结果回灌 agent 并可阻断写入）逐步硬化。impeccable 与 guizang 都用静态校验器，但 impeccable 把校验器**嵌入编辑回路**而非只在交付前跑一次。

### 4.7 分发与版本治理

- **impeccable 最工程化**：编译式跨 agent 代码生成 + 生成物提交 main + 按组件独立版本（`skill-v*`/`cli-v*`/`ext-v*`）+ npm CLI + Claude marketplace + GitHub releases + Cloudflare 下载 API + `skills-lock.json` 预留 pin 语义。
- gstack/ljg 重工程化：gstack 模板生成 + 解析器管道；ljg 双分支(org/md) + 自动版本 bump + `ljg-push` 管道。
- mattpocock 用 changesets 版本管理 + 桶式分组 + README 强制规则（只 engineering/productivity/misc 进 plugin.json）。
- 其余轻量：gsap/karpathy/obsidian 靠 plugin manifest + marketplace。

---

## 五、结论与启示

### 5.1 四种"规模—范式"适配

1. **单点能力 / 单技能**（karpathy、guizang）：纯提示 + 必要时一个校验器/模板即可。跨 IDE 双交付扩大触达。适合"把一条准则/一种输出做深"。
2. **领域 SDK / 格式工具集**（gsap、obsidian）：按 API/格式切分独立技能，无编排，靠 `llms.txt`/marketplace 发现。适合"把一个领域的正确用法教给 agent"。
3. **完整方法论 / 虚拟团队**（superpowers、gstack、mattpocock）：必须有编排层。superpowers 用 hook bootstrap 最硬；gstack 用根路由器 + 工程化工具生态最强；mattpocock 用编排器/被编排者分层最可控。三者代表了"重纪律 / 重工程 / 重控制"三种取向。
4. **产品化跨 agent 技能**（impeccable）：当 skill 需要(a)分发到十余个 agent、(b)用确定性规则保证质量、(c)在编辑时闭环纠偏、(d)跨 CLI/扩展/站点复用同一检测逻辑时，应升级为"编译式产品"——单源 + 构建 + 多面分发。适合"把一个质量标准做成可度量、可分发、可闭环的产品"。这是工程化程度的最高阶。

### 5.2 设计自己 skill 的建议

1. **入口极简，细节旁置**：`description` 只写"何时用"，细节放同目录 references，按需 Read。
2. **按领域选编码方式**：SDK 用 API 规则 + 反模式；创意用锁定模板 + 校验器；方法论用流程链 + 反合理化清单；设计质量用确定性检测器 + 寄存器。
3. **护栏机械化并尽量闭环**：能用校验器/脚本/hook 保证的，不要只靠提示（guizang 校验器、gstack freeze hook、superpowers SessionStart hook 是典范）；最佳实践是把检测嵌入编辑回路（impeccable 的 PostToolUse 回灌 / preToolUse 阻断），而非只在交付前跑一次。
4. **编排按规模选**：≤3 技能无需编排；多技能套件选根路由器（gstack 式）或编排器分层（mattpocock 式）；要"从会话开头强制纪律"则加 SessionStart hook（superpowers 式）；单技能多功能用子命令路由 + hook 反馈环（impeccable 式）。
5. **触发面双语化**：中文用户场景留中文口语触发词，提升命中率（ljg、guizang 示范）；英文场景用密集动词列举最大化语义命中（impeccable 示范）。
6. **跨 IDE 交付**：少量 agent 用双 plugin（Claude + Cursor）+ Copilot 指令 + Cursor `alwaysApply` 规则；**要覆盖十余个 agent 时上编译式代码生成**（impeccable 式），新增 agent 只加一个 provider 配置，远比手写多份目录可维护。
7. **版本与分发治理**：技能多了上 changesets/双分支管道；README 设硬门防漏列；产品化时按组件独立版本 + 生成物提交 main + 多渠道分发（npm/marketplace/releases/下载 API）。

### 5.3 一句话总结

> 这 9 个仓库共享"小入口 + bundled 细节"的渐进式披露骨架，但在 **frontmatter 丰富度、编排范式、实现机制、跨 IDE 适配**四轴上呈现从"极简单技能"到"工程化虚拟团队"再到"编译式跨 agent 产品"的完整谱系；选型取决于**目标领域**（决定知识编码方式）与**规模/质量要求**（决定编排/工程化/闭环程度）。impeccable 是该谱系的工程化极端：把 skill 当作可编译、可分发、可运行时闭环的产品而非单文件。

---

## 附录：调研覆盖矩阵

| 仓库 | 领域 | frontmatter | 编排范式 | 实现机制 | bundled | 跨 IDE | 护栏 |
|---|---|---|---|---|---|---|---|
| impeccable | 设计质量 | 丰富 | 单技能子命令路由 + hook 反馈环 | 编译式跨 agent 代码生成 + 确定性检测器 | reference/scripts/agents（编译） | 编译生成 13 agent | 44 规则检测器 + hook 闭环 + 构建校验 |
| superpowers | 工程方法论 | 极简 | bootstrap 链式 | 提示+脚本 | references/scripts/examples | 多 harness | Red Flags + hook |
| gstack | 虚拟团队 | 最丰富 | 根路由器 | 提示+CLI 生态+模板生成 | sections/bin | git clone | freeze hook + 遥测 |
| mattpocock | 通用工程 | 偏中 | 编排器/被编排者 | 纯提示 | 同目录 .md | plugin + clone | CONTEXT.md + guardrails |
| gsap | 动画 SDK | 极简 | 无 | 纯提示 | examples + llms.txt | 双 plugin + copilot | Do Not + 许可护栏 |
| guizang | 演示文稿 | 极简 | 单体 | 提示+校验器+模板 | 大模板 + references | 单技能 | validator + checklist |
| obsidian | 笔记 PKM | 极简 | 无 | 纯提示+CLI 包装 | 小抄式 references | plugin | — |
| ljg | 个人创作 | 中 | workflow 半编排 | 提示+脚本（Playwright/Python） | references/assets/scripts | plugin | 红线 + 自验 + taste.md |
| karpathy | 行为准则 | 极简 | 无 | 纯提示 | 无（docs 在根） | Claude+Cursor | before/after 示例 |
