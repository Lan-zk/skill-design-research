# ui-ux-pro-max-skill 深度研究

> Generated 2026-07-03 · repo: ui-ux-pro-max-skill · source: nextlevelbuilder/ui-ux-pro-max-skill · 目录: skills/ui-ux-pro-max-skill/

## 一句话定位

nextlevelbuilder 做的 UI/UX 设计技能集——把 161 种产品类型的设计决策（该用什么风格/配色/字体/图表）做成可搜索的 CSV 数据库（CSV：一种用逗号分隔字段的纯文本表格文件）+ BM25 检索引擎（BM25：一个经典的文本检索打分算法，按词频和文档频率给候选结果排序），让 agent 不靠「凭感觉设计」而是「查库推理」；再通过 npx CLI（npx：Node.js 自带的命令行包执行器，输 `npx <包名>` 就能直接跑某个 npm 包）把同一份技能渲染成 18 个 AI 平台各自的格式分发出去；同时把品牌/logo/PPT/图标等高级能力拆成 6 个独立技能走 open-core（开源核心 + 付费高级功能）商业模式。

## 核心数据

- **SKILL.md 数量 / 位置**：13 处 = `.claude/skills/<name>/SKILL.md`（7 个）+ `cli/assets/skills/<name>/SKILL.md`（6 个镜像，逐字节相同）。第 7 个 `ui-ux-pro-max` 是模板生成的，不进 `cli/assets/`。仓库根无 SKILL.md。
- **默认分支 / 作者**：main / nextlevelbuilder。但 6 个手写高级技能的 `metadata.author` 字段写的是 `claudekit`（作者另一个项目，README:38 链到 ClaudeKit.cc），不是仓库主 nextlevelbuilder——这是个所有权信号歧义（见「局限」）。
- **根级 agent 集成文件**：只有 `CLAUDE.md`（108 行，是开发者/贡献者指南，讲 src 布局、search 命令、sync 规则、git workflow，**不是**消费指南）。无 `AGENTS.md`/`GEMINI.md`/`CURSOR.md`。另有 `README.md`（639 行，英文）、`README.zh.md`（中文）、`CONTRIBUTING.md`（181 行）、`cli/README.md`（99 行）。`skill.json` 记版本 2.6.2。
- **真源（single source of truth）**：`src/ui-ux-pro-max/` 是 canonical（权威源）；`.claude/` 和 `.factory/` 是 symlinked（符号链接，类 Unix 的「快捷方式」）的 dev/test 副本；`cli/assets/` 是 npm 包的 bundled snapshot（打包快照）。
- **frontmatter**：7 个技能都用 `name` + `description` 两个标准键。6 个手写技能额外加 `argument-hint`（斜杠命令的参数提示）、`license: MIT`、`metadata: {author, version}`（非标准键）。旗舰 `ui-ux-pro-max` 反而最瘦——只有 `name` + `description`。无任何 `disable-model-invocation`/`user-invocable`/`allowed-tools` 标志 → 默认 both（用户可斜杠调用 + 模型可凭 description 自动触发）。

## 它在解决什么问题

README:23 定位：「An AI skill that provides design intelligence for building professional UI/UX across multiple platforms and frameworks.」（一个给 AI 编码助手提供 UI/UX 设计智能的技能，跨多平台多框架）。

核心是 v2.0 的 Design System Generator（设计系统生成器，README:41-96）——分析项目请求，输出完整设计系统：模式 + 风格 + 配色 + 字体 + 效果 + 反模式 + 检查清单。README:133-164 进一步列了 161 Industry-Specific Reasoning Rules（161 条行业专属推理规则），覆盖 Tech & SaaS / Finance / Healthcare / E-commerce / Services / Creative / Lifestyle / Emerging Tech——每条规则带推荐模式、风格优先级、配色情绪、字体情绪、关键效果、反模式。

Basic vs Premium 分层（README:259-276）是明确的商业策略：开源版给 Core UI/UX Intelligence（67 风格、161 产品类型、BM25 搜索、设计系统生成）；Premium 加 Extended Brand Design Skills（品牌识别、logo、CIP 企业视觉识别、banner、slides、icon、AI 资产生成、企业 token 架构）。这解释了为什么 `brand`/`design`/`slides`/`banner-design`/`design-system`/`ui-styling` 作为可独立安装的高级技能，与免费 `ui-ux-pro-max` 并存。

它解决的是「AI 写前端时没有设计判断力」——给 agent 一个可查的设计知识库 + 推理流程。不解决的是：它不替代设计师的创意判断，而是给一套结构化推荐让 agent 有据可依。

## 第一性原理

### 根本假设

**UI/UX 设计决策（某类产品该用什么风格/配色/字体/图表）是可枚举、可结构化、可检索的——所以技能应该是「推理引擎 + 可搜索数据库」，而不是「长 prompt 教模型怎么设计」。同时，跨平台分发必须靠模板生成，因为 18 个 AI 平台的技能格式/文件名/触发机制都不同，手写每份不现实。**

### 为什么相信

1. **数据库 + BM25 检索引擎**。`scripts/search.py` 用 BM25 + 正则匹配，在 15 个 CSV（styles/colors/typography/products/ux-guidelines/charts 等）上查。README:133-164 把 161 种产品类型每个都配了推荐模式/风格/配色/字体/反模式。作者认定设计决策是「查表」问题，不是「生成」问题——给定了产品类型，答案在库里，不需要模型「想」。CLAUDE.md:67 明确检索哲学是 BM25 + regex 混合，不用 embedding（向量检索）——选可解释、零依赖的检索，不选需模型推理的向量检索。
2. **模板生成系统**。README:484-498：「The codebase has been restructured to use a template-based generation system. All platform-specific files (.cursor/, .windsurf/, .kiro/, .factory/, etc.) are now generated dynamically by the CLI. Always use the CLI to install.」CONTRIBUTING.md:61：「Always make data/script changes in src/ui-ux-pro-max/, then sync to the CLI. Do not edit .claude/ or .factory/ directly for permanent changes.」作者认定单源 + 生成是唯一能维护 18 平台的工程方式——手写 18 份会漂移。
3. **平台级 description 调优**。同一技能在 18 个平台拿**不同**的 description frontmatter：Claude 拿最长的关键词枚举版（`claude.json` 还开 `quickReference: true`，含完整 Quick Reference 规则目录）；cursor/windsurf/copilot 拿一句话摘要；gemini/codex/continue/trae 拿 6 词版「UI/UX design intelligence with searchable database」。作者认定触发面要按平台调——可能因为各平台自动触发机制对长 description 的处理不同（权重、截断、解析差异），虽然调优依据未公开。
4. **open-core 商业模式**。免费旗舰走量 + 付费高级技能（brand/design/slides/banner/icon）变现。作者认定核心 UI/UX 智能该开源建生态，品牌/logo 等企业能力该收费养维护。

### 假设成立的前提条件

- 设计决策确实可枚举且相对稳定（161 产品类型覆盖当前主流；新形态出现要补库）。
- BM25 + 正则在 CSV 上的检索质量够用（比 embedding 便宜、可解释、零依赖，但对模糊语义查询可能不如向量检索）。
- 18 平台的格式差异确实是结构化的、可模板化的（每个平台一个 JSON 配置就够）。
- 用户愿意跑 `uipro init --ai <platform>` 安装（不跑则拿不到技能）。
- 单源 + 生成的同步链不断（CONTRIBUTING.md 的 sync 规则有人遵守）。

### 假设失效的条件

- 设计趋势演变（新风格如 bento grid 流行）时，CSV 要人工补，否则给过期建议。确定性数据只能挡/给已知配置。
- BM25 + 正则对「我想要一种温暖的感觉」这种模糊查询力不从心——词面不匹配就查不到，没有语义兜底。
- 18 平台模板配置已出现漂移：`skill.json` 列了 19 个平台（含 openclaw）但 `templates/platforms/` 只有 18 个 JSON（openclaw 是前向占位，没模板也没 CLI 选项）——占位已经漏了一个。
- 单源同步断链时镜像过期：`.claude/skills/ui-ux-pro-max/data/stacks/` 有 16 个 stack CSV，但 `src/ui-ux-pro-max/data/stacks/` 有 22 个（多 6 个桌面栈：avalonia/javafx/uno/uwp/winui/wpf）。`.claude/` 的拷贝相对 src 已经 stale——这正是单源 + 镜像依赖人工 sync 的代价。
- `docs/brand-guidelines.md`（被 `banner-design` 和 `brand` 技能引用）不存在——`docs/` 目录虽在（含一个无关文件），但缺这个被引用的文件，技能指向了未捆绑的资源。
- `ui-styling/SKILL.md` 引用了 `scripts/shadcn_add.py` 和 `scripts/tailwind_config_gen.py` 但目录里没有这两个文件——技能引用了未捆绑的资源。
- open-core 模式依赖付费高级技能有人买，否则维护不可持续。

## 设计哲学

### 技能组织方式：flat + hub-and-spoke + 两层架构

技能 flat 排在 `.claude/skills/` 下（无分类子目录），但内含 hub-and-spoke（星型）：`design` 是聚合/路由技能——它的 SKILL.md 把子任务路由到 `brand`/`design-system`/`ui-styling`（外部子技能）和 logo/CIP/slides/banner/icon/social-photos（内置引用）。这是「一个路由技能 + 多个专项技能」的星型结构。和 impeccable 的「一技能多命令」不同——这里是真的拆成多个独立技能目录，靠 `design` 当索引。

两层架构：旗舰 `ui-ux-pro-max`（生成、免费、自包含 704 行 + Python 搜索引擎）vs 6 个高级技能（手写、付费、渐进式披露带 references/scripts/data）。这两层的披露策略完全不同（见下）。

另有两棵平行树：`src/ui-ux-pro-max/`（canonical）和 `cli/assets/`（npm bundled snapshot）。`.claude/` 和 `.factory/` 是 symlinked dev/test 副本。

### 触发词策略：关键词枚举 + 平台级调优

逐字引用旗舰 description 开头（`.claude/skills/ui-ux-pro-max/SKILL.md:3`）：

「UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples.」

风格特点：Actions/Projects/Elements/Styles/Topics/Integrations 六类枚举，每类列一串关键词。这是为自动触发（auto-activate）的关键词匹配优化的——description 越长、关键词越密，越多用户请求能匹配上。这和 slavingia 的「Use when [scenario]」场景句式是两种取向——ui-ux-pro-max 走词面覆盖，slavingia 走场景语义。

平台级调优：同一技能在 18 个平台拿不同 description。Claude 拿长版（quickReference: true），cursor/windsurf/copilot 拿一句话摘要，gemini/codex/continue/trae 拿 6 词版。作者认定触发面要按平台调——但调优依据未公开（为什么 Gemini 拿 6 词版、Claude 拿长版？可能基于经验但未说明）。

### 渐进式披露的实际用法：双峰分布

- **旗舰 `ui-ux-pro-max`（704 行）**：大入口 + 脚本化数据库。把 10 类 UX 规则目录（Accessibility/Touch/Performance/Style/Layout/Typography/Animation/Forms/Navigation/Charts）全部内联进 SKILL.md，再把动态的 style/color/typography 查询委托给 `scripts/search.py`（BM25 + 正则查 CSV）。无 `references/` 目录。这是「大入口文件 + 脚本化数据库」，不是典型的小入口 + 引用。
- **6 个高级技能**：典型渐进式披露。`brand`（97 行）→ 11 个 reference .md + 4 个 .cjs 脚本 + 1 template。`design-system`（244 行）→ 7 reference + 9 脚本 + 8 数据 CSV + 1 template。`design`（313 行）→ 18 reference + 8 Python 脚本 + 8 数据 CSV。`ui-styling`（324 行）→ 7 reference。`slides`（40 行）→ 5 reference。`banner-design`（196 行）→ 1 reference。
- `design` 是最激进的渐进式——SKILL.md 是路由表，指向 18 个 reference 文件和 3 个脚本子目录，按需加载。

为什么旗舰反其道而行：因为它的核心价值是「161 产品类型 × 推荐配置」的检索，这部分在 CSV 里；SKILL.md 内联的是固定的 UX 规则目录（不常变、要模型每次看到），CSV 是常变的数据（按需查）。所以披露策略按「内容稳定性」分层：稳定规则内联，易变数据进库。这是 ui-ux-pro-max 独有的分层逻辑。

### agent 集成文件策略：只有开发者向 CLAUDE.md，无 per-agent 消费文件

只有 `CLAUDE.md`（108 行），且是开发者指南（src 布局、search 命令、sync 规则、git workflow），不是消费指南。README:360-380 的 Skill Mode (Auto-activate) vs Workflow Mode (Slash Command) 是最接近 per-agent 消费契约的——列出哪些平台自动激活（Claude Code/Cursor/Windsurf/Codex/Continue/Gemini/OpenCode/Qoder/CodeBuddy/Droid/KiloCode/Warp/Augment）、哪些用 `/ui-ux-pro-max` 斜杠命令（Kiro/Copilot/Roo Code/KiloCode）、Trae 要切 SOLO 模式。无 AGENTS.md/GEMINI.md/CURSOR.md——跨平台消费靠 CLI 生成的平台特定目录（`.cursor/skills/`、`.gemini/skills/` 等），不靠根级文件。

## 代表性 skill 解剖

### 1. ui-ux-pro-max（旗舰，生成）—— 推理引擎 + 数据库

- **怎么工作**：README:98-131 描述流程——用户请求 → 5 路并行检索（multi-domain search）→ 推理引擎 → 输出完整设计系统。SKILL.md 704 行内联 10 类 UX 规则目录，`scripts/search.py` 在 15 个 CSV 上跑 BM25 + 正则。`design_system.py` 是设计系统生成器，`core.py` 是共享检索核心。还有 `--design-system`、`--persist`（Master + page-override 模式）、`--variance`/`--motion`/`--density` 三个「设计旋钮」（design dials，可调设计变异度/动效/密度）。
- **为什么这么设计**：作者认定设计决策是查表问题。给产品类型，库里有推荐配置。模型不需要「想」，需要「查 + 组装」。这和 ljg-skills 的「红线列表让模型遵守」不同——这里不是约束模型，是替模型查数据。也和 impeccable 的「44 条规则检测反模式」不同——impeccable 挡（检测通病），ui-ux-pro-max 给（推荐配置）。

### 2. design（聚合，高级）—— 路由器技能

- **怎么工作**：313 行 SKILL.md 是路由表，把子任务分发到 `brand`/`design-system`/`ui-styling` 外部子技能和 logo/CIP/slides/banner/icon/social-photos 内置引用。调 Gemini AI 生成 logo/CIP/icon（`gemini-2.5-flash-image`、`gemini-3-pro-image-preview`、`gemini-3.1-pro-preview`，要 `GEMINI_API_KEY`）。`metadata.version: 2.1.0`（比兄弟技能的 1.0.0 新）。
- **为什么这么设计**：品牌设计是个大领域，拆成子技能各司其职，`design` 当索引。这和 gstack 的「拆成多个独立角色技能」同向，但多了个 hub（路由器）。

### 3. design-system（高级）—— 三层 token 架构 + 幻灯片子系统

- **怎么工作**：244 行，三层 token（primitive → semantic → component，即「原始 → 语义 → 组件」三层设计令牌，把颜色/间距等原始值层层包装成有语义的组件级变量）+ 一个完整 Slide System 子模块（BM25 搜索 `search-slides.py`、Duarte Sparkline 模式、Chart.js 集成、token 合规校验 `validate-tokens.cjs`）。声明 `Skill Dependencies: brand, ui-styling` 和 `Primary Agents: ui-ux-designer, frontend-developer`。
- **为什么这么设计**：token 架构是设计系统的工程化层，slide 是它的一个应用场景。把 slide 搜索引擎塞进 design-system 而不是独立的 slides 技能——因为 slide 依赖 token。`slides` 技能（40 行）是薄入口，`design-system` 是实现——这是「入口/实现分离」的内部拆分。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：ui-ux-pro-max 是工作区里**唯一把设计知识做成「可搜索 CSV 数据库 + BM25 引擎」**的（别家靠 prompt/引用让模型读）。和 impeccable 的「44 条确定性检测规则」都走代码路线，但 impeccable 检测反模式、ui-ux-pro-max 检索推荐配置——一个挡、一个给。是**跨平台分发最工程化**的——18 个平台 JSON 配置 + 模板引擎（impeccable 是 13 份手写镜像占位符替换，ui-ux-pro-max 是真模板引擎）。open-core 商业模式是工作区唯一明确的「免费 + 付费」分层。`metadata.author: claudekit`（作者另一个项目）而非仓库主 nextlevelbuilder——暗示这是产品组合的一员，不是个人仓库。（跨仓库对比待综合篇系统核实。）

## 局限 / 可借鉴点

### 可借鉴

1. **设计知识数据库化**：可枚举的决策（产品类型 → 推荐配置）进 CSV + 检索引擎，比塞进 prompt 让模型「记」更准、可维护、可解释。零依赖（BM25 + 正则，不需 embedding 模型）。
2. **模板生成跨平台分发**：单源 + 平台 JSON 配置 + 模板引擎，是维护多 AI 平台的工程正道。当格式差异结构化时，生成优于手写。
3. **按内容稳定性分层披露**：稳定规则内联 SKILL.md，易变数据进 CSV/数据库按需查——这是 ui-ux-pro-max 独有的分层逻辑，比一刀切的「全内联」或「全引用」更精细。
4. **hub-and-spoke 路由技能**：`design` 当索引指向专项子技能，比全部塞一个技能更清晰，又比完全平权更易导航。
5. **open-core 分层**：核心走量开源建生态，高级能力收费养维护——工具型技能的可持续模式。

### 局限

1. **单源 + 镜像依赖人工 sync，已多处漂移**：`.claude/` 缺 6 个桌面 stack CSV（16 vs 22）；`docs/brand-guidelines.md`（被技能引用）不存在；`ui-styling` 引用的 2 个脚本未捆绑；`skill.json` 列 19 平台但只有 18 个 JSON 模板（openclaw 占位漏模板）。单源的代价是 sync 链一旦断就漂移。
2. **BM25 + 正则对模糊语义查询力不从心**——「温暖的感觉」查不到，没有语义兜底。
3. **161 产品类型的推荐配置会过时**，要人工补。确定性数据只能给已知配置。
4. **平台级 description 调优没有公开依据**——为什么 Gemini 拿 6 词版、Claude 拿长版？可能基于经验但未说明，难以复现/验证。
5. **`metadata.author: claudekit` 而非仓库主 nextlevelbuilder**，初看品牌名歧义——README:38 澄清 ClaudeKit.cc 是同一作者的另一品牌，所以不是信任断裂，但用户初看会困惑「装的是谁的技能」。
6. **高级技能要 `GEMINI_API_KEY`**（design 调 Gemini 生成 logo/icon），引入外部依赖和成本——不是纯本地可跑。
7. **旗舰 704 行 + 内联规则目录**，对上下文窗口是负担——虽然 quickReference 只在 Claude 平台开，但 Claude 用户每次激活都吃 704 行。
8. **生成层不透明**：`cli/src/` 和 `dist/` 被 gitignore（`cli/.gitignore:2`），clone 里看不到 CLI 的 TypeScript 源码——只能看 `cli/assets/`（bundled snapshot）和 `src/ui-ux-pro-max/`（数据源），生成逻辑本身不可审计。
