---
title: "工单系统 WebSocket 实时消息推送方案"
date: 2026-06-24
tags: ["工单系统", "架构"]
description: "在 oneLineCar 工单系统中从轮询迁移到 WebSocket 实时推送的完整方案，涵盖重连、心跳、消息确认和离线队列。"
---

# 工单系统 WebSocket 实时消息推送方案

工单系统里最烦人的体验之一就是「提交了工单，但看不到实时状态」。早期我们用的是定时轮询，每 5 秒拉一次接口，不仅浪费带宽，延迟也很高。后来迁移到 WebSocket，体验提升了一个量级。

## 为什么要从轮询迁移到 WebSocket

轮询的问题很明显：

1. **延迟高** — 最坏情况下要等一个完整的轮询周期
2. **浪费资源** — 90% 的请求返回空数据
3. **并发压力** — 100 个用户在线，每秒 20 次请求

WebSocket 是全双工通信，服务端有消息就推，客户端零延迟接收。

## 架构设计

```
┌─────────────┐     WebSocket      ┌──────────────┐
│   前端 H5    │ ◄──────────────► │  WS Gateway  │
└─────────────┘                   └──────┬───────┘
                                         │
                                  ┌──────▼───────┐
                                  │  消息队列     │
                                  │ (Redis PubSub)│
                                  └──────┬───────┘
                                         │
                              ┌──────────▼──────────┐
                              │  工单服务 / 通知服务  │
                              └─────────────────────┘
```

关键点是用 Redis PubSub 做消息中转。工单状态变更时，工单服务发布事件到 Redis，WebSocket Gateway 订阅并推送给对应用户。

## 核心代码

### 连接管理

```ts
// composables/useWebSocket.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket(url: string) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectCount = ref(0)
  const maxReconnect = 5
  const heartbeatInterval = 30000
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  function connect() {
    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      isConnected.value = true
      reconnectCount.value = 0
      startHeartbeat()
    }

    ws.value.onclose = () => {
      isConnected.value = false
      stopHeartbeat()
      attemptReconnect()
    }

    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'pong') return
      handleMessage(data)
    }
  }

  function startHeartbeat() {
    heartbeatTimer = setInterval(() => {
      if (ws.value?.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ type: 'ping' }))
      }
    }, heartbeatInterval)
  }

  function stopHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
  }

  function attemptReconnect() {
    if (reconnectCount.value >= maxReconnect) return
    const delay = Math.min(1000 * 2 ** reconnectCount.value, 30000)
    reconnectTimer = setTimeout(() => {
      reconnectCount.value++
      connect()
    }, delay)
  }

  onMounted(connect)
  onUnmounted(() => {
    stopHeartbeat()
    if (reconnectTimer) clearTimeout(reconnectTimer)
    ws.value?.close()
  })

  return { ws, isConnected, reconnectCount }
}
```

### 消息处理

```ts
// composables/useWorkOrderEvents.ts
import { ref } from 'vue'

export function useWorkOrderEvents() {
  const events = ref<any[]>([])

  function handleMessage(data: any) {
    switch (data.type) {
      case 'workorder:status_change':
        updateWorkOrderStatus(data.payload)
        break
      case 'workorder:comment':
        addComment(data.payload)
        break
      case 'workorder:assigned':
        showNotification(data.payload)
        break
    }
  }

  return { events, handleMessage }
}
```

## 断线重连策略

我们用了指数退避重连，初始 1 秒，最大 30 秒，最多重试 5 次。重连期间显示「连接中...」的状态提示。

还有一个重要细节：**重连后要重新订阅之前的频道**。第一次连接时订阅了工单 A 和工单 B 的状态更新，断线重连后要重新发订阅消息。

## 离线消息队列

移动端网络不稳定，用户可能在电梯里、地铁上。我们做了两层保障：

1. **消息缓存** — 未送达的消息存到 IndexedDB
2. **重连同步** — 重连后拉取离线期间的增量消息

```ts
async function syncOfflineMessages(lastMessageId: string) {
  const response = await fetch(`/api/messages/sync?since=${lastMessageId}`)
  const messages = await response.json()
  messages.forEach(handleMessage)
}
```

## 消息确认机制

重要的工单变更（如状态流转、指派）需要客户端确认。服务端发消息后会等一个 ACK，超时未确认就重新推送。

```ts
// 服务端伪代码
async function sendWithAck(userId: string, message: Message) {
  const ack = await redis.set(`ack:${message.id}`, 'pending', 'EX', 10)
  gateway.push(userId, message)
  // 等待客户端 ACK，10秒超时
  const result = await waitForAck(message.id, 10000)
  if (!result) {
    // 未确认，重新入队
    await messageQueue.enqueue({ userId, message, retry: true })
  }
}
```

## 踩过的坑

1. **WebSocket 连接数限制** — 浏览器对同一域名最多 6 个 WebSocket 连接。SPA 切换页面时旧连接没关，会耗尽配额。必须在组件卸载时 close。

2. **心跳间隔太长** — 一开始设了 60 秒心跳，中间代理层（Nginx）的超时是 60 秒，连接被断了都不知道。心跳间隔要小于代理超时的一半。

3. **消息顺序** — 理论上 WebSocket 保证顺序，但重连后拉取的离线消息可能和实时消息交叉。需要给消息加递增 ID，客户端按 ID 排序去重。

## 效果

迁移到 WebSocket 后：
- 消息延迟从平均 2.5 秒降到 < 200ms
- 服务器带宽消耗降低 60%
- 用户不再需要手动刷新页面查看工单状态

实时推送不是银弹，但在工单系统这种协作场景下，体验提升是实打实的。
