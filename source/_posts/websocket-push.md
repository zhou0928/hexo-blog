---
title: "工单系统 WebSocket 实时消息推送方案"
date: 2026-06-24
tags: ["工单系统", "前端"]
description: "oneLineCar 工单系统中 WebSocket 实时消息推送的完整方案，包含心跳检测、断线重连、消息确认机制。"
---

# 工单系统 WebSocket 实时消息推送方案

工单系统的核心体验就是「实时」——工单状态变了，所有相关人员必须立刻看到。轮询太慢，SSE 只能单向，WebSocket 是唯一正解。

## 为什么不用轮询

最简单的方案是定时轮询：每隔 5 秒请求一次接口看看有没有新消息。问题很明显：

- 90% 的请求是浪费的（没有新消息）
- 服务器压力大，100 个用户就是每秒 20 次请求
- 轮询间隔决定了消息延迟，5 秒间隔意味着最多 5 秒延迟

## WebSocket 方案设计

### 连接管理

```ts
class WsClient {
  private ws: WebSocket | null = null
  private heartbeatTimer: number | null = null
  private reconnectTimer: number | null = null
  private reconnectCount = 0
  private maxReconnect = 5

  connect(url: string) {
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('[WS] 连接成功')
      this.reconnectCount = 0
      this.startHeartbeat()
    }

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      this.handleMessage(data)
    }

    this.ws.onclose = () => {
      this.stopHeartbeat()
      this.tryReconnect(url)
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  private startHeartbeat() {
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private tryReconnect(url: string) {
    if (this.reconnectCount >= this.maxReconnect) {
      console.error('[WS] 达到最大重连次数，放弃重连')
      return
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectCount), 30000)
    this.reconnectCount++

    this.reconnectTimer = window.setTimeout(() => {
      console.log(`[WS] 第 ${this.reconnectCount} 次重连，延迟 ${delay}ms`)
      this.connect(url)
    }, delay)
  }
}
```

### 消息确认机制

WebSocket 不保证消息一定送达，需要应用层确认：

```ts
interface WsMessage {
  id: string
  type: string
  payload: any
  timestamp: number
}

// 发送消息
function sendWithAck(client: WsClient, msg: WsMessage) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('消息确认超时')), 5000)

    client.send(JSON.stringify(msg))

    // 等待服务端回 ACK
    client.onAck(msg.id, () => {
      clearTimeout(timeout)
      resolve()
    })
  })
}
```

### 离线消息缓存

网络断开期间的消息不能丢，用 IndexedDB 缓存：

```ts
class OfflineQueue {
  private db: IDBDatabase | null = null

  async init() {
    const request = indexedDB.open('ws-offline-queue', 1)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      db.createObjectStore('messages', { keyPath: 'id' })
    }
    this.db = await new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result)
    })
  }

  async enqueue(msg: WsMessage) {
    const tx = this.db!.transaction('messages', 'readwrite')
    tx.objectStore('messages').put(msg)
  }

  async flush(client: WsClient) {
    const tx = this.db!.transaction('messages', 'readwrite')
    const store = tx.objectStore('messages')
    const request = store.getAll()

    request.onsuccess = () => {
      for (const msg of request.result) {
        client.send(JSON.stringify(msg))
        store.delete(msg.id)
      }
    }
  }
}
```

## 消息类型设计

工单系统的消息大致分三类：

| 类型 | 说明 | 处理方式 |
|------|------|---------|
| 状态变更 | 工单状态从「待处理」变为「处理中」 | 更新列表 + 弹通知 |
| 指派通知 | 新工单指派给你 | 弹通知 + 未读数 +1 |
| 评论消息 | 有人在工单下评论了 | 更新评论区 + 弹通知 |

## 踩坑记录

1. **心跳间隔不要太短** — 30 秒足够，太频繁浪费带宽
2. **断线重连用指数退避** — 避免服务端重启后被大量客户端同时重连打死
3. **页面不可见时暂停心跳** — `document.visibilitychange` 监听，切到后台暂停
4. **WebSocket 连接数限制** — 同域名最多 6 个连接，别每个功能开一个

## 效果

接入 WebSocket 后，工单状态变更的感知延迟从轮询的 5 秒降到了 200 毫秒以内，用户体验质的飞跃。
