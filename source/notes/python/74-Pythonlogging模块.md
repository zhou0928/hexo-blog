---
title: "Python logging 模块"
tags: [日志]
group: 高级
date: 2026-09-10 00:00:00
---

# Python logging 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`logging` 是标准库日志框架，按级别记录信息，比 `print` 更能分级、带时间、写文件、控开关。

## 要点

- 五个级别由低到高：`DEBUG < INFO < WARNING < ERROR < CRITICAL`。
- 默认只输出 **WARNING 及以上**，所以 `info()` 常“没反应”，要先用 `basicConfig(level=...)` 改级别。
- `logging.basicConfig()` 做一次性基础配置：级别、格式、输出文件。
- 模块/库中应 `logger = logging.getLogger(__name__)`，不要直接用根 logger。
- 日志格式用 `%(asctime)s`、`%(levelname)s`、`%(name)s`、`%(message)s` 等占位符。
- Handler 决定日志去哪：`StreamHandler`（终端）、`FileHandler`（文件）、`RotatingFileHandler`（按大小切割）。
- `logger.exception()` 在 `except` 里用，会自动附上堆栈。
- 记录时用**惰性格式化**：`logger.info('x=%s', x)`，别用 f-string 提前拼好。
- `propagate=False` 可阻止子 logger 把日志冒泡给父 logger，避免重复输出。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `logging.basicConfig(level=, format=, filename=)` | 基础配置 | `level=logging.INFO` |
| `logging.getLogger(name)` | 获取命名 logger | `getLogger(__name__)` |
| `logger.debug(msg)` | 调试级 | 开发细节 |
| `logger.info(msg)` | 信息级 | 正常流程 |
| `logger.warning(msg)` | 警告级（默认可见） | 潜在问题 |
| `logger.error(msg)` | 错误级 | 出错 |
| `logger.critical(msg)` | 严重级 | 致命 |
| `logger.exception(msg)` | 错误 + 堆栈 | 在 `except` 内用 |
| `logger.log(level, msg)` | 指定级别 | 动态级别 |
| `logging.Formatter(fmt)` | 自定义格式 | 配 Handler |
| `logging.FileHandler(path)` | 写文件 | `'app.log'` |
| `logging.StreamHandler()` | 写流（默认 stderr） | 控制台 |
| `RotatingFileHandler(path, maxBytes, backupCount)` | 按大小滚动 | 防止单文件过大 |
| `logger.setLevel(...)` | 设该 logger 级别 | `setLevel('DEBUG')` |
| `logger.addHandler(h)` | 绑定处理器 | 多个输出目标 |
| `logger.propagate = False` | 关闭向上冒泡 | 防重复 |

## 代码示例

```python
import logging

# 1. 基础配置：级别 + 格式 + 输出到文件
logging.basicConfig(
    level=logging.DEBUG,                       # 放开到 DEBUG
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    filename='app.log',                        # 不写则输出到终端
    filemode='a',                              # 追加
)

# 2. 用命名 logger（推荐）
logger = logging.getLogger(__name__)
logger.debug('调试细节')
logger.info('程序启动')
logger.warning('磁盘空间不足')
logger.error('请求失败')
logger.critical('服务不可用')

# 3. 惰性格式化：只在需要输出时才拼字符串
user = 'tom'
logger.info('用户登录: %s', user)              # 推荐
# logger.info(f'用户登录: {user}')            # 不推荐，会先拼好

# 4. 记录异常堆栈
try:
    1 / 0
except ZeroDivisionError:
    logger.exception('发生除零错误')            # 自动带上 traceback

# 5. 多处理器：同时输出到终端和文件，各用各的格式
lg = logging.getLogger('demo')
lg.setLevel(logging.INFO)
lg.propagate = False                           # 不冒泡到 root，防重复

console = logging.StreamHandler()
console.setFormatter(logging.Formatter('%(levelname)s - %(message)s'))
file_h = logging.FileHandler('demo.log', encoding='utf-8')
file_h.setFormatter(logging.Formatter('%(asctime)s %(message)s'))

lg.addHandler(console)
lg.addHandler(file_h)
lg.info('这条会同时出现在终端和文件')
```

## 易错点

- 不配 `level` 时默认 WARNING，`logger.info(...)` 看不到输出，误以为代码没执行。
- 在循环里反复 `basicConfig` 无效（只第一次生效）；重复加 Handler 会导致同一条日志打印多次。
- 库代码用根 logger（`logging.info`）会污染使用方的配置，应 `getLogger(__name__)`。
- 用 f-string 拼日志在级别被过滤时仍会执行拼接，高频日志有性能损耗，用 `%s` 占位。
- 日志文件忘记指定 `encoding='utf-8'`，写中文可能乱码或报错。
- `logger.exception` 只能在 `except` 块里发挥完整作用，别在没异常时乱用。
