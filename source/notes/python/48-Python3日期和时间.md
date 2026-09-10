---
title: "Python3 日期和时间"
tags: [日期时间]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 日期和时间

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

Python 用 `time` 模块处理时间戳和格式化，用 `datetime` 模块处理日期时间对象，两者可互相转换，`strftime` 负责格式化输出。

## 要点

- `time` 模块：以**时间戳**（自 1970-01-01 的秒数，浮点数）为核心；`datetime` 模块：以**日期时间对象**为核心，更直观易用。
- `time.time()` 返回当前时间戳；`time.localtime()` 转本地时间元组；`time.strftime(格式, 元组)` 格式化；`time.strptime(字符串, 格式)` 反向解析。
- `datetime` 核心类：`datetime`（日期+时间）、`date`（日期）、`time`（时间）、`timedelta`（时间差，做加减运算）。
- `datetime.now()` 当前时间，`datetime.strftime(格式)` 格式化，`datetime.strptime(字符串, 格式)` 解析。
- 时间加减用 `timedelta`：`now + timedelta(days=1)` 表示明天。
- 时间戳与 datetime 互转：`datetime.fromtimestamp(ts)` 和 `dt.timestamp()`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `time.time()` | 当前时间戳（秒） | `ts = time.time()` |
| `time.localtime(ts)` | 时间戳 → 本地时间元组 `time.struct_time` | `t = time.localtime()` |
| `time.gmtime(ts)` | 时间戳 → UTC 时间元组 | `t = time.gmtime()` |
| `time.strftime(fmt, t)` | 时间元组 → 格式化字符串 | `time.strftime('%Y-%m-%d', time.localtime())` |
| `time.strptime(s, fmt)` | 字符串 → 时间元组 | `time.strptime('2026-09-10', '%Y-%m-%d')` |
| `time.sleep(sec)` | 程序暂停指定秒数 | `time.sleep(1.5)` |
| `datetime.datetime.now()` | 当前日期时间对象 | `now = datetime.now()` |
| `datetime.datetime.today()` | 当前本地日期时间 | `today = datetime.today()` |
| `dt.strftime(fmt)` | 对象 → 格式化字符串 | `now.strftime('%Y/%m/%d %H:%M')` |
| `datetime.strptime(s, fmt)` | 字符串 → datetime 对象 | `dt = datetime.strptime('2026-09-10', '%Y-%m-%d')` |
| `datetime.timedelta(days=, hours=, ...)` | 时间差，用于加减 | `now + timedelta(days=7, hours=2)` |
| `dt.year / month / day / hour / minute / second` | 取各字段 | `now.year` |
| `dt.weekday()` / `isoweekday()` | 星期几（周一=0 / 周一=1） | `now.weekday()` |
| `datetime.fromtimestamp(ts)` | 时间戳 → datetime | `datetime.fromtimestamp(1700000000)` |
| `dt.timestamp()` | datetime → 时间戳 | `now.timestamp()` |
| `dt.isoformat()` | ISO 格式字符串 | `'2026-09-10T12:30:00'` |
| `date.today()` | 当前日期（只有日期） | `date.today()` |

### strftime 常用格式符

| 格式符 | 含义 | 示例 |
|---|---|---|
| `%Y` | 四位年份 | 2026 |
| `%y` | 两位年份 | 26 |
| `%m` | 月份（01-12） | 09 |
| `%d` | 日（01-31） | 10 |
| `%H` | 24 小时制小时（00-23） | 14 |
| `%I` | 12 小时制小时（01-12） | 02 |
| `%M` | 分钟（00-59） | 30 |
| `%S` | 秒（00-59） | 45 |
| `%p` | AM / PM | PM |
| `%A` | 星期全名 | Wednesday |
| `%a` | 星期缩写 | Wed |
| `%B` | 月份全名 | September |
| `%b` | 月份缩写 | Sep |
| `%j` | 一年中的第几天（001-366） | 253 |
| `%w` | 星期几数字（周日=0） | 4 |

## 代码示例

```python
import time
from datetime import datetime, date, timedelta

# 1. time 模块：时间戳与格式化
ts = time.time()
print('时间戳:', ts)
print('本地时间元组:', time.localtime(ts))
print('格式化:', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(ts)))

# 2. datetime 模块：对象操作
now = datetime.now()
print('当前时间:', now)
print('年/月/日:', now.year, now.month, now.day)
print('格式化:', now.strftime('%Y-%m-%d %H:%M:%S'))
print('星期几(周一=0):', now.weekday())

# 3. 字符串解析
dt = datetime.strptime('2026-09-10 08:30:00', '%Y-%m-%d %H:%M:%S')
print('解析结果:', dt)

# 4. 时间加减：计算 7 天前 / 后
tomorrow = now + timedelta(days=1)
week_ago = now - timedelta(days=7, hours=3)
print('明天:', tomorrow.strftime('%Y-%m-%d'))
print('一周前:', week_ago.strftime('%Y-%m-%d %H:%M'))

# 5. 时间戳与 datetime 互转
dt2 = datetime.fromtimestamp(ts)   # 时间戳 -> datetime
back = dt2.timestamp()             # datetime -> 时间戳
print(dt2, back == ts)

# 6. 日期差计算
d1 = date(2026, 9, 10)
d2 = date(2026, 12, 31)
print('相差天数:', (d2 - d1).days)
```

## 易错点

- `strptime` 的格式必须与字符串**完全匹配**，否则抛 `ValueError`（如 `%Y-%m-%d` 不能解析 `2026/09/10`）。
- `%m` 是月份、`%M` 是分钟，容易写混导致解析错位。
- `time.localtime()` 返回元组，直接用字符串拼要格式化；对象用 `strftime`。
- 时区问题：`datetime.now()` 是本地时间，跨时区项目要处理 `timezone` 或用 UTC（`datetime.utcnow()` 已弃用，推荐 `datetime.now(timezone.utc)`）。
- `timedelta` 运算会忽略夏令时等细节，精确场景要小心；做天级加减最安全。
- `time.strptime` 返回的是元组，不是 datetime 对象，需要继续操作时先转成 datetime。
