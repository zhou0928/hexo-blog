---
title: "Python3 内置函数"
tags: [函数, 参考]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 内置函数

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
Python 解释器自带、无需 import 即可直接调用的一批函数，覆盖类型转换、迭代、运算、反射等日常操作。

## 要点
- 内置函数随解释器启动就可用，属于 `builtins` 模块，共约 68 个。
- 按用途大致分七类：类型转换、数学运算、序列/迭代、输入输出、对象操作、反射判断、高阶函数。
- 常用的只有二三十个，先把这些用熟，其余用到再查。
- `help(函数名)` 可查看任意内置函数的说明。
- 多数内置函数是 C 实现，比手写循环快，优先用它而不是自己造轮子。

## 语法 / 常用方法

| 分类 | 函数 | 说明 |
|---|---|---|
| 类型转换 | `int(x)` / `float(x)` / `str(x)` / `bool(x)` | 基础类型互转 |
| 类型转换 | `list(s)` / `tuple(s)` / `set(s)` / `dict(...)` | 容器互转，set 自动去重 |
| 数学 | `abs(n)` | 绝对值 |
| 数学 | `round(n, d)` | 四舍五入到 d 位小数 |
| 数学 | `pow(a, b)` / `divmod(a, b)` | 幂 / 返回 (商, 余) |
| 数学 | `max(it)` / `min(it)` / `sum(it)` | 最大 / 最小 / 求和 |
| 序列迭代 | `len(s)` | 元素个数 |
| 序列迭代 | `range(a, b, step)` | 生成整数序列 |
| 序列迭代 | `enumerate(it, start)` | 返回 (索引, 值) |
| 序列迭代 | `zip(*its)` | 多序列按位配对 |
| 序列迭代 | `sorted(it, key=, reverse=)` / `reversed(s)` | 排序 / 反转 |
| 高阶函数 | `map(f, it)` | 对每个元素应用 f |
| 高阶函数 | `filter(f, it)` | 保留 f 为真的元素 |
| 高阶函数 | `any(it)` / `all(it)` | 任一为真 / 全部为真 |
| 输入输出 | `print(*objs, sep=, end=)` | 打印 |
| 输入输出 | `input(prompt)` | 读取一行字符串 |
| 输入输出 | `open(file, mode)` | 打开文件 |
| 反射判断 | `type(obj)` / `isinstance(obj, cls)` | 类型 / 类型判断 |
| 反射判断 | `hasattr` / `getattr` / `setattr` | 属性操作 |
| 反射判断 | `dir(obj)` | 列出属性和方法 |
| 对象操作 | `id(obj)` | 内存地址标识 |
| 对象操作 | `repr(obj)` | 解释器可读的字符串 |
| 对象操作 | `hash(obj)` | 哈希值，可哈希才能做字典键 |

## 代码示例

```python
# 类型转换
print(int("42"), float("3.14"), str(100), bool(0))  # 42 3.14 100 False

# 数学
print(abs(-7), round(3.14159, 2), pow(2, 10), divmod(17, 5))  # 7 3.14 1024 (3, 2)
print(max([3, 1, 4]), min([3, 1, 4]), sum([1, 2, 3]))          # 4 1 6

# 序列与迭代
for i, v in enumerate(["a", "b"], start=1):
    print(i, v)                    # 1 a / 2 b
print(list(zip([1, 2], ["x", "y"])))   # [(1, 'x'), (2, 'y')]
print(sorted([3, 1, 2], reverse=True)) # [2, 1, 3]（不会改原列表）

# 高阶函数
nums = [1, 2, 3, 4]
print(list(map(lambda x: x * x, nums)))     # [1, 4, 9, 16]
print(list(filter(lambda x: x % 2 == 0, nums)))  # [2, 4]
print(any(x > 3 for x in nums), all(x > 0 for x in nums))  # True True

# 反射
s = "hello"
print(type(s), isinstance(s, str), hasattr(s, "upper"))  # <class 'str'> True True
print(len(s), list(reversed(s)))  # 5 ['o', 'l', 'l', 'e', 'h']
```

## 易错点
- `sort()` 是列表方法会原地修改，`sorted()` 是内置函数返回新列表，别混用。
- `input()` 永远返回字符串，要数字得自己 `int()` 转换。
- `round()` 用的是银行家舍入，`round(2.5)` 得 2 不是 3，涉及金额别依赖它。
- `map` / `filter` / `zip` 返回的是迭代器，只能遍历一次，需要重复用要先 `list()` 固化。
- `bool(0)`、`bool("")`、`bool([])`、`bool(None)` 都是 `False`，空即假。
- `max()` / `min()` 传的是可迭代对象（一个参数）或多值（多个参数），别写错形式。
