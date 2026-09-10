---
title: "大模型基础：Token、上下文与结构化输出"
date: 2026-06-29
categories: ["AI"]
tags: ["LLM", "Token", "API", "结构化输出"]
description: "理解大模型 API 调用的核心概念，包括 Token 计算、上下文窗口、采样参数和结构化输出"
---

# 大模型基础：Token、上下文与结构化输出

很多人把大模型当黑盒 API 调用，Prompt 写完就扔进去跑。但真正上项目的时候，Token 被截断、输出格式不稳定、采样参数一调输出就飘——这些问题靠"请严格按照 JSON 输出"这种 Prompt 是兜不住的。

这篇文章把大模型 API 调用链路里的核心概念拆清楚，让你知道每个参数到底在控制什么。

<!-- more -->

## Token：大模型的"内存单位"

大模型不认字，它认的是 Token。一个中文字符通常占 1-2 个 Token，一个英文单词可能是 1-3 个 Token。

### 为什么要关心 Token

1. **计费**：大多数 API 按 Token 计费，输入输出都要算钱
2. **上下文窗口**：模型有最大 Token 限制（比如 128K），超了就截断
3. **响应速度**：输出 Token 越多，生成越慢

### Token 计算的坑

```python
# 你以为的："你好世界" = 4个Token
# 实际的：不同模型分词方式不同，可能是 3-6 个 Token

import tiktoken
enc = tiktoken.encoding_for_model("gpt-4")
print(len(enc.encode("你好世界")))  # 可能是 4，也可能是 6
```

**实际建议**：不要自己算 Token，直接用 API 返回的 `usage.prompt_tokens` 和 `usage.completion_tokens`。

## 上下文窗口：模型的"短期记忆"

上下文窗口是模型一次能"看到"的最大 Token 数。超过这个限制，最早的内容会被丢弃。

### 上下文窗口的实际影响

```
系统提示词（2000 Token）
+ 历史对话（8000 Token）
+ 当前问题（500 Token）
+ 预留输出（2000 Token）
= 12500 Token（在 16K 窗口内 ✅）

如果历史对话积累到 15000 Token：
= 19500 Token（超出 16K 窗口 ❌，早期对话被截断）
```

### 管理上下文的策略

| 策略 | 适用场景 | 实现方式 |
|------|---------|---------|
| 滑动窗口 | 对话场景 | 保留最近 N 轮对话 |
| 摘要压缩 | 长对话 | 用模型把历史对话压缩成摘要 |
| 关键信息提取 | 任务场景 | 只保留与当前任务相关的信息 |
| 分段处理 | 长文档 | 把文档分段，逐段处理 |

## 采样参数：控制模型的"创造力"

### Temperature

Temperature 控制输出的随机性：

- **Temperature = 0**：每次输出几乎一样，适合需要确定性的场景（代码生成、数据提取）
- **Temperature = 0.7**：平衡创造性和一致性，适合一般对话
- **Temperature = 1.0+**：更随机、更有创意，适合创意写作

```
Prompt: "用一个词形容天气"
Temperature=0: "晴朗"（每次都一样）
Temperature=0.7: "晴朗" / "不错" / "宜人"（有变化）
Temperature=1.0: "晴朗" / "明媚" / "舒爽" / "灿烂"（更随机）
```

### Top P

Top P（Nucleus Sampling）控制模型从多少个候选 Token 中选择：

- **Top P = 0.1**：只从概率最高的 10% 候选中选，输出更集中
- **Top P = 0.9**：从概率前 90% 的候选中选，输出更多样

**实际建议**：Temperature 和 Top P 通常调一个就行，别同时调。

## 结构化输出：让模型返回可用的数据

大模型天生输出的是自由文本。要让它返回 JSON、XML 这种结构化数据，需要额外的约束。

### 方式一：Prompt 约束

```
请以 JSON 格式返回用户信息，格式如下：
{
  "name": "姓名",
  "age": 年龄,
  "email": "邮箱"
}
```

**问题**：模型可能返回额外的解释文字，或者 JSON 格式不正确。

### 方式二：JSON Schema 约束

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["name", "age"]
}
```

大多数主流模型（GPT-4、Claude）都支持 JSON Schema 约束，返回的一定是合法 JSON。

### 方式三：Function Calling

Function Calling 是结构化输出的高级形式。你定义函数签名，模型返回函数调用参数：

```json
{
  "name": "get_weather",
  "arguments": {
    "location": "北京",
    "date": "2026-06-29"
  }
}
```

**关键点**：Function Calling 返回的就是结构化数据，不需要你去解析文本。

### 三种方式对比

| 方式 | 可靠性 | 灵活性 | 适用场景 |
|------|--------|--------|---------|
| Prompt 约束 | 低 | 高 | 快速原型 |
| JSON Schema | 高 | 中 | 生产环境 |
| Function Calling | 高 | 低 | 工具调用 |

## API 调用最佳实践

### 错误处理

```python
import openai
import time

def call_llm(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return response.choices[0].message.content
        except openai.error.RateLimitError:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # 指数退避
            else:
                raise
        except openai.error.APIError as e:
            print(f"API 错误: {e}")
            if attempt < max_retries - 1:
                time.sleep(1)
            else:
                raise
```

### 流式响应

对于长输出，用流式响应可以显著提升用户体验：

```python
stream = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

## 小结

- Token 是大模型的基本单位，影响计费、速度和上下文限制
- 上下文窗口需要主动管理，不能无限堆积对话历史
- Temperature 和 Top P 控制输出的随机性，生产环境建议低温度
- 结构化输出优先用 JSON Schema 或 Function Calling，不要只靠 Prompt 约束

---

**下一篇**：[AI Agent 核心概念：从 Prompt 到自主决策](/posts/ai/agent-basics)
