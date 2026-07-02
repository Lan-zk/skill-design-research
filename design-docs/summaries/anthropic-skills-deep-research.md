# anthropic-skills 深度研究

> Generated 2026-07-02 · repo: anthropic-skills · source: anthropics/skills · 目录: skills/anthropic-skills/

## 一句话定位

Anthropic 官方的 skill 示例仓库——一边教你怎么写 skill（17 个示例 + 规范 + 模板），一边把自己生产环境真在用的文档技能（docx/pdf/pptx/xlsx）源码拿出来给你看。

## 核心数据

- **SKILL.md 数量 / 位置**：18 个 = 17 个真技能（`skills/<name>/SKILL.md`）+ 1 个骨架模板（`template/SKILL.md`，仅 6 行）。仓库根无 SKILL.md。
- **默认分支 / 作者**：main / anthropics
- **根级 agent 集成文件**：**无**。没有 CLAUDE.md / AGENTS.md / GEMINI.md / CURSOR.md。唯一的 agent 消费配置是 `.claude-plugin/marketplace.json`（Claude Code 插件市场清单），把 17 个技能分成三个插件：`document-skills`（4 个文档技能）、`example-skills`（12 个示例）、`claude-api`（1 个）。
- **规范外置**：`spec/agent-skills-spec.md` 只有 3 行，指向 `https://agentskills.io/specification`。真正的规范不在仓库里。
- **两种许可**：12 个 Apache 2.0；4 个文档技能（docx/pdf/pptx/xlsx）是 source-available / proprietary（可看源码但不能拿出去用）；1 个（doc-coauthoring）既无 license 字段也无 LICENSE.txt，是 17 个技能里唯一的许可缺失。

## 它在解决什么问题

要理解这个仓库，先得分清它**不是**什么。它不是"给你装上就能用的工具箱"——README 第 24 行明确写："这些技能仅供示范和教育目的之用"。它真正解决的是两个问题：

1. **"skill 长什么样？"** —— 给想自己写 skill 的人一组参考实现。从最简单的（`template/SKILL.md` 6 行骨架）到最复杂的（`docx` 591 行 + 近 60 个文件，含 ISO XML 规范），覆盖了 skill 复杂度的整个光谱。
2. **"一个生产级 skill 到底要处理多少脏活？"** —— 文档技能是 Anthropic 在自家生产级 AI 应用里真在用的（README:20 原文："actively used in a production AI application"），他们把源码放出来，让你看到：生成一个 Word 文档远不止"调个 API"，要处理 XML 打包/解包、ISO 规范校验、字体回退、公式重算这些真实工程问题。

不解决的是：它不提供 skill 运行时本身（那是 Claude 的事），也不承诺这些示例在你环境里能直接跑（README 反复强调"先测试"）。

## 第一性原理

这个仓库的设计建立在一个根本假设上。这个假设贯穿了 frontmatter 极简、规范外置、脚本黑盒化等所有决策。

### 根本假设

**Skill 的可靠性应该靠"环境 + 约定"来保证，而不是靠在 frontmatter 里堆规则。**

换句话说：Anthropic 相信，让 skill 跑得对，主要靠 Claude 的能力 + skill 文件里讲清"为什么这么干"，而不是靠在元数据里写一堆 `allowed-tools` / `disable-model-invocation` / `MUST` / `NEVER` 把它捆死。

### 为什么相信这个

证据在仓库的每一个角落：

1. **frontmatter 极简到只有 `name` + `description` + 可选 `license`**（README:86-88）。17 个技能里**没有一个**用 `disable-model-invocation`、`allowed-tools` 这些别的仓库常见的行为约束字段。（`compatibility` 字段 skill-creator 提过，但定义为"依赖声明"而非行为约束，且实际没有一个技能用到。）这意味着 Anthropic 信任模型自己判断"该不该触发、用什么工具"，而不是在元数据层面强制。
   - 通俗解释：别的项目（比如本工作区里的 superpowers）会用 `disable-model-invocation: true` 这种开关，明确告诉 agent"你不准自己触发，只能用户手动调"。Anthropic 完全不用这招——他们赌模型自己能判断时机。
2. **`skill-creator` 元技能（仓库自身设计哲学的主要来源）明确反对死板规则**。两处原文：第 139 行——"向模型解释为什么事情重要，而不是用死板、陈旧的必须（MUST）。运用心智理论（theory of mind）……"（theory of mind：即站在对方角度想"它为什么会这么理解"，而不是单方面下命令）；第 302 行——"如果你发现自己用全大写写'永远（ALWAYS）'或'永不（NEVER）'，这是一个警示信号——如果可能的话，请重新构建并解释理由。"
   - 通俗解释：与其写"永远不要用硬编码值"，不如写"硬编码值会让这个技能换个环境就失效，所以请用配置项"——前者是命令，后者让模型理解了危害，它在新场景下也能自己判断。
3. **脚本黑盒化**。`webapp-testing/SKILL.md:14,85`："这些脚本可能非常大，从而污染你的上下文窗口。它们的存在是为了直接作为黑盒脚本调用，而不是被吸收到你的上下文窗口中。" 仓库里大量脚本（docx 的 XML 流水线、xlsx 的公式重算）都遵循"别读源码，带 `--help` 跑就行"。这是相信"脚本封装好了正确性，模型不需要懂内部"。

### 假设成立的前提条件

- 模型本身够强，能读懂自然语言描述的"为什么"，并据此泛化到新场景。如果模型理解力弱，纯命令式规则反而更可靠。
- skill 运行环境（Claude）统一且可信——因为不在 frontmatter 里限制工具，所以默认模型能用所有工具。这只有在"环境本身是受控的 Claude"时才成立。
- skill 作者有能力把"为什么"写清楚。这其实是个高门槛——解释为什么，比写"必须怎么做"难得多。

### 假设失效的条件

- **当 skill 跑在不可信环境**（比如自己接的开源 agent），frontmatter 不限制工具就变成漏洞——模型可能乱调工具。这时 superpowers 那种 `disable-model-invocation` 式的硬约束更安全。
- **当 skill 面向能力参差的模型**时，"解释为什么"对弱模型是噪声，硬规则反而更稳。
- **当作者写不清"为什么"**时，这个假设直接退化成"什么约束都没有"，skill 行为不可预测。template 那个 6 行骨架就是反例——它没有任何约束也没有任何解释，纯占位。

### 一个必须驳斥的反论

有人可能反驳：frontmatter 这么简，会不会只是因为这是个**示例/教学仓库**，示例技能本来就不需要 `disable-model-invocation` 之类的硬约束，并不代表 Anthropic 真的相信"靠环境不靠规则"？

这个反论站不住，因为**4 个文档技能是生产级的**（README:20 明确"actively used in a production AI application"），它们面对真实用户、真实文档，最需要可靠性——但它们同样没有任何 frontmatter 行为约束字段。如果"靠规则保可靠性"真的更稳，生产级技能理应最先采用。它们没用，说明 Anthropic 是有意为之，而不是因为"示例不需要"。这把第一性原理从"可能是教学仓库的随意"坐实成了"刻意的设计选择"。

## 设计哲学

### 技能组织方式：扁平 + 按许可分组（不在文件系统里分组）

`skills/` 下是**完全扁平**的 17 个同级目录，没有按类别分子文件夹、没有 `deprecated/`、没有命名空间。这和本工作区里 mattpocock 的 `skills`（有 `deprecated/`）、ljg-skills（按用途分）不同。

唯一的"分组"维度是**许可**，而且不在文件系统里体现，而在 `.claude-plugin/marketplace.json` 里：开源的进 `example-skills` 插件，闭源文档技能进 `document-skills` 插件。

为什么这么组织？因为分组是为了**分发**（哪些能开源给人用、哪些只能看不能拿），不是为了**理解**。Anthropic 认为 skill 之间是平权的，不需要用目录层级暗示"哪个更重要"。

### 触发词策略：自然语言句 + "何时用/何时不用"边界，且故意写得"强势"

仓库主导风格是**带嵌入式关键词列表的自然语言句子，明确划"何时用/何时不用"**。三个层次：

- **文档技能（最长，边界最硬）**——`docx` 的 description 逐字引用片段："Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files). Triggers include: any mention of 'Word doc', 'word document', '.docx'... Do NOT use for PDFs, spreadsheets, Google Docs, or general coding tasks unrelated to document generation."
- **TRIGGER/SKIP 规则（独此一家）**——只有 `claude-api` 用这种格式。逐字引用："TRIGGER — read BEFORE opening the target file... whenever: the prompt names Claude/Anthropic in any form... SKIP only when another provider is being worked on..."。这是把触发逻辑写成了 if/else 伪代码。
- **简短自然语言（少数）**——`frontend-design`："Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one..."

**为什么写得这么长、这么"强势"？** `skill-creator/SKILL.md:67` 给了答案："目前 Claude 有一种'未充分触发'技能的倾向——在它本应有用的地方却不使用。为了对抗这一点，请让技能描述稍微'强势'一点。" 

通俗解释：模型有个毛病——明明有个 skill 能帮忙，它却不用（"我能自己搞定"）。所以 description 不能只写"这个 skill 是干嘛的"，还得主动列举一堆触发场景、甚至反向说明"什么时候别用"，逼模型在边界情况里也能命中。这跟第一性原理一致——不是用 frontmatter 开关强制触发，而是用自然语言"说服"模型触发。

### 渐进式披露的实际用法

`skill-creator` 把规范写得很明确（`SKILL.md:88-93`）：三级加载——①元数据（name+description，~100 词，常驻上下文）②SKILL.md 正文（触发时加载，理想 <500 行）③bundled resources（按需加载，脚本可不读源码直接执行）。

实际执行分三档：

1. **规范执行（小 SKILL.md + 引用）**：`internal-comms`（33 行 → `examples/`）、`theme-factory`（60 行 → `themes/` 10 个文件）、`frontend-design`（56 行，无引用）。SKILL.md 只当调度器，详情进引用文件。
2. **中等 + 深度引用**：`mcp-builder`（237 行 → `reference/` 4 文件 + `scripts/`）、`pdf`（315 行 → `forms.md` + `reference.md` + 8 脚本）。
3. **大型自包含（超 500 行）**：`claude-api`（578 行）、`docx`（591 行）这两个自己破了"500 行"规矩。`skill-creator`（486 行）虽未破，但也紧贴上限、没拆引用。

值得注意：**破规矩的恰恰是仓库里最重要的几个**——文档技能是生产级的，claude-api 是 API 权威参考。这说明 500 行是"建议"不是"铁律"：当一个 skill 的核心价值就是密集参考信息时，塞进引用文件反而增加跳转成本，不如自包含。这是对第一性原理的再次印证——解释清楚为什么（这里是"信息密度高、跳转更亏"）比死守规则重要。

跨技能代码复用：docx/pptx/xlsx 三个文档技能**各自携带一份相同的** `scripts/office/` 流水线（unpack.py / pack.py / validate.py + ISO-IEC29500 XSD 规范）——是同源拷贝，不是引用同一处共享代码。`skill-creator/SKILL.md:304` 的原则是"重复劳动固化成脚本"（原文大意："如果 3 个测试用例都让子 agent 各自写 create_docx.py，这就是该技能应该捆绑这个脚本的信号。写一次，放进 scripts/，告诉技能去用。"）。这条原本针对单一技能内子 agent 重复劳动的原则，在文档技能里被放大到了跨技能场景——三份拷贝同源，说明作者把同一套经过验证的 XML 流水线复制到了每个需要它的技能里。通俗说：重复三次的活，就该固化成脚本。

### agent 集成文件策略：根本不用

这是和本工作区所有其它仓库最大的不同。superpowers、gstack、gsap-skills 都有 CLAUDE.md/AGENTS.md，告诉 agent 怎么消费这个仓库。Anthropic **一个都没有**。

为什么？因为 Anthropic 认为 skill 的消费方式**应该由 skill 规范本身定义**，而不是由仓库根的指令文件定义。规范外置在 agentskills.io，分发靠 marketplace.json。任何遵循规范的 agent 都该能消费，不需要仓库专门给它写个"使用说明"。这又一次体现了第一性原理——靠约定/规范，不靠额外指令。

## 代表性 skill 解剖

挑三个最能体现上述哲学的：`internal-comms`（规范执行）、`webapp-testing`（黑盒脚本）、`skill-creator`（元哲学）。

### 1. `internal-comms` —— 渐进式披露的教科书

- **结构**：SKILL.md 仅 33 行 + `examples/`（4 个 md 文件：3p-updates / company-newsletter / faq-answers / general-comms）+ LICENSE.txt。
- **怎么工作**：SKILL.md 几乎不写内容，只当调度器——告诉 Claude "用户要写哪类内部沟通，就去 `examples/` 里加载对应的格式指南"。
- **为什么这么设计**：内部沟通的格式会变（公司改了 newsletter 模板），但"按格式写"这个指令不变。把易变的格式放进 `examples/`、稳定的调度逻辑留在 SKILL.md，改格式时只动 examples 不动 SKILL.md。这正是渐进式披露的精髓——SKILL.md 保持小且稳定，重的、易变的进引用文件。

### 2. `webapp-testing` —— 黑盒脚本哲学的最明确实例

- **结构**：SKILL.md 96 行 + `examples/`（3 个 Playwright 示例）+ `scripts/with_server.py`。
- **怎么工作**：用原生 Python Playwright（不套框架）。给一棵决策树选方法（静态 HTML vs 动态 web app、有没有跑服务器），然后"侦察后行动"——先截图/查 DOM，再操作。核心脚本 `with_server.py` 明确要求当黑盒用。
- **原文大意**（`SKILL.md:14,85`，译自英文）："这些脚本可能非常大，从而污染你的上下文窗口。它们的存在是为了直接作为黑盒脚本调用，而不是被吸收到你的上下文窗口中。""将捆绑的脚本作为黑盒使用。"
- **为什么这么设计**：Playwright 脚本几百行，全读进上下文既费 token 又干扰模型判断。脚本的正确性由作者保证（带 `--help`、参数清晰），模型只要知道"什么时候调它、传什么参数"。这是把"可靠性"从模型身上卸下来、装到封装好的脚本上——和第一性原理一脉相承（不靠模型理解每个细节，靠环境封装正确性）。

### 3. `skill-creator` —— 仓库自身哲学的自我披露

- **结构**：SKILL.md 486 行（接近 500 行上限）+ `agents/`（analyzer/comparator/grader 三个子 agent 定义）+ `scripts/`（8 个 Python，含 eval 跑分、描述优化循环）+ `references/`（schemas.md）+ `assets/` + `eval-viewer/`。
- **怎么工作**：迭代循环——草拟 skill → 自动生成测试用例（带技能版 vs 基线版，并行子 agent）→ 评分 → 聚合基准 → 启动 HTML 查看器看结果 → 据反馈修改 → 重复。还有独立的"描述优化"系统，用 60/40 训练/测试集跑 `run_loop.py` 自动改 description。
- **为什么这么设计**：这是元技能——教你怎么写 skill 的 skill。它**自己**就把仓库的设计哲学全写进去了：三级加载、500 行建议、解释为什么而非死板 MUST、强势 description 对抗未充分触发、重复三次的活固化成脚本。读这一个 skill 就等于读懂整个仓库的设计观。它接近 500 行不是失控，是因为它的价值就是密集的元知识，自包含比拆引用更划算。

## 与别家的本质差异

（单仓库模式，此节略写，留给后续多仓库综合篇展开。）

要点：和本工作区其它仓库相比，anthropic-skills 是唯一**完全没有根级 agent 集成文件**的，也是唯一**把规范外置**（agentskills.io）的。frontmatter 最简（只用 name+description+license），不像 superpowers/gstack 大量用 disable-model-invocation 等约束字段。这些差异的根源都在第一性原理——靠规范和环境，不靠元数据堆约束。

## 局限 / 可借鉴点

### 可借鉴
1. **三级加载 + 500 行建议**：清晰、可操作。尤其"重复三次的活固化成脚本"这条，是从实践中长出来的工程经验。
2. **黑盒脚本哲学**：大脚本带 `--help`、不读源码直接调。对省上下文窗口非常有效。
3. **强势 description 对抗未充分触发**：明确写"何时用/何时不用"+ 嵌入关键词列表，比一句模糊描述触发率高得多。
4. **解释为什么而非死板 MUST**：让 skill 在新场景泛化，而不是僵化执行。

### 局限
1. **假设模型够强**：frontmatter 不约束工具、靠自然语言说服——这在弱模型或不可信环境里是弱点。本工作区里的 superpowers 用 `disable-model-invocation` 做硬约束，更适合"不信任模型自觉性"的场景。
2. **500 行被自己打破**：claude-api/docx/skill-creator 都超了。规范没说"什么时候可以超"，只说"接近上限就加层级"——但这三个偏偏没加。规范的执行标准有点模糊。
3. **规范外置导致自包含性差**：`spec/` 只是个 3 行指针。离线看这个仓库，你看不到完整规范，得联网去 agentskills.io。对一个"教学仓库"来说有点反讽。
4. **doc-coauthoring 没有许可字段也没有 LICENSE 文件**——17 个技能里唯一的例外，疑似疏漏。template 同样无 license。说明仓库自身元数据并非完美一致。
