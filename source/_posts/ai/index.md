---
title: "AI 应用开发知识体系"
date: 2026-06-29
categories: ["AI"]
tags: ["AI", "LLM", "Agent", "RAG", "MCP"]
description: "从大模型基础到 Agent、RAG、MCP，系统梳理 AI 应用开发的核心概念与工程实践"
---

# AI 应用开发知识体系

做 AI 应用不是调个 API 就完事了。真正落地的时候，你会发现上下文长度不够、结构化输出不稳定、RAG 召回答非所问、Agent 跑着跑着就偏题了。这些问题单靠 Prompt 是兜不住的。

这个专题把我在项目里踩过的坑和学到的经验整理出来，覆盖大模型基础、Agent、RAG、MCP 和系统设计几个方向。

<!-- more -->

## 这个专题适合谁

- 后端/前端开发想转型 AI 应用开发
- 做过 Prompt Demo，但对工程化还不够熟
- 在项目里接入了大模型，开始遇到稳定性、成本问题
- 想系统了解 Agent、RAG、MCP 这些概念

## 知识脉络

```
大模型基础
  ├── Token 与上下文窗口
  ├── Temperature / Top P 采样参数
  ├── API 调用与流式响应
  └── 结构化输出（JSON Schema / Function Calling）
       │
Agent
  ├── Agent Loop（观察-规划-行动-反思）
  ├── Memory 系统（短期/长期记忆）
  ├── Prompt Engineering vs Context Engineering
  ├── MCP 协议（工具接入标准）
  └── Skills 机制
       │
RAG
  ├── 文档处理与 Chunk 切分
  ├── 向量数据库与索引算法
  ├── 检索策略（Hybrid Search / Rerank）
  └── GraphRAG
       │
系统设计
  ├── 模型网关（路由/Fallback/限流）
  ├── 可观测与评测
  └── 安全治理
```

## 建议阅读顺序

1. 先看 [大模型基础](/posts/ai/llm-basics) 建立调用链路的认知
2. 再看 [AI Agent 核心概念](/posts/ai/agent-basics) 理解 Agent 和传统编程的区别
3. 然后看 [RAG 检索增强生成](/posts/ai/rag-basics) 了解知识库问答的完整链路
4. 最后看 [MCP 协议详解](/posts/ai/mcp) 理解工具接入的标准

## 文章列表

### 大模型基础

- [大模型基础：Token、上下文与结构化输出](/posts/ai/llm-basics)

### AI Agent

- [AI Agent 核心概念：从 Prompt 到自主决策](/posts/ai/agent-basics)

### RAG

- [RAG 检索增强生成：让大模型拥有外部知识](/posts/ai/rag-basics)

### 工具与协议

- [MCP 协议详解：AI 应用的 USB-C](/posts/ai/mcp)
