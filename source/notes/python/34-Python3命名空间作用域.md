---
title: "Python3 命名空间 / 作用域"
tags: [面向对象]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 命名空间 / 作用域

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

命名空间是变量名到对象的映射，作用域决定变量在哪些地方可见；Python 用 LEGB 规则查找变量。

## 要点

- **命名空间**是名字与对象的绑定集合，不同命名空间可以存在同名变量而互不干扰。
- 三类命名空间：**内置（Built-in）**、**全局（Global）**、**局部（Local）**；函数调用时还会产生**闭包/嵌套（Enclosing）**。
- **LEGB 查找顺序**：Local → Enclosing → Global → Built-in，逐层向外找，找到即停。
- 函数内部赋值会创建**局部变量**；想改全局变量必须用 `global`，想改外层嵌套变量用 `nonlocal`。
- **函数内只是读取**全局变量，不需要声明；**修改（赋值）** 才需要 `global`。
- 每个模块有自己的全局命名空间；`import` 进来的名字属于该模块命名空间。
- `dir(obj)` 列出对象可见的名字；`globals()` / `locals()` 查看当前命名空间字典。
- 变量在函数内首次赋值的位置决定它是局部还是全局：只要函数内出现赋值，该名字整个函数内都当局部。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `global x` | 声明函数内使用全局 x | `global count` |
| `nonlocal x` | 声明使用外层函数变量 | 嵌套函数里用 |
| `locals()` | 当前局部命名空间字典 | `print(locals())` |
| `globals()` | 当前全局命名空间字典 | `print(globals())` |
| `dir(obj)` | 列出可见属性名 | `dir(__builtins__)` |
| `vars(obj)` | 返回对象 `__dict__` | `vars(obj)` |
| `x = 1`（函数内） | 创建局部变量 | 不声明 global 时 |
| `LEGB` | 变量查找顺序 | Local→Enclosing→Global→Builtin |

## 代码示例

```python
x = "global"          # 全局变量

def read_only():
    print(x)          # 只读：直接用全局的 x

def write_local():
    x = "local"       # 赋值 → 创建局部变量，不影响全局
    print(x)

def write_global():
    global x          # 声明要改全局的 x
    x = "changed"

read_only()           # global
write_local()         # local
print(x)              # global（未被 write_local 影响）
write_global()
print(x)              # changed


# nonlocal：修改外层（非全局）变量
def outer():
    count = 0
    def inner():
        nonlocal count    # 指向 outer 的 count
        count += 1
        return count
    return inner

counter = outer()
print(counter(), counter())   # 1 2


# 局部变量遮蔽：只要函数内有赋值，该名字全程为局部
y = 10
def shadow():
    # print(y)   # 这里会报 UnboundLocalError
    y = 20       # 因为出现赋值，y 被当成局部变量
    print(y)
shadow()         # 20


# 查看命名空间
print(dir())              # 当前模块可见名字
print(locals() is globals())   # 模块顶层，两者通常是同一个
```

## 易错点

- **`UnboundLocalError`**：函数内某处对变量赋值，但又在使用前引用了它，Python 认为它是局部变量导致报错。
- **忘写 `global`**：以为改了全局，其实只是新建了局部变量，全局值没变。
- **`global` 用于只读是多余的**：只读取全局变量不需要声明。
- **嵌套函数里改外层变量必须 `nonlocal`**，写 `global` 会改到全局而非外层。
- **`global` 不能跨越多个函数**，它只指向模块级那个名字。
- **别滥用全局变量**：修改来源分散难追踪，优先用参数和返回值传值。
