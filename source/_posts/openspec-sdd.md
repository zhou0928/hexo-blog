---
title: "OpenSpec 入门：用规范驱动 AI 编码"
date: 2026-06-23
tags: ["AI", "工程化"]
description: "OpenSpec 是增长最快的开源 SDD 框架（55K+ stars），让 AI 编码从\"黑盒\"变\"白盒\"。本文从实战出发，讲清楚理念、上手流程、前端场景和避坑经验。"
---

# OpenSpec 入门：用规范驱动 AI 编码

用 AI 写代码的人都会遇到一个痛点：

> 需求在聊天框里来回拉扯，AI 每次的理解都不完全一样。改了这个忘了那个，上一轮能用的代码下一轮又坏了。

问题不在 AI 能力，在**需求没有结构化的载体**。人类开发用 PRD、API 文档、设计稿来对齐——但 AI 编程时这些都没了，全靠 prompt 传。

OpenSpec 就是来解决这个问题的。它是 GitHub 上增长最快的开源项目之一（55K+ stars，Fission AI 出品），核心理念只有一句话：

> **写代码之前，先让 AI 和你对齐需求。**

## 为什么需要 SDD

现在 AI 编码的主流模式是：

```
"帮我加个登录功能" → AI 直接开始写代码
```

这个模式下有几个问题：

| 问题 | 表现 |
|------|------|
| 需求在聊天框里 | 关了会话就没了，下次重来 |
| 缺少上下文 | AI 猜要不要验证码、轮询还是 WebSocket、过期多久 |
| 一次性的 | 同样的需求换个 AI 工具还得再描述一遍 |
| 不可追溯 | 没法 review 需求、没法 git blame |

Spec-Driven Development（规范驱动开发）把流程改成：

```
需求 → 规范文件 → AI 按规范写代码
```

规范写在项目目录的 Markdown 文件里。AI 能读、人能 review、git 能追踪变更。

## OpenSpec 的核心概念

### 目录结构

OpenSpec 的目录只有两层：

```
openspec/
├── specs/               # 当前系统的真实状态（已实现的功能规范）
│   ├── auth.md          # 认证模块规范
│   ├── notification.md  # 通知模块规范
│   └── ...
└── changes/             # 待实施的变更提案
    └── add-dark-mode/   # 每个 change 一个子目录
        ├── proposal.md  # 为什么改、改什么
        ├── delta.md     # 增量规范
        ├── design.md    # 技术方案
        └── tasks.md     # 实现清单
```

### Spec：规范文件

Spec 描述系统**应该做什么**，用结构化 Markdown 写成。关键词是"结构化"——不是散文式的需求文档，而是机器可读的规范：

```markdown
# Authentication Specification

## Purpose
描述系统的认证机制。

## Requirements

### Requirement: User Login
用户 SHALL 使用用户名和密码登录。

#### Scenario: Successful Login
- **GIVEN** 用户输入有效的用户名和密码
- **WHEN** 用户点击登录按钮
- **THEN** 系统返回认证 token

#### Scenario: Invalid Password
- **GIVEN** 用户输入错误的密码
- **WHEN** 用户点击登录按钮
- **THEN** 系统返回 401 错误
- **AND** 系统记录登录失败日志
```

每条需求用 `SHALL` / `MUST` / `SHOULD` 标明强制程度（RFC 2119 规范），每个场景用 GIVEN-WHEN-THEN 描述。这让需求是可测试的——能写 GIVEN-WHEN-THEN 的需求才是明确的需求。

### Delta Spec：增量规范

改需求时不用重写整个文件，只需描述**什么变了**：

```markdown
## ADDED Requirements

### Requirement: Two-Factor Authentication
系统 MUST 支持 TOTP 双因素认证。

## MODIFIED Requirements

### Requirement: Session Expiration
- [旧] 系统 SHOULD 在 30 分钟无活动后过期会话
- [新] 系统 MUST 在 15 分钟无活动后过期会话

## REMOVED Requirements

### Requirement: Legacy CSV Export
旧版 CSV 导出功能已废弃，移至 archive 模块。
```

归档时增量规范自动合并到主规范。三个操作符 `ADDED → MODIFIED → REMOVED` 按顺序执行，保证合并结果正确。

### Change：变更提案

Change 是变更的载体，回答"为什么改"和"改什么"：

```markdown
---
title: 添加双因素认证
status: proposed
created: 2026-06-23
---

## Why
1. 现有密码登录存在安全风险
2. 用户要求增加二次验证

## What Changes
- 添加 TOTP 双因素认证
- 缩短会话过期时间到 15 分钟
- 移除旧版 CSV 导出
```

## 上手流程

### 初始化

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init
```

`openspec init` 会在项目根目录创建 `openspec/` 目录和初始配置文件。

### 完整实战：给博客加一个 RSS 订阅功能

下面用一个前端场景串起三个命令——你在自己的项目里可以照着走一遍。

#### Step 1：Propose

```markdown
你：/opsx:propose 为博客添加 RSS 订阅功能，支持中英文内容
```

AI 会生成一整套变更文件：

```
openspec/changes/add-rss-feed/
├── proposal.md       # 为什么做、目标
├── delta.md          # 增量规范
├── design.md         # 技术方案
└── tasks.md          # 实现步骤
```

生成的 `delta.md` 长这样：

```markdown
## ADDED Requirements

### Requirement: RSS Feed
系统 SHALL 提供 RSS 订阅源。

#### Scenario: Access Feed
- **GIVEN** 用户访问 /feed.xml
- **WHEN** 请求成功
- **THEN** 返回 Content-Type: application/xml
- **AND** 响应中包含博客标题、日期、摘要、链接

#### Scenario: Bilingual Content
- **GIVEN** 博客包含中英文文章
- **WHEN** 生成 RSS
- **THEN** RSS 条目包含文章的原始语言标题和内容
```

这就是你和 AI 对齐需求的关键节点。如果不对→现在就改 spec。如果对了→进入下一步。

#### Step 2：Apply

```markdown
你：/opsx:apply
```

AI 会按 `tasks.md` 的清单逐步实现：

```
✅ 任务 1/3：安装 feed 生成依赖
   1.1 添加 feed npm 包 ✓
✅ 任务 2/3：创建 RSS 生成脚本
   2.1 读取所有文章 frontmatter ✓
   2.2 生成标准 RSS XML ✓
   2.3 处理中英文内容 ✓
✅ 任务 3/3：注册路由
   3.1 在构建流程中添加 RSS ✓
   3.2 在 head 中添加 link tag ✓
```

每个 step 完成都会过一遍 spec 验证——代码和需求是绑定的。

#### Step 3：Archive

```markdown
你：/opsx:archive
```

变更归档到 `openspec/changes/archive/2026-06-23-add-rss-feed/`，delta spec 合并到主 `specs/`，工作区恢复干净状态。

```
openspec/
├── specs/
│   └── rss.md              # ← 新的 RSS 规范，已合并增量
└── changes/
    └── archive/             # ← 已归档
        └── 2026-06-23-add-rss-feed/
```

## 前端场景实战

上面是一个流程示意。下面给三个真实的前端场景，展示 spec 怎么写。

### 场景 1：表格组件的空状态

```markdown
### Requirement: Empty State
Table 组件 SHOULD 在数据为空时显示空状态。

#### Scenario: No Data
- **GIVEN** 查询返回空数组
- **WHEN** Table 组件渲染
- **THEN** 显示空状态占位图
- **AND** 提示文案为"暂无数据"
- **AND** 提供 slot 允许自定义空状态内容

#### Scenario: Loading
- **GIVEN** 数据正在请求中
- **WHEN** Table 组件渲染
- **THEN** 显示骨架屏（3 行占位）
- **AND** 已有的刷新按钮不可点击
```

### 场景 2：表单校验

```markdown
### Requirement: Form Validation

#### Scenario: Required Field
- **GIVEN** 必填字段为空
- **WHEN** 用户提交表单
- **THEN** 该字段下方显示红色错误提示
- **AND** 表单不提交

#### Scenario: Email Format
- **GIVEN** 邮箱字段输入了非邮箱格式
- **WHEN** 用户移出输入框（blur）
- **THEN** 显示"请输入正确的邮箱地址"
- **AND** 该字段获得红色边框
```

### 场景 3：API 请求层

```markdown
### Requirement: API Request Layer

#### Scenario: Successful Request
- **GIVEN** 网络正常且参数合法
- **WHEN** 发送 API 请求
- **THEN** 返回标准响应格式 { code, data, message }
- **AND** 全局 loading 状态更新

#### Scenario: Token Expired
- **GIVEN** 用户 token 已过期
- **WHEN** 收到 401 响应
- **THEN** 自动跳转到登录页
- **AND** 清除用户本地数据
```

这些 spec 的好处是：**任何人（或 AI）看了都能生成一致的实现**。不会出现"空状态忘了加"或"错误提示位置不对"这种问题。

## GitHub Spec Kit 快速对比

SDD 领域最常被拿来对比的是 GitHub 今年发布的 Spec Kit：

| 维度 | OpenSpec | GitHub Spec Kit |
|------|----------|-----------------|
| 语言 | Node.js CLI | Python CLI |
| 增量变更 | Delta Spec 原生支持 | 手动管理 |
| 工具绑定 | 25+ 工具通用 | Cursor 最佳 |
| 存量项目 | brownfield-first，渐进引入 | greenfield 更顺 |
| 规范格式 | 结构化 Markdown | 宪法式 rules |
| 社区 | 55K+ stars，社区活跃 | 官方支持 |

OpenSpec 最突出的差异化优势是**对存量项目友好**。多数 SDD 工具要求你新建项目时就用，但 OpenSpec 的 Delta Spec 机制让你可以在一个跑了两年的项目上从零开始——只给下一个功能写 spec，不碰历史代码。

## 在已有项目中落地

如果你有一个跑了两年的项目想引入 OpenSpec，这里是一个渐进式的方案：

**Phase 1：从下一个新功能开始**

```bash
openspec init                    # 初始化目录
# 下一个需求用 /opsx:propose 起步
```

不改历史代码，不写历史 spec。**新的需求走规范驱动，旧的不动。**

**Phase 2：建立模板**

团队统一 spec 格式后，把常见模式写成模板。比如"新建页面"的模板包含路由配置、权限校验、loading/empty/error 状态的 spec。

**Phase 3：逐步补历史 spec**

只补核心模块的 spec——比如认证、权限、支付。不要试图一夜之间写完所有 spec。

**Phase 4：纳入 CI**

在 CI 中加入 `openspec validate` 检查，确保每次提交的代码和 spec 一致。

这套方案的核心思想是：**不要 Big Bang 改造，从下个需求开始就行。**

## 避坑指南

实际用了几个月后的一些经验：

**Spec 不要写实现细节**

```markdown
<!-- ❌ 不好 -->
系统 MUST 使用 localStorage 存储主题偏好

<!-- ✓ 好 -->
系统 SHALL 记住用户的主题偏好
```

"用什么存"是实现细节，换存储方式不需要改需求规范。

**Spec 不要太粗也不要太细**

一个 spec 文件聚焦一个模块。认证的 spec 不要混入通知的 spec。一个场景能写完的需求就不要拆成十个场景——用人类的判断力平衡细致程度和可维护性。

**Change 保持原子**

每个 change 是一个逻辑单元。"添加深色模式"是一个 change，"添加深色模式+重构侧边栏+升级依赖"是三个。大小以能在一次 PR Review 中看完为准。

**及时归档**

完成的变更当天归档。工作区里只保留"正在做"的变更，不堆积。保持和看板一样的工作流。

**模型选择**

高推理能力的模型效果明显更好。Opus 4.x / Codex 5.x / Gemini 2.5 Pro 能比较好地理解 spec 结构并生成匹配的代码。小模型容易"跳过 spec 直接猜"。

**已有测试的项目效果更好**

如果你的项目已经有单元测试，OpenSpec 的效果会加倍——spec 定义"做什么"，测试验证"做对了"。

## 总结

OpenSpec 不是替代 AI 编程助手，而是让它们变得**更可控**。它的本质是在「模糊的需求」和「AI 生成的代码」之间加了一层——**规范**。

- **可预测** — 规范先行，AI 输出可预期，减少返工
- **可追溯** — 需求在项目目录里，git 能 track，退出会话也丢不了
- **工具自由** — 支持 25+ AI 编码工具，不锁定生态
- **渐进引入** — 不用改造历史代码，从下个需求开始就行

如果你的项目已经在用 AI 写代码，并且遇到了"猜需求 → 改来改去 → 合了又改"的问题，OpenSpec 值得一试。从 `openspec init` 开始，走一遍 propose → apply → archive，体验一下规范驱动的感觉。
