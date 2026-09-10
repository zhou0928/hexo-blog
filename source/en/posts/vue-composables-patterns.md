---
title: "Vue 3 Composables Design Patterns — Lessons from Workflow System Practice"
date: 2026-06-15
tags: ["Vue", "Frontend", "Architecture"]
description: "Reflections and takeaways after practicing the Composables design pattern in the oneLineCar workflow system for half a year."
---

# Vue 3 Composables Design Patterns

Composables (composition functions) are one of the most central design patterns in Vue 3. I've been using them heavily in our workflow system for over half a year now and hit plenty of pitfalls along the way — here's a writeup of what I learned.

## What Are Composables

Simply put, Composables are functions that use the Vue Composition API to encapsulate stateful logic:

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

## A Few Practical Patterns

### 1. Self-Cleaning Listeners

Workflow systems often need polling, and you absolutely must clean up when leaving the page:

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

### 2. Offline State Management

The biggest headache in a workflow system is the offline scenario:

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

## Pitfall Guide

1. **Don't return reactive objects from a composable** — just use `ref` and `computed` directly
2. **Lean on `toRefs`** — it preserves reactivity when destructuring the return value of a composable
3. **Watch out for SSR** — `onMounted` only runs on the client; don't touch the DOM during server-side rendering

## Takeaway

A good Composable should satisfy three things:
- **Single responsibility** — one function does one thing
- **Composable** — assembled like building blocks
- **Testable** — no dependency on a component instance

Once you internalize this pattern, the Vue 3 development experience levels up significantly.
