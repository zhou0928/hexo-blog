---
title: "Python3 装饰器"
tags: [函数]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 装饰器

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

装饰器是一个**接收函数、返回函数**的函数，用 `@` 语法叠在函数定义上，在不改动原函数代码的前提下给它增加功能。

## 要点

- 装饰器本质是 `f = decorator(f)` 的语法糖。
- 用 `@decorator` 放在被装饰函数定义上一行。
- 内层用 `*args, **kwargs` 接收任意参数，保证通用。
- 用 `functools.wraps` 保留原函数的名字和文档，否则变成包装函数的信息。
- 装饰器可带参数：外层再包一层，`@deco(参数)` 返回真正的装饰器。
- 一个函数可叠多个装饰器，从**下往上**依次生效。
- 常见用途：日志、计时、权限校验、缓存、重试。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `@deco` | 装饰器语法糖 | `@timer` |
| `def deco(f): def w(*a, **k): ...` | 基本结构 | 返回内层 w |
| `@functools.wraps(f)` | 保留原函数元信息 | 加在内层 w 上 |
| `@deco(arg)` | 带参数的装饰器 | 需再包一层 |
| `f(*args, **kwargs)` | 内层调用原函数并透传参数 | `return f(*args, **kwargs)` |
| 多个 `@` 叠加 | 由下往上执行 | 先下的后上的 |
| `functools.lru_cache` | 内置缓存装饰器 | `@lru_cache(maxsize=None)` |

## 代码示例

```python
import functools
import time

# 1. 基础装饰器：函数计时
def timer(func):
    @functools.wraps(func)          # 保留 func 的名字与文档
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)   # 调用原函数
        print(f"{func.__name__} 耗时 {time.time()-start:.4f}s")
        return result
    return wrapper

@timer
def slow(n):
    time.sleep(0.1)
    return n * 2

slow(5)      # 输出耗时，返回 10

# 2. 带参数的装饰器：多包一层
def repeat(times):
    def deco(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return deco

@repeat(3)
def say(msg):
    print(msg)

say("hi")    # 打印 3 次 hi

# 3. 叠多个装饰器：由下往上
def bold(f):
    def w(*a, **k):
        return "<b>" + f(*a, **k) + "</b>"
    return w

def italic(f):
    def w(*a, **k):
        return "<i>" + f(*a, **k) + "</i>"
    return w

@bold
@italic
def text():
    return "hello"

print(text())    # <b><i>hello</i></b>

# 4. 内置缓存装饰器
@functools.lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

print(fib(30))   # 1346269，快速返回
```

## 易错点

- 不写 `@functools.wraps`，被装饰函数的名字会变成 `wrapper`，文档也丢失。
- 内层忘了 `return f(*args, **kwargs)`，原函数返回值丢失。
- 带参数的装饰器必须**再套一层函数**，否则参数会被当成被装饰函数。
- 叠多个装饰器顺序容易搞反：最靠近函数的**最先**执行。
- 装饰器在**定义时**就执行（`@` 那行立即调用一次），不是调用函数时才执行。
- 被 `lru_cache` 装饰的函数参数必须可哈希，列表/字典作参数会报错。
