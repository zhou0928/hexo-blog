---
title: "AI Agent 核心概念：从 Prompt 到自主决策"
date: 2026-06-30
categories: ["AI"]
tags: ["AI Agent", "Prompt Engineering", "Context Engineering", "MCP"]
description: "理解 AI Agent 的工作原理，包括 Agent Loop、Memory 系统、Context Engineering 和工具调用"
---

# AI Agent 核心概念：从 Prompt 到自主决策

ChatGPT 刚出来的时候，大家觉得写好 Prompt 就够了。但真正做项目的时候发现，单轮对话根本解决不了复杂任务。你需要一个能自主规划、调用工具、记住上下文、持续迭代的系统——这就是 Agent。

这篇文章不讲概念堆砌，直接从工程角度拆解 Agent 的核心机制。

<!-- more -->

## Agent 不是"更聪明的 ChatBot"

传统 ChatBot 的工作模式：

```
用户输入 → 模型处理 → 返回结果（结束）
```

Agent 的工作模式：

```
用户输入 → 观察环境 → 制定计划 → 执行动作 → 观察结果 → 调整计划 → 继续执行 → ...
```

关键区别在于：**Agent 有循环**。它不只是回答问题，而是持续地观察、思考、行动，直到任务完成。

## Agent Loop：四步循环

Agent 的核心是一个循环，包含四个步骤：

### 1. 观察（Observe）

Agent 从环境中获取信息。可能是用户输入、工具返回的结果、或者之前的记忆。

```python
# 伪代码
observation = {
    "user_query": "帮我查一下北京今天的天气",
    "available_tools": ["get_weather", "search_web", "send_email"],
    "memory": ["用户之前问过上海天气"]
}
```

### 2. 规划（Plan）

基于观察到的信息，Agent 决定下一步做什么。这一步是最体现"智能"的地方。

```
思考过程：
1. 用户想知道北京天气
2. 我有 get_weather 工具可以用
3. 需要先调用 get_weather 获取数据
4. 然后用自然语言总结结果
```

### 3. 执行（Act）

Agent 执行规划好的动作，通常是调用某个工具。

```python
result = call_tool("get_weather", {"location": "北京"})
# 返回: {"temperature": 28, "condition": "晴", "humidity": 45}
```

### 4. 反思（Reflect）

Agent 评估执行结果，决定是否需要继续循环。

```
反思：
- 天气数据已获取
- 信息完整，可以回答用户
- 循环结束
```

如果信息不够（比如用户问的是"北京和上海哪个更热"），Agent 会继续循环，再调用一次工具获取上海的天气。

## Memory：Agent 的"记忆系统"

Agent 需要记住东西。没有记忆的 Agent 每次对话都是从零开始，这在实际项目中是不可接受的。

### 短期记忆（Working Memory）

就是当前对话的上下文。Agent 需要记住刚才做了什么、用户说了什么、工具返回了什么。

**问题**：上下文窗口有限，对话太长会溢出。

**解决方案**：
- 滑动窗口：只保留最近 N 轮
- 摘要压缩：把历史对话压缩成摘要
- 关键信息提取：只保留与任务相关的信息

### 长期记忆（Long-term Memory）

跨对话的记忆。比如用户上次问过什么、偏好什么、有什么习惯。

**实现方式**：
- 向量数据库：把对话历史向量化存储，按语义检索
- 结构化存储：用关系数据库存储用户偏好、任务状态
- 文件系统：把重要信息写入文件（比如 CLAUDE.md）

### 记忆的生命周期

```
创建 → 使用 → 衰减 → 归档/删除
```

不是所有记忆都值得保留。Agent 需要判断哪些信息重要、哪些可以遗忘。

## Context Engineering：比 Prompt Engineering 更重要

Prompt Engineering 是"怎么写提示词"，Context Engineering 是"怎么管理整个上下文"。

### 为什么 Context Engineering 更重要

一个好的 Prompt 如果放在错误的上下文里，效果会很差。比如：

```
上下文：用户之前说"我要写一首诗"
当前问题："帮我写个排序算法"
```

模型可能会困惑：到底要写诗还是写代码？

### Context Engineering 的核心原则

**1. 相关性原则**

只放与当前任务相关的信息。多了会稀释关键信息，少了会缺少必要上下文。

```python
# 不好的做法：把所有历史对话都塞进去
context = all_history + current_query

# 好的做法：只放相关的历史
context = relevant_history + current_query
```

**2. 层次化原则**

信息按重要性分层：

```
系统提示词（最高优先级）
  → 当前任务描述
    → 相关工具说明
      → 历史对话摘要
        → 原始历史对话（最低优先级）
```

**3. 动态调整原则**

根据任务进展动态调整上下文。任务早期可能需要更多背景信息，任务后期只需要关键状态。

## 工具调用：Agent 的"手脚"

Agent 光会想不行，还得能做事。工具调用让 Agent 可以与外部世界交互。

### 工具注册

```python
tools = [
    {
        "name": "get_weather",
        "description": "获取指定城市的天气信息",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "城市名称"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "search_web",
        "description": "搜索网页信息",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "搜索关键词"}
            },
            "required": ["query"]
        }
    }
]
```

### 工具调用流程

```
Agent 决定调用 get_weather("北京")
  → 系统执行工具调用
    → 返回结果给 Agent
      → Agent 继续思考下一步
```

### 工具调用的安全问题

工具调用是 Agent 最危险的地方。Agent 可能会：
- 调用不该调用的工具
- 传入错误的参数
- 重复调用导致资源浪费

**防御措施**：
- 工具白名单：只允许调用预定义的工具
- 参数校验：严格校验工具参数
- 权限控制：不同 Agent 有不同的工具权限
- 调用限制：限制调用频率和次数

## 实际案例：一个简单的 Agent

```python
class SimpleAgent:
    def __init__(self, tools, model):
        self.tools = tools
        self.model = model
        self.memory = []
    
    def run(self, user_query):
        # 构建上下文
        context = self.build_context(user_query)
        
        # Agent Loop
        for _ in range(10):  # 最多循环10次
            # 调用模型
            response = self.model.chat(context)
            
            # 检查是否需要调用工具
            if response.has_tool_call():
                tool_call = response.get_tool_call()
                result = self.execute_tool(tool_call)
                
                # 把结果加入上下文
                context.add_tool_result(result)
                self.memory.append({
                    "tool": tool_call.name,
                    "result": result
                })
            else:
                # 没有工具调用，返回最终答案
                return response.content
        
        return "任务超时，未能完成"
```

## 常见问题

### Agent 跑飞了怎么办

Agent 可能会陷入死循环，或者一直在做无意义的事情。

**解决方案**：
- 设置最大循环次数
- 监控 Agent 的行为模式
- 加入超时机制
- 使用更小的模型做"监督者"

### Agent 成本太高怎么办

每次循环都要调用模型，Token 消耗很快。

**解决方案**：
- 用更小的模型处理简单任务
- 缓存工具调用结果
- 优化上下文大小，减少 Token 消耗
- 设置成本预算

### Agent 不可靠怎么办

Agent 的输出不确定，同样的输入可能得到不同的结果。

**解决方案**：
- 关键步骤加入人工确认
- 设置输出校验
- 使用确定性更高的参数（低 Temperature）
- 建立回滚机制

## 小结

- Agent 的核心是循环：观察 → 规划 → 执行 → 反思
- Memory 系统让 Agent 能记住东西，分短期和长期记忆
- Context Engineering 比 Prompt Engineering 更重要
- 工具调用是 Agent 的手脚，但需要严格的安全控制

---

**下一篇**：[RAG 检索增强生成：让大模型拥有外部知识](/posts/ai/rag-basics)
