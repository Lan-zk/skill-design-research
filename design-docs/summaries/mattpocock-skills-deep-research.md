# skills (mattpocock) 深度研究

> Generated 2026-07-02 · repo: skills · source: mattpocock/skills · 目录: skills/skills/

## 一句话定位

Matt Pocock 的个人工程技能集——36 个技能按"稳定/实验/弃用"分桶管理，核心设计是一条"用户调用 vs 模型调用"的刻意划分：人手动触发的技能写得像给人看的菜单项，模型自动触发的技能写得像给 agent 匹配的触发器，两者泾渭分明。

## 核心数据

- **SKILL.md 数量 / 位置**：36 个，分布在 6 个桶目录：`engineering/`（14）、`productivity/`（5）、`misc/`（4）、`personal/`（2）、`in-progress/`（7）、`deprecated/`（4）。路径 `skills/<bucket>/<name>/SKILL.md`。仓库根无 SKILL.md。
- **默认分支 / 作者**：main / mattpocock
- **根级 agent 集成文件**：只有 `CLAUDE.md`（191 行，面向用户的营销文档）。无 `AGENTS.md`、`GEMINI.md`、`CURSOR.md`。`README.md`（17 行）反而是贡献者组织文档——这种倒置是刻意的。
- **frontmatter**：整个仓库只有四个键出现过——`name`、`description`、`disable-model-invocation`、`argument-hint`。20 个技能是用户调用（`disable-model-invocation: true`），16 个模型调用。无 license / allowed-tools。
- **行数**：7-140 行，平均约 73。分布集中在低端（微型编排器 7-16 行）和高端（实质性技能 100-140 行），中间也有不少（60-95 行）。

## 它在解决什么问题

Matt Pocock 是 TypeScript 专家。这个仓库解决的是"**agent 写代码时的常见失败模式**"——CLAUDE.md 把它归为四类：错位（没搞清用户要啥就干）、冗长（用一堆词说一件事）、代码损坏（不写测试、乱改）、泥球（架构混乱）。

每个失败模式对应一组技能：错位 → grill-me/grill-with-docs（盘问式澄清）、冗长 → domain-modeling（统一术语）、代码损坏 → tdd/diagnosing-bugs、泥球 → to-prd/improve-codebase-architecture。

不解决的是：它不教 TypeScript 具体语法，而是教"工程流程纪律"。技能都很小（CLAUDE.md:"designed to be small, easy to adapt, and composable"），刻意做得易改、可组合。

## 第一性原理

### 根本假设

**技能的价值不在"输出可预测"，而在"过程可预测"——让 agent 每次走同一条流程，而不是每次发明新流程。而要让过程可预测，关键是分清"该人触发还是该模型自动触发"：每种技能必须付一种负载——模型调用技能付 context load（description 始终加载，占 token/注意力），用户调用技能付 cognitive load（人不记就不触发）。调用轴划分的本质是"为每个技能选该付哪种负载"：该被 agent 自动发现的技能写成模型调用（付 context load 换自动触发），只该人手动调的技能写成用户调用（省 context load，但人得记）。混在一起写，要么浪费 context load 去描述不需要 agent 发现的技能，要么该自动触发的技能没触发词命中不了——两边都做不好。**

### 为什么相信

1. **用户调用 vs 模型调用的描述风格刻意不同**。docs/invocation.md 明确规定：用户调用描述"面向人：一行总结...剥离触发列表"；模型调用描述"面向模型，保留丰富触发短语...让自动调用命中"。实测对照：用户调用的 grill-me 描述是"A relentless interview to sharpen a plan or design."（一句话，无触发词）；模型调用的 tdd 是"Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions 'red-green-refactor', or wants integration tests."（带 Use when + 触发词）。这种划分不是偶然，是编纂成文档的策略。
2. **writing-great-skills 给出理论依据**（:7）："A skill exists to wrangle determinism out of a stochastic system. Predictability — the agent taking the same process every run, not producing the same output — is the root virtue."（技能的存在是为了从随机系统里挤出确定性。可预测性——agent 每次走同一流程，不是产出同一输出——是根本美德。）这把"过程可预测 > 输出可预测"立成核心信条。
3. **依赖用文本调用，不用文件链接**。docs/invocation.md："Dependencies are expressed as `/skill`-style prose invocation ('Run the `/grilling` skill'), not deep `../other-skill/FILE.md` cross-references."（依赖用 `/技能名` 文本调用，不用跨文件链接。）作者认定跨文件链接会让技能耦合死，文本调用让每个技能可独立替换。grill-me 整个正文就是"Run a `/grilling` session."——7 行委托给模型调用的核心。

### 假设成立的前提条件

- "用户调用 vs 模型调用"的划分能被 agent 正确识别（靠 disable-model-invocation 字段 + description 风格差异）。
- 技能保持小且可组合（CLAUDE.md 的设计目标），否则"过程可预测"会被大技能内部的不确定性破坏。
- 用户愿意手动触发那 20 个用户调用技能（不指望模型自动调）。

### 假设失效的条件

- 当 disable-model-invocation 字段不被某 agent 支持时，用户调用/模型调用的划分失效——20 个本该手动触发的技能被模型乱触发，或反之。
- 当技能变大时（平均 73 行还行，但若有技能膨胀），"过程可预测"在技能内部被破坏。那几个 140 行的技能已经开始有内部流程。
- 当用户不知道该手动调哪个技能时（20 个用户调用技能靠人记得），没人触发就没人用。ask-matt 路由器技能就是治这个的，但路由器本身也要人调。
- 当模型调用技能的触发词没覆盖用户实际说法时，自动触发不命中，技能成了死代码。

## 设计哲学

### 技能组织方式：稳定度分桶 + 调用轴分组

6 个桶按**稳定度**分：engineering/productivity/misc 是稳定（发布）、personal/in-progress/deprecated 是不稳定（不发布）。README 明确规定稳定桶必须在 plugin.json 里，不稳定桶绝不能进。这种"按成熟度分目录"比按"功能类别"分更实用——一眼看出哪些能用哪些别碰。

每个桶内的 README 又按**调用轴**（用户调用 vs 模型调用）分组。所以组织是二维的：桶（稳定度）× 组（调用方式）。文件系统只体现桶，调用分组靠桶 README。

deprecated/ 桶值得注意——它明确标记被取代的技能。仓库结构暗示了演变轨迹：ubiquitous-language（被动提取术语，deprecated）→ domain-modeling（主动构建锐化，已发布）；design-an-interface（deprecated）的"设计两次"概念被吸收进 codebase-design/DESIGN-IT-TWICE.md。不过这些演变 CHANGELOG 里没有明确记录（CHANGELOG 只记了添加 ask-matt/codebase-design/domain-modeling、移除 caveman/zoom-out、diagnose→diagnosing-bugs 重命名、write-a-skill→writing-great-skills 替换等），靠目录位置和文件名重叠推断。

### 触发词策略：按调用轴刻意分化

这是这个仓库最核心的设计。两种风格泾渭分明：

- **用户调用描述**——面向人，一句话声明，剥离触发列表。逐字引用：
  - grill-me：`"A relentless interview to sharpen a plan or design."`
  - handoff：`"Compact the current conversation into a handoff document for another agent to pick up."`
- **模型调用描述**——面向 agent，带 "Use when..." + 触发同义词。逐字引用：
  - tdd：`"Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions \"red-green-refactor\", or wants integration tests."`
  - codebase-design：`"Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary."`

为什么这么分？docs/invocation.md 说：用户调用技能靠人手动 `/技能名` 触发，描述是给人看的菜单项，不需要触发词；模型调用技能靠 agent 自动匹配 description，必须有触发词才命中。把触发词塞进用户调用描述是浪费（人不需要），把触发词从模型调用描述里拿掉是失效（agent 匹配不到）。

### 渐进式披露的实际用法

行数分布从 7 行到 140 行，集中在低端和高端，中间也有不少：微型编排器（7-16 行，如 grill-me 7 行、implement 15 行）几乎完全委托给别的技能；中等技能（60-95 行，如 ask-matt 61、writing-great-skills 82、design-an-interface 94）；实质性自包含技能（100-140 行，如 teach 140、diagnosing-bugs 134、codebase-design 115）。微型编排器的代表 grill-me 正文就是"Run a `/grilling` session."。

12 个技能捆绑同级文件，24 个自包含。引用文件有两种命名约定：UPPERCASE 概念文件（codebase-design/DEEPENING.md、DESIGN-IT-TWICE.md）和 lowercase 主题文件（tdd/mocking.md）。writing-great-skills/GLOSSARY.md 是 196 行的术语表，明确定义 Predictability、Context Load、Cognitive Load、Router Skill、Progressive Disclosure 等核心词，每个带 `_Avoid_` 别名。

GLOSSARY.md 对渐进式披露的定义很独到："Not primarily a token optimisation; it is how the information hierarchy is protected."（主要不是 token 优化，而是保护信息层次。）——披露是为了让 agent 知道"什么是主干什么是支线"，不是为了省 token。

### agent 集成文件策略：CLAUDE.md 当营销页，README 当贡献者笔记

倒置：CLAUDE.md（191 行）是面向用户的营销文档（"Skills For Real Engineers"），README（17 行）是贡献者组织规则。为什么？因为 Claude Code 读 CLAUDE.md，把它当着陆页最合理——agent 集成文件 IS 着陆页。README 降级给贡献者看。

只有 CLAUDE.md，无 AGENTS.md——尽管声称"work with any model"（CLAUDE.md）。跨 agent 分发靠 skills.sh 安装程序（`npx skills@latest add mattpocock/skills`），不在仓库里放 per-agent 集成文件。这是"分发外部委托"策略。

仓库还"吃自己的狗粮"：CONTEXT.md 和 docs/adr/ 都是 domain-modeling 技能产出的（README:165 描述 domain-modeling"积极构建和锐化项目的领域模型……并内联更新 CONTEXT.md 和 ADR"）；docs/invocation.md 定义自己的调用划分。注意 deprecated 的 ubiquitous-language 技能产出的是 UBIQUITOUS_LANGUAGE.md（不是 CONTEXT.md）——CONTEXT.md 是 domain-modeling 的产物，格式上模仿了 ubiquitous-language 的风格。技能仓库本身应用了这些技能。

## 代表性 skill 解剖

挑三个体现哲学的：grill-me/grilling（用户调用封装器→模型调用核心的委托模式）、writing-great-skills（技能设计宣言）、ask-matt（路由器）。

### 1. grill-me / grilling —— 封装器→核心的委托模式

- **结构**：grill-me 7 行（用户调用，`disable-model-invocation: true`），grilling 10 行（模型调用）。两者都自包含无 references。
- **怎么工作**：grill-me 正文就一句"Run a `/grilling` session."。grill-with-docs 同理（7 行，"Run a `/grilling` session, using the `/domain-modeling` skill."）。
- **为什么这么设计**：用户调用的封装器极薄，只负责"被人触发"，然后委托给模型调用的核心（grilling）。这样新增一个用户入口（grill-me 无文档版 / grill-with-docs 带文档版）只需 7 行，不复制核心逻辑。依赖用 `/技能名` 文本调用，不用文件链接——grilling 改了内部，grill-me 不用动。这是"小且可组合"的极致体现。

### 2. writing-great-skills —— 技能设计宣言

- **结构**：82 行 + GLOSSARY.md（196 行）。用户调用（`disable-model-invocation: true`）。
- **怎么工作**：定义两种负载框架——context load（上下文负载：模型端的 token/注意力成本，模型调用技能的 description 始终加载就持续付这个代价）和 cognitive load（认知负载：人端的记忆负担——人必须记住哪些技能存在及何时触发，人是索引）。引入信息层次（steps → in-skill reference → disclosed/external reference）。五种失败模式：premature completion、duplication、sediment、sprawl、no-op。
- **为什么这么设计**：这是仓库的技能设计宪法。GLOSSARY.md 给每个术语带 `_Avoid_` 别名（如 Predictability → 避免 "consistency, reliability, robustness, output-determinism"）。仓库自己的 CONTEXT.md（用 domain-modeling 技能维护）也用同款"避免别名"手法——比如弃用 "backlog"，统一用 "issue tracker"（CONTEXT.md:25 明确这个术语决策）。这是仓库吃自己的狗粮。全是 reference（无 steps），因为它不是流程技能，是参考技能。

### 3. ask-matt —— 路由器技能

- **结构**：61 行，用户调用，自包含。
- **怎么工作**：路由器——用户说"我不知道用哪个技能"，ask-matt 帮他选。GLOSSARY.md 把 router skill 定义为"一个用户调用技能，命名其它技能及何时用哪个"。
- **为什么这么设计**：20 个用户调用技能靠人记得，记不住就没人用。路由器治这个——人只需记得 ask-matt 一个，让它分流。这是"用户调用技能过多"的解药。writing-great-skills:20 原文："that piled-up cognitive load is cured by a router skill."（堆叠的认知负载靠路由器技能治。）

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：mattpocock/skills 是本工作区里**调用轴划分最刻意**的仓库——用户调用和模型调用描述风格截然不同，且编纂成 docs/invocation.md。也是**唯一按稳定度分桶**（engineering/productivity/misc/personal/in-progress/deprecated）的，让技能成熟度一眼可见。微型编排器（7 行委托）模式很极致——别的仓库技能都至少几十行，这里 7 行就成一个技能。仓库"吃自己的狗粮"程度最高（CONTEXT.md/adr/invocation.md 都是自家技能产物）。frontmatter 用 disable-model-invocation 做调用控制（20 个用户调用），和 superpowers 完全不用该字段靠引导触发的取向不同。（跨仓库对比待综合篇系统核实。）

## 局限 / 可借鉴点

### 可借鉴
1. **调用轴刻意划分**：用户调用描述写给人（无触发词），模型调用描述写给 agent（带触发词）。编纂成文档，不靠默契。
2. **稳定度分桶**：engineering/productivity/misc 稳定发布，personal/in-progress/deprecated 不发布。技能成熟度一眼可见，且 deprecated 保留演变轨迹。
3. **封装器→核心委托**：用户调用技能极薄（7 行），委托给模型调用核心。新增入口不复制逻辑。
4. **依赖用文本 `/技能名` 调用，不用文件链接**：技能可独立替换，不耦合死。
5. **路由器技能**：用户调用技能多了靠路由器（ask-matt）分流，治"记不住"。
6. **吃自己的狗粮**：仓库用自家技能产出 CONTEXT.md/adr，既是示范也是自验。

### 局限
1. **plugin.json 与声明不符**：组织 README 规定 engineering/productivity/misc 技能必须在 plugin.json，但实际只发布了 17 个——除 4 个 misc 被排除外，还有 2 个 engineering（implement、resolving-merge-conflicts）也被排除（且这两个在顶层 README 的 engineering 列表里也缺失）。约定和执行不一致，缺口比"misc 全缺"更大。
2. **只有 CLAUDE.md，无 AGENTS.md**：声称"work with any model"但没放跨 agent 标准的 AGENTS.md。跨 agent 分发外部委托给 skills.sh，仓库本身只适配 Claude Code。
3. **用户调用技能靠人记得**：20 个手动触发技能，没路由器就没人用。ask-matt 治标但不治本——路由器本身也要人调。
4. **disable-model-invocation 依赖 agent 支持**：该字段不被某 agent 支持时，调用划分失效。
5. **GLOSSARY.md 是 reference 不是强制**：术语表定义了"该用什么词不该用什么词"，但技能里用错词没有校验（不像 gstack 有 CI 检查）。
6. **微型编排器的可读性**：grill-me 7 行就一句"Run a /grilling session"，对人来说信息量极低，不读 grilling 不知道这技能到底干嘛。封装器过薄可能让用户困惑。
