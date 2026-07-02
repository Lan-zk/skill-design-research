# superpowers 深度研究

> Generated 2026-07-02 · repo: superpowers · source: obra/superpowers · 目录: skills/superpowers/

## 一句话定位

obra（Jesse Vincent）的一整套"给编程 agent 用的开发方法论"——14 个技能组成一条"想 → 规划 → 干 → 审 → 测 → 发"的流水线，靠一个会话启动时强制加载的引导技能，让 agent 在对的时候自动用对的技能，而不是把一套流程文档扔在那儿等 agent 自己想起来用。

## 核心数据

- **SKILL.md 数量 / 位置**：14 个，均在 `skills/<name>/SKILL.md`：using-superpowers（引导）、brainstorming、systematic-debugging、test-driven-development、subagent-driven-development、writing-skills、writing-plans、executing-plans、dispatching-parallel-agents、using-git-worktrees、requesting-code-review、receiving-code-review、verification-before-completion、finishing-a-development-branch。仓库根无 SKILL.md。
- **默认分支 / 作者**：main / obra（Jesse Vincent / Prime Radiant）
- **根级 agent 集成文件**：`CLAUDE.md`（116 行，贡献者指南，与 AGENTS.md 同内容）+ `GEMINI.md`（2 行 `@` import：`@./skills/using-superpowers/SKILL.md` + Gemini 工具映射）+ `AGENTS.md`（116 行，贡献者指南 + 哲学声明）。无 `CURSOR.md`。Claude Code 的引导加载靠插件机制（`.claude-plugin/plugin.json` + `hooks/session-start`），不靠 CLAUDE.md 的 `@`。
- **frontmatter**：14 个技能全部只有 `name` + `description`，无 license / allowed-tools / 调用控制字段。全部默认模型可调用。
- **行数**：71-690 行，中位数约 195，平均约 242。writing-skills 最长（690）。

## 它在解决什么问题

agent 写代码有个通病：拿到任务就直接开干，不先想清楚、不写测试、不规划。README:22 把目标 agent 描述成"一个热情但没品味、没判断、没项目上下文、讨厌测试的初级工程师"——superpowers 解决的是"**怎么让这样的 agent 按一条靠谱的流程干活**"。

它的做法不是写一份"开发流程文档"让 agent 读——因为 agent 不会主动读。它的做法是：①把流程拆成 14 个技能，每个管一段；②用一个引导技能（using-superpowers）在会话开始时强制加载，让 agent"在任何任务前先检查有没有技能适用"。README:26："because the skills trigger automatically, you don't need to do anything special."

不解决的是：它不教具体语言/框架怎么用，只管"流程纪律"。它是行为塑形层，不是知识层。

## 第一性原理

### 根本假设

**技能不是"文档"，是"塑造 agent 行为的代码"。要让 agent 稳定按流程干活，不能靠它自己想起来读流程文档，必须靠一个强制加载的引导机制 + 经过压力测试的技能内容，把流程纪律"焊"进 agent 的执行里。**

### 为什么相信

1. **技能 = 代码，不是散文**。AGENTS.md:95-96 原文："Skills are not prose — they are code that shapes agent behavior." 这不是比喻——作者真的用 TDD（测试驱动开发）的方式写技能：先写一个 agent 会失败场景的"测试"，再写技能让它通过。writing-skills:376-378 是铁律"NO SKILL WITHOUT A FAILING TEST FIRST"（没有失败测试就不写技能）。systematic-debugging 目录下带着 4 个压力测试文件（test-pressure-1/2/3.md + test-academic.md），是技能上线前的基线失败测试。
2. **引导机制是强制加载的**，且不同 harness 用不同机制。Claude Code 靠插件 session-start hook（`.claude-plugin/plugin.json` + `hooks/session-start`）——这是 harness 层强制，会话开始就触发，先于模型有机会偷懒；Gemini 靠 `GEMINI.md` 里的 `@./skills/using-superpowers/SKILL.md`——`@` 语法在会话开始时把引导技能注入上下文，相对软（注入了内容，但模型仍可能忽视）。AGENTS.md:76："A real integration loads the using-superpowers bootstrap at session start. The bootstrap is what causes skills to auto-trigger at the right moments. Without it, the skills are dead weight — present on disk but never invoked."（没有引导，技能就是死重——在磁盘上但永不调用。）作者认定"技能放那儿没用，必须强制加载引导才会被用"。注意两种机制的失效条件不同：hook 在弱指令遵循的模型下也成立（不是模型的选择），`@` 注入的 1% 规则仍是软约束。
3. **引导用"1% 规则"对抗 agent 的合理化**。using-superpowers:10-16："If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill."（哪怕 1% 可能性技能适用，你都必须调用。）还配了 12 行"红旗"表格，列出 agent 用来跳过技能的借口（"这只是个简单问题"、"让我先探索一下代码库"等）。作者认定 agent 会找借口偷懒，所以要把借口显式列出来堵死。

### 假设成立的前提条件

- agent 会读并遵守引导技能的"1% 规则"和红旗表（要求较强指令遵循能力）。
- 技能内容经过压力测试，确实能让 agent 在失败场景里改对（这是前置工作量，作者做了）。
- 用户愿意接受"任何任务前先检查技能"的额外开销。

### 假设失效的条件

- 当 agent 指令遵循能力弱时，"1% 规则"和红旗表拦不住它跳过技能——引导是软约束，靠说服不靠拦截。
- 当用户明确说"别用这套流程，直接给我改"时，superpowers 会退让——using-superpowers:18-26 明确指令优先级：用户显式指令 > superpowers 技能 > 默认系统 prompt。这是设计上的让步，也是失效点（用户一喊就放）。
- 当任务真的简单（改个 typo）时，"任何任务前检查技能"是负担。引导没有"琐碎任务跳过"的明确机制，靠 agent 拿捏。
- 当技能内容没经过测试就发布时，"技能=代码"的假设直接破——writing-skills 自己说没失败测试的技能不算数，但这个约束靠作者自觉，没有强制。

## 设计哲学

### 技能组织方式：扁平命名空间 + 概念分组

14 个技能扁平排列，无子目录、无 deprecated。writing-skills:82 明确"Flat namespace - all skills in one searchable namespace"（扁平命名空间——所有技能在一个可搜索命名空间里）。背后的假设是：技能是按"症状"被发现的（用户遇到 bug → 触发 systematic-debugging），不是按"类别"被发现的，所以目录分类没用——一个可 grep 的扁平命名空间比"目录即分类"更利于按症状定位。这在技能数量小（14 个）时成立；若技能数量膨胀到几十上百、症状表述重叠，扁平命名空间会出现名称冲突和发现困难。

但 README 在概念上把它们分组：测试（TDD）、调试（systematic-debugging）、协作（code-review）、元技能（writing-skills/using-superpowers）。这是逻辑分组，不反映在文件系统。命名都用动词或动名词（brainstorming、systematic-debugging、test-driven-development），writing-skills 的命名指南要求主动语态、动词优先。

### 触发词策略：第三人称 "Use when [症状]" 句

主导风格是第三人称的 `Use when [触发条件/症状]`，侧重症状而非技术。writing-skills 的 SDO（技能发现优化）章节明确规定：description 只写"何时用"，不写"技能干什么"——因为总结工作流会让 agent 跳过读技能内容。

14 个里 13 个以"Use when..."开头。逐字引用示例：
- systematic-debugging：`"Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes"`
- test-driven-development：`"Use when implementing any feature or bugfix, before writing implementation code"`

唯一例外是 brainstorming（`"You MUST use this before any creative work..."`），用祈使句"You MUST"——因为它是流水线入口，必须强制触发，不能留余地。

注意：14 个技能**无一用 disable-model-invocation**。全部默认模型可调用，靠引导技能强制触发，不靠 frontmatter 开关。这和本工作区其它用 disable-model-invocation 的仓库（如 impeccable）取向相反。

### 渐进式披露的实际用法

渐进式披露背后的假设：上下文预算是瓶颈，按需加载比全量加载划算——入口文件小，深层参考只在用到时读。这在参考文件大且只在部分场景需要时成立；若大部分任务都需要大部分参考，按需加载反而比一次读全更费（反复跳转拼读）。superpowers 的实践：

中位数约 195 行，8 个技能捆绑同级文件，6 个自包含。捆绑资源分四类：①prompt 模板（子 agent 调度用，如 subagent-driven-development 的 implementer-prompt.md）；②技术参考文档（100 行以上的深入探讨，如 systematic-debugging 的 root-cause-tracing.md）；③可执行脚本（如 review-package、find-polluter.sh）；④平台工具映射（using-superpowers 的 references/ 里 6 个 agent 的工具名等价物）。

writing-skills 的指导原则：100 行以上参考拆单独文件；可重用工具拆；原则和小于 50 行的代码内联。还明确**禁止 `@` 链接**（writing-skills:288）："@ syntax force-loads files immediately, consuming 200k+ context before you need them"——`@` 会强制加载吃掉 20 万+ 上下文。交叉引用用技能名 + `superpowers:` 前缀，不用路径导入。

### agent 集成文件策略：hook/`@` 引导 + AGENTS.md 哲学声明

`GEMINI.md` 用 `@` 语法强制加载 using-superpowers 引导；Claude Code 靠插件 session-start hook（`.claude-plugin/plugin.json` + `hooks/session-start`）触发引导。这是自动触发机制的实现——不是靠 frontmatter description 匹配，是靠会话开始时的强制注入/hook。`CLAUDE.md`（与 `AGENTS.md` 同内容，116 行）是贡献者指南，不是引导入口。

`AGENTS.md` 是贡献者指南，也是项目哲学最明确的声明。关键：AGENTS.md:42 明确说这套技能哲学**和 Anthropic 官方指导不同**——"Our internal skill philosophy differs from Anthropic's published guidance... PRs that restructure, reword, or reformat skills to 'comply' with Anthropic's skills documentation will not be accepted without extensive eval evidence."（我们不会接受把技能改成"符合"Anthropic 文档的 PR，除非有大量评估证据。）作者认定自己的方法论是实测调出来的，不盲从官方规范。

## 代表性 skill 解剖

挑三个体现哲学的：using-superpowers（引导/元技能）、test-driven-development（刚性纪律技能）、writing-skills（技能设计论文）。

### 1. using-superpowers —— 引导机制的核心

- **结构**：122 行 + `references/` 6 个平台工具映射。
- **怎么工作**：会话开始时被 `@` 强制加载。定义 1% 规则、指令优先级层级（用户 > 技能 > 系统 prompt）、技能类型分类（刚性 vs 柔性）。含 12 行红旗合理化表格。
- **为什么这么设计**：这是整个系统的入口。没有它，其它 13 个技能永远不会被调用。1% 规则和红旗表是"对抗 agent 偷懒"的显式武器——把 agent 常用的借口列出来，让它没空子钻。`<SUBAGENT-STOP>` 标签（:6-8）让被调度为子 agent 的跳过此技能，避免无限递归加载。

### 2. test-driven-development —— 刚性纪律技能

- **结构**：372 行 + `testing-anti-patterns.md`。
- **怎么工作**：铁律"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"（没有失败测试就不写生产代码）。RED-GREEN-REFACTOR 循环。先写代码？删除，重来——"删除意味着删除"，不保留参考。11 行合理化表格 + 红旗列表 + Good/Bad 代码对比。
- **为什么这么设计**：TDD 是典型"刚性技能"——writing-skills 说刚性技能"严格遵循，不要偏离纪律"。这种技能不能给 agent 灵活空间，必须用铁律 + 反合理化表格堵死所有"这次例外"的借口。显式反驳"TDD 是教条主义，务实意味着适应"→"TDD 就是务实的"。

### 3. writing-skills —— 技能设计论文

- **结构**：690 行（最长）+ 5 个同级文件（anthropic-best-practices.md、persuasion-principles.md、testing-skills-with-subagents.md、graphviz-conventions.dot、render-graphs.js）。
- **怎么工作**：核心论点"编写技能就是应用于流程文档的 TDD"。TDD 映射：测试用例 = 带子 agent 的压力场景，生产代码 = SKILL.md，RED = 无技能基线失败，GREEN = agent 遵从，REFACTOR = 消除漏洞。SDO 章节强制 `Use when...` 描述。"Match the Form to the Failure"表格把失败类型映射到引导形式：纪律失败 → 禁令 + 合理化表格；错误形状的输出 → 配方（recipe：说明输出是什么样）；遗漏元素 → 结构必填字段。
- **为什么这么设计**：这是元技能——教怎么写技能的技能。它把整个仓库的方法论固化：技能要 TDD 式开发、描述只写触发条件、形式匹配失败类型、禁用 `@` 交叉引用。690 行没拆引用，因为它的价值就是密集的元知识，自包含比拆引用更利于一次读懂。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：superpowers 靠"强制加载引导"实现自动触发（Claude Code 用 plugin session-start hook，Gemini 用 `@` import），而非靠 frontmatter description 匹配或用户手动调。它把技能当 TDD 产物——带压力测试文件、要求失败测试先行。AGENTS.md 明确声明自己的哲学和 Anthropic 官方不同。14 个技能无一用 disable-model-invocation，全靠引导强制触发，这和本工作区里 impeccable（`skills/impeccable/`）用 `user-invocable: true` 限制只能手动调的取向相反。（跨仓库对比待综合篇系统核实。）

## 局限 / 可借鉴点

### 可借鉴
1. **引导机制**：用 `@` 在会话开始强制加载一个引导技能，让它负责"在对的时候调对技能"。比靠 frontmatter description 匹配更可靠。
2. **技能 = 代码，TDD 式开发**：先写 agent 会失败场景的测试，再写技能让它通过。带压力测试文件当基线。这让技能质量可验证，不是拍脑袋。
3. **对抗合理化的显式武器**：1% 规则 + 红旗表格，把 agent 跳过技能的借口显式列出来堵死。比单写"必须用"有效。
4. **Match the Form to the Failure**：不同失败类型用不同引导形式——纪律失败用禁令，错误输出用配方，遗漏元素用必填字段。不是一刀切"写清楚"。
5. **禁用 `@` 交叉引用**：`@` 强制加载吃光上下文，用技能名引用代替。

### 局限
1. **引导是软约束**：1% 规则和红旗表靠 agent 自觉，指令遵循弱的模型拦不住。
2. **用户一喊就放**：指令优先级让用户显式指令压过技能，用户说"别用 TDD"就真的不用。这是设计让步，也是纪律的薄弱点。
3. **"技能=代码"靠自觉**：writing-skills 要求失败测试先行，但没有强制校验（不像 gstack 有 CI 跑技能检查）。作者自觉就守，不自觉就破。
4. **引导开销无差异化**：任何任务前都检查技能，琐碎任务也是。没有"简单任务跳过"机制，靠 agent 拿捏，可能过度流程化。
5. **压力测试文件可能过时**：systematic-debugging 的 test-pressure 文件是上线时的基线，agent 能力变了之后这些测试可能不再代表真实失败模式，需要持续维护。
