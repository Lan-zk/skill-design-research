# slavingia-skills 深度研究

> Generated 2026-07-03 · repo: slavingia-skills · source: slavingia/skills · 目录: skills/slavingia-skills/

## 一句话定位

Sahil Lavingia（Gumroad 创始人）把自己的畅销书《The Minimalist Entrepreneur》（极简创业者）拆成 10 个 Claude Code 技能——每章一个技能，每个技能就是一个自包含的 SKILL.md（无任何外部引用、无脚本、无数据文件），开头让 agent 扮演「channeling the philosophy of The Minimalist Entrepreneur by Sahil Lavingia」（以 Sahil Lavingia 的极简创业哲学为蓝本）的创业顾问，把书里的方法论直接转成可交互的斜杠命令，以 Claude Code 插件形式一行安装。

## 核心数据

- **SKILL.md 数量 / 位置**：10 个，全在 `skills/<name>/SKILL.md`，flat 布局（无分类子目录），仓库根无 SKILL.md。
- **默认分支 / 作者**：main / slavingia（Sahil Lavingia）。
- **根级 agent 集成文件**：**无**。没有 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`/`CURSOR.md`。也没有 `LICENSE`/`CHANGELOG`/`CONTRIBUTING`（虽然 `plugin.json` 声明 MIT）。唯一集成面是 `.claude-plugin/` 目录（`plugin.json` + `marketplace.json`）。根 `README.md`（60 行）是唯一根文档。
- **frontmatter**：极简且统一。9/10 技能只有 `name` + `description`。`minimalist-review` 多一个 `argument-hint`（全仓唯一的非标准键）。无任何 `disable-model-invocation`/`user-invocable`/`allowed-tools` 标志 → 默认 both（用户可斜杠调用 + 模型可凭 description 自动触发）。
- **捆绑资源**：**全仓零**。10 个技能目录每个只有 SKILL.md。无 `references/`、无 `scripts/`、无 `assets/`、无 `examples/`。这是工作区里最彻底的「单文件自包含」技能设计。
- **SKILL.md 行数**：company-values 81、find-community 51、first-customers 77、grow-sustainably 93、marketing-plan 101、minimalist-review 83、mvp 82、pricing 64、processize 92、validate-idea 69。中位约 80 行。

## 它在解决什么问题

README:1-3 定位：「Claude Code skills based on The Minimalist Entrepreneur by Sahil Lavingia.」（基于 Sahil Lavingia《极简创业者》的 Claude Code 技能）。README:47-60 的 The Minimalist Entrepreneur Journey 把 10 个技能映射到书的章节顺序：Community → Validate → Build → Processize → Sell → Price → Market → Grow → Culture → Review。

它解决的是「读者读完书不知道怎么把方法论落到自己具体决策上」——技能让 agent 带着书的原则帮你做具体决策（找社区/验证想法/建 MVP/定价/营销/增长）。书是单向输出，技能是交互式顾问。

不解决的是：它不教你写代码、不给你财务模型、不替代真实的市场验证——它是创业决策的「原则性顾问」，不是执行工具。它给的是「该不该做、怎么想」，不是「怎么做」的具体执行。

## 第一性原理

### 根本假设

**一本已经写完、方法论成型的书，最好的技能化方式是「一章一技能、每技能自包含、让 agent 扮演作者」——不需要数据库、不需要脚本、不需要外部引用，因为价值在书的原则本身（prose，散文式表述），不在检索或计算。技能是书的交互式交付层，不是推理引擎。**

### 为什么相信

1. **单文件自包含，零依赖**。10 个技能每个只有 SKILL.md（51-101 行），无任何 references/scripts/assets。作者认定书的内容就是全部——不需要额外的数据源或工具。每个 SKILL.md 内部用 `## Core Principle`（核心原则）→ 框架章节 → `## Output`（结构化交付物）结构，把「渐进式披露」（progressive disclosure：先给小的入口，需要细节时再展开下一层）做进**文件内部**，而不是做成文件间引用。这和 ui-ux-pro-max 的「CSV 数据库 + 搜索引擎」是两个极端。
2. **人格扮演开场**。每个 SKILL.md 开头同一句（如 `find-community/SKILL.md:6`）「You are a business advisor channeling the philosophy of The Minimalist Entrepreneur by Sahil Lavingia.」（你是一位以 Sahil Lavingia《极简创业者》哲学为蓝本的商业顾问）。作者认定技能的「声音」比技能的「工具」重要——agent 要像 Sahil 本人一样给建议，而不是查表。书的原则以内容形式嵌入（如 `grow-sustainably/SKILL.md:10`「**Profitability is a superpower.**」、`mvp/SKILL.md:10`「**Build as little as possible.**」、`first-customers/SKILL.md:10`「**Skip the launch. Focus on selling.**」）——是书里的话直接当技能标题，不是元注释。
3. **一章一技能 + 旅程排序**。README:49「The skills follow the book's progression.」（技能遵循书的推进顺序）。文件系统是 flat 的（无分类子目录），但 README 给了一个有序的「journey」（旅程）。作者认定书的章节顺序就是天然组织——不需要按类别重新分组。`processize` 是唯一显式交叉引用别的技能的（`processize/SKILL.md:34`「If you can't name 10 people, you don't know your community well enough yet. Go back to `/find-community`.」）——其余 9 个技能相互独立。
4. **插件即分发**。`.claude-plugin/plugin.json` + `marketplace.json`，README:9-12 一行安装 `/plugin marketplace add slavingia/skills` + `/plugin install minimalist-entrepreneur`。作者认定 Claude Code 插件是足够单一的分发渠道——不做 18 平台（对比 ui-ux-pro-max 的 18 平台 JSON 配置）。

### 假设成立的前提条件

- 书的方法论已经成型且稳定（已出版，不常改）。
- 书的原则能靠 prose 传达，不需要计算或外部数据（创业决策的「该不该做」靠判断，不靠查表）。
- 用户用 Claude Code（唯一分发渠道）。
- 用户愿意按「journey」顺序或自己挑技能用。
- 人格扮演足够让 agent 输出「像 Sahil 的建议」——不保证建议对具体情境最优。

### 假设失效的条件

- 当创业决策需要具体数据（市场规模、竞品定价、财务模型）时，技能给不了——它只有原则，没数据。这是 prose-driven（散文驱动）的天花板。
- 当用户不在 Claude Code 上时，技能用不了——单一分发渠道。
- 当书的方法论需要更新（创业环境变化）时，SKILL.md 要人工改——没有数据层可单独更新。
- 当技能间本该有数据/状态传递（如 validate-idea 的结论喂给 mvp）时，10 个独立技能不共享状态——`processize` 那句「Go back to /find-community」是软引导，不是硬传递。
- 人格扮演可能输出泛泛的「创业鸡汤」而非具体可执行建议——取决于模型对书的内容的吸收。
- 跨技能内容冗余：`first-customers` 的 Pricing 段与 `pricing` 技能重叠；`mvp`/`processize`/`validate-idea` 共享「Manual → Processized → Productized」（手动 → 流程化 → 产品化）三阶段模型，分散在三处。

## 设计哲学

### 技能组织方式：flat 文件系统 + 文档层强加有序 journey

flat under `skills/`，10 个兄弟目录，无命名空间、无分类子目录、无 `deprecated/`。目录名 = frontmatter name = 斜杠命令（`find-community/` → `/find-community`）。但 README 强加一个有序 journey（Community → ... → Review）对应书章节。**文件系统本身无序，顺序只活在文档里**——这是个有趣的「物理 flat、语义有序」选择。和 ui-ux-pro-max 的 hub-and-spoke（`design` 当路由）不同——这里没有路由技能，10 个技能平权。

### 触发词策略：场景式自然语言句

近统一模板：「[技能做什么]. Use when [场景(s)].」（做什么 + 什么时候用）。逐字引用三例：

- find-community：「Help identify and evaluate communities to build a minimalist business around. Use when someone is looking for a business idea, trying to find their community, or wondering where to start as an entrepreneur.」
- validate-idea：「Validate a business idea using the minimalist entrepreneur framework. Use when someone has a business idea and wants to test if it's worth pursuing before building anything.」
- pricing：「Help figure out pricing for a product or service using minimalist entrepreneur principles. Use when someone is setting prices, considering price changes, or struggling with what to charge.」

10 个 description 全是这个两段式。前半句说做什么，后半句「Use when...」列触发场景。无关键词枚举。这和 ui-ux-pro-max 的「Actions/Projects/Elements/Styles/Topics」枚举是两种取向——slavingia 走场景语义，ui-ux-pro-max 走词面覆盖。

特别：`marketing-plan` 的 description 内嵌量化就绪门槛「~100 customers」作为触发条件（「Use when someone has product-market fit (~100 customers)」）——用具体数字定义「什么时候该用」，在触发面里少见。`minimalist-review` 是元技能，把 8 条书的原则当 checklist 套到任何决策上，用 Markdown 决策表（`minimalist-review/SKILL.md:57-66`）。

### 渐进式披露的实际用法：不用

**这是工作区里最彻底的「大自包含」端**。每个 SKILL.md 51-101 行，全方法论内联，无外部引用。渐进式披露做进文件内部：每个文件 `## Core Principle` → 框架章节 → `## Output`（结构化交付物）。没有「小入口 + bundled refs」模式。

为什么这么设计：作者认定书的内容就是全部价值——不需要拆成入口 + 引用。单文件易读、易装、易维护。这和 ui-ux-pro-max 的「稳定规则内联 + 易变数据进 CSV」分层、impeccable 的「小入口 + 28 个 reference + 67 个脚本」都不同——slavingia 根本没有「易变数据层」这个概念。

### agent 集成文件策略：无，极致极简

没有 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`/`CURSOR.md`。唯一集成面是 `.claude-plugin/`（`plugin.json` + `marketplace.json`）。消费完全预期通过 Claude Code 插件系统，不做 per-agent 文件。这和 obsidian-skills 的「根目录无集成文件」类似，但 slavingia 连根 README 之外的元文件都没有——极致极简。`plugin.json:3` description 一句话总结意图：「Frameworks for building a profitable, sustainable business starting from community.」（从社区起步构建可持续盈利业务的框架）。

## 代表性 skill 解剖

### 1. find-community（旅程起点）—— 社区优先论

- **怎么工作**：51 行 SKILL.md（全仓最短之一）。开场人格扮演，定义「社区优先」论点（书的核心），给识别/评估社区的框架，输出结构化建议。
- **为什么这么设计**：这是书的第 1 章技能化，定义其余技能的基点。最短是因为论点单一——「先找社区，再想产品」。

### 2. minimalist-review（元技能）—— 8 原则 checklist

- **怎么工作**：83 行，全仓唯一带 `argument-hint`（「describe your decision or situation」）。把书的 8 条原则当 checklist，套到任何决策/计划/战略上。用 Markdown 决策表（`:57-66`）。
- **为什么这么设计**：这是「万能入口」——用户拿不准用哪个技能时，`/minimalist-review <情况>` 兜底。元技能横切所有专项技能。和 ui-ux-pro-max 的 `design` 路由器不同——`minimalist-review` 不分发到别的技能，它自己就是 checklist，亲自套原则给结论。

### 3. grow-sustainably（含 Gumroad 财务细节）—— 数据当论据

- **怎么工作**：93 行。含 Gumroad 真实财务（`grow-sustainably/SKILL.md:23`「~40¢ of variable cost per $1 earned」（每赚 1 美元约 40 美分变动成本）、`:31` Sahil 的 $36K → $0 薪水、`:46` Gumroad 年增长率）。把作者亲身数据当论据支撑「可持续增长」原则。
- **为什么这么设计**：创业建议最怕空。Sahil 用自己公司的真实数据当论据，比泛泛说「要盈利」有力。这是 prose-driven 技能里嵌入「数据感」的方式——数据写死在 prose 里，不是可查的数据库（对比 ui-ux-pro-max 的 CSV）。

### 4. company-values / pricing —— 作者特异性内容

- `company-values`（81 行）含 Gumroad 的真实公司价值观作为示例（「Judged by the Work」「Seek Superlinearities」「Everyone is a CEO」「Dare to Be Open」）——具体的、作者特有的内容，不是通用建议。
- `pricing`（64 行）是唯一引用具名第三方来源的技能（Dan Ariely 的「zero price effect」零价效应、Laura Roeder 论免费试用）——把外部权威嵌进原则。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：slavingia 是工作区里**最彻底的「单文件自包含、零依赖」**——10 个技能全无 references/scripts/assets（对比 impeccable 的 28 ref + 67 script、ui-ux-pro-max 的 CSV + Python 引擎）。是**唯一明确「基于一本书」**的技能集——技能 = 书的章节交互版。是**唯一用「人格扮演开场」统一声音**的——每技能开头「You are a business advisor channeling...」。**无任何根级 agent 集成文件**——极致极简，只靠插件 manifest。**单一 Claude Code 分发渠道**——不做跨平台（对比 ui-ux-pro-max 的 18 平台、impeccable 的 13 镜像）。创业决策领域 vs ui-ux-pro-max 的 UI/UX 技术领域——非技术 prose vs 结构化数据。（跨仓库对比待综合篇系统核实。）

## 局限 / 可借鉴点

### 可借鉴

1. **单文件自包含技能**：当内容就是全部价值时，不要硬塞 references/scripts——单文件最易读、易装、易维护。这是「散文型知识」的最优披露策略。
2. **人格扮演统一声音**：开场「你是 channeling X 的顾问」让技能输出有连贯声音，比纯指令更「像作者」。适合方法论/顾问型技能。
3. **元技能兜底**：`minimalist-review` 横切所有专项技能，用户拿不准时兜底——比强路由更友好。这是「checklist 范式」vs「路由器范式」的对照。
4. **旅程排序**：flat 文件系统 + 文档层强加有序 journey，兼顾简单与叙事——当技能有天然顺序（如书的章节）时，不必硬塞进目录结构。
5. **真实数据当论据**：把作者亲历数据嵌进 prose（Gumroad 财务）支撑原则，比泛泛说教有力。这是 prose-driven 技能里嵌入「数据感」的低成本方式。

### 局限

1. **无数据层**——创业决策需要市场/财务数据时给不了，只有原则。prose-driven 的天花板。
2. **单一 Claude Code 分发**——不在 Claude Code 上用不了。对比 ui-ux-pro-max 的 18 平台。
3. **技能间无状态传递**——validate-idea 的结论不会自动喂给 mvp，靠用户手动衔接。10 个独立技能不共享上下文。
4. **内容更新要改 SKILL.md**——没有「数据层单独更新」的分离，原则变了要改散文。
5. **人格扮演可能输出泛泛「创业鸡汤」**——取决于模型对书的吸收，不保证具体可执行。
6. **跨技能内容冗余**——`first-customers` 的 Pricing 段与 `pricing` 重叠；`mvp`/`processize`/`validate-idea` 共享「Manual → Processized → Productized」模型分散三处。
7. **触发面窄**——「Use when [场景]」句式覆盖的词面不如关键词枚举广，可能漏触发。
8. **无根级集成文件**——贡献者/其它 agent 没有消费指引，全靠 README 60 行 + 插件 manifest。对比 ui-ux-pro-max 有 CLAUDE.md + CONTRIBUTING.md + cli/README.md。
