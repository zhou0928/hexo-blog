---
title: "Python 有用的资源"
tags: [参考]
group: 高级
date: 2026-09-10 00:00:00
---

# Python 有用的资源

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
把学 Python 常用的官方文档、中文教程、社区、练手平台与工具按类整理成一份清单，随查随用。

## 要点
- **官方文档最权威**：语法、标准库、版本变更都以官方为准，中文教程只作入门。
- **中文入门**：菜鸟教程、廖雪峰、Python 中文官网，适合零基础快速上手。
- **社区问答**：Stack Overflow、SegmentFault、V2EX，遇到报错先搜再问。
- **练手平台**：LeetCode、牛客、HackerRank，用刷题巩固语法与算法。
- **包管理**：PyPI 找库，pip 安装，GitHub 看源码与 issue。
- **常用工具**：Jupyter 做数据分析，VS Code / PyCharm 写项目，pandas/numpy 做数据处理。
- 资源不在多，在会用；收藏夹吃灰不如挑两三个吃透。

## 语法 / 常用资源

| 分类 | 资源 | 说明 |
|---|---|---|
| 官方 | python.org | Python 官网，文档与下载入口 |
| 官方 | docs.python.org/zh-cn/3/ | 官方中文文档，最权威 |
| 官方 | pypi.org | Python 包索引，找库、查版本 |
| 中文教程 | runoob.com/python3 | 菜鸟教程，入门速查 |
| 中文教程 | liaoxuefeng.com | 廖雪峰教程，讲解系统 |
| 社区 | stackoverflow.com | 英文问答，报错首选 |
| 社区 | github.com | 源码、issue、开源项目 |
| 刷题 | leetcode.cn | 算法与语法练习 |
| 刷题 | nowcoder.com | 牛客，含 Python 专项 |
| 数据 | jupyter.org | 交互式笔记本，数据分析常用 |
| 列表 | awesome-python (GitHub) | 精选 Python 库与框架合集 |
| 资讯 | realpython.com | 英文实战教程，质量高 |

## 代码示例

```python
# 用代码管理你的"资源书签"，顺便练习字典操作

resources = {
    "官方文档": ["https://docs.python.org/zh-cn/3/", "https://pypi.org"],
    "中文教程": ["https://www.runoob.com/python3/", "https://liaoxuefeng.com"],
    "社区问答": ["https://stackoverflow.com", "https://github.com"],
    "刷题平台": ["https://leetcode.cn", "https://www.nowcoder.com"],
}

# 1) 按分类列出所有资源
for category, links in resources.items():
    print(f"[{category}]")
    for link in links:
        print("  -", link)

# 2) 统计每个分类的资源数量
print("共", sum(len(v) for v in resources.values()), "条资源")
```

## 易错点
- 官方文档有版本区分，`2.x` 与 `3.x` 不通用，查资料先确认版本。
- 中文教程更新往往滞后，遇新特性（如 `match`、类型注解）仍要回官方文档。
- 直接复制网上代码要注意依赖版本，`pip install` 前先看库的文档。
- 报错信息不要整段贴给搜索引擎，先提取关键异常类型与函数名。
- 资源清单是起点不是终点，动手写代码比收藏一百个链接有用。
