---
title: "我的 AI 编码工作流——从 spec 到 commit 的完整闭环"
date: 2026-06-23
tags: ["AI", "工作流", "工程化", "经验"]
description: "把 SDD、OpenSpec、AI 工具、编码判断力串成一条线。从需求到代码，每一步做什么、为什么、怎么落地。"
---

# 我的 AI 编码工作流——从 spec 到 commit 的完整闭环

这是我一整年打磨下来的 AI 编码工作流。它不是一个理论框架，是我每天在用的实操流程。

在此之前我写过四篇文章，分别回答了四个问题：

- [Spec-Driven Development：写文档，让 AI 写代码](/posts/spec-driven-development) — **为什么**需要 SDD
- [OpenSpec 入门：用规范驱动 AI 编码](/posts/openspec-sdd) — **用什么工具**落地 SDD
- [AI 编程实战：Cursor、Claude Code 与 Agent 模式的经验总结](/posts/ai-coding) — **用哪个工具**执行
- [AI 辅助前端开发的正确姿势](/posts/ai-coding-workflow) — **什么时候**该用 AI、什么时候不该

这篇文章把它们串起来：**从需求到代码，走完完整的一圈。**

---

## 整条链路

```
需求来了
    │
    ├── 要不要写 spec？              ← 判断框架（ai-coding-workflow）
    │      ↓ 要
    ├── 写 spec 文件                  ← SDD 方法论（spec-driven-development）
    │      ↓
    ├── 用 OpenSpec 结构化           ← 工具落地（openspec-sdd）
    │      ↓
    ├── 选工具执行                    ← 工具选型（ai-coding）
    │      ↓
    ├── AI 写代码 → review → 截图反馈  ← 执行与验证（ai-coding-workflow）
    │      ↓
    └── commit                       ← 收工
```

每走一步，都在调用前面某篇文章讲的内容。下面用一个真实的功能来演示。

---

## 实战案例：给博客加搜索功能

### Step 0：判断——这个需求要不要写 spec

需求是「给博客加一个搜索功能」。我走一遍四象限判断（来自[AI 辅助前端开发的正确姿势](/posts/ai-coding-workflow)）：

| 维度 | 评估 |
|------|------|
| **确定性** | 高——搜索功能要什么很清楚 |
| **复杂度** | 中——涉及 UI、API、索引构建 |

高确定性 × 中复杂度 → **AI 辅助实现**。但功能会上线，不是一次性脚本 → **值得写 spec**。

判断结果：写 spec，10 分钟。

### Step 1：写 spec

按照 SDD 方法论（来自[Spec-Driven Development](/posts/spec-driven-development)），spec 只需要回答三个问题：

```markdown
# Spec: 博客搜索

## 目标
给博客加一个搜索功能，用户输入关键词搜索文章标题和摘要。

## 技术约束
- Vue 3 + Composition API，<script setup> 风格
- 不引入外部搜索服务（Elasticsearch 等）
- 只用 client 端搜索，用 Fuse.js 做模糊匹配
- 不增加构建步骤

## 边界
- 不搜索文章正文（只搜标题 + 摘要 + 标签）
- 搜索页不走服务端渲染
- 搜索结果不做分页
- 不加搜索热词分析

## 验收条件
- 用户在搜索框输入文字后 300ms 触发搜索
- 搜索结果按匹配度排序，显示文章标题、摘要片段、日期
- 输入为空时显示"请输入关键词"
- 无匹配结果时显示"未找到相关内容"
- 搜索过程中显示加载状态
```

15 分钟写完。注意我没有写 Fuse.js 的配置细节、没有写 CSS 样式——只写**做什么**，不写**怎么做**。

### Step 2：用 OpenSpec 生成结构

把上述 spec 落地到 OpenSpec（来自[OpenSpec 入门](/posts/openspec-sdd)）：

```bash
cd my-blog
openspec init
/opsx:propose "为博客添加文章搜索功能，使用 Fuse.js 进行客户端模糊搜索"
```

AI 根据我的 spec 生成了：

```
openspec/changes/add-blog-search/
├── proposal.md     # 为什么做、做什么
├── delta.md        # 增量规范（场景化）
├── design.md       # 技术方案（Fuse.js + 搜索页）
└── tasks.md        # 四步实现清单
```

关键动作：**review `delta.md`**。这一步是人和 AI 对齐需求的最佳时机。

生成了一个场景：

```markdown
### Requirement: Search

#### Scenario: Empty Input
- **GIVEN** 搜索框为空
- **WHEN** 用户未输入任何文字
- **THEN** 显示初始状态："请输入关键词"

#### Scenario: Search with Results
- **GIVEN** 用户输入"Vite"
- **WHEN** 300ms 防抖后执行搜索
- **THEN** 显示匹配的文章列表
- **AND** 每项包含标题、摘要片段、日期
- **AND** 按匹配度降序排列

#### Scenario: No Results
- **GIVEN** 用户输入"xyznotfound"
- **WHEN** 搜索完成
- **THEN** 显示"未找到相关内容"
```

确认没问题，进入下一步。

### Step 3：选工具执行

这个功能涉及：新建一个搜索页面、一个搜索组件、安装 Fuse.js、注册路由。

看范围：**中等复杂度，3-4 个文件**。用 Cursor Agent 模式就够了。

如果是跨 10+ 文件的重构，我会选 Claude Code 的终端 Agent。具体选型原则参考[AI 编程实战](/posts/ai-coding)。

### Step 4：让 AI 按 spec 实现

```bash
/opsx:apply
```

AI 按 `tasks.md` 逐步执行：

```
✅ 任务 1/4：安装 Fuse.js
    1.1  npm install fuse.js ✓
✅ 任务 2/4：创建搜索组件 SearchBox.vue
    2.1  接收 posts 数据作为 props ✓
    2.2  实现 300ms 防抖输入 ✓
    2.3  使用 Fuse.js 搜索标题+摘要+标签 ✓
    2.4  显示加载状态 ✓
✅ 任务 3/4：创建搜索页面 search.md
    3.1  使用 SearchBox 组件 ✓
    3.2  显示文章列表 ✓
    3.3  处理空输入和空结果 ✓
✅ 任务 4/4：注册路由
    4.1  添加 /search 路由 ✓
    4.2  导航栏添加搜索入口 ✓
```

### Step 5：Review + 截图验证

AI 执行完后，我做三件事：

**一是读 diff。** 逐行检查。发现一个问题：AI 写了一个 `watch` 监听 `props.posts` 变化，但组件是在页面级挂载的，posts 只需要加载一次。一个 `computed` 就够，不用 watch。改掉。

**二是截图验证。** 跑 dev server，截图。发现：

- 搜索结果卡片间距太大 → 截图发给 Cursor："卡片内间距缩小到 16px"
- 空状态图标没居中 → "空状态文字用 flex 居中"
- Fuse.js 搜索结果中关键词没高亮 → "搜索结果中匹配的文字用 `<mark>` 标签高亮"

AI 逐一修复，每次截图确认。三次迭代后效果满意。

关于这个截图反馈循环的详细方法论，参考[AI 辅助前端开发的正确姿势](/posts/ai-coding-workflow)的 Step 5。

**三是对照 spec 逐条验收。** 不是过一遍感觉"看起来不错"，而是把 spec 的验收条件列出来，逐条打勾：

- ✓ 输入后 300ms 触发搜索
- ✓ 结果按匹配度排序
- ✓ 输入为空时显示"请输入关键词"
- ✓ 无匹配时显示"未找到相关内容"
- ✓ 搜索中显示加载状态

全部通过。

### Step 6：Commit

```bash
git add src/components/SearchBox.vue src/pages/search.md  package.json  openspec/
git commit -m "feat: 添加博客文章搜索功能

- 使用 Fuse.js 实现客户端模糊搜索
- 搜索标题/摘要/标签，按匹配度排序
- 处理空输入、空结果、加载中三种状态
- 搜索结果关键词高亮"
```

然后归档 OpenSpec 变更：

```bash
/opsx:archive
```

delta spec 合并到主 spec 文件，工作区恢复干净。

---

## 整条链路复盘

| 阶段 | 做了什么 | 参考文章 |
|------|---------|---------|
| 判断 | 四象限判断：值得写 spec | [AI 辅助前端开发的正确姿势](/posts/ai-coding-workflow) |
| 写 spec | 目标 + 约束 + 边界 + 验收条件 | [Spec-Driven Development](/posts/spec-driven-development) |
| 结构化 | OpenSpec propose → review delta | [OpenSpec 入门](/posts/openspec-sdd) |
| 执行 | Cursor Agent 按 tasks.md 实现 | [AI 编程实战](/posts/ai-coding) |
| review | 读 diff → 截图反馈 → 对照验收 | [AI 辅助前端开发的正确姿势](/posts/ai-coding-workflow) |
| 归档 | commit + openspec archive | [OpenSpec 入门](/posts/openspec-sdd) |

每个阶段都有对应的判断标准和工具选择。**不是死板地走流程，而是在每个决策点调用已知的方法论。**

---

## 什么时候可以跳步骤

这套流程不是每次都要全走一遍。根据功能大小裁剪：

**像调整按钮颜色这种改动（5 分钟）：** 直接改，不写 spec，不走 OpenSpec。

**像加一个工具函数这种改动（30 分钟）：** 在 Cursor 里直接描述，不写 spec 文件。但如果 Cursor 猜错了两次，就停下来写 spec——**spec 不是前置条件，是纠错机制。**

**像加一个页面这种改动（半天）：** 走完整流程。写 spec 15 分钟，能省掉"改来改去"的 2 小时。

**像重构认证系统这种改动（数天）：** 必须按完整流程来，甚至每个子功能都要拆成独立的 change。

核心原则来自[AI 辅助前端开发的正确姿势](/posts/ai-coding-workflow)的那句话：**AI 写的代码我能不能一眼判断对不对？能就跳过 spec，不能就先写 spec。**

---

## 这套流程的底层逻辑

回头看，这四篇文章其实在回答同一个问题的不同侧面：

> **怎么让 AI 写出生产级的代码？**

- SDD 的回答是：**用 spec 定义边界。** AI 不是万能的，它需要清晰的约束和验收标准。
- OpenSpec 的回答是：**用结构化的文件管理需求。** 需求不是聊出来的，是写下来、可追踪的。
- AI 编程实战的回答是：**选对工具。** Cursor 和 Claude Code 各有擅长的场景，用错了体验差很多。
- AI 辅助工作流的回答是：**保持判断力。** 四象限框架让你知道什么时候依赖 AI、什么时候自己来。

四篇文章各自独立成篇，但合在一起就是一套完整的 AI 编码工作流：**从 spec 到 commit，每一步都知道自己在做什么、为什么这么做。**

工具会变。明年可能会有更好的工具替代 Cursor 和 OpenSpec。但这条链路——**先判断 → 再约定 → 再执行 → 最后验证**——不会变。
