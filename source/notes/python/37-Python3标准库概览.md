---
title: "Python3 标准库概览"
tags: [模块与工程]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 标准库概览

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

「自带电池」的 Python 内置了大量模块，覆盖文件、系统、网络、日期、正则、数据格式、加密等场景，学会常用模块能省下大量造轮子的时间。

## 要点

- 标准库随 Python 一起安装，`import` 即用，无需 `pip`。
- 按用途记两大类：**通用工具**（os/sys/math/random/datetime/json/re）和**领域工具**（socket/urllib/sqlite3/hashlib/logging）。
- 学会「按需求找模块」比背 API 重要：需要什么先想标准库有没有。
- 查看帮助：`help(模块)`、`dir(模块)`、官方文档 docs.python.org/3/library/。
- 大多数模块要显式 `import`，但 `math`、`json` 这类常用模块几乎每个项目都会遇到。

## 语法 / 常用方法

| 模块 | 用途 | 常用对象/方法 |
|---|---|---|
| `os` | 操作系统/文件路径 | `os.path.join`、`os.listdir`、`os.getcwd` |
| `sys` | 解释器/命令行 | `sys.argv`、`sys.exit`、`sys.path` |
| `math` | 数学函数 | `math.sqrt`、`math.pi`、`math.floor` |
| `random` | 随机数 | `random.randint`、`random.choice`、`random.shuffle` |
| `datetime` | 日期与时间 | `datetime.now`、`timedelta`、`strftime` |
| `time` | 时间戳/延时 | `time.time`、`time.sleep` |
| `json` | JSON 编解码 | `json.dumps`、`json.loads` |
| `re` | 正则表达式 | `re.match`、`re.findall`、`re.sub` |
| `collections` | 增强容器 | `Counter`、`defaultdict`、`deque`、`namedtuple` |
| `itertools` | 迭代器工具 | `chain`、`product`、`groupby`、`count` |
| `functools` | 函数工具 | `reduce`、`lru_cache`、`partial` |
| `pathlib` | 面向对象路径 | `Path`、`Path.glob`、`read_text` |
| `hashlib` | 哈希/摘要 | `md5`、`sha256` |
| `statistics` | 统计计算 | `mean`、`median`、`stdev` |
| `logging` | 日志 | `logging.info`、`basicConfig` |
| `argparse` | 命令行参数解析 | `ArgumentParser`、`add_argument` |
| `sqlite3` | 内置轻量数据库 | `connect`、`execute` |
| `urllib` | URL/HTTP 请求 | `urllib.request.urlopen` |
| `socket` | 底层网络 | `socket.socket` |
| `subprocess` | 调用外部命令 | `subprocess.run` |
| `csv` | CSV 读写 | `csv.reader`、`csv.writer` |
| `io` | 流式 IO | `StringIO`、`BytesIO` |
| `pickle` | 对象序列化 | `pickle.dumps`、`pickle.load` |
| `threading` | 线程 | `Thread`、`Lock` |
| `asyncio` | 异步编程 | `run`、`create_task` |
| `uuid` | 唯一 ID | `uuid.uuid4` |
| `zlib` / `gzip` | 压缩 | `zlib.compress`、`gzip.open` |
| `webbrowser` | 打开浏览器 | `webbrowser.open` |
| `pprint` | 美观打印 | `pprint.pprint` |
| `shutil` | 高级文件操作 | `copy`、`move`、`rmtree` |

## 代码示例

```python
# 几个最常打交道的标准库速览
import os, sys, math, random
from datetime import datetime, timedelta
import json
from collections import Counter

# os / sys：环境与系统
print(os.getcwd())
print("启动参数:", sys.argv[:1])   # 处理命令行参数用 argparse 更规范

# math：数学
print(math.sqrt(16), math.floor(3.7), round(math.pi, 2))   # 4.0 3 3.14

# random：随机
print(random.randint(1, 6))          # 掷骰子
print(random.choice(["石头", "剪刀", "布"]))

# datetime：日期时间
now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))
print((now + timedelta(days=7)).date())   # 一周后

# json：字符串与对象互转
data = {"name": "Tom", "age": 18}
s = json.dumps(data, ensure_ascii=False)
print(s)                             # {"name": "Tom", "age": 18}
print(json.loads(s)["name"])         # Tom

# collections：统计词频
words = "a b a c a b".split()
print(Counter(words))                # Counter({'a': 3, 'b': 2, 'c': 1})
```

## 易错点

- **变量名别和模块重名**：`import random` 后又 `random = 5`，之后 `random.randint` 就报错。
- **`os` vs `os.path`**：路径操作在 `os.path` 下，别写成 `os.join`（不存在）。
- **`datetime` 是模块也是类**：`import datetime` 后用 `datetime.datetime.now()`；`from datetime import datetime` 后直接用 `datetime.now()`，两种写法别混。
- **`random` 不加密安全**：涉及密码/令牌用 `secrets` 模块。
- **`json.dumps` 中文默认转义**：加 `ensure_ascii=False` 才显示中文。
- **标准库选择有偏好**：新代码路径操作用 `pathlib`，命令调用用 `subprocess.run` 而非 `os.system`。
