---
title: "Python while 循环"
tags: [流程控制]
group: 高级
date: 2026-09-10 00:00:00
---

# Python while 循环

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`while` 在条件为真时反复执行循环体，是最基础的**条件循环**，关键是自己更新条件变量，否则死循环。

## 要点

- 语法：`while 条件:` + 缩进循环体，条件每轮开始前判断一次。
- 条件变量必须在循环体内更新，否则条件永远为真 → 死循环。
- `while True:` 是惯用的无限循环写法，靠内部 `break` 退出（如菜单循环）。
- `while...else`：循环**未被 break** 正常结束（条件变假）才执行 `else`。
- `break` 立即结束循环并**跳过 else**；`continue` 跳过本次剩余语句、回到条件判断。
- `while` 适合“次数未知、靠条件决定”的场景；次数已知优先用 `for`。
- Python 没有 `do...while`，可用 `while True:` + `break` 模拟“先执行后判断”。
- `else` 与 `break`：只要中途 `break`，`else` 就不会执行。
- 循环里用 `continue` 要特别小心：别把更新条件变量的语句跳过了。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `while cond:` | 条件为真时循环 | `while i < 5:` |
| 条件更新 | 循环体内改变量 | `i += 1` |
| `while True:` | 无限循环 + break | 菜单/轮询 |
| `while...else:` | 未 break 时执行 else | 正常结束分支 |
| `break` | 结束循环，跳过 else | 提前退出 |
| `continue` | 跳过本次回到判断 | 过滤 |
| `while a and b:` | 多条件 | 短路求值 |
| `while a or b:` | 任一为真 | 轮询 |
| 嵌套 while | 多层循环 | 九九乘法表 |
| 模拟 do-while | 先执行一次再判断 | `while True:` + `break` |
| `while 队列:` | 遍历到空 | 列表当栈/队列 |

## 代码示例

```python
# 1. 基础：计数循环（别忘 i += 1）
i = 1
while i <= 5:
    print(i, end=' ')          # 1 2 3 4 5
    i += 1                     # 更新条件变量，否则死循环
print()

# 2. while True + break：无限循环，靠条件退出
total = 0
n = 1
while True:
    total += n
    if n >= 4:
        break                  # n 到 4 时退出
    n += 1
print('总和', total)            # 1+2+3+4=10

# 3. while...else：未 break 才执行
count = 0
while count < 3:
    print('计数', count)
    count += 1
else:
    print('正常结束才会执行这里')   # 条件变假，执行

# 4. 带 break 的 while...else：else 被跳过
k = 0
while True:
    if k == 2:
        break                  # 有 break
    k += 1
else:
    print('不会执行')           # break 跳过了 else

# 5. 模拟 do-while：至少执行一次
num = 10
while True:
    print('至少执行一次:', num)   # 先执行
    num += 1
    if num > 10:               # 再判断
        break

# 6. continue：注意别跳过条件更新
j = 0
while j < 5:
    j += 1                     # 更新放最前，避免 continue 死循环
    if j == 3:
        continue               # 跳过打印 3
    print(j, end=' ')          # 1 2 4 5
print()

# 7. 用 while 遍历列表（当栈弹出）
stack = [1, 2, 3]
while stack:
    print('弹出', stack.pop())  # 3 2 1

# 8. 嵌套 while：打印直角三角形
row = 1
while row <= 3:
    col = 1
    while col <= row:
        print('*', end='')
        col += 1
    print()
    row += 1
```

## 易错点

- 忘记更新条件变量是头号死循环原因，用 Ctrl+C 才能中断。
- `continue` 放在条件更新之前，可能跳过 `i += 1`，直接死循环；更新语句尽量放循环体开头。
- `while...else` 的 else 是“没 break 才执行”，有 break 就跳过，别当成恒执行的收尾。
- 浮点比较做条件（如 `while x != 0.1`）可能因精度永不成立，改用大于/小于或整数计数。
- 循环里修改判断依赖的列表/字典，可能让条件突然变假或永不改变，注意状态一致性。
- `while True` 忘了写退出条件就是无限循环，确保每条路径最终都能 `break`。
- 条件表达式求值代价高时（如反复调用函数），可在循环内缓存结果，避免每轮重算。
