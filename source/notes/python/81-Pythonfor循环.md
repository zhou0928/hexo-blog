---
title: "Python for 循环"
tags: [流程控制]
group: 高级
date: 2026-09-10 00:00:00
---

# Python for 循环

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`for` 循环遍历任何可迭代对象，逐个取出元素执行循环体；它不是“计数循环”，而是“遍历循环”，配合 `range` 才做定次循环。

## 要点

- 语法：`for 变量 in 可迭代对象:` + 缩进循环体，没有 C 风格的三段式写法。
- 可遍历：列表、元组、字符串、字典、集合、`range`、文件对象、生成器等一切可迭代对象。
- `range(start, stop, step)` 生成整数序列，**左闭右开**，惰性求值不占内存。
- `for...else`：循环**没被 break** 正常跑完才执行 `else`，常用于“找有没有”。
- `break` 立即结束整个循环；`continue` 跳过本次剩余语句进入下一轮。
- `enumerate()` 同时拿索引和值；`zip()` 并行遍历多个序列（以最短为准）。
- 字典直接遍历得到**键**，要值用 `d.values()`，要键值对用 `d.items()`。
- 循环变量在循环结束后仍保留最后一次的值（Python 没有块级作用域）。
- 遍历时**不要修改**被遍历的容器，否则会漏元素或报错。
- 嵌套循环中 `break` 只跳出最内层。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `for x in it:` | 遍历可迭代对象 | `for c in 'abc':` |
| `for i in range(n):` | 0 到 n-1 | `range(3)` → 0,1,2 |
| `range(a, b)` | a 到 b-1 | `range(1, 4)` → 1,2,3 |
| `range(a, b, s)` | 带步长，s 可负 | `range(5, 0, -1)` |
| `for...else:` | 未 break 时执行 else | 查找场景 |
| `break` | 结束整个循环 | 提前退出 |
| `continue` | 跳过本次 | 过滤条件 |
| `enumerate(it, start=0)` | 索引 + 值 | `for i, v in enumerate(lst)` |
| `zip(a, b)` | 并行遍历，截断到最短 | `for x, y in zip(a, b)` |
| `reversed(seq)` | 反向遍历 | `for x in reversed(lst)` |
| `sorted(it)` | 遍历排序结果 | 不改原数据 |
| `d.items()` | 遍历字典键值对 | `for k, v in d.items()` |
| `for _ in range(n)` | 只重复 n 次 | `_` 表忽略变量 |
| 嵌套 for | 多层遍历 | 乘法表 |

## 代码示例

```python
# 1. 遍历序列与字符串
for fruit in ['苹果', '香蕉']:
    print(fruit)
for ch in 'abc':
    print(ch, end='-')          # a-b-c-
print()

# 2. range：左闭右开，支持反向与步长
for i in range(3):              # 0 1 2
    print(i, end=' ')
print()
for i in range(1, 10, 2):       # 1 3 5 7 9
    print(i, end=' ')
print()
for i in range(3, 0, -1):       # 3 2 1 倒计时
    print(i, end=' ')
print()

# 3. 遍历字典
d = {'a': 1, 'b': 2}
for k in d:                     # 默认遍历键
    print(k)
for k, v in d.items():          # 键值对
    print(k, v)

# 4. enumerate 取索引（比 range(len()) 优雅）
names = ['张三', '李四']
for i, name in enumerate(names, start=1):
    print(i, name)              # 1 张三 / 2 李四

# 5. zip 并行遍历，以最短截断
for n, s in zip(['A', 'B', 'C'], [90, 85]):
    print(n, s)                 # A 90 / B 85（C 被丢弃）

# 6. for...else：找质数之外常见于“查找”
target = 5
for x in [1, 3, 5, 7]:
    if x == target:
        print('找到', x)
        break
else:
    print('没找到')             # break 了就不执行

# 7. break / continue 配合
for i in range(10):
    if i % 2 == 0:
        continue                # 跳过偶数
    if i > 7:
        break                   # 到 9 前退出
    print(i, end=' ')           # 1 3 5 7
print()

# 8. 嵌套：只跳出最内层
for i in range(2):
    for j in range(2):
        if j == 1:
            break               # 只结束内层 j 循环
        print(i, j)
```

## 易错点

- `range` 左闭右开：`range(1, 5)` 是 1~4，想要 5 得写 `range(1, 6)`。
- `for...else` 的 `else` 是“没 break 才执行”，不是普通的“循环结束就执行”，语义容易记反。
- 遍历列表时 `remove()` 会跳过元素（索引前移），改遍历副本或在函数里构造新列表。
- 直接改循环变量不会影响原容器：`for x in lst: x = 0` 改的是副本引用。
- `zip` 遇到长度不等会**截断到最短**，数据对不齐时不报错，容易默默丢数据。
- 字典遍历顺序在现代 Python 里是插入顺序，但别依赖历史版本，需要顺序就显式 `sorted`。
- `break` 不跳出多层嵌套，跨层退出要用函数 `return` 或标志位。
