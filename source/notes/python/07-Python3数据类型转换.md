---
title: "Python3 数据类型转换"
tags: [数据类型]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 数据类型转换

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用内置函数在数字、字符串、序列、容器之间显式转换类型，是处理输入和混合运算的基础。

## 要点
- **显式转换**：调用构造函数，如 `int("10")`、`list("abc")`。
- **隐式转换**：解释器在混合运算时自动提升，如 `1 + 2.0` 得到 `3.0`。
- **数字类**：`int()`、`float()`、`complex()` 互转。
- **字符串类**：`str()` 任意对象转字符串，`repr()` 求可读表达式。
- **序列类**：`list()`、`tuple()`、`set()` 可在可迭代对象间转换。
- **判断类**：`chr()` 码点转字符，`ord()` 字符转码点。
- **进制转换**：`bin()` 二进制、`oct()` 八进制、`hex()` 十六进制，返回带前缀字符串。
- **转换失败**：非法内容会抛 `ValueError`，需提前校验或 try 捕获。

## 语法 / 常用方法

| 函数 | 说明 | 示例 | 结果 |
|---|---|---|---|
| `int()` | 转整数 | `int("10")` | `10` |
| `float()` | 转浮点 | `float("3.14")` | `3.14` |
| `complex()` | 转复数 | `complex(1, 2)` | `(1+2j)` |
| `str()` | 转字符串 | `str(123)` | `'123'` |
| `bool()` | 转布尔 | `bool(0)` | `False` |
| `list()` | 转列表 | `list("abc")` | `['a','b','c']` |
| `tuple()` | 转元组 | `tuple([1,2])` | `(1, 2)` |
| `set()` | 转集合 | `set([1,1,2])` | `{1, 2}` |
| `dict()` | 转字典 | `dict([("a",1)])` | `{'a': 1}` |
| `chr()` | 码点转字符 | `chr(65)` | `'A'` |
| `ord()` | 字符转码点 | `ord('A')` | `65` |
| `bin/oct/hex` | 进制字符串 | `hex(255)` | `'0xff'` |

## 代码示例

```python
# 数字互转
print(int(3.9))          # 3，浮点转 int 直接截断，不四舍五入
print(float(5))          # 5.0
print(complex(1, 2))     # (1+2j)

# 隐式转换：int 自动提升为 float
print(1 + 2.0)           # 3.0
print(type(1 + 2.0))     # <class 'float'>

# 字符串转数字
print(int("100") + 1)    # 101
print(float("3.14") * 2) # 6.28

# 数字转字符串
print("编号" + str(101)) # 编号101

# 可迭代对象互转
print(list("abc"))       # ['a', 'b', 'c']
print(tuple([1, 2, 3]))  # (1, 2, 3)
print(set([1, 1, 2, 3])) # {1, 2, 3} 去重
print(dict([("a", 1), ("b", 2)]))  # {'a': 1, 'b': 2}

# 字符与码点
print(chr(65), chr(97))  # A a
print(ord("A"), ord("a"))# 65 97

# 进制转换
print(bin(10))           # 0b1010
print(oct(8))            # 0o10
print(hex(255))          # 0xff

# bool 转换：0、空串、空容器、None 都为 False
print(bool(0), bool(""), bool([]), bool(None))  # False False False False
print(bool(-1), bool("0"), bool([0]))           # True True True

# 安全转换：捕获异常
def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(to_int("42"))      # 42
print(to_int("abc"))     # None
```

## 易错点
- **`int("3.14")` 报错**：字符串里是浮点写法时，要先 `float()` 再 `int()`。
- **截断不等于四舍五入**：`int(3.9)` 是 3，要四舍五入用 `round(3.9)`。
- **`str()` 与 `repr()` 区别**：`str` 面向用户，`repr` 面向调试，容器打印用 `repr`。
- **空值判断**：`bool("0")` 为 `True`，因为非空字符串都算真。
- **进制函数返回字符串**：`bin(10)` 是 `'0b1010'`，不能直接参与运算。
- **字典转换格式**：`dict()` 需要键值对序列或关键字参数，普通列表不能直接转。
