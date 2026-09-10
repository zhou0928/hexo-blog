---
title: "Pinia vs Vuex：为什么我全面迁移到了 Pinia"
date: 2026-06-25
tags: ["Vue", "前端", "架构"]
description: "从 Vuex 迁移到 Pinia 的完整历程，包含迁移策略、踩坑记录和性能对比。"
---

# Pinia vs Vuex：为什么我全面迁移到了 Pinia

用了两年 Vuex，迁移到 Pinia 之后最大的感受：之前写的很多代码都是在和框架搏斗。

## Vuex 的痛点

### TypeScript 支持差

```ts
// Vuex 的 type 定义是出了名的痛苦
const store = useStore()
// store.state.user → any
// store.getters.fullName → any
// store.commit('SET_NAME', '张三') → 字符串魔法，IDE 不认识
```

### 模块嵌套地狱

```ts
// 访问深层模块的状态
store.state.workOrder.list
store.getters['workOrder/filteredList']
store.commit('workOrder/SET_FILTER', {})
store.dispatch('workOrder/fetchList')
```

字符串路径，重构时噩梦。

### Mutation 纯属多余

Vuex 强制「Mutation → Action」两步走，但大部分场景 Mutation 只是赋值：

```ts
// Vuex: 必须先 Mutation 再 Action
mutations: {
  SET_LIST(state, list) { state.list = list }
},
actions: {
  async fetchList({ commit }) {
    const list = await api.getList()
    commit('SET_LIST', list)
  }
}
```

## Pinia 的优势

### 完美的 TypeScript 支持

```ts
// Pinia: 自动推导类型
const store = useWorkOrderStore()
store.list       // WorkOrder[]
store.filteredList  // WorkOrder[]
store.fetchList()   // Promise<void>
```

### Setup Store 写法

```ts
// useWorkOrderStore.ts
export const useWorkOrderStore = defineStore('workOrder', () => {
  const list = ref<WorkOrder[]>([])
  const filter = ref({ status: '', keyword: '' })

  const filteredList = computed(() =>
    list.value.filter(item => {
      if (filter.value.status && item.status !== filter.value.status) return false
      if (filter.value.keyword && !item.title.includes(filter.value.keyword)) return false
      return true
    })
  )

  async function fetchList() {
    list.value = await api.getWorkOrders()
  }

  function setFilter(f: typeof filter.value) {
    filter.value = f
  }

  return { list, filter, filteredList, fetchList, setFilter }
})
```

没有 Mutation，没有 Commit，直接操作 ref。

### 代码对比

| 特性 | Vuex | Pinia |
|------|------|-------|
| TypeScript | 手动定义类型 | 自动推导 |
| 嵌套模块 | `state.a.b.c` | `store.c`（扁平化） |
| 代码量 | Mutation + Action + Getter | 只有 ref + computed + 函数 |
| DevTools | 支持 | 支持 |
| SSR | 支持 | 支持 |
| 包体积 | ~10KB | ~1.5KB |

## 迁移策略

不需要一次性迁移，Pinia 和 Vuex 可以共存：

```ts
// 新 store 用 Pinia
const useNewStore = defineStore('new', () => { ... })

// 旧 store 保持 Vuex
const store = useStore() // Vuex
```

逐步把 Vuex 的 store 迁移为 Pinia，直到全部替换后移除 Vuex。

## 总结

Pinia 不是 Vuex 的替代品，它是 Vuex 早就应该有的样子。如果你还在用 Vuex，现在就是迁移的最佳时机。
