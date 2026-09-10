---
title: "Python3 OS"
tags: [文件与IO]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 OS

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`os` 模块让你用 Python 操作文件系统、目录、环境变量和进程，是跨平台处理路径与文件的核心工具。

## 要点

- `os` 提供与操作系统交互的接口，`os.path` 专门处理路径（跨平台拼接、判断、拆分）。
- 路径拼接永远用 `os.path.join()`，不要手动拼 `"/"`，否则 Windows 会出错。
- 常用操作：列目录、创建/删除目录、重命名、判断存在、获取文件大小、遍历目录树。
- 环境变量用 `os.environ`（类字典），`os.getenv("KEY")` 读取时不存在返回 `None`，更安全。
- `os.walk()` 递归遍历目录树，返回 `(当前目录, 子目录列表, 文件列表)`。
- 当前工作目录用 `os.getcwd()`，切换用 `os.chdir()`。
- 想用更面向对象的路径写法，可了解 `pathlib.Path`（Python3.4+，推荐新代码）。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `os.getcwd()` | 获取当前工作目录 | `os.getcwd()` → `'/Users/me'` |
| `os.chdir(path)` | 切换工作目录 | `os.chdir("/tmp")` |
| `os.listdir(path)` | 列出目录下所有条目名 | `os.listdir(".")` |
| `os.mkdir(path)` | 创建单层目录 | `os.mkdir("demo")` |
| `os.makedirs(path)` | 递归创建多层目录 | `os.makedirs("a/b/c")` |
| `os.rmdir(path)` | 删除空目录 | `os.rmdir("demo")` |
| `os.remove(path)` | 删除文件 | `os.remove("a.txt")` |
| `os.rename(src, dst)` | 重命名/移动 | `os.rename("a.txt", "b.txt")` |
| `os.path.join(a, *p)` | 智能拼接路径 | `os.path.join("a", "b")` → `a/b` |
| `os.path.exists(p)` | 路径是否存在 | `os.path.exists("a.txt")` |
| `os.path.isfile(p)` | 是否是文件 | `os.path.isfile("a.txt")` |
| `os.path.isdir(p)` | 是否是目录 | `os.path.isdir("demo")` |
| `os.path.getsize(p)` | 文件字节大小 | `os.path.getsize("a.txt")` |
| `os.path.abspath(p)` | 转绝对路径 | `os.path.abspath("a.txt")` |
| `os.path.basename(p)` | 取文件名 | `os.path.basename("/a/b.txt")` → `b.txt` |
| `os.path.dirname(p)` | 取目录部分 | `os.path.dirname("/a/b.txt")` → `/a` |
| `os.path.splitext(p)` | 拆扩展名 | `os.path.splitext("a.txt")` → `('a', '.txt')` |
| `os.walk(path)` | 递归遍历目录树 | `for root, dirs, files in os.walk(".")` |
| `os.getenv(key)` | 读环境变量 | `os.getenv("HOME")` |
| `os.environ` | 环境变量字典 | `os.environ["PATH"]` |
| `os.rename()` | 重命名/移动 | `os.rename("old", "new")` |
| `os.name` | 系统标识 | `'posix'` 或 `'nt'` |

## 代码示例

```python
import os

# 1. 当前目录与环境变量
print("当前目录:", os.getcwd())
print("系统标识:", os.name)          # posix(Linux/macOS) 或 nt(Windows)
print("HOME:", os.getenv("HOME"))    # 不存在返回 None

# 2. 跨平台拼接路径（永远别手动写 "/"）
path = os.path.join("data", "logs", "app.txt")
print("拼接结果:", path)

# 3. 路径判断与拆分
print(os.path.exists(path))                    # 是否存在
print(os.path.isfile(path), os.path.isdir("."))  # 是文件/是目录
name, ext = os.path.splitext("report.csv")
print(name, ext)                               # report .csv

# 4. 创建 / 删除目录
os.makedirs("demo/sub", exist_ok=True)  # exist_ok=True 已存在不报错
print(os.listdir("demo"))               # 查看内容

# 5. 写文件后查看大小、重命名、删除
with open("demo/a.txt", "w", encoding="utf-8") as f:
    f.write("hello")
print("大小:", os.path.getsize("demo/a.txt"))
os.rename("demo/a.txt", "demo/b.txt")
os.remove("demo/b.txt")
os.rmdir("demo/sub")
os.rmdir("demo")

# 6. 递归遍历目录树
for root, dirs, files in os.walk("."):
    for f in files:
        # 用 join 拼完整路径，避免相对路径出错
        print(os.path.join(root, f))
```

## 易错点

- **手动拼路径**：`"a" + "/" + "b"` 在 Windows 上不可移植，一律用 `os.path.join`。
- **`os.getenv` vs `os.environ`**：`os.environ["X"]` 键不存在会抛 `KeyError`；`os.getenv("X")` 返回 `None`。
- **`os.mkdir` 不建父目录**：父目录不存在会报错，多层用 `os.makedirs`。
- **`os.rmdir` 只能删空目录**；有内容先用 `shutil.rmtree()`。
- **`os.remove` 只能删文件**，对目录用会报 `IsADirectoryError`。
- **相对路径依赖当前工作目录**，脚本被别处调用时可能失效，用 `os.path.abspath(__file__)` 定位脚本目录。
