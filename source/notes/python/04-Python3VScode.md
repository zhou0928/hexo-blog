---
title: "Python3 VScode"
tags: [基础]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 VScode

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
VS Code 是微软的轻量级跨平台编辑器，配合 Python 扩展即可成为功能完整的 Python 开发环境。

## 要点
- **官方下载**：https://code.visualstudio.com/
- **必装扩展**：Python（微软官方，含 Pylance 语言服务）、Pylance、Jupyter（可选）。
- **选择解释器**：`Ctrl+Shift+P` → `Python: Select Interpreter`，选中项目虚拟环境。
- **运行方式**：右上角运行按钮、右键 Run Python File、或终端里 `python 文件.py`。
- **调试**：左侧 Run and Debug 面板，创建 `launch.json` 配置断点调试。
- **终端集成**：内置终端自动激活虚拟环境，可直接运行 pip。
- **轻量灵活**：相比 PyCharm 启动快、占用小，适合脚本和中小项目。

## 语法 / 常用方法

| 操作 | 说明 | 快捷键 (Win / macOS) |
|---|---|---|
| 命令面板 | 打开所有命令 | `Ctrl+Shift+P` / `Cmd+Shift+P` |
| 运行当前文件 | 运行 Python | `Ctrl+F5` / 视配置而定 |
| 调试 | 启动调试 | `F5` / `F5` |
| 终端 | 打开集成终端 | ``Ctrl+` `` / ``Cmd+` `` |
| 格式化 | 格式化文档 | `Shift+Alt+F` / `Shift+Opt+F` |
| 全局搜索 | 跨文件搜索 | `Ctrl+Shift+F` / `Cmd+Shift+F` |
| 转到定义 | 跳到函数/类定义 | `F12` / `F12` |

## 代码示例

```python
# 在 VS Code 中新建 demo.py，装好 Python 扩展后按运行按钮执行

import platform


def show_env():
    """打印当前运行环境信息"""
    print("系统:", platform.system())        # Darwin / Windows / Linux
    print("版本:", platform.python_version())


def fibonacci(n: int):
    """生成前 n 个斐波那契数，演示断点调试"""
    seq = []
    a, b = 0, 1
    for _ in range(n):
        seq.append(a)        # 在此行设断点，用 F5 调试观察 a、b
        a, b = b, a + b
    return seq


if __name__ == "__main__":
    show_env()
    print("斐波那契:", fibonacci(10))


# 演示 Pylance 的智能提示与类型检查
def greet(name: str) -> str:
    return f"Hello, {name}"


print(greet("VS Code"))
```

`launch.json` 调试配置示例：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: 当前文件",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal"
        }
    ]
}
```

## 易错点
- **没装 Python 扩展**：不装扩展时没有补全、调试和运行按钮。
- **解释器未选**：默认可能指向系统 Python，导致第三方库找不到，需手动选虚拟环境。
- **Pylance 报红**：类型不匹配会以波浪线提示，是工具建议而非语法错误，可按需忽略。
- **终端环境不一致**：外部终端没激活 venv 时，运行结果和 VS Code 内部可能不同。
- **launch.json 路径**：`${file}` 表示当前打开文件，配置错会导致调试启动失败。
