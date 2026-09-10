---
title: "Python3 数据结构"
tags: [数据类型, 容器]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 数据结构

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

Python 的常用数据结构是列表、元组、集合、字典；本章重点补上栈、队列、推导式、遍历技巧等进阶用法。

## 要点

- **列表**：可变有序序列，用 `append` 当栈（后进先出）。
- **栈**：用列表 `append()` 入栈、`pop()` 出栈，高效 O(1)。
- **队列**：用 `collections.deque`，`append`/`popleft` 两端都是 O(1)；列表 `pop(0)` 是 O(n)。
- **元组**：不可变，可作字典键、可解包。
- **集合**：无序不重复，适合去重和集合运算。
- **字典**：键值映射，遍历用 `items()`、`keys()`、`values()`。
- 推导式（列表/字典/集合）是一行生成结构的惯用法。
- 遍历技巧：`enumerate` 取下标、`zip` 并行遍历、`reversed` 反向、`sorted` 排序。

## 语法 / 常用方法

| 结构/方法 | 说明 | 示例 |
|---|---|---|
| `list.append(x)` | 尾部追加（入栈） | `st.append(1)` |
| `list.pop()` | 弹出尾部（出栈） | `st.pop()` |
| `deque.appendleft(x)` | 队首入队 | `from collections import deque` |
| `deque.popleft()` | 队首出队 O(1) | `q.popleft()` |
| `set(seq)` | 去重 | `set([1,1,2])` → `{1,2}` |
| `a & b` / `a \| b` | 交集 / 并集 | `{1,2} & {2,3}` |
| `dict.items()` | 遍历键值对 | `for k, v in d.items():` |
| `enumerate(seq)` | 下标+值 | `for i, v in enumerate(seq):` |
| `zip(a, b)` | 并行遍历 | `for x, y in zip(a, b):` |
| `sorted(seq, key=, reverse=)` | 排序返回新列表 | `sorted(d, key=len)` |
| `[x for x in seq if ...]` | 列表推导式 | 过滤+变换 |
| `{k: v for ...}` | 字典推导式 | 生成字典 |

## 代码示例

```python
from collections import deque

# 1. 用列表当栈（后进先出）
stack = [3, 4, 5]
stack.append(6)          # 入栈
stack.append(7)
print(stack.pop())       # 7，出栈
print(stack)             # [3, 4, 5, 6]

# 2. 用 deque 当队列（先进先出）
queue = deque(["Eric", "John", "Michael"])
queue.append("Terry")    # 入队尾
queue.popleft()          # 出队首 -> Eric
print(queue)             # deque(['John', 'Michael', 'Terry'])

# 3. 推导式
squares = [x**2 for x in range(6)]        # [0,1,4,9,16,25]
evens = [x for x in squares if x % 2 == 0]
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [[row[i] for row in matrix] for i in range(3)]
print(transposed)        # [[1, 4], [2, 5], [3, 6]]

# 4. 字典推导式
d = {x: x**2 for x in range(4)}           # {0:0, 1:1, 2:4, 3:9}

# 5. 集合运算与去重
a, b = {1, 2, 3}, {2, 3, 4}
print(a & b)             # {2, 3}
print(a | b)             # {1, 2, 3, 4}
print(a - b)             # {1}
print(set([1, 1, 2, 3])) # {1, 2, 3} 去重

# 6. 遍历技巧
words = ["apple", "banana"]
for i, w in enumerate(words):
    print(i, w)          # 0 apple / 1 banana

names, ages = ["Tom", "Amy"], [20, 21]
for n, a in zip(names, ages):
    print(n, a)          # Tom 20 / Amy 21

for k, v in sorted(d.items(), key=lambda kv: kv[1], reverse=True):
    print(k, v)
```

## 易错点

- 列表 `pop(0)` 当队列是 O(n)，数据量大用 `deque`。
- 集合无序，不能用下标访问，也不能保证遍历顺序。
- `zip` 以最短序列为准，长度不齐会丢数据，必要时用 `itertools.zip_longest`。
- 字典在 Python 3.7+ 保留插入顺序，但别依赖它做逻辑。
- 推导式里变量会泄漏到外层作用域（Python 3 列表推导式不泄漏，但传统 `for` 会）。
- 集合元素必须可哈希，不能放列表/字典。
