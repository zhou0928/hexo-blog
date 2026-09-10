---
title: "qiankun 微前端实战：老项目不动，新功能用 Vue 3 怎么搞？"
date: 2026-06-30
tags: ["架构", "Vue", "前端"]
description: "从零到一搞懂 qiankun 微前端，包含核心概念、快速上手、任意老项目接入方案和生产部署指南"
---

# qiankun 微前端实战：老项目不动，新功能用 Vue 3 怎么搞？

你有没有遇到过这种场景：老项目是 jQuery、Vue 2 甚至 PHP 写的，代码不敢动，但新功能想用 Vue 3 开发。全部重构？太贵。继续用老技术？太累。

qiankun 就是来解决这个问题的：**让新旧技术栈共存，渐进式迁移**。

这篇文章从实际项目角度，讲清楚 qiankun 的核心概念、怎么接入任意老项目、怎么在生产环境跑起来。

<!-- more -->

## 什么是微前端

### 传统单体应用的问题

```
项目越来越大 → 构建慢、协作难、技术栈固化
```

具体表现：

| 问题 | 表现 |
|------|------|
| 协作冲突 | 多人改同一个仓库，Git 冲突不断 |
| 部署风险 | 改一个按钮，整个应用重新部署 |
| 技术锁定 | 老项目用 jQuery，想用 Vue 不行 |
| 构建缓慢 | 代码量大，打包要 10 分钟 |

### 微前端的思路

**把一个大应用拆成多个小应用，每个小应用独立开发、独立部署。**

```
┌─────────────────────────────────┐
│  主应用（基座）                   │
│  提供：导航、登录、权限           │
│                                 │
│  ┌─────────────┐ ┌───────────┐ │
│  │ 新功能子应用  │ │ 老项目子应用│ │
│  │ (Vue 3)     │ │ (任意技术栈)│ │
│  └─────────────┘ └───────────┘ │
└─────────────────────────────────┘
```

## qiankun 是什么

qiankun（乾坤）是阿里开源的微前端框架，基于 single-spa 封装。

**核心能力**：

1. **加载子应用** — 根据路由自动加载对应的子应用
2. **应用隔离** — JS 沙箱 + CSS 隔离，子应用互不干扰
3. **应用通信** — 主应用和子应用之间可以传数据
4. **生命周期管理** — 控制子应用的启动、挂载、卸载

**技术栈无关** — 不管老项目是 jQuery、Vue 2、React、Angular 还是原生 JS，都能接入。

## 核心概念

### 三个角色

```
主应用（基座）= 电影院（提供屏幕、座位、导航）
子应用 = 电影（独立制作，按需播放）
qiankun = 放映系统（决定什么时候放哪部电影）
```

### 核心 API

```javascript
import { registerMicroApps, start, initGlobalState } from 'qiankun';

// 1. 注册子应用
registerMicroApps([
  {
    name: 'old-app',           // 子应用名称（唯一标识）
    entry: '//localhost:8080', // 子应用地址
    container: '#container',   // 挂载到哪个 DOM
    activeRule: '/old',        // URL 匹配规则
  }
]);

// 2. 启动
start({ prefetch: true });

// 3. 通信（可选）
const actions = initGlobalState({ user: 'admin' });
```

### 生命周期函数

子应用必须导出三个函数：

```javascript
// 子应用的入口文件
export async function bootstrap() {
  // 首次加载时调用，只调用一次
  console.log('子应用启动');
}

export async function mount(props) {
  // 挂载时调用，每次激活都会调用
  // props.container 是主应用提供的挂载容器
  console.log('子应用挂载', props);
}

export async function unmount(props) {
  // 卸载时调用
  console.log('子应用卸载');
}
```

## 技术栈兼容性

qiankun 支持几乎所有前端框架：

| 框架 | 支持情况 | 接入难度 |
|------|---------|---------|
| Vue 3 | ✅ 完美支持 | 简单 |
| Vue 2 | ✅ 完美支持 | 简单 |
| React | ✅ 完美支持 | 简单 |
| Angular | ✅ 支持 | 中等 |
| jQuery / 原生 JS | ✅ 支持 | 简单 |
| Next.js / Nuxt.js | ⚠️ 部分支持 | 困难 |

**关键点**：不管老项目用什么技术栈，只要能独立访问、有 HTML 入口，就能接入。

## 快速上手：10 分钟跑通 demo

### 第一步：创建主应用（Vue 3）

```bash
mkdir qiankun-main && cd qiankun-main
npm create vite@latest . -- --template vue
npm install qiankun
npm run dev  # 启动在 5173 端口
```

**修改 `src/main.js`**：

```javascript
import { createApp } from 'vue'
import { registerMicroApps, start } from 'qiankun'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 注册子应用
registerMicroApps([
  {
    name: 'sub-app',
    entry: '//localhost:3001',  // 子应用地址
    container: '#sub-container',
    activeRule: '/sub',
  }
])

start({ prefetch: true })
```

**在页面中添加挂载容器**：

```vue
<!-- App.vue -->
<template>
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/sub">子应用</router-link>
  </nav>
  <div id="sub-container"></div>
</template>
```

### 第二步：创建子应用（Vue 3 示例）

```bash
mkdir sub-app && cd sub-app
npm create vite@latest . -- --template vue
npm run dev  # 启动在 3001 端口
```

**修改 `vite.config.js`**：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',  // 必须：允许跨域
    }
  },
  base: '//localhost:3001/',  // 必须：设置公共路径
})
```

**修改 `src/main.js`**：

```javascript
import { createApp } from 'vue'
import App from './App.vue'

let app = null

// 导出生命周期函数
export async function bootstrap() {
  console.log('子应用启动')
}

export async function mount(props) {
  app = createApp(App)
  app.mount(props.container.querySelector('#app'))
}

export async function unmount() {
  app.unmount()
  app = null
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  createApp(App).mount('#app')
}
```

### 第三步：启动测试

```bash
# 终端 1：启动主应用
cd qiankun-main && npm run dev

# 终端 2：启动子应用
cd sub-app && npm run dev
```

访问 `http://localhost:5173/sub`，就能看到子应用的内容了。

## 接入任意老项目（重点）

你的场景：**老项目不敢动，新功能用 Vue 3**。

### 推荐方案

**Vue 3 做主应用，老项目做子应用。**

原因：
- 老项目完全不用改代码
- 新功能直接在 Vue 3 主应用里写
- 老项目通过 qiankun 加载，慢慢迁移

### 老项目需要满足的条件

1. **能独立访问** — 单独访问老项目的 URL 能正常显示
2. **有 HTML 入口** — 有 index.html 或类似的入口文件

只要满足这两点，不管是什么技术栈都能接入。

### 方案一：老项目可以改代码（推荐）

如果老项目可以做一些小改动，接入最简单。

**webpack 配置**（以 Vue 2 为例）：

```javascript
// vue.config.js 或 webpack.config.js
module.exports = {
  output: {
    library: 'oldApp',           // 暴露为全局变量
    libraryTarget: 'umd',        // UMD 格式
    publicPath: '//localhost:8080/',  // 公共路径
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',  // 跨域头
    }
  }
}
```

**入口文件导出生命周期**：

```javascript
// main.js
let app = null

export async function bootstrap() {
  console.log('老项目启动')
}

export async function mount(props) {
  app = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(props.container.querySelector('#app'))
}

export async function unmount() {
  app.$destroy()
  app = null
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  new Vue({ router, store, render: h => h(App) }).$mount('#app')
}
```

### 方案二：老项目完全不改代码

如果老项目完全不想动，用 nginx 反向代理 + 主应用处理生命周期。

**nginx 配置**：

```nginx
location /old-app/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
    add_header Access-Control-Allow-Headers Content-Type;
    
    alias /var/www/old-app/;
    try_files $uri $uri/ /old-app/index.html?$query_string;
}
```

**主应用注册**：

```javascript
registerMicroApps([
  {
    name: 'old-app',
    entry: '//your-domain.com/old-app',
    container: '#sub-container',
    activeRule: '/old-app',
  }
])
```

这种方案下，老项目的生命周期由 qiankun 自动处理，不需要老项目导出任何代码。

### 不同技术栈的接入示例

**jQuery / 原生 JS**：

```javascript
// 老项目的入口 JS
export async function bootstrap() {
  console.log('jQuery 应用启动')
}

export async function mount(props) {
  // jQuery 初始化
  $(props.container.querySelector('#app')).html('<h1>老项目内容</h1>')
}

export async function unmount() {
  // 清理
  $('#app').empty()
}
```

**React**：

```javascript
// 老项目的入口
export async function mount(props) {
  ReactDOM.render(<App />, props.container.querySelector('#root'))
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.querySelector('#root'))
}
```

**Vue 2**：

```javascript
export async function mount(props) {
  new Vue({
    render: h => h(App)
  }).$mount(props.container.querySelector('#app'))
}

export async function unmount() {
  // Vue 2 需要手动销毁
}
```

## 应用通信

主应用和子应用之间需要共享数据，几种方案：

### 方案一：initGlobalState（推荐）

```javascript
// 主应用
import { initGlobalState } from 'qiankun'

const actions = initGlobalState({
  token: 'xxx',
  user: { name: 'admin', role: 'superadmin' }
})

// 监听变化
actions.onGlobalStateChange((state, prev) => {
  console.log('状态变化', state, prev)
})

// 修改状态
actions.setGlobalState({ user: { name: 'new-user' } })
```

```javascript
// 子应用
export async function mount(props) {
  // 监听主应用的状态变化
  props.onGlobalStateChange((state) => {
    console.log('收到主应用数据', state)
    // 更新本地状态
  })
  
  // 修改状态
  props.setGlobalState({ token: 'new-token' })
}
```

### 方案二：props 传递

```javascript
// 主应用
registerMicroApps([
  {
    name: 'old-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/old',
    props: {
      token: 'xxx',
      navigate: (path) => router.push(path)
    }
  }
])
```

### 方案三：Cookie 共享（最简单）

```javascript
// 主应用登录后设置 cookie
document.cookie = 'token=xxx; path=/; domain=.your-domain.com'

// 子应用自动携带 cookie（同域名下）
// 不需要额外配置
```

## 常见问题与解决

### 1. 子应用加载不出来

**原因**：跨域或配置错误

**解决**：
- 检查子应用是否设置了 `Access-Control-Allow-Origin: *`
- 检查 webpack/vite 是否配置了 `library` + `libraryTarget: 'umd'`
- 检查子应用是否导出了 `bootstrap`、`mount`、`unmount`

### 2. 样式冲突

**原因**：子应用的 CSS 污染了主应用

**解决**：

```javascript
// 主应用启动时开启 CSS 隔离
start({
  sandbox: {
    experimentalStyleIsolation: true  // 推荐
  }
})
```

开启后，子应用的样式会被自动加上作用域前缀：

```css
/* 原始 */
.title { color: red; }

/* 转换后 */
div[data-qiankun="old-app"] .title { color: red; }
```

### 3. 子应用路由 404

**原因**：路由 base 路径不对

**解决**：

```javascript
// 子应用的 router 配置
const router = createRouter({
  base: '/old-app/',  // 设置为子应用的激活路径
  history: createWebHistory(),
  routes: [...]
})
```

### 4. 刷新后白屏

**原因**：直接访问子应用 URL 时，主应用没加载

**解决**：nginx 配置 fallback

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 5. 子应用独立访问时报错

**原因**：独立运行时没有 qiankun 环境

**解决**：

```javascript
// 子应用入口
if (!window.__POWERED_BY_QIANKUN__) {
  // 独立运行，直接挂载
  createApp(App).mount('#app')
}
```

## 生产部署

### nginx 配置模板

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 主应用（Vue 3）
    location / {
        root /var/www/main-app/dist;
        try_files $uri $uri/ /index.html;
    }

    # 老项目子应用
    location /old-app/ {
        alias /var/www/old-app/;
        add_header Access-Control-Allow-Origin *;
        try_files $uri $uri/ /old-app/index.html?$query_string;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend-server;
    }
}
```

### 性能优化

```javascript
// 主应用：预加载子应用
start({
  prefetch: true,  // 浏览器空闲时预加载
})
```

**公共依赖提取**：

```javascript
// 子应用 webpack 配置
module.exports = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    axios: 'axios',
  }
}

// 主应用在 HTML 中引入 CDN
// <script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
```

## 什么时候该用 qiankun

### 适合用的场景

- ✅ 老项目改造，不想重写
- ✅ 多个独立系统需要统一入口
- ✅ 多团队协作，需要独立部署
- ✅ 技术栈迁移（Vue 2 → Vue 3）
- ✅ 公司有多个历史系统需要整合

### 不适合用的场景

- ❌ 小项目（<10 个页面）
- ❌ 初创项目（过早优化）
- ❌ 性能要求极高的场景
- ❌ 单人维护的项目

### 决策参考

```
需要整合多个系统？ ──是──→ 用 qiankun
       │
       否
       ↓
有遗留系统要改造？ ──是──→ 用 qiankun
       │
       否
       ↓
多团队协作？ ──────是──→ 用 qiankun
       │
       否
       ↓
    不需要，用单体应用
```

## 小结

- qiankun 是微前端框架，让新旧技术栈共存
- 核心概念：主应用、子应用、生命周期函数
- 老项目接入的最小条件：能独立访问、有 HTML 入口
- 推荐方案：Vue 3 做主应用，任意技术栈老项目做子应用
- CSS 隔离用 `experimentalStyleIsolation`
- 登录态共享用 Cookie 或 `initGlobalState`
- 先跑通 demo，再解决实际问题

---

**参考资源**：
- [qiankun 官方文档](https://qiankun.umijs.org/)
- [qiankun GitHub](https://github.com/umijs/qiankun)
- [qiankun 官方示例](https://github.com/umijs/qiankun/tree/master/examples)
