---
title: "Monorepo 实践：Turborepo 从零到一"
date: 2026-06-26
tags: ["工程化", "架构"]
description: "使用 Turborepo 搭建前端 Monorepo 的完整指南，包含项目结构、任务编排、缓存优化。"
---

# Monorepo 实践：Turborepo 从零到一

多个相关项目放在一个仓库里管理，共享代码、统一构建、依赖一处安装。这就是 Monorepo。

## 为什么用 Monorepo

- **共享代码** — 公共组件、工具函数不用发 npm 包
- **原子提交** — 一个改动同时改多个包，一起提交
- **统一依赖** — 不会出现版本不一致
- **增量构建** — 只构建改动的包

## Turborepo 初始化

```bash
pnpm dlx create-turbo@latest my-monorepo
cd my-monorepo
pnpm install
```

## 项目结构

```
monorepo/
├── apps/
│   ├── web/           # 主应用
│   └── admin/         # 后台管理
├── packages/
│   ├── ui/            # 公共组件库
│   ├── utils/         # 工具函数
│   └── tsconfig/      # 共享 TS 配置
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 共享组件包

```ts
// packages/ui/package.json
{
  "name": "@my/ui",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "vue": "^3.5.0"
  }
}
```

```ts
// packages/ui/src/index.ts
export { default as Button } from './Button.vue'
export { default as Modal } from './Modal.vue'
```

```vue
<!-- apps/web 中使用 -->
<script setup lang="ts">
import { Button, Modal } from '@my/ui'
</script>
```

## Turborepo 任务配置

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 常用命令

```bash
# 构建所有包
pnpm turbo build

# 只构建 web 应用（及其依赖）
pnpm turbo build --filter=web

# 并行开发
pnpm turbo dev

# 清理缓存
pnpm turbo clean
```

## 缓存优化

Turborepo 默认开启本地缓存和远程缓存：

```bash
# 本地缓存位置
.turbo/cache/

# 远程缓存（团队共享）
pnpm turbo login
pnpm turbo link
```

构建过一次的包，下次直接用缓存，CI 构建时间从 10 分钟降到 2 分钟。

## 踩坑记录

1. **包之间不要循环依赖** — A 依赖 B，B 就不能再依赖 A
2. **版本号统一管理** — 用 `changesets` 做版本发布
3. **TypeScript 路径别名** — 每个包配自己的 `tsconfig.json`
4. **不要把所有东西都放 packages** — 业务逻辑留在 apps 里
