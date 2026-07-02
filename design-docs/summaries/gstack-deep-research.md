# gstack 深度研究

> Generated 2026-07-02 · repo: gstack · source: garrytan/gstack · 目录: skills/gstack/

## 一句话定位

Garry Tan（Y Combinator 总裁兼 CEO）的"个人软件工厂"——把 Claude Code 变成一个虚拟工程团队（CEO/工程经理/设计师/QA/安全官/发布工程师等 23 个专家角色 + 8 个工具），用一套按"思考→规划→构建→审查→测试→发布→反思"串起来的技能流水线，让一个人能像一整支团队那样发产品。

## 核心数据

- **SKILL.md 数量 / 位置**：59 个。1 个根路由器 `SKILL.md`（约 603 行）+ 53 个顶级技能目录 + 4 个嵌套的 `openclaw/skills/` 原生技能 + 1 个 `browser-skills/hackernews-frontpage/`（1+53+4+1=59）。仓库根的 SKILL.md 是路由器，子技能在各目录下。
- **默认分支 / 作者**：main / garrytan（Garry Tan）
- **根级 agent 集成文件**：`AGENTS.md`（agent 发现目录）+ `CLAUDE.md`（1023 行，贡献者/开发者操作手册）+ `README.md`（面向用户）。无 `GEMINI.md`、`CURSOR.md`（跨 host 靠 `hosts/` TS 配置 + `./setup --host <name>`）。
- **frontmatter**：以 `name`、`description`、`version`、`allowed-tools`、`triggers` 为主，加非标准键 `preamble-tier`（1-4，控制加载多少前导码）、`gbrain`（上下文查询）、`hooks`（Claude Code 的 PreToolUse 钩子）。无 `disable-model-invocation`——全部默认双可调用。
- **这是个工程产品**：有 `package.json`/`bun.lock`、Bun 构建流水线（`scripts/gen-skill-docs.ts`）、已编译的 Playwright 浏览器守护进程（`browse/`）、设计 CLI（`design/`）、Chrome 扩展、CI（`.gitlab-ci.yml`、`.github/`）、分层测试套件。SKILL.md 多从 `.tmpl` 模板自动生成（顶部有"AUTO-GENERATED — do not edit directly"横幅）。

## 它在解决什么问题

README:23-25 把它定位成 Garry Tan 个人的"解决之道"——把 Claude Code 变成虚拟工程团队；README:9 声称他的 2026 产出节奏约为 2013 年的 810 倍（~810× my 2013 pace）。

它解决的是"**一个人做软件需要的所有角色，能不能被一套技能流水线复刻**"。23 个专家角色技能（CEO 评审、工程经理评审、设计师 QA、安全官审计等）+ 8 个工具（浏览器、设计、PDF 等），按冲刺顺序串联（README:173-177："The skills run in the order a sprint runs... Think → Plan → Build → Review → Test → Ship → Reflect... Each skill feeds into the next"）：思考（office-hours）→ 规划（plan-* 评审）→ 构建 → 审查（review/design-review）→ 测试（qa）→ 发布（ship/land-and-deploy）→ 反思（retro）。每个技能喂给下一个——office-hours 写的设计文档给 plan-ceo-review 读，plan-eng-review 写的测试计划给 qa 用。作者描述这是冲刺顺序的运作方式，但源码层面未见强制机制（用户可只调 /ship 不走 /office-hours），更多是"推荐按顺序走"而非"强制不可跳过"。

不解决的是：它不教"写代码"本身，而是组织"写代码的流程"。它是方法论层 + 工具层，不是语言/框架知识层。

## 第一性原理

### 根本假设

**一个人要像一整支团队那样发产品，关键是把"团队里不同角色的专业判断"固化成可被 agent 调用的技能，并用一条强制流水线让 agent 按冲刺顺序走完每个角色——完整性现在边际成本接近零（AI 让"做完整"比"走捷径"还快），所以不该走捷径，该把每个角色都走到位。**

### 为什么相信

1. **ETHOS.md 的"Boil the Ocean"原则**（L34-60）："当彻底改造的成本只需几分钟，而捷径只需几秒钟时——做就对了。每一次。" / "AI 辅助编程使完整性的边际成本接近零。" 也就是说，作者认定 AI 时代"做完整"不再贵，所以默认就该做完整——这给"23 个角色全走一遍"提供了经济学依据。
2. **流水线按冲刺顺序组织，技能喂给下一个**。README:173-177："The skills run in the order a sprint runs... Each skill feeds into the next"——office-hours 写的设计文档给 plan-ceo-review 读，plan-eng-review 写的测试计划给 qa 用。作者把技能按冲刺顺序排成一条链，让上游产物成为下游输入。注意源码层面是"推荐顺序"而非强制（用户可跳过环节），但作者的设计意图是让按顺序走成为默认路径。
3. **每个角色技能都有真实工程产物支撑**。比如 make-pdf 不是纯 prompt，而是 `src/` 里 13 个 TypeScript 文件的真实 CLI（print-css、smartypants 弯引号、图表预栅格化、pdftotext 覆盖率验证）+ 命名门限测试。qa 用真实 Playwright 浏览器守护进程。作者认定"角色"不能只是 prompt 扮演，要有真工具兜底。

### 假设成立的前提条件

- AI 让完整性的边际成本确实接近零（要求模型够强、token 够便宜）。
- 流水线里每个角色技能的判断质量够高（这要求技能内容经过调优——gstack 有 `preamble-tier`、`sections/manifest.json` 等大量调优基础设施）。
- 用户愿意按整条流水线走（不愿走捷径）。Garry Tan 自己每天用（README:25："I use it every day"），但其他用户未必有这个耐心。

### 假设失效的条件

- 当 AI 能力不足/成本不低时，"做完整"不再便宜，"Boil the Ocean"假设破——完整性变成真金白银的成本。
- 当用户不愿走全流水线时（只想快速改个 bug），按顺序走完整条流水线是负担。gstack 没有明确的"简单任务跳过"机制（且源码层面用户可跳过环节，"按顺序走"是推荐而非强制）。
- 当角色技能质量不够时（某个评审技能给的判断不准），流水线会在那一环产出劣质输出，下游技能基于错的输入继续走，错误放大。
- 当 ETHOS.md 被外部贡献者改动时——CLAUDE.md:552-561 明确"ETHOS.md 是 Garry 的个人建造者哲学，外部贡献者或 AI Agent 不得编辑，绝无例外"。这是单点控制，Garry 一旦不再维护，哲学就冻结。

## 设计哲学

### 技能组织方式：扁平 + 命名前缀分组 + 跨 host 镜像

53 个技能扁平排列在仓库根，无子目录。但用命名前缀逻辑分组：`plan-*`（计划评审阶段）、`ios-*`（iOS QA 系列）、`setup-*`（一次性配置）、`design-*`（设计技能）、`document-*`（文档技能）。README 按类别标题分组，但文件系统扁平。

三个嵌套例外：`openclaw/skills/`（4 个为 ClawHub 手写的原生技能，frontmatter 精简、无自动生成横幅）、`browser-skills/`（编目的浏览器流程）、`contrib/`（贡献者工具）。

跨 host 适配用 `hosts/` TS 配置 + `./setup --host <name>`，不在仓库根放 per-host Markdown。对比 obsidian-skills 用 README 安装说明、impeccable 用 13 份镜像目录，gstack 用代码生成 host 配置——这是工程化程度最高的适配方式。

### 触发词策略：短名词短语句 + `(gstack)` 后缀

主导风格是短名词短语句子（平均 8-12 词），几乎都以 ` (gstack)` 后缀结尾。逐字引用示例：
- cso：`"Chief Security Officer mode. (gstack)"`
- make-pdf：`"Turn any markdown file into a publication-quality PDF. (gstack)"`

少数扩展为多从句长描述，仍以 `(gstack)` 结尾。`(gstack)` 后缀是品牌标记，也帮助 agent 识别这是 gstack 系列技能。

但 4 个 OpenClaw 原生技能是风格异常——用长"Use when asked to..."自然语言句，无 `(gstack)` 后缀。这反映了 ClawHub 的发现机制和 Claude Code 不同。同一个技能（office-hours）在 Claude 版约 1263 行，OpenClaw 版约 262 行——约 5 倍压缩。作者为不同 host 写了不同形态的同一技能，而不是一份通用。

### 渐进式披露的实际用法

渐进式披露——即不把全部内容一次性塞给模型，而是先给骨架，等走到某一步再读对应细节。gstack 不走"小而带引用"路线，SKILL.md 普遍很大（中位数约 800 行，最大 spec 接近 1800 行；ship/office-hours 等都在 1000+ 行）。CLAUDE.md 明确为大技能辩护："旗舰模型有 200K-1M 上下文窗口，所以 40K 是窗口的 4-20%……上限是为了捕捉前导码/解析器的失控增长，而非强制压缩精心调优的大型技能。"

三种披露机制：

1. **`preamble-tier`（T1-T4）**——根本机制。定义在 `scripts/resolvers/preamble.ts`。前导码（preamble）是每个 SKILL.md 开头自动注入的引导段（bash 块+叙事，负责建立会话状态、注入价值观、检测环境）。T1=核心前导码，T2=+语音/完整性/上下文恢复，T3=+repo 模式/构建前搜索，T4=与 T3 相同（TEST_FAILURE_TRIAGE 是独立占位符，不属于 preamble）。技能声明自己的 tier，构建时只生成该 tier 的前导码部分。这是"按技能需要加载多少通用前导码"的精细化控制。
2. **`sections/` + `manifest.json`（被动注册）**——大型工作流技能（ship/office-hours/cso/qa 等）用。SKILL.md 是骨架，带决策树叙述决定何时读哪个 section；section 在 `sections/<name>.md`，`manifest.json` 是注册表（仅 ID/文件/标题/触发文本，无机器谓词）。manifest 注释："被动注册……骨架的决策树叙述是决定何时读取部分的唯一依据。"
3. **捆绑资源目录**——`qa/references/issue-taxonomy.md`、`make-pdf/src/*.ts`（真实 CLI 实现）等。

根 SKILL.md（约 603 行）是三段式：bash 前导码块（约 110 行，会话状态/遥测/更新检查/GBrain 检测）→ 中间叙事/引导/同步段（约 400 行，含 Plan Mode、feature discovery、首次运行引导、Artifacts Sync、Model patch）→ 路由规则段（约 70 行，约 35 条用户意图→子技能映射）。

### agent 集成文件策略：AGENTS.md 发现 + CLAUDE.md 操作手册 + 代码生成 host 配置

三个根文件分工：`AGENTS.md` 是 agent 发现目录（按类别列技能一行说明）；`CLAUDE.md`（1023 行）是贡献者/开发者深度操作手册（构建命令、测试层级、SKILL.md 模板工作流、160KB/40K token 上限准则、平台无关设计规则、浏览器架构、提交风格）；`README.md` 面向用户。

跨 host 不用 Markdown 文件，用 `hosts/` TS 配置 + `./setup --host <name>`。这是"代码生成配置"比"手写 per-host 文档"更工程化的选择。

## 代表性 skill 解剖

挑三个体现哲学的：根路由器、ship（T4 + sections 被动注册）、make-pdf（真实 CLI 包装）。

### 1. 根 SKILL.md —— 路由器 + 自修改前导码

- **结构**：约 603 行，三段式：bash 前导码块（约 110 行，更新检查/会话跟踪/配置检测/GBrain 检测/路由注入提议）→ 中间叙事/引导/同步段（约 400 行）→ 路由规则段（约 70 行，约 35 条路由）。
- **怎么工作**：用户调 `/gstack` 或模型通过 Skill 工具调用。前导码建立会话状态，然后路由规则把意图分发到子技能。它是自修改的——首次运行会提议给项目的 CLAUDE.md 打个 `## Skill routing` 补丁。
- **为什么这么设计**：23+ 个技能不能让用户一个个记，路由器是入口。前导码放路由器里是因为每次调用都要重建会话状态。自修改 CLAUDE.md 是"把路由建议固化进项目"——一次提议，永久生效。

### 2. ship —— T4 + 8-section 被动注册

- **结构**：约 1086 行（T4，与 T3 相同的前导码）+ `sections/` 8 个文件（tests/test-coverage/plan-completion/review-army/greptile/adversarial/changelog/pr-body）+ `manifest.json`。
- **怎么工作**：SKILL.md 是骨架，带决策树叙述决定何时读哪个 section。manifest 注册 8 个 section，每个映射到步骤范围（如"步骤 4-6"）。
- **为什么这么设计**：ship 是个长工作流（detect+merge base → 跑测试 → review diff → bump VERSION → 更新 CHANGELOG → commit → push → 创建 PR）。把每段拆成 section 按需读，比 1072 行全加载省上下文。manifest 注释明确"骨架的决策树叙述是决定何时读取的唯一依据"——不用机器谓词，靠 SKILL.md 里的人话决策树。

### 3. make-pdf —— 真实 CLI 包装

- **结构**：618 行 + `src/` 13 个 TypeScript 文件（cli/orchestrator/render/print-css/smartypants/image-policy/diagram-prepass/pdftotext 等）+ `test/`（单测 + e2e 门限测试 + fixtures）。
- **怎么工作**：SKILL.md 是围绕 Bun 编译 CLI 的 Markdown 包装器。`src/` 是真实 PDF 渲染代码（print-css、smartypants 弯引号、mermaid/excalidraw 栅格化的图表预处理、pdftotext 覆盖率验证）。有命名门限测试（format/diagram/emoji/landscape/combined）。
- **为什么这么设计**：PDF 渲染的脏活（CSS、字体、图表）不该靠 prompt 让 agent 现写，该固化成编译好的 CLI。技能只管"何时用 + 怎么调"。这和 guizang-ppt-skill 的"约束固化进脚本"同理，但 gstack 更彻底——直接是个有测试的软件项目。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：gstack 是本工作区里**工程化程度最高**的仓库——有构建流水线、测试套件、编译产物、CI。SKILL.md 多从模板自动生成（`.tmpl`），是代码生成产物而非手写。`preamble-tier`（T1-T4）是独特的渐进式披露机制——按技能需要加载多少通用前导码。`sections/`+`manifest.json` 被动注册也比单纯的 references/ 更精细。root SKILL.md 自修改项目 CLAUDE.md 的设计也很独特。技能数量最多（59），且明确以"Boil the Ocean"（做完整不走捷径）为哲学，和 andrej-karpathy-skills 的"谨慎优于速度"、mattpocock 的"小而可组合"取向都不同。

## 局限 / 可借鉴点

### 可借鉴
1. **preamble-tier 分级加载**：技能声明 tier，构建时只生成该 tier 的前导码。比一刀切"全加载"或"全不加载"精细。
2. **sections/ + manifest.json 被动注册**：大型工作流技能拆 section 按需读，骨架决策树决定何时读。比纯 references/ 更结构化。
3. **真实 CLI 包装**：脏活（PDF 渲染、浏览器自动化）固化成有测试的编译 CLI，技能只管调度。比纯 prompt 技能可靠。
4. **跨 host 用代码生成配置**：`hosts/` TS 配置 + `./setup --host`，比手写 per-host Markdown 工程化。
5. **ETHOS.md 自动注入**：哲学文档自动注入每个工作流技能前导码，保证价值观一致。

### 局限
1. **ETHOS.md 单点控制**：CLAUDE.md 明确外部贡献者/AI 不得编辑。Garry 不再维护就冻结，社区难以演进哲学。
2. **强制流水线无跳过机制**：简单任务也要走全流程？"Boil the Ocean"没说什么时候可以不 boil。
3. **大技能对模型上下文要求高**：中位数 800 行，最大 1779。弱模型/小上下文窗口跑不动。
4. **SKILL.md 自动生成，手写空间小**：`.tmpl` 模板生成，普通用户改技能得改模板再构建，门槛高。
5. **OpenClaw 镜像与 Claude 版不同步风险**：同一技能两份（Claude 1249 行 / OpenClaw 253 行），改一份要同步另一份，靠贡献者自觉。
6. **性能声明难验证**：README 的"810 倍快"等数据是作者个人声明，无第三方验证。
