# andrej-karpathy-skills 深度研究

> Generated 2026-07-02 · repo: andrej-karpathy-skills · source: multica-ai/andrej-karpathy-skills · 目录: skills/andrej-karpathy-skills/

## 一句话定位

把 Andrej Karpathy 一条吐槽 LLM 写代码毛病的推文，提炼成四条编码原则，用一份 `CLAUDE.md` 装进去——专门治 Claude Code / Cursor 写代码时"想太多、改太多、不问就干"的毛病。

## 核心数据

- **SKILL.md 数量 / 位置**：1 个，`skills/karpathy-guidelines/SKILL.md`（67 行）。单技能仓库。
- **默认分支 / 作者**：main / multica-ai（仓库 owner 是 forrestchang，原则源自 Karpathy）
- **根级 agent 集成文件**：`CLAUDE.md`（65 行，本身就是技能载荷）+ `CURSOR.md`（28 行，指向 `.cursor/rules/`）。无 `AGENTS.md`、无 `GEMINI.md`。
- **插件市场**：`.claude-plugin/marketplace.json` + `plugin.json`（owner forrestchang，指向 `./skills/karpathy-guidelines`）
- **许可**：MIT

## 它在解决什么问题

Karpathy 那条推文（`SKILL.md:9` 链接）列了 LLM 写代码的四个失败模式，这个仓库把它们一对一翻成四条原则：

1. 错误假设 → "Think before coding"（编码前思考）
2. 过度复杂 → "Simplicity first"（简洁优先）
3. 无关编辑 → "Surgical changes"（外科手术式修改，只动该动的）
4. 目标不清 → "Goal-driven execution"（把命令式指令变成可验证的目标）

它**不解决**"教 Claude 某个具体领域怎么写"——它是行为约束，不是任务技能。README:164-167 明说："偏向谨慎而非速度。对琐碎任务（改错别字、明显的单行修改）用判断力——不是每个改动都需要全套严谨。"也就是说，这四条是给"非平凡工作"的刹车，不是给所有场景的紧箍咒。

## 第一性原理

### 根本假设

**LLM 写代码出错，主要不是因为能力不够，而是因为它默认"冲太快"——不澄清就动手、过度设计、顺手改无关代码。给它一套明确的行为约束，能把这些系统性偏差压下去。**

### 为什么相信

1. **四条原则和四个失败模式一一对应**。这不是泛泛的"写好代码"，而是精准针对 Karpathy 观察到的具体毛病。每条原则都配了"什么算违反"和"违反了会怎样"。
2. **"目标驱动执行"直接引用 Karpathy 原话**（README:135-138）："LLM 极其擅长循环直到达成特定目标……别告诉它做什么，给它成功标准，看它跑。"——把命令式指令（"做 X"）转成声明式目标 + 验证循环（"目标是 X，验证条件是 Y"）。这是治"目标不清"的根本手段。
3. **内置了"成功样子"的验证标准**（`CLAUDE.md:65`）：这套指南有没有用，看 diff 里不必要的改动是否变少、因过度复杂而重写的次数是否变少、澄清问题是否在动手前而非动手后出现。作者不是空喊"提升质量"，而是给了可观测的判定指标。

### 假设成立的前提条件

- LLM 能读懂并遵守自然语言行为约束（这要求模型有一定指令遵循能力）。
- 用户愿意为"非平凡改动"承受多一轮澄清的成本。
- 四条原则的边界清楚——什么算"琐碎任务用判断力"，依赖模型自己拿捏。

### 假设失效的条件

- 当任务**真的琐碎**时（改个 typo），四条原则反而是负担——README 自己承认这点，所以留了"用判断力"的口子。但"判断力"本身不可机械执行，靠模型自觉，这是潜在的失效点。
- 当模型指令遵循能力弱时，自然语言约束不如硬性 hook（对比本工作区的 guard-repos.js 用代码强制拦截）。这个仓库是"软约束"，靠说服不靠拦截。
- 当原则之间冲突时（比如"外科手术式修改"vs"目标驱动执行"可能要求改更多地方），没有仲裁机制，靠模型自己权衡。

## 设计哲学

### 技能组织方式：单技能 + 内容三重镜像

仓库只有一个技能 `karpathy-guidelines`，但同样的四条原则以**几乎逐字相同**的措辞出现在三个地方：根 `CLAUDE.md`（65 行）、`.cursor/rules/karpathy-guidelines.mdc`（70 行，`alwaysApply: true`）、`skills/karpathy-guidelines/SKILL.md`（67 行）。三者主体内容（四条原则）一致，但有结构差异：`SKILL.md` 在正文开头有"Tradeoff"行、结尾是"Strong success criteria..."行，**没有**"These guidelines are working if..."验证页脚；而 `CLAUDE.md` 和 `.mdc` 带这个验证页脚（`CLAUDE.md:65`、`.mdc:70`）。所以"三重镜像"并非完全逐字一致——SKILL.md 是个略有删减的版本。

为什么三份？因为不同 agent 从不同地方读指令：Claude Code 读 `CLAUDE.md`、Cursor 读 `.cursor/rules/*.mdc`、插件市场读 `SKILL.md`。作者没有搞"一份源文件 + 多平台生成"，而是**直接把内容复制三份**，再用 `CURSOR.md:28` 立成贡献者契约。注意这个契约是**双向强制、第三份可选**：原文要求改原则时 `CLAUDE.md` 和 `.mdc` 必须同步，而 `SKILL.md` 只在"如果发布的技能/插件文本应该匹配"时才更新——是有条件的，不是强制的。

另外，触发用 description 只在 `SKILL.md` 和 `.mdc` 之间逐字重用；`plugin.json` 和 `marketplace.json` 用的是更短的非触发式总结描述（如 plugin.json:3 是"Behavioral guidelines to reduce common LLM coding mistakes, derived from Andrej Karpathy's observations on LLM coding pitfalls"，没有"Use when..."触发子句）。所以"触发面一致"只适用于 SKILL.md ↔ .mdc，不适用于插件元数据。

通俗说：宁可重复三遍，也要让每个 agent 都能从自己习惯的位置读到。这是"分发优先"的组织策略——内容不变，适配各平台的入口位置。

### 触发词策略：场景驱动自然语言句

description 逐字引用（`SKILL.md:3`）："Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria."

结构是"`<它是什么>. Use when <场景列表> to <要避免的毛病>`"。这是场景驱动（"writing, reviewing, refactoring"），不是关键词列表。同一个 description 字符串被复用到 `.mdc` 和 `plugin.json`，保持触发面一致。

值得注意的是：这是个**行为技能**（始终适用的指南），不是**任务技能**（有明确起止的工作）。它的触发其实是"任何时候写代码时"——但因为太泛，description 用"avoid overcomplication..."把场景收窄到"有这些风险时"。

### 渐进式披露的实际用法

渐进式披露（progressive disclosure：入口文件只放最简信息，深层参考放在旁边按需加载）。技能目录内部**没有任何引用资源**——`skills/karpathy-guidelines/` 只有一个 `SKILL.md`，没有 `references/`、`scripts/`、`assets/`。67 行就是全部。

但仓库层级有渐进式披露：`README.md`（概念 + 安装，171 行）→ `CLAUDE.md`/`.mdc`/`SKILL.md`（原则本体，~67 行）→ `EXAMPLES.md`（523 行，每个原则的错/对代码对比）。

问题在于：`SKILL.md` 正文**从不链接** `EXAMPLES.md`。读者只能从 README 发现它。这是一个披露断点——深层参考存在，但入口文件没指路。

### agent 集成文件策略：CLAUDE.md 即载荷

这里的 `CLAUDE.md` 不是"项目元指南"（像本工作区根的 CLAUDE.md 那样），它**本身就是技能内容**——四条原则的文本，和 `SKILL.md` 正文几乎逐字相同。这意味着作者把"agent 集成文件"和"技能载荷"合二为一：不用装插件，把 `CLAUDE.md` curl 到项目里就能用。这是最低门槛的分发方式。

## 代表性 skill 解剖

只有一个技能，但它的内部结构值得拆。

### karpathy-guidelines —— 行为约束技能的极简做法

- **结构**：正文开头一行"Tradeoff: caution over speed"（权衡：谨慎优于速度，`SKILL.md:11`），主体是四条原则（每条讲"是什么 + 为什么 + 违反长什么样"），结尾是"Strong success criteria let you loop independently..."行。注意"这些指南有效的标志是……"（These guidelines are working if...）这个验证页脚**只在 CLAUDE.md/.mdc 里有，SKILL.md 里没有**——这是三份镜像的结构性差异。
- **怎么工作**：作为始终在场的背景约束，在每次写/改/审代码时生效。不是被某个关键词触发的离散任务。
- **为什么这么设计**：行为约束要"始终在场"，所以用 `alwaysApply: true`（Cursor）或塞进 `CLAUDE.md`（Claude Code），而不是等触发。作者只列四条原则（未在源文件中明说为什么是四条，但从内容看每条都精准锚定一个 Karpathy 观察到的失败模式，少而精，便于模型记住和遵守）。
- **EXAMPLES.md 的角色**：523 行错/对代码对比，是原则的"证据"。但因为它没被 SKILL.md 链接，更像是给人类贡献者看的参考，而非 agent 运行时加载的资源。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：这是本工作区里**唯一一个把 agent 集成文件（CLAUDE.md）当技能载荷本身**的仓库。其它仓库的 CLAUDE.md 是"怎么消费这个仓库"的元说明，这里 CLAUDE.md 就是技能内容。也是**唯一一个内容三重镜像**的（其它仓库要么单份 SKILL.md，要么像 impeccable 那样用模板生成多份）。frontmatter 极简（只有 name/description/license），和 anthropic-skills 类似，但动机不同——这里是因为内容本身简单到不需要更多元数据。

## 局限 / 可借鉴点

### 可借鉴
1. **原则与失败模式一一对应**：不堆泛泛规则，每条原则都锚定一个具体可观测的毛病。这是写行为约束的好做法。
2. **"成功样子"可观测化**：不只说"提升质量"，而是给"diff 里不必要改动变少"这种可检查的判定标准。
3. **多平台分发用内容镜像**：当内容简单且稳定时，直接复制三份比搞生成流水线更省事（对比 impeccable 的 13 份生成镜像，那是内容复杂时才值得）。

### 局限
1. **EXAMPLES.md 披露断点**：523 行的深度参考没被 SKILL.md 链接，agent 运行时根本不知道它存在。要么链上，要么并入 SKILL.md。
2. **"用判断力"不可机械执行**：README 留的"琐碎任务用判断力"口子，依赖模型自觉，没有判定"什么算琐碎"的机制。这是软约束的固有弱点。
3. **三重镜像的同步成本**：靠贡献者契约（CURSOR.md:28）保证一致，但契约本身是"双向强制 + 第三份可选"——`CLAUDE.md` 和 `.mdc` 必须同步，`SKILL.md` 只在"发布文本应匹配"时才更新。没有自动化校验（比如 CI 检查三份 hash 一致），靠人记，SKILL.md 这份尤其容易漂移。
4. **行为技能的触发面过泛**："写代码时"几乎等于"always"，description 的 Use when 子句收窄效果有限。这类始终在场的约束，可能更适合用 hook 强制（像 gstack 的 careful 技能那样），而不是靠 description 匹配。
