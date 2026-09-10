---
title: "被 iOS 弹窗支配的恐惧——一次 H5 弹窗层级问题的排查与修复"
date: 2026-07-24
tags: ["iOS", "CSS", "H5", "uni-app", "踩坑记录"]
description: "线上工单流程弹出层被页面 fixed 元素挡住，深扒 iOS Safari 栈溢出的底层原理，MutationObserver + z-index 双管齐下搞定。"
---

# 被 iOS 弹窗支配的恐惧

## 先说现象

线上反馈：**iOS 上工单流程弹窗显示不全**——底部被切掉一块，点不到按钮。

复现场景：

| 设备 | 结果 |
|------|------|
| Android | 正常 |
| iOS 微信内置浏览器 | 弹窗底部被截断 |
| iOS Safari | 同上 |
| PC Chrome | 正常 |

弹窗用的是 uni-app 的 `u-popup` / `u-drawer` 组件（基于 uView UI），弹出的内容区域有 `scroll-view` 滚动列表。

核心报错：`Maximum call stack size exceeded`，查了后才确认是 **Safari 对 `max-height: 100%` 的解析问题**。

## 第一阶段：浮层被挡住

最开始，弹窗内容被页面上的导航条和筛选栏挡住了。查 CSS 发现 `u-drawer` / `u-modal` 的 `z-index` 只有 10090，但页面的固定 `header` 用了 `z-index: 999`——按理说弹窗还是更高，但 iOS 上 fixed 层级渲染有差异。

**修复：** 在 `App.vue` 覆盖全局 z-index：

```css
.u-drawer,
.u-modal,
uni-modal {
  z-index: 19999 !important;
}
```

这一步解决了「挡住」问题，但「底部截断」还在。

## 第二阶段：底部截断，排查定位

弹窗本身样式加了 `max-height: 90%`，在 Android 上正常工作，iOS 上却把弹窗撑满全屏，内容溢到屏幕外。

检查 DOM 发现绘制出来的 `.u-drawer` 的 `scrollHeight` 远超预期。

关键线索是控制台报错：

```
RangeError: Maximum call stack size exceeded
```

搜了一圈，这其实是个 Safari 的老坑：**当一个元素的 `max-height` 是百分比，且父容器的 `height` 不确定时，Safari 会重新进入布局计算循环，导致栈溢出。**

具体到我们的组件链：

```
视图区 → scroll-view → .u-drawer__content → ... → 内容（动态高度）
```

中间某个环节的 `height` 没有被明确定义，Safari 就会因为 `max-height: 100%` 反复计算，最终栈溢出、渲染错误。

## 第三阶段：柔性修复方案

### 方案 A：固定 scroll-view 高度（√ 采用）

最直接的办法是给弹窗里的 `scroll-view` 一个固定高度，而不是依赖百分比继承：

```css
scroll-view {
  max-height: 60vh;  /* 折中值，适配不同屏幕 */
}
```

这解决了大部分场景，但**不同流程的弹窗内容高度差异大**——有的只有几条数据，60vh 显得太空；有的很长，又不够用。

### 方案 B：MutationObserver + 动态 `max-height`（√ 最终方案）

考虑到不同弹窗、不同流程的内容量不可控，写死一个值显然不优雅。最终方案是：

**MutationObserver 监听内容高度变化 → 动态计算并设置 `max-height`。**

核心思路：

```javascript
// 监听弹窗 open
MutationObserver.observe(scrollContainer, {
  attributes: true,       // 监听 style/class 变化
  childList: true,        // 监听内容增减
  subtree: true,          // 深度监听
})

function adjustMaxHeight() {
  const viewportHeight = window.innerHeight
  const contentHeight = scrollContent.scrollHeight
  // 弹窗本身有 padding/header 占用约 200px，再多留 20px 安全边距
  const maxHeight = Math.min(contentHeight, viewportHeight - 220)
  scrollContainer.style.maxHeight = maxHeight + 'px'
}
```

关键细节：

1. **触发时机**：不能只在 DOM 变化时算，还需要在弹窗的 CSS 动画（transition）完成后触发——否则拿到的 `scrollHeight` 不对。所以加了 `setTimeout` 延迟 100ms。
2. **限制条件**：只在 iOS 上启用（`const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)`），Android 上不受影响，避免不必要的性能开销。
3. **备用方案**：如果 Observer 没来得及触发（极快速切换），还保留了 `max-height: 80vh` 托底。

**最终代码结构：**

```javascript
// related-to-me.vue + TodoTicketReport.vue

if (isIOS) {
  const observer = new MutationObserver(() => {
    clearTimeout(this.adjustTimer)
    this.adjustTimer = setTimeout(() => {
      const vh = window.innerHeight
      const sh = content.scrollHeight
      content.style.maxHeight = Math.min(sh, vh - 220) + 'px'
    }, 100)
  })
  observer.observe(scrollContainer, {
    attributes: true, childList: true, subtree: true
  })
}
```

## 第四阶段：overflow 清理

排查过程中还发现 `detail.vue` 里有一个前期遗留的 `overflow: hidden`——它会强制裁剪弹窗外层，让 iOS 下弹窗底部的阴影阴影消失。顺手去掉。

## 总结：时长与经验

整个修复过程分三波：

| 阶段 | 改动文件 | 耗时 |
|------|---------|------|
| z-index 提升 | `App.vue` | ~30 min |
| iOS 栈溢出 + MutationObserver | `related-to-me.vue`, `TodoTicketReport.vue` | ~2 天 |
| overflow 清理 | `detail.vue` | ~10 min |

### 几个教训

1. **不要相信 `max-height: 100%`**——在 Safari 的布局引擎里，这行代码就是一个栈溢出炸弹。在非标准文档流（弹窗、浮层、drawer）中尤其危险。
2. **MutationObserver + `vh` 是动态布局的银弹**——当 CSS 无法满足时，用 JS 算一次最靠谱。但要注意触发时机（CSS transition 完成后再读尺寸）。
3. **iOS 上 each 层级渲染不同**——`z-index` 在 Android 和 iOS Safari 的行为有差异，不要用 Android 调试 iOS 样式。
4. **输出日志**——排查过程中借助了 vconsole 来捕获 iOS 端的异常堆栈（`RangeError`），如果没有在移动端打出这个栈信息，可能还在盲目调 CSS。
