---
title: "Vue 3 进阶：Pinia、Composition API 与依赖注入的实战总结"
date: 2026-06-21
tags: ["Vue", "前端", "架构"]
description: "从 Pinia 状态管理到 provide/inject 依赖注入，再到 Composition API 的高级模式——在真实项目里用了一年后的经验沉淀。"
---

# Vue 3 进阶：Pinia、Composition API 与依赖注入的实战总结

Vue 3 出来好几年了，该踩的坑基本都踩了一遍。今天不讲基础用法，聊几个我在工单系统和几个中后台项目里反复用到的进阶模式。

## Pinia：Vuex 之后的状态管理

Vue 5 已经官宣用 Vapor 模式重写、不再有 Options API 了，但状态管理这块，Pinia 已经稳了。

### 为什么 Pinia 比 Vuex 好

不废话，直接说结论：

```
Vuex → 啰嗦的 mutations、namespace 字符串魔法、TypeScript 支持半残
Pinia → 去掉了 mutations、天然 TypeScript 友好、没有嵌套 module 的层级地狱
```

最直接的感受：**写 Pinia 就像写一个组合式函数，几乎没有学习成本。**

```ts
// stores/workOrder.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkOrderStore = defineStore('workOrder', () => {
  const orders = ref<WorkOrder[]>([])
  const loading = ref(false)

  const pendingOrders = computed(() =>
    orders.value.filter(o => o.status === 'pending')
  )

  async function fetchOrders() {
    loading.value = true
    try {
      orders.value = await api.getWorkOrders()
    } finally {
      loading.value = false
    }
  }

  return { orders, loading, pendingOrders, fetchOrders }
})
```

Setup store 模式（上面这种）是我现在唯一用的方式。它跟组合式 API 完全同构——从组件里搬出来就是 store，反之亦然。

### storeToRefs 的陷阱

```ts
// ❌ 这样会丢失响应性
const { orders, loading } = useWorkOrderStore()

// ✅ 这样才对
const { orders, loading } = storeToRefs(useWorkOrderStore())
// 注意：函数不需要 storeToRefs
const { fetchOrders } = useWorkOrderStore()
```

这个坑我见过好几次了。直观上觉得解构出来就能用，结果视图不更新——其实就是忘了 `storeToRefs`。

## provide/inject：不止是「祖传传参」

很多人对 provide/inject 的印象停留在「跨层级传 props 的替代品」，其实它完全可以承担轻量级依赖注入的职责。

### 一个实战场景：全局主题配置

```ts
// symbol 避免命名冲突
export const THEME_KEY = Symbol('theme')

// 提供方：App.vue
const theme = ref<Theme>({
  primary: '#3b82f6',
  radius: 8,
  darkMode: false
})
provide(THEME_KEY, {
  theme: readonly(theme),
  updateTheme: (patch: Partial<Theme>) => {
    Object.assign(theme.value, patch)
  }
})
```

注意这里用了 `readonly` —— 子组件不应该能直接修改注入的值，必须通过提供方暴露的方法。这是一个容易被忽略的原则。

### provide 的响应式陷阱

```ts
// ❌ 这样提供的是静态值，子组件不会响应变化
provide('count', count.value)

// ✅ 提供 ref 本身
provide('count', count)
```

这个坑在 Vue 3 的官方文档里其实写得很清楚，但实战中太容易写错了。我自己的习惯是：**provide 一概提供 ref/computed 或 readonly 包装后的版本，不提供原始值。**

## Composition API 的「不要做」清单

总结一下这一年多的一些教训：

### 不要在 setup 之外调用组合式函数

```ts
// ❌ 这样会炸
function helper() {
  const store = useWorkOrderStore() // 没有组件实例上下文
}
```

Vue 3 的组合式 API 依赖组件实例的 `setup` 上下文。在普通函数、事件回调里调用 `useStore` 之类的组合式函数，会报 `inject() can only be used inside setup()`。解决方案：要么把组合式函数的调用放在 setup 内，要么显式传参。

### 不要滥用 watchEffect

`watchEffect` 很方便，但它的依赖是自动收集的，会导致两个问题：
- 依赖变化时隐式触发，调试困难
- 闭包内的异步调用可能导致「过时的引用」

**原则：能用 `watch` 显式声明依赖的时候，就别用 `watchEffect`。**

### 不要把逻辑全塞在一个组合式函数里

一个组合式函数超过 100 行就要考虑拆分了。按照「数据 → 计算 → 操作」三段式拆分，参照 Pinia 的设计哲学——一个组合式函数只做一种逻辑的封装。

## 总结

Vue 3 的进阶用法，核心其实就是三件事：

1. **Pinia** — 替代 Vuex，Setup Store 模式跟组合式 API 无缝衔接
2. **provide/inject** — 好好用起来，比逐层传递属性优雅得多，但要小心响应式陷阱
3. **组合式 API 自律** — 框架给你了自由，但别滥用

框架一直在变，但这些模式背后的「关注点分离」「单向数据流」「显式优于隐式」的原则不会过时。
