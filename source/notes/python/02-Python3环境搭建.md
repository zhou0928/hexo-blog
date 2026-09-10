---
title: "Python3 环境搭建"
tags: [基础]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 环境搭建

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
安装 Python 解释器并配置好 `python`/`pip` 命令，就能在本地运行和安装第三方库。

## 要点
- **三平台安装**：Windows 用官网安装包，macOS 可用官网包或 `brew install python3`，Linux 多用包管理器 `apt`/`yum`。
- **官方下载**：https://www.python.org/downloads/
- **勾选 PATH**：Windows 安装时务必勾选 `Add Python to PATH`，否则命令行找不到 `python`。
- **验证安装**：命令行输入 `python --version` 或 `python3 --version`。
- **pip**：Python 自带的包管理工具，随 Python 3.4+ 一起安装。
- **虚拟环境**：每个项目用独立环境，避免依赖冲突，推荐 `venv`。
- **IDLE**：Python 自带的简易编辑器，适合初学者测试。

## 语法 / 常用方法

| 命令 | 说明 | 示例 |
|---|---|---|
| `python --version` | 查看 Python 版本 | `python3 --version` |
| `pip --version` | 查看 pip 版本 | `pip3 --version` |
| `pip install 包名` | 安装第三方库 | `pip install requests` |
| `python -m venv 名称` | 创建虚拟环境 | `python -m venv venv` |
| `pip list` | 列出已安装的包 | `pip list` |
| `pip uninstall 包名` | 卸载包 | `pip uninstall requests` |
| `python 文件.py` | 运行脚本文件 | `python hello.py` |

## 代码示例

```python
# 环境搭建成功后，用这段代码做自检
import sys

print("Python 版本:", sys.version)          # 完整版本信息
print("版本号:", sys.version_info)          # 结构化版本元组
print("解释器路径:", sys.executable)        # 当前解释器可执行文件位置

# 检查第三方库是否可用（以 requests 为例）
try:
    import requests
    print("requests 版本:", requests.__version__)
except ImportError:
    print("requests 未安装，请执行: pip install requests")

# 打印模块搜索路径
print("模块搜索路径:")
for p in sys.path:
    print(" ", p)
```

命令行搭建流程（非 Python 代码）：

```bash
# macOS / Linux
python3 --version                  # 确认已安装
python3 -m venv venv               # 创建虚拟环境
source venv/bin/activate           # 激活（Linux/macOS）
pip install requests               # 安装第三方库
deactivate                         # 退出虚拟环境

# Windows (PowerShell)
python --version
python -m venv venv
venv\Scripts\activate
pip install requests
deactivate
```

## 易错点
- **命令名不同**：macOS/Linux 上常是 `python3`/`pip3`，Windows 上是 `python`/`pip`。
- **忘记勾选 PATH**：Windows 装完输入 `python` 提示“不是内部或外部命令”，需重装或手动加环境变量。
- **误装到全局**：不激活虚拟环境直接 `pip install`，会把包装到系统 Python 里，长期污染环境。
- **权限报错**：Linux/macOS 下不要盲目 `sudo pip install`，优先用虚拟环境。
- **多版本共存**：机器上同时有 Py2 和 Py3 时，明确用 `python3` 调用。
