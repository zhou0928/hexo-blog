---
title: "Python3 with"
tags: [模块与工程, 文件与IO]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 with

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`with` 是上下文管理器语法，进入代码块自动分配资源、离开时（即使报错）自动释放，最常见的就是自动关闭文件。

## 要点

- `with` 保证资源**必然被释放**，比手写 `try/finally` 更短更安全。
- 文件、锁、网络连接、数据库连接都支持 `with`。
- 一个 `with` 语句可同时管理多个资源，用逗号分隔。
- 背后的协议：对象实现 `__enter__()`（进入）和 `__exit__()`（退出）。
- 一旦 `with` 是语言级协议，自定义类实现这两个方法即可支持 `with`。
- `__exit__` 返回 `True` 会吞掉异常，返回 `False`（或 `None`）则异常继续抛出。
- `contextlib` 提供了 `@contextmanager`、`closing`、`suppress` 等工具简化写法。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `with expr as x:` | 进入上下文，值绑定到 x | `with open("f") as f:` |
| `with a as x, b as y:` | 同时管理多个资源 | `with open(a) as fa, open(b) as fb:` |
| `__enter__(self)` | 进入时调用，返回值给 `as` | `return self.fp` |
| `__exit__(self, et, ev, tb)` | 退出时调用，负责清理 | `self.fp.close()` |
| `@contextmanager` | 用生成器写上下文管理器 | 需 `from contextlib import contextmanager` |
| `contextlib.suppress(E)` | 忽略指定异常 | `with suppress(FileNotFoundError):` |
| `contextlib.closing(obj)` | 退出时调 `obj.close()` | `with closing(resp):` |

## 代码示例

```python
# 1. 最常用：自动关闭文件，异常也会关
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")
# 离开缩进块后文件已关闭

# 2. 同时打开两个文件
with open("a.txt", encoding="utf-8") as fa, \
     open("b.txt", encoding="utf-8") as fb:
    for line in fa:
        fb.write(line)

# 3. 自定义上下文管理器（__enter__ / __exit__）
class DB:
    def __enter__(self):
        print("连接数据库")
        return self

    def __exit__(self, exc_type, exc_val, tb):
        print("断开数据库")
        return False        # 不吞异常，向上抛

with DB() as db:
    print("执行操作")

# 4. 用 @contextmanager 简化（基于生成器）
from contextlib import contextmanager

@contextmanager
def tag(name):
    print(f"<{name}>")      # __enter__ 部分
    try:
        yield name          # with 块内
    finally:
        print(f"</{name}>") # __exit__ 部分（必然执行）

with tag("h1") as t:
    print("标题")

# 5. 忽略指定异常
import contextlib
with contextlib.suppress(FileNotFoundError):
    open("不存在的文件.txt")
print("继续执行")
```

## 易错点

- `with` 绑定的变量在块外仍可见（Python 无块级作用域），但资源已释放，别再用。
- 忘了 `as` 变量时写 `with open("f"):` 也能用，但拿不到文件对象。
- `__exit__` 返回值为真值才会吞异常，别误以为一定能捕获。
- `@contextmanager` 里必须 `try/finally` 包住 `yield`，否则中途异常跳过清理。
- `with` 打开文件后，块外使用 `f.read()` 会 `ValueError: I/O operation on closed file`。
- 多个资源用逗号分隔时注意换行与反斜杠，别漏写 `as`。
