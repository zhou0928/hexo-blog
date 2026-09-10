---
title: "Python3 编程第一步"
tags: [基础]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 编程第一步

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
从第一个 `Hello World` 起步，通过斐波那契数列等小例子，掌握 `print`、变量、`input`、循环与函数的基本用法。

## 要点
- **第一个程序**：`print("Hello, World!")`，文件保存为 `.py`，命令 `python3 文件名.py`。
- **`print` 参数**：`sep` 分隔符、`end` 结尾符（默认换行）、多值逗号分隔。
- **`input`**：读入一行字符串，返回值**永远是 str**，要数字得转换。
- **变量**：无需声明类型，直接赋值；动态类型。
- **斐波那契数列**：经典入门示例，展示 while/for 与变量交换。
- **函数**：`def` 定义，`return` 返回，可带默认参数。
- **交互式**：`python3` 直接进入 REPL，逐行输入即时看结果。

## 语法 / 常用方法

| 语法 | 说明 | 示例 |
|---|---|---|
| `print(*objs)` | 输出，可多值 | `print(1, 2, 3)` |
| `print(..., sep="-")` | 指定分隔符 | `print(1,2,sep="-")` → `1-2` |
| `print(..., end="")` | 指定结尾（默认 `\n`） | `print("a", end="")` |
| `input(prompt)` | 读一行，返回 str | `name = input("名字：")` |
| `int(...)` / `float(...)` | 字符串转数字 | `int(input())` |
| `def f(a, b=1):` | 定义函数 | 带默认参数 |
| `return 值` | 返回结果 | 无 return 返回 None |
| `a, b = b, a + b` | 元组解包实现交换 | 斐波那契常客 |
| `# 注释` | 单行注释 | — |
| `python3 file.py` | 运行脚本 | 命令行执行 |

## 代码示例

```python
# ===== 第一个程序 =====
print("Hello, World!")

# ---- print 的 sep 与 end ----
print(1, 2, 3)              # 1 2 3
print(1, 2, 3, sep="-")     # 1-2-3
print("不换行", end=" ")
print("同一行")

# ---- 变量无需声明 ----
x = 10
y = 3.14
name = "Python"
print(x, y, name)

# ---- input 输入（返回永远是 str）----
# 交互运行时取消注释：
# username = input("请输入名字：")
# age = int(input("请输入年龄："))   # 必须转 int
# print("你好", username, "你今年", age, "岁")

# 示例用固定值模拟输入
username = "小明"
age = int("18")
print(f"你好 {username}，明年你 {age + 1} 岁")

# ===== 斐波那契数列（while 版）=====
a, b = 0, 1
result = []
while len(result) < 10:
    result.append(a)
    a, b = b, a + b      # 元组解包，右边先算完再赋值
print(result)            # [0,1,1,2,3,5,8,13,21,34]

# ===== 斐波那契（for 版）=====
fib = [0, 1]
for i in range(8):
    fib.append(fib[-1] + fib[-2])
print(fib)               # [0,1,1,2,3,5,8,13,21,34]

# ---- 简单函数 ----
def fib(n):
    """返回前 n 个斐波那契数"""
    seq = []
    a, b = 0, 1
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq

print(fib(5))            # [0, 1, 1, 2, 3]

# ---- 带默认参数的函数 ----
def greet(name, greeting="你好"):
    return f"{greeting}，{name}！"

print(greet("世界"))             # 你好，世界！
print(greet("世界", "早上好"))   # 早上好，世界！
```

## 易错点
- **`input()` 返回字符串**：`input()` 得到 `"18"`，直接和数字比较会报错或结果错误，必须 `int()` / `float()`。
- **`print` 多参数默认空格分隔**：想连写用 `end=""` 或 `sep=""`。
- **缩进是语法**：顶层语句顶格，函数体缩进 4 空格。
- **变量未定义先用**：报 `NameError`；注意先赋值后使用。
- **元组解包顺序**：`a, b = b, a + b` 中右侧全部计算完才赋值，不用临时变量。
- **运行方式**：命令行 `python3 文件.py`；文件名别用中文或特殊字符更稳妥。
- **`return` 与 `print` 区别**：`return` 交回值给调用方，`print` 只是显示。
