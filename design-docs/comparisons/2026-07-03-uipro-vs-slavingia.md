# 数据库驱动 vs 著作驱动：两种技能设计哲学的对撞

> Generated 2026-07-03 · scope: ui-ux-pro-max-skill, slavingia-skills · 综合（multi-repo synthesis）

## 概览

两句话：ui-ux-pro-max 把 UI/UX 设计决策做成可搜索的 CSV 数据库 + BM25 检索引擎（BM25：一种按关键词词频排序的检索算法，搜索引擎常用，匹配字面重叠而非语义——所以模糊语义查询会力不从心），让 agent 查库推理而非凭感觉；slavingia 把一本创业书拆成 10 个自包含技能，让 agent 扮演作者给原则性建议。一个是「检索引擎 over 结构化数据」，一个是「角色扮演 over 散文原则」——同一问题（怎么把领域知识装进技能）的两个极端答案。

两个仓库表面上有共性（都是单作者强观点、都走 Claude Code 插件分发、都无 AGENTS.md/GEMINI.md/CURSOR.md、都不用 invocation 标志默认 both、都有「旗舰 + 元技能」结构），但底层的认识论假设完全相反：ui-ux-pro-max 给模型窄访问——按查询从 CSV 取部分结果，模型机械组装；slavingia 给模型宽访问——把全文 prose 原则喂给模型，模型生成性应用。两者都把知识放在文件里运行时读取，区别在访问粒度和模型的创作自由度，不在「知识在哪」。

## 各仓库第一性原理横向对照

| 仓库 | 根本假设 | 为什么相信 | 失效条件 |
|---|---|---|---|
| ui-ux-pro-max | 设计决策可枚举、可结构化、可检索——技能应是「推理引擎 + 可搜索数据库」；跨平台分发必须靠模板生成 | CSV + BM25 + 正则检索引擎（`search.py`）；18 平台 JSON 配置 + 模板引擎；平台级 description 调优；open-core 商业模式 | 设计趋势演变要补库；模糊语义查询 BM25 力不从心；单源镜像依赖人工 sync 已多处漂移（16 vs 22 stacks、docs/brand-guidelines.md 缺失、脚本未捆绑、19 vs 18 平台占位） |
| slavingia | 成型著作的方法论最好技能化成「一章一技能、自包含、扮演作者」——价值在 prose 原则本身，不需数据库/脚本 | 10 技能零依赖单文件；人格扮演开场统一声音；旅程排序对应章节；插件即单一分发渠道 | 需具体数据时给不了；单一 Claude Code 渠道；技能间无状态传递；人格扮演可能输出泛泛；内容更新要改 SKILL.md；跨技能内容冗余 |

同一问题（怎么把领域知识装进技能）的两种根本假设：一种是「知识是结构化数据，要检索」，一种是「知识是散文原则，要扮演」。两者的根本区别在**访问粒度 + 模型创作自由度**：

- **ui-ux-pro-max**：领域知识（161 产品类型 × 推荐配置）客观化、表格化进 CSV。模型的角色是「查询 + 组装」——给定产品类型，按查询从 CSV 取部分结果，机械组装成设计系统。模型拿到的是窄、确定的部分数据。
- **slavingia**：领域知识（创业方法论）是作者的判断力，不能表格化，只能通过 prose 原则 + 人格扮演「传染」给模型。模型的角色是「生成」——带着全文原则，针对具体情境生成建议。模型拿到的是宽、开放的全文。

两种都把知识放在文件里运行时读取——区别不在「知识在哪」（都在文件里），而在模型拿到多少、怎么用。这两种假设决定了它们在披露策略、工具依赖、分发工程、触发词风格上的全部分歧（见下）。

## 共性模式 vs 本质分歧

### 共性

- 都是单作者、强观点的技能集（nextlevelbuilder 的设计工具论；Sahil 的极简创业论）。
- 都以 Claude Code 插件形式分发（都有 `.claude-plugin/plugin.json` + `marketplace.json`）。
- 都无 `AGENTS.md`/`GEMINI.md`/`CURSOR.md`（跨 agent 集成不靠根级文件）。
- 都不用 invocation 标志（`disable-model-invocation`/`user-invocable`）——默认 both，既可斜杠调用又可自动触发。
- 都有「旗舰 + 元技能」结构：ui-ux-pro-max 有 `design` 元技能（路由器，分发到子技能）；slavingia 有 `minimalist-review` 元技能（checklist，自己兜底）。两者都是「在专项技能之上加一层元技能」，但元技能的行为不同（见分歧 6）。
- 都把 authorship 信号写进技能（ui-ux-pro-max 的 `metadata.author: claudekit`；slavingia 的开场「channeling... by Sahil Lavingia」）——前者初看有品牌名歧义。

### 本质分歧（假设差异，非措辞差异）

1. **知识形态假设**：结构化数据（CSV）vs 散文原则（prose）。
   → 导致披露策略相反：ui-ux-pro-max 按内容稳定性分层（稳定规则内联 SKILL.md + 易变数据进 CSV 按需查）；slavingia 全内联（无数据层概念，每个 SKILL.md 51-101 行自包含）。

2. **模型角色假设**：模型是「查询 + 组装器」vs 模型是「建议生成器」。
   → 导致工具依赖相反：ui-ux-pro-max 依赖 Python 脚本（`search.py`/`design_system.py`/`core.py`）+ 外部 API（`GEMINI_API_KEY` 调 Gemini 生成 logo/icon）；slavingia 零依赖（连脚本都没有，纯 prompt）。

3. **分发假设**：跨平台必须模板生成 vs 单一渠道足够。
   → 导致工程复杂度相反：ui-ux-pro-max 18 平台 JSON 配置 + 模板引擎 + 单源 + 镜像（已多处漂移）；slavingia 一个 plugin manifest 完事。代价对比：ui-ux-pro-max 的复杂度带来跨平台覆盖，但 sync 链脆弱；slavingia 的简单带来零维护成本，但锁死 Claude Code。

4. **触发面假设**：词面覆盖最大化 vs 场景语义精确化。
   → 导致 description 风格相反：ui-ux-pro-max 关键词枚举（Actions/Projects/Elements/Styles/Topics/Integrations 六类，长 description + 平台级调优）；slavingia 统一「Use when [场景]」两段式。前者赌自动触发靠关键词匹配，后者赌场景语义匹配。

5. **所有权信号**：`metadata.author: claudekit`（作者另一个品牌名，README:38 澄清 ClaudeKit.cc 是 nextlevelbuilder 自己的项目）vs 开场「channeling the philosophy of The Minimalist Entrepreneur by Sahil Lavingia」（作者本人署名）。
   → slavingia 的所有权链一目了然（仓库主 = 书作者 = 技能人格）；ui-ux-pro-max 用两个品牌名（仓库主 nextlevelbuilder vs 技能 metadata claudekit），初看有歧义但 README 已澄清是同一作者——是清晰度问题，不是信任断裂。

6. **元技能范式**：`design` 是路由器（分发到子技能）vs `minimalist-review` 是 checklist（自己兜底不分发）。
   → 前者适合「领域大有子领域」的场景（品牌设计拆 logo/CIP/slides），后者适合「原则可横切所有场景」的场景（8 条创业原则套任何决策）。

7. **商业模式**：open-core（免费旗舰 + 付费高级）vs 纯开源 MIT。
   → ui-ux-pro-max 是工具型技能，核心走量建生态、高级变现；slavingia 是内容型技能（书的方法论传播），全免费是传播最大化。

## 对 skill 设计的启示

1. **先定知识形态，再定披露策略**。结构化、易变、可枚举的知识 → 数据库 + 检索（ui-ux-pro-max 模式）；成型、稳定、散文性知识 → 单文件自包含（slavingia 模式）。硬给散文知识塞 references/scripts 是过度工程；硬给结构化数据写成长 prompt 是不可维护。判据：知识能不能表格化？能 → 数据库；不能 → prose。

2. **跨平台分发是工程问题，不是设计问题**。ui-ux-pro-max 的 18 平台 JSON + 模板引擎证明：当格式差异结构化时，生成优于手写。但代价是单源 + 镜像的同步链——它的 `.claude/` 已缺 6 个桌面栈、引用了不存在的 `docs/brand-guidelines.md` 和脚本、19 vs 18 平台占位漏模板。impeccable 的 13 份手写镜像走另一极端（手写占位符替换）。选型取决于平台数和格式差异度：平台多且差异结构化 → 模板引擎；平台少或差异小 → 手写镜像。但无论哪种，sync 链的维护成本都是真实代价。

3. **触发词风格要匹配自动触发机制**。关键词枚举（ui-ux-pro-max）最大化词面命中，适合「自动触发靠关键词匹配」的平台；场景句式（slavingia）精确语义但词面窄。ui-ux-pro-max 甚至按平台调优 description（Claude 长版、Gemini 6 词版）——说明作者认为各平台触发权重不同。但调优依据未公开，难以复现。实务上：若平台自动触发靠词面，用枚举；若靠语义理解，用场景句。

4. **元技能的两种范式**。ui-ux-pro-max 的 `design` 是路由器——分发到子技能（适合领域可拆分的场景）；slavingia 的 `minimalist-review` 是 checklist——自己兜底不分发（适合原则可横切的场景）。选型判据：用户进入时是「我该用哪个子领域」（→ 路由器）还是「我有个决策想被原则检验」（→ checklist）。

5. **所有权信号要清晰**。`metadata.author: claudekit` 而仓库主是 nextlevelbuilder——虽然 README:38 澄清 ClaudeKit.cc 是同一作者的项目，但用户初看会困惑「装的是谁的技能」。slavingia 的开场署名「by Sahil Lavingia」则毫无歧义。技能的作者署名应与仓库所有权一致，避免初看歧义——这是 ui-ux-pro-max 的清晰度缺陷（非信任断裂）。

6. **open-core 与纯开源的分野**。ui-ux-pro-max 是工作区唯一明确 open-core（免费旗舰 + 付费高级）的；slavingia 全免费（MIT）。open-core 适合「核心走量、高级变现」的工具型技能（设计工具、代码生成）；纯开源适合「方法论传播」的内容型技能（书、教程、哲学）。选型取决于技能是工具还是内容。

7. **「基于一本书」是合法的技能设计起点**。slavingia 证明：成书的方法论可以一对一映射成技能集，书的章节顺序就是天然组织，人格扮演开场统一声音。但代价是没有数据层——创业决策需要市场数据时给不了。适合「方法论已成型、价值在原则」的领域；不适合「需要实时数据/计算」的领域。

8. **单文件 vs 多文件 vs 数据库的取舍不是「先进 vs 落后」**。slavingia 的单文件极简适合散文知识；ui-ux-pro-max 的多文件 + 数据库适合结构化知识；impeccable 的「小入口 + 28 ref + 47 script」适合「确定性规则 + 脚本执行」知识。三者各有其理，关键是知识形态匹配披露策略。判据三问：知识能表格化吗？（能 → 数据库）知识是稳定规则还是易变数据？（分层）知识需要脚本执行吗？（需要 → 脚本层）。

9. **平台级 description 调优是未公开的暗知识**。ui-ux-pro-max 给 18 平台不同的 description（Claude 长版、Gemini 6 词版），但调优依据未公开。这暗示各 AI 平台的自动触发机制对 description 长度/密度的处理确实不同，但缺乏公开研究。这是 skill 设计领域的一个开放问题——什么样的 description 在什么平台触发效果最好，目前靠经验，不靠数据。

10. **同步链是单源 + 生成/镜像模式的固有脆弱点**。ui-ux-pro-max 已多处漂移（stacks 16 vs 22、docs/brand-guidelines.md 缺失、脚本未捆绑、19 vs 18 平台）；impeccable 靠 CI 同步 13 份镜像。无论模板生成还是手写镜像，只要有多份拷贝，sync 链就是脆弱点。slavingia 的零拷贝（10 个 SKILL.md 就是源，无镜像无生成）是这方面最稳健的——代价是不跨平台。这是「分发广度」与「同步稳健性」的权衡。
