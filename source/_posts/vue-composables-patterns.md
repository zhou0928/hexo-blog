---
title: "Vue 3 组合式函数设计模式 — 从工单系统实践中总结"
date: 2026-06-15
tags: ["Vue", "前端", "架构"]
description: "在 oneLineCar 工单系统中实践组合式函数设计模式半年后的一些总结和反思。"
---

# Vue 3 组合式函数设计模式

组合式函数是 Vue 3 最核心的设计模式之一。在工单系统里用了大半年，踩了不少坑，分享一下总结。

## 什么是组合式函数

简单来说，组合式函数就是利用 Vue 组合式 API 封装有状态逻辑的函数：

```ts
// useWorkOrder.ts
import { ref, computed, onMounted } from 'vue'
import { fetchWorkOrders } from '@/api'

export function useWorkOrder() {
  const orders = ref([])
  const loading = ref(false)

  const pendingCount = computed(() =>
    orders.value.filter(o => o.status === 'pending').length
  )

  async function load() {
    loading.value = true
    try {
      orders.value = await fetchWorkOrders()
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { orders, loading, pendingCount, reload: load }
}
```

## 几个实用模式

### 1. 带自动清理的监听

工单系统里经常需要轮询，离开页面时一定要清理：

```ts
export function usePolling(fn: () => Promise<void>, interval = 5000) {
  const timer = ref<ReturnType<typeof setInterval>>()

  function start() {
    stop()
    fn()
    timer.value = setInterval(fn, interval)
  }

  function stop() {
    if (timer.value) clearInterval(timer.value)
  }

  onUnmounted(stop)

  return { start, stop }
}
```

### 2. 离线状态管理

工单系统最头疼的就是离线场景：

```ts
export function useOnlineStatus() {
  const isOnline = ref(navigator.onLine)

  function handleOnline() { isOnline.value = true }
  function handleOffline() { isOnline.value = false }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return { isOnline }
}
```

## 避坑指南

1. **不要在组合式函数里返回 reactive 对象** — 直接用 `ref` 和 `computed` 就好
2. **善用 `toRefs`** — 从组合式函数返回解构时保持响应性
3. **SSR 注意** — `onMounted` 只在客户端执行，服务端渲染时不要做 DOM 操作

## 总结

好的组合式函数应该满足三点：
- **单一职责** — 一个函数只做一件事
- **可组合** — 像积木一样拼装
- **易测试** — 不依赖组件实例

掌握了这个模式之后，Vue 3 的开发体验会上一个台阶。
