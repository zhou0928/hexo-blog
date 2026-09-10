---
title: "Python statistics"
tags: [数学与随机]
group: 高级
date: 2026-09-10 00:00:00
---

# Python statistics

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`statistics` 是标准库里的统计模块，直接对序列算平均值、中位数、方差、标准差等，不用装第三方库。

## 要点
- 标准库自带，`import statistics` 即可，无需 `pip install`。
- 面向小数据、教学与精确计算；超大数组或矩阵运算用 `numpy` 更快。
- 整数输入尽量返回精确结果（如中位数可能是 `Fraction`）。
- 区分**总体**（`p*`，分母 n）与**样本**（`pstdev`/`variance` 之外，分母 n-1）统计量。
- `median_low` / `median_high` 在偶数个元素时返回不同侧的中位数。
- 支持权重版：`fmean`（加权均值）、`quantiles`（分位数）。

## 语法 / 常用方法

| 方法 | 说明 | 示例 |
|---|---|---|
| `mean(data)` | 算术平均 | `mean([1,2,3])` → `2` |
| `fmean(data)` | 浮点快速平均，支持权重 | `fmean([1,2,3])` → `2.0` |
| `median(data)` | 中位数，偶数取两数平均 | `median([1,2,3,4])` → `2.5` |
| `median_low(data)` | 偶数时取较小中位数 | `median_low([1,2,3,4])` → `2` |
| `median_high(data)` | 偶数时取较大中位数 | `median_high([1,2,3,4])` → `3` |
| `mode(data)` | 众数（出现最多） | `mode([1,1,2])` → `1` |
| `multimode(data)` | 所有众数，返回列表 | `multimode([1,1,2,2])` → `[1,2]` |
| `pstdev(data)` | 总体标准差（分母 n） | 整体数据离散度 |
| `stdev(data)` | 样本标准差（分母 n-1） | 抽样数据离散度 |
| `pvariance(data)` | 总体方差 | `pstdev` 的平方 |
| `variance(data)` | 样本方差 | `stdev` 的平方 |
| `quantiles(data, n)` | 分成 n 段的分位点 | `quantiles(data, n=4)` |
| `harmonic_mean(d)` | 调和平均 | 平均速度等场景 |
| `geometric_mean(d)` | 几何平均 | 增长率、比率 |

## 代码示例

```python
import statistics as st

data = [2, 4, 4, 4, 5, 5, 7, 9]      # 8 个数，含重复

# 1) 三种"平均"
print(st.mean(data))                 # 5.0   算术平均
print(st.median(data))               # 4.5   中位数 (4+5)/2
print(st.mode(data))                 # 4     众数

# 2) 离散程度
print(round(st.pstdev(data), 3))     # 2.0   总体标准差（分母 n）
print(round(st.stdev(data), 3))      # 2.138 样本标准差（分母 n-1）
print(round(st.pvariance(data), 3))  # 4.0   总体方差
print(round(st.variance(data), 3))   # 4.571 样本方差

# 3) 偶数个元素的中位数两侧
even = [1, 2, 3, 4]
print(st.median_low(even), st.median_high(even))  # 2 3

# 4) 分位数：四分位（25%/50%/75%）
print(st.quantiles(data, n=4))       # [3.5, 4.5, 6.0]

# 5) 加权平均
values, weights = [90, 60, 100], [1, 1, 2]
print(st.fmean(values, weights))     # 87.5  (90+60+100*2)/4
```

## 易错点
- `stdev`（样本，分母 n-1）与 `pstdev`（总体，分母 n）结果不同，按数据性质选。
- `mode` 在 Python 3.8+ 返回第一个众数；要全部众数用 `multimode`。
- 空序列会抛 `StatisticsError`，算之前先判空。
- 只有一个数据时算 `stdev` / `variance` 会报错（分母为 0）。
- `mean` 返回可能是整数或 `Fraction`，需要小数时用 `fmean` 或 `float()`。
- 大数组性能不行，动辄百万级数据请改用 `numpy`。
