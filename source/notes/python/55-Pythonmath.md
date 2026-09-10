---
title: "Python math"
tags: [数学与随机]
group: 高级
date: 2026-09-10 00:00:00
---

# Python math

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`math` 是标准库数学模块，提供常量（π、e）和常用数学函数（开方、对数、三角函数、取整）。

## 要点
- 处理浮点数学运算，精度和速度优于手写实现。
- 除三角函数外，多数函数只接受实数，传复数要用 `cmath`。
- 整数开方也可用 `** 0.5`，但 `math.sqrt` 更快更明确。
- 取整有三个函数，行为不同：`ceil` 向上、`floor` 向下、`trunc` 向零。
- 组合数、阶乘、最大公约数、弧度角度转换都有现成函数。
- `math.isclose()` 做浮点相等比较，比 `==` 可靠。

## 语法 / 常用方法

| 函数 / 常量 | 说明 | 示例结果 |
|---|---|---|
| `math.pi` | 圆周率 | `3.141592653589793` |
| `math.e` | 自然常数 | `2.718281828459045` |
| `math.inf` | 正无穷 | — |
| `math.sqrt(x)` | 平方根 | `sqrt(16)` → `4.0` |
| `math.pow(x, y)` | 幂（返回浮点） | `pow(2, 3)` → `8.0` |
| `math.exp(x)` | e 的 x 次幂 | `exp(1)` → `2.718...` |
| `math.log(x, base)` | 对数，默认自然对数 | `log(100, 10)` → `2.0` |
| `math.log10(x)` / `log2(x)` | 以 10 / 2 为底 | `log2(8)` → `3.0` |
| `math.ceil(x)` | 向上取整 | `ceil(1.2)` → `2` |
| `math.floor(x)` | 向下取整 | `floor(1.8)` → `1` |
| `math.trunc(x)` | 截断取整 | `trunc(-1.8)` → `-1` |
| `math.fabs(x)` | 绝对值（浮点） | `fabs(-3)` → `3.0` |
| `math.factorial(n)` | 阶乘 | `factorial(5)` → `120` |
| `math.gcd(a, b)` | 最大公约数 | `gcd(12, 18)` → `6` |
| `math.comb(n, k)` | 组合数 C(n,k) | `comb(5, 2)` → `10` |
| `math.perm(n, k)` | 排列数 P(n,k) | `perm(5, 2)` → `20` |
| `math.radians(d)` / `degrees(r)` | 角度 / 弧度互转 | `radians(180)` → `pi` |
| `math.sin/cos/tan(x)` | 三角函数（弧度） | — |
| `math.isclose(a, b)` | 浮点近似相等 | `isclose(0.1+0.2, 0.3)` → `True` |
| `math.fsum(it)` | 精确求和 | 减少浮点误差 |

## 代码示例

```python
import math

# 常量
print(math.pi, math.e)                       # 3.14159... 2.71828...

# 幂与开方
print(math.sqrt(16))                         # 4.0
print(math.pow(2, 10))                       # 1024.0
print(2 ** 0.5)                              # 1.414...（另一种开方）

# 对数与指数
print(math.log(math.e))                      # 1.0
print(math.log(100, 10))                     # 2.0
print(math.exp(1))                           # 2.718...

# 三种取整对比
print(math.ceil(1.2), math.floor(1.8), math.trunc(-1.8))  # 2 1 -1

# 组合数学
print(math.factorial(5))                     # 120
print(math.gcd(12, 18))                      # 6
print(math.comb(5, 2), math.perm(5, 2))      # 10 20

# 角度与三角函数
deg = 60
rad = math.radians(deg)
print(round(math.sin(rad), 4))               # 0.866（sin60°）

# 浮点比较不要用 ==
print(0.1 + 0.2 == 0.3)                      # False
print(math.isclose(0.1 + 0.2, 0.3))          # True
```

## 易错点
- 浮点数天生有误差，`0.1 + 0.2 != 0.3`，相等比较用 `math.isclose`。
- 三角函数参数是弧度不是角度，角度要先 `math.radians()` 转换。
- `math.sqrt(-1)` 会抛 `ValueError`，负数开方用 `cmath.sqrt`。
- `math.pow` 返回 `float`，`**` 运算符可返回 `int`，精度场景注意区别。
- `math.ceil/floor` 返回 `int`（Python 3），别以为还是浮点。
- `math.log(x, base)` 的两个参数顺序是「真数, 底数」，别写反。
