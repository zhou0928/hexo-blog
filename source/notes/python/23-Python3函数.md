---
title: "Python3 函数"
tags: [函数]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 函数

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

函数是命名的代码块，用 `def` 定义、用 `return` 返回结果，参数支持默认值、关键字、可变长和仅关键字等多种形式。

## 要点

- 用 `def 名(参数):` 定义，函数体缩进，`return` 返回值（不写返回 `None`）。
- 参数按顺序：位置参数 → 默认参数 → `*args` → 仅关键字参数 → `**kwargs`。
- 默认参数值只在**定义时求值一次**，别用可变对象（如 `[]`）当默认值。
- `*args` 收集多余位置参数为元组，`**kwargs` 收集多余关键字参数为字典。
- 调用时 `*` 解包序列、`**` 解包字典，用于传参。
- 函数是第一类对象：可赋值、可作为参数、可作为返回值。
- 闭包：内层函数引用外层函数的变量，外层返回内层函数后变量仍被记住。
- `nonlocal` 声明外层（非全局）变量，让内层函数可修改它。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `def f(a, b=1):` | 默认参数 | `f(2)` → b 用 1 |
| `def f(*args):` | 可变长位置参数，元组 | `f(1, 2, 3)` |
| `def f(**kwargs):` | 可变长关键字参数，字典 | `f(x=1)` |
| `def f(a, *, b):` | b 只能用关键字传 | `f(1, b=2)` |
| `def f(a, /, b):` | a 只能按位置传 | `f(1, 2)` |
| `lambda 参数: 表达式` | 匿名函数 | `lambda x: x+1` |
| `global x` | 声明全局变量 | 函数内改全局 |
| `nonlocal x` | 声明外层函数变量 | 闭包内改外层 |
| `return a, b` | 返回元组 | `x, y = f()` |
| `help(f)` / `f.__doc__` | 查看文档字符串 | `help(f)` |

## 代码示例

```python
# 1. 基本定义与默认参数
def greet(name, msg="你好"):
    """打招呼，返回字符串。"""
    return f"{msg}, {name}"

print(greet("小明"))            # 你好, 小明
print(greet("小明", "早上好"))   # 早上好, 小明

# 2. 可变长参数 *args / **kwargs
def show(*args, **kwargs):
    print("args:", args)        # 元组
    print("kwargs:", kwargs)    # 字典

show(1, 2, x=3, y=4)
# args: (1, 2)
# kwargs: {'x': 3, 'y': 4}

# 3. 解包调用
nums = [1, 2, 3]
info = {"a": 1, "b": 2}
def add(a, b, c=0):
    return a + b + c
print(add(*nums))               # 6
print(add(1, **info))           # 会冲突，注意参数名

# 4. 仅关键字参数
def config(name, *, debug=False):
    return f"{name}: debug={debug}"

print(config("app", debug=True))    # app: debug=True
# config("app", True)  # 报错，debug 只能关键字传

# 5. 闭包：内层引用外层变量
def counter():
    n = 0
    def inc():
        nonlocal n               # 修改外层 n
        n += 1
        return n
    return inc

c = counter()
print(c(), c(), c())             # 1 2 3

# 6. 函数作为参数（高阶函数）
def apply(fn, value):
    return fn(value)

print(apply(lambda x: x * 2, 5)) # 10
```

## 易错点

- 默认参数用可变对象：`def f(x, lst=[])` 多次调用会共用同一个列表，应改 `lst=None`。
- `*args` / `**kwargs` 名字可自定义，但 `*` / `**` 含义固定。
- 函数内**赋值**会创建局部变量；只读全局变量可不用 `global`，修改才需要。
- `return` 后代码不执行；没有 `return` 返回 `None`。
- 嵌套函数修改外层变量要用 `nonlocal`，修改全局用 `global`。
- 参数顺序写错（默认参数放到位置参数前）会 `SyntaxError`。
- 闭包捕获的是变量本身而非当时的值，循环里注意后期绑定陷阱。
