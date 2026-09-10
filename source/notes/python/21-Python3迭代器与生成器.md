---
title: "Python3 迭代器与生成器"
tags: [函数]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 迭代器与生成器

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

迭代器是实现了 `__iter__()` 和 `__next__()` 的对象；生成器是用 `yield` 自动造出迭代器的函数，写起来更省事、更省内存。

## 要点

- 可迭代对象（iterable）：能用于 `for` 的对象，如列表、字符串、字典、文件。
- 迭代器（iterator）：既能被 `for` 遍历，又能被 `next()` 逐个取值。
- `iter(x)` 把可迭代对象变成迭代器；`next(it)` 取下一个值。
- 迭代器**一次性**：耗尽后不再返回值，只能重新 `iter()`。
- 生成器函数含 `yield`，调用时返回生成器对象，不立即执行函数体。
- 每次 `next()` 执行到 `yield` 处暂停，保留局部变量，下次从暂停处继续。
- `yield` 可返回多个值（本质是元组），也可用 `send()` 向生成器传值。
- 生成器是**惰性求值**：不一次性算完，适合处理大文件、无限序列。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `iter(obj)` | 得到迭代器 | `it = iter([1, 2, 3])` |
| `next(it)` | 取下一个值，耗尽抛 `StopIteration` | `next(it)` → `1` |
| `next(it, default)` | 耗尽时返回默认值，不抛异常 | `next(it, None)` |
| `for x in it` | 自动迭代，捕获 `StopIteration` | `for x in it: print(x)` |
| `yield value` | 生成器暂停并产出一个值 | `yield i` |
| `yield from seq` | 委托给另一个可迭代对象 | `yield from [1, 2]` |
| `gen.send(v)` | 唤醒生成器并传入值 | `g.send(10)` |
| `gen.close()` | 关闭生成器，抛 `GeneratorExit` | `g.close()` |
| `(x for x in ...)` | 生成器表达式，最简写法 | `sum(x*x for x in range(5))` |

## 代码示例

```python
# 1. 自定义迭代器：必须实现 __iter__ 和 __next__
class CountDown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self              # 迭代器返回自身

    def __next__(self):
        if self.n <= 0:
            raise StopIteration  # 结束信号
        self.n -= 1
        return self.n + 1

for i in CountDown(3):
    print(i, end=" ")            # 3 2 1

# 2. 生成器函数：用 yield 代替手写迭代器
def fib(max_n):
    a, b = 0, 1
    for _ in range(max_n):
        yield a
        a, b = b, a + b

print(list(fib(6)))              # [0, 1, 1, 2, 3, 5, 8]

# 3. 生成器惰性处理大文件（不占内存）
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip()

# 4. send() 双向通信
def echo():
    while True:
        received = yield        # 暂停，等待 send 传入
        if received is None:
            break
        print("收到:", received)

g = echo()
next(g)                         # 先启动到第一个 yield
g.send("hello")                 # 收到: hello

# 5. 生成器表达式：省内存的推导式
vs = (x * x for x in range(1000000))   # 不立即计算
print(next(vs))                 # 0
```

## 易错点

- 迭代器**只能遍历一次**，第二次 `for` 没有输出，需要重新 `iter()`。
- 生成器函数调用后**不执行**，第一次 `next()` 才真正运行。
- 忘记实现 `__iter__` 或 `__next__`，对象无法迭代。
- 耗尽迭代器后继续 `next()` 会抛 `StopIteration`，用 `next(it, default)` 兜底。
- `return` 在生成器里会结束生成，`return value` 的值挂在 `StopIteration.value`，不直接返回。
- 生成器里若有 `try/finally`，`close()` 会触发 `finally` 清理。
