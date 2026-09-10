---
title: "Python Pickle 模块"
tags: [数据格式]
group: 高级
date: 2026-09-10 00:00:00
---

# Python Pickle 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`pickle` 把 Python 对象序列化成字节流（可存文件、可传输），也能从字节流反序列化还原成原对象。

## 要点

- 四个核心函数：`dumps`/`loads` 在内存里转字节，`dump`/`load` 对应文件读写。
- 能序列化绝大多数内置类型、嵌套结构、以及自定义类的实例。
- 文件必须用**二进制模式**：写用 `'wb'`，读用 `'rb'`。
- `protocol` 指定协议版本，`pickle.HIGHEST_PROTOCOL` 是当前最高版本，越小兼容性越好。
- **安全警告**：`pickle` 反序列化会执行任意代码，**绝不能加载不可信数据**。
- 不能序列化：`lambda`、打开的文件对象、`socket`、线程锁等（会抛 `PicklingError`/`TypeError`）。
- 自定义类可通过 `__getstate__` / `__setstate__` 控制存取哪些状态。
- `copy.deepcopy` 底层就是用 `pickle` 思路复制对象。
- 跨语言交互不建议用 `pickle`，改用 `json` / `msgpack`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `pickle.dumps(obj)` | 对象 → 字节串 | `b = pickle.dumps(d)` |
| `pickle.loads(data)` | 字节串 → 对象 | `d = pickle.loads(b)` |
| `pickle.dump(obj, f)` | 写入二进制文件 | `pickle.dump(d, f)` |
| `pickle.load(f)` | 从二进制文件读回 | `d = pickle.load(f)` |
| `pickle.HIGHEST_PROTOCOL` | 最高协议版本 | `dumps(d, HIGHEST_PROTOCOL)` |
| `pickle.DEFAULT_PROTOCOL` | 默认协议版本 | 3.8+ 为 4 |
| `protocol=0` | ASCII 文本协议，可读 | 调试时用 |
| `obj.__getstate__()` | 自定义要保存的状态 | 返回可序列化对象 |
| `obj.__setstate__(s)` | 自定义还原状态 | 配合 `__getstate__` |

## 代码示例

```python
import pickle

data = {
    'name': '张三',
    'age': 25,
    'skills': ['Python', 'SQL'],
    'info': {'city': '北京', 'level': 3},
}

# 1. 内存序列化：dumps / loads
raw = pickle.dumps(data)                 # 变成 bytes
print(type(raw), len(raw))               # <class 'bytes'> ...
restored = pickle.loads(raw)
print(restored == data)                  # True

# 2. 文件持久化：dump / load（必须二进制模式）
with open('data.pkl', 'wb') as f:        # 写
    pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)

with open('data.pkl', 'rb') as f:        # 读
    loaded = pickle.load(f)
print(loaded['skills'])

# 3. 自定义类实例也能序列化
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(3, 4)
p2 = pickle.loads(pickle.dumps(p))       # 复制出一个等价对象
print(p2.x, p2.y)                        # 3 4

# 4. 控制序列化内容
class User:
    def __init__(self, name, password):
        self.name = name
        self.password = password
    def __getstate__(self):              # 保存时不带上密码
        state = self.__dict__.copy()
        state.pop('password', None)
        return state
    def __setstate__(self, state):
        self.__dict__.update(state)
        self.password = None

u = pickle.loads(pickle.dumps(User('tom', 'secret')))
print(u.name, u.password)                # tom None
```

## 易错点

- **只信自己的数据**：`pickle.load` 一个恶意文件等于执行对方写的代码，公网/用户上传的数据绝不 pickle。
- 忘记二进制模式：`open('x.pkl', 'w')` 会报 `TypeError: a bytes-like object is required`。
- 协议版本不一致：高版本存、低版本 Python 读会失败，跨环境固定协议或降级。
- `lambda` 和内部函数无法 pickle，要序列化就得改成模块级具名函数。
- 自定义类依赖类的定义：读 pickle 时如果类改名/删字段，会反序列化失败或丢数据。
- 存储格式不跨语言，别拿它当通用交换格式，和别的语言通信选 `json`。
