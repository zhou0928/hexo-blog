---
title: "RAG 检索增强生成：让大模型拥有外部知识"
date: 2026-06-30
categories: ["AI"]
tags: ["RAG", "向量数据库", "检索优化", "知识库"]
description: "理解 RAG 的完整链路，包括文档处理、向量数据库、检索策略和优化方法"
---

# RAG 检索增强生成：让大模型拥有外部知识

大模型的知识有截止日期，它不知道你公司的内部文档、你昨天刚更新的产品手册、你数据库里的业务数据。RAG（Retrieval-Augmented Generation）就是解决这个问题的：**先检索，再生成**。

这篇文章从工程角度拆解 RAG 的完整链路，帮你理解每个环节该怎么做。

<!-- more -->

## RAG 是什么

传统大模型的局限：

```
用户问题 → 大模型 → 回答（基于训练数据，可能过时或不知道）
```

RAG 的工作方式：

```
用户问题 → 检索相关文档 → 把文档作为上下文 → 大模型 → 回答（基于检索到的信息）
```

**核心思想**：不要让模型凭空回答，先给它相关资料，让它基于资料回答。

## RAG 的完整链路

```
文档处理 → 文档切分 → 向量化 → 存入向量数据库
                                      ↓
用户提问 → 查询向量化 → 向量检索 → 重排序 → 构建上下文 → 大模型生成
```

### 1. 文档处理

原始文档需要先处理成可切分的格式：

| 文档类型 | 处理方式 | 注意事项 |
|---------|---------|---------|
| PDF | 提取文本、表格、图片 | 扫描版 PDF 需要 OCR |
| Word | 提取文本和结构 | 保留标题层级 |
| Markdown | 直接使用 | 保留格式信息 |
| 网页 | 提取正文 | 去除导航、广告等噪音 |
| 数据库 | 导出为文本 | 保留字段关系 |

### 2. 文档切分（Chunking）

把长文档切成小块，每块作为独立的检索单元。

**常见切分策略**：

```python
# 固定长度切分
def fixed_size_split(text, chunk_size=500, overlap=50):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i + chunk_size])
    return chunks

# 按段落切分
def paragraph_split(text):
    return [p.strip() for p in text.split('\n\n') if p.strip()]

# 语义切分（需要模型辅助）
def semantic_split(text):
    # 用模型判断语义边界，在语义转换处切分
    pass
```

**切分的关键问题**：

| 问题 | 影响 | 解决方案 |
|------|------|---------|
| 切太大 | 检索不精准 | 增加 overlap，或用更小的 chunk |
| 切太小 | 上下文不完整 | 适当增大 chunk，或用 parent-child 关系 |
| 切错位置 | 语义断裂 | 按段落/章节切分，而非固定长度 |

### 3. 向量化（Embedding）

把文本转换成向量，用于后续的语义检索。

```python
import openai

def get_embedding(text):
    response = openai.Embedding.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding
```

**Embedding 模型选择**：

| 模型 | 维度 | 特点 |
|------|------|------|
| text-embedding-3-small | 1536 | 便宜，性能一般 |
| text-embedding-3-large | 3072 | 贵，性能好 |
| BGE-M3 | 1024 | 开源，多语言支持好 |
| Cohere Embed | 1024 | 多语言，长文本支持好 |

### 4. 向量数据库

存储和检索向量的专用数据库。

**主流选择**：

| 数据库 | 特点 | 适用场景 |
|--------|------|---------|
| Pinecone | 全托管，易用 | 快速上手，不想运维 |
| Milvus | 开源，功能全 | 需要自建，数据量大 |
| Weaviate | 开源，支持混合检索 | 需要语义+关键词混合检索 |
| Qdrant | 开源，性能好 | 需要高性能检索 |
| Chroma | 轻量，嵌入式 | 原型开发，数据量小 |

### 5. 检索策略

**向量检索**：

```python
# 语义相似度检索
results = vector_db.search(
    query_embedding=get_embedding("北京天气"),
    top_k=5
)
```

**关键词检索**：

```python
# BM25 关键词检索
results = bm25_search("北京 天气", top_k=5)
```

**混合检索（Hybrid Search）**：

```python
# 向量检索 + 关键词检索，加权融合
vector_results = vector_db.search(query_embedding, top_k=10)
bm25_results = bm25_search(query, top_k=10)

# 加权融合
final_results = weighted_merge(
    vector_results,
    bm25_results,
    weights=[0.7, 0.3]  # 向量 70%，关键词 30%
)
```

### 6. 重排序（Rerank）

初次检索的结果可能不够精准，用重排序模型重新打分：

```python
# 初次检索
initial_results = vector_db.search(query_embedding, top_k=20)

# 重排序
reranked_results = reranker.rank(
    query=query,
    documents=initial_results,
    top_k=5  # 只保留最相关的 5 个
)
```

**重排序模型**：
- Cohere Rerank
- BGE-Reranker
- cross-encoder 系列

### 7. 构建上下文

把检索到的文档片段组装成模型的输入：

```python
def build_context(query, retrieved_docs):
    context = f"问题：{query}\n\n"
    context += "参考资料：\n"
    for i, doc in enumerate(retrieved_docs, 1):
        context += f"[{i}] {doc.text}\n\n"
    context += "请基于以上参考资料回答问题。"
    return context
```

## RAG 优化策略

### 查询优化（Query Optimization）

用户的问题可能不够精准，需要优化：

```python
# 查询改写
def rewrite_query(original_query):
    prompt = f"请将以下问题改写为更适合检索的形式：{original_query}"
    return call_llm(prompt)

# 查询扩展
def expand_query(original_query):
    prompt = f"请为以下问题生成3个相关的搜索查询：{original_query}"
    return call_llm(prompt)
```

### 检索优化

- **Hybrid Search**：结合向量和关键词检索
- **Rerank**：用重排序模型提高精准度
- **Parent-Child**：检索小块，返回大块（保留上下文）
- **Sentence Window**：检索单个句子，返回周围句子

### 上下文压缩

检索到的文档可能太长，需要压缩：

```python
def compress_context(query, docs):
    prompt = f"""
    问题：{query}
    
    以下是检索到的文档片段，请提取与问题最相关的关键信息：
    {chr(10).join([f'[文档{i}] {doc.text}' for i, doc in enumerate(docs)])}
    """
    return call_llm(prompt)
```

## 常见问题

### RAG 为什么答非所问

**排查顺序**：
1. 检索阶段：文档是否被正确检索到？
2. 排序阶段：相关文档是否排在前面？
3. 生成阶段：模型是否正确使用了检索结果？

### 如何评估 RAG 效果

| 指标 | 衡量什么 | 计算方式 |
|------|---------|---------|
| Recall@K | 检索覆盖率 | 前K个结果中包含正确答案的比例 |
| MRR | 排序质量 | 正确答案的排名倒数 |
| Answer Accuracy | 生成质量 | 人工评估或 LLM-as-Judge |

### 知识库更新

```
新增文档 → 切分 → 向量化 → 追加到向量数据库

修改文档 → 重新切分 → 重新向量化 → 更新向量数据库

删除文档 → 从向量数据库删除对应向量
```

## 小结

- RAG 的核心是"先检索，再生成"
- 文档切分质量直接影响检索效果
- 混合检索 + 重排序是当前最有效的检索策略
- 评估要覆盖检索和生成两个阶段

---

**下一篇**：[MCP 协议详解：AI 应用的 USB-C](/posts/ai/mcp)
