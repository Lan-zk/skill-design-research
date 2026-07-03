# 12 个 Skill 仓库综合分析：作者们到底在赌什么

> Generated 2026-07-03 · scope: 工作区全部 12 个仓库（superpowers, mattpocock/skills, obsidian-skills, gsap-skills, gstack, guizang-ppt-skill, ljg-skills, andrej-karpathy-skills, impeccable, anthropic-skills, slavingia-skills, ui-ux-pro-max-skill）· 综合（multi-repo synthesis）
> 原始材料：`design-docs/summaries/` 下 12 份单仓库深度研究。本篇只做跨仓库综合，不重做单仓库分析。每条论断应可在对应单仓库文档中溯源，单仓库文档又指向源文件行号。

## 概览

一句话：这 12 个仓库都在解决同一个问题——"怎么让 agent 稳定地做对一件事"，但它们对"agent 为什么会做错"的诊断完全不同，于是开出了完全不同的药方。有的赌"模型够强，讲清为什么就行"（anthropic、obsidian、slavingia）；有的赌"模型知识过时，得给它一份人工维护的对照源"（gsap、ui-ux-pro-max、obsidian）；有的赌"模型会偷懒跳步，得用流程或红线逼它"（superpowers、gstack、karpathy、mattpocock）；有的赌"模型审美差，得用代码硬拦"（impeccable、guizang、ljg）。**诊断决定药方——这是全部分歧的根。**

## 12 仓库第一性原理横向对照

| 仓库 | 根本假设（一句） | 为什么相信（一句） | 主要失效条件 |
|---|---|---|---|
| superpowers | 技能是塑造行为的代码（不是文档），要靠强制加载引导把流程纪律焊进 agent | 用 TDD 方式写技能（先写失败测试再写技能）；session-start hook 强制注入引导；"1% 规则"+ 红旗表堵借口 | 引导是软约束，弱模型拦不住；用户一喊就放；压力测试文件会过时 |
| mattpocock/skills | 技能价值在过程可预测非输出可预测；核心是分清该人触发还是该模型触发，每种付一种负载 | docs/invocation.md 编纂用户/模型调用描述风格差异；20 用户调用 + 16 模型调用刻意分化；路由器 ask-matt 治认知负载 | disable-model-invocation 字段不被某 agent 支持就失效；用户调用技能靠人记得；plugin.json 与声明不符 |
| obsidian-skills | Agent 不需"理解"Obsidian，只需拿到准确的机器可读格式说明书 | 5 技能 = 官方文档的 agent 镜像（README 逐项链接官方文档）；frontmatter 极简信任 agent；defuddle 负面边界靠自然语言 | 格式频繁变动时大技能维护成本高；隐式场景触发不到；规范歧义无兜底 |
| gsap-skills | 模型的 GSAP 知识过时且不可靠，不能信模型记忆，得用人工维护的技能对抗 | 三处反复反驳同一过时信息（token/.npmrc）；8 技能全带 ✅/❌ 双清单；README 把"推荐 GSAP"写成可执行指令 | 出新过时点维护者没补就一起过时；模型跟上后技能变多余负担；❌ 清单挡不住创造性错误 |
| gstack | AI 时代完整性边际成本接近零，所以默认该做完整——把团队各角色判断固化成技能走冲刺流水线 | ETHOS.md "Boil the Ocean"；技能按冲刺顺序喂给下一个；每个角色技能有真实工程产物（make-pdf 是 13 个 TS 文件的真实 CLI） | AI 能力不足/成本不低时做完整不再便宜；用户不愿走全流水线；ETHOS.md 单点控制；大技能弱模型跑不动 |
| guizang-ppt-skill | AI 生成视觉产物的可靠性来自约束严格性而非自由度 | 颜色完全不让自选；版式用 Node 验证器机械校验 S01-S22；CONTRIBUTING.md 直陈"约束让 AI 生成更可靠" | 用户要自定义时是硬伤；预设风格过时得重做；约束内仍会出错；Style A 无验证器 |
| ljg-skills | 输出上限靠放开、下限靠锁死——规定不能怎么写（红线），不规定必须怎么写 | ljg-plain 直陈此哲学；每技能带编号红线列表；反 AI 腔从多技能反复堵；部分技能 version v6.x（如 ljg-writes 6.3.0、ljg-paper 6.1.0），其余 v1-v5，显示重度迭代 | 红线挡不住创造性跑偏；弱模型"放开"变"不知道写啥"；强个人审美不通用；localhost 通知等个人基础设施泄漏 |
| andrej-karpathy-skills | LLM 写代码出错主要不是能力不够而是默认冲太快，给套行为约束能压下系统偏差 | 四原则与四失败模式一一对应；"目标驱动执行"引 Karpathy 原话；内置"成功样子"可观测指标 | 琐碎任务时四原则是负担；弱模型自然语言约束不如硬 hook；原则冲突无仲裁 |
| impeccable | AI 生成前端通病可枚举可机械检测，该用确定性规则机械拦截而非靠模型自觉 | 44 条规则可不带 LLM 跑；a11y 隔离成离散检查点；一技能多命令合避免菜单污染；13 份镜像提交进仓 | 通病演变要人工补规则；不跑 init 退回通用品味；CI 断了镜像漂移；主观反模式规则检测不准 |
| anthropic-skills | Skill 可靠性靠"环境+约定"保证，不靠 frontmatter 堆规则；信任模型判断 | frontmatter 极简（name+description，部分加 license，无约束字段）；skill-creator 反对死板 MUST 主张解释为什么；脚本黑盒化；4 个生产级文档技能同样无约束字段 | 不可信环境下不限工具是漏洞；弱模型"解释为什么"是噪声；作者写不清为什么就退化成无约束 |
| slavingia-skills | 成型著作方法论最好技能化成一章一技能、自包含、扮演作者——价值在 prose 原则本身 | 10 技能零依赖单文件；人格扮演开场统一声音；旅程排序对应章节；插件即单一分发渠道 | 需具体数据时给不了；单一 Claude Code 渠道；技能间无状态传递；人格扮演可能输出泛泛鸡汤 |
| ui-ux-pro-max-skill | UI/UX 设计决策可枚举可结构化可检索——技能应是推理引擎+可搜索数据库，不是长 prompt 教模型设计 | CSV+BM25+正则检索引擎（search.py）；18 份平台模板 JSON（skill.json 却列 19 个平台）+模板引擎；平台级 description 调优；open-core 商业模式 | 设计趋势演变要补库；BM25 对模糊语义力不从心；单源镜像已多处漂移（stack 数量四处矛盾：SKILL.md 称 10、skill.json 称 17、.claude 16、cli/assets 22）；高级技能要 GEMINI_API_KEY |

> 术语：TDD = test-driven development，测试驱动开发（先写测试再写代码）；BM25 = 一个经典的文本检索打分算法，按词频和文档频率给候选结果排序，匹配字面重叠而非语义；prose = 散文式表述（区别于表格/代码等结构化形式）；open-core = 开源核心 + 付费高级功能的商业模式；frontmatter = SKILL.md 顶部的 YAML 元数据块；渐进式披露 = progressive disclosure，技能入口 SKILL.md 短小，详细内容放同目录的参考文件按需读取，避免一次性把所有细节塞进模型上下文。

## 核心分类：作者"不信任模型的什么"决定了一切

12 个仓库表面差异极大（frontmatter 字段、披露策略、分发工程、触发词风格），但往根上挖，每个仓库的设计都由一个更前置的判断决定：**作者认为 agent 出错，主要出在哪一步？** 这个"不信任点"决定了后面所有选择。四类不信任，对应四种药方：

**1. 不信任模型的"理解力" → 解释为什么（不堆规则）**
- 代表：anthropic-skills（obsidian-skills 虽 frontmatter 也极简，但主导假设是"外化格式规范"，归第 2 类）
- 药方：frontmatter 极简，靠自然语言讲清"为什么这么干"，让模型在新场景自己泛化。脚本黑盒化（不读源码直接调）。规范外置。
- 假设：模型够强，能读懂"为什么"并泛化。

**2. 不信任模型的"知识" → 把知识外化成文件让模型读**
- 代表：gsap-skills（对抗过时知识）、ui-ux-pro-max（CSV 数据库 + 检索）、obsidian-skills（格式规范镜像）
- 药方：不靠模型训练记忆，把权威知识放进技能文件/数据库，运行时让模型读。gsap 用 ✅/❌ 清单反复纠正过时信息；ui-ux-pro-max 让模型查表不"想"；obsidian 把官方规范搬进技能。
- 假设：模型训练数据不可靠（过时/不全/有错），但模型能照着给定的权威源执行。

**3. 不信任模型的"纪律" → 用流程/红线逼它**
- 代表：superpowers（强制引导 + 1% 规则）、gstack（冲刺流水线 + Boil the Ocean）、andrej-karpathy-skills（四原则行为约束）、mattpocock（调用轴划分 + 路由器）
- 药方：模型会偷懒、跳步、过度设计，所以用 session-start hook 强制加载引导（superpowers）、用红旗表堵借口（superpowers）、用路由器分流（mattpocock/gstack）、用原则刹车（karpathy）。
- 假设：模型知道该怎么做但会跳过，得用流程或禁令逼它走完。

**4. 不信任模型的"审美/品味" → 用代码硬拦**
- 代表：impeccable（44 条确定性检测规则）、guizang-ppt-skill（版式验证器脚本）、ljg-skills（红线列表 + 反 AI 腔）
- 药方：模型会产出"一眼假"的通病（紫蓝渐变、AI 腔、版式乱），靠说服没用，用代码机械检测/校验。impeccable 44 条规则可不带 LLM 跑；guizang 的 validate-swiss-deck.mjs 拒绝实验性版式；ljg 用红线锁下限（虽是 prompt 层，但密度堪比代码）。
- 假设：模型的品味不可信，但"通病"可枚举可机械识别。

注意：多数仓库同时沾几类，但有一个**主导**不信任点。比如 ljg-skills 主导是"审美"（反 AI 腔、红线锁下限），但也沾"纪律"（规定不能怎么写本身就是纪律）；superpowers 主导是"纪律"，但 writing-skills 也强调"解释为什么"（沾"理解力"）。分类看主导方向，不绝对。

这个分类为什么重要？因为它解释了看似矛盾的选择。为什么 anthropic 和 superpowers 对 frontmatter 的态度几乎相反——anthropic 极简（只用 name+description），superpowers 也极简但额外靠 session-start hook 强制引导？因为 anthropic 赌模型理解力（不需要约束字段，description 讲清就够），superpowers 赌模型会偷懒（需要引导强制触发，但不需要约束字段，因为引导本身就管触发）。两者 frontmatter 都极简，**动机完全不同**。为什么 impeccable 和 slavingia 对"要不要脚本"完全相反？因为 impeccable 赌模型审美不可信（要代码拦），slavingia 赌 prose 原则就是全部价值（不要脚本）。**药方跟着诊断走，不是跟着"先进 vs 落后"走。**

## 共性模式

1. **共享骨架**：全部 12 个仓库都是"一个目录 + 一个 SKILL.md + YAML frontmatter（至少 name + description）+ 同目录可选的 bundled 资源（捆绑资源：放在技能目录里、按需加载的脚本/参考文件）"。description 是触发面，bundled 资源承载细节。这是 Agent Skills 规范的共识。

2. **都有"元技能"或"路由器"**：多数仓库在专项技能之上加了一层入口技能——superpowers 的 using-superpowers（引导）、mattpocock 的 ask-matt（路由器）、gstack 的根 SKILL.md（路由器）、ui-ux-pro-max 的 design（路由器）、slavingia 的 minimalist-review（checklist 兜底）、anthropic 的 skill-creator（教写技能的元技能）。当技能数 ≥ 几个时，作者们都觉得需要一个入口负责"在对的时候调对的技能"。

3. **都意识到"模型不会主动用技能"并各自补偿**：anthropic 的 skill-creator 直言"模型有未充分触发倾向"，建议 description 写得"强势"（嵌入关键词列表 + 何时用/何时不用）；superpowers 用"1% 规则"逼模型哪怕 1% 可能适用就调；gsap 把"推荐 GSAP"写成可执行指令；impeccable 把 description 写成超长动词链。各家都承认"技能放那儿模型不会自己用"，只是补偿手段不同（说服 vs 强制 vs 关键词覆盖）。

4. **单作者强观点居多**：12 个里 9 个是单作者强观点仓库（obra、mattpocock、kepano、garrytan、op7418、lijigang、pbakaus、slavingia、nextlevelbuilder），3 个是组织/官方（greensock、anthropic、multica-ai）。单作者仓库的设计更敢"固执己见"——guizang 不接受自定义色、ljg 强个人审美、gstack 的 ETHOS.md 禁外人改。

5. **都把"何时不用"当一等信息**：obsidian 的 defuddle（"不要用于 .md URL"）、ljg 的 NOT FOR（"用 ljg-Y"）、anthropic 的"Do NOT use for..."、impeccable 的"Not for backend-only"。划负面边界是跨仓库共识——因为触发条件重叠时，不划清"何时不用"就会误触发。

6. **"重复三次的活固化成脚本/数据"是跨仓库共识**：anthropic 的 skill-creator 明说这条原则，文档技能 docx/pptx/xlsx 各自携带一份相同的 office/ 流水线；gstack 把 PDF 渲染固化成 13 个 TS 文件的真实 CLI；impeccable 把反模式检测固化成 44 条规则引擎；ui-ux-pro-max 把设计决策固化成 15 个 CSV。

## 本质分歧（假设差异，非措辞差异）

**1. 可靠性靠"说服"还是"机械拦截"——最干净的一刀。**
- 说服派（prose/红线让模型自觉）：anthropic、obsidian、slavingia、gsap、karpathy、superpowers、mattpocock
- 机械派（代码检测/校验/拦截）：impeccable（44 规则）、guizang（验证器）、gstack（CI + hooks + 编译 CLI）、ui-ux-pro-max（BM25 检索是机械的）
- 分歧根源：作者认为失败是"模型没意识到"（→ 说服）还是"模型知道但控制不住手"（→ 拦截）。guizang/impeccable 选拦截，因为他们认定"自由度越高越出 AI 味"，光说没用。

**2. 知识形态假设：prose 原则 vs 结构化数据 vs 确定性规则 vs 官方规范镜像。**
- prose：slavingia、ljg、karpathy、superpowers（方法论/原则以散文形式嵌入）
- 结构化数据：ui-ux-pro-max（CSV + 检索）、gsap（✅/❌ 清单算半结构化）
- 确定性规则：impeccable（44 条）、guizang（22 版式 + 验证器）
- 官方规范镜像：obsidian（格式文档搬进技能）
- 分歧根源：作者认为领域知识能不能表格化/规则化。能 → 数据/规则；不能 → prose。slavingia 明说"价值在 prose 原则本身，不需数据库"；ui-ux-pro-max 明说"设计决策可枚举可检索"。两者对同一问题（怎么把领域知识装进技能）给了相反答案。

**3. 触发靠"引导强制"、"description 匹配"还是"用户手动"。**
- 引导强制：superpowers（session-start hook / @import）
- description 匹配（默认 both，即用户可斜杠调 + 模型可自动触发）：anthropic、obsidian、gsap、slavingia、ui-ux-pro-max、guizang、karpathy、impeccable（user-invocable 但未禁模型）；mattpocock 的 16 个模型调用技能也用这同一机制
- 收窄模型自主权（部分技能只许用户手动调）：mattpocock（20 个 disable-model-invocation 的用户调用技能）
- 路由器分发：gstack、mattpocock（ask-matt）、ui-ux-pro-max（design）
- 分歧根源：作者认为"模型该有多大自主权"。superpowers 赌"模型不会主动用，得强制引导"；anthropic 赌"模型会用，靠 description 说服就行"；mattpocock 赌"有些技能就不该模型自动调，得划出只许人触发的部分"。注意 mattpocock 和 anthropic 在模型调用技能上用同一机制（description 匹配），分歧只在 mattpocock 额外收窄了模型自主触发范围，不是触发机制本身不同。

**4. 跨平台分发靠"规范"、"镜像"还是"代码生成"。**
- 不放集成文件，靠规范：anthropic、obsidian、slavingia
- CLAUDE.md 即载荷 / 少量手写集成文件：karpathy、ljg、superpowers、gsap（AGENTS.md 单一事实源 + 其它退化成指针）
- 手写镜像（占位符替换）：impeccable（13 份）
- 模板引擎生成：ui-ux-pro-max（18 份平台模板 JSON，skill.json 声称 19 个平台）
- 代码生成 host 配置：gstack（hosts/ TS + setup --host）
- 外部安装器：mattpocock（skills.sh）
- 分歧根源：平台数 × 格式差异度。平台少/差异小 → 手写；平台多/差异结构化 → 生成。但无论哪种，**多份拷贝的同步流程都是脆弱点**（ui-ux-pro-max 已多处漂移：stack 数量四处矛盾（SKILL.md 10/skill.json 17/.claude 16/cli/assets 22）、docs/brand-guidelines.md 缺失；impeccable 靠 CI 同步 13 份）。slavingia 的零拷贝（10 个 SKILL.md 就是源）最稳，代价是不跨平台。

**5. frontmatter 哲学：信任模型（极简）vs 约束模型（丰富字段）vs 划分调用轴。**
- 极简（name+description，信任模型）：superpowers、anthropic、obsidian、slavingia、gsap、karpathy
- 丰富（allowed-tools/version/hooks/preamble-tier 约束）：gstack
- 划分调用轴（disable-model-invocation / user-invocable）：mattpocock、impeccable、ui-ux-pro-max（高级技能）、ljg（user_invocable+version）
- 分歧根源：作者认为"frontmatter 该不该管触发/工具"。anthropic 赌不该（信任模型 + 环境）；gstack 赌该（收敛工具面 + 分级加载）；mattpocock 赌该但只为"划分谁触发"。

**6. 个人方法论 vs 产品 vs 官方规范。**
- 个人方法论：superpowers、mattpocock、ljg、gstack、slavingia
- 产品/公司官方：gsap（GreenSock）、obsidian（kepano/Obsidian）、impeccable（pbakaus 产品）、ui-ux-pro-max（nextlevelbuilder 产品）
- 官方示例：anthropic
- 外部权威衍生：karpathy（从 Karpathy 推文提炼）
- 分歧根源：作者身份决定技能"为谁写"。个人方法论仓库面向"认同我这套的人"，敢强观点；官方/产品仓库面向"用我家产品的人"，重规范镜像和稳定性；anthropic 面向"学写 skill 的人"，重示例和教学。

## 对 skill 设计的启示

1. **先诊断"agent 为什么会做错"，再开药方**。这是 12 个仓库最一致的元教训。不要先问"用不用渐进式披露""用不用 frontmatter 约束"，先问"我的 agent 出错，是理解力不够、知识不对、纪律不严、还是审美差？"——四类错误对应四类药方（解释/外化知识/逼流程/硬拦）。诊断错了，药方再精巧也白搭。判据：错误是"模型不知道"还是"模型知道但不做"还是"模型做了但跑偏"？

2. **知识形态决定披露策略，不是反过来**。结构化、易变、可枚举的知识 → 数据库 + 检索（ui-ux-pro-max）；成型、稳定、散文性知识 → 单文件自包含（slavingia）；确定性、可检测的通病 → 规则引擎（impeccable）；权威规范 → 镜像进技能（obsidian）。硬给散文知识塞数据库是过度工程，硬给结构化数据写成长 prompt 是不可维护。判据三问：知识能表格化吗？是稳定规则还是易变数据？需要脚本执行吗？

3. **"说服"和"机械拦截"各有适用场景，别混用**。能代码检测的反模式（对比度、版式、过时 API）就用规则/验证器硬拦（impeccable/guizang）；靠模型判断的品味/风格就用 prose 原则说服（slavingia/ljg）。混用的代价：用代码拦主观品味会过死，用 prose 劝客观通病会拦不住。impeccable 自己都承认"布局太居中"这种主观反模式规则检测不准，要 LLM 批判兜底——说明作者清楚边界。

4. **跨平台分发是工程问题，同步流程是固有脆弱点**。ui-ux-pro-max（18 平台模板）和 impeccable（13 份镜像）证明：当平台数多且格式差异结构化时，生成/镜像优于手写。但两者都已出现漂移（ui-ux-pro-max 的 16 vs 22 stacks、缺失文件；impeccable 靠 CI 同步）。判据：平台多且差异结构化 → 模板引擎；平台少 → 手写或单一 CLAUDE.md。无论哪种，只要有多份拷贝，就要配 CI/sync 校验，否则漂移不可避免。零拷贝（slavingia）最稳但锁死单一平台——这是"分发广度"与"同步稳健"的权衡。

5. **触发问题没有银弹，但有补偿共识**。12 个仓库都承认"模型不会主动用技能"，补偿手段分三档：强制引导（superpowers 的 session-start hook，最硬，但依赖 harness 支持）、强势 description（anthropic 的关键词枚举 + 何时用/何时不用，最通用）、路由器/元技能（gstack/mattpocock/ui-ux-pro-max 的入口分流，适合技能数多时）。选型：harness 支持 hook → 引导；技能数 ≤ 几个 → 强势 description；技能数多 → 路由器。三者可叠加。

6. **frontmatter 字段不是越多越好，也不是越少越好，是"匹配你的不信任点"**。不信任模型理解力 → 极简（anthropic）；不信任模型工具选择 → 收敛 allowed-tools（gstack）；要划分谁触发 → disable-model-invocation/user-invocable（mattpocock/impeccable）。堆字段但没想清"管什么"是元数据噪声。

7. **"元技能"几乎是技能数增长后的必然**。技能数 ≥ 几个时，都需要一个入口技能负责"在对的时候调对的技能"。但元技能有三种形态：路由器（gstack 根、mattpocock ask-matt、ui-ux-pro-max design——分发到子技能）vs checklist 兜底（slavingia minimalist-review——自己套原则不分发）vs 引导（superpowers using-superpowers——不分发只逼检查）。选型判据：用户进入时是"我该用哪个子领域"（→ 路由器）还是"我有个决策想被原则检验"（→ checklist）还是"我啥都没想先逼我检查"（→ 引导）。

8. **强观点技能要接受"不通用"的代价**。guizang 不接受自定义色、ljg 强个人审美、gstack 的 ETHOS.md 禁外人改、superpowers 明说和 Anthropic 官方哲学不同。这些仓库都主动选了"固执己见"换"稳定输出"。代价是适用面收窄。判据：你的技能是"通用工具"（→ 妥协，给配置项）还是"方法论交付"（→ 固执，保声音）。slavingia 的"基于一本书"是方法论交付的极端——声音统一但锁死单一渠道。

9. **作者署名/所有权要清晰**。ui-ux-pro-max 6 个高级技能的 SKILL.md frontmatter 里 metadata.author 写 claudekit，而根 plugin.json/skill.json 的 author 写 nextlevelbuilder — 同一仓库两处作者名不同，初看有歧义（README 才澄清 ClaudeKit.cc 是同一作者的另一品牌）；slavingia 的开场"channeling... by Sahil Lavingia"则毫无歧义。技能的作者署名应与仓库所有权一致，避免初看困惑。

10. **"技能 = 代码"的程度是连续谱，不是二分**。从"纯 prompt"（slavingia/karpathy）→ "prompt + 脚本"（superpowers/anthropic 文档技能）→ "prompt + CLI 包装"（gstack make-pdf）→ "prompt + 检测规则引擎"（impeccable）→ "prompt + 数据库 + 检索引擎"（ui-ux-pro-max）。越往代码端，可靠性越高、可维护性越工程化，但门槛越高、对环境依赖越重。选型取决于"失败成本"和"团队能力"：失败成本高 + 有工程能力 → 重代码（impeccable/gstack）；失败成本低 + 个人维护 → 纯 prompt（slavingia）。

## 与已有综合报告的关系

- `design-docs/comparisons/2026-07-03-uipro-vs-slavingia.md` 是本篇的子集——它只对比 ui-ux-pro-max 与 slavingia 两个仓库，聚焦"数据库驱动 vs 著作驱动"。本篇把那次对比的"知识形态分歧"放到 12 仓库的更大谱系里，证明那只是六条本质分歧之一。
- `design-docs/comparisons/skill-projects-deep-analysis.md`（2026-06-30）覆盖 8 个仓库，写于 4 个新仓库（anthropic-skills、slavingia-skills、ui-ux-pro-max-skill、andrej-karpathy-skills）纳入工作区之前，且早于 12 份单仓库深度研究。本篇基于更全的 12 仓库 + 12 份单仓库研究，可视为它的更新与替代——本篇的"四类不信任"分类是那篇"五类编排"分类的再抽象（从"怎么编排"上推到"为什么这么编排"）。
