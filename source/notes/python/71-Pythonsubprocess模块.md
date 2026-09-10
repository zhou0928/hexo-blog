---
title: "Python subprocess 模块"
tags: [并发]
group: 高级
date: 2026-09-10 00:00:00
---

# Python subprocess 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`subprocess` 用来在 Python 里启动并管理外部命令/子进程，能拿到退出码、标准输出和标准错误。

## 要点

- 首选 `subprocess.run()`：一个调用完成“启动→等待→收集结果”。
- 返回 `CompletedProcess` 对象，含 `returncode`、`stdout`、`stderr`。
- `capture_output=True` 捕获输出；`text=True` 让输出是 `str` 而非 `bytes`。
- `check=True`：退出码非 0 时自动抛 `CalledProcessError`。
- `timeout=`：超时抛 `TimeoutExpired`，避免卡死。
- `Popen` 是更底层接口，适合需要边跑边读、后台运行、管道的场景。
- `shell=True` 时命令是字符串，交给系统 shell 解析；**有命令注入风险，能用列表就别开 shell**。
- 传参数的推荐形式是列表：`['ls', '-l', '/tmp']`，避免手动转义空格。
- `cwd=` 指定工作目录，`env=` 指定环境变量，`input=` 传标准输入。
- 旧接口 `call` / `check_call` / `check_output` 仍可用，但新代码优先 `run`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `subprocess.run(cmd)` | 运行并等待，返回结果对象 | `run(['ls', '-l'])` |
| `capture_output=True` | 捕获 stdout/stderr | `run(cmd, capture_output=True)` |
| `text=True` | 以文本模式处理输出 | `run(cmd, text=True)` |
| `check=True` | 非 0 退出码抛异常 | `run(cmd, check=True)` |
| `timeout=秒` | 超时限制 | `run(cmd, timeout=5)` |
| `cwd=路径` | 工作目录 | `run(cmd, cwd='/tmp')` |
| `env=字典` | 自定义环境变量 | `run(cmd, env={...})` |
| `input='...'` | 传给子进程的标准输入 | `run(cmd, input='data', text=True)` |
| `result.returncode` | 退出码，0 为成功 | `if r.returncode == 0` |
| `result.stdout` | 标准输出 | `r.stdout.strip()` |
| `result.stderr` | 标准错误 | `r.stderr` |
| `subprocess.Popen(...)` | 底层启动进程 | `p = Popen(cmd)` |
| `p.communicate()` | 交互/等待并取输出 | `out, err = p.communicate()` |
| `p.wait()` | 等待结束，返回退出码 | `p.wait()` |
| `subprocess.check_output(cmd)` | 运行并返回 stdout | 非 0 抛异常 |
| `subprocess.CalledProcessError` | check 失败时的异常 | 含 `returncode` |

## 代码示例

```python
import subprocess

# 1. 最常用：运行并收集输出（列表传参，最安全）
r = subprocess.run(['echo', 'hello'], capture_output=True, text=True)
print('退出码:', r.returncode)          # 0
print('输出:', r.stdout.strip())         # hello

# 2. check=True：命令失败自动抛异常
try:
    subprocess.run(['ls', '/不存在的目录'], check=True,
                   capture_output=True, text=True)
except subprocess.CalledProcessError as e:
    print('命令失败:', e.returncode, e.stderr.strip())

# 3. 指定工作目录 + 环境变量
r = subprocess.run(['pwd'], cwd='/tmp', capture_output=True, text=True)
print('cwd:', r.stdout.strip())          # /tmp（macOS/Linux）

# 4. 超时控制，防止子进程卡死
try:
    subprocess.run(['sleep', '10'], timeout=1)
except subprocess.TimeoutExpired:
    print('超时了')

# 5. 旧式便捷接口：只关心输出
out = subprocess.check_output(['echo', 'quick'], text=True)
print(out.strip())                        # quick

# 6. Popen：需要边跑边读或后台执行时
p = subprocess.Popen(['echo', 'async'], stdout=subprocess.PIPE,
                     text=True)
out, _ = p.communicate()                  # 等待并取输出
print(out.strip())                        # async
```

## 易错点

- `shell=True` 拼用户输入 = 命令注入漏洞；能用参数列表就别开 shell，非要开的先严格校验。
- 输出默认是 `bytes`，忘了 `text=True` 会看到 `b'...'`，字符串方法也对不上。
- 不捕获输出时 `stdout` 是 `None`，直接 `.strip()` 会报 `AttributeError`。
- 子进程写满管道缓冲区而父进程没读，会**死锁**，用 `run` 或 `communicate` 一次读完。
- `check=True` 失败抛异常而不是返回错误码，别再用返回值判断，用 `try/except`。
- 参数别手动拼成带引号的字符串，直接传列表，让 Python 处理空格和特殊字符。
