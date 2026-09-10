---
title: "Vite 8 迁移实战：从双构建器到 Rolldown 原生"
date: 2026-06-23
tags: ["工程化", "前端"]
description: "Vite 8 用 Rolldown 统一了 esbuild + Rollup 的双构建器模式，实现 10-30x 构建加速。本文讲清楚架构变化、迁移步骤和踩坑经验。"
---

# Vite 8 迁移实战：从双构建器到 Rolldown 原生

2026 年 3 月，Vite 8 正式发布。这是自 Vite 2 以来最大的一次架构变更——**用 Rolldown 统一了 esbuild + Rollup 的双构建器模式**。

如果你的项目还在用 Vite 6/7，这篇指南会帮你：

- 从原理上理解为什么 Vite 8 更快
- 知道迁移要改什么、不用改什么
- 避开社区已经踩过的坑

## 为什么 Vite 8 是一次架构升级

### 旧架构的问题

从 Vite 诞生起，它就同时依赖两个构建器：

```
开发阶段 → esbuild（快，但输出松散）
生产构建 → Rollup（全量优化，但慢）
```

这带来了几个深层问题：

- **两套插件系统** — esbuild plugin 和 Rollup plugin 互不兼容
- **行为不一致** — 开发环境可用，生产构建报错
- **维护成本高** — 核心团队需要同时跟进两个工具的发展
- **优化天花板** — 很多优化要做两次，或者只能在其中一端做

### Rolldown 是什么

Rolldown 是 VoidZero（Evan You 创立）用 Rust 从零写的构建器。它**兼容 Rollup 插件 API，但跑在 Rust 层面**。

```
Vite 7 及之前：esbuild（开发）+ Rollup（生产）
Vite 8：       Rolldown（统一构建器）
         +    Oxc（解析/转换/压缩）
         +    Lightning CSS（CSS 压缩）
```

整个工具链全部用 Rust 实现，不再依赖 esbuild 和 Babel。

### 真实性能提升

社区反馈的迁移数据：

| 项目 | 文件数 | LOC | Vite 7 构建 | Vite 8 构建 | 加速 |
|------|--------|-----|------------|------------|------|
| Linear | — | — | 46s | 6s | 7.6x |
| Ramp | — | — | — | — | 57% 提升 |
| Beehiiv | — | — | — | — | 64% 提升 |
| LMS Admin | 287 | 92k | 54s | 2.8s | 19x |
| Mobile PWA | 156 | 41k | 27s | 1.6s | 17x |
| 某 HN 用户 | — | — | 4min | 30s | 8x |

这不是"纸面性能"，而是真实项目的实测数据。

## 架构变更速览

### 替换了什么

| Vite 7 | Vite 8 | 备注 |
|--------|--------|------|
| esbuild（开发） | Rolldown | 统一构建器 |
| Rollup（生产） | Rolldown | 同一套代码 |
| esbuild 转换 | Oxc Transformer | 大部分场景兼容 |
| esbuild 压缩 | Oxc Minifier | 可用 `build.minify: 'esbuild'` 切回 |
| esbuild CSS 压缩 | Lightning CSS | 可用 `build.cssMinify: 'esbuild'` 切回 |
| — | Rolldown 持久缓存 | 模块级缓存，二次构建极速 |

### 对插件的兼容性

Rolldown 实现了 Rollup 的插件 API 接口。**官方 Vue / React 插件和大多数主流 Rollup 插件不需要改代码就能工作。**

问题主要出现在三类场景：

1. **esbuild 专属插件** — 使用 esbuild `onLoad`/`onResolve` 钩子的插件不再可用
2. **依赖 esbuild 内部细节的 Rollup 插件** — 比如直接调用 `require('esbuild')` 的插件
3. **未维护的插件** — 作者已不再更新的老插件

### 配置项的变化

| Vite 7 | Vite 8 | 说明 |
|--------|--------|------|
| `optimizeDeps.esbuildOptions` | `optimizeDeps.rolldownOptions` | 仍自动兼容，已废弃 |
| `esbuild` | `oxc` | 转换配置从 esbuild 迁移到 oxc |
| `build.rollupOptions` | `build.rolldownOptions` | 大部分配置名不变 |
| — | 需 Node 20.19+ | Vite 8 不再支持 Node 18 |

## 迁移步骤

### 方案一：直接升级（推荐）

适用于只使用官方插件和主流维护插件的项目。

```bash
# 1. 更新依赖
npm install vite@latest

# 2. 同步更新相关插件（如果是 @vitejs/plugin-vue 等）
npm install @vitejs/plugin-vue@latest

# 3. 检查 Node 版本（需要 20.19+）
node --version

# 4. 运行构建验证
npm run build
```

大部分项目的 `vite.config.ts` **不需要改**。内置的兼容层会处理配置项映射。

### 方案二：渐进迁移（推荐大型项目）

如果你的项目插件依赖复杂，分两步走：

**Step 1：在 Vite 7 下切换到 Rolldown 预览版**

```bash
npm install rolldown-vite@latest
# 配置完全不变，只是底层换成 Rolldown
```

这个阶段用来排查：哪些插件在 Rolldown 下不工作？

**Step 2：确认兼容后升级到 Vite 8**

```bash
# 恢复原来的包名
npm uninstall rolldown-vite
npm install vite@latest
```

两步走的好处是把"Rolldown 兼容性问题"和"Vite 8 其他变更"分开排查。

### 迁移后要做的事

```bash
# 1. 检查有无废弃配置的警告
npm run build 2>&1 | grep -i deprecated

# 2. 对比构建产物体积
# 迁移前跑一次
npx vite-bundle-visualizer -o before.html
# 迁移后跑一次
npx vite-bundle-visualizer -o after.html

# 3. 检查 sourcemap 是否正常
# 特别是如果用了 Sentry / Datadog 等错误追踪

# 4. 确认依赖树已经没有 esbuild
npm ls esbuild 2>&1 | head -20
```

第四步不是必须的——依赖链中可能还有其他包依赖 esbuild。但如果 esbuild 从你的依赖树里消失了，说明迁移干净了。

## 博主实测：VitePress 迁移

这篇博客本身的构建速度变化：

```
Vite 6:  ~5.2s
Vite 8:  ~3.6s  ← 大约 30% 提升
```

小项目提升不如大项目明显（构建本身太小了），但 CI 上每次少等 1.5s，几十次提交下来也是时间。对于几百个模块的中大型项目，加速效果按数量级算。

## 踩坑记录

来自迁移了多个项目的经验：

### 1. Babel 从依赖树消失

`@vitejs/plugin-react` 从 v6 开始不再依赖 Babel。如果你的项目之前有 Babel 配置，迁移后 SSG/build 可能报错：

```
Error: Cannot find module '@babel/core'
```

解法：把相关依赖改为 `devDependencies`，或者直接删掉（如果你不需要 Babel）。

### 2. `build.rollupOptions` → `build.rolldownOptions`

大部分配置项名称不变（`output`、`plugins`、`external` 等），但以下选项需要调整：

```ts
// Vite 7
build: {
  rollupOptions: {
    output: { manualChunks: {...} }
  }
}

// Vite 8 — 名称不变，但 Rolldown 支持更细的 chunk 控制
build: {
  rolldownOptions: {
    output: { manualChunks: {...} }
  }
}
```

### 3. 自定义 esbuild 插件失效

如果你用了类似 `rollup-plugin-esbuild` 或自定义 esbuild transform 的插件：

```ts
// ❌ 不再工作
{
  esbuild: {
    define: { __VERSION__: '"1.0.0"' }
  }
}
```

迁移到 oxc：

```ts
// ✓ Vite 8 方式
{
  oxc: {
    define: { __VERSION__: '"1.0.0"' }
  }
}
```

### 4. 测试环境注意

如果 Vitest 版本不兼容 Vite 8，更新 Vitest：

```bash
npm install vitest@latest
```

Vitest 和 Vite 的版本需要匹配。

## 要不要迁移

| 项目类型 | 建议 |
|---------|------|
| 只用官方插件的新项目 | **立即迁移**，收益大风险低 |
| 使用主流插件的现有项目 | **立即迁移**，兼容性好 |
| 依赖大量自定义 esbuild 插件的项目 | **等插件迁移后再迁** |
| 维护中的大型项目（500+ 模块） | **渐进迁移**，先用 rolldown-vite 验证 |
| CI 构建耗时长（>5min）的项目 | **优先迁移**，构建收益最大 |

Vite 8 不是小版本迭代——它是 Vite 生态的"汇合点"。Rolldown 统一了开发和生产构建器，消除了长达数年的双线维护成本。更重要的是，这为未来打开了空间：全量打包模式、模块级持久缓存、Module Federation 原生支持，这些都是旧架构做不到的。

如果你的项目符合立即迁移的条件，现在就是最佳时机。
