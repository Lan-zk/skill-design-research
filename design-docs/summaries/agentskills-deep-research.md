# agentskills 深度研究

> Generated 2026-07-03 · repo: agentskills · source: agentskills/agentskills · 目录: skills/agentskills/

## 一句话定位

Agent Skills 开放标准本身的仓库——含规范文本（specification）、agentskills.io 文档站、skills-ref 参考验证器；本身不放任何 SKILL.md，是工作区里其它 12 个技能仓库"遵循或偏离"的那条基准线。Anthropic 发起、现已开放，由 agentskills 组织维护。

## 核心数据

- **SKILL.md 数量 / 位置**：0。本仓库是规范/文档/验证器，不是技能集——这是工作区里唯一没有 SKILL.md 的仓库。
- **默认分支 / 作者**：main / agentskills（规范由 Anthropic 发起，README:55 "originally developed by Anthropic, released as an open standard"）。
- **根级 agent 集成文件**：无 CLAUDE.md / AGENTS.md / GEMINI.md / CURSOR.md。只有 `.claude/hooks/session-start.sh`（输出异步会话配置 + 检查 Mintlify CLI 是否安装）+ `.claude/settings.json`（注册该 hook）。注意：这个 `.claude/` 是“用 Claude Code 开发本仓库文档站”的集成，**不是**“被 agent 当技能消费”的集成——本仓库不被消费，它定义消费规则。根级无 CLAUDE.md/AGENTS.md；`docs/CLAUDE.md`、`skills-ref/CLAUDE.md` 作为子目录级开发端集成存在（分别指导 Mintlify 文档开发与 ruff/pytest），同属开发侧。
- **三大组件**：
  - `docs/` — agentskills.io 文档站（Mintlify 构建，含 `specification.mdx`、`skill-creation/` 5 篇指南、`client-implementation/adding-skills-support.mdx`、`snippets/clients.jsx` 客户端展示）
  - `skills-ref/` — 官方参考验证器（Python，`src/skills_ref/`：cli/parser/validator/models/prompt/errors，附 tests）。README:6 明确"intended for demonstration purposes only. It is not meant to be used in production."
  - 根级 `README.md` + `CONTRIBUTING.md` + `LICENSE`（Apache 2.0，文档 CC-BY-4.0）
- **治理**：CONTRIBUTING.md:21 "high bar for additions — it is much easier to add things to a specification than to remove them. When in doubt, leave it out."；skills-ref 暂不接受代码贡献（"still determining the direction"）；AI 辅助贡献必须披露。

## 它在解决什么问题

解决的是**技能格式碎片化**——在 Agent Skills 之前，各家 agent（Claude Code、Cursor、Codex、Gemini CLI 等）各搞各的扩展格式，技能不互通。这个仓库定义一个开放标准：一个目录 + 一个 `SKILL.md`（YAML frontmatter + Markdown 正文），任何兼容 agent 都能发现、加载、执行。

服务两类受众，文档站分两套指南：
- **技能作者**（`docs/skill-creation/`）：怎么写一个好技能——best-practices、evaluating-skills、optimizing-descriptions、using-scripts、quickstart。
- **agent 实现方**（`docs/client-implementation/adding-skills-support.mdx`）：怎么给一个 agent 加上技能支持——发现、解析、披露、激活、上下文管理五步。

**不解决**：不替作者判断技能质量、不维护社区技能目录（CONTRIBUTING.md:46 "We don't maintain a directory of community skills"）、不规定技能数量/行数/架构——这些是作者的活，不是标准的活。这是它和工作区里 history-docs（已删除的假通用规范）的根本分野：标准刻意不规定这些。

## 第一性原理

### 根本假设

**技能格式标准应该只规定"让任何兼容 agent 都能发现并加载一个技能"的最小契约——一个目录、一个 SKILL.md、两个必填字段（name + description）、三层渐进式披露。其余决策（技能写多大、放几个、怎么组织、用什么工具）全部留给作者和 agent 实现方。标准必须极小、极稳、极难新增，因为每加一条规范所有实现方都得理解和支持，而移除比新增难得多。**

### 为什么相信

1. **frontmatter 只硬性规定 6 个字段**（specification.mdx:25-32）：`name`/`description` 必填；`license`/`compatibility`/`metadata`/`allowed-tools` 可选。`validator.py:15` 的 `ALLOWED_FIELDS` 就是这 6 个，多出来的 top-level 字段会被标 "Unexpected fields"。一切扩展都被推向 `metadata`（任意 string→string 键值）——spec 把扩展空间留给 provider，但不让扩展污染 top-level。
2. **CONTRIBUTING.md:21 明确抵制规范膨胀**："high bar for additions / easier to add than remove / when in doubt, leave it out"。skills-ref 甚至暂不接受代码贡献（"still determining the direction"）。规范刻意保持"难加"。
3. **validator.py 只验"形"不验"质"**：检查 frontmatter 字段是否在 ALLOWED_FIELDS 内、name 字符规则（小写/无连续连字符/匹配目录名/≤64 字符）、description 非空且 ≤1024 字符、compatibility ≤500 字符。**不检查内容质量、不检查技能数量、不检查 SKILL.md 行数**。一个格式合规但内容垃圾的技能能通过验证。
4. **adding-skills-support.mdx 把大量决策留给实现方**：扫描哪个目录（推荐 `.agents/skills/` 但不强制）、用文件读还是专用工具激活、目录位置——都不规定。只把"三层渐进式披露"（catalog→instructions→resources）立成核心契约，因为这是跨实现的最大公约数。

### 假设成立的前提条件

- 三层渐进式披露是跨 agent 的最大公约数（所有兼容 agent 都能照这个加载：metadata 启动时全加载 → SKILL.md body 激活时加载 → resources 按需）。
- `name` + `description` 足以让模型判断"该不该触发"——description 是路由面（triggering surface：模型用来决定何时调用技能的文本）。
- 技能作者能自己为内容质量负责，标准不替他们把关。

### 假设失效的条件

- **当 provider 在 top-level 加扩展字段时，跨客户端兼容性破裂**。`disable-model-invocation`（mattpocock、impeccable 用）、`user-invocable`/`user_invocable`（impeccable、ljg 用）、`argument-hint`（impeccable、ui-ux-pro-max 高级技能、slavingia minimalist-review 用）、`version`（gstack、ljg、impeccable 用）、`preamble-tier`/`triggers`/`hooks`/`gbrain`（gstack 用）——这些都不在 spec 的 ALLOWED_FIELDS 里，validator 会标为 "Unexpected fields"。spec 的"扩展全塞 metadata"哲学没被遵守：provider 为了特定行为，还是加在 top-level。本工作区 12 个技能仓库里，一半（6 个：mattpocock、impeccable、gstack、ljg、ui-ux-pro-max、slavingia）在 top-level 用了 spec 不认的字段。
- **当 description 写得差导致触发判断错时**，标准只给 1024 字符上限和"应包含关键词"的建议（specification.mdx:96 "Should include specific keywords"），不强制。技能该触发时没触发、不该触发时乱触发，标准管不了。
- **当技能内容质量差时**，标准不管——格式合规但内容空泛的技能照样过验证。
- **当"该不该标准化"的新需求出现时，spec 的高门槛导致它落后于实践**。最典型的：`disable-model-invocation` 已是 de facto 约定（de facto：实践中大家都在用，但 spec 没正式收录；adding-skills-support.mdx:226 在"过滤"章节明确提到 "a `disable-model-invocation` flag" 作为实现方应识别的过滤标志），但 spec 的 ALLOWED_FIELDS 至今未收录它。规范承认了约定，却没把它标准化——这是"高门槛新增"哲学的代价。

## 设计哲学

### 技能组织方式：本仓库无技能可组织，但它定义的目录规范是"一个技能 = 一个目录 + SKILL.md + 可选 scripts/references/assets"

specification.mdx:10-17 给出目录骨架：`SKILL.md`（必需）+ `scripts/`/`references/`/`assets/`（可选）。**不规定技能之间怎么组织**——不分桶、不分组、不强制命名空间。`name` 必须匹配父目录名（validator.py:62 强制），这是唯一的"目录↔技能"绑定约束。

### 触发词策略：description 是路由面，但内容质量只"建议"不"强制"

specification.mdx:92-96 规定 description 1-1024 字符、"Should describe both what the skill does and when to use it"+"Should include specific keywords"。注意是 **Should**（建议），不是 **Must**。best-practices.mdx 给了 good/poor 对照（"Extracts text and tables from PDF files... Use when working with PDF documents..." vs "Helps with PDFs."），但 validator 只查长度和非空，不查内容质量。这是 spec 的分层：硬约束机器验（长度/非空），软约束人读指南（写得好不好）。

### 渐进式披露的实际用法：三层是核心契约，但 500 行/5000 token 是"建议"不是"硬规则"

specification.mdx:214-222 把渐进式披露立成核心：
1. **Metadata**（~100 tokens）：name + description，启动时全技能加载。
2. **Instructions**（<5000 tokens recommended）：SKILL.md body，激活时加载。
3. **Resources**（按需）：scripts/references/assets，指令引用时才加载。

**关键区分**："<5000 tokens" 和 "under 500 lines" 都是 **recommended**（specification.mdx:222 "Keep your main SKILL.md under 500 lines"、best-practices.mdx:88 "recommends keeping SKILL.md under 500 lines and 5,000 tokens"），**不是 must**。这是工作区 history-docs 中已删除的 3 个 spec 文档（Skill-Authoring-Spec.md / Skill-Authoring-规范.md / Skills-开发Spec文档.md，git commit 744f231 删除）的根本错误——它们把 spec 的“500 行建议”升级成【强制】反模式检查项（L7），其中一个版本甚至定了更严的“超 200 行 = 反模式”阈值（反模式七，已核实于 git 历史）。注：history-docs 的 01-04 研究系列仍保留（独立工程规范，不直接引用 spec）；被删的是把建议写成强制的 3 个 spec 文档。spec 原文语气是建议，validator 不查行数。本工作区 gstack（中位数 ~800 行、最大 ~1779）、anthropic（docx 590、claude-api 578）、guizang 541、ui-ux-pro-max 704 都超 500 行且合理——spec 的建议是“考虑拆”，不是“必须拆”。

### agent 集成文件策略：本仓库的 .claude/ 是"开发侧"集成，不是"消费侧"

`.claude/hooks/session-start.sh` 做两件小事：会话开始时输出异步配置（`{"async":true,"asyncTimeout":15000}`）+ 检查 `mint` CLI 是否装了（开发文档站用的）。根级没有 CLAUDE.md/AGENTS.md 等——因为本仓库不被 agent 当技能消费，它定义消费规则（子目录级的 `docs/CLAUDE.md`、`skills-ref/CLAUDE.md` 是开发侧集成，见上）。这与工作区里其它仓库（如 superpowers 的 CLAUDE.md+AGENTS.md+GEMINI.md、gstack 的 1023 行 CLAUDE.md）形成对比：那些仓库的集成文件是"告诉 agent 怎么消费我"，agentskills 没有，因为它不是被消费的。

## 代表性 skill 解剖

本仓库无 skill 可解剖。改为解剖三个最能体现其哲学的组件：

### 1. specification.mdx —— 规范本体

- **怎么工作**：定义目录结构、frontmatter 6 字段及约束、渐进式披露三层、文件引用规则（specification.mdx:235 "Keep file references one level deep... Avoid deeply nested reference chains"）。
- **为什么这么设计**：极小、可机器验证。每个字段都有明确约束（name 字符规则、description 长度），可被 validator 自动检查。规范文本本身只有 ~245 行——标准小，实现方理解成本低。

### 2. validator.py —— 规范的机械执行

- **怎么工作**：`ALLOWED_FIELDS = {name, description, license, allowed-tools, metadata, compatibility}`。检查字段是否在白名单内、name 合规（小写/无连续连字符/匹配目录名/≤64 字符，支持 Unicode 小写）、description 非空且 ≤1024 字符、compatibility ≤500 字符。
- **为什么这么设计**：只验"形"不验"质"。这是 spec 哲学的直接体现——标准只管可机器校验的硬约束，内容质量留给 best-practices 指南（人读，不机器查）。
- **关键发现**：`ALLOWED_FIELDS` **不含** `disable-model-invocation`/`user-invocable`/`argument-hint`/`version`/`preamble-tier` 等 provider 扩展字段。validator 会把工作区里 mattpocock、impeccable、gstack、ljg、ui-ux-pro-max 的合规技能标为 "Unexpected fields"——但 adding-skills-support.mdx:226 又承认 `disable-model-invocation` 是实现方应识别的过滤标志。**规范文本和实现指南之间存在张力：实现指南承认的约定，规范白名单还没收录。**

### 3. adding-skills-support.mdx —— 客户端实现指南（agent 实现方看的）

- **怎么工作**：教 agent 实现方五步——discover（扫描 `<project>/.<client>/skills/` 和 `.agents/skills/`，project-level 覆盖 user-level）、parse（frontmatter 提取，容错处理畸形 YAML）、disclose（把 name+description+location 组成 catalog 喂给模型）、activate（文件读或专用工具）、manage（技能内容免于被上下文压缩裁掉）。
- **为什么这么设计**：标准不只服务技能作者，还服务 agent 实现方。这份指南把"三层渐进式披露"立成跨实现的最大公约数，其余（扫描路径、激活机制）留灵活。容错验证（adding-skills-support.mdx:130-137 "warn on issues but still load"）刻意放松 spec 的严格约束以提高跨客户端兼容性——name 不匹配目录只 warn 不拒载，但 description 缺失就 skip（因为没 description 没法做披露）。
- **关键发现**：trust 考量（:91 "Consider gating project-level skill loading on a trust check"）——官方指南建议对项目级技能做信任门控（读侧：不加载不可信仓库的技能，防指令注入）。本工作区的 guard-repos.js hook 是另一面的信任门控（写侧：拦截对克隆仓库的修改，防破坏只读约束）——机制和威胁模型不同，但都属于“对不可信路径做信任门控”的思路。

## 与别家的本质差异

- 工作区**唯一"无 SKILL.md"的仓库**——它是标准，不是技能。
- 唯一"设计哲学是关于不该规定什么"的仓库——其它 12 个都在规定"该怎么设计技能"（流程/红线/数据/验证器），这个规定"标准该多小"。
- 唯一把"格式"和"质量"分层处理的——validator 只管格式（机器验），best-practices 管质量（人读不机器查）。gstack/impeccable 反过来——用 CI/规则引擎强制质量。
- 它的极简 frontmatter（6 字段）和 gstack 的丰富 frontmatter（version/allowed-tools/triggers/preamble-tier/hooks/gbrain）形成两极——spec 想"扩展全塞 metadata"，gstack 直接在 top-level 加。这是 spec 哲学和 provider 现实的核心张力。
- 它刻意把 500 行/5000 token 定为“建议”，而 history-docs 中已删除的 3 个 spec 文档把其升级为【强制】检查项（其中一份明确引用“agentskills.io 推荐 500 行”再升为强制，另一份定了更严的 200 行阈值）——spec 的语气比那些 spec 文档谦虚得多。

## 局限 / 可借鉴点

### 可借鉴

1. **标准极小化**：只规定跨实现的最小契约，扩展塞 `metadata`。每加一条规范都得所有实现方支持——"when in doubt, leave it out"。这是对 history-docs 假通用（3-4 个/7 个、200 行反模式、plan/build/review/meta）的根本反驳：标准不该规定这些。
2. **格式 vs 质量分层**：硬约束（格式）机器验，软约束（质量）人读指南。不混在一起——validator 不查行数，best-practices 才说"考虑拆引用"。
3. **三层渐进式披露是跨 agent 最大公约数**：catalog（name+description，~100 tokens/技能）→ instructions（SKILL.md body，<5000 tokens 建议）→ resources（按需）。所有兼容 agent 都能照这个加载。
4. **“约定 ≠ 标准”的分层**：客户端实现指南承认 de facto 约定（de facto：实践中普遍使用但未标准化；如 `disable-model-invocation`、`.agents/skills/` 路径、project 覆盖 user）但不强制进 spec——约定先在实践里成熟，再决定是否标准化。这是谨慎的规范演进态度。
5. **容错验证提高兼容性**：name 不匹配目录只 warn 不拒载；description 缺失才 skip。严格规范 + 容错实现 = 跨客户端最大兼容。

### 局限

1. **ALLOWED_FIELDS 不含 provider 扩展**——validator 会误标工作区里 mattpocock/impeccable/gstack/ljg 的合规技能为 "Unexpected fields"。spec 的极简和 provider 的扩展需求持续张力。作者要么把扩展塞 `metadata`（spec 推荐）但失去 top-level 语义、要么在 top-level 加（provider 偏好）但违反 spec——两难。
2. **validator 只验形不验质**——格式合规但内容差的技能过验证。生产环境用 skills-ref（"not for production"）需自己加质量门。
3. **500 行/5000 token 是 recommended 不是 must**——但容易被误读成硬规则（history-docs 中已删除的 3 个 spec 文档就把其升级为【强制】反模式检查项，见 git commit 744f231）。spec 原文语气是建议，但措辞不够强调“可超越”，导致读者容易过度遵守。
4. **规范落后于实践**：`disable-model-invocation` 已是约定且被实现指南承认，但仍未进 spec ALLOWED_FIELDS。高门槛新增的代价。
5. **skills-ref "not for production"、"not accepting code contributions"**——参考实现还在定方向，生态成熟度早期，不能直接当生产验证器用。
6. **spec 不规定技能数量上限**——这是优点（不假通用）也是弱点：模型面对几十上百个扁平技能时选择质量下降（OpenAI/Microsoft 的 tool-space interference 研究），spec 不给指导，留给实现方自己加路由/检索（本工作区 superpowers/gstack/mattpocock 都自加了路由器）。
