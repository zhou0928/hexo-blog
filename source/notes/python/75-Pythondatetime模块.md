---
title: "Python datetime 模块"
tags: [日期时间]
group: 高级
date: 2026-09-10 00:00:00
---

# Python datetime 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`datetime` 模块用类表示日期和时间，围绕 `date`、`time`、`datetime`、`timedelta` 四类操作，支持时区感知与格式化解析。

## 要点

- 核心四个类：`date`（年月日）、`time`（时分秒）、`datetime`（日期+时间）、`timedelta`（时间差）。
- `datetime` 是 `date` 的扩展，日期时间一把抓，日常最常用。
- **朴素时间**（naive）不带时区，**感知时间**（aware）带 `tzinfo`，两者不能直接比较。
- `fromisoformat()`（3.7+）可直接解析 `'2026-09-10T08:30:00'` 这类 ISO 字符串。
- `strftime` 格式化输出，`strptime` 从字符串解析，格式符与 `time` 模块一致。
- `timedelta` 支持加减与乘除，字段为 `days`、`seconds`、`microseconds`，用 `total_seconds()` 换算总秒数。
- `replace()` 生成修改某字段的新对象；`combine(date, time)` 合成 datetime。
- 时区用 `timezone.utc` 或 `zoneinfo`（3.9+）；`astimezone()` 在时区之间转换。
- 对象都是**不可变**的，任何修改都返回新对象，原对象不变。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `datetime.now()` | 当前本地日期时间 | `datetime.now()` |
| `datetime.now(timezone.utc)` | 当前 UTC 感知时间 | 推荐替代 `utcnow()` |
| `date(year, month, day)` | 构造日期 | `date(2026, 9, 10)` |
| `time(h, m, s)` | 构造时间 | `time(8, 30)` |
| `datetime(y, m, d, h, m, s)` | 构造完整时间 | `datetime(2026, 9, 10, 8, 30)` |
| `datetime.strptime(s, fmt)` | 字符串 → 对象 | `strptime('2026-09-10', '%Y-%m-%d')` |
| `dt.strftime(fmt)` | 对象 → 字符串 | `dt.strftime('%Y/%m/%d')` |
| `dt.isoformat()` | 输出 ISO 字符串 | `'2026-09-10T08:30:00'` |
| `datetime.fromisoformat(s)` | 解析 ISO 字符串 | `fromisoformat('2026-09-10T08:30')` |
| `dt.replace(year=2027)` | 替换字段生成新对象 | `dt.replace(month=1)` |
| `datetime.combine(d, t)` | 日期 + 时间合成 | 由 `date` 和 `time` 拼 |
| `dt.astimezone(tz)` | 转换到目标时区 | `dt.astimezone(timezone.utc)` |
| `dt.timetz()` / `dt.date()` / `dt.time()` | 拆出子部分 | `dt.date()` |
| `dt.timestamp()` | 转时间戳（秒） | `dt.timestamp()` |
| `dt.weekday()` / `isoweekday()` | 星期（周一=0 / =1） | `dt.isoweekday()` |
| `dt.isocalendar()` | 返回 (年, 周, 周几) | `dt.isocalendar()` |
| `timedelta(days=, hours=, ...)` | 时间差 | `timedelta(days=7)` |
| `td.total_seconds()` | 时间差换算总秒 | `td.total_seconds()` |
| `dt1 - dt2` | 两时间相减得 timedelta | `(d1 - d2).days` |

## 代码示例

```python
from datetime import datetime, date, time, timedelta, timezone

# 1. 构造与拆解
d = date(2026, 9, 10)
t = time(8, 30, 15)
dt = datetime(2026, 9, 10, 8, 30, 15)
print(dt.year, dt.month, dt.day, dt.hour, dt.minute)   # 2026 9 10 8 30
print(dt.date(), dt.time())                            # 2026-09-10 08:30:15

# 2. 解析与格式化
s = '2026-09-10 08:30:15'
parsed = datetime.strptime(s, '%Y-%m-%d %H:%M:%S')
print(parsed.strftime('%Y/%m/%d'))                     # 2026/09/10

# 3. ISO 互转（3.7+）
iso = parsed.isoformat()
print(iso)                                             # 2026-09-10T08:30:15
print(datetime.fromisoformat(iso) == parsed)           # True

# 4. replace / combine：生成新对象，不改原对象
print(parsed.replace(year=2027))                       # 2027-09-10 08:30:15
print(datetime.combine(d, t))                          # 2026-09-10 08:30:15

# 5. timedelta 运算
now = datetime.now()
print(now + timedelta(days=7, hours=2))                # 一周零两小时后
delta = timedelta(days=1, seconds=3600)
print(delta.total_seconds())                           # 90000.0
print((date(2026, 12, 31) - date(2026, 9, 10)).days)   # 相差 112 天

# 6. 时区：感知时间与转换
utc_now = datetime.now(timezone.utc)                   # 带时区
print(utc_now.tzinfo)                                   # UTC
beijing = utc_now.astimezone(timezone(timedelta(hours=8)))
print('北京时间:', beijing.strftime('%Y-%m-%d %H:%M'))

# 7. 周信息
print(now.isoweekday())                                # 1~7，周一是 1
print(now.isocalendar())                               # (年, 第几周, 周几)
```

## 易错点

- `strftime` / `strptime` 别混：前者是 format（对象→字符串），后者是 parse（字符串→对象）。
- `%m`（月）和 `%M`（分）写反会得到错误结果而不报错，仔细核对。
- 朴素时间与感知时间**不能比较或相减**，会抛 `TypeError`，先统一带不带时区。
- `datetime.utcnow()` 已弃用，产出的是朴素时间，改用 `datetime.now(timezone.utc)`。
- `timedelta` 内部只把天、秒、微秒规范存储，`td.seconds` 不是“总秒数”，总秒用 `total_seconds()`。
- 对象不可变：`dt.year = 2027` 直接报错，正确写法是 `dt = dt.replace(year=2027)`。
- `fromisoformat` 只认 ISO 格式，`'2026/09/10'` 这种得用 `strptime` 解析。
