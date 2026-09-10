---
title: "Python3 多线程"
tags: [并发]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 多线程

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

多线程让程序同时执行多个任务，Python 用 `threading` 模块创建和管理线程；受 GIL 限制，CPU 密集任务提升有限，但 IO 密集任务收益明显。

## 要点

- 创建线程两种方式：直接传函数给 `Thread`，或继承 `threading.Thread` 重写 `run()`。
- `start()` 启动线程，`join()` 等待线程结束，`daemon=True` 设为守护线程（主线程结束即退出）。
- 全局变量多线程共享，**修改要加锁**：`threading.Lock()` 配合 `with lock:` 或 `acquire/release`。
- **GIL（全局解释器锁）**：同一时刻只有一个线程执行 Python 字节码，CPU 密集任务（如纯计算循环）多线程几乎不加速，IO 密集任务（网络、文件、数据库）多线程很有效。
- 线程间通信：共享变量+锁、`queue.Queue`（线程安全队列，最推荐）、`Event` 事件。
- 一个进程默认有一个主线程；多线程适用于 IO 密集，多进程（`multiprocessing`）才真正利用多核。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `threading.Thread(target=func, args=(...))` | 创建线程 | `t = threading.Thread(target=worker, args=(1,))` |
| `threading.Thread(target=..., daemon=True)` | 创建守护线程 | `t = threading.Thread(target=worker, daemon=True)` |
| `t.start()` | 启动线程 | `t.start()` |
| `t.join(timeout=None)` | 等待该线程结束（可设超时） | `t.join()` |
| `threading.Lock()` | 创建互斥锁 | `lock = threading.Lock()` |
| `with lock:` | 自动加锁解锁（推荐写法） | `with lock: count += 1` |
| `threading.current_thread().name` | 当前线程名 | `print(threading.current_thread().name)` |
| `threading.active_count()` | 当前存活线程数 | `print(threading.active_count())` |
| `queue.Queue(maxsize=0)` | 线程安全队列 | `q = queue.Queue()` |
| `q.put(item)` / `q.get()` | 入队 / 出队（阻塞） | `data = q.get()` |
| `threading.Event()` | 事件对象，跨线程通知 | `event.set()` / `event.wait()` |

## 代码示例

```python
import threading
import time
import queue

# 1. 直接传函数创建线程
def worker(name, delay):
    for i in range(3):
        print(f'{name} 第{i+1}次执行')
        time.sleep(delay)

t1 = threading.Thread(target=worker, args=('A', 0.1))
t2 = threading.Thread(target=worker, args=('B', 0.1))
t1.start()
t2.start()
t1.join()
t2.join()
print('两个线程执行完毕')

# 2. 用锁保护共享变量
count = 0
lock = threading.Lock()

def add():
    global count
    for _ in range(10000):
        with lock:            # 加锁，防止 count += 1 被打断
            count += 1

threads = [threading.Thread(target=add) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print('count =', count)       # 应为 50000，不加锁会小于该值

# 3. 用队列做生产者-消费者
q = queue.Queue()

def producer():
    for i in range(5):
        q.put(f'消息{i}')     # 入队

def consumer():
    while True:
        item = q.get()        # 阻塞取数据
        if item == 'END':
            break
        print('消费:', item)

threading.Thread(target=producer).start()
threading.Thread(target=consumer, daemon=True).start()
```

## 易错点

- 忘加锁导致共享变量 `+=` 等操作数据丢失（竞态条件）。
- `join()` 不放会阻塞主线程；守护线程不 join 则随主线程退出，可能没跑完。
- 死锁：多把锁嵌套获取且顺序不一致会互相等待，尽量只持一把锁或用 `with` 保证释放。
- **CPU 密集任务用多线程不会更快**（GIL），应改用 `multiprocessing`。
- `daemon=True` 要在 `start()` 之前设置，否则报错。
- `threading.Thread` 的 `run()` 不要直接调用（那样只是普通函数调用），要用 `start()`。
