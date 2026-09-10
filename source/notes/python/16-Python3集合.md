---
title: "Python3 集合"
tags: [数据类型, 容器]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 集合

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
集合（set）是**无序、不重复**的元素集，用 `{}` 或 `set()` 定义，专为成员判断与去重设计，支持并、交、差等数学运算。

## 要点
- **去重**：自动移除重复元素；`set([1,1,2])` → `{1, 2}`。
- **无序**：不记录顺序，不能用下标访问，不能切片。
- **元素可哈希**：元素必须不可变且可哈希（列表不行，元组可以）。
- **空集合**：只能 `set()`，`{}` 是空**字典**。
- **成员判断快**：平均 O(1)，比列表 `in` 快很多。
- **可变集合 set vs 不可变 frozenset**：`frozenset` 可作字典键或集合元素。
- **原地运算有 `_update` 版本**：`difference_update`、`intersection_update` 等会直接改原集合。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `s = {1, 2, 3}` / `set(iter)` | 定义集合 | `set("abc")` → `{'a','b','c'}` |
| `s.add(x)` | 添加一个元素 | 已存在则无操作 |
| `s.update(iter)` | 批量添加 | `s.update([4,5])` |
| `s.remove(x)` | 删除元素，不存在报 KeyError | — |
| `s.discard(x)` | 删除元素，不存在不报错 | 更安全 |
| `s.pop()` | 随机删除并返回一个元素 | 集合空报 KeyError |
| `s.clear()` | 清空 | → `set()` |
| `s.copy()` | 浅拷贝 | — |
| `s.union(*others)` / `s \| t` | 并集 | `{1} \| {2}` → `{1,2}` |
| `s.intersection(t)` / `s & t` | 交集 | `{1,2} & {2,3}` → `{2}` |
| `s.difference(t)` / `s - t` | 差集（在 s 不在 t） | `{1,2} - {2}` → `{1}` |
| `s.symmetric_difference(t)` / `s ^ t` | 对称差（不同时在两者） | `{1,2} ^ {2,3}` → `{1,3}` |
| `s.issubset(t)` / `s <= t` | s 是否 t 的子集 | `{1} <= {1,2}` → True |
| `s.issuperset(t)` / `s >= t` | s 是否 t 的超集 | — |
| `s.isdisjoint(t)` | 两集合是否无交集 | 无交集 True |
| `s.difference_update(t)` | 原地做差集 | 修改 s |
| `s.intersection_update(t)` | 原地做交集 | 修改 s |
| `s.symmetric_difference_update(t)` | 原地对称差 | 修改 s |
| `x in s` | 成员判断（O(1)） | — |
| `len(s)` | 元素个数 | — |

## 代码示例

```python
# ---- 创建与去重 ----
s = {1, 2, 3}
print(s)                     # {1, 2, 3}
d = set([1, 1, 2, 3, 3])     # 去重
print(d)                     # {1, 2, 3}
empty = set()                # 空集合（不能用 {}）
print(type(empty))           # <class 'set'>

# ---- 增删 ----
s.add(4)
s.update([5, 6])
print(s)                     # {1, 2, 3, 4, 5, 6}
s.remove(6)
s.discard(99)                # 99 不存在，不报错
print(s)                     # {1, 2, 3, 4, 5}

# ---- 成员判断与去重应用 ----
nums = [1, 2, 2, 3, 3, 3]
print(list(set(nums)))       # [1, 2, 3]  快速去重（顺序不保证）
print(3 in s)                # True

# ---- 集合运算 ----
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)                 # {1,2,3,4,5,6}  并集
print(a & b)                 # {3,4}          交集
print(a - b)                 # {1,2}          差集
print(a ^ b)                 # {1,2,5,6}      对称差
print(a.union(b))            # 方法写法等价
print(a.intersection(b))

# ---- 子集 / 超集 ----
print({1, 2} <= a)           # True   子集
print(a >= {1, 2})           # True   超集
print(a.isdisjoint({9, 10})) # True   无交集

# ---- 原地运算 ----
c = {1, 2, 3}
c.difference_update({2})
print(c)                     # {1, 3}

# ---- frozenset 不可变 ----
fs = frozenset([1, 2, 3])
grid = {fs: "区域"}          # 可作字典键
print(grid[fs])              # 区域
```

## 易错点
- **空集合写成 `{}` 是错的**：`{}` 是空字典，空集合必须 `set()`。
- **集合无序**：不能 `s[0]`，也不能切片；要顺序请先 `sorted(s)`。
- **元素必须可哈希**：`{ [1,2] }` 报 `TypeError`（列表不可哈希）。
- **`remove` vs `discard`**：删不存在的元素，`remove` 报 KeyError，`discard` 静默。
- **`pop()` 是随机删**：不是删“第一个”，行为不可预期。
- **`set` 与 `frozenset`**：需要放字典键或另一个集合里时用 `frozenset`。
- **去重丢顺序**：`set` 不保留原序，需保序去重可用 `dict.fromkeys(lst)`。
- **运算符优先级**：混合 `| & -` 时按位运算符优先级，必要时加括号。
