---
title: "Python3 条件控制"
tags: [流程控制]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 条件控制

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用 `if / elif / else` 按条件分支执行代码，靠缩进划分代码块；Python 3.10+ 新增 `match / case` 做结构模式匹配。

## 要点
- **语法结构**：`if 条件:`、`elif 条件:`、`else:`，条件后必须有冒号 `:`。
- **缩进决定块**：同一块缩进必须一致（推荐 4 空格），Python 无花括号。
- **真值判断**：`0`、`0.0`、`''`、`[]`、`{}`、`()`、`set()`、`None`、`False` 都是假；其余为真。
- **条件运算符**：`and`、`or`、`not`；比较可链式 `1 < x < 10`。
- **三元表达式**：`a if 条件 else b`，简洁单行取值。
- **嵌套**：`if` 内可再写 `if`，注意每层缩进递增。
- **`match / case`**（3.10+）：类似其他语言的 switch，但更强大，支持解构与守卫。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `if cond:` | 条件为真执行 | `if x > 0:` |
| `elif cond:` | 前面的都不满足再判断 | 可多个连用 |
| `else:` | 以上都不满足时执行 | 收尾可选 |
| `a if cond else b` | 三元表达式 | `"正" if x>0 else "负"` |
| `and` / `or` / `not` | 逻辑与 / 或 / 非 | 短路求值 |
| `1 < x < 10` | 链式比较 | 等价 `1<x and x<10` |
| `x in seq` | 成员判断 | `if x in [1,2]:` |
| `x is None` | 身份判断（判 None 用它） | 不要用 `==` |
| `match x:` / `case 值:` | 3.10+ 模式匹配 | 见示例 |
| `case _:` | 匹配任意（default 分支） | 放最后 |

## 代码示例

```python
# ---- 基本 if / elif / else ----
score = 85
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")
# 输出：及格

# ---- 真值判断 ----
items = []
if items:
    print("有元素")
else:
    print("空列表为假")     # 走这里

# ---- 逻辑运算与短路 ----
age = 20
if age > 18 and age < 60:
    print("成年劳动人口")

# ---- 链式比较 ----
x = 5
if 0 < x < 10:
    print("x 在 0 到 10 之间")

# ---- 三元表达式 ----
n = -3
label = "正数" if n > 0 else "非正数"
print(label)                # 非正数

# ---- 嵌套 ----
num = 8
if num > 0:
    if num % 2 == 0:
        print("正偶数")     # 走这里
    else:
        print("正奇数")

# ---- 判 None 用 is ----
val = None
if val is None:
    print("值为 None")

# ---- match / case（Python 3.10+）----
def http_status(code):
    match code:
        case 200:
            return "OK"
        case 301 | 302:          # 多值匹配
            return "重定向"
        case 404:
            return "未找到"
        case _:                  # 默认分支
            return "未知"

print(http_status(200))     # OK
print(http_status(302))     # 重定向

# ---- match 解构 + 守卫 ----
def classify(point):
    match point:
        case (0, 0):
            return "原点"
        case (x, 0):
            return f"X 轴上 x={x}"
        case (x, y) if x == y:
            return f"对角线上 {x},{y}"
        case _:
            return "普通点"

print(classify((0, 0)))     # 原点
print(classify((3, 3)))     # 对角线上 3,3
```

## 易错点
- **漏冒号**：`if x > 0` 后必须有 `:`，否则 `SyntaxError`。
- **缩进不一致**：混用 Tab 和空格报 `IndentationError`，统一 4 空格。
- **条件里用 `=` 赋值**：`if x = 1` 非法（3.8+ 海象运算符是 `:=`）。
- **判 None 别用 `==`**：用 `is None`，避免自定义 `__eq__` 干扰。
- **`elif` 顺序**：范围条件要从严到宽，否则宽条件先命中会把细分支屏蔽。
- **空容器为假**：`if []:` 不执行；判“非空”直接 `if lst:`。
- **`match` 版本要求**：Python 3.10 以下不支持，运行报 `SyntaxError`。
- **`match` 不自动穿透**：每个 `case` 独立，不会像 C 那样 fall-through。
