# impeccable 深度研究

> Generated 2026-07-02 · repo: impeccable · source: pbakaus/impeccable · 目录: skills/impeccable/

## 一句话定位

pbakaus 做的前端设计技能——一个技能内含 23 个子命令、44 条确定性检测规则、实时浏览器迭代，专门治"AI 生成的前端一眼假"（紫蓝渐变、Inter 字体、卡片嵌套卡片等通病），并通过把同一份技能镜像到 13 个 agent 目录实现跨 agent 分发。

## 核心数据

- **SKILL.md 数量 / 位置**：13 处镜像，但**只有 1 个技能**（impeccable）。镜像分布：`.agents/`（Codex）、`.claude/`（Claude Code，标准镜像）、`.cursor/`、`.gemini/`、`.github/`（Copilot）、`.kiro/`、`.opencode/`、`.pi/`、`.qoder/`、`.rovodev/`、`.trae/`、`.trae-cn/`、`plugin/`（Claude Code 插件市场包）。
- **默认分支 / 作者**：main / pbakaus
- **根级 agent 集成文件**：`CLAUDE.md`（350 行，v3.0+ 架构论述）+ `AGENTS.md`（77 行，贡献者仓库指南）。无 `GEMINI.md`、`CURSOR.md`（Gemini/Cursor 靠各自 `.gemini/`、`.cursor/` 镜像目录集成）。
- **frontmatter（.claude 镜像）**：`name`、`description`、`version`、`user-invocable`、`argument-hint`、`license`（Apache 2.0）、`allowed-tools`。非标准键：`user-invocable`、`argument-hint`（`allowed-tools` 键本身是 Agent Skills 规范标准字段，但其 `Bash(...)` 扩展语法是 provider 特有）。较弱 harness（agent 编码工具，如 Claude Code / Cursor / Codex 等）镜像会精简掉部分键。
- **调用模型**：用户可通过 `/impeccable` 斜杠命令调用（`user-invocable: true`）；未设 `disable-model-invocation`，模型仍可凭 description 自动触发。
- **真源**：`skill/SKILL.src.md`（单源），13 份镜像由占位符替换（`{{model}}`、`{{scripts_path}}`、`{{command_prefix}}`、`{{config_file}}`、`{{ask_instruction}}`、`{{available_commands}}` 等 6 个）生成，靠 CI（`.github/workflows/sync-generated-output.yml`）保持同步。

## 它在解决什么问题

README:11 给出核心诊断："每个模型都在相同的 SaaS 模板上训练过。跳过指导，你会在每个项目看到同样的几个通病：所有地方都用 Inter、紫蓝渐变、卡片嵌套卡片、彩色背景上的灰色文字、每个标题上方的圆角方形图标块。"

这个技能解决的是"**AI 生成前端的一眼假问题**"。它不是"教 agent 设计"的通用指南，而是"检测 + 修复"具体反模式 + 给一套设计词汇让 agent 有判断标准。

它的组成（README:14-16）：①一套设置流程（`/impeccable init` 写 PRODUCT.md + DESIGN.md）；②23 个命令（共享设计词汇）；③44 条确定性检测规则 + 仅 LLM 的批判性检查（CLI 和浏览器扩展能不带 LLM 跑确定性规则，不需要 API key）。

不解决的是：它不替代设计师的创意判断，而是"挡住 AI 通病 + 提供品味框架"。它是反 AI slop（AI 垃圾）层，不是创意层。

## 第一性原理

### 根本假设

**AI 生成前端的通病（一眼假）是可枚举、可机械检测的——所以应该用确定性规则（44 条）机械拦截，而不是靠模型"自觉"。同时，设计判断需要上下文（项目的产品定位、品牌人格），所以要把上下文固化进 PRODUCT.md/DESIGN.md，让 agent 带着项目特定信息做判断，而不是用通用品味。技能要"一技能多命令"合并，避免 `/` 菜单污染。**

### 为什么相信

1. **44 条确定性规则可不带 LLM 跑**。README:14-16 和 README.npm.md：CLI 和浏览器扩展在跑确定性规则时不需要 LLM、不需要 API key。作者认定这些反模式是"确定性的"——能用代码检测（比如"检测彩色背景上的灰色文字"是对比度计算，不需要模型判断）。这比"让 LLM 自己批评自己"可靠得多。
2. **a11y（可访问性）单独放 audit 命令，不混进主流程**。CLAUDE.md:26："a11y 位于 audit.md 中，而不是 SKILL.md、brand.md 或 product.md。模型在提醒时会过度谨慎，导致设计输出安全且设计不足。审计命令是专门的检查点。" 作者认定"把 a11y 当持续提醒会让设计变怂"——所以把它隔离成离散检查点，不污染主设计流程。这是对"提醒越多越好"的反驳。
3. **技能合并哲学**。CLAUDE.md:13："除非有充分理由，否则不要添加独立技能。这种合并是深思熟虑的：`/` 菜单污染问题是真实存在的，并且会随着用户安装更多插件而加剧。" 作者认定 23 个命令合一个技能比 23 个独立技能好——因为菜单污染。这和 mattpocock 的"路由器技能治认知负载"有共鸣，但 impeccable 更激进：根本不拆，一个技能全包。
4. **13 份镜像提交进仓库**。CLAUDE.md:118-121："`.claude/skills/`、`.cursor/skills/`、`.agents/skills/` 以及其他 harness 目录是故意提交到仓库的。`npx skills` 在安装时直接从该仓库读取它们……不要将它们添加到 gitignore……它们是生成的分发制品，而非编写表面。" 作者认定"分发优先于 DRY"——宁可提交 13 份生成产物，也要让任何 agent 从仓库根直接工作。

### 假设成立的前提条件

- AI 通病确实可枚举且相对稳定（44 条规则覆盖当前通病；新通病出现要补规则）。
- 确定性规则检测比 LLM 自批更可靠（对"彩色背景灰字"这种是，对"布局太居中"这种偏主观的可能不是）。
- 用户愿意跑 `/impeccable init` 设置 PRODUCT.md/DESIGN.md（不设置上下文，技能退化成通用品味）。
- 13 份镜像的 CI 同步能持续工作（同步断了，镜像会漂移）。

### 假设失效的条件

- 当 AI 通病演变（新模板流行）时，44 条规则过时，需要人工补。确定性规则只能挡已知通病。
- 当规则之间冲突或规则太死时（比如某条规则在特定设计风格里不适用），没有仲裁，靠 agent 拿捏。
- 当用户不跑 init 时，技能没有项目上下文，退回通用品味，效果打折。
- 当 CI 同步断了时，13 份镜像漂移，某个 agent 拿到过期版本。虽然 CLAUDE.md 说是"生成制品"，但生成产物一旦提交就独立存在，CI 断了不会自动回滚。
- 当确定性规则对偏主观的反模式失效时（"AI 垃圾"不全是确定的，有些是气质问题），需要 LLM 批判兜底，但 LLM 批判不如确定性规则可靠。

## 设计哲学

### 技能组织方式：一技能多命令 + 13 份 agent 镜像

一个技能（impeccable），23 个子命令（craft/shape/audit/critique/animate/bolder/colorize/delight/distill/harden/optimize/adapt/clarify/onboard/extract/polish/init/document/live/layout/overdrive/quieter/typeset），按 Build/Evaluate/Refine/Enhance/Fix/Iterate 分类。

为什么不拆 23 个独立技能？CLAUDE.md:13 的"菜单污染"论——用户装的插件越多，`/` 菜单越长，23 个独立技能会爆炸。合并成"一个技能 + 子命令路由"更干净。这和 gstack 的"拆成多个独立角色技能"取向相反——gstack 拆，impeccable 合。

13 份镜像的组织：每个 agent 一个目录（`.claude/skills/impeccable/`、`.cursor/skills/impeccable/` 等），结构完全相同（SKILL.md + reference/ + scripts/）。`.agents/` 镜像额外有个 `agents/` 子目录（Codex 自动发现的子 agent 配置）。这是"按 agent 分目录镜像"的可移植性策略——不是技能设计的倍增，是分发的倍增。

### 触发词策略：长动词链 + 场景扩展 + 否定边界

所有 13 份镜像的 description 完全逐字相同。逐字引用（开头）："Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states..."

风格特点：前半段动词链匹配 23 个子命令中的 12 个（shape/critique/audit/polish/clarify/distill/harden/optimize/adapt/animate/colorize/extract），剩余子命令通过后段场景词与 argument-hint 覆盖；中段范围关键词列举，结尾场景扩展（"平淡的设计需要变得更醒胆"/"喧闹的设计需要变得更安静"），以否定边界收尾（"Not for backend-only or non-UI tasks"）。这是为自动触发关键词匹配优化的单段长描述（CLAUDE.md:294："长描述针对 AI harness 中的自动触发关键词匹配进行了优化"）。

注意：技能设了 `user-invocable: true`（用户可斜杠调用）但未设 `disable-model-invocation`，所以模型仍可凭 description 自动触发——description 写得长且关键词密集，正是为了这条自动触发路径。

### 渐进式披露的实际用法

强制引用加载的入口文件。`.claude` 镜像 SKILL.md 是 169 行，比典型"小入口+引用"大，但仍是个路由器。Setup 部分有 5 个非可选步骤，强制加载外部文件：
- 步骤 1：跑 `node <scripts_path>/context.mjs`（每 session 一次）加载 PRODUCT.md/DESIGN.md
- 步骤 2：调了子命令就必须读 `reference/<command>.md`（"非可选"）
- 步骤 4：读匹配的 register 引用（`reference/brand.md` 或 `reference/product.md`，"非可选；跳过它会产生通用输出"）

Commands 部分是 23 行路由表，每个子命令映射到 `reference/<command>.md`。

每个镜像的捆绑资源：`reference/`（28 个 .md：23 子命令引用 + 2 register 引用 brand/product + interaction-design.md + codex.md + hooks.md）+ `scripts/`（67 个文件：31 顶级 .mjs/.js/.json + detector/ 19 个 + lib/ 5 个 + live/ 12 个）。detector/ 是反模式规则引擎（browser/jsdom 双适配器）。

这是"强制披露"——SKILL.md 不只是建议读引用，是"非可选"地要求读。作者认定子命令引用是必读的，跳过就产出通用（即 AI 通病）输出。

### agent 集成文件策略：CLAUDE.md 架构论述 + 13 份镜像替代 per-agent 文件

`CLAUDE.md`（350 行）是 v3.0+ 架构最详细的论述——技能合并理由、生成制品策略、占位符系统、register 系统、a11y 位置等。`AGENTS.md`（77 行）是贡献者镜像，重申生成输出策略。

Gemini/Cursor 没有 per-agent 根文件，靠各自 `.gemini/skills/`、`.cursor/skills/` 镜像目录集成。这和 obsidian-skills 的"根目录无集成文件"不同——impeccable 有 CLAUDE.md/AGENTS.md 给 Claude/贡献者，但其它 agent 靠镜像目录而非根文件。

## 代表性 skill 解剖

只有一个技能，拆它的"23 命令路由 + 44 条检测规则 + register 系统"三个机制。

### 1. 23 命令路由 —— 一技能多命令

- **怎么工作**：`/impeccable <command>` 触发，SKILL.md 的 Commands 部分是路由表，把命令映射到 `reference/<command>.md`。无参数时是上下文感知菜单。
- **为什么这么设计**：23 个命令共享一套设计词汇和上下文（PRODUCT.md/DESIGN.md），拆成独立技能会让上下文加载重复、菜单爆炸。合并后，一次 init 设置的上下文所有命令共用。

### 2. 44 条确定性检测规则 —— 机械拦截 AI 通病

- **怎么工作**：`scripts/detector/` 是规则引擎，browser/jsdom 双适配器。CLI 和浏览器扩展能不带 LLM 跑这些规则。检测彩色背景灰字、Inter 字体、紫蓝渐变等。
- **为什么这么设计**：作者认定这些通病是确定性的，代码检测比 LLM 自批可靠。44 条规则是"下限锁"——和 ljg-skills 的红线列表同理，但 impeccable 用代码执行，不靠模型遵守。这和 guizang-ppt-skill 的验证器脚本同理。

### 3. register 系统 —— 设计上下文固化

- **怎么工作**：`/impeccable init` 问"这是 brand 还是 product"（brand=设计即产品，营销/落地页；product=设计服务产品，应用 UI/仪表盘），写入 PRODUCT.md。每个 register 有对应引用（reference/brand.md、reference/product.md）。
- **为什么这么设计**：设计判断需要项目上下文。不区分 brand/product 就用通用品味，输出 AI 通病。register 把"这是什么类型的设计"固化进 PRODUCT.md，让 agent 带上下文判断。这和"不跑 init 退回通用"的失效条件直接相关。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：impeccable 是本工作区里**镜像分发最极致**的——13 份 agent 镜像提交进仓库（对比 andrej-karpathy-skills 的少量手写 agent 集成文件，impeccable 是 13 份生成镜像）。也是**唯一用确定性代码规则检测 AI 通病**的（44 条，可不带 LLM 跑）——别的仓库靠 prompt/红线让模型自觉，impeccable 靠代码拦截。"一技能多命令"合并（23 命令一个技能）和 gstack 的"拆成多个独立技能"取向相反。frontmatter 用 `user-invocable: true` + `allowed-tools`，和 superpowers 完全不用这些字段的取向相反。`/impeccable init` 的 register 系统（brand/product 分流）也是独特的"设计上下文固化"机制。（跨仓库对比待综合篇系统核实。）

## 局限 / 可借鉴点

### 可借鉴
1. **确定性规则检测 AI 通病**：能代码检测的反模式（对比度、字体、配色）用规则引擎，比 LLM 自批可靠。可不带 LLM 跑降低成本。
2. **一技能多命令合并**：相关命令合一个技能 + 子命令路由，避免菜单污染。比拆 N 个独立技能更省上下文。
3. **register 系统固化设计上下文**：区分 brand/product，让 agent 带项目类型判断，不退回通用品味。
4. **a11y 隔离成离散检查点**：不混进主设计流程，避免"持续提醒让设计变怂"。
5. **13 份生成镜像 + CI 同步**：分发优先于 DRY，让任何 agent 从仓库根直接工作。占位符替换保证内容一致。

### 局限
1. **44 条规则会过时**：AI 通病演变要人工补规则。确定性规则只能挡已知通病。
2. **13 份镜像依赖 CI 同步**：CI 断了镜像漂移，某 agent 拿过期版本。虽然标"生成制品"，但提交了就独立存在。
3. **不跑 init 就退化**：没设置 PRODUCT.md/DESIGN.md，技能退回通用品味，效果打折。这是强依赖用户配合。
4. **"一技能多命令"对发现不友好**：23 个命令挤一个技能，用户要记 `/impeccable <command>` 的命令名。argument-hint 字段缓解但没根治。
5. **确定性规则对主观反模式失效**："布局太居中""气质太 AI"这种偏主观的，规则检测不准，要靠 LLM 批判兜底，但 LLM 批判不如规则可靠。
6. **强依赖浏览器环境**：live 命令和部分检测要真实浏览器，无头/受限环境跑不动。
