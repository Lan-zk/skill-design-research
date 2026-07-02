# obsidian-skills 深度研究

> Generated 2026-07-02 · repo: obsidian-skills · source: kepano/obsidian-skills · 目录: skills/obsidian-skills/

## 一句话定位

Obsidian 官方（作者 kepano，即 Steph Ango，Obsidian CEO——CEO 头衔据公开资料，仓库内 marketplace.json owner 字段为 "Steph Ango"）出的技能集——把 Obsidian 的几种文件格式（`.md` / `.base` / `.canvas`）和两个 CLI 工具写成 agent 技能，让任何遵循 Agent Skills 规范的 agent 都能正确读写 Obsidian 笔记库。

## 核心数据

- **SKILL.md 数量 / 位置**：5 个，均在 `skills/<name>/SKILL.md`：obsidian-markdown、obsidian-bases、json-canvas、obsidian-cli、defuddle。
- **默认分支 / 作者**：main / kepano（Steph Ango）
- **根级 agent 集成文件**：**无**。没有 CLAUDE.md / AGENTS.md / GEMINI.md / CURSOR.md。集成靠 `README.md` 里的 per-agent 安装说明 + `.claude-plugin/marketplace.json`（owner "Steph Ango"）。
- **frontmatter**：5 个技能全部只有 `name` + `description` 两个键，无 license / allowed-tools / 调用控制字段。全部默认模型可调用 + 用户可调用。
- **规范来源**：README:3 明确遵循 `agentskills.io/specification`。

## 它在解决什么问题

Obsidian 的文件格式有自己的扩展语法（wiki 链接、embeds、callouts、frontmatter 属性、Bases 视图公式、Canvas 的 JSON 节点结构），通用 agent 不懂这些细节就会写出 Obsidian 解析不了的文件。这个仓库解决的是"**让 agent 成为合格的 Obsidian 文件读写者**"。

它分两类：①三个格式技能（markdown / bases / canvas）——教 agent 某种文件怎么写；②两个工具技能（obsidian-cli / defuddle）——教 agent 怎么用 CLI 操作笔记库或抓网页。

不解决的是：它不教"怎么用 Obsidian 做知识管理"（那是人的事），只教"文件格式和工具的机械用法"。它是**格式规范面向 agent 的镜像**——README 的技能表把每个技能直接链接到对应的 Obsidian 官方文档页，技能就是这些文档的 agent 可执行版本。

## 第一性原理

### 根本假设

**Agent 不需要"理解"Obsidian，只需要拿到一份准确的、机器可读的格式说明书，就能正确生成和编辑 Obsidian 文件。知识在"规范文本"里，不在"模型训练记忆"里。**

### 为什么相信

1. **技能 = 官方规范的 agent 镜像**。每个格式技能都对应一份 Obsidian 官方文档（README 技能表逐项链接）。比如 json-canvas 技能引用 `jsoncanvas.org/spec/1.0/`，defuddle 指向 `github.com/kepano/defuddle`。技能不是再创作，是把权威规范搬进 agent 可触达的位置。
2. **frontmatter 极简（只有 name+description）**。5 个技能无一用 allowed-tools / 调用控制字段。作者信任 agent 根据 description 自己判断该不该触发、用什么工具——这和 anthropic-skills 的取向一致（靠规范和环境，不靠元数据堆约束）。
3. **defuddle 技能的负面边界**（description:3）："不要用于以 `.md` 结尾的 URL——那些已经是 Markdown，直接用 WebFetch。" 这种"何时不用"的明确划界，说明作者假设 agent 能读懂并遵守自然语言边界，而不是需要硬性禁用。

### 假设成立的前提条件

- 规范本身稳定且可被文本完整表达（Obsidian 的语法确实是确定性的，适合文本说明）。
- agent 能根据 description 准确匹配"我在处理 .canvas 文件"这种场景。
- agent 读了技能内容后能照着写——对格式技能来说，这要求模型有基本的"照着模板生成"能力。

### 假设失效的条件

- 当格式**频繁变动**时，技能文本会过时。obsidian-bases 是 500 行的大技能，如果 Bases 语法大改，维护成本高。这是把规范写进技能的固有代价（对比 defuddle 让 agent 跑 `obsidian help` 拿最新命令——那种方式天然不过时）。
- 当 agent **不触发**技能时（比如用户说"帮我整理这些笔记"但没提 .md），格式技能不会被调用，agent 会用通用 markdown 知识写出非 Obsidian 风格的文件。description 的触发面靠文件扩展名和关键词，覆盖不到隐式场景。
- 当规范有歧义时（比如颜色预设"1"-"6"是故意未定义的十六进制值，json-canvas:196 说"应用用各自品牌色"），技能没法给确定答案，靠 agent 瞎猜。

## 设计哲学

### 技能组织方式：按"格式 vs 工具"扁平分类

5 个技能扁平排列，无子目录、无命名空间、无 deprecated。README 表格的顺序是先格式（markdown / bases / canvas）后工具（cli / defuddle）——这是逻辑分组，不反映在文件系统里。

为什么这么分？因为每个技能对应一个**独立的触发面**：用户提到 `.md` 触发 markdown 技能，提到 `.canvas` 触发 json-canvas。它们之间几乎没有重叠，不需要层级组织。这是"一个格式一个技能"的清晰映射。

### 触发词策略：能力声明 + "Use when... 文件扩展名/场景"

主导风格是两部分句：先能力声明，再"Use when"+ 文件扩展名和场景关键词。description 示例（中文意译，原文为英文）：

- json-canvas（`SKILL.md:3`）："Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions Canvas files in Obsidian."
- obsidian-markdown（`SKILL.md:3`）："Create and edit Obsidian-flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes."

文件扩展名（`.canvas` / `.md` / `.base`）是核心触发锚点——因为 Obsidian 的格式就是按扩展名区分的，用扩展名做触发最自然。defuddle 是特例，它加了负面边界（"不要用于 .md URL"），因为它的触发条件（"用户给 URL"）和别的技能（处理已有 .md）有重叠，需要明确划界。

### 渐进式披露的实际用法

5 个技能行数差异大：defuddle 42 行、obsidian-cli 107 行、obsidian-markdown 197 行、json-canvas 245 行、obsidian-bases 500 行。3 个有 `references/`，2 个自包含：

- **obsidian-markdown**：197 行 + `references/` 3 个文件（CALLOUTS.md 58 行、EMBEDS.md 71 行、PROPERTIES.md 62 行）。每个都在正文用相对链接引用（`[PROPERTIES.md](references/PROPERTIES.md)`）。
- **obsidian-bases**：500 行 + `references/FUNCTIONS_REFERENCE.md`（174 行，所有公式函数签名）。正文内联了模式文档和示例，只把函数目录外置。
- **json-canvas**：245 行 + `references/EXAMPLES.md`（329 行，完整画布 JSON 示例）。
- **defuddle / obsidian-cli**：自包含，无 references。

披露规则很清晰：**当某方面内容量大且偏参考性（函数目录、完整示例、语法专项），就拆进 references/；否则内联。** obsidian-bases 是最好的例子——它 500 行已经很大，但仍把函数目录外置，因为那是一长串同质的函数签名，内联会淹没正文的结构性讲解。obsidian-cli 反过来——CLI 有自己的 `help` 系统当权威参考，技能里只放速查表，所以不需要 references。

特别提一下 json-canvas 的一个反直觉设计：颜色预设"1"-"6"的十六进制值是**故意未定义**的（`:196`："预设颜色值是故意未定义的——应用程序使用各自的品牌颜色"）。技能不规定具体颜色，让消费方自己定。这是"规范留白"——只约束结构，不约束呈现。

### agent 集成文件策略：根本不用，靠规范 + 安装说明

与本工作区中的 anthropic-skills 类似，obsidian-skills 根目录也不含 agent 集成文件。作者认为：遵循 Agent Skills 规范的技能，任何兼容 agent 都该能消费，不需要仓库专门写"使用说明"。

但不同 agent 的安装位置不同，所以 README:26-46 给了 per-agent 安装说明：Claude Code 复制到 `.claude/`、Codex 复制 `skills/`、OpenCode 克隆整个仓库（还特别警告"不要只复制 skills/ 文件夹"）。这些是安装路径差异，不是指令内容差异。

## 代表性 skill 解剖

挑三个体现哲学的：obsidian-bases（大技能如何披露）、defuddle（负面边界 + 外部工具）、obsidian-cli（自包含 + 委托给 help）。

### 1. obsidian-bases —— 大技能的选择性披露

- **结构**：500 行 SKILL.md（仓库最大）+ `references/FUNCTIONS_REFERENCE.md`（174 行）。
- **怎么工作**：正文内联了完整模式文档、筛选器语法、四种视图类型（表格/卡片/列表/地图）、三个完整示例 Bases（任务跟踪器、阅读列表、每日笔记索引）。只有函数目录外置。还有大量 `# WRONG` / `# CORRECT` 对比代码块讲常见错误。
- **为什么这么设计**：Bases 的核心价值在"视图 + 筛选 + 公式"的结构性知识，这些适合内联讲；但函数目录是几十个同质签名，内联会打断正文节奏，所以外置。这是"按内容性质决定披露层级"——不是一刀切"超过 N 行就拆"。

### 2. defuddle —— 负面边界 + 委托外部工具

- **结构**：42 行（仓库最小），自包含，无 references。
- **怎么工作**：指向外部 CLI 工具 `defuddle`（kepano 自己开发的，`npm install -g defuddle`），正文只有用法标志和输出格式表。
- **为什么这么设计**：defuddle 是个独立 npm 包，有自己的文档和版本。技能不复制它的文档，只告诉 agent "有这么个工具、什么时候用、基本怎么调"。这是"技能当指针"——不重复外部权威源。
- **负面边界**：description 明确（原文大意）"不要用于以 .md 结尾的 URL——那些已经是 Markdown，直接用 WebFetch"。因为 defuddle 的触发条件（用户给 URL）和 WebFetch 重叠，必须划清"何时该用谁"。

### 3. obsidian-cli —— 自包含 + 委托给 `help`

- **结构**：107 行，自包含。
- **怎么工作**：前置 Obsidian CLI 官方文档，并明确建议（`SKILL.md:12`）运行 `obsidian help` 作为最新命令参考。技能里放常用模式速查表 + 插件开发工作流（4 步循环：重载 → 错误 → 截图/DOM → 控制台）。
- **为什么这么设计**：CLI 命令会变，但 `obsidian help` 永远是最新权威。技能不试图穷举命令，而是教"怎么用 help 自助"。这和 defuddle 一样是"委托外部权威源"，避免技能过期。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：和 anthropic-skills 一样**根目录无 agent 集成文件**、frontmatter 极简（只有 name+description），都靠 Agent Skills 规范本身定义消费方式。但 anthropic-skills 是"通用示例集"，obsidian-skills 是"特定产品的格式说明书"——前者面向"学怎么写 skill"，后者面向"用 Obsidian"。obsidian-skills 的 references/ 用得很克制（3/5 技能有），且严格按"内容性质"决定拆不拆。

## 局限 / 可借鉴点

### 可借鉴
1. **按内容性质决定披露层级**：结构性讲解内联，同质参考（函数目录、示例集）外置。不是按行数一刀切。
2. **技能当指针，不复制外部权威源**：defuddle / obsidian-cli 都委托给外部工具的 `help`/文档，技能只管"何时用 + 基本怎么调"。避免技能过期。
3. **负面边界明确**：defuddle 的"不要用于 .md URL"是范本——当触发条件和别的工具重叠时，必须写清"何时不用"。
4. **规范留白**：json-canvas 颜色预设故意不定义值，只约束结构不约束呈现。这种"留出消费方自由度"的规范设计值得借鉴。

### 局限
1. **大技能维护成本**：obsidian-bases 500 行 + 函数目录 174 行，若 Bases 语法大改，更新负担重。这是把规范写进技能的固有代价。
2. **隐式场景触发不到**：用户说"整理这些笔记"没提 .md 时，格式技能不触发。触发面靠文件扩展名和显式关键词，覆盖不到隐式需求。
3. **README 安装说明的维护**：per-agent 安装路径靠 README 手写，agent 生态变了（新 agent 出现）需要手动补。没有自动化（对比 impeccable 用 `npx impeccable install` 自动检测 harness）。
4. **规范歧义无兜底**：像颜色预设这种故意留白，agent 遇到具体场景只能猜。技能没说"遇到未定义值时该怎么决策"。
