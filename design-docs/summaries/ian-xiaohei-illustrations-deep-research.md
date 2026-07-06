# ian-xiaohei-illustrations 深度研究

> Generated 2026-07-03 · repo: ian-xiaohei-illustrations · source: helloianneo/ian-xiaohei-illustrations · 目录: skills/ian-xiaohei-illustrations/

## 一句话定位

Ian（helloianneo）的 Codex 技能——指导 agent 把中文文章里的判断、流程、状态、隐喻画成"小黑怪诞"风格的 16:9 手绘正文配图：用强约束把风格下限锁死，只留"为当前文章重新发明隐喻"这一个创造性变量给模型发挥。

## 核心数据

- **SKILL.md 数量 / 位置**：1 个，`skills/ian-xiaohei-illustrations/ian-xiaohei-illustrations/SKILL.md`（技能目录嵌套一层，外层是 GitHub 分享文档）。
- **默认分支 / 作者**：main / helloianneo（Ian，产品设计师 / 一人公司实践者）。
- **根级 agent 集成文件**：无 CLAUDE.md / AGENTS.md / GEMINI.md / CURSOR.md。Codex 集成靠技能内的 `agents/openai.yaml`（display_name / short_description / default_prompt / `allow_implicit_invocation: true`）。README 给 per-agent 安装说明（Claude Code 装 `.claude/skills/`、OpenClaw 装 `~/.openclaw/workspace/skills/`）。
- **frontmatter**：只有 `name` + `description`，完全符合 agentskills spec 的 Must（和 superpowers / obsidian-skills / slavingia-skills 同档）。
- **bundled 资源**：`references/` 5 个文件（style-dna / xiaohei-ip / composition-patterns / prompt-template / qa-checklist）+ `assets/examples/`（8 张示例图，仅作风格校准）+ `agents/openai.yaml`。
- **许可**：MIT。

## 它在解决什么问题

用 AI 给文章配图有个通病：模型默认产出"一眼 AI"的图——PPT 信息图感、可爱卡通、复杂架构图、商业扁平插画、左上角还爱写"Workflow 流程图"之类的类型标题。配图变成装饰，不传递文章的认知点。

这个技能解决的是"**怎么让 AI 产出有个人识别度、且承载文章认知动作的正文配图**"。它的做法不是给模型自由度让它发挥，而是反过来——**把风格锁死成一套强约束（纯白底 / 黑色手绘线稿 / 小黑 IP / 8 种结构 / 4 色规则），只留一个窄通道给模型做唯一的创造性工作：为当前文章重新发明一个怪诞但成立的物理隐喻**。

为谁：写中文文章、做知识型 / 方法论内容、用 Codex 做内容生产、想要比 PPT 信息图更轻更有识别度的配图风格的人。

不解决：商业插画 / 品牌 KV / 精致扁平插画 / 可编辑矢量源文件 / PPTX PDF 输出。它是 PNG 配图生成器，不是设计源文件工具。

## 第一性原理

### 根本假设

**AI 配图的失败不是"画不出图"，而是"画出 AI 味的图"。所以可靠配图来自把风格锁死成强约束 + 把创意限定在"为当前文章重新发明隐喻"这一件事上——不是给模型自由度，而是给它一个窄通道（小黑 IP + 8 种结构 + 低科技物件池）让它在里面做唯一的创造性工作。**

### 为什么相信

1. **style-dna.md 的“绝对不要”清单有 13 条**（不要商业插画 / PPT 信息图 / 正式流程图 / 课程课件 / 可爱卡通海报 / 儿童插画 / 复杂架构图 / 精致扁平插画 / 科技感 UI / 真实 App 截图 / 复杂背景渐变阴影纹理 / 把每个节点都解释清楚 / 左上角类型标题）。作者认定 AI 默认会往这些方向跑，必须显式堵死。这和 ljg-skills 的反 AI 腔红线、impeccable 的 44 条通病规则同源——都是"先列死下限"。
2. **xiaohei-ip.md 给了可测试的判断标准**（:53）："如果去掉小黑，图的核心隐喻还能完全成立，说明小黑太装饰了；要重写提示词，让小黑成为动作主体。" 这不是模糊建议，是个可判定的失败信号——把"IP 是否承担核心动作"这个主观判断变成了可执行的检验。类似 superpowers 的"删除 SKILL.md 仅跑 scripts 还能得到相同结果则发生推理下沉"。
3. **composition-patterns.md 的“反复刻规则”显式列出 9 个禁止复用的旧构图**（传送带两个断点 / 小黑拉判断杆 / 小黑变漏斗 / 小黑切素材鱼 / 小黑牵承接路径 / 小黑拉三层信息源 / 三个小黑拿喇叭搭桥开门 / 小黑盖章话术工具箱 / 小黑举牌看常见坑路径）+ "同类主题也要换新隐喻"。作者认定模型会偷懒复刻示例，必须显式禁止——`assets/examples/` 只用于风格校准（线条密度 / 留白 / 颜色克制），不进默认生成路径。
4. **prompt-template.md 把约束固化进填空模板**：变量是文章特定的（主题 / 核心意思 / 构图 / 元素 / 标注词），约束是固定的（Visual DNA / Color use / Constraints 三段写死）。模型只填创造性变量，不碰约束——这是"约束 vs 创意"的工程化分离。

### 假设成立的前提条件

- 图像模型能遵循风格约束（纯白底 / 手绘线稿 / 小黑 IP 的外形 / 4 色规则）。
- 模型有跨域类比能力——能把抽象概念映射成物理动作 + 低科技物件（composition-patterns 的三步原创法）。
- 图像模型中文渲染够用（标注词 2-8 字，能画对）。

### 假设失效的条件

- 图像模型遵循能力弱时，约束被忽略（画出可爱卡通 / PPT 感）——靠 qa-checklist 的失败信号兜底，重生成或局部编辑修复，费 token。
- 模型不会"重新发明隐喻"时，退回复刻旧构图（composition-patterns 列的 9 个禁止复用项就是常见失败）。
- 图像模型中文渲染差时，标注错字严重——qa-checklist 给的兜底是"优先局部编辑；错得多就重生成并减少标注数量"，治标不治本。
- 风格约束太死 + 物件池有限时，所有图长得像，"怪诞"变"套路"——作者用"同类主题也要换新隐喻"对抗，但物件池（纸箱 / 抽屉 / 漏斗 / 秤 / 邮筒 / 井 / 梯子...）本身有限，长期用可能枯竭。

## 设计哲学

### 技能组织方式：单技能 + 五层分层规范

单技能，但内部资源按"风格规范 / IP / 构图 / 模板 / 验收"分层组织在 `references/`。SKILL.md（~107 行）是入口 + 工作流调度器，references 是分层规范。这和 guizang-ppt-skill 的"单技能 + 双风格并行资源"布局类似，但 ian-xiaohei 是单风格、按规范维度分层而非按风格分叉。

### 触发词策略：关键词枚举式

description 逐字引用（`SKILL.md:3`）："生成 Ian 风格的中文正文配图。用于用户要求为中文文章、帖子、博客、Notion 文档、工作流文档、方法论、流程、结构、状态、隐喻或观点生成"怪诞""小黑""手绘""正文配图""文章插图""配图建议""shot list""去标题/改图"等任务；默认使用小黑 IP、纯白手绘、少量红橙蓝批注、简洁清爽但天马行空的视觉风格。"

结构是"功能声明 + 场景列表（中文文章/帖子/博客/Notion/方法论/流程/结构/状态/隐喻/观点）+ 关键词枚举（怪诞/小黑/手绘/正文配图/shot list/去标题改图）+ 默认风格"。关键词密集覆盖各种说法——和 ui-ux-pro-max 的关键词枚举同向，和 slavingia 的"Use when [场景]"句式反向。`agents/openai.yaml` 的 `allow_implicit_invocation: true` 让 Codex 可隐式触发，不只在用户打 `$ian-xiaohei-illustrations` 时。

### 渐进式披露的实际用法：显式指令 + 五引用按需读

SKILL.md 不长（~107 行），正文是 5 阶段工作流（消化正文 / 配图策略 / 单张生成 / 检查迭代 / 保存交付）+ 特殊场景处理 + 输出规范 + 安全守则。`references/` 5 个文件按需读取，SKILL.md:16 明确"按任务需要读取，不要一次塞满上下文"——这是 agentskills spec 推荐的三层披露（metadata → instructions → resources）的显式指令化。`assets/examples/` 是低频视觉校准（不进默认生成路径，SKILL.md:23 和 composition-patterns 的反复刻规则都强调）。这是工作区里把"按需加载"写成显式指令最清晰的技能之一。

### agent 集成文件策略：无根级文件，靠 agents/openai.yaml

根级无 CLAUDE.md / AGENTS.md 等。Codex 集成靠技能内的 `agents/openai.yaml`（display_name / short_description / default_prompt / `allow_implicit_invocation: true`）。README 给 per-agent 安装路径（Claude Code / OpenClaw），但不为每个 agent 写单独的根集成文件——和 obsidian-skills / slavingia-skills 的"无根集成文件"取向一致。

## 代表性 skill 解剖

只有一个技能，拆它的三个最能体现哲学的机制。

### 1. 五层分层规范（references/）—— 约束按维度切片

- **style-dna.md** 锁视觉：纯白 / 黑色手绘线稿 / 大量留白（主体 40-60%）/ 4 色规则（黑主体 / 红重点 / 橙主流程 / 蓝补充）/ 13 条“绝对不要”。
- **xiaohei-ip.md** 锁角色：小黑外形（黑色实心 / 白点眼 / 细腿 / 空表情）/ 性格（认真但荒诞 / 冷幽默不卖萌）/ 常见职责（搬运 / 拉线 / 卡断点 / 操作判断杆 / 变漏斗...）/ 6 条"禁止"（不要可爱吉祥物 / 不要儿童卡通 / 不要复杂服装 / 不要站角落看 / 不要抢结构表达 / 不要太商业圆润精致）+ **可测试判断标准**（去掉小黑图还成立→太装饰）。
- **composition-patterns.md** 锁构图 + 原创法：8 种结构类型（Workflow / 系统局部 / 前后对比 / 角色状态 / 概念隐喻 / 方法分层 / 地图路线 / 小漫画分镜）+ 三步原创隐喻生成法（抽象概念→物理动作 / 系统结构→低科技物件 / 让小黑承担动作）+ 物件池 + 动作池 + 反复刻规则（9 个禁止复用旧构图）。
- **prompt-template.md** 锁执行：填空模板，约束写死、变量留空。
- **qa-checklist.md** 锁验收：12 必过项 + 10 失败信号 + 6 迭代修复 + 交付判断。

为什么这么设计：把"配图质量"拆成五个可独立规范的维度（视觉 / 角色 / 构图 / 执行 / 验收），每层独立可维护。改风格不动构图，改 IP 不动视觉。这比把所有约束塞进一个巨型 SKILL.md 更易演进——和 obsidian-skills 的"按内容性质决定披露层级"同理，但这里是"按约束维度切片"。

### 2. 填空模板（prompt-template.md）—— 约束固化、创意留空

模板分四段：Visual DNA（纯白底 / 手绘线稿 / 小黑外形——写死）/ Recurring IP character（小黑必须承担核心动作——写死）/ Theme / Structure type / Core idea / Composition / Suggested elements / Chinese labels（变量，文章特定）/ Color use + Constraints（写死）。

为什么这么设计：模型只填创造性变量（这张图讲什么、小黑在干嘛、用什么物件），不碰约束（风格 / 颜色 / 比例）。这是"约束 vs 创意"的工程化分离——把易变的（每篇文章不同）和稳定的（风格规则）分到模板的不同区域。适用于"约束固定 + 内容多变"的生成任务。

### 3. QA 闭环（qa-checklist.md）—— prompt 版的验证器

12 必过项（16:9 / 干净白底 / 有小黑 / 小黑承担核心动作 / 没复刻旧构图 / 怪诞有创意 / 简洁清爽主体≤60% / 一图一结构 / 中文标注少短能读 / 三色各司其职）+ 10 失败信号（左上角标题 / 小黑像吉祥物 / 像 PPT 课件 / 元素箭头节点太多 / 大段文字 / 背景有纸纹阴影渐变 / 真实 UI / 中文错字 / 太死板 / 和旧案例过于相似）+ 6 迭代修复（太普通→让小黑成动作主体 / 太复杂→删节点 / 太可爱→强调 deadpan / 太 PPT→去标题边框网格 / 太像旧案例→换主物件和动作 / 文字错→局部编辑或重生成减标注）+ 交付判断（"先觉得有点怪，然后 1 秒内看懂结构"）。

为什么这么设计：图像风格没法用代码机械校验（对比度 / 字体那种可计算的，impeccable 能做；但"怪诞感 / 小黑是否承担动作"没法代码判定），所以用 checklist + 失败信号 + 迭代方法做 prompt 层的验收闭环。这是 guizang 的 `validate-swiss-deck.mjs`（代码校验版式）的 prompt 对应物——guizang 能代码拒实验性版式，ian-xiaohei 只能靠模型自觉跑 checklist。代价是验收不如代码硬，但适用面更广（图像风格这种主观领域代码本就管不了）。

## 与别家的本质差异

- 和 ljg-skills / guizang-ppt-skill / impeccable 同属"强约束锁下限"流派，但**约束形态按领域分层**：ljg 用红线列表（prompt 层，文本写作）/ guizang 用 Node 验证器（代码层，HTML PPT）/ impeccable 用 44 条规则引擎（代码层，前端 UI）/ ian-xiaohei 用 prompt 模板约束 + QA checklist（prompt 层 + 验收层，图像生成）。四者证明同一哲学（锁下限）在不同媒介有不同落地。
- **"重新发明隐喻"是独特机制**——显式禁止复刻旧构图（列 9 个），逼模型每次从当前文章重新发明。这是对抗"模型偷懒复刻示例"的显式武器，比 ljg / guizang 的反 AI 腔更聚焦于"创作复用"问题。
- **xiaohei-ip 的可测试判断标准**（去掉小黑图还成立→太装饰）是工作区里少见的——把"IP 是否承担核心作用"这个主观判断变成可判定信号。superpowers 有类似的（删除 SKILL.md 仅跑 scripts 还能得到结果→推理下沉），都是"用删除实验检验依赖"。
- 工作区里第二个 Codex Skill（第一个是 bggg-skills 系列），用 `$syntax` 调用 + `agents/openai.yaml` 集成。和 ian-xiaohei 一样面向 Codex 而非 Claude Code。

## 局限 / 可借鉴点

### 可借鉴

1. **强约束 + 唯一创意通道**：把能锁死的全锁死（风格 / IP / 构图 / 颜色），只留"为当前文章重新发明隐喻"这一个创造性变量。**when-to-apply**：生成任务有明确的"AI 味失败模式" + 创造性可以收窄到一个维度；**when-not-to-apply**：任务本身需要多维度创意（如开放式设计探索），或约束会扼杀核心价值。
2. **可测试的判断标准**：xiaohei-ip 的"去掉 X 还成立→X 太装饰"是范本——把主观质量判断变成可判定信号。**when-to-apply**：设计里有"X 必须承担核心作用"的要求（IP / 某个字段 / 某个步骤）；**when-not-to-apply**：质量本身就是多维主观的，没有单一可检验的核心依赖。
3. **显式禁止复刻**：列出禁止复用的旧构图 / 旧模式，逼模型每次重新发明。**when-to-apply**：示例驱动的技能（模型容易抄示例而非重新生成）；**when-not-to-apply**：任务有标准答案该复用（如模板填充），重新发明反而是错。
4. **约束固化进填空模板**：prompt-template 把约束写死、变量留空——模型只填创造性部分。**when-to-apply**：约束固定 + 内容多变的生成任务；**when-not-to-apply**：约束本身因场景而异（该用条件分支而非固定模板）。
5. **QA checklist 作 prompt 版验证器**：没法写代码校验的领域（图像风格），用 checklist + 失败信号 + 迭代方法做验收闭环。**when-to-apply**：失败模式可枚举但不可代码检测（主观品味 / 风格气质）；**when-not-to-apply**：失败可代码检测时直接用脚本验证器（guizang 模式更硬）。

### 局限

1. **风格约束依赖图像模型遵循能力**——弱模型画不出手绘线稿 / 小黑 IP，QA 兜底靠重生成费 token。
2. **物件池 / 动作池有限**——8 种结构 × 有限物件，长期用可能所有图长得像，"怪诞"变"套路"。作者用"同类主题换新隐喻"对抗，但物件池本身会枯竭。
3. **中文渲染依赖图像模型**——标注错字是常见失败，QA 兜底是减少标注，治标不治本。
4. **单风格不通用**——只适合"小黑怪诞"一种风格，要别的风格得另写技能（不像 ui-ux-pro-max 的 161 产品类型覆盖广）。
5. **examples 只用于校准不进默认路径，但模型可能仍受影响**——反复刻规则靠模型自觉，没有代码拦截（对比 guizang 的 validate-swiss-deck.mjs 能机械拒绝）。
6. **无脚本层**——纯 prompt 技能，没法做机械校验 / 自动化渲染。和 guizang / gstack / impeccable 的"prompt + 脚本"双轨相比，可靠性全压在模型遵循度上。
