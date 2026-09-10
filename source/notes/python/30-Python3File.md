---
title: "Python3 File"
tags: [文件与IO]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 File

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

用内置的 `open()` 打开文件得到文件对象，再用 `read`/`write` 等方法和 `with` 上下文管理读写文件，用完自动关闭。

## 要点

- `open(file, mode, encoding)` 返回文件对象；路径支持相对/绝对。
- 模式：`r` 读、`w` 写（清空）、`a` 追加、`x` 独占创建、`+` 读写、`b` 二进制。
- 文本模式默认按系统编码，中文读写**显式指定 `encoding="utf-8"`** 最稳。
- 推荐 `with open(...) as f:`，离开块自动关闭，异常也不泄漏。
- `read()` 读全部，`readline()` 读一行，`readlines()` 读成列表，`for line in f` 逐行最省内存。
- 文件对象可迭代，逐行处理大文件不会一次性载入内存。
- 写文件后需 `flush()` 或关闭才落盘；`with` 退出即关闭。
- `seek(offset, whence)` 移动指针，`tell()` 看当前位置，二进制模式常用。

## 语法 / 常用方法

| 方法/参数 | 说明 | 示例 |
|---|---|---|
| `open(file, mode)` | 打开文件 | `open("a.txt", "r")` |
| `f.read(size=-1)` | 读全部或指定字节 | `f.read()` |
| `f.readline()` | 读一行（含换行符） | `f.readline()` |
| `f.readlines()` | 读所有行成列表 | `f.readlines()` |
| `for line in f` | 逐行迭代，省内存 | `for line in f:` |
| `f.write(s)` | 写入字符串，返回字符数 | `f.write("hi\n")` |
| `f.writelines(seq)` | 写入字符串序列 | `f.writelines(["a\n","b\n"])` |
| `f.flush()` | 立即刷新缓冲到磁盘 | `f.flush()` |
| `f.close()` | 关闭文件 | `f.close()` |
| `f.seek(offset, whence)` | 移动读写指针 | `f.seek(0)` |
| `f.tell()` | 返回当前指针位置 | `f.tell()` |
| `f.closed` | 是否已关闭 | `f.closed` |

## 代码示例

```python
# 1. 写入文件（w 覆盖，a 追加）
with open("demo.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")

with open("demo.txt", "a", encoding="utf-8") as f:
    f.write("追加的第三行\n")

# 2. 读取全部内容
with open("demo.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 3. 逐行读取（推荐，省内存）
with open("demo.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())        # rstrip 去掉行尾换行

# 4. readlines / readline
with open("demo.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()           # ['第一行\n', '第二行\n', ...]
    print(len(lines))

with open("demo.txt", "r", encoding="utf-8") as f:
    print(f.readline().strip())     # 第一行

# 5. 写文件 + 手动读取位置
with open("data.bin", "wb") as f:
    f.write(b"\x00\x01\x02")

with open("data.bin", "rb") as f:
    print(f.read(2))                # b'\x00\x01'
    f.seek(0)                       # 回到开头
    print(f.read())                 # b'\x00\x01\x02'
    print(f.tell())                 # 3

# 6. 用 writelines 批量写
with open("list.txt", "w", encoding="utf-8") as f:
    f.writelines(["a\n", "b\n", "c\n"])

# 7. 传统 try/finally（了解即可，推荐 with）
f = open("demo.txt", encoding="utf-8")
try:
    print(f.read())
finally:
    f.close()
```

## 易错点

- 用 `w` 模式打开会**立刻清空**原文件，只想读别写错模式。
- 文本模式写二进制（图片等）会报错，二进制用 `"rb"`/`"wb"`。
- 中文乱码多半是编码不一致，读写都指定 `encoding="utf-8"`。
- `readline()` 保留末尾 `\n`，比较字符串前先 `strip()`。
- 忘记关闭文件会占用句柄/丢缓冲数据，优先用 `with`。
- 文件不存在时 `r` 模式抛 `FileNotFoundError`，可先判断或用 `x`/`a`。
- `read()` 读大文件会吃光内存，大文件用逐行迭代。
- 文本模式下 `seek` 只能从文件开头或 `tell()` 返回值移，随意偏移可能出错。
