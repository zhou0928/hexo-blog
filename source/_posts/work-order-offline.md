---
title: "工单系统离线重连方案 — IndexedDB + 队列 + WebSocket"
date: 2026-06-10
tags: ["工单系统", "前端", "架构"]
description: "oneLineCar 工单系统在网络不稳定场景下的离线数据缓存与自动重连方案。"
---

# 工单系统离线重连方案

工单系统这类的强交互应用，**断网就等于断工**。现场工程师在车间、仓库这些信号不好的地方操作时，网络随时可能断。所以离线能力是刚需。

## 整体架构

```
┌─────────────────────────────────────┐
│           Service Worker            │
│     (离线资源缓存 + 请求拦截)        │
├─────────────────────────────────────┤
│         内存状态层 (Pinia)           │
│     - 当前工单列表                    │
│     - 用户操作队列                    │
├─────────────────────────────────────┤
│          持久化层 (IndexedDB)         │
│     - 工单数据缓存                    │
│     - 待提交操作队列                  │
├─────────────────────────────────────┤
│          网络状态检测                 │
│     - navigator.onLine               │
│     - 心跳探测 (WebSocket ping)       │
└─────────────────────────────────────┘
```

## IndexedDB 缓存设计

使用 `idb` 库简化 IndexedDB 操作：

```ts
import { openDB } from 'idb'

const db = await openDB('work-order-cache', 1, {
  upgrade(db) {
    db.createObjectStore('orders', { keyPath: 'id' })
    db.createObjectStore('pendingQueue', {
      keyPath: 'id',
      autoIncrement: true
    })
  }
})
```

读取走缓存优先、网络兜底：

```ts
async function getOrders() {
  // 先从 IndexedDB 读
  const cached = await db.getAll('orders')
  orders.value = cached

  // 再尝试网络刷新
  if (navigator.onLine) {
    try {
      const fresh = await api.fetchWorkOrders()
      await db.put('orders', ...fresh)
      orders.value = fresh
    } catch { /* 网络失败就继续用缓存 */ }
  }
}
```

## 操作队列

所有写操作在离线时先入队，网络恢复后按序执行：

```ts
const pendingQueue = ref<QueuedAction[]>([])

async function submitOrder(data: Partial<WorkOrder>) {
  if (!navigator.onLine) {
    // 离线 → 入队
    await db.add('pendingQueue', {
      type: 'UPDATE_ORDER',
      payload: data,
      createdAt: Date.now()
    })
    pendingQueue.value = await db.getAll('pendingQueue')
    return
  }
  // 在线 → 直接提交
  await api.submitOrder(data)
}
```

## WebSocket 心跳与自动重连

```ts
function setupReconnect() {
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout>

  function connect() {
    ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      isOnline.value = true
      // 上线后消费队列
      flushPendingQueue()
    }

    ws.onclose = () => {
      isOnline.value = false
      // 5 秒后自动重连
      reconnectTimer = setTimeout(connect, 5000)
    }

    ws.onerror = () => ws?.close()
  }

  onUnmounted(() => {
    clearTimeout(reconnectTimer)
    ws?.close()
  })

  connect()
}
```

## 踩坑记录

1. **IndexedDB 事务超时** — 批量 put 太多了会挂，改成分批写入，一次 50 条
2. **队列冲突** — 离线时修改同一条数据两次，重放顺序搞反了。加了个版本号字段做冲突检测
3. **Service Worker 缓存策略** — 先展示旧数据再静默更新的策略最合适

## 效果

这套方案上线后，**掉线后重连成功率从 60% 提升到 98%+**，用户在弱网环境下的操作基本感觉不到中断。
