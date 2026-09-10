---
title: "工单系统权限模型设计（RBAC）"
date: 2026-06-24
tags: ["工单系统", "架构", "前端"]
description: "工单系统中基于 RBAC 的权限模型设计，角色、权限、数据范围三层控制的完整方案。"
---

# 工单系统权限模型设计（RBAC）

工单系统的权限需求比一般系统复杂：不同角色能看到的工单范围不同，能执行的操作也不同。比如普通司机只能看自己的工单，调度员能看全部，管理员能看所有还能删除。

## 权限模型

### 三层控制

```
用户 → 角色 → 功能权限
     → 角色 → 数据权限
```

- **功能权限**：能做什么（创建工单、处理工单、删除工单）
- **数据权限**：能看什么（自己的工单、本部门工单、全部工单）

### 角色定义

```ts
interface Role {
  id: string
  name: string
  permissions: Permission[]     // 功能权限
  dataScope: DataScope          // 数据范围
}

interface Permission {
  resource: string   // 'work_order' | 'report' | 'user'
  action: string     // 'create' | 'read' | 'update' | 'delete'
}

type DataScope = 'self' | 'department' | 'all'
```

## 前端权限实现

### 路由守卫

```ts
const router = createRouter({
  routes: [
    {
      path: '/admin',
      meta: { requiresRole: 'admin' },
      children: [...]
    }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresRole) {
    if (!userStore.hasRole(to.meta.requiresRole)) {
      return '/403'
    }
  }
})
```

### 按钮级权限

```vue
<template>
  <button v-if="hasPermission('work_order', 'delete')" @click="deleteOrder">
    删除工单
  </button>
</template>

<script setup lang="ts">
function hasPermission(resource: string, action: string): boolean {
  const userStore = useUserStore()
  return userStore.permissions.some(
    p => p.resource === resource && p.action === action
  )
}
</script>
```

### 数据范围过滤

```ts
// 根据数据范围构建查询参数
function buildDataFilter(user: User): Record<string, any> {
  switch (user.dataScope) {
    case 'self':
      return { assigneeId: user.id }
    case 'department':
      return { departmentId: user.departmentId }
    case 'all':
      return {}
  }
}
```

## 权限缓存策略

权限数据不常变，但每次请求都查数据库没必要：

```ts
// 登录时拉取权限，存 localStorage
async function login(username: string, password: string) {
  const { token, user } = await api.login(username, password)
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  // 拉取权限
  const permissions = await api.getPermissions(user.id)
  localStorage.setItem('permissions', JSON.stringify(permissions))
}

// 权限变更时主动刷新
function onPermissionChanged() {
  const permissions = await api.getPermissions(currentUser.id)
  localStorage.setItem('permissions', JSON.stringify(permissions))
}
```

## 踩坑记录

1. **权限判断放前端只是体验优化** — 真正的权限控制必须在后端
2. **别把权限存 Vuex** — 页面刷新就丢了，存 localStorage 或每次登录拉取
3. **动态路由要小心** — 权限变更后需要 `router.removeRoute` 再重新添加
4. **数据范围要后端强制过滤** — 前端可以隐藏按钮，但不能依赖前端做数据过滤
