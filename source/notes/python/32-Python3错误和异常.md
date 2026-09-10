---
title: "Python3 错误和异常"
tags: [异常处理]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 错误和异常

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

用 `try/except/finally` 捕获并处理运行时错误，用 `raise` 主动抛异常，让程序出错时优雅降级而不是直接崩溃。

## 要点

- **语法错误（SyntaxError）** 在编译阶段就被发现，**异常（Exception）** 在运行时才抛出。
- 结构：`try` 里放可能出错的代码，`except` 捕获特定异常，`else` 无异常时执行，`finally` 无论成败都执行。
- `except` 可以捕获多个异常，也可写元组 `except (ValueError, TypeError):`。
- 异常是类，继承自 `BaseException`；日常业务异常都继承 `Exception`。
- `raise` 主动抛出异常，`raise ... from e` 保留原始异常链（更清晰）。
- 自定义异常：继承 `Exception` 写自己的异常类。
- `assert` 是调试断言，生产环境会被 `-O` 优化掉，别用它做输入校验。
- 常见内置异常：`ValueError`、`TypeError`、`KeyError`、`IndexError`、`ZeroDivisionError`、`FileNotFoundError`、`AttributeError`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `try / except E` | 捕获指定异常 | `except ValueError:` |
| `except E as e` | 捕获并拿到异常对象 | `except Exception as e:` |
| `except (A, B):` | 一次捕获多种异常 | `except (ValueError, TypeError):` |
| `else` | try 无异常时执行 | 跟在 except 后 |
| `finally` | 无论如何都执行，常用于清理 | `finally: f.close()` |
| `raise E("msg")` | 主动抛出异常 | `raise ValueError("不能为空")` |
| `raise E from e` | 抛出并保留异常链 | `raise RuntimeError("x") from e` |
| `class MyError(Exception)` | 自定义异常 | `pass` |
| `assert cond, msg` | 断言，失败抛 `AssertionError` | `assert n > 0` |
| `e.args` | 异常参数元组 | `e.args[0]` |

## 代码示例

```python
# 1. 基础 try/except
try:
    n = int("abc")          # 抛 ValueError
except ValueError as e:
    print("转换失败:", e)     # 转换失败: invalid literal for int()...

# 2. 捕获多种异常 + else + finally
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("除数不能为 0")
        return None
    except TypeError as e:
        print("类型错误:", e)
        return None
    else:
        print("计算成功")       # 只有没异常才走这里
        return result
    finally:
        print("-- 计算结束 --")  # 无论如何都执行

print(divide(10, 2))   # 计算成功 / 5.0
print(divide(10, 0))   # 除数不能为 0 / None

# 3. 主动抛出异常
def set_age(age):
    if age < 0:
        raise ValueError(f"年龄不能为负: {age}")
    return age

try:
    set_age(-1)
except ValueError as e:
    print("捕获:", e)

# 4. 自定义异常
class BalanceError(Exception):
    """余额不足"""
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise BalanceError(f"余额 {balance} 不足，需 {amount}")
    return balance - amount

try:
    withdraw(100, 200)
except BalanceError as e:
    print("业务异常:", e)
```

## 易错点

- **裸 `except:` 或 `except Exception:` 吞掉一切**：会连 `KeyboardInterrupt` 外的错误都隐藏，尽量捕获具体异常。
- **`except` 顺序**：父类异常放后面，否则子类分支永远走不到（如先 `Exception` 再 `ValueError` 是错的）。
- **`finally` 里有 `return`** 会覆盖 `try` 里的 `return`，导致结果意外。
- **`assert` 不是校验**：运行时加 `-O` 会被跳过，用户输入校验用 `if + raise`。
- **异常变量作用域**：Python3 中 `except E as e` 的 `e` 在 except 块结束后会被删除。
- **别滥用异常做流程控制**：正常分支用 `if`，异常只处理真正异常情况。
