---
title: "Python3 字典"
tags: [数据类型, 容器]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 字典

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
字典（dict）是键值对（key-value）的无序/有序映射，用 `{}` 定义，键必须可哈希且唯一，3.7+ 按插入顺序迭代。

## 要点
- **键值对**：键唯一、不可变且可哈希（str、int、tuple 等）；值任意类型。
- **键重复**：后写的覆盖先写的，只保留最后一个。
- **查找 O(1)**：基于哈希表，平均常数时间；`d[key]` 找不到报 `KeyError`。
- **安全取值**：用 `get(key, default)` 避免 KeyError。
- **遍历**：`d.keys()` / `d.values()` / `d.items()`，或用 `for k, v in d.items()`。
- **3.7+ 有序**：按插入顺序保留，`3.6` 是 CPython 实现细节，`3.7` 起为语言保证。
- **可变**：可增删改键值对；`del`、`pop`、`popitem`、`clear` 删除。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `d = {"a": 1}` | 定义字典 | `dict(a=1)` 也可 |
| `d[k]` | 取键 k 的值 | 键不存在报 KeyError |
| `d[k] = v` | 新增 / 修改 | 键在则覆盖 |
| `d.get(k[, default])` | 安全取值，无则返回 default | `d.get("x", 0)` |
| `d.keys()` | 返回所有键的视图 | `list(d.keys())` |
| `d.values()` | 返回所有值的视图 | — |
| `d.items()` | 返回 (键, 值) 视图 | `for k,v in d.items()` |
| `d.pop(k[, default])` | 删除并返回值 | 无键且无默认报错 |
| `d.popitem()` | 删除并返回最后一个键值对 | LIFO 顺序 |
| `d.setdefault(k, v)` | 键存在返回值，否则插入 v 并返回 v | 常用初始化 |
| `d.update(other)` | 用另一字典/键值对更新 | 覆盖同名键 |
| `d.clear()` | 清空 | → `{}` |
| `d.copy()` | 浅拷贝 | 独立顶层 |
| `dict.fromkeys(keys, v)` | 由键序列建字典，值默认 None | `dict.fromkeys("ab", 0)` |
| `k in d` / `k not in d` | 键是否存在 | 判断用这个，别用 values |
| `len(d)` | 键值对个数 | — |
| `del d[k]` | 删除键（语句） | 越界报 KeyError |
| `d1 \| d2` / `d1.update(d2)` | 合并字典（3.9+ `\|`） | 返回新字典 |

## 代码示例

```python
# ---- 创建 ----
d = {"name": "小明", "age": 18}
print(d)                     # {'name': '小明', 'age': 18}
d2 = dict(a=1, b=2)          # 关键字建字典
print(d2)                    # {'a': 1, 'b': 2}
keys_only = dict.fromkeys(["x", "y"], 0)
print(keys_only)             # {'x': 0, 'y': 0}

# ---- 访问 ----
print(d["name"])             # 小明
print(d.get("score"))        # None   不报错
print(d.get("score", 100))   # 100    给默认值

# ---- 增 / 改 ----
d["age"] = 19                # 修改
d["city"] = "北京"           # 新增
d.update({"age": 20, "job": "工程师"})
print(d)                     # 覆盖 age，新增 job

# ---- 删 ----
removed = d.pop("job")       # 删除并返回指定键的值
print(removed)               # 工程师
last = d.popitem()           # 弹出最后插入的键值对（city）
print(last)                  # ('city', '北京')
del d["age"]                 # 用 del 删除指定键
print(d)                     # {'name': '小明'}

# ---- 遍历 ----
for k in d.keys():
    print("键:", k)
for v in d.values():
    print("值:", v)
for k, v in d.items():       # 最常用
    print(k, "=>", v)

# ---- setdefault 初始化计数 ----
words = ["a", "b", "a", "c", "a"]
count = {}
for w in words:
    count[w] = count.get(w, 0) + 1     # 或 setdefault
print(count)                 # {'a': 3, 'b': 1, 'c': 1}

# ---- 字典推导式 ----
squares = {x: x * x for x in range(4)}
print(squares)               # {0: 0, 1: 1, 2: 4, 3: 9}

# ---- 合并（3.9+）----
m = {"a": 1} | {"b": 2}
print(m)                     # {'a': 1, 'b': 2}
```

## 易错点
- **`d[key]` 找不到报 KeyError**：不确定时用 `get()` 或先 `in` 判断。
- **键必须可哈希**：列表、字典不能作键，元组可以（元素须可哈希）。
- **`d.keys()` 等返回视图不是列表**：要列表用 `list(d.keys())`；视图会随字典变动。
- **直接赋值是别名**：`d2 = d` 共享同一字典，改一个两个都变；用 `d.copy()`。
- **`copy()` 是浅拷贝**：嵌套字典仍共享内层。
- **遍历时改字典报错**：`for k in d:` 中增删键抛 `RuntimeError`，先收集键再改。
- **`in` 判断的是键**：`1 in {1: "a"}` 是 True；判断值要 `1 in d.values()`。
- **自动补全记忆**：`d[k] = d.get(k, 0) + 1` 是计数惯用法。
