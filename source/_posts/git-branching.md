---
title: "Git 分支策略：Git Flow vs Trunk Based"
date: 2026-06-26
tags: ["工程化"]
description: "两种主流 Git 分支策略的对比分析，以及我们团队从 Git Flow 迁移到 Trunk Based 的经验。"
---

# Git 分支策略：Git Flow vs Trunk Based

分支策略不是技术问题，是团队协作问题。选错了策略，代码合并的痛苦会持续整个项目周期。

## Git Flow

经典的五分支模型：

```
main ─────────────────────────────────────
  │                         ↑
develop ────────────────────┤
  │         ↑       ↑       │
  │ feature/xxx  feature/yyy │
  │         └───┬───┘       │
  │        release/1.0 ─────┘
  │         ↑
  │    hotfix/xxx ──────────→ main
```

- **main** — 生产分支
- **develop** — 开发分支
- **feature/** — 功能分支
- **release/** — 发布分支
- **hotfix/** — 紧急修复

### 适用场景

- 版本发布周期长（月级）
- 需要同时维护多个版本
- 团队大、流程重

## Trunk Based Development

主干开发，只有一个长期分支：

```
main ────●────●────●────●────●────●──→
          ↑    ↑    ↑    ↑
         feat feat feat feat
```

所有改动直接合入 main，用 Feature Flag 控制功能发布。

### 适用场景

- 持续部署（日级甚至更频繁）
- 团队小、迭代快
- CI/CD 成熟

## 我们团队的迁移

### 之前：Git Flow 的痛苦

- develop 和 main 经常冲突
- release 分支要 cherry-pick 很多 commit
- 功能合并后才发现冲突，返工成本高

### 之后：Trunk Based + Feature Flag

```ts
// Feature Flag 实现
const featureFlags = {
  NEW_DASHBOARD: import.meta.env.VITE_FF_NEW_DASHBOARD === 'true',
  DARK_MODE: localStorage.getItem('ff_dark_mode') === 'true',
}

function useFeature(flag: keyof typeof featureFlags): boolean {
  return featureFlags[flag] ?? false
}
```

```vue
<template>
  <NewDashboard v-if="useFeature('NEW_DASHBOARD')" />
  <OldDashboard v-else />
</template>
```

### 迁移效果

| 指标 | Git Flow | Trunk Based |
|------|----------|-------------|
| 合并冲突频率 | 每周 3-5 次 | 几乎为零 |
| 发布周期 | 2 周 | 随时 |
| 代码审查 | 合并到 develop 时 | 提交前 |
| 回滚速度 | 要 revert 多个 commit | 关闭 Feature Flag |

## 怎么选

- **10 人以上团队 + 月级发布** → Git Flow
- **10 人以下 + 持续部署** → Trunk Based
- **不确定** → 先用 Trunk Based，它是更现代的选择

## 核心原则

不管用哪种策略，有两条必须遵守：

1. **main 永远可部署** — 任何时候从 main 拉出来的代码都能上线
2. **小批量提交** — 大合并是冲突之源，越小越好
