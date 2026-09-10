---
title: "Python3 简介"
tags: [基础]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 简介

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
Python 是一门解释型、面向对象、动态类型的通用高级编程语言，语法简洁，适合快速开发。

## 要点
- **解释型**：代码逐行解释执行，无需编译成二进制，跨平台好。
- **动态类型**：变量不需要先声明类型，运行时由赋值决定。
- **面向对象**：一切皆对象，支持类、继承、多态。
- **自动内存管理**：自带垃圾回收（GC），一般不用手动释放内存。
- **缩进敏感**：用缩进划分代码块，不用花括号。
- **擅长领域**：Web 开发、数据分析、人工智能、自动化脚本、爬虫。
- **CPython** 是最常用的官方实现，用 C 语言编写。
- 版本：Python 2 已于 2020 年停止维护，现在统一用 Python 3。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `print()` | 输出内容到控制台 | `print("hello")` |
| `# 注释` | 单行注释 | `# 这是注释` |
| `import 模块` | 导入模块 | `import math` |
| `type()` | 查看对象类型 | `type(3)` → `<class 'int'>` |
| `len()` | 求长度 | `len("abc")` → `3` |
| `def` | 定义函数 | `def add(a, b): return a + b` |
| `help()` | 查看对象帮助文档 | `help(print)` |

## 代码示例

```python
# 第一个 Python 程序
print("Hello, Python3!")          # 输出字符串

# 变量无需声明类型
name = "小明"                      # 字符串
age = 18                           # 整数
height = 1.75                      # 浮点数
is_student = True                  # 布尔值

# 查看类型
print(type(name))                  # <class 'str'>
print(type(age))                   # <class 'int'>

# Python 是动态类型，同一变量可重新赋不同值
x = 10
print(x)
x = "现在变成字符串了"
print(x)

# 定义一个函数
def greet(who):
    """返回一句问候语"""
    return f"你好, {who}!"

print(greet("世界"))

# 用缩进表示代码块（普通 4 个空格）
for i in range(3):
    print("循环第", i + 1, "次")
```

## 易错点
- **缩进不能混用**：空格和 Tab 混用会报 `IndentationError`，统一用 4 个空格。
- **大小写敏感**：`Print` 和 `print` 不是一回事，`True` 不能写成 `true`。
- **Python 2 与 3 不兼容**：`print` 在 Py2 里是语句、Py3 里是函数。
- **动态类型 ≠ 无类型**：类型错误仍会在运行时抛出 `TypeError`。
- `.py` 文件建议用 UTF-8 编码，避免中文乱码。
