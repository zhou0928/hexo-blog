---
title: "Python3 operator"
tags: [数学与随机]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 operator

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`operator` 模块把 Python 的各种运算符封装成函数，便于配合 `map`、`sorted`、`reduce` 等使用。

## 要点
- 运算符本身不能当参数传，`operator` 提供对应的函数形式，解决这个限制。
- 常用等价：`+` → `add`、`-` → `sub`、`*` → `mul`、`==` → `eq`、`<` → `lt`。
- 排序取值神器 `itemgetter` / `attrgetter`，比手写 `lambda x: x[1]` 更快更清晰。
- `methodcaller` 可调用对象的方法，如 `methodcaller("upper")`。
- `operator.add` 等函数在 `reduce`、`map` 里配合使用非常顺手。
- 是 C 实现，性能通常优于等价的 `lambda`。

## 语法 / 常用方法

| 函数 | 等价运算符 | 说明 |
|---|---|---|
| `add(a, b)` | `a + b` | 加 |
| `sub(a, b)` | `a - b` | 减 |
| `mul(a, b)` | `a * b` | 乘 |
| `truediv(a, b)` | `a / b` | 真除 |
| `floordiv(a, b)` | `a // b` | 整除 |
| `mod(a, b)` | `a % b` | 取模 |
| `pow(a, b)` | `a ** b` | 幂 |
| `neg(a)` | `-a` | 取负 |
| `eq(a, b)` / `ne(a, b)` | `==` / `!=` | 等于 / 不等于 |
| `lt` / `le` / `gt` / `ge` | `<` `<=` `>` `>=` | 大小比较 |
| `and_(a, b)` / `or_(a, b)` / `not_(a)` | `and` / `or` / `not` | 逻辑 |
| `itemgetter(k)` | `x[k]` | 取下标/键，可多参 |
| `attrgetter("name")` | `x.name` | 取属性，支持点号路径 |
| `methodcaller("m", ...)` | `x.m(...)` | 调用方法 |
| `contains(seq, x)` | `x in seq` | 成员判断 |
| `concat(a, b)` | `a + b` | 序列拼接 |
| `length_hint(it)` | 约等于 `len` | 估算长度 |

## 代码示例

```python
import operator as op
from functools import reduce

# 1) 运算符当函数用
print(op.add(3, 4), op.mul(3, 4), op.pow(2, 5))   # 7 12 32
print(op.eq(1, 1), op.lt(1, 2), op.contains([1, 2], 2))  # True True True

# 2) 配合 reduce 求积
nums = [1, 2, 3, 4, 5]
print(reduce(op.mul, nums))            # 120
print(reduce(op.add, nums, 100))       # 115（带初始值）

# 3) itemgetter 排序：按第 2 个元素
rows = [("Tom", 90), ("Jerry", 85), ("Lucy", 95)]
rows.sort(key=op.itemgetter(1))        # 按分数升序
print(rows)                            # [('Jerry',85), ('Lucy',95), ('Tom',90)]

# 多级排序：先按组，再按分
data = [("A", 2), ("B", 1), ("A", 1)]
data.sort(key=op.itemgetter(0, 1))
print(data)                            # [('A',1), ('A',2), ('B',1)]

# 4) attrgetter 按对象属性排序
class User:
    def __init__(self, name, age):
        self.name, self.age = name, age

users = [User("Tom", 30), User("Amy", 22)]
users.sort(key=op.attrgetter("age"))
print([u.name for u in users])         # ['Amy', 'Tom']

# 5) methodcaller 调用方法
upper = op.methodcaller("upper")
print(list(map(upper, ["a", "b"])))    # ['A', 'B']
```

## 易错点
- `itemgetter` 传一个键返回单值，传多个键返回元组，用于多级排序。
- 逻辑运算函数带下划线：`and_`、`or_`、`not_`，因为 `and` 是关键字不能当函数名。
- `attrgetter` 支持点号路径，如 `"info.name"`，但属性不存在会直接报 `AttributeError`。
- `truediv` 与 `floordiv` 别搞混：前者是 `/`，后者是 `//`。
- 排序时 `key=op.itemgetter(1)` 只对序列用，字典排序要用 `key` 指定键或先转项。
- 别为了用 `operator` 而用，只有比 `lambda` 更清晰或更快时才换。
