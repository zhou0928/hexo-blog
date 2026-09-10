---
title: "Vue 3 + TypeScript 项目从零搭建模板"
date: 2026-06-25
tags: ["Vue", "前端"]
description: "2026 年 Vue 3 + TypeScript 项目的标准搭建模板，包含 Vite、ESLint、Prettier、Husky 全套配置。"
---

# Vue 3 + TypeScript 项目从零搭建模板

每次新项目都要配一遍环境，不如整理一个标准模板，直接复制粘贴。

## 初始化

```bash
pnpm create vite my-project --template vue-ts
cd my-project
pnpm install
```

## 项目结构

```
src/
├── api/              # 接口层
│   ├── index.ts      # axios 实例
│   └── modules/      # 按模块拆分
├── assets/           # 静态资源
├── components/       # 通用组件
├── composables/      # 组合式函数
├── hooks/            # 业务 hooks
├── router/           # 路由
│   └── index.ts
├── stores/           # Pinia stores
├── styles/           # 全局样式
├── types/            # 类型定义
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue
└── main.ts
```

## Axios 封装

```ts
// api/index.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default instance
```

## 路由配置

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
        { path: 'about', name: 'About', component: () => import('@/views/About.vue') },
      ],
    },
  ],
})

export default router
```

## ESLint + Prettier

```bash
pnpm add -D @antfu/eslint-config
```

```ts
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
})
```

`@antfu/eslint-config` 一套搞定 ESLint + Prettier，不用分开配。

## 环境变量

```bash
# .env.development
VITE_API_BASE=http://localhost:3000/api

# .env.production
VITE_API_BASE=https://api.example.com/api
```

```ts
// 类型提示
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 一键启动

```bash
pnpm dev       # 开发
pnpm build     # 构建
pnpm preview   # 预览构建产物
```

这套模板用了十几次了，够用。
