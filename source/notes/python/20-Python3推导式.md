---
title: "Python3 推导式"
tags: [流程控制]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 推导式

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
推导式（comprehension）用一行表达式从可迭代对象快速生成**列表 / 字典 / 集合 / 生成器**，比手写循环更简洁、通常更快。

## 要点
- **四种形态**：列表 `[]`、字典 `{k:v}`、集合 `{}`、生成器 `()`。
- **基本结构**：`[表达式 for 变量 in 可迭代对象 if 条件]`。
- **条件过滤**：`if` 放在 `for` 后，只保留满足条件的元素。
- **条件表达式**：`if...else` 放在 `for` **前**，对每个元素二选一。
- **多重循环**：`for` 可并列，等价嵌套循环。
- **生成器推导式**：用圆括号，惰性求值，省内存，适合大数据或一次性遍历。
- **作用域**：Python 3 中推导式有独立作用域，循环变量不会泄漏到外部。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `[f(x) for x in it]` | 列表推导式 | `[x*2 for x in range(3)]` → `[0,2,4]` |
| `[x for x in it if cond]` | 带过滤 | `[x for x in range(5) if x%2]` |
| `[a if c else b for x in it]` | 三选一表达式 | `["偶" if x%2==0 else "奇" for x in range(2)]` |
| `{k: v for x in it}` | 字典推导式 | `{x: x*x for x in range(3)}` |
| `{f(x) for x in it}` | 集合推导式（自动去重） | `{x%3 for x in range(6)}` |
| `(f(x) for x in it)` | 生成器推导式（惰性） | `sum(x for x in range(100))` |
| `[x for a in A for x in a]` | 多重循环（笛卡尔积） | 等价两层 for |
| `[[...] for x in it]` | 嵌套推导式 | 生成矩阵 |
| `enumerate()` / `zip()` | 可放进推导式 | `{i: v for i, v in enumerate(lst)}` |

## 代码示例

```python
# ---- 列表推导式 ----
squares = [x * x for x in range(6)]
print(squares)                # [0, 1, 4, 9, 16, 25]

# ---- 带条件过滤 ----
evens = [x for x in range(10) if x % 2 == 0]
print(evens)                  # [0, 2, 4, 6, 8]

# ---- 条件表达式（注意位置：for 前）----
labels = ["偶" if x % 2 == 0 else "奇" for x in range(4)]
print(labels)                 # ['偶', '奇', '偶', '奇']

# ---- 对字符串操作 ----
words = ["hello", "world"]
print([w.upper() for w in words])   # ['HELLO', 'WORLD']

# ---- 多重循环（笛卡尔积）----
pairs = [(i, j) for i in range(2) for j in range(2)]
print(pairs)                  # [(0,0), (0,1), (1,0), (1,1)]

# ---- 嵌套推导式（矩阵）----
matrix = [[i * j for j in range(3)] for i in range(3)]
print(matrix)                 # [[0,0,0], [0,1,2], [0,2,4]]

# ---- 字典推导式 ----
d = {x: x * x for x in range(4)}
print(d)                      # {0: 0, 1: 1, 2: 4, 3: 9}

# 交换键值
original = {"a": 1, "b": 2}
swapped = {v: k for k, v in original.items()}
print(swapped)                # {1: 'a', 2: 'b'}

# 用 enumerate 建索引字典
fruits = ["苹果", "香蕉"]
indexed = {i: f for i, f in enumerate(fruits)}
print(indexed)                # {0: '苹果', 1: '香蕉'}

# ---- 集合推导式（自动去重）----
mods = {x % 3 for x in range(10)}
print(mods)                   # {0, 1, 2}（顺序不定）

# ---- 生成器推导式（惰性）----
gen = (x * x for x in range(5))
print(gen)                    # <generator object ...>
print(next(gen), next(gen))   # 0 1
print(sum(x for x in range(101)))   # 5050，省内存
print(list(x * 2 for x in range(3)))  # [0, 2, 4]

# ---- 推导式有独立作用域 ----
x = 100
nums = [x for x in range(3)]
print(x, nums)                # 100 [0, 1, 2]，x 未被覆盖
```

## 易错点
- **`if` 和 `if...else` 位置不同**：过滤 `if` 在 `for` 后；二选一表达式在 `for` 前。
- **过度使用降低可读性**：复杂逻辑写成普通循环更好，别为了一行硬塞。
- **生成器只能用一次**：`(x for x in ...)` 遍历完就空，要重复用请转 `list()`。
- **集合推导式无序**：结果顺序不保证；要顺序请用列表推导式。
- **推导式变量作用域**：Python 3 不泄漏循环变量，但同名外部变量不受影响（易误解）。
- **别在推导式里做副作用**：如修改外部列表，违背可读性与函数式初衷。
- **字典推导式键冲突**：后面的键覆盖前面的，别依赖重复键。
- **性能**：多数场景推导式比手写 `append` 循环略快，但极端复杂时差异可忽略。
