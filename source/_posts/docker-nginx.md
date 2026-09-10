---
title: "Docker + Nginx 前端部署实战"
date: 2026-06-26
tags: ["工程化", "前端"]
description: "前端项目 Docker 化部署的完整流程，包含多阶段构建、Nginx 配置、HTTPS 证书。"
---

# Docker + Nginx 前端部署实战

前端项目部署用 Docker 的好处：环境一致、部署可重复、回滚方便。

## 多阶段构建 Dockerfile

```dockerfile
# 构建阶段
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

两阶段分离：构建用 Node，运行用 Nginx。最终镜像只有 20MB 左右。

## Nginx 配置

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1024;

    # 静态资源缓存（带 hash 的文件）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    # ... 其余配置同上
}

# HTTP 跳转 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

## Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/ssl
    restart: unless-stopped
```

## 常用命令

```bash
# 构建镜像
docker build -t my-frontend .

# 运行
docker run -d -p 80:80 my-frontend

# 查看日志
docker logs -f <container_id>

# 进入容器调试
docker exec -it <container_id> sh

# 清理旧镜像
docker image prune -f
```

## 性能优化

1. **镜像缓存** — 先 COPY package.json 再 RUN install，利用 Docker 层缓存
2. **.dockerignore** — 排除 node_modules、dist、.git
3. **Alpine 基础镜像** — 比 debian 小 10 倍
4. **多阶段构建** — 构建产物之外的东西都不进最终镜像

## 踩坑

1. **SPA 路由 404** — 必须配 `try_files $uri /index.html`
2. **时区问题** — Alpine 默认 UTC，需要 `apk add tzdata`
3. **静态资源路径** — 确保 `base` 配置和实际部署路径一致
