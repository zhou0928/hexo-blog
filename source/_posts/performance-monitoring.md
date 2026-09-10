---
title: "前端性能监控体系建设"
date: 2026-06-27
tags: ["性能优化", "工程化"]
description: "从前端埋点到性能分析的完整监控体系搭建方案，包含指标定义、数据采集、告警配置。"
---

# 前端性能监控体系建设

上线不是终点，知道线上跑得怎么样才是。

## 监控什么

### 核心指标（Web Vitals）

| 指标 | 含义 | 目标值 |
|------|------|--------|
| LCP | 最大内容绘制 | < 2.5s |
| FID | 首次输入延迟 | < 100ms |
| CLS | 累积布局偏移 | < 0.1 |
| FCP | 首次内容绘制 | < 1.8s |
| TTFB | 首字节时间 | < 800ms |

### 业务指标

- 页面加载时间
- API 请求耗时
- 错误率
- 用户行为路径

## 数据采集

### Performance API

```ts
function collectPerformance() {
  const paint = performance.getEntriesByType('paint')
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  return {
    // 基础指标
    ttfb: navigation.responseStart - navigation.requestStart,
    fcp: paint.find(e => e.name === 'first-contentful-paint')?.startTime,
    domReady: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    load: navigation.loadEventEnd - navigation.fetchStart,

    // 资源加载
    resources: performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      duration: r.duration,
      size: (r as PerformanceResourceTiming).transferSize,
    })),
  }
}

// 页面加载完成后上报
window.addEventListener('load', () => {
  setTimeout(() => {
    const data = collectPerformance()
    report('/api/performance', data)
  }, 1000)
})
```

### 错误监控

```ts
// 全局错误捕获
window.addEventListener('error', (e) => {
  report('/api/error', {
    type: 'runtime',
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack,
  })
})

// Promise 错误
window.addEventListener('unhandledrejection', (e) => {
  report('/api/error', {
    type: 'promise',
    message: e.reason?.message || String(e.reason),
    stack: e.reason?.stack,
  })
})

// Vue 错误
app.config.errorHandler = (err, instance, info) => {
  report('/api/error', {
    type: 'vue',
    message: err.message,
    stack: err.stack,
    info,
  })
}
```

## 数据上报

```ts
// 1px 图片上报（兼容性最好）
function report(url: string, data: any) {
  const img = new Image()
  img.src = `${url}?data=${encodeURIComponent(JSON.stringify(data))}`
}

// 或用 Beacon API（页面关闭时也能发送）
function reportBeacon(url: string, data: any) {
  navigator.sendBeacon(url, JSON.stringify(data))
}

// 页面离开时用 Beacon
window.addEventListener('pagehide', () => {
  reportBeacon('/api/performance', collectPerformance())
})
```

## 告警配置

```
指标超过阈值 → 企业微信/钉钉通知 → 24 小时内响应

LCP > 4s → P1 告警
错误率 > 5% → P1 告警
API 耗时 > 3s → P2 告警
```

## 看板搭建

一个基本的监控看板需要：

1. **实时大盘** — 当前在线用户、错误率、核心指标
2. **趋势图表** — 过去 7 天/30 天的指标变化
3. **错误列表** — 按频率排序的错误详情
4. **慢接口排行** — 耗时最长的 API

## 最小可行方案

如果不想从零搭建，直接用现成方案：

- **Sentry** — 错误监控
- **Web Vitals 库** — 一行代码采集核心指标
- **Google Analytics** — 用户行为分析

先用现成的跑起来，有定制需求再自建。
