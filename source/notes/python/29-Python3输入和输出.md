---
title: "Python3 输入和输出"
tags: [文件与IO]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 输入和输出

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

用 `print()` 输出、`input()` 读入，用格式化（f-string、`format`、`%`）把变量拼进字符串，本章是人和程序打交道的入口。

## 要点

- `input(prompt)` 读一行输入，**总是返回字符串**，数字要手动转 `int()`/`float()`。
- `print()` 默认换行，`end=""` 可改结尾，`sep=` 改分隔符。
- 三种格式化：f-string（推荐）、`str.format()`、`%` 占位符。
- f-string 里可写表达式、可指定精度与对齐。
- `repr()` 面向开发者（带引号），`str()` 面向用户。
- 输出到文件需 `print(..., file=f)`，写入前对象先 `str()`。
- 读文件用 `open` + `for line in f`，写完记得 `with` 自动关闭。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `input(prompt)` | 读取一行，返回字符串 | `name = input("名字: ")` |
| `int(input(...))` | 转整数 | `n = int(input())` |
| `print(a, b, sep=", ")` | 自定义分隔符 | `print(1,2,sep="-")` |
| `print(x, end="")` | 不换行 | 循环打印 |
| `f"{x:.2f}"` | f-string 格式化小数 | `f"{3.14159:.2f}"` → `3.14` |
| `"{:>5}".format(x)` | 右对齐宽度 5 | `"{:>5}".format("a")` |
| `"%d %s" % (1, "a")` | 旧式 % 格式化 | 兼容旧代码 |
| `str(obj)` / `repr(obj)` | 用户/开发者字符串 | 打印 |
| `print(..., file=f)` | 输出到文件对象 | `with open(...) as f:` |
| `"x".join(list)` | 列表拼成字符串 | `",".join(["a","b"])` |

## 代码示例

```python
# 1. 输入（注意返回字符串，需转换）
# name = input("请输入名字：")
# age = int(input("请输入年龄："))
# print(f"{name} 今年 {age} 岁")

# 2. print 控制分隔与结尾
print("a", "b", "c")            # a b c
print("a", "b", sep="-")        # a-b
print("不换行", end=" ")
print("接上一行")               # 不换行 接上一行

# 3. 三种格式化
pi = 3.14159
name = "Tom"
print(f"{name} 的 pi 是 {pi:.2f}")      # Tom 的 pi 是 3.14（f-string）
print("{} 的 pi 是 {:.2f}".format(name, pi))  # str.format
print("%s 的 pi 是 %.2f" % (name, pi))  # % 占位符

# 4. 对齐与宽度
print(f"{'左':<5}|{'中':^5}|{'右':>5}|")
# 左    |  中  |    右|

# 5. 常用字符串方法
s = "  Hello Python  "
print(s.strip())                # Hello Python
print(s.strip().lower())        # hello python
print("a,b,c".split(","))       # ['a', 'b', 'c']
print("-".join(["2024", "01"])) # 2024-01

# 6. 输出到文件（配合 with）
with open("out.txt", "w", encoding="utf-8") as f:
    print("写入一行", file=f)

# 7. 读回并打印
with open("out.txt", encoding="utf-8") as f:
    for line in f:
        print("读到:", line.rstrip())
```

## 易错点

- `input()` 永远返回字符串，`input() + 1` 会 `TypeError`，记得 `int()`/`float()`。
- 转数字时用户乱输会 `ValueError`，需 `try/except` 兜底。
- f-string 的 `{}` 里是表达式，写引号注意 Python 3.12 前后语法差异。
- `print` 多个值默认用空格分隔，忘了 `sep` 会得到不想要的空格。
- 文件写入默认用系统编码，中文建议显式 `encoding="utf-8"`。
- 用 `write()` 只能写字符串，写数字要先 `str()`。
- `%` 格式化只有一个占位符时括号可省，多个必须用元组，传列表会整体当一个值。
