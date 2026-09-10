---
title: "Python queue 模块"
tags: [并发]
group: 高级
date: 2026-09-10 00:00:00
---

# Python queue 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`queue` 提供**线程安全**的队列，用于多线程之间传递数据，天然解决“生产者—消费者”同步问题。

## 要点

- 三种队列：`Queue`（FIFO 先进先出）、`LifoQueue`（栈，后进先出）、`PriorityQueue`（优先级，值小的先出）。
- 构造参数 `maxsize`：队列最大长度，`0`（默认）表示无限。
- `put()` 入队、`get()` 出队；都支持 `block` 和 `timeout`，队满/队空时的等待策略。
- `put_nowait()` / `get_nowait()`：不等待，满了/空了直接抛 `queue.Full` / `queue.Empty`。
- 内部自带锁，**多个线程同时读写不会数据错乱**，不需要自己加锁。
- `task_done()` 通知“一个任务处理完了”，配合 `join()` 阻塞到所有任务完成。
- `qsize()` / `empty()` / `full()` 在并发下只是近似值，不能用来做同步判断。
- 线程池之外的场景（进程间通信）要用 `multiprocessing.Queue`，不是这个。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `Queue(maxsize=0)` | 创建 FIFO 队列 | `q = queue.Queue()` |
| `LifoQueue()` | 后进先出（栈） | `q = queue.LifoQueue()` |
| `PriorityQueue()` | 值小者先出 | `q.put((1, 'a'))` |
| `q.put(item, block=True, timeout=None)` | 入队，可阻塞等待 | `q.put(1, timeout=1)` |
| `q.put_nowait(item)` | 不等待入队 | 满则抛 `Full` |
| `q.get(block=True, timeout=None)` | 出队，可阻塞等待 | `q.get(timeout=1)` |
| `q.get_nowait()` | 不等待出队 | 空则抛 `Empty` |
| `q.task_done()` | 标记一个任务已处理 | 每次 `get` 后调用 |
| `q.join()` | 阻塞直到所有任务 `task_done` | 主线程等待收尾 |
| `q.qsize()` | 近似元素个数 | 日志/调试用 |
| `q.empty()` / `q.full()` | 是否空/满（近似） | 不可用于同步 |
| `queue.Full` / `queue.Empty` | 异常类型 | 配 `nowait` 用 |

## 代码示例

```python
import queue
import threading
import time

# 1. 基本用法：FIFO
q = queue.Queue()
q.put('任务1')
q.put('任务2')
print(q.get())          # 任务1（先入先出）
print(q.get())          # 任务2

# 2. 优先级队列：元组第一项是优先级
pq = queue.PriorityQueue()
pq.put((2, '普通'))
pq.put((1, '紧急'))
pq.put((3, '低'))
print(pq.get())         # (1, '紧急')，数字小的先出

# 3. 生产者—消费者：线程安全，无需手动加锁
def producer(q):
    for i in range(5):
        q.put(f'商品{i}')
        print('生产', i)
        time.sleep(0.1)

def consumer(q):
    while True:
        try:
            item = q.get(timeout=1)   # 超时防死等
        except queue.Empty:
            break                      # 拿不到就退出
        print('消费', item)
        q.task_done()                  # 标记处理完成

q2 = queue.Queue()
t1 = threading.Thread(target=producer, args=(q2,))
t2 = threading.Thread(target=consumer, args=(q2,))
t1.start(); t2.start()
t1.join(); t2.join()
q2.join()                              # 所有任务都被 task_done 后才返回

# 4. 非阻塞：满了/空了抛异常
q3 = queue.Queue(maxsize=1)
q3.put(1)
try:
    q3.put_nowait(2)
except queue.Full:
    print('队列已满')
```

## 易错点

- `get()` 默认**阻塞**，队列空时线程会一直等；配 `timeout` 或 `get_nowait` + `Empty` 更稳。
- 忘了 `task_done()` 会让 `join()` 永远阻塞，每个成功 `get` 都要配一次。
- `empty()`/`qsize()` 只作参考，判断“还有没有任务”要靠哨兵值或 join 机制。
- `put_nowait`/`get_nowait` 不等于“跳过”，是**抛异常**，要 try 捕获。
- 优先级队列里混合类型（数字和字符串）比较会报 `TypeError`，统一成元组并用可比较的第一项。
- 多进程用 `multiprocessing.Queue`，`queue.Queue` 只在同进程内的线程间有效。
