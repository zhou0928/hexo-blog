---
title: "Python3 解释器"
tags: [基础]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 解释器

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
解释器是执行 Python 代码的程序，最常用的是 CPython，可交互运行也可运行脚本文件。

## 要点
- **CPython**：官方标准实现，用 C 编写，命令行 `python` 调用的就是它。
- **常用实现**：
  - CPython：默认，兼容性最好。
  - PyPy：JIT 加速，纯计算密集任务更快。
  - Jython：运行在 JVM 上。
  - IPython：增强的交互式解释器，支持补全和魔术命令。
- **两种运行方式**：
  1. 交互模式：命令行输入 `python` 进入 `>>>` 提示符，逐行执行。
  2. 脚本模式：`python 文件.py`，从头执行整个文件。
- **提示符**：主提示符 `>>>`，续行提示符 `...`。
- **退出**：`exit()`、`quit()` 或 `Ctrl+D`（Linux/macOS）、`Ctrl+Z`+回车（Windows）。
- **环境变量 PYTHONPATH**：影响模块搜索路径，和 `sys.path` 相关。

## 语法 / 常用方法

| 命令/操作 | 说明 | 示例 |
|---|---|---|
| `python` | 进入交互模式 | `python` |
| `python 文件.py` | 运行脚本 | `python hello.py` |
| `python -c "代码"` | 执行一行代码 | `python -c "print(1)"` |
| `python -m 模块` | 以模块方式运行 | `python -m http.server` |
| `exit()` / `quit()` | 退出交互模式 | `exit()` |
| `sys.executable` | 当前解释器路径 | `import sys; sys.executable` |
| `sys.version` | 解释器版本 | `import sys; sys.version` |
| `#!` shebang | 脚本指定解释器 | `#!/usr/bin/env python3` |

## 代码示例

```python
# 交互模式演示：在 >>> 提示符下逐行输入以下内容

# >>> 1 + 2
# 3
# >>> name = "Python"
# >>> print("Hello", name)
# Hello Python
# >>> exit()

# 脚本模式：以下代码保存为 script.py 后运行 python script.py
import sys

print("解释器版本:", sys.version)
print("解释器实现:", sys.implementation.name)   # cpython
print("可执行文件:", sys.executable)


def main():
    """脚本主逻辑，只有直接运行此文件时才执行"""
    print("正在以脚本方式运行")
    # 读取命令行参数（不含脚本名）
    args = sys.argv[1:]
    if args:
        print("命令行参数:", args)
    else:
        print("没有传入命令行参数")


if __name__ == "__main__":
    main()


# 带 shebang 的可执行脚本写法（Linux/macOS）
# 文件首行写：#!/usr/bin/env python3
# 然后 chmod +x script.py，即可用 ./script.py 直接运行
```

交互式一行命令示例（终端执行）：

```bash
# 直接执行一段代码，常用于快速验证
python3 -c "import sys; print(sys.version)"

# 以模块方式启动一个简单 HTTP 服务器（当前目录）
python3 -m http.server 8000
```

## 易错点
- **`python` vs `python3`**：部分系统 `python` 指向 Python 2，务必确认版本。
- **交互模式不保存**：`>>>` 里输入的代码关掉就没了，正式代码要写入 `.py` 文件。
- **缩进在交互模式更严格**：多行块输入时用空行结束块，容易漏掉。
- **脚本名与标准库重名**：如把自己的文件命名为 `random.py`，会覆盖标准库导致 `import random` 出错。
- **`python -m` 与直接运行区别**：`-m` 会把当前目录加入 `sys.path`，影响导入行为。
- **shebang 路径**：`#!/usr/bin/python3` 写死路径可能失效，推荐 `#!/usr/bin/env python3`。
