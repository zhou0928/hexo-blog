---
title: "ESLint + Prettier + Husky 配置全流程"
date: 2026-06-26
tags: ["工程化"]
description: "2026 年前端项目代码规范配置的完整流程，一行命令搞定 ESLint + Prettier + Husky + lint-staged。"
---

# ESLint + Prettier + Husky 配置全流程

代码规范配置这事儿，每个团队都要搞一次。整理一份 2026 年的标准方案。

## 方案选择

2026 年的推荐：用 `@antfu/eslint-config`，一套搞定 ESLint + Prettier。

如果不想用 antfu 的方案，传统方案也可以：

| 工具 | 作用 |
|------|------|
| ESLint | 代码质量检查 |
| Prettier | 代码格式化 |
| Husky | Git 钩子管理 |
| lint-staged | 暂存文件检查 |

## 方案一：antfu 一键配置（推荐）

```bash
pnpm add -D @antfu/eslint-config
```

```ts
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  stylistic: true,
})
```

完成。ESLint + Prettier 一套搞定，不需要额外配置。

## 方案二：传统配置

### 安装依赖

```bash
pnpm add -D eslint prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D husky lint-staged
```

### ESLint 配置

```js
// eslint.config.js
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vuePlugin from 'eslint-plugin-vue'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { parser: vuePlugin.parser },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
]
```

### Prettier 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Husky + lint-staged

```bash
pnpm exec husky init
```

```bash
# .husky/pre-commit
pnpm exec lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## IDE 配置

VS Code 安装扩展：

- ESLint
- Prettier

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 常见问题

1. **ESLint 和 Prettier 冲突** — 装 `eslint-config-prettier` 关闭冲突规则
2. **lint-staged 不触发** — 确认 `.husky/pre-commit` 有执行权限
3. **Vue 文件报错** — 确认 parser 设置为 vue parser
4. **TypeScript 报错** — 确认安装了 `@typescript-eslint/parser`
