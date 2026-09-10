---
title: "Python3 循环语句"
tags: [流程控制]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 循环语句

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用 `while`（条件循环）和 `for`（遍历循环）重复执行代码，`break` 跳出、`continue` 跳过本次，循环还可带 `else` 分支。

## 要点
- **`while`**：条件为真就一直循环，记得更新条件变量，否则死循环。
- **`for`**：遍历任何可迭代对象（列表、字符串、range、字典…），不需下标。
- **`range(start, stop, step)`**：左闭右开，生成整数序列，不真正建列表。
- **`break`**：立即结束整个循环。
- **`continue`**：跳过后面的语句，进入下一次迭代。
- **`pass`**：空语句占位，什么也不做。
- **`else` 子句**：循环**未被 break** 正常结束时执行；被 break 则跳过。
- **`for...else` 惯用法**：常用于“找没找到”的场景。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `while cond:` | 条件循环 | 需自行改变条件变量 |
| `for x in iterable:` | 遍历循环 | `for c in "abc":` |
| `range(stop)` | 0 到 stop-1 | `range(3)` → 0,1,2 |
| `range(start, stop)` | start 到 stop-1 | `range(1, 4)` → 1,2,3 |
| `range(start, stop, step)` | 带步长 | `range(0, 10, 2)` |
| `break` | 结束整个循环 | — |
| `continue` | 跳过本次剩余语句 | — |
| `pass` | 占位空语句 | — |
| `for...else` / `while...else` | 未 break 时执行 else | 判断是否找到 |
| `enumerate(iter)` | 同时取索引和值 | `for i, v in enumerate(lst)` |
| `zip(a, b)` | 并行遍历多个序列 | `for x, y in zip(a, b)` |
| `while True:` | 无限循环（配合 break） | 常见菜单循环 |
| `reversed(seq)` | 反向遍历 | `for x in reversed(lst)` |
| `sorted(iter)` | 遍历排序结果 | 不改原数据 |

## 代码示例

```python
# ---- while 循环 ----
count = 1
while count <= 5:
    print(count, end=" ")
    count += 1          # 别忘了自增，否则死循环
print()                 # 1 2 3 4 5

# ---- for + range ----
for i in range(3):
    print(i, end=" ")   # 0 1 2
print()
for i in range(2, 8, 2):
    print(i, end=" ")   # 2 4 6
print()

# ---- 遍历序列 ----
fruits = ["苹果", "香蕉", "橙子"]
for f in fruits:
    print(f)
for c in "abc":
    print(c, end="-")   # a-b-c-
print()

# ---- enumerate 取索引 ----
for idx, name in enumerate(fruits):
    print(idx, name)

# ---- zip 并行遍历 ----
names = ["张三", "李四"]
scores = [90, 85]
for n, s in zip(names, scores):
    print(n, s)

# ---- break / continue ----
for i in range(10):
    if i == 3:
        continue        # 跳过 3
    if i == 7:
        break           # 到 7 结束
    print(i, end=" ")   # 0 1 2 4 5 6
print()

# ---- for...else：未 break 才执行 ----
target = 5
for x in [1, 3, 5, 7]:
    if x == target:
        print("找到了", x)
        break
else:
    print("没找到")     # 找到时被执行 break，else 不执行

# ---- while True + break 菜单 ----
total = 0
while True:
    n = 3          # 模拟输入
    if n == 0:
        break
    total += n
    if total > 6:
        break
print("合计", total)

# ---- 嵌套循环 ----
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}*{j}={i*j}", end="  ")
    print()             # 换行
```

## 易错点
- **while 忘记自增**：条件永远为真 → 死循环，用 Ctrl+C 终止。
- **`range` 左闭右开**：`range(1, 5)` 是 1~4，不含 5。
- **`for...else` 语义反直觉**：`else` 在**没有** break 时执行，不是“循环结束就执行”的普通 else。
- **遍历时修改列表**：边 `for` 边 `remove` 会漏元素，改遍历副本或倒序。
- **`break` 只跳出最内层**：嵌套循环要跳出多层需用标志位或函数 `return`。
- **`continue` 更新变量位置**：`while` 里若 `continue` 跳过了 `i += 1`，会死循环。
- **不可变对象占用**：`for` 遍历时给循环变量重新赋值不改原序列。
