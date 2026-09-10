---
title: "Python3 lambda"
tags: [函数]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 lambda

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`lambda` 是只能用**一个表达式**表示的匿名小函数，适合临时传给 `sorted`、`map`、`filter` 等地方，不想为它专门写 `def`。

## 要点

- 语法：`lambda 参数1, 参数2: 表达式`，表达式的结果就是返回值。
- 函数体只能是**单个表达式**，不能有语句、赋值、多行逻辑。
- 匿名：没有名字，通常直接作为参数传入或赋给变量。
- 与普通函数等价，参数支持默认值、`*args`、`**kwargs`。
- 常和 `map`、`filter`、`sorted`、`max`、`min` 的 `key` 搭配。
- 闭包特性同普通函数：能引用外层变量。
- 复杂逻辑别硬塞 `lambda`，可读性差，用 `def` 更好。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `lambda x: x+1` | 单参数 | `(lambda x: x+1)(2)` → 3 |
| `lambda x, y: x+y` | 多参数 | `(lambda x,y: x+y)(1,2)` |
| `lambda *a: sum(a)` | 可变长参数 | `(lambda *a: sum(a))(1,2,3)` |
| `sorted(seq, key=lambda x: ...)` | 自定义排序键 | 按长度排序 |
| `map(f, seq)` | 对每个元素应用 f | 返回迭代器 |
| `filter(f, seq)` | 保留 f 为真的元素 | 返回迭代器 |
| `list(map(...))` | 物化结果 | 转列表查看 |
| `max(seq, key=lambda x: ...)` | 取最大 | 按某字段取最大 |

## 代码示例

```python
# 1. 基本用法：立即调用
add = lambda x, y: x + y
print(add(3, 4))                    # 7
print((lambda x: x * x)(5))         # 25

# 2. 作为排序 key
words = ["apple", "pie", "banana"]
print(sorted(words, key=lambda w: len(w)))
# ['pie', 'apple', 'banana']

# 3. 字典列表按字段排序
users = [{"name": "Tom", "age": 30},
         {"name": "Amy", "age": 25}]
print(sorted(users, key=lambda u: u["age"]))
# [{'name': 'Amy', 'age': 25}, {'name': 'Tom', 'age': 30}]

# 4. map / filter
nums = [1, 2, 3, 4, 5]
print(list(map(lambda x: x * x, nums)))     # [1, 4, 9, 16, 25]
print(list(filter(lambda x: x % 2 == 0, nums)))  # [2, 4]

# 5. 取最大/最小
print(max(users, key=lambda u: u["age"])["name"])  # Tom

# 6. 带默认参数
f = lambda x, y=10: x + y
print(f(5))                         # 15

# 7. 闭包：引用外层变量
def make_adder(n):
    return lambda x: x + n
add5 = make_adder(5)
print(add5(10))                     # 15
```

## 易错点

- `lambda` 体里**不能用赋值**、`print()` 语句等，只能表达式（三元表达式可以）。
- 排序时打错字段名会运行时 `KeyError` / `AttributeError`。
- `map` / `filter` 返回的是**迭代器**，要 `list()` 才能看到内容，且只能消费一次。
- 循环里创建 `lambda` 且引用循环变量，会因后期绑定全取到最后一个值，需用默认参数固定：`lambda x, i=i: x+i`。
- 别为了“短”把多步逻辑塞进 `lambda`，可读性差，该用 `def`。
- `lambda` 无函数名，报错栈里显示 `<lambda>`，调试稍麻烦。
