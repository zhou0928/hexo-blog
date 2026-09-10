---
title: "Python asyncio 模块"
tags: [并发]
group: 高级
date: 2026-09-10 00:00:00
---

# Python asyncio 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`asyncio` 用**单线程事件循环**实现异步并发，`async def` 定义协程、`await` 挂起等待，适合大量 I/O 等待场景。

## 要点

- 协程用 `async def` 定义，调用它不会立即执行，只得到一个协程对象。
- `await` 挂起当前协程、让出控制权，等被等待的操作完成再继续。
- `asyncio.run(main())` 是最简单的入口，创建事件循环、运行主协程、收尾关闭。
- 并发跑多个协程：`create_task()` 建任务，或 `gather(*coros)` 一起等。
- `asyncio.sleep()` 是非阻塞睡眠，绝不要在里面用 `time.sleep()`（会卡住整个循环）。
- 同步/阻塞函数用 `asyncio.to_thread(fn)` 丢到线程池，避免阻塞事件循环。
- `asyncio.wait_for(coro, timeout)` 限时；`TimeoutError` 捕获超时。
- 异步版同步原语：`asyncio.Lock`、`Event`、`Queue`，用于协程间协作。
- `async for` 遍历异步迭代器，`async with` 使用异步上下文管理器。
- `Queue` 是协程间通信的推荐方式；`asyncio.Queue`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `async def f()` | 定义协程函数 | `async def main():` |
| `await coro` | 等待协程/可等待对象 | `await asyncio.sleep(1)` |
| `asyncio.run(main())` | 运行主协程 | 程序入口 |
| `asyncio.create_task(coro)` | 创建并调度任务 | 立刻开始并发 |
| `asyncio.gather(*aws)` | 并发等待多个 | 返回结果列表 |
| `asyncio.sleep(sec)` | 异步等待（不阻塞） | `await asyncio.sleep(1)` |
| `asyncio.wait_for(coro, timeout)` | 限时等待 | 超时抛 `TimeoutError` |
| `asyncio.to_thread(fn, *args)` | 阻塞函数丢线程 | 3.9+ |
| `asyncio.Queue()` | 异步队列 | `await q.put(x)` |
| `asyncio.Lock()` | 异步锁 | `async with lock:` |
| `asyncio.Event()` | 异步事件 | `await ev.wait()` |
| `asyncio.as_completed(tasks)` | 完成顺序产出 | 谁先完先处理 |
| `asyncio.TaskGroup()` | 结构化并发（3.11+） | 统一管理子任务 |
| `async for x in aiter` | 异步迭代 | 异步流 |
| `async with ctx` | 异步上下文 | 异步资源管理 |

## 代码示例

```python
import asyncio
import time

# 1. 基本协程：async 定义，await 挂起
async def hello(name):
    print(f'开始 {name}')
    await asyncio.sleep(1)         # 非阻塞等待，不卡住其他任务
    print(f'结束 {name}')
    return name

# 2. 顺序执行（一个接一个，共约 2 秒）
async def serial():
    t = time.time()
    await hello('A')
    await hello('B')
    print('顺序耗时:', round(time.time() - t, 2))

# 3. 并发执行：gather 一起等（共约 1 秒）
async def concurrent():
    t = time.time()
    results = await asyncio.gather(hello('A'), hello('B'))
    print('并发结果:', results)
    print('并发耗时:', round(time.time() - t, 2))

# 4. create_task：先建任务，后台跑，后面再 await
async def with_task():
    task = asyncio.create_task(hello('任务'))
    print('任务已调度')
    await task                      # 需要结果时再等

# 5. 超时控制
async def slow():
    await asyncio.sleep(5)

async def with_timeout():
    try:
        await asyncio.wait_for(slow(), timeout=1)
    except asyncio.TimeoutError:
        print('超时了')

# 6. 阻塞函数丢线程，避免卡住事件循环
def blocking():                    # 普通同步函数
    time.sleep(2)
    return 'ok'

async def run_blocking():
    r = await asyncio.to_thread(blocking)
    print('阻塞函数结果:', r)

# 7. 生产者—消费者：异步队列
async def producer(q):
    for i in range(3):
        await q.put(i)
        print('生产', i)
    await q.put(None)              # 哨兵，通知结束

async def consumer(q):
    while True:
        item = await q.get()
        if item is None:
            break
        print('消费', item)

async def pipeline():
    q = asyncio.Queue()
    await asyncio.gather(producer(q), consumer(q))

# 入口：一次运行一个演示
asyncio.run(pipeline())
```

## 易错点

- 协程函数忘了 `await` 或忘了用 `asyncio.run`，只会得到一个协程对象，代码根本不执行（还会警告协程未 await）。
- 在协程里用 `time.sleep()` 会阻塞整个事件循环，所有任务一起卡住，必须换 `await asyncio.sleep()`。
- 同步阻塞调用（requests、文件大 IO）要用 `to_thread` 包一层，否则退化成串行。
- `gather` 默认一个协程抛异常会向上扩散，需要 `return_exceptions=True` 才逐个收集结果。
- `create_task` 建的任务如果一直不 `await` 也可能被垃圾回收取消，要显式持有引用或 await。
- 事件循环里不能直接 `await` 同步函数，`await` 的对象必须是协程/任务/Future。
- Python 3.9 以下没有 `asyncio.to_thread`，用 `loop.run_in_executor` 替代。
