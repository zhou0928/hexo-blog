---
title: "Python sys 模块"
tags: [模块与工程]
group: 高级
date: 2026-09-10 00:00:00
---

# Python sys 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`sys` 模块直接与 Python 解释器打交道：读命令行参数、控制标准输入输出、调整模块搜索路径、退出程序，都靠它。

## 要点

- `sys.argv`：命令行参数列表，**第 0 个是脚本名**，其后才是用户传入的参数。
- `sys.exit([code])`：退出程序，本质是抛出 `SystemExit`；`0` 表示正常，非 `0` 表示出错。
- `sys.path`：模块搜索路径列表，运行时可 `append`/`insert` 动态加目录。
- `sys.stdin` / `sys.stdout` / `sys.stderr`：三个标准流，可重定向。
- `sys.version` 返回字符串，`sys.version_info` 返回可比较的元组。
- `sys.platform`：平台标识（`darwin` / `win32` / `linux`）。
- `sys.modules`：已加载模块的字典，可用来判断模块是否已导入。
- `sys.getsizeof(obj)`：对象占用字节数（含解释器开销，非精确内存）。
- `sys.maxsize`：当前平台 `Py_ssize_t` 最大值，常当“无限大”用。
- `sys.setrecursionlimit()` / `sys.getrecursionlimit()`：读写递归深度上限。
- `sys.getdefaultencoding()`：解释器默认编码，通常是 `utf-8`。
- `sys.exc_info()`：返回当前异常三元组 `(类型, 值, traceback)`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `sys.argv` | 命令行参数列表 | `sys.argv[1:]` 取用户参数 |
| `sys.exit(code)` | 退出程序 | `sys.exit(1)` |
| `sys.path` | 模块搜索路径 | `sys.path.insert(0, './lib')` |
| `sys.stdin` | 标准输入流 | `sys.stdin.readline()` |
| `sys.stdout` | 标准输出流 | `sys.stdout.write('hi')` |
| `sys.stderr` | 标准错误流 | `print('err', file=sys.stderr)` |
| `sys.version` | 版本字符串 | `'3.12.0 ...'` |
| `sys.version_info` | 版本元组 | `sys.version_info >= (3, 8)` |
| `sys.platform` | 平台名 | `'darwin'` |
| `sys.modules` | 已加载模块字典 | `'os' in sys.modules` |
| `sys.getsizeof(obj)` | 对象字节大小 | `sys.getsizeof([1,2])` |
| `sys.maxsize` | 最大整型值 | `2**63-1` |
| `sys.setrecursionlimit(n)` | 设置递归上限 | `sys.setrecursionlimit(5000)` |
| `sys.getrecursionlimit()` | 读取递归上限 | 默认 1000 |
| `sys.getdefaultencoding()` | 默认编码 | `'utf-8'` |
| `sys.exc_info()` | 当前异常信息 | 在 `except` 中调用 |
| `sys.executable` | 解释器可执行文件路径 | 子进程调用自己时用 |
| `sys.byteorder` | 字节序 | `'little'` / `'big'` |

## 代码示例

```python
import sys

# 1. 命令行参数：python script.py a b
print('脚本名:', sys.argv[0])
print('用户参数:', sys.argv[1:])          # 从下标 1 开始才是真正的参数

# 2. 版本与平台
print('版本:', sys.version_info)          # sys.version_info(major=3, ...)
if sys.version_info < (3, 8):
    sys.exit('需要 Python 3.8 及以上')

# 3. 模块搜索路径：临时加一个目录
sys.path.append('./mylib')
print('路径条数:', len(sys.path))

# 4. 标准流：输出到 stderr（错误信息）
print('这行会走标准错误', file=sys.stderr)

# 5. 已加载模块
print('os 已加载:', 'os' in sys.modules)

# 6. 对象大小与上限
print('列表占用字节:', sys.getsizeof([1, 2, 3]))
print('递归上限:', sys.getrecursionlimit())

# 7. 正常退出（0 表示成功）
if len(sys.argv) < 2:
    print('未传参数，正常结束')
    sys.exit(0)
```

## 易错点

- `sys.argv[0]` 是脚本名，不是第一个参数；取用户参数应从 `sys.argv[1:]` 开始，且要防越界。
- `sys.exit(1)` 是主动退出，不是崩溃；在 `try` 里会被 `except SystemExit` 捕获，别乱吞。
- `sys.path` 修改只影响当前进程，重启即失效；别把它当永久配置。
- `sys.modules` 里存在某模块不代表导入成功（可能是半初始化状态），判断“是否装了”应更谨慎。
- `sys.getsizeof` 只算对象本身，不含它引用的子对象，别用来估算整个数据结构的真实内存。
- 改 `sys.setrecursionlimit` 只是放宽上限，过深仍可能让 C 栈溢出崩溃，递归深还是要改迭代。
