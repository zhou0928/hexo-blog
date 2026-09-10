---
title: "Python random"
tags: [数学与随机]
group: 高级
date: 2026-09-10 00:00:00
---

# Python random

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`random` 是标准库随机数模块，用于生成随机数、随机选择、随机打乱序列。

## 要点
- 生成的是伪随机数，底层用梅森旋转算法。
- `random()` 返 `[0.0, 1.0)` 的浮点；`randint(a, b)` 返闭区间整数。
- `choice` 选一个、`choices` 选多个（可重复）、`sample` 选多个（不重复）。
- `shuffle` 原地打乱列表，无返回值。
- `seed(n)` 固定随机种子，让结果可复现，调试和测试常用。
- 安全场景（密码、令牌）不要用 `random`，改用 `secrets` 模块。

## 语法 / 常用方法

| 方法 | 说明 | 示例 |
|---|---|---|
| `random.random()` | `[0.0, 1.0)` 浮点 | `0.548813...` |
| `random.uniform(a, b)` | `[a, b]` 浮点 | `uniform(1, 5)` |
| `random.randint(a, b)` | `[a, b]` 整数（含两端） | `randint(1, 6)` |
| `random.randrange(a, b, step)` | `range` 里随机取 | `randrange(0, 10, 2)` |
| `random.choice(seq)` | 随机取一个元素 | `choice(["A", "B"])` |
| `random.choices(seq, k=n)` | 取 n 个，可重复，可加权 | `choices([1,2], k=3)` |
| `random.sample(seq, k=n)` | 取 n 个，不重复 | `sample(range(10), 3)` |
| `random.shuffle(lst)` | 原地打乱 | `shuffle(cards)` |
| `random.seed(n)` | 设随机种子 | `seed(42)` |
| `random.gauss(mu, sigma)` | 正态分布 | `gauss(0, 1)` |
| `random.getrandbits(k)` | k 位随机整数 | `getrandbits(8)` |

## 代码示例

```python
import random

# 固定种子，结果可复现
random.seed(42)
print(random.random())            # 每次运行都是 0.639426...

# 随机整数、浮点
print(random.randint(1, 6))       # 掷骰子，1~6 含两端
print(random.uniform(1.0, 5.0))   # 1.0~5.0 之间的浮点
print(random.randrange(0, 10, 2)) # 从 0,2,4,6,8 里取

# 从序列随机选择
fruits = ["apple", "banana", "cherry"]
print(random.choice(fruits))            # 选一个
print(random.choices(fruits, k=5))      # 选 5 个，可重复
print(random.sample(fruits, k=2))       # 选 2 个，不重复

# 加权随机（权重可不等）
print(random.choices(["A", "B", "C"], weights=[1, 1, 8], k=10))  # C 更可能

# 打乱列表（原地修改，无返回值）
nums = [1, 2, 3, 4, 5]
random.shuffle(nums)
print(nums)                       # 顺序被打乱

# 抽奖：从 100 人中抽 3 个不重复的幸运儿
winners = random.sample(range(1, 101), 3)
print(winners)

# 正态分布随机数
print(round(random.gauss(0, 1), 3))
```

## 易错点
- `randint(a, b)` 两端都包含，`range(a, b)` 不包含，`randrange` 与 `range` 规则一致。
- `shuffle` 原地修改且返回 `None`，写 `nums = random.shuffle(nums)` 会把列表变 `None`。
- `sample` 的 `k` 不能大于序列长度，否则抛 `ValueError`；`choices` 的 `k` 无此限制。
- `seed` 只需设一次，重复设种子会让随机退化，失去随机意义。
- 涉及安全（验证码、密钥、令牌）必须用 `secrets`，`random` 可被预测。
- 多进程里各自 `random` 可能产生相同序列，用进程独立种子或用 `numpy.random`。
