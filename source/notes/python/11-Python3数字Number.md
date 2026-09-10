---
title: "Python3 数字(Number)"
tags: [数据类型, 数学与随机]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 数字(Number)

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
Python3 的数字类型有 int（整数）、float（浮点）、complex（复数），bool 是 int 的子类；数字不可变，运算会自动在类型间转换。

## 要点
- **四种数字类型**：`int` 任意精度整数；`float` 双精度浮点（约 17 位有效数字）；`complex` 复数（`a+bj`，实部虚部均为 float）；`bool` 取值 `True`/`False`，本质是 `1`/`0`。
- **不可变**：数字对象一旦创建就不能改。`x += 1` 是创建新对象并重新绑定变量，不是原地修改。
- **类型自动转换**：整数与浮点运算，结果为浮点；整数除法 `/` 永远返回 float，整除 `//` 返回向下取整的结果（类型随操作数）。
- **`//` 向下取整**：`-7 // 2 == -4`（不是 -3），取整方向向负无穷。
- **`**` 幂运算**：`2 ** 10 == 1024`，也可用 `pow(2, 10)`。
- **删除引用**：`del x` 删除变量（不是删除数字对象本身）。
- **math 模块**：数学常量与函数，需 `import math`。
- **random 模块**：伪随机数生成，需 `import random`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `int(x)` / `float(x)` / `complex(x)` | 类型转换 | `int("12")` → 12 |
| `**` | 幂运算 | `3 ** 2` → 9 |
| `//` | 整除（向下取整） | `-7 // 2` → -4 |
| `%` | 取模（余数） | `7 % 3` → 1 |
| `divmod(a, b)` | 同时返回商和余数 | `divmod(7, 3)` → `(2, 1)` |
| `abs(x)` | 绝对值 | `abs(-3.5)` → 3.5 |
| `round(x, n)` | 四舍六入五成双，保留 n 位 | `round(2.675, 2)` → 2.67 |
| `math.ceil(x)` / `math.floor(x)` | 上取整 / 下取整 | `math.ceil(1.1)` → 2 |
| `math.sqrt(x)` | 平方根（返回 float） | `math.sqrt(16)` → 4.0 |
| `math.pow(a, b)` | 幂（返回 float） | `math.pow(2, 3)` → 8.0 |
| `math.pi` / `math.e` | 圆周率 / 自然常数 | `math.pi` → 3.141592653589793 |
| `math.pi` 等 | 三角函数 | `math.sin(math.pi/2)` → 1.0 |
| `math.fabs(x)` | 绝对值（float） | `math.fabs(-5)` → 5.0 |
| `random.random()` | [0.0, 1.0) 随机浮点 | `random.random()` |
| `random.randint(a, b)` | [a, b] 随机整数 | `random.randint(1, 6)` |
| `random.choice(seq)` | 从序列随机取一个 | `random.choice("abc")` |
| `random.shuffle(lst)` | 原地打乱列表 | `random.shuffle([1,2,3])` |
| `random.uniform(a, b)` | [a, b] 随机浮点 | `random.uniform(1, 2)` |
| `random.seed(x)` | 设定随机种子（可复现） | `random.seed(42)` |

## 代码示例

```python
import math
import random

# ---- 三种数字类型 ----
a = 10          # int
b = 3.14        # float
c = 2 + 3j      # complex
print(type(a), type(b), type(c))   # <class 'int'> <class 'float'> <class 'complex'>
print(c.real, c.imag)              # 2.0 3.0  实部 / 虚部

# ---- bool 是 int 的子类 ----
print(True == 1, False == 0)       # True True
print(True + True)                 # 2

# ---- 整除与取模（注意负数方向）----
print(7 / 2)      # 3.5   真除法恒为 float
print(7 // 2)     # 3
print(-7 // 2)    # -4    向下取整，不是 -3
print(7 % 3, -7 % 3)   # 1 2

# ---- 类型转换 ----
print(int("42"), int(3.99), float("1.5"), int(3.99))  # 42 3 1.5 3（截断）

# ---- math 模块 ----
print(math.sqrt(16))          # 4.0
print(math.ceil(1.1), math.floor(1.9))   # 2 1
print(round(2.675, 2))        # 2.67  浮点精度导致的“意外”
print(math.pi)                # 3.141592653589793

# ---- random 模块 ----
random.seed(1)                # 固定种子，结果可复现
print(random.randint(1, 6))   # 模拟掷骰子
print(random.choice(["石头", "剪刀", "布"]))
nums = [1, 2, 3, 4, 5]
random.shuffle(nums)          # 原地打乱
print(nums)
```

## 易错点
- **整数除法**：`10 / 3` 是 `3.333...`（float），要整除用 `//`。
- **`//` 对负数向下取整**：`-7 // 2 == -4`，和 `int(-7 / 2)` 的 `-3` 不同。
- **浮点精度**：`0.1 + 0.2 != 0.3`（是 `0.30000000000000004`），比较浮点用 `math.isclose()`。
- **round 不是四舍五入**：采用银行家舍入，`round(0.5) == 0`、`round(1.5) == 2`。
- **`int()` 对字符串截断 vs 报错**：`int("3.9")` 会抛 `ValueError`，先转 `float` 再 `int`。
- 复数不能直接比较大小，用 `abs()` 比较模。
- `del x` 后变量名不可再用，但其他引用不受影响（引用计数/GC 机制）。
