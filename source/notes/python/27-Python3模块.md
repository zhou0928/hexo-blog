---
title: "Python3 模块"
tags: [模块与工程]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

模块就是一个 `.py` 文件，里面放着可复用的函数、类和变量，用 `import` 引进来使用，是 Python 组织代码的基本单位。

## 要点

- 一个 `.py` 文件即一个模块；一个文件夹含 `__init__.py` 即一个**包**。
- `import 模块` 导入整个模块，用 `模块.名` 访问。
- `from 模块 import 名` 只导入指定成员，直接用名字。
- `from 模块 import *` 导入所有公开成员（慎用，易污染命名空间）。
- `import 模块 as 别名` / `from 模块 import 名 as 别名` 起别名。
- 模块首次导入时**执行一遍**，之后从 `sys.modules` 缓存取，不再重跑。
- 搜索路径：当前目录 → `PYTHONPATH` → 安装目录，可用 `sys.path` 查看。
- `dir(模块)` 列出模块内名字；`__name__` 是模块名。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `import math` | 导入整个模块 | `math.sqrt(4)` |
| `from math import sqrt` | 导入指定成员 | `sqrt(4)` |
| `import numpy as np` | 起别名 | `np.array([1])` |
| `from math import *` | 导入全部（避免） | 污染命名空间 |
| `dir(mod)` | 列出模块成员 | `dir(math)` |
| `sys.path` | 模块搜索路径列表 | `import sys` |
| `__name__` | 模块的名字 | 主程序为 `"__main__"` |
| `__all__ = [...]` | 定义 `import *` 导出的名单 | 控制公开 API |
| `importlib.reload(m)` | 重新加载模块 | 调试用 |

## 代码示例

```python
# ---------- 假设有文件 mymodule.py ----------
# def add(a, b):
#     return a + b
#
# if __name__ == "__main__":
#     print(add(1, 2))

# 1. 导入整个模块，用前缀访问
import math
print(math.pi)              # 3.141592653589793
print(math.sqrt(16))        # 4.0

# 2. 从模块导入指定成员
from math import sqrt, pow
print(sqrt(25))             # 5.0
print(pow(2, 3))            # 8.0

# 3. 起别名
import math as m
from math import sqrt as sq
print(m.floor(3.8))         # 3
print(sq(9))                # 3.0

# 4. 自定义模块的导入（同目录下有 mymodule.py）
# import mymodule
# print(mymodule.add(3, 4))          # 7

# 5. 查看模块成员与路径
import sys
print(dir(math)[:5])        # ['__doc__', '__file__', ...]
print(sys.path[0])          # 当前目录

# 6. 包：mypkg/__init__.py + mypkg/util.py
# from mypkg import util
# from mypkg.util import helper

# 7. 控制 import * 的导出内容
# 在模块中写：
# __all__ = ["add", "sub"]   # 只有这两个会被 import * 导入
```

## 易错点

- 模块名别和标准库重名（如自定义 `random.py` 会遮蔽标准库）。
- `import *` 难追踪来源，且会覆盖同名变量，生产代码避免。
- 模块只在**首次导入**执行一次，改动后需重启或 `importlib.reload`。
- 循环导入（A 导 B，B 又导 A）会报错或拿到半成品模块，需重构依赖。
- 找不到自定义模块时检查 `sys.path`，或把目录加入 `PYTHONPATH`。
- 包必须有 `__init__.py`（命名空间包除外）才会被识别为常规包。
- 模块顶层别放耗时/有副作用的代码，导入时会执行。
