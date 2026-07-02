# guizang-ppt-skill 深度研究

> Generated 2026-07-02 · repo: guizang-ppt-skill · source: op7418/guizang-ppt-skill · 目录: skills/guizang-ppt-skill/

## 一句话定位

op7418（歸藏）做的网页 PPT 生成技能——给 agent 一套严格约束的 HTML 模板和版式规则，让它稳定产出"不像 AI 做的"横向翻页演示文稿，而不是自由发挥搞出一堆丑幻灯片。

## 核心数据

- **SKILL.md 数量 / 位置**：1 个，根 `SKILL.md`（542 行）。单仓库即单技能，技能目录 = 仓库根。
- **默认分支 / 作者**：main / op7418（歸藏）
- **根级 agent 集成文件**：**无**。没有 CLAUDE.md / AGENTS.md / GEMINI.md / CURSOR.md。靠 SKILL.md 自身的环境感知分支处理不同 agent。
- **frontmatter**：只有 `name` + `description`，无 license / allowed-tools / 调用控制字段。默认模型+用户双可调用。
- **许可**：AGPL-3.0（LICENSE 文件）
- **bundled 资源**：`assets/`（2 个 HTML 模板 + motion.min.js + 9 个 WebP 背景）、`scripts/`（1 个 Node 验证器）、`references/`（10 个 Markdown 参考文件）

## 它在解决什么问题

用 AI 生成 PPT 有个核心矛盾：HTML/CSS 太自由，agent 自由发挥就会做出"一眼 AI"的丑东西——配色乱、版式随意、装饰过度。这个技能解决的是"**怎么让 agent 稳定产出风格统一的 PPT**"。

作者的解法是**用约束换稳定**：把视觉风格锁死成两套预设（Style A 电子杂志、Style B 瑞士国际主义），版式锁死成 22 个具名布局（S01-S22），颜色锁死成预设主题（不接受自定义十六进制值）。agent 只能在这些约束里组合，不能发明。

README:21 说这个技能"由歸藏在'一人公司:被 AI 折叠的组织'、'一种新的工作方式'等线下分享中沉淀而成，踩过的每一个坑都写进了 checklist.md"——也就是说，这些约束不是理论推导，是真实演讲场景里踩坑踩出来的。

不解决的是：它不教 agent "演讲内容怎么组织"，只管"内容确定后怎么渲染成好看的 HTML"。技能是渲染器，不是内容引擎——内容结构由用户给的 outline 决定，技能只负责把 outline 渲染成好看的 HTML。

## 第一性原理

### 根本假设

**AI 生成视觉产物的可靠性，来自约束的严格性，而不是给的自由度。自由度越高，agent 越容易做出破坏风格的东西；约束越死（连颜色都不能自选、连版式都只能从 22 个里选），agent 的产出越稳定可预测。**

### 为什么相信

1. **颜色完全不让自选**。README:325："这个 Skill 的重点是稳定产出。自由选色很容易破坏整体风格，所以只允许从预设主题里选。" SKILL.md:183,199-202 明确拒绝用户提供的十六进制值。作者认定"给颜色自由 = 风格崩溃"，所以从根上掐掉。
2. **版式用代码强制**。Style B 有个 Node 验证器 `scripts/validate-swiss-deck.mjs`，机械检查每个 `<section>` 的 `data-layout` 必须是 S01-S22 之一，拒绝实验性版式。SKILL.md:319 要求交付前必须跑 `node scripts/validate-swiss-deck.mjs index.html`。这是把"只能用预设版式"从建议升级成可执行校验——光写在 SKILL.md 里不够，要用脚本兜底。
3. **CONTRIBUTING.md 直接陈述这个哲学**（:53-54）："This Skill is opinionated by design. It prefers constrained layout systems over unlimited customization, because constraints make AI-generated decks more reliable."（这个技能刻意固执己见。它偏好受限的版式系统胜过无限定制，因为约束让 AI 生成的演示更可靠。）

### 假设成立的前提条件

- 预设风格和版式足够覆盖目标场景（演讲/分享/发布会）。如果用户要的风格不在两套预设里，技能帮不上。
- agent 愿意遵守约束（读 SKILL.md 并照做，不试图"创新"）。
- 约束本身设计得好——22 个版式 + 预设主题确实能组合出好看的结果。这是前置工作量，作者已经做了。

### 假设失效的条件

- 当用户**强烈需要自定义**（公司品牌色不在预设里、要特殊版式）时，技能的"不接受自定义"变成硬伤。作者明确选择了"保护美学比给自由更重要"（README:265），但这对需要灵活性的用户是失效的。
- 当约束不够细时，agent 仍能在约束内做出烂东西（比如 22 个版式里选错、预设主题搭配错）。约束压低了出错率，但没归零。
- 当预设风格过时时，整个技能需要大改——两套风格是作者审美固化，时代变了得重做。

## 设计哲学

### 技能组织方式：单技能 + 双风格并行资源

单技能，但内部资源按两套风格并行组织。`assets/` 有两套模板（`template.html` Style A、`template-swiss.html` Style B），背景图按风格分目录（`style-a/` 5 张、`style-b/` 4 张）。`references/` 里 Style A 和 Style B 各有并行文件（`layouts.md` / `layouts-swiss.md`，`themes.md` / `themes-swiss.md`），加上 Style B 专属的 `swiss-layout-lock.md`、`swiss-map-component.md`。

关键规则（SKILL.md:169）：两套风格**不能混用**，类名不能在模板间移植。为什么这么严格？因为混用就破坏了"约束换稳定"——每套风格内部是自洽的，混起来就失控。

### 触发词策略：自然语言句 + 嵌入关键词列表 + 显式触发词

description 逐字引用（`SKILL.md:3`）："生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。提供两种风格：① "电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色） ② "瑞士国际主义"（无衬线 + 网格点阵 + IKB/柠檬黄/柠檬绿/安全橙高亮）。当用户需要制作分享 / 演讲 / 发布会风格的网页 PPT，或提到"杂志风 PPT"、"瑞士风 PPT"、"Swiss Style"、"horizontal swipe deck"时使用。"

结构是"功能描述 + 风格清单 + 触发场景 + 触发关键词"。README:146-154 还列了 7 个更具体的触发短语（"帮我做一份杂志风 PPT"等）。这是混合风格——既描述能力，又列关键词，确保 agent 在用户各种说法下都能命中。

### 渐进式披露的实际用法

542 行的 SKILL.md 是个编排器，不内联重现细节。SKILL.md:483-499 有明确的"加载顺序"章节，告诉 agent 每个工作流步骤读哪个 reference 文件：完整读 SKILL.md → 步骤 1 定风格 → 读对应主题文件 → 读模板的 `<style>` 块拿类名 → 读布局文件 → 读组件 → 最后跑验证器 + checklist。

特别值得注意的是**"模板当事实来源"**（SKILL.md:215-222）：agent 写幻灯片 HTML 前必须读所复制模板的 `<style>` 块，类名必须从那里来，不能捏造。这是一种独特的披露方式——权威源不是文档，而是模板里的实时 CSS。理由（SKILL.md:206-222）：类名捏造是"所有生成问题的源头"。

10 个 references 文件：layouts / themes / components / checklist / image-prompts / screenshot-framing 为两套风格共用或 Style A 通用（checklist.md 同时含"风格 A 必查"和"风格 B 必查"两部分）；layouts-swiss / themes-swiss（后缀）与 swiss-layout-lock / swiss-map-component（前缀）为 Style B 专属。checklist.md 还按 P0-P3 分级（SKILL.md:392 要求所有 P0 必须通过），把"踩过的坑"分级固化。

### agent 集成文件策略：不用，靠 SKILL.md 环境感知分支

根目录无任何 agent 集成文件。但 SKILL.md:57-59 有环境感知分支：Claude Code 用 Ask Question / `ask_question` 工具澄清，Codex 用普通对话（明确"不要调用 Claude Code 的 Ask Question 机制"）。这是把"不同 agent 的差异"内化进 SKILL.md，而不是外化成多个集成文件。

README:111-117 有平台支持矩阵（Claude Code / Codex / Cursor / WorkBuddy / 普通聊天机器人）。这种"一份 SKILL.md + 内部环境分支"比维护多个根集成文件轻量。

## 代表性 skill 解剖

只有一个技能，拆它的双风格 + 验证器 + 加载顺序三个机制。

### 1. 双风格架构 —— 约束的两套实现

- **怎么工作**：Style A（电子杂志）和 Style B（瑞士国际主义）是两套完整的视觉系统，各有模板、主题、布局、背景。agent 先定风格，然后只用那套资源。
- **为什么这么设计**：两套风格覆盖"暖衬线杂志感"和"冷无衬线瑞士感"两个常见演讲审美方向，且各自内部自洽。提供两套而不是一套，扩大适用面；但严格禁止混用，保住"约束换稳定"。这是"有限选择"而非"无限自由"——给 2 个选项，不是给 200 个。

### 2. 布局锁定 + 验证器 —— 约束的机械执行

- **怎么工作**：Style B 强制每个 `<section class="slide">` 带 `data-layout`，值必须是 S01-S22 或两个 ASCII 封面/结尾版式。`scripts/validate-swiss-deck.mjs` 静态校验，拒绝实验性版式（P23/P24/swiss-img-split 等，除非带 `--allow-experimental`）。
- **为什么这么设计**：光在 SKILL.md 里写"只能用 S01-S22"不够，agent 可能还是发明 P23。用脚本兜底，把约束从"建议"变"可执行校验"。这是 guizang-ppt-skill 最硬的约束手段——别的技能靠说服，这里靠代码拦截（类比本工作区的 guard-repos.js 用 hook 强制只读）。

### 3. 模板当事实来源 —— 披露的反直觉设计

- **怎么工作**：agent 必须读模板 `<style>` 块拿类名，不能从文档抄、不能捏造。缺类名就加到模板 `<style>` 里，不内联到每张幻灯片。
- **为什么这么设计**：作者认定类名捏造是生成问题的源头。文档会过时，但模板里的 CSS 永远是当前真实可用的。让 agent 信"活的 CSS"而不是"死的文档"，从根上消除类名不一致。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：guizang-ppt-skill 用验证器脚本机械执行版式约束、颜色完全不让自选，是约束最硬的技能之一。这和 anthropic-skills（本工作区内，已有独立深度研究）"靠环境+约定不靠规则"的取向几乎相反——这里恰恰是"靠硬约束保可靠"。它把模板 CSS 当事实来源（让 agent 信活的 CSS 而非死文档），这点在工作区里较为独特。环境感知分支内化进 SKILL.md 而非外化成多个根集成文件，这点和 obsidian-skills 类似。（跨仓库对比待综合篇系统核实。）

## 局限 / 可借鉴点

### 可借鉴
1. **用脚本机械执行约束**：光在 SKILL.md 里写规则不够，关键约束用验证器兜底（validate-swiss-deck.mjs）。把"建议"升级成"可执行校验"。
2. **模板当事实来源**：让 agent 信活的 CSS/代码而不是死的文档，消除文档与实现漂移。
3. **踩坑分级固化**：checklist.md 按 P0-P3 分级，把历史踩过的坑变成可检查的清单，且 P0 必须通过。
4. **加载顺序显式化**：SKILL.md 明确写"每步读哪个 reference"，agent 不用自己猜披露路径。
5. **环境感知内化**：一份 SKILL.md + 内部环境分支，比维护多个根集成文件轻量。

### 局限
1. **"不接受自定义"是硬伤**：公司品牌色不在预设里、要特殊版式的用户完全用不了。作者选了"保护美学 > 给自由"，牺牲了灵活性。
2. **预设风格会过时**：两套风格是作者审美固化，时代变了得重做。约束越死，迭代成本越高。
3. **约束内仍会出错**：22 个版式选错、预设主题搭配错，agent 仍能在约束内做烂。约束压低出错率没归零。
4. **Style A 无验证器**：只有 Style B 有 validate-swiss-deck.mjs，Style A 的版式约束靠 SKILL.md 文字，没有机械校验。约束强度不对称。
5. **赞助商隔离靠纪律**：SKILL.md:8,33 用 HTML 注释 + 指令禁止把赞助商信息写进生成产物，但这靠 agent 遵守，没有验证器兜底（不像版式有脚本查）。
