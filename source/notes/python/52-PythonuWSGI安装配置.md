---
title: "Python uWSGI 安装配置"
tags: [部署]
group: 高级
date: 2026-09-10 00:00:00
---

# Python uWSGI 安装配置

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
uWSGI 是一个把 Python Web 应用（如 Flask、Django）以生产级性能跑起来的应用服务器，负责并发、进程管理和与 Nginx 通信。

## 要点
- `pip` 装的 `uwsgi`（小写）是应用服务器本身；`uWSGI`（大写，C 写的）常与 Nginx 配合部署。
- 开发时用 `python app.py`，上线时用 uWSGI 起多进程，性能和稳定性更好。
- 必须提供一个符合 WSGI 规范的入口，比如 Flask 的 `app`、Django 的 `wsgi.py`。
- 通过命令行参数或 `.ini` 配置文件启动，常见参数：`--http`、`--socket`、`--processes`、`--module`。
- 与 Nginx 配合时 uWSGI 用 `--socket` 走 UNIX socket/端口，Nginx 反向代理过去。
- 生产环境一般还要配 systemd/supervisor 做进程守护。

## 语法 / 常用方法

| 参数 | 说明 | 示例 |
|---|---|---|
| `--http :PORT` | 直接对外提供 HTTP | `uwsgi --http :8000 --module app:app` |
| `--socket` | 用 socket 与 Nginx 通信 | `--socket 127.0.0.1:3031` |
| `--module` | 应用入口 | `--module myapp:app` |
| `--wsgi-file` | 指定 WSGI 文件 | `--wsgi-file app.py` |
| `--callable` | 入口变量名，默认 `application` | `--callable app` |
| `--processes` | 工作进程数 | `--processes 4` |
| `--threads` | 每进程线程数 | `--threads 2` |
| `--master` | 开启主进程管理 | `--master` |
| `--daemonize` | 后台运行并写日志 | `--daemonize /var/log/uwsgi.log` |
| `--virtualenv` | 指定虚拟环境 | `--virtualenv /venv` |
| `--stats` | 开启状态统计 | `--stats 127.0.0.1:9191` |

常用安装：`pip install uwsgi`。启动：`uwsgi --ini uwsgi.ini`。

## 代码示例

```python
# app.py —— 一个最小的 Flask 应用，作为 uWSGI 的入口
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello uWSGI"

if __name__ == "__main__":
    # 仅开发环境用这个跑，生产用 uwsgi 启动
    app.run(debug=True)
```

```ini
# uwsgi.ini —— 配置文件，用 uwsgi --ini uwsgi.ini 启动
[uwsgi]
module = app:app          # 模块:可调用对象
master = true             # 主进程管理子进程
processes = 4             # 4 个工作进程
threads = 2               # 每个进程 2 个线程
socket = 127.0.0.1:3031   # 与 Nginx 通信的地址
chmod-socket = 660
vacuum = true             # 退出时清理 socket 文件
daemonize = /var/log/uwsgi.log
```

```bash
# 直接对外起 HTTP（不配 Nginx 时调试用）
uwsgi --http :8000 --module app:app --processes 4

# 配合 Nginx：Nginx 里配置
# location / { include uwsgi_params; uwsgi_pass 127.0.0.1:3031; }
```

## 易错点
- `--module app:app` 指 `app.py` 文件里的 `app` 对象，两个 `app` 含义不同（文件:变量）。
- 在 Windows 上 uWSGI 基本装不了，它依赖 UNIX 特性，Windows 部署一般用 waitress。
- 改了代码 uWSGI 不会自动重载，要 `touch uwsgi.ini` 或 `uwsgi --reload`。
- 用了 `--daemonize` 日志会重定向到文件，控制台看不到报错，排查先看日志。
- 虚拟环境路径写错会报 `ModuleNotFoundError`，`--virtualenv` 要指向真实 venv 目录。
- `socket` 与 `http` 二选一：走 Nginx 用 socket，直接访问才用 http，配错会连不上。
