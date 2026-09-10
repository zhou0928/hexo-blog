---
title: "Python 虚拟环境的创建"
tags: [模块与工程]
group: 基础
date: 2026-09-10 00:00:00
---

# Python 虚拟环境的创建

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

虚拟环境为每个项目隔离出独立的 Python 解释器和第三方包，避免不同项目依赖版本互相冲突。

## 要点

- 不隔离的问题：全局安装的包被所有项目共用，A 项目要 `requests 2.0`、B 项目要 `requests 2.5` 就会打架。
- 主流方案：**venv**（Python3.3+ 内置，最常用）、**virtualenv**（第三方，功能更多）、**conda**（数据科学常用）。
- 创建后需**激活**，激活状态下 `pip install` 只装到该环境，不污染全局。
- 用 `requirements.txt` 记录依赖，方便别人一键复现环境。
- 每个环境就是一个文件夹，删掉文件夹即卸载环境，干净利落。
- 一般把虚拟环境目录（如 `venv/`）写进 `.gitignore`，不要提交。
- Python3.4+ 推荐内置 `venv`，无需额外安装。

## 语法 / 常用方法

| 命令 | 说明 | 示例 |
|---|---|---|
| `python -m venv 名字` | 用 venv 创建环境 | `python3 -m venv venv` |
| `source venv/bin/activate` | 激活（Linux/macOS） | 激活后命令行前缀变 `(venv)` |
| `venv\Scripts\activate` | 激活（Windows） | 用 cmd 执行 |
| `deactivate` | 退出环境 | 回到全局 |
| `pip install 包名` | 装包到当前环境 | `pip install requests` |
| `pip list` | 列出已装包 | `pip list` |
| `pip freeze > requirements.txt` | 导出依赖清单 | 提交给团队 |
| `pip install -r requirements.txt` | 按清单安装 | 复现环境 |
| `python -m virtualenv 名字` | 用 virtualenv 创建 | 需先 `pip install virtualenv` |
| `conda create -n 名字 python=3.11` | conda 创建环境 | 数据科学场景 |
| `conda activate 名字` | 激活 conda 环境 | `conda deactivate` 退出 |

## 代码示例

```bash
# 以下为终端命令，不是 Python 代码

# 1. 进入项目目录
cd myproject

# 2. 创建虚拟环境（venv 是目录名，习惯叫 venv 或 .venv）
python3 -m venv venv

# 3. 激活
#    macOS / Linux:
source venv/bin/activate
#    Windows (cmd):
# venv\Scripts\activate
#    Windows (PowerShell):
# .\venv\Scripts\Activate.ps1

# 激活成功后，命令行提示符前会出现 (venv)

# 4. 环境内安装依赖（只装到这里，不影响系统 Python）
pip install requests

# 5. 查看已安装包
pip list

# 6. 导出依赖清单，交给别人复现
pip freeze > requirements.txt

# 7. 别人拿到项目后一键复现
pip install -r requirements.txt

# 8. 退出虚拟环境
deactivate

# 9. 彻底删除环境：直接删目录即可
rm -rf venv
```

```gitignore
# .gitignore 里加上，别把环境提交到 git
venv/
.venv/
__pycache__/
```

## 易错点

- **忘了激活**：直接 `pip install` 装到了全局，环境白建；先确认提示符出现 `(venv)` 前缀。
- **激活命令因系统而异**：Windows 和 Unix 路径不同，PowerShell 还可能被脚本策略拦住（`Set-ExecutionPolicy`）。
- **创建环境用 `python3 -m venv`**：直接 `python3 venv` 是错的（会把它当脚本找）。
- **虚拟环境目录别提交**：体积大且包含机器相关路径，写进 `.gitignore`。
- **`pip freeze` 会导出所有包**，包括间接依赖；需要精确控制可手动维护 `requirements.txt`。
- **换项目要切环境**：同时开多个终端时，每个终端都要各自激活，环境不会自动切换。
