---
title: "Spec-Driven Development：写文档，让 AI 写代码"
date: 2026-06-23
tags: ["AI", "工程化", "工作流"]
description: "从 Vibe Coding 到 Spec-Driven Development——写 spec 让 AI 准确落地的完整工作流指南。"
---

# Spec-Driven Development：写文档，让 AI 写代码

2025 年开始，「Vibe Coding」这个词火遍了整个开发者社区。对着 AI 说一句「帮我做个XX」，代码就生成了。确实爽，但爽完之后，问题来了：

- AI 猜的架构和你想要的不一样
- 改了一处，它又动了不该动的地方
- 不敢上线，因为不知道 AI 写的代码到底干了什么

**Vibe Coding 的问题不是 AI 不行，是你没告诉 AI 边界在哪。**

于是 2026 年，主流的工作流开始从 Vibe Coding 转向 **Spec-Driven Development（SDD）** ——先写 spec，再让 AI 写代码。

## 从 Vibe Coding 到 Spec Coding

Vibe Coding 和 SDD 的核心区别，一句话说清楚：

| 维度 | Vibe Coding | Spec-Driven Development |
|------|------------|------------------------|
| 流程 | 描述 → 生成 → 测试 → 迭代 | 写 spec → 审查 → 生成 → 验证 |
| 设计决策 | AI 替你决定了 | 你在 spec 里写清楚 |
| 验收标准 | 「看起来差不多」 | 「验收条件全部通过」 |
| 可复用性 | 聊天记录里翻 | spec 在 git 里，随时可重来 |

Vibe Coding 适合原型和一次性脚本。但只要是**会上线、会维护、会交接**的代码，没有 spec 就是在赌 AI 猜对了你的想法。

而 AI 最不擅长的就是读心术。

## Spec-Driven Development 是什么

SDD 就是把 spec 当作代码的**唯一真实来源**。开发流程变成：

```
你写 spec（.md 文件，放 git 里）
    ↓
AI 读 spec → 出计划 → 拆任务 → 写代码 → 验证
    ↓
你 review 结果 → 改 spec → 循环
```

spec 不是写论文，不用长篇大论。核心就三个问题：

### 1. 做什么 + 为什么

一句话说清楚：给谁用、解决什么、做成什么样算完。

### 2. 关键约束（给 AI 看的）

技术栈、数据结构、性能要求、不能碰哪些代码。写得越清楚，AI 越不会跑偏。

### 3. 边界

这一步最重要——**明确哪些事 AI 必须停下来问你**。比如加依赖、改表结构、动公共组件——这些决策必须你来做。

### 一个真实例子

这是我一个功能最短的 spec：

```markdown
# Spec: 用户导出 CSV

## 目标
后台用户列表加一个「导出 CSV」按钮，下载 name / email / created_at。

## 技术约束
- Vue 3 + Composition API
- 直接用已有的 /api/users 接口
- 不引入新依赖

## 边界
- 只导当前列表，不做筛选导出
- 不分页，一次性返回
- 不写测试
```

15 行，5 分钟写清楚。AI 读了这个 spec，一次就产出了我要的代码，不需要来回改。

## 2026 年的 SDD 工具生态

几个主流的 SDD 工具，定位各有不同：

| 工具 | 定位 | 适合谁 |
|------|------|--------|
| **Claude Code + spec skill** | Agent 读 spec 自主执行 | 习惯终端、复杂项目 |
| **GitHub Spec Kit** | 开源 CLI，四阶段工作流 | 团队协作、规范流程 |
| **Cursor + .cursor/rules** | IDE 集成，轻量级约束 | 个人开发者、快速上手 |
| **AWS Kiro** | VS Code 插件，三段式文档 | 从 Vibe 过渡到 Spec 的团队 |

目前社区共识度最高的是 **GitHub Spec Kit**——开源、四阶段工作流（`/specify` → `/plan` → `/tasks` → 执行），而且能同时对接 Copilot、Claude Code、Gemini CLI。

## 我的实际工作流

目前我用的是「Claude Code + 手写 spec」的组合：

```
功能需求来了
    ↓
1. 写 spec.md（10-15 分钟）
   - 目标 + 技术约束 + 边界
   - 放到项目 docs/specs/ 目录
    ↓
2. 丢给 AI（Claude Code / Cursor）
   - 让 AI 读 spec 并出计划
   - 快速审一眼计划，没问题就执行
    ↓
3. Review 结果
   - 对照 spec 验收
   - 有问题就改 spec，再让 AI 重做
```

这个流程的核心习惯是：**你的手只碰文档，不碰代码。** 发现 AI 做偏了，回去改 spec，而不是自己修代码。

## 什么时候该用 SDD，什么时候不该

先说不该用的场景：

- **一次性脚本** — 用完就删的，直接 Vibe Coding
- **快速原型** — 还不知道要不要的东西，不值得写 spec
- **纯探索** — 你都不知道自己要什么，spec 写不出来

但如果是**会上线的功能、会维护半年以上的代码、需要交接给别人的项目**——SDD 能省的时间远多于写 spec 花的时间。

GitHub 内部的实践数据：用了 Spec Kit 的团队，**「推倒重来」的轮次减少了约一个数量级**。AWS Kiro 的客户案例里，40 小时的功能在 spec 先行之后只要 8 小时 human time。

## 怎么上手

三步就够了：

**第一，下次有功能的时候，不要直接打开 IDE。** 先建一个 `spec.md`，花 10 分钟把目标、约束、边界写清楚。

**第二，让 AI 按 spec 做。** 把 spec 丢给 Cursor 或 Claude Code，说「按这个来」。

**第三，只改 spec，不动代码。** AI 做偏了，回去改 spec 再让它重做。这是形成习惯的关键。

用上三次之后你会发现，**写 spec 不是在拖慢你，而是让你少走弯路。**

## 总结

2026 年，AI 编程已经到了一个拐点。工具不再是瓶颈，**方法论才是**。

从 Vibe Coding 到 Spec-Driven Development，本质上是把开发者的角色从「写代码的人」变成了「写 spec 的人」——你负责定方向和边界，AI 负责执行。

```
Vibe Coding:      你说 → AI 猜 → 你改 → 循环
Spec-Driven:      你写 → AI 读 → 做对 → 收工
```

SDD 不是让开发变慢，是让「做对」变得可预测。

---

## 学习路线图

从入门到上手，按顺序来就行：

### 1. 理解概念（30 分钟）

把本文从头读一遍。Vibe Coding vs SDD 的对比、三块 spec 模板、什么时候不该用——这些是地基。

### 2. 上一门课程（2-3 小时）

首选 **DeepLearning.AI + JetBrains** 的免费短课，Paul Everitt 主讲，15 节视频，从 project constitution 到 feature spec 到自动化 skill，全部动手练：

- [Spec-Driven Development with Coding Agents — DeepLearning.AI](https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents)

备选：
- [Spec-Driven Development with Claude Code: A Guided Tutorial — DataCamp](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code) — 文字教程，讲解 Superpowers / Spec Kit / BMAD-METHOD 三个开源方案
- [Spec-Driven Development: From Vibe-Coding to AI Engineering — Udemy](https://www.udemy.com/course/spec-driven-development-sdd-from-vibe-coding-to-reliable) — 付费，3 小时 45 分，带测验和练习

### 3. 动手练（最重要）

下次有功能需求，直接上手：

1. 在项目里建一个 `spec.md`
2. 三块写清楚：目标 + 技术约束 + 边界
3. 丢给 AI，说「按 spec 来」

可以配合开源工具降低门槛：

- **[GitHub Spec Kit](https://github.com/github/spec-kit)** — 四阶段工作流（`/specify` → `/plan` → `/tasks` → 执行），兼容 Copilot、Claude Code、Gemini CLI
- **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — 三命令工作流（`/opsx:propose` → `/opsx:apply` → `/opsx:archive`），更轻量
- **[Awesome Specification Driven Development](https://github.com/aabs/awesome-specification-driven-development)** — 资源合集

两个都是开源的，readme 看了就能上手。

### 4. 进阶阅读

- [Spec-Driven Development (SDD): The Definitive 2026 Guide — BCMS](https://thebcms.com/blog/spec-driven-development)
- [Spec-Driven Development with AI: Complete Guide — Prommer](https://prommer.net/en/tech/guides/spec-driven-development)
- [Spec-Driven Development (SDD) Complete Guide 2026 — AI-pedias](https://en.ai-pedias.com/blog/spec-driven-development-guide-2026)
- [New course! Spec-Driven Development — YouTube](https://www.youtube.com/watch?v=bJ8F43j1Fqw)
- [OpenSpec Tutorial: Master Spec-Driven Development — QubitTool](https://qubittool.com/blog/openspec-sdd-tutorial)
- [How Spec-Driven Development Improves AI Coding Quality — Red Hat](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality)

---

### 参考资源

- [GitHub Spec Kit](https://github.com/github/spec-kit) — 开源 SDD 工具包
- [Spec-Driven Development: The Definitive 2026 Guide (BCMS)](https://thebcms.com/blog/spec-driven-development)
- [How spec-driven development improves AI coding quality (Red Hat)](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality)
- [Spec-Driven Development with Codex](https://codex.danielvaughan.com/2026/03/28/spec-driven-development-codex/)
- [Awesome Specification Driven Development](https://github.com/aabs/awesome-specification-driven-development) — 资源合集
- [Spec-Driven Development: Write the Spec, Not the Code (Robby B)](https://robbyb910.substack.com/p/spec-driven-development-write-the)
- [Microsoft: Spec-Driven Development — A Spec-First Approach](https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering)
