---
title: "Python3 pip"
tags: [模块与工程]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 pip

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
pip 是 Python 的官方包管理工具，用来从 PyPI 安装、升级、卸载第三方库。

## 要点
- Python 3.4 起自带 pip，随解释器一起安装。
- 基本操作：`install` 装、`uninstall` 卸、`list` 列、`show` 看详情、`freeze` 导出依赖。
- 安装指定版本用 `包名==版本`，装版本范围用 `>=`、`<` 等。
- 换国内镜像能大幅提速，用 `-i` 临时指定或改配置文件永久生效。
- 建议在虚拟环境里装包，避免污染全局环境。
- `requirements.txt` 是团队共享依赖清单，配合 `install -r` 一键安装。

## 语法 / 常用方法

| 命令 | 说明 | 示例 |
|---|---|---|
| `pip install 包` | 安装 | `pip install requests` |
| `pip install 包==版本` | 装指定版本 | `pip install django==4.2` |
| `pip install -r req.txt` | 按清单安装 | `pip install -r requirements.txt` |
| `pip install -U 包` | 升级 | `pip install -U pip` |
| `pip uninstall 包` | 卸载 | `pip uninstall requests` |
| `pip list` | 列出已装包 | `pip list` |
| `pip show 包` | 查看包信息 | `pip show requests` |
| `pip freeze` | 导出已装包及版本 | `pip freeze > requirements.txt` |
| `pip install -i 源 包` | 指定镜像源 | `pip install -i https://pypi.tuna.tsinghua.edu.cn/simple 包` |
| `pip download 包` | 只下载不安装 | `pip download numpy` |

常用国内镜像：清华 `https://pypi.tuna.tsinghua.edu.cn/simple`、阿里 `https://mirrors.aliyun.com/pypi/simple/`。

## 代码示例

```bash
# 查看 pip 版本与对应 Python
python -m pip --version

# 安装 / 升级 / 卸载
pip install requests
pip install -U pip
pip uninstall -y requests          # -y 跳过确认

# 装指定版本
pip install "flask>=2.0,<3.0"

# 用清华镜像加速
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple numpy

# 永久换源：写入配置文件
# Linux/macOS: ~/.pip/pip.conf   Windows: %APPDATA%\pip\pip.ini
# [global]
# index-url = https://pypi.tuna.tsinghua.edu.cn/simple
# trusted-host = pypi.tuna.tsinghua.edu.cn

# 导出与还原依赖
pip freeze > requirements.txt
pip install -r requirements.txt

# 在虚拟环境里操作用 python -m pip，确保装到当前环境
python -m pip install pandas
```

## 易错点
- 有多个 Python 时 `pip` 可能指向别的解释器，用 `python -m pip` 最保险。
- 默认从国外源下载慢且易超时，加 `-i` 镜像源或设 `timeout`。
- 直接 `pip install` 到系统 Python 可能权限报错，别用 `sudo`，改用虚拟环境。
- `pip freeze` 会导出所有包（含间接依赖），只想列直接依赖可手写 requirements。
- 卸载不干净：被其他包依赖的库卸载后可能破坏环境，先看 `pip show` 的 Required-by。
- Windows 下 `pip` 命令找不到时试 `python -m pip`，或检查是否加入 PATH。
