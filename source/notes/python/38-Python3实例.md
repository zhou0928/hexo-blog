---
title: "Python3 实例"
tags: [参考]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 实例

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

一组经典入门小例子，覆盖判断、循环、字符串、容器、递归等核心语法，是检验基础是否扎实的试金石。

## 要点

- 经典例子包括：九九乘法表、斐波那契、质数判断、阶乘、回文/反转、猜数字、汉诺塔、水仙花数。
- 每个例子都练到「变量、分支、循环、函数、容器」这几块基础，写熟就掌握了入门语法。
- 优先理解思路，再动手默写，比死记代码有效。
- 可以尝试用多种写法（循环 / 递归 / 推导式）实现同一个问题。

## 语法 / 常用方法

| 例子 | 核心语法 | 关键点 |
|---|---|---|
| 九九乘法表 | 嵌套 for + 格式化 | 内层循环范围随外层变化 |
| 斐波那契 | 循环 / 递归 | 迭代比递归高效 |
| 质数判断 | for + break + `%` | 只需试除到 √n |
| 阶乘 | 循环 / 递归 | 递归要有终止条件 |
| 字符串反转 | 切片 `[::-1]` | 最简写法 |
| 回文判断 | 切片比较 | `s == s[::-1]` |
| 猜数字 | `while True` + 随机 + 输入 | 用 break 退出 |
| 汉诺塔 | 递归 | 大问题拆成三步 |

## 代码示例

```python
# 1. 九九乘法表
for i in range(1, 10):
    line = ""
    for j in range(1, i + 1):
        line += f"{j}x{i}={i*j}\t"
    print(line)

# 2. 斐波那契数列（前 n 项，迭代写法）
def fib(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print(fib(8))   # [0, 1, 1, 2, 3, 5, 8, 13]

# 3. 判断质数（只需试除到平方根，效率更高）
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print([x for x in range(2, 20) if is_prime(x)])
# [2, 3, 5, 7, 11, 13, 17, 19]

# 4. 阶乘（递归 + 终止条件）
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120

# 5. 字符串反转与回文判断
s = "hello"
print(s[::-1])              # olleh
def is_palindrome(word):
    return word == word[::-1]
print(is_palindrome("level"))   # True

# 6. 水仙花数（各位数字立方和等于自身）
for n in range(100, 1000):
    a, b, c = n // 100, n // 10 % 10, n % 10
    if a**3 + b**3 + c**3 == n:
        print(n, end=" ")    # 153 370 371 407

# 7. 汉诺塔（经典递归）
def hanoi(n, src, dst, helper):
    if n == 1:
        print(f"{src} -> {dst}")
        return
    hanoi(n - 1, src, helper, dst)
    print(f"{src} -> {dst}")
    hanoi(n - 1, helper, dst, src)

hanoi(2, "A", "C", "B")
```

```python
# 8. 猜数字游戏（交互）
import random

target = random.randint(1, 100)
while True:
    guess = int(input("猜一个 1-100 的数字: "))
    if guess < target:
        print("小了")
    elif guess > target:
        print("大了")
    else:
        print("猜对了！")
        break
```

## 易错点

- **递归没有终止条件**会导致无限递归，报 `RecursionError`，务必先写 base case。
- **`range` 右边界不包含**：`range(1, 10)` 是 1~9，写循环时最容易差一。
- **`//` 和 `/`**：`//` 整除得整数，`/` 得浮点数，取位数时要用 `//`。
- **字符串反转别用循环拼**：`s[::-1]` 又短又快，循环拼接是 O(n²)。
- **`input()` 返回字符串**：要当数字用必须 `int(input(...))`，否则比较会出错。
- **质数判断别从 2 试除到 n-1**：到 √n 即可，效率差一个数量级。
