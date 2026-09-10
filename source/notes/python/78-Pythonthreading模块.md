---
title: "Python threading 模块"
tags: [并发]
group: 高级
date: 2026-09-10 00:00:00
---

# Python threading 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`threading` 用线程实现并发，`Thread` 启动任务，`Lock`/`Event` 等方法协调共享数据，适合 I/O 密集型场景。

## 要点

- 创建线程两种方式：传 `target` 函数，或继承 `Thread` 重写 `run()`。
- `start()` 启动线程，`join()` 阻塞等待该线程结束。
- `daemon=True` 设为守护线程，主线程退出时它自动结束；**非守护线程会阻塞主线程退出**。
- 共享可变数据要加锁：`Lock`（普通锁）、`RLock`（可重入，同一线程可多次获取）。
- `with lock:` 自动加锁解锁，比手动 `acquire/release` 安全。
- 线程间通信：`Event`（事件标志）、`Condition`（条件变量）、`queue.Queue`（线程安全队列，首选）。
- `threading.local()` 线程本地存储，各线程各有一份数据。
- `Timer(sec, func)` 延时执行、`current_thread().name` 取当前线程名、`enumerate()` 列所有活动线程。
- **GIL 限制**：CPU 密集型任务多线程跑不快，应改用 `multiprocessing`；I/O 密集才适合多线程。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `Thread(target=fn, args=(...))` | 创建线程 | `Thread(target=work, args=(1,))` |
| `t.start()` | 启动线程 | 进入就绪/运行 |
| `t.join(timeout)` | 等待线程结束 | `t.join()` |
| `t.is_alive()` | 是否还在运行 | 轮询状态 |
| `t.name` / `t.daemon` | 线程名 / 守护标志 | `t.daemon = True` |
| `Lock()` | 互斥锁 | `lock.acquire()` |
| `with lock:` | 自动加解锁 | 推荐写法 |
| `RLock()` | 可重入锁 | 嵌套加锁场景 |
| `Event()` | 事件通知 | `ev.set()` / `ev.wait()` |
| `Semaphore(n)` | 计数信号量 | 限并发数 |
| `threading.local()` | 线程本地数据 | 各线程独立副本 |
| `Timer(sec, fn)` | 定时器线程 | `Timer(3, f).start()` |
| `current_thread()` | 当前线程对象 | 取 `name` |
| `threading.enumerate()` | 活动线程列表 | 调试 |
| `ThreadPoolExecutor` | 线程池（concurrent.futures） | 批量任务 |
| `lock.locked()` | 锁是否被持有 | 状态查询 |

## 代码示例

```python
import threading
import time

# 1. 基础：函数式创建线程
def work(name, n):
    for i in range(n):
        print(f'{name} 第{i}次')
        time.sleep(0.1)

t1 = threading.Thread(target=work, args=('A', 3))
t2 = threading.Thread(target=work, args=('B', 3))
t1.start(); t2.start()
t1.join(); t2.join()               # 等两个线程都结束
print('全部完成')

# 2. 继承 Thread
class MyThread(threading.Thread):
    def run(self):                 # 重写 run
        print('运行:', self.name)

MyThread().start()

# 3. 共享计数器：不加锁会出错（丢失更新）
count = 0
lock = threading.Lock()

def add():
    global count
    for _ in range(100000):
        with lock:                 # 自动加锁/解锁
            count += 1

ts = [threading.Thread(target=add) for _ in range(2)]
for t in ts: t.start()
for t in ts: t.join()
print('结果:', count)               # 200000

# 4. Event：一个线程通知另一个
ev = threading.Event()

def waiter():
    print('等待信号...')
    ev.wait()                      # 阻塞直到 set
    print('收到信号')

threading.Thread(target=waiter).start()
time.sleep(0.5)
ev.set()                           # 发出信号

# 5. 守护线程：主线程退出即结束
d = threading.Thread(target=lambda: time.sleep(10), daemon=True)
d.start()
print('主线程结束，守护线程随之一并退出')

# 6. 定时器
threading.Timer(1.0, lambda: print('1秒后执行')).start()
```

## 易错点

- 忘了 `join()`，主线程可能在子线程还没跑完时就结束或读到中间状态。
- 多线程改同一变量不加锁会产生**竞态**，结果小于预期；共享写操作一律加锁。
- `Lock` 不可重入：同一线程重复 `acquire` 会死锁，嵌套场景用 `RLock`。
- GIL 让 CPU 密集多线程不加速，甚至更慢（切换开销），该用多进程。
- 守护线程在主线程退出时被强制结束，可能来不及保存数据，关键收尾别放守护线程。
- 线程无法被强制杀死，要设计退出标志或 `Event` 让线程自己结束。
- 死锁常见于两个线程各自持有锁又等对方的锁，加锁顺序保持一致可避免。
