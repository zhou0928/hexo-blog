---
title: "Claude Code 使用指南：从配置到实战"
date: 2026-07-02
categories: ["AI 编程"]
tags: ["Claude Code", "AI 编程", "CLI"]
description: "Claude Code 的核心配置、常用命令、上下文管理和最佳实践"
---

# Claude Code 使用指南：从配置到实战

Claude Code 是 Anthropic 推出的 CLI 编程工具。它不是简单的代码补全，而是一个能理解整个项目、执行复杂任务的 AI 功手。但要把它用好，你得知道怎么配置、怎么给上下文、怎么拆任务。

这篇文章从实际使用角度，讲 Claude Code 的核心配置和工程实践。

<!-- more -->

## 安装与配置

### 基础安装

```bash
npm install -g @anthropic-ai/claude-code
```

### 项目级配置：CLAUDE.md

`CLAUDE.md` 是 Claude Code 的项目规则文件，放在项目根目录。它告诉 Claude 这个项目的背景、规范和约束。

```markdown
# 项目规则

## 技术栈
- Vue 3 + TypeScript + Vite
- 后端：Spring Boot + MyBatis-Plus
- 数据库：MySQL 8.0

## 代码规范
- 使用 Composition API，不用 Options API
- 组件命名：PascalCase
- 工具函数放 src/utils/
- API 请求放 src/api/

## 禁止事项
- 不要直接修改 node_modules
- 不要删除测试文件
- 不要改变现有 API 接口格式
```

### CLAUDE.md 的层级结构

```
项目根目录/CLAUDE.md          # 项目级规则
├── src/
│   ├── components/CLAUDE.md  # 组件目录规则
│   └── utils/CLAUDE.md       # 工具函数规则
```

**原则**：越具体越好。不要写"遵循最佳实践"，要写"组件用 Composition API + setup 语法糖"。

## 核心命令

### 常用命令

| 命令 | 作用 |
|------|------|
| `claude` | 启动交互式会话 |
| `claude "问题"` | 直接提问 |
| `claude -p "问题"` | 非交互模式，适合脚本 |
| `/help` | 查看帮助 |
| `/cost` | 查看 Token 消耗 |
| `/clear` | 清空上下文 |

### 工作流命令

| 命令 | 作用 |
|------|------|
| `/review` | 代码审查 |
| `/simplify` | 简化代码 |
| `/loop N 命令` | 重复执行 N 次 |

### 实用技巧

```bash
# 批量修改文件
claude "把 src/ 下所有 .js 文件中的 var 改成 const"

# 生成测试
claude "为 src/utils/date.js 生成单元测试"

# 代码审查
git diff | claude "审查这些改动，指出潜在问题"

# 解释代码
cat src/complex-function.js | claude "解释这个函数的逻辑"
```

## 上下文管理：最关键的技能

Claude Code 的效果很大程度上取决于你怎么给上下文。

### 原则一：相关性优先

```bash
# 不好的做法：把所有文件都给 Claude
cat src/**/*.js | claude "修改这个函数"

# 好的做法：只给相关的文件
cat src/api/user.js src/utils/request.js | claude "修改用户 API 的请求方式"
```

### 原则二：明确目标

```bash
# 不好的做法：模糊的指令
claude "修复这个 bug"

# 好的做法：具体的指令
claude "用户列表页点击分页后，数据没有刷新。问题可能在 src/views/user/list.vue 的 fetchList 方法，或者 src/api/user.js 的 getList 接口"
```

### 原则三：提供约束

```bash
# 不好的做法：没有约束
claude "重构这个组件"

# 好的做法：明确约束
claude "重构 src/components/UserTable.vue：
1. 从 Options API 改成 Composition API
2. 不要改变现有的 props 和 events 接口
3. 保持现有的样式不变"
```

### 上下文窗口管理

Claude Code 有上下文窗口限制。处理大项目时：

```bash
# 1. 分阶段处理
# 第一阶段：理解项目结构
claude "先看一下 src/ 目录结构，告诉我这个项目的架构"

# 第二阶段：定位问题
claude "用户模块的 API 请求在哪个文件？"

# 第三阶段：具体修改
claude "修改 src/api/user.js 中的 getList 方法，添加分页参数"
```

## 任务拆分：大任务拆成小步骤

### 不好的做法

```bash
claude "给这个项目加上用户认证功能"
```

这个任务太大，Claude 可能会：
- 改太多文件
- 遗漏某些步骤
- 引入新的 bug

### 好的做法

```bash
# 步骤 1：设计
claude "帮我设计用户认证的技术方案，包括：登录接口、Token 存储、路由守卫"

# 步骤 2：实现登录接口
claude "实现登录接口 POST /api/auth/login，返回 JWT Token"

# 步骤 3：Token 管理
claude "实现 Token 的存储和刷新逻辑，放在 src/utils/auth.js"

# 步骤 4：路由守卫
claude "在 src/router/index.js 中添加路由守卫，未登录跳转登录页"

# 步骤 5：测试
claude "为以上功能编写测试用例"
```

## 代码审查：AI 写的代码要过审

### 审查清单

1. **功能正确性**：代码是否实现了需求？
2. **边界情况**：空值、异常、并发是否处理？
3. **安全性**：SQL 注入、XSS、敏感信息泄露？
4. **性能**：有没有不必要的循环、重复查询？
5. **可维护性**：命名是否清晰、逻辑是否易懂？

### 使用 Claude 辅助审查

```bash
# 审查当前改动
git diff | claude "审查这些改动，重点关注安全性和性能"

# 审查特定文件
cat src/api/user.js | claude "审查这个文件的错误处理是否完善"

# 检查测试覆盖
cat src/utils/date.test.js | claude "检查测试用例是否覆盖了边界情况"
```

## 多模型协同

不同任务适合不同的模型：

| 任务 | 推荐模型 | 原因 |
|------|---------|------|
| 写代码 | Claude Sonnet | 性价比高，速度快 |
| 审查代码 | Claude Opus | 推理能力强 |
| 排查问题 | Claude Opus | 需要深度分析 |
| 简单修改 | 本地模型 | 快，不需要联网 |

```bash
# 在 CLAUDE.md 中配置
## 模型使用建议
- 简单任务用默认模型
- 复杂任务用 claude-sonnet-4-20250514
- 关键代码审查用 claude-opus-4-20250514
```

## 回滚策略

AI 改的代码出了问题，怎么回滚？

### Git 是你的安全网

```bash
# 改动前先提交
git add -A && git commit -m "保存当前状态"

# 让 Claude 修改
claude "修改 xxx"

# 如果不满意
git reset --hard HEAD~1
```

### 小步提交

```bash
# 不要一次性改太多
# 每完成一个功能点就提交
git add src/api/user.js && git commit -m "feat: 添加用户登录接口"
git add src/utils/auth.js && git commit -m "feat: 添加 Token 管理"
git add src/router/index.js && git commit -m "feat: 添加路由守卫"
```

## 常见问题

### Claude 改动太大怎么办

```bash
claude "只修改 src/api/user.js 这一个文件，不要动其他文件"
```

### Claude 理解错了需求

```bash
# 先让 Claude 说说它的理解
claude "先描述一下你打算怎么改，我确认后再动手"
```

### Claude 生成的代码有 bug

```bash
# 提供错误信息
cat error.log | claude "这段代码报错了，帮我修复"
```

## 小结

- CLAUDE.md 写清楚项目规则，越具体越好
- 上下文管理是关键：相关性、明确目标、提供约束
- 大任务拆成小步骤，每步都验证
- AI 写的代码必须过审，不要盲目信任
- Git 是安全网，小步提交，方便回滚

---

**下一篇**：[AI 编程工作流：上下文、任务拆分与代码审查](/posts/ai-coding/ai-coding-workflow)
