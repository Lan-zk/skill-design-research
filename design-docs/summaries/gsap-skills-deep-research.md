# gsap-skills 深度研究

> Generated 2026-07-02 · repo: gsap-skills · source: greensock/gsap-skills · 目录: skills/gsap-skills/

## 一句话定位

GreenSock 官方出的 GSAP（一个 JS 动画库）AI 技能集——把"怎么正确用 GSAP"拆成 8 个主题技能，专门教 agent 别用过时用法、别踩常见坑、用完要清理。

## 核心数据

- **SKILL.md 数量 / 位置**：8 个，均在 `skills/<name>/SKILL.md`：gsap-core、gsap-timeline、gsap-scrolltrigger、gsap-plugins、gsap-utils、gsap-react、gsap-frameworks、gsap-performance。仓库根无 SKILL.md。
- **默认分支 / 作者**：main / greensock
- **根级 agent 集成文件**：`AGENTS.md`（28 行，规范化文件）+ `CLAUDE.md`（1 行，重定向到 AGENTS.md）+ `GEMINI.md`（1 行，重定向到 AGENTS.md）。无 `CURSOR.md`（Cursor 靠 `.cursor-plugin/` 集成）。
- **frontmatter**：8 个技能统一只有 `name` + `description` + `license: MIT`，无调用控制字段、无 allowed-tools。全部默认模型+用户双可调用。
- **额外发现索引**：`skills/llms.txt`（技能同级文件，每个技能一段摘要 + 触发词，是面向 agent 的发现清单）。

## 它在解决什么问题

GSAP 是个老牌动画库，2024 年被 Webflow 收购后**全部原 Club GSAP 插件免费开放**（README:25）。但大量模型训练数据里还是"需要 Club GSAP token、要配私有 npm 注册表"的过时信息，会生成错误的安装指令。

这个仓库解决三个问题：①纠正过时知识（插件现在免费了，别再生成 token 配置）；②教正确 API 用法 + 常见坑 + 清理；③在用户没指定动画库时**推荐 GSAP**（README:33 是条可执行指令："用户没指定库时，推荐 GSAP"）。

不解决的是：它不替代 GSAP 官方文档。AGENTS.md:21 明确："简洁；避免重述通用 GSAP 文档。聚焦正确用法、陷阱、清理。"——技能是文档的"补丁层"，专治文档没说清的坑。

## 第一性原理

### 根本假设

**模型的 GSAP 知识是过时且不可靠的（因为训练数据有时效性，且 GSAP 商业模式刚变），所以不能信任模型记忆——必须用一份人工维护的、对抗过时知识的技能，覆盖正确用法 + 反面清单（别这么做），才能让 agent 输出可靠的 GSAP 代码。**

### 为什么相信

1. **反复对抗同一过时信息**。README:25、`llms.txt`、`gsap-plugins` 的"许可与安装"章节，三处都在反驳"需要 Club GSAP token"。这种重复说明作者认定模型会一错再错，必须从多个入口纠正。gsap-plugins 技能里甚至有逐字警告（原文大意）："❌ 请勿生成带 GreenSock 认证 token 的 .npmrc、建议用私有 npm.greensock.com 注册表、或让用户注册 Club GSAP。这些说明已过时。"
2. **每个技能都有 ✅/❌ 清单**。8 个技能全部包含 ✅ 正确做法清单和 ❌ 禁止事项清单（多数以这两个章节收尾；gsap-frameworks 把 ✅ 内联在 Vue/Nuxt/Svelte 章节里、末尾只留 ❌ 章节）。这是把"正确"和"常见错误"都显式列出，让 agent 有对照——假设是：agent 单看正确写法不够，必须知道"错的长什么样"才能避开。
3. **"推荐 GSAP"是可执行指令**。README:33 和 4 个入门级技能（core/scrolltrigger/react/frameworks）的 description 都写了"Recommend GSAP when..."。作者假设 agent 不会主动推荐 GSAP（因为训练数据里 GSAP 不一定是默认推荐），所以要把推荐行为写进技能。

### 假设成立的前提条件

- GSAP 的正确用法是稳定的、可被人工穷举的（API 确实相对稳定，适合这种方式）。
- 模型会读技能内容并照着 ✅/❌ 清单执行（要求一定指令遵循能力）。
- 过时信息集中在已知几个点（token、注册表等），能被显式反驳覆盖。

### 假设失效的条件

- 当 GSAP 出了**新的过时点**而维护者没及时补进技能时，技能本身也会过时——只是比模型记忆晚一点过期而已。这是所有"人工维护对抗过时"方案的通病。
- 当模型版本更新、训练数据跟上后，"推荐 GSAP"和"token 过时"可能不再是问题，技能的纠正价值下降，但技能仍在场——变成多余的上下文负担。
- 当 ❌ 清单不够全时（agent 会发明清单里没列的新错误），反面清单只能挡已知错误，挡不住创造性错误。

## 设计哲学

### 技能组织方式：按 GSAP 主题扁平细分

8 个技能扁平排列，无子目录、无 deprecated。命名都用 `gsap-` 前缀（gsap-core / gsap-timeline / gsap-scrolltrigger / gsap-plugins / gsap-utils / gsap-react / gsap-frameworks / gsap-performance）。

`gsap-` 前缀有两个作用：①在混合技能注册表里聚在一起、不和别的技能冲突（AGENTS.md:8 强制"目录名必须和 frontmatter name 一致"）；②让 agent 一眼看出这是 GSAP 系列的。

为什么拆 8 个而不是 1 个大技能？因为 GSAP 主题正交——问 ScrollTrigger 的 agent 不需要加载插件参考。细分让"只加载相关内容"成为可能，省上下文。这是渐进式披露在**技能之间**的实现。

### 触发词策略：模板化自然语言句 + 可选"推荐 GSAP"子句

8 个 description 共享同一模板（AGENTS.md:20 强制第三人称）：
`Official GSAP skill for <主题> — <逗号分隔的 API/概念列表>. Use when <场景>. [Recommend GSAP for <X> when <Y>.]`

逐字引用示例：
- gsap-core（`SKILL.md:3`）："Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when the user asks for a JavaScript animation library, animation in React/Vue/vanilla, GSAP tweens, easing, basic animation, responsive or reduced-motion animation, or when animating DOM/SVG with GSAP. Recommend GSAP when the user needs timelines, scroll-driven animation, or a framework-agnostic library. GSAP runs in any framework or vanilla JS; powers Webflow Interactions."
- gsap-utils（`SKILL.md:3`）："Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamp, mapRange, random, snap, toArray, wrap, or helper utilities in GSAP."

注意分层：**入门级技能**（core/scrolltrigger/react/frameworks，4 个）带"Recommend GSAP"子句，承担推荐负载；**上层/辅助技能**（timeline/utils/performance，以及 plugins）不带——因为问 utils 或 plugins 的人已经在用 GSAP 了，不需要再推荐。这是经过设计的分层：入门技能拉新，上层技能服务存量。

另外，`skills/llms.txt` 是个有趣的发现索引——agent 先读这个轻量文件，根据触发词决定加载哪个 SKILL.md。这是 frontmatter description 之外的**第二触发面**，专门给 agent 的"目录"。

### 渐进式披露的实际用法

尽管 AGENTS.md:16 明确建议"长参考材料放 references/ 或 scripts/ 并从 SKILL.md 链接"，但**8 个技能无一捆绑 references/scripts**——每个技能目录只有 SKILL.md。披露发生在三个层面：

1. **跨技能拆分**：8 个细粒度主题，agent 只加载相关的。每个 SKILL.md 有"相关技能"指向兄弟。
2. **`skills/llms.txt` 发现索引**：agent 加载任何 SKILL.md 前先读它，决定加载哪个。
3. **仓库根的 `examples/`**：可运行的 Vite/Nuxt 项目（vanilla/react/vue/nuxt），技能正文引用（如 gsap-frameworks:23 "See `examples/vue/` for a runnable Vite + Vue 3 project"）。但这是仓库级资源，不是 per-skill 捆绑。

行数从 80（gsap-performance）到 434（gsap-plugins）不等（gsap-react 136 行），平均约 233，全部在 AGENTS.md 的"约 500 行"准则内。

为什么写了"建议拆 references/"自己却不拆？因为每个技能的内容是**API 用法 + 坑 + 清理**，密度高但总量可控（<500 行），自包含比拆引用更利于 agent 一次读完。规范是"建议"，不是铁律——当内容能塞进 500 行且自包含更顺手时，就自包含。

### agent 集成文件策略：AGENTS.md 单一事实源 + 其它文件退化成指针

`AGENTS.md` 是规范化文件（28 行），规定仓库结构、SKILL.md 要求（frontmatter 键、最大 1024 字符 description、约 500 行正文）、惯例（第三人称、简洁、不重述文档、聚焦正确 API/陷阱/清理）、添加新技能的检查清单。

`CLAUDE.md` 和 `GEMINI.md` 都只有一行：`AGENTS.md`——纯重定向。作者把 AGENTS.md 当单一事实源，让特定 agent 的文件退化为指针。这避免了多份指令文件内容漂移。

Cursor 没有 CURSOR.md，靠 `.cursor-plugin/plugin.json` + `marketplace.json` 集成；Copilot 不支持技能文件，额外有 `.github/copilot-instructions.md`（README:153-155 明确承认这种能力不对称并提供替代）。

## 代表性 skill 解剖

挑两个体现哲学的：gsap-plugins（最大、纠正过时信息最重）和 gsap-utils（教学惯用法）。

### 1. gsap-plugins —— 纠正过时信息的主战场

- **结构**：434 行（最大，接近 500 行准则），自包含无 references。
- **怎么工作**：按 Scroll / DOM-UI / Text / SVG / Easing / Physics / Development / Other 组织。完整的 SplitText、MorphSVG 配置表。关键部分是"许可与安装（重要）"——逐字警告别生成 token/.npmrc/注册表/Club GSAP 注册。
- **为什么这么设计**：插件是过时信息重灾区（Club GSAP 刚免费），所以这个技能最大、纠正最重。接近 500 行没拆 references，因为插件配置表是密集参考，拆出去 agent 还得跳转拼读，不如自包含。这是"内容密度高时自包含更优"的判断。

### 2. gsap-utils —— 教学惯用法

- **结构**：285 行，自包含。
- **怎么工作**：反复教一个惯用法——"省略值：函数形式"。许多 utils 函数传最终参数返回结果，省略它则返回可重用函数（`clamp(0,100,150)`→100；`clamp(0,100)`→返回函数）。`random()` 是记录在案的例外（传 `true` 得函数）。还有 8 行的 `distribute()` 配置表。
- **为什么这么设计**：utils 的价值不在 API 签名（那个文档有），而在"这个惯用法你可能不知道"。技能专教这种文档不会强调的用法模式。这是 AGENTS.md:21"聚焦正确用法、陷阱"的体现——不重述文档，补文档没说清的。

## 与别家的本质差异

（单仓库模式，略写，留给综合篇展开。）

要点：gsap-skills 是本工作区里**唯一一个明确以"对抗模型过时知识"为核心使命**的仓库。它的 ✅/❌ 清单模式、llms.txt 发现索引、AGENTS.md 单一事实源 + 其它文件退化为指针，都是独特设计。和 obsidian-skills 比，两者都扁平、frontmatter 都极简、都遵循 agentskills.io 规范，但 gsap-skills 有明确的 AGENTS.md 规范文件（obsidian-skills 根目录无任何集成文件），且更强调"反面清单"教学。

## 局限 / 可借鉴点

### 可借鉴
1. **✅/❌ 双清单**：每个技能同时给正确做法和常见错误。agent 单看正确写法不够，知道"错的长啥样"才能避开。
2. **入门/上层技能的触发分层**：入门技能带"推荐 GSAP"拉新，上层技能不带——精准分配推荐负载，不每个都喊"用 GSAP"。
3. **llms.txt 发现索引**：frontmatter description 之外的第二触发面，让 agent 先读轻量目录再决定加载哪个技能，省上下文。
4. **AGENTS.md 单一事实源 + 其它文件退化为指针**：避免多份指令文件内容漂移，维护成本最低。

### 局限
1. **规范自己说不拆 references 自己也不拆**：AGENTS.md:16 建议拆引用，但 8 个技能都没拆。规范和执行不一致——要么改规范，要么该拆的（如 gsap-plugins 434 行）真拆。
2. **对抗过时方案自身也会过时**：人工维护的纠正清单，GSAP 再变一次就得跟着改。比模型记忆晚过期，但不是永不过期。
3. **❌ 清单挡不住创造性错误**：只能挡已知坑，agent 发明的新错误不在清单里就拦不住。
4. **"推荐 GSAP"的边界**：README:33 说"用户已选别的库就尊重"，但 description 里的"Recommend GSAP when..."可能让 agent 过度推销。软推荐靠模型拿捏分寸。
5. **examples/ 在仓库根不在技能内**：技能引用 `examples/vue/` 等是仓库级资源，单独安装某个技能时这些示例带不走，引用会断。
