---
title: "Vue 3 Teleport + Suspense 实战用法"
date: 2026-06-25
tags: ["Vue", "前端"]
description: "Vue 3 中 Teleport 和 Suspense 的实战用法，包含 Modal 异步组件、骨架屏等真实场景。"
---

# Vue 3 Teleport + Suspense 实战用法

Vue 3 有两个容易被忽略的内置组件：Teleport 和 Suspense。用好了能解决很多实际问题。

## Teleport：传送门

### 解决什么问题

Modal 弹窗有个经典问题：`z-index` 被父组件的 `overflow: hidden` 或 `transform` 截断。Teleport 直接把 DOM 传送到 `<body>` 下。

### 实战：全局 Modal

```vue
<!-- Modal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

function close() { emit('close') }
</script>
```

### 实战：全局通知

```vue
<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup name="notif">
        <div v-for="n in notifications" :key="n.id" class="notification" :class="n.type">
          {{ n.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
```

## Suspense：异步等待

### 解决什么问题

组件内有异步操作（如 `await` 接口）时，传统做法是手动管理 loading 状态。Suspense 自动处理。

### 基本用法

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div class="skeleton">加载中...</div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import AsyncComponent from './AsyncComponent.vue'
</script>
```

### 实战：异步用户信息

```vue
<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script setup lang="ts">
const user = await fetchUser() // 直接 await，Suspense 会自动处理 loading
</script>
```

```vue
<!-- 父组件 -->
<template>
  <Suspense>
    <template #default>
      <UserProfile :id="userId" />
    </template>
    <template #fallback>
      <UserProfileSkeleton />
    </template>
  </Suspense>
</template>
```

### 组合使用

```vue
<template>
  <Teleport to="body">
    <Suspense>
      <template #default>
        <Dashboard />
      </template>
      <template #fallback>
        <DashboardSkeleton />
      </template>
    </Suspense>
  </Teleport>
</template>
```

## 注意事项

1. **Suspense 还是实验性功能** — 生产环境用要谨慎，未来 API 可能变
2. **Teleport 的 `to` 必须是 CSS 选择器或 `body`** — 不能传动态值
3. **Teleport 内的组件生命周期不受父组件影响** — 注意副作用清理
4. **Suspense 的 fallback 只显示一次** — 不会重复触发
