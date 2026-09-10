---
title: "Python3 基本数据类型"
tags: [数据类型]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 基本数据类型

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
Python 有六种标准数据类型：不可变的数字、字符串、元组，和可变的列表、字典、集合。

## 要点
- **不可变（immutable）**：Number（数字）、String（字符串）、Tuple（元组）。改不了，改就是新建。
- **可变（mutable）**：List（列表）、Dictionary（字典）、Set（集合）。可原地修改。
- **数字类型**：`int` 整数、`float` 浮点、`bool` 布尔、`complex` 复数。
- **布尔是 int 子类**：`True == 1`、`False == 0`。
- **序列**：字符串、列表、元组都支持索引和切片。
- **索引**：从 0 开始，负数表示从末尾倒数（`-1` 是最后一个）。
- **切片**：`[start:stop:step]`，左闭右开。
- **查看类型**：`type()` 看类型，`isinstance()` 判断是否属于某类型。

## 语法 / 常用方法

| 类型 | 说明 | 示例 | 可变 |
|---|---|---|---|
| `int` | 整数 | `x = 10` | 否 |
| `float` | 浮点数 | `pi = 3.14` | 否 |
| `complex` | 复数 | `c = 1 + 2j` | 否 |
| `bool` | 布尔 | `ok = True` | 否 |
| `str` | 字符串 | `s = "abc"` | 否 |
| `list` | 列表 | `l = [1, 2, 3]` | 是 |
| `tuple` | 元组 | `t = (1, 2, 3)` | 否 |
| `dict` | 字典 | `d = {"a": 1}` | 是 |
| `set` | 集合 | `s = {1, 2, 3}` | 是 |
| `type()` | 查类型 | `type(3)` | - |
| `isinstance()` | 类型判断 | `isinstance(3, int)` | - |

## 代码示例

```python
# 数字
a = 10                # int
b = 3.14              # float
c = 1 + 2j            # complex
d = True              # bool
print(a, b, c, d)
print(type(a), type(b), type(c), type(d))

# 字符串（不可变）
s = "Python"
print(s[0], s[-1])       # P n
print(s[1:4])            # yth  左闭右开
# s[0] = "J"             # 报错：字符串不可变

# 列表（可变）
lst = [1, 2, 3]
lst[0] = 100             # 可以改
lst.append(4)            # 追加
print(lst)               # [100, 2, 3, 4]

# 元组（不可变）
tup = (1, 2, 3)
print(tup[1])
# tup[0] = 9             # 报错：元组不可变

# 字典（键值对，键必须可哈希）
person = {"name": "小明", "age": 18}
person["age"] = 19       # 修改
person["city"] = "北京"  # 新增
print(person)

# 集合（无序、不重复）
tags = {1, 2, 2, 3}      # 重复的 2 自动去重
print(tags)              # {1, 2, 3}

# 类型判断
print(isinstance(a, int))        # True
print(isinstance(d, int))        # True（bool 是 int 子类）
print(True == 1, False == 0)     # True True
```

## 易错点
- **元组的元组要加逗号**：`t = (1,)` 才是单元素元组，`t = (1)` 只是整数 1。
- **可变默认值陷阱**：函数默认参数写 `[]` 或 `{}` 会跨调用共享，建议用 `None`。
- **空集合用 `set()`**：`{}` 是空字典，不是空集合。
- **字典键不可变**：列表不能当键，会报 `TypeError: unhashable type`。
- **字符串/元组不能改**：试图赋值会报 `TypeError`，要改只能生成新对象。
- **`bool` 参与运算**：`True + 1 == 2`，别被 `True == 1` 迷惑。
