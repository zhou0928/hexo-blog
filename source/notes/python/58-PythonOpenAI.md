---
title: "Python OpenAI"
tags: [AI]
group: 高级
date: 2026-09-10 00:00:00
---

# Python OpenAI

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用官方 `openai` 库调用 OpenAI（及兼容接口）的大模型，完成对话、补全、生成等任务。

## 要点
- 先装：`pip install openai`（新版为 1.x，接口与旧版 0.x 不同）。
- 核心是 `OpenAI` 客户端 + `client.chat.completions.create()` 对话接口。
- 必须配置 API Key，推荐放环境变量 `OPENAI_API_KEY`，别硬编码进代码。
- 对话按 `messages` 列表组织，每条含 `role`（system/user/assistant）和 `content`。
- 支持多轮对话：把历史消息逐步追加到 `messages` 即可保留上下文。
- `base_url` 可指向兼容 OpenAI 协议的第三方或本地服务（如 Ollama、DeepSeek）。

## 语法 / 常用方法

| 参数 / 方法 | 说明 | 示例 |
|---|---|---|
| `OpenAI(api_key=, base_url=)` | 创建客户端 | `OpenAI(api_key="sk-...")` |
| `client.chat.completions.create(...)` | 发起对话请求 | 见下方示例 |
| `model` | 模型名 | `"gpt-4o-mini"` |
| `messages` | 消息列表 | `[{"role": "user", "content": "你好"}]` |
| `temperature` | 随机性 0~2 | `0.7` |
| `max_tokens` | 最大生成长度 | `500` |
| `stream=True` | 流式输出 | 逐块返回 |
| `resp.choices[0].message.content` | 取回复文本 | — |
| `resp.usage.total_tokens` | 消耗 token 数 | — |
| `role: system` | 设定模型人设/规则 | `"你是助手"` |
| `role: user` / `assistant` | 用户输入 / 历史回复 | 多轮对话 |

## 代码示例

```python
import os
from openai import OpenAI

# 从环境变量读 Key，切勿写死在代码里
# macOS/Linux: export OPENAI_API_KEY="sk-xxx"
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 一、最简单的单轮对话
resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是一个简洁的中文助手。"},
        {"role": "user", "content": "用一句话解释什么是递归。"},
    ],
    temperature=0.7,
)
print(resp.choices[0].message.content)
print("消耗 token:", resp.usage.total_tokens)

# 二、多轮对话：把历史消息加进去
history = [{"role": "system", "content": "你是一个中文助手。"}]
def chat(text):
    history.append({"role": "user", "content": text})
    r = client.chat.completions.create(model="gpt-4o-mini", messages=history)
    reply = r.choices[0].message.content
    history.append({"role": "assistant", "content": reply})
    return reply

print(chat("你好，我叫小明。"))
print(chat("我叫什么？"))        # 模型能记住上下文

# 三、流式输出（打字机效果）
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "写一首关于春天的短诗"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()

# 四、指向兼容 OpenAI 协议的第三方/本地服务
client2 = OpenAI(api_key="ollama", base_url="http://localhost:11434/v1")
# model 换成对应服务提供的模型名即可
```

## 易错点
- 新版是 `client.chat.completions.create(...)`，旧版 `openai.ChatCompletion.create` 已废弃，别照抄老教程。
- API Key 不要提交到 Git，用环境变量或 `.env` + `python-dotenv`。
- 调用会消耗额度，循环调用前想清楚，调试时把 `max_tokens` 设小。
- 网络不通会抛 `APIConnectionError`，要 `try/except` 捕获并重试。
- `messages` 是有序的，system 一般放最前，且必须 user/assistant 交替合理。
- 模型名写错会报 404；用第三方 `base_url` 时模型名以该服务为准。
