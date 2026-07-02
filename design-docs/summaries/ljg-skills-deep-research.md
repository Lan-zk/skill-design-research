# ljg-skills 深度研究

> Generated 2026-07-02 · repo: ljg-skills · source: lijigang/ljg-skills · 目录: skills/ljg-skills/ · 默认分支: master

## 一句话定位

李继刚（lijigang，知名 prompt 工程师）的个人中文技能集——23 个技能全是高度主观的"写作/思考/视觉"工具，用"规定不能怎么写"的约束式 prompt 和"红线列表"锁死下限，让 agent 输出有强烈个人风格的、反 AI 腔的内容。

## 核心数据

- **SKILL.md 数量 / 位置**：23 个，均在 `skills/ljg-<name>/SKILL.md`，全部带 `ljg-` 前缀。扁平结构，无子目录、无 deprecated。
- **默认分支 / 作者**：master（本工作区唯一用 master 的）/ lijigang（李继刚）
- **根级 agent 集成文件**：只有 `CLAUDE.md`（122 行，面向 Claude Code 的开发者文档）。无 `AGENTS.md`、`GEMINI.md`、`CURSOR.md`。
- **frontmatter**：必有 `name`、`description`；`user_invocable`（19/23 多数有）和 `version`（14/23，仅重度迭代的技能如 ljg-writes v6.3.0、ljg-paper v6.1.0、ljg-plain v5.0.0 有）非全部。无 `disable-model-invocation`、无 `license`/`allowed-tools`。两个技能（ljg-relationship、ljg-roundtable）用 YAML `>-` 折叠标量描述（即把多行长描述折叠成一段，便于写更长的触发说明）。
- **双格式分支**：master（org-mode 源）+ md 分支（Markdown 派生）。作者原生用 Emacs/Denote，org-mode 是源，markdown 是派生。
- **版本成熟度**：frontmatter version 显示重度迭代——ljg-writes v6.3.0、ljg-paper v6.1.0、ljg-plain v5.0.0 等，不是一次性写的 prompt。

## 它在解决什么问题

通用 agent 写作有两个毛病：①AI 腔（"标志着""见证了""充满活力"等拐杖词、宣传腔、夸大象征）；②没风格（输出平庸、没立场）。这个仓库解决的是"**让 agent 输出有强烈个人风格、反 AI 腔的中文内容**"。

每个技能都是一个高度主观的工具：ljg-writes 是"像手术刀剖开一个观点"的写作引擎；ljg-paper 把论文讲成七拍故事；ljg-card 把内容铸成 PNG 视觉卡；ljg-invest 判断"项目是不是秩序创造机器"；ljg-learn 用八刀解剖概念。这些不是通用工具，是李继刚个人方法论的 agent 化。

不解决的是：它不追求"通用正确"，追求"有态度"。ljg-invest 明说"敢判断。'既可能好也可能坏'是废话，不许出现"——宁可武断也不要和稀泥。

## 第一性原理

### 根本假设

**Agent 输出质量的上限靠"放开"，下限靠"锁死"——规定不能怎么写（红线），但不规定必须怎么写。这样既挡住 AI 腔和陈词滥调（下限），又给 agent 留出风格空间（上限）。比起"规定怎么写"的处方式 prompt，约束式 prompt 更能让输出有个性而不跑偏。**

### 为什么相信

1. **ljg-plain 直接陈述这个哲学**："不规定怎么写。规定不能怎么写。下限锁死，上限放开。"（Don't prescribe how to write. Prescribe how NOT to write. Lock the floor, open the ceiling.）这是把"约束式 > 处方式"立成方法论。
2. **每个写作技能都有带编号的"红线"列表**。ljg-plain 明确标注"顺序即优先级"（红线标题"每条必须过，顺序即优先级"）；ljg-paper（12 条）、ljg-paper-river（6 条）仅编号未标注优先级语义。红线是硬约束——"学术腔是默认敌人"（ljg-paper 红线 1）、"禁 Inter 字体、禁纯黑、禁三等分卡片"（ljg-card 的 SKILL.md 品味准则段 + references/taste.md 逐条编码）。作者认定"挡住下限"比"指导上限"更重要也更可执行。
3. **反 AI 腔是反复出现的硬约束**。ljg-card 的 SKILL.md（:65 品味准则段）总领"核心：反 AI 生成痕迹——禁 Inter 字体、禁纯黑、禁三等分卡片、禁居中 Hero、禁 AI 文案腔、禁假数据"，references/taste.md 逐条展开。ljg-writes 有"AI 痕迹过滤"步骤，删除拐杖词、宣传腔、夸大象征。ljg-paper 红线 1："学术腔是默认敌人"。作者认定 AI 腔是 agent 写作的头号敌人，必须从多个技能反复堵。

### 假设成立的前提条件

- "不能怎么写"的红线能覆盖主要失败模式（AI 腔、陈词滥调、和稀泥）。
- agent 在红线之内能产出有风格的内容（要求模型有一定创造力，不只是遵守禁令）。
- 用户认同这种"有态度 > 通用正确"的取向。李继刚的个人风格是这套能成立的前提——换个人未必买账。

### 假设失效的条件

- 当红线不够全时，agent 会在红线外发明新的 AI 腔。红线只能挡已知失败，挡不住创造性跑偏。
- 当 agent 创造力不足时，"放开上限"变成"不知道写啥"——约束式 prompt 对弱模型可能不如处方式 prompt（至少处方式告诉它写什么）。
- 当用户不认同李继刚的风格时（比如觉得太武断、太主观），整套技能不适用。这套是强个人审美，不是通用工具。
- 当红线之间冲突时（比如"敢判断"vs"不夸大"），没有仲裁机制，靠 agent 拿捏。

## 设计哲学

### 技能组织方式：扁平 + ljg- 前缀 + 双格式派生

23 个技能扁平排列，全部 `ljg-` 前缀。前缀作用和 gsap-skills 的 `gsap-` 一样：在混合注册表里聚拢、不冲突。

两个技能（ljg-paper-flow、ljg-word-flow）是"工作流"——通过 Skill 工具链式调用其它 ljg-* 技能。这是技能组合的体现，类似 mattpocock 的封装器→核心委托。

双格式派生是独特设计：master 分支是 org-mode 源，md 分支是 markdown 派生。ljg-push 自动维护这个派生（org→md 转换）。作者原生用 Emacs/Denote（org-mode 是源），同时派生 markdown 适配 Obsidian/VSCode 生态。这是"一份源、多格式派生"的工程实践。

`.gitignore` 用不寻常的默认拒绝模式（`*` 全忽略，再 `!` 逐个放行）——白名单式保持仓库清洁。

### 触发词策略：英文功能句 + 中文触发词 + 否定范围界定

主导风格是混合句：开头一句英文功能总结，接 `Use when user says '<中文触发词>', '<英文触发词>'`，通常以 `NOT FOR <X>（用 ljg-Y）` 否定范围界定结束。逐字引用示例：

- ljg-card："Content caster (铸). Transforms content into PNG visuals. Seven molds: -l (default) long reading card, -i infograph, ... Output to ~/Downloads/. Use when user says '铸', 'cast', '做成图', '做成卡片', ... Replaces ljg-cards and ljg-infograph."
- ljg-book："...Use when user says '拆书', '拆这本', ... NOT FOR 章节摘要（用 Fabric extract_wisdom）、论文（用 ljg-paper）、单一观点深钻（用 ljg-think）、一个领域降秩（用 ljg-rank）."

`NOT FOR <X>（用 ljg-Y）` 是独特的——明确划"这个技能不管 X，X 用 ljg-Y"。这种交叉引用式的范围界定，让 agent 在多个相近技能里选对。和 obsidian-skills 的 defuddle 负面边界类似，但 ljg-skills 用得更系统（多个技能都有）。

一小部分技能用**纯中文**描述（无 Use when 包装），如 ljg-writes（"写作引擎。像手术刀剖开一个观点，一层层剥到底。1000-1500 字。"）。其余技能（包括 ljg-think、ljg-rank、ljg-invest）虽是内省/思维工具，但 description 仍带 Use when 触发词。

### 渐进式披露的实际用法

混合型，偏大型自包含。23 个里有 11 个捆绑了资源（references/ 或 assets/ 或 scripts/ 或大写 References/Workflows/Tools/），其余 12 个无捆绑资源、纯靠 prompt 正文（平均约 150 行，最大 ljg-rank 约 484 行、ljg-paper 约 427 行）。视觉/铸造型技能捆绑重型 `assets/`+`references/`：

- ljg-card 最重：7 个 HTML 模板 + capture.js + logo.png 在 `assets/`，taste.md + 7 个 mode-*.md 在 `references/`。SKILL.md（约 112 行）是调度器，指导 agent 为每个模式 `Read references/taste.md + references/mode-<x>.md`。
- ljg-library、ljg-map 类似（references/ + assets/，含 Python 脚本和 HTML 模板）。
- ljg-paper/ljg-paper-river/ljg-rank 各有 `references/template.org`（输出结构模板）。
- ljg-skill-map 有 `scripts/scan.sh`。
- ljg-present 有 `assets/slogan_template.html`；ljg-roundtable 有 `references/original-prompt.org`；ljg-qa 用大写 `References/`+`Workflows/`；ljg-push 用大写 `Workflows/`+`Tools/`。

行数差异巨大：小型（<70 行，ljg-word 41、ljg-paper-flow 60）到超大型（>400 行，ljg-paper 426、ljg-rank 484）。写作类技能偏大型自包含（prompt 密度本身就是价值），视觉类用调度器+引用。

### agent 集成文件策略：只有 CLAUDE.md，面向开发者

只有 `CLAUDE.md`（122 行），且面向"在仓库本身工作的开发者"而非终端用户。它记录仓库结构、技能格式、架构说明（内容处理流水线：URL→WebFetch、File→Read、text→direct）、共享约定（org-mode 加粗用 `*bold*` 单星号、Denote 文件名格式、ASCII 字符白名单——禁止 Unicode 框线字符）。

README（101 行）面向用户（安装 + 技能列表）。README 和 CLAUDE.md 分工：README 给安装者，CLAUDE.md 给开发者。

## 代表性 skill 解剖

挑三个体现哲学的：ljg-writes（纯 prompt 写作引擎）、ljg-card（调度器+视觉铸造）、ljg-invest（强主观判断）。

### 1. ljg-writes —— 约束式 prompt 的范本

- **结构**：约 161 行，无捆绑资源，纯 prompt。v6.3.0。
- **怎么工作**：姿态"外科医生的手，朋友的口"。五步过程（把观点放台面 → 切第一刀 → 切第二刀 → 切到底 → 合起来看），加"写作手法"工具箱和"磨"（polish）阶段含"AI 痕迹过滤"。"最高法则"：你会这样跟一个聪明的朋友说话吗？不会 → 改到会。
- **为什么这么设计**：纯 prompt 技能的价值在 prompt 密度本身。160 行不拆引用，因为这是一个完整的写作心智模型，拆开就断了。"最高法则"和"AI 痕迹过滤"是下限锁，五步过程是上限引导。v6.3 说明经过 6 个大版本迭代，prompt 是打磨出来的。

### 2. ljg-card —— 调度器 + 视觉铸造

- **结构**：111 行 SKILL.md（调度器）+ `assets/`（9 文件：7 HTML 模板 + capture.js + logo.png）+ `references/`（8 文件：taste.md + 7 个 mode-*.md）+ package.json 等。
- **怎么工作**：七种模具（-l 长图、-i 信息图、-m 多卡、-v 视觉笔记、-c 漫画、-w 白板、-b 大字，源表中文标签）。SKILL.md 指导 agent 为所选模式 `Read references/taste.md + references/mode-<x>.md`，然后 Playwright 截图输出 PNG 到 ~/Downloads/。页脚硬编码"logo + 李继刚"。taste.md 编码"反 AI 生成痕迹"美学。
- **为什么这么设计**：视觉技能的"下限"（反 AI 美学）靠 taste.md 锁，"上限"（七种模具的差异）靠 mode-*.md 引导。调度器模式（小 SKILL.md + 引用）比把所有模式塞进一个巨型 SKILL.md 更易维护——加个模具只需加个 mode 文件。

### 3. ljg-invest —— 强主观判断

- **结构**：125 行，无捆绑资源，纯 prompt。
- **怎么工作**：概念框架"财富不是钱，是被欲望照亮的秩序"。核心问题"这个东西在创建新秩序，还是在搬运旧秩序？"。五部分报告结构。明确"生成规则"（SKILL.md:121）："敢判断。'既可能好也可能坏'是废话，不许出现"和（:123）"禁止出现：赛道很大、团队优秀、前景广阔、蓝海市场"。
- **为什么这么设计**：投资判断最忌和稀泥。这套 prompt 强制 agent 亮明立场，禁用陈词滥调。这是"有态度 > 通用正确"的极致——宁可武断也不要废话。也是约束式 prompt（规定不能怎么说）的体现。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：ljg-skills 是本工作区里**唯一全中文、强个人审美**的仓库。约束式 prompt（规定不能怎么写）+ 红线列表 + 反 AI 腔是核心方法论，和 andrej-karpathy-skills 的"原则约束"取向有共鸣但更激进（红线更多、更武断）。`NOT FOR <X>（用 ljg-Y）` 的交叉引用式范围界定比 obsidian-skills 的 defuddle 负面边界更系统。双格式派生（org 源 + md 派生）是独特工程实践。frontmatter 用 `user_invocable` + `version`（不用 disable-model-invocation），version 显示重度迭代（v6.x），是本工作区里迭代痕迹最明显的。

## 局限 / 可借鉴点

### 可借鉴
1. **约束式 prompt（规定不能怎么写）**：下限锁死、上限放开，比处方式 prompt 更能保个性。
2. **红线列表 + 顺序即优先级**：硬约束带优先级，agent 知道冲突时先保哪条。
3. **反 AI 腔作为反复出现的硬约束**：从多个技能、多个角度堵 AI 腔（拐杖词、宣传腔、夸大象征、学术腔）。
4. **`NOT FOR <X>（用 ljg-Y）` 交叉引用**：相近技能间明确划界，帮 agent 选对。
5. **调度器 + 模式引用**：视觉技能用小 SKILL.md + mode-*.md，加模具只加 mode 文件。
6. **双格式派生**：一份源（org）+ 自动派生（md），适配多生态。
7. **version 字段记录迭代**：v6.x 让用户知道这是打磨过的 prompt，不是一次性产物。

### 局限
1. **强个人审美，不通用**：整套是李继刚方法论，换个人未必认同。"有态度 > 通用正确"对需要客观分析的场景（如纯技术文档）可能过激。
2. **红线挡不住创造性跑偏**：只能挡已知 AI 腔，agent 发明的新腔调不在红线里就拦不住。
3. **弱模型可能"放开上限"变"不知道写啥"**：约束式 prompt 对弱模型不如处方式 prompt 友好。
4. **目录大小写不一致**：多数技能用小写 `references/`/`scripts/`/`assets/`，但 ljg-qa 用大写 `References/`+`Workflows/`，ljg-push 用大写 `Workflows/`+`Tools/`。这是元数据不一致，可能引发路径问题。
5. **个人基础设施泄漏**：ljg-qa 和 ljg-push 含 curl `http://localhost:31337/notify` 的语音通知块——这是作者本地通知服务器，别人没有这服务，技能会报错。
6. **纯中文描述的技能触发面窄**：ljg-writes 等纯中文描述无 Use when 关键词，靠 agent 理解意图触发，匹配可能不如带关键词的稳。
