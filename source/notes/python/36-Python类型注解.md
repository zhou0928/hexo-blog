---
title: "Python 类型注解"
tags: [模块与工程]
group: 基础
date: 2026-09-10 00:00:00
---

# Python 类型注解

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

类型注解（type hints）用可读的语法标注变量、参数和返回值的类型，让代码更清晰、IDE 提示更准、静态检查工具能提前发现错误。

## 要点

- 注解只是**提示**，运行时 Python **不强制检查类型**，写错类型不会自动报错。
- 变量注解：`name: str = "Tom"`；函数参数与返回值：`def f(x: int) -> str:`。
- 复杂类型用 `typing` 模块：`List`、`Dict`、`Tuple`、`Optional`、`Union`、`Callable`、`Any`。
- `Optional[X]` 等价于 `Union[X, None]`，表示「可能是 X 或 None」。
- Python3.9+ 可直接用内置泛型：`list[int]`、`dict[str, int]`，无需导入 `typing`。
- Python3.10+ 用 `X | Y` 表示联合类型，`X | None` 替代 `Optional[X]`。
- `from __future__ import annotations` 可让注解延迟求值，避免前向引用问题。
- 用 `mypy`、`pyright` 等工具做静态检查，把注解变成真正的保障。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `x: int = 1` | 变量注解 | `count: int = 0` |
| `def f(a: int) -> str:` | 参数与返回值注解 | 返回字符串 |
| `def f() -> None:` | 无返回值 | 只做副作用 |
| `List[int]` | 整数列表 | `from typing import List` |
| `Dict[str, int]` | 键值类型 | `{"a": 1}` |
| `Tuple[int, str]` | 定长元组 | `(1, "x")` |
| `Set[str]` | 字符串集合 | `{"a"}` |
| `Optional[int]` | int 或 None | `Union[int, None]` |
| `Union[int, str]` | 二选一 | `int | str`（3.10+） |
| `Callable[[int], str]` | 可调用对象 | 函数类型 |
| `Any` | 任意类型，跳过检查 | `from typing import Any` |
| `Sequence` / `Iterable` | 抽象容器/可迭代 | 接收更宽泛类型 |
| `list[int]` | 内置泛型（3.9+） | 不用 import |
| `X | None` | 联合类型（3.10+） | `int | None` |

## 代码示例

```python
from typing import Optional, List, Dict, Union, Callable

# 1. 变量注解
name: str = "Tom"
age: int = 18
score: float = 95.5
is_ok: bool = True

# 2. 函数注解：参数 + 返回值
def greet(name: str, times: int = 1) -> str:
    return ("你好 " + name + "! ") * times

print(greet("小明", 2))

# 3. 容器类型
def total(nums: List[int]) -> int:
    return sum(nums)

def count_words(text: str) -> Dict[str, int]:
    result: Dict[str, int] = {}
    for w in text.split():
        result[w] = result.get(w, 0) + 1
    return result

print(total([1, 2, 3]))
print(count_words("a b a"))     # {'a': 2, 'b': 1}

# 4. Optional / Union
def find_user(uid: int) -> Optional[str]:
    return "admin" if uid == 1 else None   # 可能返回 None

def parse(x: Union[int, str]) -> int:
    return int(x)

print(find_user(2))             # None
print(parse("42"))

# 5. Callable：接收一个函数
def apply(fn: Callable[[int], int], value: int) -> int:
    return fn(value)

print(apply(lambda x: x * 2, 10))   # 20

# 6. Python3.9+ 内置泛型 / 3.10+ 联合类型
def average(values: list[float]) -> float:
    return sum(values) / len(values)

def tag(value: int | None = None) -> str:
    return "无" if value is None else str(value)

print(average([1.0, 2.0, 3.0]))   # 2.0
print(tag())                      # 无
```

## 易错点

- **注解不强制**：`def f(x: int): return x + 1` 传字符串照样运行，要靠 mypy 等工具检查。
- **默认值 `None` 但要接收 None**：参数默认 `None` 时类型应写 `Optional[X]`，否则静态检查会警告。
- **可变类型别省略**：`List[int]` 不能写 `List`（部分检查器允许但失去精度）。
- **运行时访问注解**：`f.__annotations__` 存的是对象，用字符串前向引用要用 `from __future__ import annotations` 或引号包裹。
- **`Union[int, str]` 不等于 `int | str` 永远可换**：旧版本 Python 不支持 `|` 语法，注意目标版本。
- **`Any` 是逃生舱**：过度使用会让类型检查形同虚设，能用具体类型就别用 `Any`。
