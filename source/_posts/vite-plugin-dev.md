---
title: "Vite 插件开发入门"
date: 2026-06-25
tags: ["前端"]
description: "Vite 插件开发入门教程，从简单到复杂，手把手教你写一个自定义 Vite 插件。"
---

# Vite 插件开发入门

Vite 插件本质上是 Rollup 插件的扩展，加了一些 Vite 特有的钩子。写插件没想象中那么难。

## 插件是什么

一个 Vite 插件就是一个返回对象的函数，对象里可以包含各种钩子：

```ts
// 一个最简单的 Vite 插件
function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code, id) {
      // 处理每个模块的代码
      return code
    }
  }
}
```

## 常用钩子

| 钩子 | 调用时机 | 典型用途 |
|------|---------|---------|
| `configResolved` | 配置解析完成 | 获取最终配置 |
| `transformIndexHtml` | 处理 index.html | 注入脚本、修改 HTML |
| `transform` | 转换每个模块 | 代码转换、编译 |
| `configureServer` | 开发服务器启动 | 注入中间件 |
| `closeBundle` | 构建完成 | 清理、上传 |

## 实战：自动注入全局样式插件

```ts
// vite-plugin-inject-css.ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export default function injectGlobalCss(): Plugin {
  const virtualModuleId = 'virtual:global-css'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-inject-css',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const cssPath = resolve(__dirname, 'src/styles/global.css')
        const css = readFileSync(cssPath, 'utf-8')
        return `export default ${JSON.stringify(css)}`
      }
    },

    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `<link rel="stylesheet" href="/src/styles/global.css" />\n</head>`
      )
    }
  }
}
```

### 使用

```ts
// vite.config.ts
import injectGlobalCss from './vite-plugin-inject-css'

export default defineConfig({
  plugins: [injectGlobalCss()]
})
```

## 实战：API Mock 插件

```ts
// vite-plugin-mock.ts
import type { Plugin, ResolvedConfig } from 'vite'

export default function mockApi(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'vite-plugin-mock',
    configResolved(resolved) { config = resolved },

    configureServer(server) {
      server.middlewares.use('/api/mock', (req, res) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        const data = {
          code: 200,
          data: { message: 'mock 数据' },
          path: url.pathname,
        }
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      })
    }
  }
}
```

## 调试插件

```bash
# 在插件代码里加 console.log
# 然后运行
DEBUG=vite:* pnpm dev
```

## 总结

Vite 插件开发的核心就是「在正确的时机做正确的事」。从一个简单的 `transform` 钩子开始，逐步扩展到需要的功能。
