---
title: "Python3 列表"
tags: [数据类型, 容器]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 列表

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
列表（list）是有序、可变、可重复、可混合类型的序列，用方括号 `[]` 定义，是 Python 最常用的容器。

## 要点
- **有序 + 可变**：元素按插入顺序排列，可增删改；支持索引、切片、拼接。
- **可异构**：同一列表可放不同类型，甚至嵌套列表。
- **索引/切片**：与字符串一致，左闭右开；切片返回**新列表**（浅拷贝）。
- **增删改查**：`append`/`extend`/`insert` 增；`remove`/`pop`/`del`/`clear` 删；`a[i] = x` 改。
- **排序**：`sort()` 原地排序，`sorted()` 返回新列表；`reverse()` 原地反转。
- **引用语义**：`b = a` 是别名（同一对象）；`b = a.copy()` 或 `a[:]` 才是浅拷贝。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `lst[i]` / `lst[a:b]` | 索引 / 切片 | `[1,2,3][1:]` → `[2,3]` |
| `lst.append(x)` | 末尾追加**一个**元素 | `a.append([4,5])` 追加嵌套列表 |
| `lst.extend(iter)` | 末尾逐一追加可迭代对象元素 | `a.extend([4,5])` |
| `lst.insert(i, x)` | 在下标 i 前插入 x | `[1,3].insert(1,2)` → `[1,2,3]` |
| `lst.remove(x)` | 删除**第一个**值为 x 的元素 | 找不到报 ValueError |
| `lst.pop([i])` | 删除并返回下标 i（默认末尾） | `a.pop()` 弹最后 |
| `lst.clear()` | 清空所有元素 | `a.clear()` → `[]` |
| `del lst[i]` | 删除下标 i 的元素（语句） | `del a[0]` |
| `lst.index(x)` | 返回首个 x 的下标 | 找不到报 ValueError |
| `lst.count(x)` | x 出现次数 | `[1,1,2].count(1)` → 2 |
| `lst.sort(key=, reverse=)` | 原地排序 | `a.sort(reverse=True)` |
| `lst.reverse()` | 原地反转 | `[1,2].reverse()` → `[2,1]` |
| `lst.copy()` | 浅拷贝 | 等价 `lst[:]` |
| `len(lst)` | 元素个数 | `len([1,2,3])` → 3 |
| `x in lst` | 是否包含 | `2 in [1,2]` → True |
| `lst1 + lst2` | 拼接成新列表 | `[1] + [2]` → `[1,2]` |
| `lst * n` | 重复 n 次 | `[0] * 3` → `[0,0,0]` |
| `sorted(lst)` | 返回排序后的新列表 | 原列表不变 |
| `lst[a:b] = iter` | 切片赋值（可改长度） | `a[1:3] = [9]` |

## 代码示例

```python
# ---- 创建 ----
nums = [1, 2, 3, 4, 5]
mixed = [1, "a", 3.14, [7, 8]]   # 允许异构与嵌套

# ---- 索引 / 切片 ----
print(nums[0], nums[-1])   # 1 5
print(nums[1:4])           # [2, 3, 4]
print(nums[::-1])          # [5, 4, 3, 2, 1]  反转

# ---- 增 ----
nums.append(6)             # 末尾加一个 -> [1,2,3,4,5,6]
nums.extend([7, 8])        # 逐一追加 -> ...7,8
nums.insert(0, 0)          # 头部插入 0
print(nums)                # [0,1,2,3,4,5,6,7,8]

# ---- 删 ----
nums.remove(0)             # 删除值 0
last = nums.pop()          # 弹出末尾 8
del nums[0]                # 删除下标 0
print(nums, last)          # [1,2,3,4,5,6] 8

# ---- 改 ----
nums[0] = 100
nums[1:3] = [200]          # 切片赋值，长度可不同
print(nums)                # [100, 200, 4, 5, 6]

# ---- 查 ----
print(nums.index(200))     # 1
print(nums.count(5))       # 1
print(5 in nums)           # True

# ---- 排序 ----
data = [3, 1, 2]
data.sort()                # 原地升序
print(data)                # [1, 2, 3]
data.sort(reverse=True)    # 原地降序
print(data)                # [3, 2, 1]
print(sorted([3, 1, 2], key=abs))   # 返回新列表，可自定义 key

# ---- 引用 vs 拷贝 ----
a = [1, 2, 3]
b = a            # 别名，同一对象
c = a.copy()     # 浅拷贝
b.append(4)
print(a, c)      # [1,2,3,4] [1,2,3]   a 被 b 改了，c 没变

# ---- 列表推导式（详见推导式篇）----
squares = [x * x for x in range(5)]
print(squares)   # [0, 1, 4, 9, 16]
```

## 易错点
- **`append` vs `extend`**：`append([4,5])` 把整个列表当一个元素；`extend([4,5])` 逐个加。
- **`b = a` 是别名**：改 `b` 会改 `a`；要独立副本用 `a.copy()`、`a[:]` 或 `list(a)`。
- **浅拷贝的坑**：嵌套列表只复制外层，内层仍共享，深拷贝用 `copy.deepcopy()`。
- **`remove` 按值删，只删第一个**；按下标删用 `pop(i)` 或 `del`。
- **`sort()` 返回 None**：`a = a.sort()` 会把 `a` 变成 `None`，别接返回值。
- **遍历时增删**：边 `for` 边 `remove` 会跳元素，改用推导式或倒序遍历。
- **切片越界不报错**，但索引越界报 `IndexError`。
- **混合类型排序会报错**：`[1, "a"].sort()` 抛 `TypeError`（不可比较）。
