---
title: "Python StringIO 模块"
tags: [数据格式]
group: 高级
date: 2026-09-10 00:00:00
---

# Python StringIO 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`io.StringIO` 在内存里模拟一个文本文件，可以像读写文件一样读写字符串，不落磁盘。

## 要点

- 位于标准库 `io` 模块：`from io import StringIO`。
- 行为像文件对象：支持 `write`、`read`、`readline`、`readlines`、`seek`、`tell`、`close`。
- `getvalue()` 一次性取出缓冲区的全部内容（`StringIO` 独有，文件对象没有）。
- 主要用于：拼接大量字符串（比 `+` 高效）、把字符串伪装成文件传给需要文件的接口、测试替代真实文件。
- 二进制版本是 `io.BytesIO`，用法一致但处理 `bytes`。
- 支持 `with` 上下文管理，退出自动关闭。
- 写入后光标在末尾，想读要先 `seek(0)` 回到开头。
- `csv`、`json` 等库接受“类文件对象”，`StringIO` 可直接喂给它们。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `StringIO(初始字符串)` | 创建内存文本缓冲 | `s = StringIO('abc')` |
| `s.write(text)` | 写入，返回字符数 | `s.write('hello')` |
| `s.getvalue()` | 取出全部内容 | `s.getvalue()` |
| `s.read()` | 从当前光标读全部 | `s.seek(0); s.read()` |
| `s.readline()` | 读一行 | `s.readline()` |
| `s.readlines()` | 读所有行成列表 | `s.readlines()` |
| `s.seek(pos)` | 移动光标 | `s.seek(0)` |
| `s.tell()` | 当前光标位置 | `s.tell()` |
| `s.truncate(size)` | 截断到指定长度 | 保留前 n 字符 |
| `s.close()` | 关闭释放 | `with` 自动调用 |
| `io.BytesIO()` | 二进制版缓冲 | 处理 `bytes` |

## 代码示例

```python
from io import StringIO

# 1. 基本读写
buf = StringIO()
buf.write('第一行\n')
buf.write('第二行\n')
print(buf.getvalue())             # 取出全部内容

# 2. 写入后读，必须先 seek(0) 回到开头
buf.seek(0)
print(buf.readline())             # 第一行
print(buf.read())                 # 第二行

# 3. 用初始内容创建
s = StringIO('a,b,c\n1,2,3\n')
print(s.readline().strip())       # a,b,c

# 4. 当“字符串拼接器”：比循环 + 高效
parts = StringIO()
for i in range(5):
    parts.write(f'第{i}项 ')      # 避免每次重新分配大字符串
result = parts.getvalue()
print(result.strip())

# 5. 把字符串伪装成文件，喂给读文件的接口
import csv
fake_file = StringIO('名字,分数\n张三,90\n李四,85\n')
reader = csv.reader(fake_file)
for row in reader:
    print(row)                     # ['名字', '分数'] / ['张三', '90'] ...

# 6. BytesIO：二进制版本
from io import BytesIO
b = BytesIO()
b.write(b'raw bytes')
print(b.getvalue())               # b'raw bytes'
```

## 易错点

- 写完后直接 `read()` 读到的是空字符串，因为光标在末尾，**记得先 `seek(0)`**。
- `StringIO` 没有 `name` 属性，某些库（如旧版 `csv`）可能依赖文件名，注意兼容。
- 处理 `bytes` 要用 `BytesIO`，用 `StringIO` 写字节会报 `TypeError`。
- 大对象常驻内存，数据量非常大时别用它替代真实文件。
- `getvalue()` 可以在 `close()` 前取，关闭后再操作会抛 `ValueError: I/O operation on closed file`。
- `with` 块内才有效，出了块对象已关闭，数据要提前 `getvalue()` 保存。
