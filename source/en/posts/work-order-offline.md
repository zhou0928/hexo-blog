---
title: "Workflow System Offline Reconnection — IndexedDB + Queue + WebSocket"
date: 2026-06-10
tags: ["Workflow System", "Frontend", "Architecture"]
description: "An offline data caching and auto-reconnection scheme for the oneLineCar workflow system under unstable network conditions."
---

# Workflow System Offline Reconnection

For a heavily interactive application like a workflow system, **no network means no work**. Field engineers operating in workshops or warehouses — places with spotty signal — can lose connectivity at any moment. So offline capability is a hard requirement, not a nice-to-have.

## Overall Architecture

```
┌─────────────────────────────────────┐
│           Service Worker            │
│   (offline asset cache + request    │
│    interception)                    │
├─────────────────────────────────────┤
│      In-Memory State (Pinia)        │
│   - current work order list         │
│   - user action queue               │
├─────────────────────────────────────┤
│     Persistence Layer (IndexedDB)   │
│   - work order data cache           │
│   - pending action queue            │
├─────────────────────────────────────┤
│       Network Status Detection      │
│   - navigator.onLine                │
│   - heartbeat probe (WebSocket ping)│
└─────────────────────────────────────┘
```

## IndexedDB Cache Design

We use the `idb` library to simplify IndexedDB operations:

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

Reads go cache-first, network-as-fallback:

```ts
async function getOrders() {
  // Read from IndexedDB first
  const cached = await db.getAll('orders')
  orders.value = cached

  // Then attempt a network refresh
  if (navigator.onLine) {
    try {
      const fresh = await api.fetchWorkOrders()
      await db.put('orders', ...fresh)
      orders.value = fresh
    } catch { /* network failed — keep using the cache */ }
  }
}
```

## Action Queue

All write operations are enqueued while offline and executed in order once the network recovers:

```ts
const pendingQueue = ref<QueuedAction[]>([])

async function submitOrder(data: Partial<WorkOrder>) {
  if (!navigator.onLine) {
    // Offline → enqueue
    await db.add('pendingQueue', {
      type: 'UPDATE_ORDER',
      payload: data,
      createdAt: Date.now()
    })
    pendingQueue.value = await db.getAll('pendingQueue')
    return
  }
  // Online → submit directly
  await api.submitOrder(data)
}
```

## WebSocket Heartbeat and Auto-Reconnect

```ts
function setupReconnect() {
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout>

  function connect() {
    ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      isOnline.value = true
      // Once online, drain the queue
      flushPendingQueue()
    }

    ws.onclose = () => {
      isOnline.value = false
      // Auto-reconnect after 5 seconds
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

## Pitfall Log

1. **IndexedDB transaction timeouts** — too many `put`s in one batch would hang. Switched to batched writes, 50 at a time
2. **Queue conflicts** — modifying the same record twice while offline meant the replay order got scrambled. Added a version field for conflict detection
3. **Service Worker cache strategy** — STALE_WHILE_REVALIDATE fits best: show stale data first, then silently update

## Results

After shipping this scheme, **the reconnection success rate after dropouts climbed from 60% to 98%+**, and users in weak-network environments basically never feel an interruption.
